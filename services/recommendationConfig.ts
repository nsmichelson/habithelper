// Centralized configuration for tip recommendation algorithm
export const RECOMMENDATION_CONFIG = {
  // Hard non-repeat window (90 days)
  HARD_NON_REPEAT_DAYS: 90,
  
  // Relaxed non-repeat when not enough tips (60 days)
  RELAXED_NON_REPEAT_DAYS: 60,
  
  // Absolute minimum non-repeat floor (30 days)
  MIN_NON_REPEAT_FLOOR: 30,
  
  // Default snooze period for "maybe later" (7 days)
  DEFAULT_SNOOZE_DAYS: 7,
  
  // Topic diversity cooldown to avoid sameness (10 days)
  TOPIC_COOLDOWN_DAYS: 10,
  
  // Minimum candidates before relaxing constraints
  MIN_CANDIDATES_THRESHOLD: 3,
  
  // Scoring weights
  WEIGHTS: {
    TIME_OF_DAY: 20,
    GOAL_ALIGNMENT: 25,
    DIFFICULTY_MATCH: 15,
    LIFE_CHAOS: 10,
    PERSONALITY_MATCH: 10,
    NON_NEGOTIABLES: 15,
    BUDGET: 10,
    SUCCESS_HISTORY: 15,
    TOPIC_DIVERSITY: 10,
  },
  
  // Recency penalty parameters
  RECENCY_PENALTY: {
    COOLDOWN_DAYS: 14,
    MAX_PENALTY: 50,
  }
};