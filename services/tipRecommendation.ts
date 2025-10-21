import { SimplifiedTip } from '../types/simplifiedTip';
import { UserProfile, DailyTip, TipAttempt } from '../types/tip';
import { SIMPLIFIED_TIPS } from '../data/simplifiedTips';
import { RECOMMENDATION_CONFIG } from './recommendationConfig';

// Check if we're in development mode
const __DEV__ = process.env.NODE_ENV !== 'production';

// Type aliases for clarity
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'late_night';

interface TipScore {
  tip: SimplifiedTip;
  score: number;
  reasons: string[];
  // Internal sort keys used for deterministic, priority-aligned ordering
  _goalMatches: number;  // Number of user goals this tip addresses
  _goalMatchRatio: number;  // Percentage of user goals addressed
  _goalF1: number;  // F1 score for secondary sorting
  _lifestyleFit: number;
}

// Pre-index tips for performance
const TIP_MAP = new Map(SIMPLIFIED_TIPS.map(t => [t.tip_id, t]));

// Time constants
const DAY_MS = 86_400_000;

// Allergen mapping for comprehensive coverage
const ALLERGEN_MAP: Record<string, string> = {
  cheese: 'dairy',
  milk: 'dairy',
  yogurt: 'dairy',
  butter: 'dairy',
  cream: 'dairy',
  pasta: 'gluten',
  bread: 'gluten',
  wheat: 'gluten',
  barley: 'gluten',
  rye: 'gluten',
  flour: 'gluten',
  shrimp: 'shellfish',
  crab: 'shellfish',
  lobster: 'shellfish',
  oyster: 'shellfish',
  fish: 'fish',
  salmon: 'fish',
  tuna: 'fish',
  peanut: 'nuts',
  almond: 'nuts',
  walnut: 'nuts',
  cashew: 'nuts',
  pecan: 'nuts',
  pistachio: 'nuts',
  eggs: 'eggs',
  egg: 'eggs',
  soy: 'soy',
  tofu: 'soy',
  tempeh: 'soy',
  edamame: 'soy'
};

export class TipRecommendationService {
  // Core recommendation settings
  private WEIGHTS = RECOMMENDATION_CONFIG.WEIGHTS;
  private HARD_NON_REPEAT_DAYS = RECOMMENDATION_CONFIG.HARD_NON_REPEAT_DAYS;
  private RELAXED_NON_REPEAT_DAYS = RECOMMENDATION_CONFIG.RELAXED_NON_REPEAT_DAYS;
  private MIN_NON_REPEAT_FLOOR = RECOMMENDATION_CONFIG.MIN_NON_REPEAT_FLOOR;

  /**
   * Gets safe tips that don't have contraindications for user's medical conditions
   */
  public getSafeTips(userProfile: UserProfile): SimplifiedTip[] {
    const userConditions = userProfile.medical_conditions || [];

    return SIMPLIFIED_TIPS.filter(tip => {
      // If tip has no contraindications, it's safe for everyone
      if (!tip.contraindications || tip.contraindications.length === 0) {
        return true;
      }

      // Check if any of the user's conditions are contraindicated
      return !tip.contraindications.some(contra =>
        userConditions.some(condition =>
          contra.toLowerCase().includes(condition.toLowerCase())
        )
      );
    });
  }

  /**
   * Main recommendation function - finds best tips for user
   * @param userProfile User's profile with preferences and history
   * @param previousTips Already shown tips
   * @param attempts User's attempt history
   * @param currentTime Current time for time-of-day matching
   * @param relaxedMode Whether to relax certain filters for more options
   * @returns Sorted array of tip scores with recommendations
   */
  public async recommendTips(
    userProfile: UserProfile,
    previousTips: DailyTip[] = [],
    attempts: TipAttempt[] = [],
    currentTime?: Date,
    relaxedMode: boolean = false
  ): Promise<TipScore[]> {
    const safeTips = this.getSafeTips(userProfile);
    const scores: TipScore[] = [];
    const timeOfDay = this.getTimeOfDay(currentTime);

    for (const tip of safeTips) {
      const eligibility = this.isTipEligible(
        tip,
        userProfile,
        previousTips,
        attempts,
        relaxedMode
      );

      if (!eligibility.eligible) {
        if (__DEV__) {
          console.log(`Tip ${tip.summary} ineligible: ${eligibility.reason}`);
        }
        continue;
      }

      const score = this.calculateTipScore(
        tip,
        userProfile,
        previousTips,
        attempts,
        timeOfDay,
        relaxedMode
      );

      scores.push(score);
    }

    // Sort by composite priority
    return this.sortByPriority(scores);
  }

  /**
   * Compute goal alignment - prioritizing NUMBER of goals matched
   * Returns both raw matches and weighted scores
   */
  private computeGoalAlignment(tip: SimplifiedTip, userProfile: UserProfile) {
    const userGoals = userProfile.goals ?? [];
    const tipGoals = tip.goals ?? [];
    const weights = userProfile.goal_weights ?? {};

    if (userGoals.length === 0 || tipGoals.length === 0) {
      return { matches: 0, matchRatio: 0, f1: 0, precision: 0, recall: 0 };
    }

    // Calculate matches
    const matchedGoals = tipGoals.filter(g => userGoals.includes(g));
    const matches = matchedGoals.length;

    // Calculate match ratio (what % of user's goals does this tip address?)
    const matchRatio = matches / userGoals.length;

    // Calculate weighted matches for secondary scoring
    const totalUserWeight = userGoals.reduce((sum, g) => sum + (weights[g] ?? 1), 0);
    const matchedWeight = matchedGoals.reduce((sum, g) => sum + (weights[g] ?? 1), 0);

    // Still calculate F1 for secondary sorting
    const precision = matches / tipGoals.length;  // How focused the tip is on their goals
    const recallWeighted = totalUserWeight ? matchedWeight / totalUserWeight : 0; // Weighted coverage
    const f1 = (precision + recallWeighted) ? (2 * precision * recallWeighted) / (precision + recallWeighted) : 0;

    return { matches, matchRatio, f1, precision, recall: recallWeighted };
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
    tip: SimplifiedTip,
    userProfile: UserProfile,
    previousTips: DailyTip[],
    attempts: TipAttempt[],
    relaxedMode: boolean = false,
    nonRepeatOverride?: number,
    currentDate?: Date // Allow explicit override for fallback
  ): { eligible: boolean; reason?: string } {
    const last = this.getLastAttemptForTip(tip.tip_id, attempts);

    // 1. Permanent opt-out (always strict)
    if (last?.feedback === 'not_for_me') {
      const rejectionDetail = last.rejection_reason ? ` (${last.rejection_reason})` : '';
      return { eligible: false, reason: `User opted out${rejectionDetail}` };
    }

    // 2. Medical contraindications (ALWAYS strict - check early)
    const contraindications = tip.contraindications || [];
    const userConditions = userProfile.medical_conditions || [];

    if (contraindications.length > 0 && userConditions.length > 0) {
      for (const contra of contraindications) {
        if (typeof contra === 'string') {
          for (const condition of userConditions) {
            if (contra.toLowerCase().includes(condition.toLowerCase()) ||
                condition.toLowerCase().includes(contra.toLowerCase())) {
              return { eligible: false, reason: `Medical contraindication: ${condition}` };
            }
          }
        }
      }
    }

    // 3. Allergen check (ALWAYS strict)
    if (userProfile.allergies && userProfile.allergies.length > 0) {
      const tipFoods = tip.involves || [];

      for (const food of tipFoods) {
        const foodLower = food.toLowerCase();
        const foodAllergen = ALLERGEN_MAP[foodLower] || foodLower;

        for (const allergy of userProfile.allergies) {
          const allergyLower = allergy.toLowerCase();
          if (foodAllergen.includes(allergyLower) || allergyLower.includes(foodAllergen)) {
            return { eligible: false, reason: `Contains allergen: ${allergy}` };
          }
        }
      }
    }

    // 4. Dietary rules check (ALWAYS strict)
    if (userProfile.dietary_rules && userProfile.dietary_rules.length > 0) {
      const tipFoods = tip.involves || [];

      for (const rule of userProfile.dietary_rules) {
        if (rule === 'vegetarian' || rule === 'vegan') {
          const meatFoods = ['meat', 'chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon', 'tuna', 'shrimp'];
          for (const food of tipFoods) {
            if (meatFoods.some(m => food.toLowerCase().includes(m))) {
              return { eligible: false, reason: `Not compatible with ${rule} diet` };
            }
          }
        }

        if (rule === 'vegan') {
          const animalFoods = ['dairy', 'milk', 'cheese', 'yogurt', 'egg', 'honey'];
          for (const food of tipFoods) {
            if (animalFoods.some(a => food.toLowerCase().includes(a))) {
              return { eligible: false, reason: 'Not vegan' };
            }
          }
        }
      }
    }

    // 5. Non-repeat period check (can be relaxed)
    const nonRepeatDays = nonRepeatOverride ?? (relaxedMode ? this.RELAXED_NON_REPEAT_DAYS : this.HARD_NON_REPEAT_DAYS);
    const now = currentDate || new Date();
    const cutoff = now.getTime() - (nonRepeatDays * DAY_MS);

    for (const pt of previousTips) {
      if (pt.tip_id === tip.tip_id) {
        const presentedTime = this.asDate(pt.presented_date).getTime();
        if (presentedTime > cutoff) {
          if (!relaxedMode) {
            const daysAgo = Math.floor((now.getTime() - presentedTime) / DAY_MS);
            return { eligible: false, reason: `Recently shown (${daysAgo} days ago)` };
          }
        }
      }
    }

    // 6. Snooze check (can be relaxed)
    if (last?.feedback === 'maybe_later' && last.snooze_until) {
      const snoozeEnd = this.asDate(last.snooze_until);
      if (snoozeEnd.getTime() > now.getTime()) {
        if (!relaxedMode) {
          const daysLeft = Math.ceil((snoozeEnd.getTime() - now.getTime()) / DAY_MS);
          return { eligible: false, reason: `Snoozed for ${daysLeft} more days` };
        }
      }
    }

    return { eligible: true };
  }

  /**
   * Calculate comprehensive score for a tip
   */
  private calculateTipScore(
    tip: SimplifiedTip,
    userProfile: UserProfile,
    previousTips: DailyTip[],
    attempts: TipAttempt[],
    timeOfDay: TimeOfDay,
    relaxedMode: boolean = false
  ): TipScore {
    const reasons: string[] = [];
    let score = 0;

    // NEW: Preference-based scoring (if user has new quiz data)
    if (userProfile.preferences && userProfile.preferences.length > 0) {
      const prefScore = this.calculatePreferenceScore(tip, userProfile);
      score += prefScore.score * 30; // 30% weight for preferences
      if (prefScore.matches.length > 0) {
        reasons.push(`Uses: ${prefScore.matches.join(', ')}`);
      }
    }

    // NEW: Blocker addressing (if user has specific challenges)
    if (userProfile.specific_challenges) {
      const blockerScore = this.calculateBlockerScore(tip, userProfile);
      score += blockerScore.score * 20; // 20% weight for addressing blockers
      if (blockerScore.addressed.length > 0) {
        reasons.push(`Helps with: ${blockerScore.addressed.join(', ')}`);
      }
    }

    // 1. Goal alignment (adjusted weight if new data exists)
    const goalAlign = this.computeGoalAlignment(tip, userProfile);
    const goalWeight = userProfile.preferences ? 20 : this.WEIGHTS.GOAL_ALIGNMENT * 100;
    const goalScore = goalAlign.f1 * goalWeight;
    score += goalScore;

    if (goalAlign.matches > 0) {
      reasons.push(`Matches ${goalAlign.matches}/${userProfile.goals?.length ?? 0} goals`);
    }

    // 2. Effort matching (using simplified effort field)
    const effortScore = this.calculateEffortScore(tip, userProfile);
    score += effortScore * this.WEIGHTS.EFFORT_MATCH * 100;
    if (effortScore > 0.7) {
      reasons.push('Good effort match');
    }

    // 3. Time availability (using simplified time field)
    const timeScore = this.calculateTimeScore(tip, userProfile);
    score += timeScore * this.WEIGHTS.TIME_AVAILABLE * 100;
    if (timeScore > 0.8) {
      reasons.push('Fits time budget');
    }

    // 4. Time of day matching (using 'when' field)
    const todScore = this.calculateTimeOfDayScore(tip, timeOfDay);
    score += todScore * this.WEIGHTS.TIME_OF_DAY * 100;
    if (todScore > 0.8) {
      reasons.push(`Good for ${timeOfDay}`);
    }

    // 5. Success history
    const successScore = this.calculateSuccessScore(tip, attempts);
    score += successScore * this.WEIGHTS.SUCCESS_HISTORY * 100;
    if (successScore > 0.7) {
      reasons.push('Previously successful');
    }

    // 6. Novelty
    const noveltyScore = this.calculateNoveltyScore(tip, previousTips, attempts);
    score += noveltyScore * this.WEIGHTS.NOVELTY * 100;
    if (noveltyScore > 0.8) {
      reasons.push('Fresh option');
    }

    // 7. Difficulty progression
    const difficultyScore = this.calculateDifficultyScore(tip, attempts);
    score += difficultyScore * this.WEIGHTS.DIFFICULTY * 100;
    if (difficultyScore > 0.7) {
      reasons.push('Right difficulty');
    }

    // 8. Budget matching (using simplified cost field)
    const budgetScore = this.calculateBudgetScore(tip, userProfile);
    score += budgetScore * this.WEIGHTS.BUDGET_FIT * 100;

    // 9. Chaos compatibility (using features field)
    const chaosScore = this.calculateChaosScore(tip, userProfile);
    score += chaosScore * this.WEIGHTS.CHAOS_COMPATIBLE * 100;

    // 10. Kitchen/cooking compatibility (using requires field)
    const kitchenScore = this.calculateKitchenScore(tip, userProfile);
    score += kitchenScore * this.WEIGHTS.KITCHEN_SKILLS * 100;

    // Compute composite lifestyle fit
    const lifestyleFit = this.computeLifestyleFit({
      chaos: chaosScore,
      kitchen: kitchenScore,
      cognitive: effortScore,
      budget: budgetScore,
      timeOfDay: todScore
    });

    // Add bonus for high lifestyle fit
    if (lifestyleFit > 0.8) {
      score += 10;
      reasons.push('Great lifestyle fit');
    }

    return {
      tip,
      score: Math.round(score),
      reasons,
      _goalMatches: goalAlign.matches,
      _goalMatchRatio: goalAlign.matchRatio,
      _goalF1: goalAlign.f1,
      _lifestyleFit: lifestyleFit
    };
  }

  // Helper calculation functions updated for new structure

  private calculateEffortScore(tip: SimplifiedTip, userProfile: UserProfile): number {
    const userPref = userProfile.difficulty_preference?.toLowerCase() || 'easy';
    const tipEffort = tip.effort;

    const effortMap: Record<string, number> = {
      'minimal': 1,
      'low': 2,
      'medium': 3,
      'high': 4
    };

    const tipLevel = effortMap[tipEffort] || 2;

    if (userPref.includes('easy') || userPref.includes('simple')) {
      return tipLevel <= 2 ? 1.0 : tipLevel === 3 ? 0.5 : 0.2;
    }
    if (userPref.includes('moderate') || userPref.includes('medium')) {
      return tipLevel === 3 ? 1.0 : tipLevel === 2 ? 0.7 : 0.4;
    }
    if (userPref.includes('challenge') || userPref.includes('hard')) {
      return tipLevel >= 3 ? 1.0 : 0.5;
    }

    return 0.5; // Default neutral score
  }

  private calculateTimeScore(tip: SimplifiedTip, userProfile: UserProfile): number {
    const userTime = userProfile.cooking_time_available || 'minimal';
    const tipTime = tip.time;

    const timeMap: Record<string, number> = {
      '0-5min': 5,
      '5-15min': 15,
      '15-30min': 30,
      '30min+': 60
    };

    const tipMinutes = timeMap[tipTime] || 15;

    if (userTime === 'none') {
      return tipMinutes <= 5 ? 1.0 : tipMinutes <= 15 ? 0.3 : 0.1;
    }
    if (userTime === 'minimal') {
      return tipMinutes <= 15 ? 1.0 : tipMinutes <= 30 ? 0.5 : 0.2;
    }
    if (userTime === 'moderate') {
      return tipMinutes <= 30 ? 1.0 : 0.7;
    }
    if (userTime === 'plenty') {
      return 1.0; // Any time is fine
    }

    return 0.5;
  }

  private calculateTimeOfDayScore(tip: SimplifiedTip, timeOfDay: TimeOfDay): number {
    const tipTimes = tip.when || [];

    // If tip has no time restrictions, it's always good
    if (tipTimes.length === 0 || tipTimes.includes('any')) {
      return 1.0;
    }

    // Check if current time of day matches
    if (tipTimes.includes(timeOfDay)) {
      return 1.0;
    }

    // Check for related times
    if (timeOfDay === 'morning' && tipTimes.some(t => t.includes('breakfast') || t.includes('waking'))) {
      return 0.9;
    }
    if (timeOfDay === 'evening' && tipTimes.some(t => t.includes('dinner') || t.includes('night'))) {
      return 0.9;
    }

    return 0.3; // Not ideal time
  }

  private calculateBudgetScore(tip: SimplifiedTip, userProfile: UserProfile): number {
    const userBudget = userProfile.budget_conscious ?? false;
    const tipCost = tip.cost;

    if (!userBudget) {
      return 1.0; // Budget not a concern
    }

    // Budget conscious users prefer cheaper options
    if (tipCost === '$') return 1.0;
    if (tipCost === '$$') return 0.5;
    if (tipCost === '$$$') return 0.2;

    return 0.7; // Unknown cost
  }

  private calculateChaosScore(tip: SimplifiedTip, userProfile: UserProfile): number {
    // Check if tip is chaos-proof
    const features = tip.features || [];

    if (features.includes('chaos_proof')) {
      return 1.0;
    }

    if (features.includes('no_planning') || features.includes('impulse_friendly')) {
      return 0.8;
    }

    // Check user's life situation
    const userSituation = userProfile.home_situation || [];
    if (userSituation.includes('young_kids') || userSituation.includes('hectic')) {
      // Need chaos-compatible tips
      return features.includes('family_friendly') ? 0.7 : 0.4;
    }

    return 0.6; // Neutral
  }

  private calculateKitchenScore(tip: SimplifiedTip, userProfile: UserProfile): number {
    const requires = tip.requires || [];
    const userSkills = userProfile.cooking_time_available || 'minimal';

    // No requirements is always good
    if (requires.length === 0) {
      return 1.0;
    }

    // Check for cooking skill requirements
    const needsCooking = requires.some(r => r.includes('cooking'));

    if (userSkills === 'none' && needsCooking) {
      return 0.2;
    }

    // Check for equipment requirements
    const needsSpecialEquipment = requires.some(r =>
      r.includes('blender') || r.includes('instant_pot') || r.includes('air_fryer')
    );

    if (needsSpecialEquipment) {
      return 0.5; // Assume 50% chance they have it
    }

    return 0.8;
  }

  private calculateSuccessScore(tip: SimplifiedTip, attempts: TipAttempt[]): number {
    const tipAttempts = attempts.filter(a => a.tip_id === tip.tip_id);

    if (tipAttempts.length === 0) {
      return 0.5; // Neutral - never tried
    }

    const successful = tipAttempts.filter(a => a.feedback === 'went_great').length;
    const okay = tipAttempts.filter(a => a.feedback === 'went_ok').length;
    const total = tipAttempts.length;

    const successRate = (successful + okay * 0.5) / total;
    return successRate;
  }

  private calculateNoveltyScore(
    tip: SimplifiedTip,
    previousTips: DailyTip[],
    attempts: TipAttempt[]
  ): number {
    const tipAttempts = attempts.filter(a => a.tip_id === tip.tip_id);
    const previousShowings = previousTips.filter(p => p.tip_id === tip.tip_id);

    // Never shown or tried = maximum novelty
    if (tipAttempts.length === 0 && previousShowings.length === 0) {
      return 1.0;
    }

    // Calculate days since last exposure
    const now = new Date();
    let daysSinceLastExposure = Infinity;

    for (const prev of previousShowings) {
      const days = (now.getTime() - this.asDate(prev.presented_date).getTime()) / DAY_MS;
      daysSinceLastExposure = Math.min(daysSinceLastExposure, days);
    }

    for (const attempt of tipAttempts) {
      const days = (now.getTime() - this.asDate(attempt.created_at).getTime()) / DAY_MS;
      daysSinceLastExposure = Math.min(daysSinceLastExposure, days);
    }

    // Score based on recency
    if (daysSinceLastExposure > 30) return 0.9;
    if (daysSinceLastExposure > 14) return 0.7;
    if (daysSinceLastExposure > 7) return 0.5;
    if (daysSinceLastExposure > 3) return 0.3;

    return 0.1; // Very recently seen
  }

  private calculateDifficultyScore(tip: SimplifiedTip, attempts: TipAttempt[]): number {
    // Get average difficulty of successful attempts
    const successfulAttempts = attempts.filter(a =>
      a.feedback === 'went_great' || a.feedback === 'went_ok'
    );

    if (successfulAttempts.length === 0) {
      // No history - prefer easier tips
      return tip.difficulty <= 2 ? 1.0 : tip.difficulty === 3 ? 0.7 : 0.4;
    }

    // Calculate average difficulty of successful tips
    let totalDifficulty = 0;
    let count = 0;

    for (const attempt of successfulAttempts) {
      const attemptTip = TIP_MAP.get(attempt.tip_id);
      if (attemptTip) {
        totalDifficulty += attemptTip.difficulty;
        count++;
      }
    }

    if (count === 0) {
      return 0.5;
    }

    const avgDifficulty = totalDifficulty / count;

    // Prefer tips slightly above average difficulty (progression)
    const targetDifficulty = Math.min(avgDifficulty + 0.5, 5);
    const difference = Math.abs(tip.difficulty - targetDifficulty);

    if (difference < 0.5) return 1.0;
    if (difference < 1) return 0.8;
    if (difference < 2) return 0.5;

    return 0.3;
  }

  /**
   * Sort tips by composite priority
   */
  private sortByPriority(scores: TipScore[]): TipScore[] {
    return scores.sort((a, b) => {
      // 1. First by number of goal matches (more matches = better)
      if (a._goalMatches !== b._goalMatches) {
        return b._goalMatches - a._goalMatches;
      }

      // 2. Then by goal match ratio (higher coverage = better)
      if (Math.abs(a._goalMatchRatio - b._goalMatchRatio) > 0.1) {
        return b._goalMatchRatio - a._goalMatchRatio;
      }

      // 3. Then by F1 score for goal alignment quality
      if (Math.abs(a._goalF1 - b._goalF1) > 0.1) {
        return b._goalF1 - a._goalF1;
      }

      // 4. Then by lifestyle fit
      if (Math.abs(a._lifestyleFit - b._lifestyleFit) > 0.1) {
        return b._lifestyleFit - a._lifestyleFit;
      }

      // 5. Finally by total score
      return b.score - a.score;
    });
  }

  /**
   * NEW: Calculate preference-based score
   * Scores tips based on how well they match user's loved activities
   */
  private calculatePreferenceScore(
    tip: SimplifiedTip,
    userProfile: any
  ): { score: number; matches: string[] } {
    const userPrefs = userProfile.preferences || [];
    const tipFeatures = tip.features || [];
    const tipInvolves = tip.involves || [];

    let score = 0;
    const matches: string[] = [];

    // Check for direct matches
    for (const pref of userPrefs) {
      if (tipFeatures.includes(pref) || tipInvolves.includes(pref)) {
        score += 0.3;
        matches.push(pref);
      }

      // Check for related activities
      const related = this.getRelatedActivities(pref);
      for (const rel of related) {
        if (tipFeatures.includes(rel) || tipInvolves.includes(rel)) {
          score += 0.15;
          matches.push(`${pref}-related`);
          break;
        }
      }
    }

    // Bonus for multiple matches
    if (matches.length >= 3) score += 0.2;

    return {
      score: Math.min(1, score),
      matches: matches.slice(0, 3) // Limit to top 3 for readability
    };
  }

  /**
   * NEW: Calculate blocker-addressing score
   * Scores tips based on how well they address user's specific challenges
   */
  private calculateBlockerScore(
    tip: SimplifiedTip,
    userProfile: any
  ): { score: number; addressed: string[] } {
    const primaryArea = userProfile.primary_focus;
    const blockers = userProfile.specific_challenges?.[primaryArea] || [];

    let score = 0;
    const addressed: string[] = [];

    const tipHelps = tip.helps_with || [];
    const tipFeatures = tip.features || [];

    // Check specific blocker solutions
    for (const blocker of blockers) {
      // Quick wins for time blockers
      if (blocker === 'no_time' && tip.time === '0-5min') {
        score += 0.4;
        addressed.push('no_time');
      }

      // Avoiding triggers
      if (blocker === 'hate_gym' && !tip.where?.includes('gym')) {
        score += 0.2;
      }

      // Addressing specific food issues
      if (blocker === 'hate_veggies' && tipFeatures.includes('hidden_veggies')) {
        score += 0.4;
        addressed.push('hate_veggies');
      }

      if (blocker === 'love_sweets' && tipFeatures.includes('sweet_alternative')) {
        score += 0.3;
        addressed.push('love_sweets');
      }

      // Check if tip explicitly helps with this blocker
      if (tipHelps.includes(blocker)) {
        score += 0.3;
        addressed.push(blocker);
      }
    }

    return {
      score: Math.min(1, score),
      addressed: addressed.slice(0, 2)
    };
  }

  /**
   * NEW: Get related activities for preference matching
   */
  private getRelatedActivities(preference: string): string[] {
    const relations: Record<string, string[]> = {
      'restaurant_friends': ['social', 'dining', 'food_exploration'],
      'walking': ['movement', 'outdoor', 'gentle_exercise'],
      'dancing': ['music', 'movement', 'fun_exercise'],
      'podcasts_audiobooks': ['audio', 'learning', 'entertainment'],
      'cooking_experimenting': ['kitchen', 'creative', 'food_prep'],
      'nature_outdoors': ['outdoor', 'fresh_air', 'hiking'],
      'coffee_shops': ['social', 'work_space', 'treats'],
      'games_video': ['gaming', 'competition', 'entertainment'],
      'planning_organizing': ['structure', 'tracking', 'systems'],
      'spontaneous_adventures': ['flexible', 'variety', 'exploration']
    };

    return relations[preference] || [];
  }

  // Utility functions
  private getTimeOfDay(date?: Date): TimeOfDay {
    const d = date || new Date();
    const hour = d.getHours();

    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'late_night';
  }

  private asDate(d: Date | string | undefined): Date {
    if (!d) return new Date();
    if (typeof d === 'string') return new Date(d);
    return d;
  }

  private clamp01(value: number): number {
    return Math.max(0, Math.min(1, value));
  }

  /**
   * Get a specific tip by ID
   */
  public getTipById(tipId: string): SimplifiedTip | undefined {
    return TIP_MAP.get(tipId);
  }

  /**
   * Get multiple tips by IDs
   */
  public getTipsByIds(tipIds: string[]): SimplifiedTip[] {
    return tipIds.map(id => TIP_MAP.get(id)).filter(Boolean) as SimplifiedTip[];
  }

  /**
   * Search tips by keyword in summary or details
   */
  public searchTips(query: string, userProfile?: UserProfile): SimplifiedTip[] {
    const lowerQuery = query.toLowerCase();
    const tips = userProfile ? this.getSafeTips(userProfile) : SIMPLIFIED_TIPS;

    return tips.filter(tip =>
      tip.summary.toLowerCase().includes(lowerQuery) ||
      tip.details_md.toLowerCase().includes(lowerQuery) ||
      tip.goals.some(g => g.toLowerCase().includes(lowerQuery)) ||
      (tip.helps_with?.some(h => h.toLowerCase().includes(lowerQuery)) ?? false)
    );
  }

  /**
   * Get tips by area
   */
  public getTipsByArea(area: 'nutrition' | 'fitness' | 'organization' | 'relationships'): SimplifiedTip[] {
    return SIMPLIFIED_TIPS.filter(tip => tip.area === area);
  }
}

// Singleton instance
export const tipRecommendationService = new TipRecommendationService();