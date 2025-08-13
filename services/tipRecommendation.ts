import { Tip, UserProfile, DailyTip, TipAttempt } from '../types/tip';
import { TIPS_DATABASE, getSafeTips } from '../data/tips';
import { RECOMMENDATION_CONFIG } from './recommendationConfig';

interface TipScore {
  tip: Tip;
  score: number;
  reasons: string[];
}

export class TipRecommendationService {
  /**
   * Check if a tip is eligible to be shown (hard filters)
   * Returns true if tip passes all eligibility criteria
   */
  private isTipEligible(
    tip: Tip,
    userProfile: UserProfile,
    previousTips: DailyTip[],
    attempts: TipAttempt[],
    relaxedMode: boolean = false
  ): { eligible: boolean; reason?: string } {
    // 1. Check for permanent opt-out (not_for_me)
    const permanentOptOut = attempts.find(
      a => a.tip_id === tip.tip_id && a.feedback === 'not_for_me'
    );
    if (permanentOptOut) {
      return { eligible: false, reason: 'User opted out permanently' };
    }

    // 2. Check for active snooze
    const snoozedAttempt = attempts.find(
      a => a.tip_id === tip.tip_id && 
      a.feedback === 'maybe_later' && 
      a.snooze_until
    );
    if (snoozedAttempt?.snooze_until) {
      const snoozeUntil = new Date(snoozedAttempt.snooze_until);
      if (snoozeUntil > new Date()) {
        return { eligible: false, reason: `Snoozed until ${snoozeUntil.toLocaleDateString()}` };
      }
    }

    // 3. Check non-repeat window
    const daysSinceShown = this.getDaysSinceLastShown(tip.tip_id, previousTips);
    if (daysSinceShown !== null) {
      const minDays = relaxedMode 
        ? RECOMMENDATION_CONFIG.RELAXED_NON_REPEAT_DAYS 
        : RECOMMENDATION_CONFIG.HARD_NON_REPEAT_DAYS;
      
      if (daysSinceShown < minDays) {
        return { 
          eligible: false, 
          reason: `Shown ${daysSinceShown} days ago (min: ${minDays})` 
        };
      }
    }

    // 4. Check medical contraindications (always strict)
    const hasContraindication = tip.contraindications?.some(
      condition => userProfile.medical_conditions?.includes(condition)
    );
    if (hasContraindication) {
      return { eligible: false, reason: 'Medical contraindication' };
    }

    return { eligible: true };
  }

  /**
   * Check topic diversity - prevent too many similar tips in recent history
   */
  private calculateTopicDiversityScore(
    tip: Tip,
    previousTips: DailyTip[],
    windowDays: number = RECOMMENDATION_CONFIG.TOPIC_COOLDOWN_DAYS
  ): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - windowDays);
    
    const recentTips = previousTips.filter(
      t => t.presented_date > cutoffDate
    );
    
    if (recentTips.length === 0) return 1; // No recent tips, full diversity score
    
    let similarityPenalty = 0;
    
    for (const recentTip of recentTips) {
      const recentTipData = TIPS_DATABASE.find(t => t.tip_id === recentTip.tip_id);
      if (!recentTipData) continue;
      
      // Check for same tip types
      const typeOverlap = tip.tip_type?.filter(
        type => recentTipData.tip_type?.includes(type)
      ).length || 0;
      
      // Check for same goals
      const goalOverlap = tip.goal_tags?.filter(
        tag => recentTipData.goal_tags?.includes(tag)
      ).length || 0;
      
      // Check for same mechanisms
      const mechanismOverlap = tip.motivational_mechanism?.filter(
        mech => recentTipData.motivational_mechanism?.includes(mech)
      ).length || 0;
      
      // Calculate days ago weight (more recent = higher penalty)
      const daysAgo = Math.floor(
        (Date.now() - recentTip.presented_date.getTime()) / (1000 * 60 * 60 * 24)
      );
      const recencyWeight = 1 - (daysAgo / windowDays);
      
      // Add weighted penalty for similarity
      similarityPenalty += recencyWeight * (
        (typeOverlap * 0.4) + 
        (goalOverlap * 0.3) + 
        (mechanismOverlap * 0.3)
      );
    }
    
    // Convert penalty to score (0-1 range)
    return Math.max(0, 1 - (similarityPenalty / recentTips.length));
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
      // Apply a small penalty to recently shown tips to encourage diversity
      const recentDays = daysSinceShown - RECOMMENDATION_CONFIG.HARD_NON_REPEAT_DAYS;
      if (recentDays < RECOMMENDATION_CONFIG.RECENCY_PENALTY.COOLDOWN_DAYS) {
        const penalty = Math.max(0, 
          RECOMMENDATION_CONFIG.RECENCY_PENALTY.MAX_PENALTY * 
          (1 - recentDays / RECOMMENDATION_CONFIG.RECENCY_PENALTY.COOLDOWN_DAYS)
        );
        score -= penalty;
        if (penalty > 0) {
          reasons.push(`Recently shown (${daysSinceShown} days ago)`);
        }
      }
    }

    // Time of day relevance
    if (currentHour !== undefined) {
      const timeScore = this.calculateTimeOfDayMatch(tip, currentHour);
      score += timeScore * RECOMMENDATION_CONFIG.WEIGHTS.TIME_OF_DAY;
      if (timeScore > 0.8) {
        reasons.push('Perfect timing for this tip');
      } else if (timeScore > 0.5) {
        reasons.push('Good time of day for this');
      }
    }

    // Goal alignment
    const goalMatches = tip.goal_tags && userProfile.goals ? 
      tip.goal_tags.filter(tag => userProfile.goals.includes(tag)).length : 0;
    const goalScore = tip.goal_tags && tip.goal_tags.length > 0 ? 
      (goalMatches / tip.goal_tags.length) * RECOMMENDATION_CONFIG.WEIGHTS.GOAL_ALIGNMENT : 0;
    score += goalScore;
    if (goalMatches > 0) {
      reasons.push(`Aligns with ${goalMatches} of your goals`);
    }

    // Difficulty preference from quiz
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
    const difficultyScore = Math.max(0, 
      RECOMMENDATION_CONFIG.WEIGHTS.DIFFICULTY_MATCH - (difficultyDiff * 5)
    );
    score += difficultyScore;
    if (difficultyScore > 10) {
      reasons.push('Matches your comfort level');
    }

    // Life chaos adjustment
    if (userProfile.life_stage?.includes('dumpster_fire') || 
        userProfile.life_stage?.includes('survival')) {
      // Use chaos_level_max if available, otherwise fallback
      if (tip.chaos_level_max && tip.chaos_level_max >= 4) {
        score += RECOMMENDATION_CONFIG.WEIGHTS.LIFE_CHAOS;
        reasons.push('Works even in chaos mode');
      } else if (tip.time_cost_enum === '0_5_min' && tip.difficulty_tier <= 2) {
        score += RECOMMENDATION_CONFIG.WEIGHTS.LIFE_CHAOS;
        reasons.push('Quick & easy for your busy life');
      }
      
      // Bonus for impulse-friendly tips
      if (tip.impulse_friendly) {
        score += 5;
      }
    } else if (userProfile.life_stage?.includes('zen')) {
      // Can handle more complex tips
      if (tip.difficulty_tier >= 3) {
        score += 5;
      }
    }

    // Eating personality match
    const personalityScore = this.calculatePersonalityMatch(tip, userProfile);
    score += personalityScore * RECOMMENDATION_CONFIG.WEIGHTS.PERSONALITY_MATCH;
    if (personalityScore > 0.5) {
      reasons.push('Fits your eating style');
    }

    // Non-negotiables check
    if (userProfile.non_negotiables && userProfile.non_negotiables.length > 0) {
      const conflictsWithNonNegotiables = this.checkNonNegotiableConflicts(tip, userProfile.non_negotiables);
      if (conflictsWithNonNegotiables) {
        score -= RECOMMENDATION_CONFIG.WEIGHTS.NON_NEGOTIABLES;
        reasons.push('⚠️ Might conflict with foods you love');
      } else {
        score += 5;
        reasons.push('Works with your food preferences');
      }
    }

    // Budget match
    if (userProfile.budget_conscious) {
      const budgetScore = tip.money_cost_enum === '$' ? RECOMMENDATION_CONFIG.WEIGHTS.BUDGET : 
                          tip.money_cost_enum === '$$' ? RECOMMENDATION_CONFIG.WEIGHTS.BUDGET / 2 : 0;
      score += budgetScore;
      if (budgetScore >= 5) {
        reasons.push('Budget-friendly');
      }
    }

    // Biggest obstacle consideration
    const obstacleScore = this.calculateObstacleMatch(tip, userProfile.biggest_obstacle);
    score += obstacleScore * RECOMMENDATION_CONFIG.WEIGHTS.PERSONALITY_MATCH;
    if (obstacleScore > 0.5) {
      reasons.push('Helps with your main challenge');
    }

    // Success with similar tips
    const similarSuccessScore = this.calculateSimilarTipSuccess(tip, attempts);
    score += similarSuccessScore * RECOMMENDATION_CONFIG.WEIGHTS.SUCCESS_HISTORY;
    if (similarSuccessScore > 0.5) {
      reasons.push('Similar to tips that worked for you');
    }
    
    // Topic diversity bonus/penalty
    const diversityScore = this.calculateTopicDiversityScore(tip, previousTips);
    score += diversityScore * RECOMMENDATION_CONFIG.WEIGHTS.TOPIC_DIVERSITY;
    if (diversityScore < 0.3) {
      reasons.push('⚠️ Similar to recent tips');
    } else if (diversityScore > 0.7) {
      reasons.push('Fresh approach');
    }
    
    // NEW: Vegetable approach for veggie-averse users (weight: 10% bonus/penalty)
    if (userProfile.dietary_preferences?.includes('avoid') || 
        userProfile.dietary_preferences?.includes('hide_them')) {
      if (tip.veggie_intensity === 'heavy' || tip.veggie_strategy === 'front_and_center') {
        score -= 10;
        reasons.push('⚠️ Heavy on vegetables');
      } else if (tip.veggie_intensity === 'hidden' || tip.veggie_strategy === 'disguised') {
        score += 10;
        reasons.push('Sneaky veggie approach');
      }
    }
    
    // NEW: Family compatibility (weight: 5%)
    if (userProfile.home_situation) {
      if (userProfile.home_situation.includes('picky_kids') && tip.kid_approved) {
        score += 5;
        reasons.push('Kid-friendly');
      }
      if (userProfile.home_situation.includes('resistant_partner') && tip.partner_resistant_ok) {
        score += 5;
        reasons.push('Works even if partner not on board');
      }
    }
    
    // NEW: Diet trauma considerations (weight: 10% bonus for safe tips)
    if (userProfile.dietary_preferences?.includes('history_yo_yo') || 
        userProfile.dietary_preferences?.includes('history_too_extreme')) {
      if (tip.diet_trauma_safe && !tip.feels_like_diet) {
        score += 10;
        reasons.push('Gentle, sustainable approach');
      } else if (tip.feels_like_diet) {
        score -= 5;
      }
    }
    
    // NEW: Cognitive load check for overwhelmed users
    if (userProfile.dietary_preferences?.includes('history_overwhelmed')) {
      if (tip.cognitive_load && tip.cognitive_load <= 2) {
        score += 5;
        reasons.push('Simple and straightforward');
      } else if (tip.cognitive_load && tip.cognitive_load >= 4) {
        score -= 5;
      }
    }
    
    // NEW: Cooking skill and interest check
    const kitchenSkills = userProfile.quiz_responses?.find(r => r.questionId === 'kitchen_reality')?.value;
    const cookingInterest = userProfile.quiz_responses?.find(r => r.questionId === 'cooking_interest')?.value;
    
    if (kitchenSkills === 'microwave_master' || kitchenSkills === 'no_kitchen') {
      // Check if user is interested in learning
      if (cookingInterest === 'no_interest' || cookingInterest === 'no_time') {
        // Heavy penalty for cooking-required tips
        if (tip.cooking_skill_required && 
            tip.cooking_skill_required !== 'none' && 
            tip.cooking_skill_required !== 'microwave') {
          score -= 30;
          reasons.push('⚠️ Requires cooking skills');
        }
        // Also penalize if requires kitchen equipment they don't have
        if (tip.kitchen_equipment?.includes('basic_stove') || 
            tip.kitchen_equipment?.includes('full_kitchen')) {
          score -= 25;
          reasons.push('⚠️ Requires stove/kitchen');
        }
        // Also penalize tips that take time in kitchen
        if (tip.time_cost_enum === '15_60_min' || tip.time_cost_enum === '>60_min') {
          if (tip.physical_effort > 2) {
            score -= 20;
            reasons.push('⚠️ Too much kitchen time');
          }
        }
      } else if (cookingInterest === 'curious') {
        // Mild penalty for complex cooking, bonus for simple cooking
        if (tip.cooking_skill_required === 'basic' || tip.cooking_skill_required === 'microwave') {
          score += 5;
          reasons.push('Simple cooking practice');
        } else if (tip.cooking_skill_required === 'intermediate' || tip.cooking_skill_required === 'advanced') {
          score -= 15;
          reasons.push('Too advanced for now');
        }
      }
    }
    
    // Bonus for no-cook options for microwave users
    if ((kitchenSkills === 'microwave_master' || kitchenSkills === 'no_kitchen') && 
        (tip.cooking_skill_required === 'none' || tip.cooking_skill_required === 'microwave')) {
      score += 10;
      reasons.push('No cooking required!');
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
   * Calculate how well a tip matches the current time of day
   */
  private calculateTimeOfDayMatch(tip: Tip, currentHour: number): number {
    // Define time periods
    const timePeriod = 
      currentHour >= 5 && currentHour < 12 ? 'morning' :
      currentHour >= 12 && currentHour < 17 ? 'afternoon' :
      currentHour >= 17 && currentHour < 21 ? 'evening' :
      'late_night';

    // Debug logging in development
    if (__DEV__ && tip.time_of_day.length > 0) {
      console.log(`Time matching: Current hour=${currentHour}, Period=${timePeriod}, Tip times=${tip.time_of_day.join(', ')}`);
    }

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
      .sort((a, b) => b.presented_date.getTime() - a.presented_date.getTime())[0];

    if (!lastShown) return null;

    const daysDiff = Math.floor(
      (Date.now() - lastShown.presented_date.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysDiff;
  }

  /**
   * Check if tip conflicts with non-negotiable foods
   */
  private checkNonNegotiableConflicts(tip: Tip, nonNegotiables: string[]): boolean {
    // Check if tip asks to reduce/eliminate something they won't give up
    const tipSummaryLower = tip.summary.toLowerCase();
    const tipDetailsLower = tip.details_md.toLowerCase();
    
    for (const food of nonNegotiables) {
      switch(food) {
        case 'chocolate':
          if (tipSummaryLower.includes('no chocolate') || 
              tipSummaryLower.includes('avoid chocolate') ||
              tipSummaryLower.includes('skip dessert')) {
            return true;
          }
          break;
        case 'coffee_drinks':
          if (tipSummaryLower.includes('black coffee') || 
              tipSummaryLower.includes('skip the latte')) {
            return true;
          }
          break;
        case 'cheese':
          if (tipSummaryLower.includes('no cheese') || 
              tipSummaryLower.includes('skip cheese')) {
            return true;
          }
          break;
        case 'soda':
          if (tipSummaryLower.includes('no soda') || 
              tipSummaryLower.includes('quit soda')) {
            return true;
          }
          // But swapping for sparkling water might be OK
          if (tipSummaryLower.includes('sparkling water')) {
            return false;
          }
          break;
        case 'bread_carbs':
          if (tipSummaryLower.includes('no carbs') || 
              tipSummaryLower.includes('avoid bread')) {
            return true;
          }
          break;
      }
    }
    return false;
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
          matchScore += 0.3;
        }
      }
    }
    
    // Check eating personality traits
    if (userProfile.eating_personality.includes('grazer')) {
      // Grazers do well with snack-focused tips
      if (tip.cue_context?.includes('snack_time')) {
        matchScore += 0.3;
      }
    }
    
    if (userProfile.eating_personality.includes('speed_eater')) {
      // Speed eaters benefit from mindful eating tips
      if (tip.tip_type.includes('mindset_shift') && 
          tip.summary.toLowerCase().includes('slow')) {
        matchScore += 0.3;
      }
    }
    
    if (userProfile.eating_personality.includes('stress_eater')) {
      // Stress eaters need mood regulation tips
      if (tip.tip_type.includes('mood_regulation')) {
        matchScore += 0.3;
      }
    }
    
    if (userProfile.eating_personality.includes('night_owl')) {
      // Night owls need evening-friendly tips
      if (tip.time_of_day.includes('late_night') || 
          tip.time_of_day.includes('evening')) {
        matchScore += 0.2;
      }
    }
    
    if (userProfile.eating_personality.includes('picky')) {
      // Picky eaters need simple, familiar tips
      if (tip.difficulty_tier <= 2 && !tip.tip_type.includes('novelty')) {
        matchScore += 0.2;
      }
      // Also check texture preferences if available
      if (tip.texture_profile && userProfile.dietary_preferences) {
        // Avoid textures they might not like
        matchScore -= 0.1;
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
        // Favor quick tips
        if (tip.time_cost_enum === '0_5_min') return 1;
        if (tip.time_cost_enum === '5_15_min') return 0.7;
        return 0.3;
        
      case 'no_energy':
        // Favor energy-boosting, easy tips
        if (tip.motivational_mechanism.includes('energy_boost') && 
            tip.mental_effort <= 2) {
          return 1;
        }
        return 0.3;
        
      case 'no_willpower':
        // Favor environment design and habit stacking
        if (tip.tip_type.includes('environment_design') || 
            tip.tip_type.includes('habit_stacking')) {
          return 1;
        }
        return 0.3;
        
      case 'emotional':
        // Favor mood regulation tips
        if (tip.tip_type.includes('mood_regulation') || 
            tip.motivational_mechanism.includes('comfort')) {
          return 1;
        }
        return 0.3;
        
      case 'hate_cooking':
        // Favor no-cook options
        if (tip.time_cost_enum === '0_5_min' && 
            tip.physical_effort === 1) {
          return 1;
        }
        return 0.2;
        
      case 'love_junk':
        // Favor healthy swaps that still taste good
        if (tip.tip_type.includes('healthy_swap') && 
            tip.motivational_mechanism.includes('sensory')) {
          return 1;
        }
        return 0.4;
        
      case 'social_pressure':
        // Favor social-friendly tips
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
      const attemptedTip = TIPS_DATABASE.find(t => t.tip_id === attempt.tip_id);
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

    // Apply eligibility filtering (hard constraints)
    let eligibleTips = safeTips.filter(tip => {
      const eligibility = this.isTipEligible(tip, userProfile, previousTips, attempts, false);
      if (!eligibility.eligible && __DEV__) {
        console.log(`Tip "${tip.summary}" ineligible: ${eligibility.reason}`);
      }
      return eligibility.eligible;
    });

    // If we don't have enough eligible tips, relax constraints
    if (eligibleTips.length < RECOMMENDATION_CONFIG.MIN_CANDIDATES_THRESHOLD) {
      console.log(`Only ${eligibleTips.length} eligible tips. Relaxing constraints...`);
      
      // Try with relaxed non-repeat window
      eligibleTips = safeTips.filter(tip => {
        const eligibility = this.isTipEligible(tip, userProfile, previousTips, attempts, true);
        return eligibility.eligible;
      });
      
      // If still not enough, use absolute minimum floor (but never violate medical or opt-outs)
      if (eligibleTips.length < RECOMMENDATION_CONFIG.MIN_CANDIDATES_THRESHOLD) {
        console.log('Still insufficient tips. Using minimum floor...');
        eligibleTips = safeTips.filter(tip => {
          // Check only permanent opt-outs and medical contraindications
          const permanentOptOut = attempts.find(
            a => a.tip_id === tip.tip_id && a.feedback === 'not_for_me'
          );
          if (permanentOptOut) return false;
          
          const hasContraindication = tip.contraindications?.some(
            condition => userProfile.medical_conditions?.includes(condition)
          );
          if (hasContraindication) return false;
          
          // Check minimum floor for repeats
          const daysSinceShown = this.getDaysSinceLastShown(tip.tip_id, previousTips);
          if (daysSinceShown !== null && daysSinceShown < RECOMMENDATION_CONFIG.MIN_NON_REPEAT_FLOOR) {
            return false;
          }
          
          return true;
        });
      }
    }

    // Calculate scores for all eligible tips
    const scoredTips = eligibleTips.map(tip => 
      this.calculateTipScore(tip, userProfile, previousTips, attempts, hour)
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
    console.log('=== TIP RECOMMENDATION ALGORITHM ===');
    console.log(`Previous tips shown: ${previousTips.length}`);
    
    // Log recently shown tips
    const recentTips = previousTips
      .sort((a, b) => b.presented_date.getTime() - a.presented_date.getTime())
      .slice(0, 7)
      .map(t => {
        const tip = TIPS_DATABASE.find(tip => tip.tip_id === t.tip_id);
        const daysAgo = Math.floor((Date.now() - t.presented_date.getTime()) / (1000 * 60 * 60 * 24));
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