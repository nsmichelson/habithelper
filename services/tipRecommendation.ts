import { Tip, UserProfile, DailyTip, TipAttempt } from '../types/tip';
import { TIPS_DATABASE, getSafeTips } from '../data/tips';
import { RECOMMENDATION_CONFIG } from './recommendationConfig';

interface TipScore {
  tip: Tip;
  score: number;
  reasons: string[];
  // Internal sort keys used for deterministic, priority-aligned ordering
  _goalF1: number;
  _lifestyleFit: number;
}

// Pre-index tips for performance
const TIP_MAP = new Map(TIPS_DATABASE.map(t => [t.tip_id, t]));

// Time constants
const DAY_MS = 86_400_000;

export class TipRecommendationService {
  /**
   * Helper to safely convert to Date
   */
  private asDate(d: Date | string): Date {
    return d instanceof Date ? d : new Date(d);
  }

  /**
   * Helper to add reasons with deduplication and cap
   */
  private addReason(reasons: string[], reason: string, max: number = 5): void {
    if (reasons.length >= max) return;
    if (!reasons.includes(reason)) reasons.push(reason);
  }

  /**
   * Helper to clamp values between 0 and 1
   */
  private clamp01(x: number): number {
    return Math.max(0, Math.min(1, x));
  }

  /**
   * Compute goal alignment using F1 score (harmonic mean of precision and recall)
   * Supports weighted goals to reflect user priorities
   */
  private computeGoalAlignment(tip: Tip, userProfile: UserProfile) {
    const userGoals = userProfile.goals ?? [];
    const tipGoals = tip.goal_tags ?? [];
    const weights = userProfile.goal_weights ?? {};
    
    if (userGoals.length === 0 || tipGoals.length === 0) {
      return { f1: 0, matches: 0, precision: 0, recall: 0 };
    }
    
    // Calculate weighted matches and totals
    const totalUserWeight = userGoals.reduce((sum, g) => sum + (weights[g] ?? 1), 0);
    const matchedWeight = tipGoals
      .filter(g => userGoals.includes(g))
      .reduce((sum, g) => sum + (weights[g] ?? 1), 0);
    const matches = tipGoals.filter(g => userGoals.includes(g)).length;
    
    const precision = matches / tipGoals.length;  // How focused the tip is on their goals
    const recallWeighted = totalUserWeight ? matchedWeight / totalUserWeight : 0; // Weighted coverage
    const f1 = (precision + recallWeighted) ? (2 * precision * recallWeighted) / (precision + recallWeighted) : 0;
    
    return { f1, matches, precision, recall: recallWeighted };
  }

  /**
   * Compute composite lifestyle fit score
   * Combines multiple lifestyle factors into a single 0-1 score
   */
  private computeLifestyleFit(opts: {
    chaos: number;      // 0..1
    kitchen: number;    // 0..1
    cognitive: number;  // 0..1
    budget: number;     // 0..1
    timeOfDay: number;  // 0..1
  }) {
    // Internal weights sum ~1; tweak freely without touching global WEIGHTS
    const w = { 
      chaos: 0.30, 
      kitchen: 0.30, 
      cognitive: 0.20, 
      budget: 0.10, 
      time: 0.10 
    };
    
    const fit = (
      w.chaos * opts.chaos +
      w.kitchen * opts.kitchen +
      w.cognitive * opts.cognitive +
      w.budget * opts.budget +
      w.time * opts.timeOfDay
    );
    
    return this.clamp01(fit);
  }

  /**
   * Get the most recent attempt for a specific tip
   */
  private getLastAttemptForTip(tipId: string, attempts: TipAttempt[]): TipAttempt | undefined {
    let last: TipAttempt | undefined;
    for (const a of attempts) {
      if (a.tip_id !== tipId) continue;
      if (!last || this.asDate(a.created_at).getTime() > this.asDate(last.created_at).getTime()) {
        last = a;
      }
    }
    return last;
  }

  /**
   * Check if a tip is eligible to be shown (hard filters)
   * Returns true if tip passes all eligibility criteria
   */
  private isTipEligible(
    tip: Tip,
    userProfile: UserProfile,
    previousTips: DailyTip[],
    attempts: TipAttempt[],
    relaxedMode: boolean = false,
    nonRepeatOverride?: number // Allow explicit override for fallback
  ): { eligible: boolean; reason?: string } {
    const last = this.getLastAttemptForTip(tip.tip_id, attempts);

    // 1. Permanent opt-out (always strict)
    if (last?.feedback === 'not_for_me') {
      return { eligible: false, reason: 'User opted out permanently' };
    }

    // 2. Medical contraindications (ALWAYS strict - check early)
    const hasContraindication = tip.contraindications?.some(
      condition => userProfile.medical_conditions?.includes(condition)
    );
    if (hasContraindication) {
      return { eligible: false, reason: 'Medical contraindication' };
    }

    // 3. Allergen check (strict)
    const involvedFoods = tip.involves_foods ?? [];
    const userAllergies = userProfile.allergies ?? [];
    const hasAllergen = involvedFoods.some(food => {
      // Map tip foods to allergen categories
      if (food === 'dairy' || food === 'cheese') return userAllergies.includes('dairy');
      if (food === 'bread' || food === 'pasta') return userAllergies.includes('gluten');
      if (food === 'meat' && userAllergies.includes('meat')) return true;
      // Direct match for other foods
      return userAllergies.includes(food);
    });
    if (hasAllergen) {
      return { eligible: false, reason: 'Contains allergen' };
    }

    // 4. Dietary rules check (strict)
    const violatesDietaryRule = (userProfile.dietary_rules ?? []).some(rule => {
      switch (rule) {
        case 'vegetarian':
          return involvedFoods.some(f => ['meat', 'gelatin'].includes(f));
        case 'vegan':
          return involvedFoods.some(f => ['meat', 'dairy', 'cheese', 'eggs', 'honey'].includes(f));
        case 'halal':
          return involvedFoods.some(f => ['pork', 'alcohol'].includes(f));
        case 'kosher':
          return involvedFoods.some(f => ['pork', 'shellfish'].includes(f)) ||
                 (involvedFoods.includes('meat') && involvedFoods.includes('dairy'));
        case 'pescatarian':
          return involvedFoods.some(f => ['meat', 'poultry'].includes(f));
        case 'gluten_free':
          return involvedFoods.some(f => ['bread', 'pasta', 'gluten'].includes(f));
        case 'lactose_free':
          return involvedFoods.some(f => ['dairy', 'cheese', 'milk'].includes(f));
        default:
          return false;
      }
    });
    if (violatesDietaryRule) {
      return { eligible: false, reason: 'Violates dietary rules' };
    }

    // 5. Availability check - can the user do this today?
    if (!this.isAvailableNow(tip, userProfile)) {
      return { eligible: false, reason: 'Not doable today' };
    }

    // 6. Snooze handling (strict)
    if (last?.feedback === 'maybe_later') {
      const fallbackSnooze = new Date(
        this.asDate(last.created_at).getTime() + 
        RECOMMENDATION_CONFIG.DEFAULT_SNOOZE_DAYS * DAY_MS
      );
      const snoozeUntil = last.snooze_until ? this.asDate(last.snooze_until) : fallbackSnooze;

      if (new Date() < snoozeUntil) {
        return { eligible: false, reason: `Snoozed until ${snoozeUntil.toLocaleDateString()}` };
      }
      // Snooze expired → allow regardless of non-repeat window
      return { eligible: true, reason: 'Snooze expired' };
    }

    // 7. Non-repeat window
    const daysSinceShown = this.getDaysSinceLastShown(tip.tip_id, previousTips);
    if (daysSinceShown !== null) {
      const minDays = nonRepeatOverride ?? (relaxedMode 
        ? RECOMMENDATION_CONFIG.RELAXED_NON_REPEAT_DAYS 
        : RECOMMENDATION_CONFIG.HARD_NON_REPEAT_DAYS);
      
      if (daysSinceShown < minDays) {
        return { 
          eligible: false, 
          reason: `Shown ${daysSinceShown} days ago (min: ${minDays})` 
        };
      }
    }

    return { eligible: true };
  }

  /**
   * Check if tip has specific kitchen equipment requirement
   */
  private hasKitchenRequirement(tip: Tip, req: 'basic_stove' | 'full_kitchen' | 'blender' | 'instant_pot'): boolean {
    const eq = tip.kitchen_equipment;
    return Array.isArray(eq) ? eq.includes(req as any) : eq === req;
  }

  /**
   * Check if a tip is available to do today based on timing and context
   */
  private isAvailableNow(tip: Tip, userProfile: UserProfile, now = new Date()): boolean {
    const dow = now.getDay(); // 0=Sun..6=Sat
    const hour = now.getHours();
    const isWeekend = dow === 0 || dow === 6;

    // Check if weekend prep is required but it's not weekend
    if (tip.requires_advance_prep && tip.prep_timing === 'weekend_required' && !isWeekend) {
      return false;
    }

    // Too late in the day for planning-heavy tips
    if (tip.requires_planning && hour >= 21) {
      return false;
    }

    // Check context-specific availability
    if (userProfile.current_context) {
      // Travel/hotel context - no full kitchen
      if ((userProfile.current_context === 'travel' || userProfile.current_context === 'hotel') &&
          this.hasKitchenRequirement(tip, 'full_kitchen')) {
        return false;
      }
      
      // Busy period - only quick tips
      if (userProfile.current_context === 'busy_period' &&
          (tip.time_cost_enum === '15_60_min' || tip.time_cost_enum === '>60_min')) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get recent goal coverage counts for fairness balancing
   */
  private getRecentGoalCoverage(previousTips: DailyTip[], windowDays: number = 7): Record<string, number> {
    const cutoff = Date.now() - windowDays * DAY_MS;
    const recents = previousTips.filter(
      t => this.asDate(t.presented_date).getTime() >= cutoff
    );
    
    const goalCounts: Record<string, number> = {};
    for (const recent of recents) {
      const recentTip = TIP_MAP.get(recent.tip_id);
      if (!recentTip) continue;
      
      for (const goal of (recentTip.goal_tags ?? [])) {
        goalCounts[goal] = (goalCounts[goal] ?? 0) + 1;
      }
    }
    
    return goalCounts;
  }

  /**
   * Calculate topic diversity score using Jaccard similarity with decay
   */
  private calculateTopicDiversityScore(
    tip: Tip,
    previousTips: DailyTip[],
    windowDays: number = RECOMMENDATION_CONFIG.TOPIC_COOLDOWN_DAYS
  ): number {
    const cutoff = Date.now() - windowDays * DAY_MS;
    const recents = previousTips.filter(
      t => this.asDate(t.presented_date).getTime() >= cutoff
    );
    
    if (recents.length === 0) return 1;

    // Jaccard similarity helper
    const jaccardSimilarity = (a?: string[], b?: string[]): number => {
      const setA = new Set(a ?? []);
      const setB = new Set(b ?? []);
      if (setA.size === 0 && setB.size === 0) return 0;
      
      let intersection = 0;
      setA.forEach(x => { if (setB.has(x)) intersection++; });
      const union = setA.size + setB.size - intersection;
      return union === 0 ? 0 : intersection / union;
    };

    let totalSimilarity = 0;
    let totalWeight = 0;
    
    for (const recent of recents) {
      const recentTip = TIP_MAP.get(recent.tip_id);
      if (!recentTip) continue;

      const daysAgo = Math.max(0, Math.floor(
        (Date.now() - this.asDate(recent.presented_date).getTime()) / DAY_MS
      ));
      // Exponential decay: more recent = higher weight
      const decay = Math.exp(-daysAgo / (windowDays / 3));

      const simTypes = jaccardSimilarity(tip.tip_type, recentTip.tip_type);
      const simGoals = jaccardSimilarity(tip.goal_tags, recentTip.goal_tags);
      const simMechanisms = jaccardSimilarity(tip.motivational_mechanism, recentTip.motivational_mechanism);

      // Weighted similarity (types most important)
      const similarity = 0.5 * simTypes + 0.3 * simGoals + 0.2 * simMechanisms;
      totalSimilarity += decay * similarity;
      totalWeight += decay;
    }

    const avgSimilarity = totalWeight > 0 ? totalSimilarity / totalWeight : 0;
    return 1 - avgSimilarity; // Higher score = more different/fresh
  }

  /**
   * Calculate a relevance score for a tip based on user profile
   */
  private calculateTipScore(
    tip: Tip,
    userProfile: UserProfile,
    previousTips: DailyTip[],
    attempts: TipAttempt[],
    currentHour?: number
  ): TipScore {
    let score = 0;
    const reasons: string[] = [];

    // Recency penalty (for tips shown beyond the hard non-repeat window)
    const daysSinceShown = this.getDaysSinceLastShown(tip.tip_id, previousTips);
    if (daysSinceShown !== null && daysSinceShown >= RECOMMENDATION_CONFIG.HARD_NON_REPEAT_DAYS) {
      const recentDays = daysSinceShown - RECOMMENDATION_CONFIG.HARD_NON_REPEAT_DAYS;
      if (recentDays < RECOMMENDATION_CONFIG.RECENCY_PENALTY.COOLDOWN_DAYS) {
        const penalty = RECOMMENDATION_CONFIG.RECENCY_PENALTY.MAX_PENALTY * 
          (1 - recentDays / RECOMMENDATION_CONFIG.RECENCY_PENALTY.COOLDOWN_DAYS);
        score -= penalty;
        if (penalty > 0) {
          this.addReason(reasons, `Recently shown (${daysSinceShown} days ago)`);
        }
      }
    }

    // Time of day relevance (normalized 0-1)
    const timeScore = currentHour !== undefined ? this.calculateTimeOfDayMatch(tip, currentHour) : 0.5;
    if (timeScore > 0.8) this.addReason(reasons, 'Perfect timing');
    else if (timeScore > 0.5) this.addReason(reasons, 'Good timing');

    // Goal alignment using F1
    const { f1: goalF1, matches: goalMatches } = this.computeGoalAlignment(tip, userProfile);
    score += goalF1 * RECOMMENDATION_CONFIG.WEIGHTS.GOAL_ALIGNMENT;
    if (goalMatches > 0) this.addReason(reasons, `Aligns with ${goalMatches} goals`);

    // Difficulty preference (normalized 0-1)
    const learned = this.getUserDifficultyPreference(attempts); // 1..5
    const quizTarget = (() => {
      switch (userProfile.difficulty_preference) {
        case 'tiny_steps': return 1;
        case 'one_thing': return 2;
        case 'moderate': return 3;
        case 'adventurous': return 4;
        case 'all_in': return 5;
        default: return 2;
      }
    })();
    
    // Weight learned more when attempts are plenty
    const attemptsCount = attempts.length;
    const alpha = attemptsCount >= 8 ? 0.7 : attemptsCount >= 4 ? 0.5 : 0.3;
    const targetDifficulty = alpha * learned + (1 - alpha) * quizTarget;
    
    const difficultyDiff = Math.abs(tip.difficulty_tier - targetDifficulty);
    const difficultyScore = this.clamp01(1 - (difficultyDiff / 4));
    score += difficultyScore * RECOMMENDATION_CONFIG.WEIGHTS.DIFFICULTY_MATCH;
    if (difficultyScore > 0.7) {
      this.addReason(reasons, 'Matches comfort level');
    }

    // Life chaos (0..1)
    let chaosScore = 0.5;
    if (userProfile.life_stage?.includes('dumpster_fire') || 
        userProfile.life_stage?.includes('survival')) {
      if (tip.chaos_level_max && tip.chaos_level_max >= 4) {
        chaosScore = 1;
        this.addReason(reasons, 'Works in chaos');
      } else if (tip.time_cost_enum === '0_5_min' && tip.difficulty_tier <= 2) {
        chaosScore = 0.8;
        this.addReason(reasons, 'Quick & easy');
      }
      if (tip.impulse_friendly) {
        chaosScore = this.clamp01(chaosScore + 0.2);
      }
    } else if (userProfile.life_stage?.includes('zen')) {
      if (tip.difficulty_tier >= 3) {
        chaosScore = 0.7;
      }
    }

    // Eating personality match (normalized 0-1)
    const personalityScore = this.calculatePersonalityMatch(tip, userProfile);
    score += personalityScore * RECOMMENDATION_CONFIG.WEIGHTS.PERSONALITY_MATCH;
    if (personalityScore > 0.7) {
      this.addReason(reasons, 'Fits eating style');
    }

    // Non-negotiables check (penalty if conflicts)
    if (userProfile.non_negotiables && userProfile.non_negotiables.length > 0) {
      const conflictsWithNonNegotiables = this.checkNonNegotiableConflicts(tip, userProfile.non_negotiables);
      if (conflictsWithNonNegotiables) {
        score -= RECOMMENDATION_CONFIG.WEIGHTS.NON_NEGOTIABLES;
        this.addReason(reasons, '⚠️ May conflict');
      } else {
        score += RECOMMENDATION_CONFIG.WEIGHTS.NON_NEGOTIABLES * 0.3; // Small bonus
        this.addReason(reasons, 'Preserves favorites');
      }
    }

    // Budget match (0..1)
    let budgetScore = 0.5;
    if (userProfile.budget_conscious) {
      budgetScore = tip.money_cost_enum === '$' ? 1 : tip.money_cost_enum === '$$' ? 0.5 : 0;
      if (budgetScore >= 0.5) this.addReason(reasons, 'Budget-friendly');
    }

    // Biggest obstacle consideration (normalized 0-1)
    const obstacleScore = this.calculateObstacleMatch(tip, userProfile.biggest_obstacle);
    score += obstacleScore * RECOMMENDATION_CONFIG.WEIGHTS.OBSTACLE_MATCH;
    if (obstacleScore > 0.7) {
      this.addReason(reasons, 'Tackles main challenge');
    }

    // Success with similar tips (normalized 0-1)
    const similarSuccessScore = this.calculateSimilarTipSuccess(tip, attempts);
    score += similarSuccessScore * RECOMMENDATION_CONFIG.WEIGHTS.SUCCESS_HISTORY;
    if (similarSuccessScore > 0.7) {
      this.addReason(reasons, 'Similar worked before');
    }
    
    // Topic diversity (normalized 0-1)
    const diversityScore = this.calculateTopicDiversityScore(tip, previousTips);
    score += diversityScore * RECOMMENDATION_CONFIG.WEIGHTS.TOPIC_DIVERSITY;
    if (diversityScore < 0.3) {
      this.addReason(reasons, '⚠️ Similar to recent');
    } else if (diversityScore > 0.7) {
      this.addReason(reasons, 'Fresh approach');
    }
    
    // Weekly coverage fairness - favor under-served goals
    const weeklyGoalCounts = this.getRecentGoalCoverage(previousTips, 7);
    const tipGoalTags = tip.goal_tags ?? [];
    if (tipGoalTags.length > 0 && userProfile.goals && userProfile.goals.length > 0) {
      let fairnessBonus = 0;
      for (const goal of tipGoalTags) {
        if (userProfile.goals.includes(goal)) {
          const shown = weeklyGoalCounts[goal] ?? 0;
          // More shown = less bonus (cap at 3 shows per week)
          const goalFairness = Math.max(0, 1 - (shown / 3));
          fairnessBonus += goalFairness;
        }
      }
      if (tipGoalTags.length > 0) {
        fairnessBonus = fairnessBonus / tipGoalTags.length; // Average fairness
        score += fairnessBonus * RECOMMENDATION_CONFIG.WEIGHTS.TOPIC_DIVERSITY * 0.5;
        if (fairnessBonus > 0.7) {
          this.addReason(reasons, 'Addresses neglected goal');
        }
      }
    }
    
    // Vegetable approach for veggie-averse users
    if (userProfile.dietary_preferences?.includes('avoid') || 
        userProfile.dietary_preferences?.includes('hide_them')) {
      if (tip.veggie_intensity === 'heavy' || tip.veggie_strategy === 'front_and_center') {
        score -= RECOMMENDATION_CONFIG.WEIGHTS.VEGGIE_AVERSION;
        this.addReason(reasons, '⚠️ Heavy veggies');
      } else if (tip.veggie_intensity === 'hidden' || tip.veggie_strategy === 'disguised') {
        score += RECOMMENDATION_CONFIG.WEIGHTS.VEGGIE_AVERSION * 0.5;
        this.addReason(reasons, 'Sneaky veggies');
      }
    }
    
    // Family compatibility
    let familyScore = 0.5;
    if (userProfile.home_situation) {
      if (userProfile.home_situation.includes('picky_kids') && tip.kid_approved) {
        familyScore += 0.25;
        this.addReason(reasons, 'Kid-friendly');
      }
      if (userProfile.home_situation.includes('resistant_partner') && tip.partner_resistant_ok) {
        familyScore += 0.25;
        this.addReason(reasons, 'Partner-flexible');
      }
    }
    familyScore = this.clamp01(familyScore);
    score += familyScore * RECOMMENDATION_CONFIG.WEIGHTS.FAMILY_COMPAT;
    
    // Diet trauma considerations
    if (userProfile.dietary_preferences?.includes('history_yo_yo') || 
        userProfile.dietary_preferences?.includes('history_too_extreme')) {
      if (tip.diet_trauma_safe && !tip.feels_like_diet) {
        score += RECOMMENDATION_CONFIG.WEIGHTS.DIET_TRAUMA * 0.8;
        this.addReason(reasons, 'Gentle approach');
      } else if (tip.feels_like_diet) {
        score -= RECOMMENDATION_CONFIG.WEIGHTS.DIET_TRAUMA * 0.5;
      }
    }
    
    // Cognitive load (0..1)
    let cognitiveScore = 0.5;
    if (userProfile.dietary_preferences?.includes('history_overwhelmed')) {
      if (tip.cognitive_load && tip.cognitive_load <= 2) {
        cognitiveScore = 1;
        this.addReason(reasons, 'Simple');
      } else if (tip.cognitive_load && tip.cognitive_load >= 4) {
        cognitiveScore = 0;
      }
    }
    
    // Kitchen compatibility (0..1)
    let kitchenCompat = 1;
    const kitchenSkills = userProfile.quiz_responses?.find(r => r.questionId === 'kitchen_reality')?.value;
    const cookingInterest = userProfile.quiz_responses?.find(r => r.questionId === 'cooking_interest')?.value;
    
    if (kitchenSkills === 'microwave_master' || kitchenSkills === 'no_kitchen') {
      if (cookingInterest === 'no_interest' || cookingInterest === 'no_time') {
        // Penalize if cooking required
        if (tip.cooking_skill_required && 
            tip.cooking_skill_required !== 'none' && 
            tip.cooking_skill_required !== 'microwave') {
          kitchenCompat = 0;
        }
        // Penalize if stove/kitchen required
        if (this.hasKitchenRequirement(tip, 'basic_stove') || 
            this.hasKitchenRequirement(tip, 'full_kitchen')) {
          kitchenCompat = Math.min(kitchenCompat, 0.1);
        }
        // Penalize long and effortful kitchen tasks
        if ((tip.time_cost_enum === '15_60_min' || tip.time_cost_enum === '>60_min') && 
            (tip.physical_effort ?? 3) > 2) {
          kitchenCompat = Math.min(kitchenCompat, 0.2);
        }
      } else if (cookingInterest === 'curious') {
        if (['intermediate', 'advanced'].includes(tip.cooking_skill_required ?? 'none')) {
          kitchenCompat = 0.3;
        } else if (['microwave', 'basic'].includes(tip.cooking_skill_required ?? 'none')) {
          kitchenCompat = 0.8;
        }
      }
    }
    
    // Bonus for no-cook/microwave options
    if (['none', 'microwave'].includes(tip.cooking_skill_required ?? 'none')) {
      kitchenCompat = Math.max(kitchenCompat, 0.7);
    }
    
    kitchenCompat = this.clamp01(kitchenCompat);
    if (kitchenCompat >= 0.8) this.addReason(reasons, 'No cooking!');
    else if (kitchenCompat <= 0.2) this.addReason(reasons, '⚠️ Needs cooking');

    // --- Lifestyle composite (dominant) ---
    const lifestyleFit = this.computeLifestyleFit({
      chaos: chaosScore,
      kitchen: kitchenCompat,
      cognitive: cognitiveScore,
      budget: budgetScore,
      timeOfDay: timeScore,
    });
    score += lifestyleFit * RECOMMENDATION_CONFIG.WEIGHTS.LIFESTYLE_FIT;

    // Return with internal sort keys
    return { tip, score, reasons, _goalF1: goalF1, _lifestyleFit: lifestyleFit };
  }

  /**
   * Get user's preferred difficulty based on past attempts
   */
  private getUserDifficultyPreference(attempts: TipAttempt[]): number {
    const successfulAttempts = attempts.filter(a => 
      a.feedback === 'went_great' || a.feedback === 'went_ok'
    );
    
    if (successfulAttempts.length === 0) {
      return 2; // Default to easy-moderate
    }

    // Find average difficulty of successful attempts
    const difficulties = successfulAttempts.map(attempt => {
      const tip = TIP_MAP.get(attempt.tip_id);
      return tip?.difficulty_tier || 2;
    });

    const avgDifficulty = difficulties.reduce((a, b) => a + b, 0) / difficulties.length;
    
    // Slightly increase difficulty if user is consistently succeeding
    const successRate = successfulAttempts.length / attempts.length;
    if (successRate > 0.8 && avgDifficulty < 4) {
      return Math.min(5, avgDifficulty + 0.5);
    }
    
    return avgDifficulty;
  }

  /**
   * Calculate how well a tip matches the current time of day
   */
  private calculateTimeOfDayMatch(tip: Tip, currentHour: number): number {
    const tod = tip.time_of_day ?? []; // Guard against missing array
    const period = 
      currentHour >= 5 && currentHour < 12 ? 'morning' :
      currentHour >= 12 && currentHour < 17 ? 'afternoon' :
      currentHour >= 17 && currentHour < 21 ? 'evening' :
      'late_night';

    // Check if tip is appropriate for current time
    if (tod.includes(period as TimeOfDay)) {
      return 1; // Perfect match
    }

    // Check adjacent time periods (partial credit)
    const adjacentPeriods: Record<string, string[]> = {
      'morning': ['afternoon'],
      'afternoon': ['morning', 'evening'],
      'evening': ['afternoon', 'late_night'],
      'late_night': ['evening']
    };

    const adjacent = adjacentPeriods[period] ?? [];
    if (adjacent.some(p => tod.includes(p as TimeOfDay))) {
      return 0.5; // Partial match for adjacent periods
    }

    // Tips without specific time constraints are somewhat relevant
    if (tod.length === 0) {
      return 0.3;
    }

    return 0; // Not a good match for current time
  }

  /**
   * Check how many days since a tip was last shown
   */
  private getDaysSinceLastShown(tipId: string, previousTips: DailyTip[]): number | null {
    const lastShown = previousTips
      .filter(t => t.tip_id === tipId)
      .sort((a, b) => this.asDate(b.presented_date).getTime() - this.asDate(a.presented_date).getTime())[0];

    if (!lastShown) return null;

    const daysDiff = Math.floor(
      (Date.now() - this.asDate(lastShown.presented_date).getTime()) / DAY_MS
    );
    
    return daysDiff;
  }

  /**
   * Check if tip conflicts with non-negotiable foods
   */
  private checkNonNegotiableConflicts(tip: Tip, nonNegotiables: string[]): boolean {
    const text = `${tip.summary} ${tip.details_md}`.toLowerCase();
    let conflict = false;

    for (const food of nonNegotiables) {
      switch(food) {
        case 'chocolate':
          if (text.includes('no chocolate') || 
              text.includes('avoid chocolate') ||
              text.includes('skip dessert')) {
            conflict = true;
          }
          break;
        case 'coffee_drinks':
          if (text.includes('black coffee') || 
              text.includes('skip the latte')) {
            conflict = true;
          }
          break;
        case 'cheese':
          if (text.includes('no cheese') || 
              text.includes('skip cheese')) {
            conflict = true;
          }
          break;
        case 'soda': {
          const bans = text.includes('no soda') || text.includes('quit soda');
          const offersSwap = text.includes('sparkling water');
          if (bans && !offersSwap) {
            conflict = true;
          }
          break;
        }
        case 'bread_carbs':
          if (text.includes('no carbs') || 
              text.includes('avoid bread')) {
            conflict = true;
          }
          break;
      }
      if (conflict) break;
    }
    return conflict;
  }

  /**
   * Calculate personality match score
   */
  private calculatePersonalityMatch(tip: Tip, userProfile: UserProfile): number {
    if (!userProfile.eating_personality) return 0.5;
    
    let matchScore = 0.5; // neutral default
    
    // Use new helps_with dimension if available
    if (tip.helps_with && userProfile.eating_personality) {
      for (const challenge of userProfile.eating_personality) {
        if (tip.helps_with.includes(challenge as any)) {
          matchScore = Math.min(1, matchScore + 0.3);
        }
      }
    }
    
    // Check eating personality traits
    const personality = userProfile.eating_personality ?? [];
    if (personality.includes('grazer')) {
      if ((tip.cue_context ?? []).includes('snack_time')) {
        matchScore = Math.min(1, matchScore + 0.3);
      }
    }
    
    if (personality.includes('speed_eater')) {
      if ((tip.tip_type ?? []).includes('mindset_shift') && 
          tip.summary.toLowerCase().includes('slow')) {
        matchScore = Math.min(1, matchScore + 0.3);
      }
    }
    
    if (personality.includes('stress_eater')) {
      if ((tip.tip_type ?? []).includes('mood_regulation')) {
        matchScore = Math.min(1, matchScore + 0.3);
      }
    }
    
    if (personality.includes('night_owl')) {
      if ((tip.time_of_day ?? []).includes('late_night') || 
          tip.time_of_day?.includes('evening')) {
        matchScore = Math.min(1, matchScore + 0.2);
      }
    }
    
    if (personality.includes('picky')) {
      if (tip.difficulty_tier <= 2 && !(tip.tip_type ?? []).includes('novelty')) {
        matchScore = Math.min(1, matchScore + 0.2);
      }
      
      // Only penalize textures they actually dislike
      const dislikes = (userProfile.dietary_preferences ?? [])
        .filter(p => p.startsWith('dislike_texture:'))
        .map(p => p.split(':')[1]);
      
      if (tip.texture_profile && dislikes.length > 0) {
        if (dislikes.some(tex => tip.texture_profile?.includes(tex as any))) {
          matchScore = Math.max(0, matchScore - 0.2);
        }
      }
    }
    
    return Math.min(1, matchScore);
  }

  /**
   * Calculate how well tip addresses user's biggest obstacle
   */
  private calculateObstacleMatch(tip: Tip, obstacle?: string): number {
    if (!obstacle) return 0.5;
    
    switch(obstacle) {
      case 'no_time':
        if (tip.time_cost_enum === '0_5_min') return 1;
        if (tip.time_cost_enum === '5_15_min') return 0.7;
        return 0.3;
        
      case 'no_energy':
        if ((tip.motivational_mechanism ?? []).includes('energy_boost') && 
            tip.mental_effort <= 2) {
          return 1;
        }
        return 0.3;
        
      case 'no_willpower':
        if ((tip.tip_type ?? []).includes('environment_design') || 
            (tip.tip_type ?? []).includes('habit_stacking')) {
          return 1;
        }
        return 0.3;
        
      case 'emotional':
        if ((tip.tip_type ?? []).includes('mood_regulation') || 
            (tip.motivational_mechanism ?? []).includes('comfort')) {
          return 1;
        }
        return 0.3;
        
      case 'hate_cooking':
        if (tip.time_cost_enum === '0_5_min' && 
            tip.physical_effort === 1) {
          return 1;
        }
        return 0.2;
        
      case 'love_junk':
        if ((tip.tip_type ?? []).includes('healthy_swap') && 
            (tip.motivational_mechanism ?? []).includes('sensory')) {
          return 1;
        }
        return 0.4;
        
      case 'social_pressure':
        if (tip.social_mode === 'group' || 
            (tip.location_tags ?? []).includes('social_event')) {
          return 0.8;
        }
        return 0.4;
        
      default:
        return 0.5;
    }
  }

  /**
   * Calculate success rate with similar tips
   */
  private calculateSimilarTipSuccess(tip: Tip, attempts: TipAttempt[]): number {
    if (attempts.length === 0) return 0.5; // Neutral score

    const similarAttempts = attempts.filter(attempt => {
      const attemptedTip = TIP_MAP.get(attempt.tip_id);
      if (!attemptedTip) return false;

      // Check for overlap in tip types and mechanisms
      const tipTypes = tip.tip_type ?? [];
      const attemptedTypes = attemptedTip.tip_type ?? [];
      const typeOverlap = tipTypes.length > 0 && attemptedTypes.length > 0 ? 
        tipTypes.some(type => attemptedTypes.includes(type)) : false;
      
      const tipMechanisms = tip.motivational_mechanism ?? [];
      const attemptedMechanisms = attemptedTip.motivational_mechanism ?? [];
      const mechanismOverlap = tipMechanisms.length > 0 && attemptedMechanisms.length > 0 ? 
        tipMechanisms.some(mech => attemptedMechanisms.includes(mech)) : false;

      return typeOverlap || mechanismOverlap;
    });

    if (similarAttempts.length === 0) return 0.5;

    const successCount = similarAttempts.filter(a => 
      a.feedback === 'went_great' || a.feedback === 'went_ok'
    ).length;

    return successCount / similarAttempts.length;
  }

  /**
   * Get recommended tips for a user
   */
  public getRecommendations(
    userProfile: UserProfile,
    previousTips: DailyTip[] = [],
    attempts: TipAttempt[] = [],
    count: number = 3,
    currentHour?: number
  ): TipScore[] {
    // Use current hour if not provided
    const hour = currentHour !== undefined ? currentHour : new Date().getHours();
    
    // First, filter out unsafe tips based on medical conditions
    const safeTips = getSafeTips(userProfile.medical_conditions);

    // Stage A: Apply hard eligibility filtering
    let eligibleTips = safeTips.filter(tip => {
      const eligibility = this.isTipEligible(tip, userProfile, previousTips, attempts, false);
      if (!eligibility.eligible && __DEV__) {
        console.log(`Tip "${tip.summary}" ineligible: ${eligibility.reason}`);
      }
      return eligibility.eligible;
    });

    // Optional gate: if user has stated goals, require at least one goal match
    const requireGoalMatch = (userProfile.goals?.length ?? 0) > 0;
    if (requireGoalMatch) {
      const hasMatch = (t: Tip) => (t.goal_tags ?? []).some(g => userProfile.goals?.includes(g));
      const subset = eligibleTips.filter(hasMatch);
      if (subset.length >= RECOMMENDATION_CONFIG.MIN_CANDIDATES_THRESHOLD) {
        eligibleTips = subset;
      }
    }

    // Stage B: If not enough, relax to softer constraints
    if (eligibleTips.length < RECOMMENDATION_CONFIG.MIN_CANDIDATES_THRESHOLD) {
      console.log(`Only ${eligibleTips.length} eligible tips. Relaxing constraints...`);
      eligibleTips = safeTips.filter(tip => 
        this.isTipEligible(tip, userProfile, previousTips, attempts, true).eligible
      );
    }
    
    // Stage C: If still not enough, use minimum floor (but respect snoozes/opts/medical)
    if (eligibleTips.length < RECOMMENDATION_CONFIG.MIN_CANDIDATES_THRESHOLD) {
      console.log('Still insufficient tips. Using minimum floor...');
      eligibleTips = safeTips.filter(tip => 
        this.isTipEligible(
          tip, 
          userProfile, 
          previousTips, 
          attempts, 
          true, 
          RECOMMENDATION_CONFIG.MIN_NON_REPEAT_FLOOR
        ).eligible
      );
    }
    
    // Emergency fallback: Universal safe tips if still nothing eligible
    if (eligibleTips.length === 0) {
      console.warn('No eligible tips found. Using universal safe fallbacks.');
      // Filter for the most universally safe tips
      eligibleTips = safeTips.filter(tip => {
        // Only basic hydration, mindfulness, or very simple tips
        const isUniversal = (
          (tip.contraindications ?? []).length === 0 &&
          (tip.involves_foods ?? []).length === 0 &&
          tip.difficulty_tier <= 2 &&
          tip.time_cost_enum === '0_5_min' &&
          tip.money_cost_enum === '$' &&
          !tip.requires_planning &&
          !tip.requires_advance_prep
        );
        
        if (!isUniversal) return false;
        
        // Still check for permanent opt-outs
        const last = this.getLastAttemptForTip(tip.tip_id, attempts);
        return last?.feedback !== 'not_for_me';
      });
      
      if (eligibleTips.length === 0) {
        console.error('CRITICAL: No tips available, not even universal fallbacks');
      }
    }

    // Calculate scores for all eligible tips
    const scoredTips = eligibleTips.map(tip => 
      this.calculateTipScore(tip, userProfile, previousTips, attempts, hour)
    );

    // Lexicographic priority: goal F1, then lifestyle fit, then overall score, then id
    return scoredTips
      .sort((a, b) =>
        (b._goalF1 - a._goalF1) ||
        (b._lifestyleFit - a._lifestyleFit) ||
        (b.score - a.score) ||
        a.tip.tip_id.localeCompare(b.tip.tip_id)
      )
      .slice(0, count);
  }

  /**
   * Get a single daily tip recommendation
   */
  public getDailyTip(
    userProfile: UserProfile,
    previousTips: DailyTip[] = [],
    attempts: TipAttempt[] = [],
    currentHour?: number
  ): TipScore | null {
    const recommendations = this.getRecommendations(
      userProfile,
      previousTips,
      attempts,
      10, // Get more recommendations for debugging
      currentHour
    );

    // Debug logging for recommendation algorithm
    if (__DEV__) {
      console.log('=== TIP RECOMMENDATION ALGORITHM ===');
      console.log(`Previous tips shown: ${previousTips.length}`);
      
      // Log recently shown tips
      const recentTips = previousTips
        .sort((a, b) => this.asDate(b.presented_date).getTime() - this.asDate(a.presented_date).getTime())
        .slice(0, 7)
        .map(t => {
          const tip = TIP_MAP.get(t.tip_id);
          const daysAgo = Math.floor((Date.now() - this.asDate(t.presented_date).getTime()) / DAY_MS);
          return `  - ${tip?.summary || 'Unknown'} (${daysAgo} days ago)`;
        });
      
      if (recentTips.length > 0) {
        console.log('Recently shown tips:');
        recentTips.forEach(t => console.log(t));
      }
      console.log(`Current hour: ${currentHour || new Date().getHours()}`);
      console.log('Top 5 recommendations:');
      recommendations.slice(0, 5).forEach((item, index) => {
        console.log(`${index + 1}. ${item.tip.summary} (Score: ${item.score.toFixed(2)})`);
        console.log(`   F1: ${item._goalF1.toFixed(3)}, Lifestyle: ${item._lifestyleFit.toFixed(3)}`);
        console.log(`   Reasons: ${item.reasons.join(', ')}`);
        console.log(`   Goals: ${item.tip.goal_tags?.join(', ') || 'none'}`);
        console.log(`   Type: ${item.tip.tip_type?.join(', ') || 'none'}`);
        console.log(`   Time of day: ${item.tip.time_of_day?.join(', ') || 'any'}`);
      });
    }

    return recommendations[0] || null;
  }

  /**
   * Get tips that user previously liked and might want to try again
   */
  public getPreviouslyLikedTips(
    likedTipIds: string[],
    recentDays: number = 7
  ): Tip[] {
    // Note: recentDays parameter is kept for compatibility but not used
    // Could be enhanced with lastLikedAt tracking if needed
    return likedTipIds.map(id => TIP_MAP.get(id)).filter(Boolean) as Tip[];
  }
}

export default new TipRecommendationService();