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
  // NEW: Detailed tracking for debugging
  _debugInfo?: {
    matchedPreferences: string[];  // e.g., ["restaurant_friends", "walking"]
    addressedBlockers: string[];   // e.g., ["hate_veggies", "no_time"]
    matchedGoals: string[];        // e.g., ["more_veggies", "less_sugar"]
    avoidedItems: string[];        // e.g., ["meal_prep", "counting"]
    scoreBreakdown: {
      preferences: { score: number; matched: string[] };
      blockers: { score: number; addressed: string[] };
      goals: { score: number; matched: string[] };
      avoidance: { score: number; violated: string[] };
      other: { [key: string]: number };
    };
  };
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
  private _hasLoggedNaNWarning = false;

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

    // Map primary focus to tip areas
    const areaMap: Record<string, string> = {
      'eating': 'nutrition',
      'nutrition': 'nutrition',  // Direct mapping for nutrition path
      'exercise': 'fitness',
      'fitness': 'fitness',      // Direct mapping for fitness path
      'sleeping': 'nutrition',   // Sleep tips are often in nutrition
      'productivity': 'organization',
      'effectiveness': 'organization',  // Effectiveness maps to organization area
      'mindset': 'relationships',       // Mindset tips often in relationships
      'relationships': 'relationships',
      'health': 'nutrition',     // Health path maps to nutrition
      'look_feel': 'nutrition',  // Look/feel path maps to nutrition
      'energy': 'nutrition'      // Energy tips are mostly nutrition-based
    };

    const userFocusArea = areaMap[userProfile.primary_focus || ''] || null;

    for (const tip of safeTips) {
      // AREA FILTER: Check if tip matches user's focus area
      // Tips can belong to multiple areas (e.g., meal prep is both nutrition and organization)
      const tipAreas = tip.areas || [tip.area]; // Use areas array if available, else single area
      const matchesUserArea = userFocusArea ? tipAreas.includes(userFocusArea) : true;

      if (!relaxedMode && userFocusArea && !matchesUserArea) {
        // For ALL areas, require goal matches for cross-area tips
        const userGoals = userProfile.goals ?? [];
        const tipGoals = tip.goals ?? [];
        const hasGoalMatch = tipGoals.some(g => userGoals.includes(g));

        // Skip cross-area tips that don't match ANY goals
        if (!hasGoalMatch) {
          if (__DEV__) {
            console.log(`Tip ${tip.summary} skipped: wrong area (${tip.area}) for ${userFocusArea} focus and no goal match`);
          }
          continue;
        }
        // If has goal match, allow it but it will get lower area score
      }

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

      // Check for goal match BEFORE scoring
      const userGoals = userProfile.goals ?? [];
      const tipGoals = tip.goals ?? [];
      const hasGoalMatch = tipGoals.some(g => userGoals.includes(g));

      // Skip tips with zero goal matches (unless user has no goals set)
      if (userGoals.length > 0 && !hasGoalMatch) {
        if (__DEV__) {
          console.log(`Tip ${tip.summary} skipped: no goal match`);
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
    const sortedScores = this.sortByPriority(scores);

    // FALLBACK: If we have too few recommendations, try again with relaxed area filtering
    if (!relaxedMode && sortedScores.length < 5) {
      if (__DEV__) {
        console.log(`Only found ${sortedScores.length} tips for ${userProfile.primary_focus}, trying relaxed area filtering`);
      }

      // Try again including cross-area tips
      const relaxedScores: TipScore[] = [];
      for (const tip of safeTips) {
        // Skip tips we already scored
        if (scores.some(s => s.tip.tip_id === tip.tip_id)) {
          continue;
        }

        const eligibility = this.isTipEligible(
          tip,
          userProfile,
          previousTips,
          attempts,
          relaxedMode
        );

        if (!eligibility.eligible) {
          continue;
        }

        // Check for goal match
        const userGoals = userProfile.goals ?? [];
        const tipGoals = tip.goals ?? [];
        const hasGoalMatch = tipGoals.some(g => userGoals.includes(g));

        // Skip tips with zero goal matches
        if (userGoals.length > 0 && !hasGoalMatch) {
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

        // Apply penalty for cross-area tips
        score.score *= 0.7; // 30% penalty for not being in primary area
        score.reasons.push('Cross-area tip');

        relaxedScores.push(score);
      }

      // Combine and re-sort all scores
      const allScores = [...sortedScores, ...relaxedScores];
      return this.sortByPriority(allScores);
    }

    return sortedScores;
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

    // Debug check for NaN issues
    if (!tip || !tip.tip_id) {
      console.warn('Invalid tip in calculateTipScore:', tip);
      return {
        tip,
        score: 0,
        reasons: ['Invalid tip'],
        _goalMatches: 0,
        _goalMatchRatio: 0,
        _goalF1: 0,
        _lifestyleFit: 0
      };
    }

    // Initialize debug info
    const debugInfo: TipScore['_debugInfo'] = {
      matchedPreferences: [],
      addressedBlockers: [],
      matchedGoals: [],
      avoidedItems: [],
      scoreBreakdown: {
        preferences: { score: 0, matched: [] },
        blockers: { score: 0, addressed: [] },
        goals: { score: 0, matched: [] },
        avoidance: { score: 0, violated: [] },
        other: {}
      }
    };

    // 1. AREA MATCHING - Major scoring factor (20-40 points)
    // Check if tip matches user's focus area (tips can have multiple areas)
    const areaMap: Record<string, string> = {
      'eating': 'nutrition',
      'nutrition': 'nutrition',
      'exercise': 'fitness',
      'fitness': 'fitness',
      'sleeping': 'nutrition',
      'productivity': 'organization',
      'effectiveness': 'organization',
      'mindset': 'relationships',
      'relationships': 'relationships',
      'health': 'nutrition',
      'look_feel': 'nutrition',
      'energy': 'nutrition'  // Energy tips are mostly nutrition-based
    };
    const userFocusArea = areaMap[userProfile.primary_focus || ''] || null;
    const tipAreas = tip.areas || [tip.area];

    let areaBonus = 0;
    if (userFocusArea) {
      if (tipAreas.includes(userFocusArea)) {
        // Primary area match: big bonus
        areaBonus = tip.area === userFocusArea ? 40 : 30; // Primary area gets 40, secondary gets 30
        reasons.push(`Perfect for ${userFocusArea} focus`);
      } else if (tipAreas.some(a => a === 'organization' && userFocusArea === 'nutrition')) {
        // Some cross-area synergies make sense (e.g., meal prep for nutrition focus)
        areaBonus = 20;
        reasons.push(`Supports ${userFocusArea} through ${tip.area}`);
      }
    }
    score += areaBonus;
    debugInfo.scoreBreakdown.area = { score: areaBonus };

    // 2. Goal alignment - HEAVILY prioritize multiple goal matches
    const goalAlign = this.computeGoalAlignment(tip, userProfile);
    // Exponential bonus for multiple goal matches:
    // 1 goal = 10 points, 2 goals = 30 points, 3 goals = 60 points, 4+ goals = 100 points
    let goalBonus = 0;
    if (goalAlign.matches === 1) {
      goalBonus = 10;
    } else if (goalAlign.matches === 2) {
      goalBonus = 30;
    } else if (goalAlign.matches === 3) {
      goalBonus = 60;
    } else if (goalAlign.matches >= 4) {
      goalBonus = 100;
    }
    score += goalBonus;

    // Track matched goals
    const matchedGoals = (tip.goals || []).filter(g => (userProfile.goals || []).includes(g));
    debugInfo.scoreBreakdown.goals = {
      score: goalBonus,
      matched: matchedGoals
    };
    debugInfo.matchedGoals = matchedGoals;

    if (goalAlign.matches > 0) {
      reasons.push(`Matches ${goalAlign.matches}/${userProfile.goals?.length ?? 0} goals`);
    }

    // 3. PREFERENCES - Important ranking factor (30% weight)
    if (userProfile.preferences && userProfile.preferences.length > 0) {
      const prefScore = this.calculatePreferenceScore(tip, userProfile);
      const prefPoints = prefScore.score * 30; // 30% weight for preferences
      score += prefPoints;

      debugInfo.scoreBreakdown.preferences = {
        score: prefPoints,
        matched: prefScore.matches
      };
      debugInfo.matchedPreferences = prefScore.matches;

      if (prefScore.matches.length > 0) {
        reasons.push(`Uses: ${prefScore.matches.join(', ')}`);
      }
    }

    // 4. BLOCKERS - Secondary ranking factor (20% weight)
    if (userProfile.specific_challenges) {
      const blockerScore = this.calculateBlockerScore(tip, userProfile);
      const blockerPoints = blockerScore.score * 20; // 20% weight for addressing blockers
      score += blockerPoints;

      debugInfo.scoreBreakdown.blockers = {
        score: blockerPoints,
        addressed: blockerScore.addressed
      };
      debugInfo.addressedBlockers = blockerScore.addressed;

      if (blockerScore.addressed.length > 0) {
        reasons.push(`Helps with: ${blockerScore.addressed.join(', ')}`);
      }
    }

    // 5. AVOIDANCE - Major penalty
    if (userProfile.avoid_approaches && userProfile.avoid_approaches.length > 0) {
      const avoidScore = this.calculateAvoidanceScore(tip, userProfile);
      if (avoidScore.violations.length > 0) {
        score *= (1 - avoidScore.penalty); // Apply penalty
        debugInfo.scoreBreakdown.avoidance = {
          score: -avoidScore.penalty * score,
          violated: avoidScore.violations
        };
        debugInfo.avoidedItems = avoidScore.violations;
        reasons.push(`Avoids: ${avoidScore.violations.join(', ')}`);
      }
    }

    // 6. Other factors (reduced weights - 20% total for all)
    // Effort matching (3%)
    const effortScore = this.calculateEffortScore(tip, userProfile);
    const effortPoints = effortScore * 3;
    score += effortPoints;
    if (effortScore > 0.7) {
      reasons.push('Good effort match');
    }

    // Time availability (3%)
    const timeScore = this.calculateTimeScore(tip, userProfile);
    const timePoints = timeScore * 3;
    score += timePoints;
    if (timeScore > 0.8) {
      reasons.push('Fits time budget');
    }

    // Time of day matching (2%)
    const todScore = this.calculateTimeOfDayScore(tip, timeOfDay);
    const todPoints = todScore * 2;
    score += todPoints;
    if (todScore > 0.8) {
      reasons.push(`Good for ${timeOfDay}`);
    }

    // Success history (5% - important feedback signal)
    const successScore = this.calculateSuccessScore(tip, attempts);
    const successPoints = successScore * 5;
    score += successPoints;
    if (successScore > 0.7) {
      reasons.push('Previously successful');
    }

    // Novelty (3%)
    const noveltyScore = this.calculateNoveltyScore(tip, previousTips, attempts);
    const noveltyPoints = noveltyScore * 3;
    score += noveltyPoints;
    if (noveltyScore > 0.8) {
      reasons.push('Fresh option');
    }

    // Difficulty progression (2%)
    const difficultyScore = this.calculateDifficultyScore(tip, attempts);
    const difficultyPoints = difficultyScore * 2;
    score += difficultyPoints;
    if (difficultyScore > 0.7) {
      reasons.push('Right difficulty');
    }

    // Budget matching (2%)
    const budgetScore = this.calculateBudgetScore(tip, userProfile);
    const budgetPoints = budgetScore * 2;
    score += budgetPoints;

    // Chaos compatibility (2%)
    const chaosScore = this.calculateChaosScore(tip, userProfile);
    const chaosPoints = chaosScore * 2;
    score += chaosPoints;

    // Kitchen/cooking compatibility (2%)
    const kitchenScore = this.calculateKitchenScore(tip, userProfile);
    const kitchenPoints = kitchenScore * 2;
    score += kitchenPoints;

    // Compute composite lifestyle fit
    const lifestyleFit = this.computeLifestyleFit({
      chaos: chaosScore,
      kitchen: kitchenScore,
      cognitive: effortScore,
      budget: budgetScore,
      timeOfDay: todScore
    });

    // Add small bonus for high lifestyle fit (4%)
    let lifestylePoints = 0;
    if (lifestyleFit > 0.8) {
      lifestylePoints = 4;
      score += lifestylePoints;
      reasons.push('Great lifestyle fit');
    }

    // Add other scores to debug info
    debugInfo.scoreBreakdown.other = {
      effort: effortPoints,
      time: timePoints,
      timeOfDay: todPoints,
      success: successPoints,
      novelty: noveltyPoints,
      difficulty: difficultyPoints,
      budget: budgetPoints,
      chaos: chaosPoints,
      kitchen: kitchenPoints,
      lifestyleFit: lifestylePoints
    };

    // Check for NaN before returning
    if (isNaN(score)) {
      // Only log once per session to avoid spam
      if (!this._hasLoggedNaNWarning) {
        console.warn('NaN scores detected - defaulting to 0. First example:', tip.summary);
        this._hasLoggedNaNWarning = true;
      }
      score = 0; // Default to 0 instead of NaN
    }

    return {
      tip,
      score: Math.round(score),
      reasons,
      _goalMatches: goalAlign.matches,
      _goalMatchRatio: goalAlign.matchRatio,
      _goalF1: goalAlign.f1,
      _lifestyleFit: lifestyleFit,
      _debugInfo: debugInfo  // Include debug info
    };
  }

  // Helper calculation functions updated for new structure

  private calculateEffortScore(tip: SimplifiedTip, userProfile: UserProfile): number {
    const userPref = userProfile.difficulty_preference?.toLowerCase() || 'easy';
    const tipEffort = tip.effort || 'medium';

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
    const tipTime = tip.time || '5-15min';

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
      // Handle NaN scores - put them at the end
      if (isNaN(a.score) && !isNaN(b.score)) return 1;
      if (!isNaN(a.score) && isNaN(b.score)) return -1;
      if (isNaN(a.score) && isNaN(b.score)) return 0;

      // Simply sort by total score now - preferences and blockers are already weighted heavily
      return (b.score || 0) - (a.score || 0);
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
   * NEW: Calculate avoidance score - penalize if tip includes things user wants to avoid
   */
  private calculateAvoidanceScore(
    tip: SimplifiedTip,
    userProfile: any
  ): { penalty: number; violations: string[] } {
    const avoidList = userProfile.avoid_approaches || [];
    let penalty = 0;
    const violations: string[] = [];

    for (const avoid of avoidList) {
      // Check various tip properties for violations
      if (avoid === 'gym' && tip.where?.includes('gym')) {
        penalty += 0.3;
        violations.push('gym');
      }
      if (avoid === 'meal_prep' && (tip.features?.includes('meal_prep') || tip.mechanisms?.includes('planning_ahead'))) {
        penalty += 0.2;
        violations.push('meal_prep');
      }
      if (avoid === 'counting' && (tip.features?.includes('tracking') || tip.features?.includes('counting'))) {
        penalty += 0.2;
        violations.push('counting');
      }
      if (avoid === 'morning_routine' && tip.when?.includes('morning')) {
        penalty += 0.2;
        violations.push('morning_routine');
      }
      if (avoid === 'meditation' && tip.mechanisms?.includes('mindfulness')) {
        penalty += 0.2;
        violations.push('meditation');
      }
      if (avoid === 'rigid_rules' && tip.features?.includes('strict')) {
        penalty += 0.2;
        violations.push('rigid_rules');
      }
    }

    return { penalty: Math.min(0.5, penalty), violations };
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