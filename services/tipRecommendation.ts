import { Tip, UserProfile, DailyTip, TipAttempt } from '../types/tip';
import { TIPS_DATABASE, getSafeTips } from '../data/tips';
import { RECOMMENDATION_CONFIG } from './recommendationConfig';

interface TipScore {
  tip: Tip;
  score: number;
  reasons: string[];
}

// Pre-index tips for performance
const TIP_MAP = new Map(TIPS_DATABASE.map(t => [t.tip_id, t]));

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

    // 2. Snooze handling (always strict)
    if (last?.feedback === 'maybe_later') {
      const fallbackSnooze = new Date(
        this.asDate(last.created_at).getTime() + 
        RECOMMENDATION_CONFIG.DEFAULT_SNOOZE_DAYS * 86400000
      );
      const snoozeUntil = last.snooze_until ? this.asDate(last.snooze_until) : fallbackSnooze;

      if (new Date() < snoozeUntil) {
        return { eligible: false, reason: `Snoozed until ${snoozeUntil.toLocaleDateString()}` };
      }
      // Snooze expired → allow regardless of non-repeat window
      return { eligible: true, reason: 'Snooze expired' };
    }

    // 3. Non-repeat window
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

    // 4. Medical contraindications (always strict)
    const hasContraindication = tip.contraindications?.some(
      condition => userProfile.medical_conditions?.includes(condition)
    );
    if (hasContraindication) {
      return { eligible: false, reason: 'Medical contraindication' };
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
   * Calculate topic diversity score using Jaccard similarity with decay
   */
  private calculateTopicDiversityScore(
    tip: Tip,
    previousTips: DailyTip[],
    windowDays: number = RECOMMENDATION_CONFIG.TOPIC_COOLDOWN_DAYS
  ): number {
    const cutoff = Date.now() - windowDays * 86400000;
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
    if (currentHour !== undefined) {
      const timeScore = this.calculateTimeOfDayMatch(tip, currentHour);
      score += timeScore * RECOMMENDATION_CONFIG.WEIGHTS.TIME_OF_DAY;
      if (timeScore > 0.8) {
        this.addReason(reasons, 'Perfect timing for this tip');
      } else if (timeScore > 0.5) {
        this.addReason(reasons, 'Good time of day for this');
      }
    }

    // Goal alignment (normalized 0-1)
    const goalMatches = tip.goal_tags && userProfile.goals ? 
      tip.goal_tags.filter(tag => userProfile.goals.includes(tag)).length : 0;
    const goalScore = tip.goal_tags && tip.goal_tags.length > 0 ? 
      (goalMatches / tip.goal_tags.length) : 0;
    score += goalScore * RECOMMENDATION_CONFIG.WEIGHTS.GOAL_ALIGNMENT;
    if (goalMatches > 0) {
      this.addReason(reasons, `Aligns with ${goalMatches} of your goals`);
    }

    // Difficulty preference (normalized 0-1)
    let targetDifficulty = 2; // default
    if (userProfile.difficulty_preference) {
      switch(userProfile.difficulty_preference) {
        case 'tiny_steps': targetDifficulty = 1; break;
        case 'one_thing': targetDifficulty = 2; break;
        case 'moderate': targetDifficulty = 3; break;
        case 'adventurous': targetDifficulty = 4; break;
        case 'all_in': targetDifficulty = 5; break;
      }
    }
    const difficultyDiff = Math.abs(tip.difficulty_tier - targetDifficulty);
    const difficultyScore = Math.max(0, 1 - (difficultyDiff / 4)); // Normalize to 0-1
    score += difficultyScore * RECOMMENDATION_CONFIG.WEIGHTS.DIFFICULTY_MATCH;
    if (difficultyScore > 0.7) {
      this.addReason(reasons, 'Matches your comfort level');
    }

    // Life chaos adjustment (normalized 0-1)
    let chaosScore = 0.5; // neutral default
    if (userProfile.life_stage?.includes('dumpster_fire') || 
        userProfile.life_stage?.includes('survival')) {
      if (tip.chaos_level_max && tip.chaos_level_max >= 4) {
        chaosScore = 1;
        this.addReason(reasons, 'Works even in chaos mode');
      } else if (tip.time_cost_enum === '0_5_min' && tip.difficulty_tier <= 2) {
        chaosScore = 0.8;
        this.addReason(reasons, 'Quick & easy for your busy life');
      }
      if (tip.impulse_friendly) {
        chaosScore = Math.min(1, chaosScore + 0.2);
      }
    } else if (userProfile.life_stage?.includes('zen')) {
      if (tip.difficulty_tier >= 3) {
        chaosScore = 0.7;
      }
    }
    score += chaosScore * RECOMMENDATION_CONFIG.WEIGHTS.LIFE_CHAOS;

    // Eating personality match (normalized 0-1)
    const personalityScore = this.calculatePersonalityMatch(tip, userProfile);
    score += personalityScore * RECOMMENDATION_CONFIG.WEIGHTS.PERSONALITY_MATCH;
    if (personalityScore > 0.7) {
      this.addReason(reasons, 'Fits your eating style');
    }

    // Non-negotiables check (penalty if conflicts)
    if (userProfile.non_negotiables && userProfile.non_negotiables.length > 0) {
      const conflictsWithNonNegotiables = this.checkNonNegotiableConflicts(tip, userProfile.non_negotiables);
      if (conflictsWithNonNegotiables) {
        score -= RECOMMENDATION_CONFIG.WEIGHTS.NON_NEGOTIABLES;
        this.addReason(reasons, '⚠️ Might conflict with foods you love');
      } else {
        score += RECOMMENDATION_CONFIG.WEIGHTS.NON_NEGOTIABLES * 0.3; // Small bonus
        this.addReason(reasons, 'Works with your food preferences');
      }
    }

    // Budget match (normalized 0-1)
    let budgetScore = 0.5; // neutral default
    if (userProfile.budget_conscious) {
      budgetScore = tip.money_cost_enum === '$' ? 1 : 
                    tip.money_cost_enum === '$$' ? 0.5 : 0;
    }
    score += budgetScore * RECOMMENDATION_CONFIG.WEIGHTS.BUDGET;
    if (budgetScore >= 0.5 && userProfile.budget_conscious) {
      this.addReason(reasons, 'Budget-friendly');
    }

    // Biggest obstacle consideration (normalized 0-1)
    const obstacleScore = this.calculateObstacleMatch(tip, userProfile.biggest_obstacle);
    score += obstacleScore * RECOMMENDATION_CONFIG.WEIGHTS.OBSTACLE_MATCH;
    if (obstacleScore > 0.7) {
      this.addReason(reasons, 'Helps with your main challenge');
    }

    // Success with similar tips (normalized 0-1)
    const similarSuccessScore = this.calculateSimilarTipSuccess(tip, attempts);
    score += similarSuccessScore * RECOMMENDATION_CONFIG.WEIGHTS.SUCCESS_HISTORY;
    if (similarSuccessScore > 0.7) {
      this.addReason(reasons, 'Similar to tips that worked for you');
    }
    
    // Topic diversity (normalized 0-1)
    const diversityScore = this.calculateTopicDiversityScore(tip, previousTips);
    score += diversityScore * RECOMMENDATION_CONFIG.WEIGHTS.TOPIC_DIVERSITY;
    if (diversityScore < 0.3) {
      this.addReason(reasons, '⚠️ Similar to recent tips');
    } else if (diversityScore > 0.7) {
      this.addReason(reasons, 'Fresh approach');
    }
    
    // Vegetable approach for veggie-averse users
    if (userProfile.dietary_preferences?.includes('avoid') || 
        userProfile.dietary_preferences?.includes('hide_them')) {
      if (tip.veggie_intensity === 'heavy' || tip.veggie_strategy === 'front_and_center') {
        score -= RECOMMENDATION_CONFIG.WEIGHTS.VEGGIE_AVERSION;
        this.addReason(reasons, '⚠️ Heavy on vegetables');
      } else if (tip.veggie_intensity === 'hidden' || tip.veggie_strategy === 'disguised') {
        score += RECOMMENDATION_CONFIG.WEIGHTS.VEGGIE_AVERSION * 0.5;
        this.addReason(reasons, 'Sneaky veggie approach');
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
        this.addReason(reasons, 'Works even if partner not on board');
      }
    }
    score += familyScore * RECOMMENDATION_CONFIG.WEIGHTS.FAMILY_COMPAT;
    
    // Diet trauma considerations
    if (userProfile.dietary_preferences?.includes('history_yo_yo') || 
        userProfile.dietary_preferences?.includes('history_too_extreme')) {
      if (tip.diet_trauma_safe && !tip.feels_like_diet) {
        score += RECOMMENDATION_CONFIG.WEIGHTS.DIET_TRAUMA * 0.8;
        this.addReason(reasons, 'Gentle, sustainable approach');
      } else if (tip.feels_like_diet) {
        score -= RECOMMENDATION_CONFIG.WEIGHTS.DIET_TRAUMA * 0.5;
      }
    }
    
    // Cognitive load check for overwhelmed users
    if (userProfile.dietary_preferences?.includes('history_overwhelmed')) {
      if (tip.cognitive_load && tip.cognitive_load <= 2) {
        score += RECOMMENDATION_CONFIG.WEIGHTS.COGNITIVE_LOAD * 0.5;
        this.addReason(reasons, 'Simple and straightforward');
      } else if (tip.cognitive_load && tip.cognitive_load >= 4) {
        score -= RECOMMENDATION_CONFIG.WEIGHTS.COGNITIVE_LOAD * 0.5;
      }
    }
    
    // Kitchen compatibility (normalized 0-1)
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
    
    score += kitchenCompat * RECOMMENDATION_CONFIG.WEIGHTS.KITCHEN_COMPAT;
    if (kitchenCompat >= 0.8) {
      this.addReason(reasons, 'No cooking required!');
    } else if (kitchenCompat <= 0.2) {
      this.addReason(reasons, '⚠️ Requires cooking skills');
    }

    return { tip, score, reasons };
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
    // Define time periods
    const timePeriod = 
      currentHour >= 5 && currentHour < 12 ? 'morning' :
      currentHour >= 12 && currentHour < 17 ? 'afternoon' :
      currentHour >= 17 && currentHour < 21 ? 'evening' :
      'late_night';

    // Check if tip is appropriate for current time
    if (tip.time_of_day.includes(timePeriod)) {
      return 1; // Perfect match
    }

    // Check adjacent time periods (partial credit)
    const adjacentPeriods: Record<string, string[]> = {
      'morning': ['afternoon'],
      'afternoon': ['morning', 'evening'],
      'evening': ['afternoon', 'late_night'],
      'late_night': ['evening']
    };

    const adjacent = adjacentPeriods[timePeriod] || [];
    for (const period of adjacent) {
      if (tip.time_of_day.includes(period as any)) {
        return 0.5; // Partial match for adjacent periods
      }
    }

    // Tips without specific time constraints are somewhat relevant
    if (tip.time_of_day.length === 0) {
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
      (Date.now() - this.asDate(lastShown.presented_date).getTime()) / 86400000
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
    if (userProfile.eating_personality.includes('grazer')) {
      if (tip.cue_context?.includes('snack_time')) {
        matchScore = Math.min(1, matchScore + 0.3);
      }
    }
    
    if (userProfile.eating_personality.includes('speed_eater')) {
      if (tip.tip_type.includes('mindset_shift') && 
          tip.summary.toLowerCase().includes('slow')) {
        matchScore = Math.min(1, matchScore + 0.3);
      }
    }
    
    if (userProfile.eating_personality.includes('stress_eater')) {
      if (tip.tip_type.includes('mood_regulation')) {
        matchScore = Math.min(1, matchScore + 0.3);
      }
    }
    
    if (userProfile.eating_personality.includes('night_owl')) {
      if (tip.time_of_day.includes('late_night') || 
          tip.time_of_day.includes('evening')) {
        matchScore = Math.min(1, matchScore + 0.2);
      }
    }
    
    if (userProfile.eating_personality.includes('picky')) {
      if (tip.difficulty_tier <= 2 && !tip.tip_type.includes('novelty')) {
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
        if (tip.motivational_mechanism.includes('energy_boost') && 
            tip.mental_effort <= 2) {
          return 1;
        }
        return 0.3;
        
      case 'no_willpower':
        if (tip.tip_type.includes('environment_design') || 
            tip.tip_type.includes('habit_stacking')) {
          return 1;
        }
        return 0.3;
        
      case 'emotional':
        if (tip.tip_type.includes('mood_regulation') || 
            tip.motivational_mechanism.includes('comfort')) {
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
        if (tip.tip_type.includes('healthy_swap') && 
            tip.motivational_mechanism.includes('sensory')) {
          return 1;
        }
        return 0.4;
        
      case 'social_pressure':
        if (tip.social_mode === 'group' || 
            tip.location_tags.includes('social_event')) {
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
      const typeOverlap = tip.tip_type && attemptedTip.tip_type ? 
        tip.tip_type.some(type => attemptedTip.tip_type.includes(type)) : false;
      
      const mechanismOverlap = tip.motivational_mechanism && attemptedTip.motivational_mechanism ? 
        tip.motivational_mechanism.some(mech => attemptedTip.motivational_mechanism.includes(mech)) : false;

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

    // Calculate scores for all eligible tips
    const scoredTips = eligibleTips.map(tip => 
      this.calculateTipScore(tip, userProfile, previousTips, attempts, hour)
    );

    // Sort by score with deterministic tie-breaker
    return scoredTips
      .sort((a, b) => (b.score - a.score) || a.tip.tip_id.localeCompare(b.tip.tip_id))
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
          const daysAgo = Math.floor((Date.now() - this.asDate(t.presented_date).getTime()) / 86400000);
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
        console.log(`   Reasons: ${item.reasons.join(', ')}`);
        console.log(`   Goals: ${item.tip.goal_tags.join(', ')}`);
        console.log(`   Type: ${item.tip.tip_type.join(', ')}`);
        console.log(`   Time of day: ${item.tip.time_of_day.join(', ') || 'any'}`);
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