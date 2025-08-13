// Centralized configuration for tip recommendation algorithm
export const RECOMMENDATION_CONFIG = {
  // Non-repeat windows (in days)
  HARD_NON_REPEAT_DAYS: 90,
  RELAXED_NON_REPEAT_DAYS: 60,
  MIN_NON_REPEAT_FLOOR: 30,
  
  // Snooze settings
  DEFAULT_SNOOZE_DAYS: 7,
  
  // Topic diversity
  TOPIC_COOLDOWN_DAYS: 10,
  
  // Minimum candidates before relaxing constraints
  MIN_CANDIDATES_THRESHOLD: 12,
  
  // Scoring weights (all on same scale for easier tuning)
  WEIGHTS: {
    TIME_OF_DAY: 8,
    GOAL_ALIGNMENT: 14,
    DIFFICULTY_MATCH: 10,
    LIFE_CHAOS: 8,
    PERSONALITY_MATCH: 6,
    NON_NEGOTIABLES: 12, // Used as penalty when conflicts
    BUDGET: 6,
    OBSTACLE_MATCH: 10,
    SUCCESS_HISTORY: 5,
    TOPIC_DIVERSITY: 8,
    KITCHEN_COMPAT: 10,
    VEGGIE_AVERSION: 8,
    FAMILY_COMPAT: 4,
    DIET_TRAUMA: 6,
    COGNITIVE_LOAD: 5,
  } as const,
  
  // Recency penalty parameters
  RECENCY_PENALTY: {
    MAX_PENALTY: 8,
    COOLDOWN_DAYS: 14,
  }
} as const;