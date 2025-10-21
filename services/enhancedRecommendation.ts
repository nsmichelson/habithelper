import { SimplifiedTip } from '../types/simplifiedTip';
import { UserProfile, DailyTip, TipAttempt } from '../types/tip';
import { CROSS_AREA_APPLICATIONS } from '../data/crossAreaStrategies';

/**
 * Enhanced Tip Recommendation Algorithm
 *
 * Incorporates the new quiz structure:
 * - Primary area and specific goals
 * - Things they love (preferences)
 * - Area-specific blockers
 * - Things they hate (avoid_approaches)
 * - Success vision
 * - Lifestyle factors
 */

interface EnhancedTipScore {
  tip: SimplifiedTip;
  score: number;
  reasons: string[];
  matchedPreferences: string[];
  addressedBlockers: string[];
  leveragedLoves: string[];
}

export class EnhancedRecommendationService {

  /**
   * Score tips based on how well they match user's loves/preferences
   * This is the KEY innovation - using what they enjoy to make tips appealing
   */
  private scorePreferenceAlignment(
    tip: SimplifiedTip,
    userProfile: any
  ): { score: number; matches: string[]; leveraged: string[] } {
    const userLoves = userProfile.preferences || [];
    const tipFeatures = tip.features || [];
    const tipInvolves = tip.involves || [];

    let score = 0;
    const matches: string[] = [];
    const leveraged: string[] = [];

    // Direct feature matches (e.g., tip involves "walking" and user loves "walking")
    for (const love of userLoves) {
      // Check if tip directly involves this activity
      if (tipFeatures.includes(love) || tipInvolves.includes(love)) {
        score += 0.3;
        matches.push(love);
      }

      // Check cross-area applications
      // E.g., user loves "restaurant_friends" and tip is about exercise
      if (CROSS_AREA_APPLICATIONS[love]) {
        const primaryArea = userProfile.primary_focus;
        const applications = CROSS_AREA_APPLICATIONS[love][primaryArea] || [];

        // Check if this tip matches any of the cross-applications
        for (const application of applications) {
          if (this.tipMatchesApplication(tip, application)) {
            score += 0.2;
            leveraged.push(`${love} → ${primaryArea}`);
            break;
          }
        }
      }
    }

    // Bonus for multiple preference matches
    if (matches.length >= 3) score += 0.2;
    if (matches.length >= 2) score += 0.1;

    return {
      score: Math.min(1, score),
      matches,
      leveraged
    };
  }

  /**
   * Score tips based on how well they address user's specific blockers
   */
  private scoreBlockerAddressing(
    tip: SimplifiedTip,
    userProfile: any
  ): { score: number; addressed: string[] } {
    const primaryArea = userProfile.primary_focus;
    const blockers = userProfile.specific_challenges?.[primaryArea] || [];

    let score = 0;
    const addressed: string[] = [];

    // Check if tip specifically addresses blockers
    for (const blocker of blockers) {
      // Check tip features and helps_with
      const tipHelps = tip.helps_with || [];

      // Map blockers to what would help
      const blockerSolutions = this.getBlockerSolutions(blocker);

      for (const solution of blockerSolutions) {
        if (tipHelps.includes(solution) || tip.features?.includes(solution)) {
          score += 0.25;
          addressed.push(blocker);
          break;
        }
      }
    }

    // Special handling for common blocker patterns
    if (blockers.includes('no_time') && tip.time === '0-5min') {
      score += 0.3;
      addressed.push('no_time');
    }

    if (blockers.includes('hate_gym') && !tip.where?.includes('gym')) {
      score += 0.2;
      addressed.push('hate_gym');
    }

    if (blockers.includes('hate_veggies') && tip.features?.includes('hidden_veggies')) {
      score += 0.3;
      addressed.push('hate_veggies');
    }

    if (blockers.includes('love_sweets') && tip.features?.includes('healthy_sweets')) {
      score += 0.3;
      addressed.push('love_sweets');
    }

    return {
      score: Math.min(1, score),
      addressed
    };
  }

  /**
   * Score tips based on avoidance preferences
   */
  private scoreAvoidanceCompliance(
    tip: SimplifiedTip,
    userProfile: any
  ): { score: number; violations: string[] } {
    const avoidList = userProfile.avoid_approaches || [];
    let score = 1; // Start at full score, deduct for violations
    const violations: string[] = [];

    for (const avoid of avoidList) {
      // Check if tip violates avoidance preferences
      if (avoid === 'counting' && tip.features?.includes('tracking')) {
        score -= 0.3;
        violations.push('counting');
      }

      if (avoid === 'gym' && tip.where?.includes('gym')) {
        score -= 0.5;
        violations.push('gym');
      }

      if (avoid === 'morning_routine' && tip.when?.includes('morning')) {
        score -= 0.3;
        violations.push('morning_routine');
      }

      if (avoid === 'meal_prep' && tip.features?.includes('meal_prep')) {
        score -= 0.4;
        violations.push('meal_prep');
      }

      if (avoid === 'meditation' && tip.mechanisms?.includes('mindfulness')) {
        score -= 0.3;
        violations.push('meditation');
      }

      if (avoid === 'complex_recipes' && tip.features?.includes('complex_cooking')) {
        score -= 0.4;
        violations.push('complex_recipes');
      }
    }

    return {
      score: Math.max(0, score),
      violations
    };
  }

  /**
   * Score based on lifestyle fit (chaos level, life role)
   */
  private scoreLifestyleFit(
    tip: SimplifiedTip,
    userProfile: any
  ): number {
    const lifestyle = userProfile.lifestyle || {};
    let score = 0.5; // Base score

    // Chaos level matching
    const chaosLevel = lifestyle.chaos_level;
    if (chaosLevel === 'very_structured' && tip.features?.includes('routine')) {
      score += 0.3;
    } else if (chaosLevel === 'total_chaos' && tip.features?.includes('flexible')) {
      score += 0.3;
    } else if (chaosLevel === 'flexible' && !tip.features?.includes('rigid')) {
      score += 0.2;
    }

    // Life role matching
    const lifeRole = lifestyle.life_role;
    if (lifeRole === 'parent_young' && tip.features?.includes('family_friendly')) {
      score += 0.3;
    } else if (lifeRole === 'shift_worker' && tip.features?.includes('anytime')) {
      score += 0.3;
    } else if (lifeRole === 'remote_worker' && tip.where?.includes('home')) {
      score += 0.2;
    } else if (lifeRole === 'student' && tip.cost === '$') {
      score += 0.2;
    }

    return Math.min(1, score);
  }

  /**
   * Main recommendation function with new scoring
   */
  public scoreAndRankTips(
    tips: SimplifiedTip[],
    userProfile: any,
    previousTips: DailyTip[] = [],
    attempts: TipAttempt[] = []
  ): EnhancedTipScore[] {
    const scores: EnhancedTipScore[] = [];

    for (const tip of tips) {
      let totalScore = 0;
      const reasons: string[] = [];

      // 1. Preference alignment (40% weight) - THIS IS KEY
      const prefScore = this.scorePreferenceAlignment(tip, userProfile);
      totalScore += prefScore.score * 40;
      if (prefScore.matches.length > 0) {
        reasons.push(`Uses activities you love: ${prefScore.matches.join(', ')}`);
      }
      if (prefScore.leveraged.length > 0) {
        reasons.push(`Cleverly combines: ${prefScore.leveraged.join(', ')}`);
      }

      // 2. Blocker addressing (30% weight)
      const blockerScore = this.scoreBlockerAddressing(tip, userProfile);
      totalScore += blockerScore.score * 30;
      if (blockerScore.addressed.length > 0) {
        reasons.push(`Addresses: ${blockerScore.addressed.join(', ')}`);
      }

      // 3. Goal alignment (20% weight)
      const goalScore = this.scoreGoalAlignment(tip, userProfile);
      totalScore += goalScore * 20;
      if (goalScore > 0) {
        reasons.push('Aligns with your goals');
      }

      // 4. Avoidance compliance (5% weight - mostly a filter)
      const avoidScore = this.scoreAvoidanceCompliance(tip, userProfile);
      totalScore += avoidScore.score * 5;
      if (avoidScore.violations.length > 0) {
        reasons.push(`⚠️ Includes: ${avoidScore.violations.join(', ')}`);
        totalScore *= 0.5; // Heavily penalize violations
      }

      // 5. Lifestyle fit (5% weight)
      const lifestyleScore = this.scoreLifestyleFit(tip, userProfile);
      totalScore += lifestyleScore * 5;
      if (lifestyleScore > 0.7) {
        reasons.push('Fits your lifestyle');
      }

      // Add novelty bonus for tips not tried recently
      const noveltyBonus = this.calculateNoveltyBonus(tip, previousTips, attempts);
      totalScore += noveltyBonus * 10;

      scores.push({
        tip,
        score: totalScore,
        reasons,
        matchedPreferences: prefScore.matches,
        addressedBlockers: blockerScore.addressed,
        leveragedLoves: prefScore.leveraged
      });
    }

    // Sort by score descending
    return scores.sort((a, b) => b.score - a.score);
  }

  // Helper methods

  private tipMatchesApplication(tip: SimplifiedTip, application: string): boolean {
    const appLower = application.toLowerCase();
    const summary = tip.summary.toLowerCase();
    const details = tip.details_md.toLowerCase();

    // Check if tip content relates to the application
    return summary.includes(appLower.slice(0, 10)) ||
           details.includes(appLower.slice(0, 15));
  }

  private getBlockerSolutions(blocker: string): string[] {
    const solutions: Record<string, string[]> = {
      'no_time': ['quick', 'efficient', '5_minutes', 'time_saving'],
      'hate_veggies': ['hidden_veggies', 'veggie_alternatives', 'tasty_veggies'],
      'love_sweets': ['healthy_sweets', 'sweet_alternatives', 'controlled_treats'],
      'stress_eating': ['stress_management', 'alternative_coping', 'mindful_eating'],
      'hate_gym': ['home_workout', 'outdoor_exercise', 'no_gym'],
      'no_energy': ['energy_boosting', 'gentle_movement', 'rest_focused'],
      'expensive': ['budget_friendly', 'free', 'low_cost'],
      'boring': ['fun', 'engaging', 'variety', 'gamified'],
      'no_motivation': ['easy_start', 'rewarding', 'social'],
      'racing_mind': ['calming', 'meditation', 'breathing'],
      'phone_addiction': ['phone_free', 'screen_alternatives'],
      'procrastination': ['tiny_tasks', 'immediate_action', 'accountability']
    };

    return solutions[blocker] || [];
  }

  private scoreGoalAlignment(tip: SimplifiedTip, userProfile: any): number {
    const userGoals = userProfile.goals || [];
    const tipGoals = tip.goals || [];

    if (userGoals.length === 0 || tipGoals.length === 0) return 0;

    const matches = tipGoals.filter(g => userGoals.includes(g)).length;
    return matches / Math.max(userGoals.length, tipGoals.length);
  }

  private calculateNoveltyBonus(
    tip: SimplifiedTip,
    previousTips: DailyTip[],
    attempts: TipAttempt[]
  ): number {
    // Check how recently this tip was shown
    const lastShown = previousTips.find(pt => pt.tip_id === tip.tip_id);
    if (!lastShown) return 1; // Never shown = full novelty

    const daysSinceShown = Math.floor(
      (Date.now() - new Date(lastShown.presented_date).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceShown < 7) return 0;
    if (daysSinceShown < 14) return 0.3;
    if (daysSinceShown < 30) return 0.6;
    return 0.8;
  }
}

/**
 * Example usage showing how the new algorithm works:
 *
 * User Profile:
 * - Primary focus: "eating"
 * - Goals: ["more_veggies", "less_sugar"]
 * - Preferences: ["restaurant_friends", "walking", "podcasts"]
 * - Blockers: ["hate_veggies", "love_sweets", "no_time"]
 * - Avoids: ["meal_prep", "counting"]
 *
 * High-scoring tips would be:
 * 1. "Walk to a new restaurant and try their veggie appetizers"
 *    - Leverages: restaurant_friends + walking
 *    - Addresses: hate_veggies (restaurant veggies often tastier)
 *    - Goals: more_veggies
 *
 * 2. "Listen to your favorite podcast only while grocery shopping for produce"
 *    - Leverages: podcasts + walking (in store)
 *    - Addresses: hate_veggies (makes it more enjoyable)
 *    - Goals: more_veggies
 *
 * 3. "Schedule a weekly sweet treat at your favorite coffee shop after a walk"
 *    - Leverages: walking + planned treats
 *    - Addresses: love_sweets (doesn't eliminate, just controls)
 *    - Goals: less_sugar (through control, not restriction)
 */