import { Tip, UserProfile, DailyTip, TipAttempt } from '../types/tip';
import { TIPS_DATABASE, getSafeTips } from '../data/tips';

interface TipScore {
  tip: Tip;
  score: number;
  reasons: string[];
}

export class TipRecommendationService {
  /**
   * Calculate a relevance score for a tip based on user profile
   */
  private calculateTipScore(
    tip: Tip,
    userProfile: UserProfile,
    previousTips: DailyTip[],
    attempts: TipAttempt[]
  ): TipScore {
    let score = 0;
    const reasons: string[] = [];

    // Goal alignment (weight: 40%)
    const goalMatches = tip.goal_tags.filter(tag => 
      userProfile.goals.includes(tag)
    ).length;
    const goalScore = (goalMatches / tip.goal_tags.length) * 40;
    score += goalScore;
    if (goalMatches > 0) {
      reasons.push(`Aligns with ${goalMatches} of your goals`);
    }

    // Difficulty preference (weight: 20%)
    const difficultyPreference = this.getUserDifficultyPreference(attempts);
    const difficultyDiff = Math.abs(tip.difficulty_tier - difficultyPreference);
    const difficultyScore = Math.max(0, 20 - (difficultyDiff * 5));
    score += difficultyScore;

    // Time availability match (weight: 15%)
    if (userProfile.cooking_time_available) {
      const timeScore = this.calculateTimeMatch(tip, userProfile.cooking_time_available);
      score += timeScore * 15;
      if (timeScore > 0.5) {
        reasons.push('Fits your available time');
      }
    }

    // Budget match (weight: 10%)
    if (userProfile.budget_conscious) {
      const budgetScore = tip.money_cost_enum === '$' ? 10 : 
                          tip.money_cost_enum === '$$' ? 5 : 0;
      score += budgetScore;
      if (budgetScore >= 5) {
        reasons.push('Budget-friendly');
      }
    }

    // Novelty - hasn't been shown recently (weight: 10%)
    const daysSinceShown = this.getDaysSinceLastShown(tip.tip_id, previousTips);
    if (daysSinceShown === null || daysSinceShown > 7) {
      score += 10;
      reasons.push('Fresh suggestion');
    } else if (daysSinceShown > 3) {
      score += 5;
    }

    // Success with similar tips (weight: 5%)
    const similarSuccessScore = this.calculateSimilarTipSuccess(tip, attempts);
    score += similarSuccessScore * 5;
    if (similarSuccessScore > 0.5) {
      reasons.push('Similar to tips that worked for you');
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
      const tip = TIPS_DATABASE.find(t => t.tip_id === attempt.tip_id);
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
   * Calculate how well a tip matches user's time availability
   */
  private calculateTimeMatch(tip: Tip, availability: string): number {
    const timeMap = {
      'none': ['0_5_min'],
      'minimal': ['0_5_min', '5_15_min'],
      'moderate': ['0_5_min', '5_15_min', '15_60_min'],
      'plenty': ['0_5_min', '5_15_min', '15_60_min', '>60_min']
    };

    const acceptableTimes = timeMap[availability as keyof typeof timeMap] || [];
    return acceptableTimes.includes(tip.time_cost_enum) ? 1 : 0;
  }

  /**
   * Check how many days since a tip was last shown
   */
  private getDaysSinceLastShown(tipId: string, previousTips: DailyTip[]): number | null {
    const lastShown = previousTips
      .filter(t => t.tip_id === tipId)
      .sort((a, b) => b.presented_date.getTime() - a.presented_date.getTime())[0];

    if (!lastShown) return null;

    const daysDiff = Math.floor(
      (Date.now() - lastShown.presented_date.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysDiff;
  }

  /**
   * Calculate success rate with similar tips
   */
  private calculateSimilarTipSuccess(tip: Tip, attempts: TipAttempt[]): number {
    if (attempts.length === 0) return 0.5; // Neutral score

    const similarAttempts = attempts.filter(attempt => {
      const attemptedTip = TIPS_DATABASE.find(t => t.tip_id === attempt.tip_id);
      if (!attemptedTip) return false;

      // Check for overlap in tip types and mechanisms
      const typeOverlap = tip.tip_type.some(type => 
        attemptedTip.tip_type.includes(type)
      );
      const mechanismOverlap = tip.motivational_mechanism.some(mech => 
        attemptedTip.motivational_mechanism.includes(mech)
      );

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
    count: number = 3
  ): TipScore[] {
    // First, filter out unsafe tips based on medical conditions
    const safeTips = getSafeTips(userProfile.medical_conditions);

    // Calculate scores for all safe tips
    const scoredTips = safeTips.map(tip => 
      this.calculateTipScore(tip, userProfile, previousTips, attempts)
    );

    // Sort by score and return top recommendations
    return scoredTips
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  /**
   * Get a single daily tip recommendation
   */
  public getDailyTip(
    userProfile: UserProfile,
    previousTips: DailyTip[] = [],
    attempts: TipAttempt[] = []
  ): TipScore | null {
    const recommendations = this.getRecommendations(
      userProfile,
      previousTips,
      attempts,
      1
    );

    return recommendations[0] || null;
  }

  /**
   * Get tips that user previously liked and might want to try again
   */
  public getPreviouslyLikedTips(
    likedTipIds: string[],
    recentDays: number = 7
  ): Tip[] {
    return TIPS_DATABASE.filter(tip => likedTipIds.includes(tip.tip_id));
  }
}

export default new TipRecommendationService();