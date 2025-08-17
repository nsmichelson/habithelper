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
  },

  // ============== SCORING WEIGHTS ==============
  /**
   * Weights for different scoring factors (higher = more important)
   * All weights are on the same scale for easy A/B testing and tuning
   * Each factor produces a score 0-1 which is multiplied by its weight
   */
  WEIGHTS: {
    // ====== CORE PRIORITIES ======
    /**
     * Goal alignment via F1 score (default: 28) - HIGHEST PRIORITY
     * Uses F1 score (harmonic mean of precision and recall) to measure goal fit
     * Precision = how focused the tip is on user's goals
     * Recall = how many of user's goals the tip addresses
     * F1 prevents gaming with generic tips that have many goal tags
     */
    GOAL_ALIGNMENT: 28,
    
    /**
     * Lifestyle fit composite (default: 24) - SECOND PRIORITY
     * Single composite score combining multiple lifestyle factors:
     * - Life chaos compatibility (30% of composite)
     * - Kitchen/cooking compatibility (30% of composite)  
     * - Cognitive load suitability (20% of composite)
     * - Budget match (10% of composite)
     * - Time of day relevance (10% of composite)
     */
    LIFESTYLE_FIT: 24,

    // ====== INDIVIDUAL LIFESTYLE COMPONENTS ======
    // These are now rolled into LIFESTYLE_FIT composite to avoid double counting
    // Set to 0 to prevent duplicate scoring, or small values for tiny nudges
    
    /**
     * Time of day relevance (default: 0) - NOW IN LIFESTYLE_FIT
     * Previously rewarded tips matching current time
     */
    TIME_OF_DAY: 0,
    
    /**
     * Life chaos compatibility (default: 0) - NOW IN LIFESTYLE_FIT
     * Previously favored quick/easy tips for chaotic lifestyles
     */
    LIFE_CHAOS: 0,
    
    /**
     * Budget compatibility (default: 0) - NOW IN LIFESTYLE_FIT
     * Previously scored budget-friendliness for cost-conscious users
     */
    BUDGET: 0,
    
    /**
     * Cognitive load consideration (default: 0) - NOW IN LIFESTYLE_FIT
     * Previously favored simple tips for overwhelmed users
     */
    COGNITIVE_LOAD: 0,
    
    /**
     * Kitchen compatibility (default: 0) - NOW IN LIFESTYLE_FIT
     * Previously scored cooking requirements vs user capabilities
     */
    KITCHEN_COMPAT: 0,

    // ====== HELPFUL BUT SECONDARY ======
    /**
     * Difficulty matching (default: 8)
     * How well tip difficulty matches user's preference and past success
     * Blends quiz preference with learned preference from attempts
     */
    DIFFICULTY_MATCH: 8,
    
    /**
     * Obstacle targeting (default: 10)
     * How well tip addresses user's stated biggest obstacle
     * (no_time, no_energy, no_willpower, emotional, hate_cooking, etc.)
     */
    OBSTACLE_MATCH: 10,
    
    /**
     * Eating personality match (default: 6)
     * How well tip addresses user's eating challenges
     * (grazer, speed_eater, stress_eater, night_owl, picky)
     */
    PERSONALITY_MATCH: 6,
    
    /**
     * Success history (default: 6)
     * Based on user's past success with similar tip types/mechanisms
     * Learns what categories of tips work for this specific user
     */
    SUCCESS_HISTORY: 6,
    
    /**
     * Topic diversity (default: 6)
     * Prevents repetitive themes by penalizing tips similar to recent ones
     * Uses Jaccard similarity with exponential decay by recency
     */
    TOPIC_DIVERSITY: 6,
    
    /**
     * Non-negotiables conflict (default: 12) - Used as PENALTY
     * Applied as negative when tip conflicts with foods user won't give up
     * Small bonus handled in code when tip preserves their favorite foods
     */
    NON_NEGOTIABLES: 12,
    
    /**
     * Vegetable aversion handling (default: 20)
     * Strong penalty for veggie-heavy tips if user avoids vegetables
     * Bonus for "hidden" veggie approaches for veggie-averse users
     */
    VEGGIE_AVERSION: 20,
    
    /**
     * Family compatibility (default: 6)
     * Bonus for kid_approved tips if user has picky kids
     * Bonus for partner_resistant_ok if partner isn't supportive
     */
    FAMILY_COMPAT: 6,
    
    /**
     * Diet trauma sensitivity (default: 6)
     * For users with yo-yo/extreme diet history
     * Favors gentle, sustainable approaches over restrictive tips
     */
    DIET_TRAUMA: 6,
  } as const,
} as const;