/**
 * Centralized configuration for the tip recommendation algorithm
 * All time values are in days, all weights are on the same scale for easy tuning
 */
export const RECOMMENDATION_CONFIG = {
  // ============== NON-REPEAT WINDOWS ==============
  /**
   * Hard non-repeat window (default: 90 days)
   * Tips shown within this window are strictly excluded in normal mode
   * This prevents user fatigue from seeing the same tip too often
   */
  HARD_NON_REPEAT_DAYS: 90,
  
  /**
   * Relaxed non-repeat window (default: 60 days)
   * Used when there aren't enough eligible tips with the hard constraint
   * Allows more recent tips to be reconsidered to maintain variety
   */
  RELAXED_NON_REPEAT_DAYS: 60,
  
  /**
   * Absolute minimum non-repeat floor (default: 30 days)
   * Emergency fallback when even relaxed constraints don't yield enough tips
   * This is the absolute minimum time before any tip can repeat
   */
  MIN_NON_REPEAT_FLOOR: 30,
  
  // ============== SNOOZE SETTINGS ==============
  /**
   * Default snooze duration (default: 7 days)
   * When user selects "maybe later", tip is hidden for this many days
   * After this period, the tip bypasses non-repeat windows and becomes eligible
   */
  DEFAULT_SNOOZE_DAYS: 7,
  
  // ============== DIVERSITY SETTINGS ==============
  /**
   * Topic diversity cooldown window (default: 10 days)
   * Used to check how similar recent tips are to avoid repetitive themes
   * Tips within this window are analyzed for similarity in type/goals/mechanisms
   */
  TOPIC_COOLDOWN_DAYS: 10,
  
  // ============== CANDIDATE THRESHOLDS ==============
  /**
   * Minimum candidates before relaxing constraints (default: 12)
   * If fewer than this many tips are eligible, the system progressively
   * relaxes constraints (hard → relaxed → floor) to ensure variety
   */
  MIN_CANDIDATES_THRESHOLD: 12,
  
  // ============== SCORING WEIGHTS ==============
  /**
   * Weights for different scoring factors (higher = more important)
   * All weights are on the same scale for easy A/B testing and tuning
   * Each factor produces a score 0-1 which is multiplied by its weight
   */
  WEIGHTS: {
    /**
     * Time of day relevance (default: 8)
     * Rewards tips that match current time (morning/afternoon/evening/night)
     * Perfect match = 1.0, adjacent period = 0.5, no preference = 0.3
     */
    TIME_OF_DAY: 8,
    
    /**
     * Goal alignment (default: 14) - HIGHEST PRIORITY
     * How well tip aligns with user's stated health goals
     * Score = (matching goals / total tip goals)
     */
    GOAL_ALIGNMENT: 14,
    
    /**
     * Difficulty match (default: 10)
     * How well tip difficulty matches user preference & past success
     * Blends quiz preference with learned behavior from attempts
     */
    DIFFICULTY_MATCH: 10,
    
    /**
     * Life chaos compatibility (default: 8)
     * Favors quick/easy tips for chaotic lifestyles
     * Bonus for tips marked as chaos_level_max >= 4 or impulse_friendly
     */
    LIFE_CHAOS: 8,
    
    /**
     * Eating personality match (default: 6)
     * How well tip addresses user's eating challenges
     * (grazer, speed_eater, stress_eater, night_owl, picky)
     */
    PERSONALITY_MATCH: 6,
    
    /**
     * Non-negotiables conflict (default: 12) - Used as PENALTY
     * Applied as negative when tip conflicts with foods user won't give up
     * Small bonus (×0.3) when tip preserves their favorite foods
     */
    NON_NEGOTIABLES: 12,
    
    /**
     * Budget compatibility (default: 6)
     * For budget-conscious users: $ = 1.0, $$ = 0.5, $$$ = 0
     * Ignored for users who aren't budget-conscious
     */
    BUDGET: 6,
    
    /**
     * Obstacle targeting (default: 10)
     * How well tip addresses user's stated biggest obstacle
     * (no_time, no_energy, no_willpower, emotional, hate_cooking, etc.)
     */
    OBSTACLE_MATCH: 10,
    
    /**
     * Success history (default: 5)
     * Based on user's past success with similar tip types/mechanisms
     * Learns what categories of tips work for this specific user
     */
    SUCCESS_HISTORY: 5,
    
    /**
     * Topic diversity (default: 8)
     * Prevents repetitive themes by penalizing tips similar to recent ones
     * Uses Jaccard similarity with exponential decay by recency
     */
    TOPIC_DIVERSITY: 8,
    
    /**
     * Kitchen compatibility (default: 10)
     * Critical for non-cooks: 0 if requires cooking they can't/won't do
     * Considers both skill level and equipment availability
     */
    KITCHEN_COMPAT: 10,
    
    /**
     * Vegetable aversion handling (default: 8)
     * Penalty for veggie-heavy tips if user avoids vegetables
     * Bonus for "hidden" veggie approaches for veggie-averse users
     */
    VEGGIE_AVERSION: 8,
    
    /**
     * Family compatibility (default: 4)
     * Bonus for kid_approved tips if user has picky kids
     * Bonus for partner_resistant_ok if partner isn't supportive
     */
    FAMILY_COMPAT: 4,
    
    /**
     * Diet trauma sensitivity (default: 6)
     * For users with yo-yo/extreme diet history
     * Favors gentle, sustainable approaches over restrictive tips
     */
    DIET_TRAUMA: 6,
    
    /**
     * Cognitive load consideration (default: 5)
     * For overwhelmed users, favors low cognitive_load tips
     * Penalizes complex tips requiring lots of mental energy
     */
    COGNITIVE_LOAD: 5,
  } as const,
  
  // ============== RECENCY PENALTY ==============
  /**
   * Parameters for penalizing recently shown tips (even outside non-repeat window)
   * Provides gentle encouragement for fresher content
   */
  RECENCY_PENALTY: {
    /**
     * Maximum penalty score (default: 8)
     * Applied to tips shown exactly at HARD_NON_REPEAT_DAYS
     * Decays linearly over COOLDOWN_DAYS
     */
    MAX_PENALTY: 8,
    
    /**
     * Cooldown period for recency penalty (default: 14 days)
     * After HARD_NON_REPEAT_DAYS, penalty decreases from MAX to 0 over this period
     * Tips older than (HARD_NON_REPEAT_DAYS + COOLDOWN_DAYS) get no penalty
     */
    COOLDOWN_DAYS: 14,
  }
} as const;