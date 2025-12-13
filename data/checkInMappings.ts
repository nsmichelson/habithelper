/**
 * Check-in Option Mappings
 *
 * Maps onboarding quiz responses to personalized check-in options.
 * This allows the check-in to show relevant obstacles and helpers
 * based on what the user identified during onboarding.
 */

import { Ionicons } from '@expo/vector-icons';

// Types
export type CheckInOption = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

export type TimeCondition = {
  afterHour?: number;  // Show only after this hour (0-23)
  beforeHour?: number; // Show only before this hour (0-23)
  daysOfWeek?: number[]; // 0=Sunday, 6=Saturday
};

export type PersonalizedCheckInOption = CheckInOption & {
  // Which onboarding responses trigger this option to appear
  showIfBarriers?: string[];      // barriers_nutrition values
  showIfGoals?: string[];         // nutrition_specifics values
  showIfWorked?: string[];        // what_worked_nutrition values
  hideIfAvoided?: string[];       // what_to_avoid_nutrition values

  // Time-based conditions
  timeCondition?: TimeCondition;

  // Priority (higher = shown first in list)
  priority?: number;

  // If true, always show regardless of onboarding
  alwaysShow?: boolean;
};

// ============================================
// NUTRITION OBSTACLES
// ============================================

export const NUTRITION_OBSTACLES: PersonalizedCheckInOption[] = [
  // --- ALWAYS SHOW (universal obstacles) ---
  {
    id: 'cravings',
    icon: 'pizza-outline',
    label: 'Cravings',
    alwaysShow: true,
    priority: 10,
  },
  {
    id: 'stressed',
    icon: 'cloudy-outline',
    label: 'Stress eating',
    alwaysShow: true,
    priority: 9,
  },
  {
    id: 'tired',
    icon: 'moon-outline',
    label: 'Too tired to cook',
    alwaysShow: true,
    priority: 9,
  },
  {
    id: 'busy',
    icon: 'calendar-outline',
    label: 'Busy schedule',
    alwaysShow: true,
    priority: 8,
  },

  // --- PERSONALIZED (show if selected in onboarding) ---

  // Sugar-specific (from love_sweets barrier or reduce_sugar goal)
  {
    id: 'sugar_cravings',
    icon: 'ice-cream-outline',
    label: 'Sugar cravings',
    showIfBarriers: ['love_sweets'],
    showIfGoals: ['reduce_sugar'],
    priority: 10,
  },

  // Late night (time-gated + onboarding)
  {
    id: 'late_night_cravings',
    icon: 'moon-outline',
    label: 'Late night cravings',
    showIfBarriers: ['night_snacking'],
    timeCondition: { afterHour: 20 }, // Only show after 8pm
    priority: 10,
  },

  // Boredom eating
  {
    id: 'boredom',
    icon: 'game-controller-outline',
    label: 'Boredom eating',
    showIfBarriers: ['bored_eating'],
    alwaysShow: true, // Common enough to always show
    priority: 7,
  },

  // Emotional eating
  {
    id: 'emotional',
    icon: 'heart-dislike-outline',
    label: 'Emotional eating',
    showIfBarriers: ['emotional_eating'],
    alwaysShow: true, // Common enough to always show
    priority: 9,
  },

  // Social eating
  {
    id: 'social_eating',
    icon: 'people-outline',
    label: 'Social eating',
    showIfBarriers: ['social_events'],
    timeCondition: { daysOfWeek: [5, 6, 0] }, // Fri, Sat, Sun - boost priority
    priority: 8,
  },

  // Celebration/event
  {
    id: 'celebration',
    icon: 'gift-outline',
    label: 'Celebration/event',
    showIfBarriers: ['social_events'],
    priority: 6,
  },

  // No healthy options
  {
    id: 'no_healthy_options',
    icon: 'close-circle-outline',
    label: 'No healthy options',
    alwaysShow: true,
    priority: 7,
  },

  // Traveling
  {
    id: 'traveling',
    icon: 'airplane-outline',
    label: 'Traveling',
    showIfBarriers: ['travel_eating'],
    priority: 7,
  },

  // Thirsty (not hungry)
  {
    id: 'thirsty',
    icon: 'water-outline',
    label: 'Thirsty (not hungry)',
    alwaysShow: true,
    priority: 6,
  },

  // --- NEW PERSONALIZED OPTIONS ---

  // Budget constraints
  {
    id: 'budget',
    icon: 'wallet-outline',
    label: 'Budget tight',
    showIfBarriers: ['budget_tight'],
    priority: 7,
  },

  // Family wants different food
  {
    id: 'family_food',
    icon: 'home-outline',
    label: 'Family wants different food',
    showIfBarriers: ['family_different', 'picky_household'],
    priority: 7,
  },

  // Don't feel like cooking
  {
    id: 'dont_want_cook',
    icon: 'restaurant-outline',
    label: "Don't feel like cooking",
    showIfBarriers: ['hate_cooking', 'no_time'],
    priority: 8,
  },

  // Willpower low
  {
    id: 'willpower_low',
    icon: 'battery-dead-outline',
    label: 'Willpower feels low',
    showIfBarriers: ['no_willpower'],
    priority: 8,
  },

  // Urge to binge
  {
    id: 'urge_to_binge',
    icon: 'warning-outline',
    label: 'Urge to overeat',
    showIfGoals: ['stop_binge_eating', 'control_portions'],
    priority: 9,
  },

  // Mindless eating
  {
    id: 'mindless_eating',
    icon: 'phone-portrait-outline',
    label: 'Eating on autopilot',
    showIfGoals: ['practice_mindful_eating'],
    priority: 7,
  },

  // Afternoon slump (time-gated)
  {
    id: 'afternoon_slump',
    icon: 'sunny-outline',
    label: 'Afternoon energy crash',
    showIfGoals: ['reduce_sugar'],
    showIfBarriers: ['love_sweets'],
    timeCondition: { afterHour: 14, beforeHour: 17 }, // 2pm-5pm
    priority: 8,
  },
];

// ============================================
// NUTRITION HELPERS (In Favor)
// ============================================

export const NUTRITION_HELPERS: PersonalizedCheckInOption[] = [
  // --- ALWAYS SHOW (universal helpers) ---
  {
    id: 'motivated',
    icon: 'flash-outline',
    label: 'Feeling motivated',
    alwaysShow: true,
    priority: 10,
  },
  {
    id: 'healthy_food',
    icon: 'leaf-outline',
    label: 'Healthy food available',
    alwaysShow: true,
    priority: 9,
  },
  {
    id: 'home',
    icon: 'home-outline',
    label: 'Eating at home',
    alwaysShow: true,
    priority: 8,
  },
  {
    id: 'hydrated',
    icon: 'water-outline',
    label: 'Hydrated',
    alwaysShow: true,
    priority: 7,
  },
  {
    id: 'not_hungry',
    icon: 'thumbs-up-outline',
    label: 'Not too hungry',
    alwaysShow: true,
    priority: 7,
  },

  // --- PERSONALIZED (show if worked in onboarding) ---

  // Meal prep (hide if they said to avoid it)
  {
    id: 'meal_prepped',
    icon: 'restaurant-outline',
    label: 'Meals prepped',
    showIfWorked: ['meal_timing', 'family_meals'],
    hideIfAvoided: ['meal_prep'],
    priority: 9,
  },

  // Leftovers ready
  {
    id: 'leftovers',
    icon: 'calendar-outline',
    label: 'Leftovers ready',
    alwaysShow: true,
    priority: 8,
  },

  // Support system
  {
    id: 'support',
    icon: 'people-outline',
    label: 'Supportive people',
    showIfWorked: ['support_group', 'nutritionist'],
    priority: 7,
  },

  // In a rhythm
  {
    id: 'rhythm',
    icon: 'repeat-outline',
    label: 'In a rhythm',
    alwaysShow: true,
    priority: 6,
  },

  // --- NEW PERSONALIZED HELPERS ---

  // Simple swaps ready
  {
    id: 'simple_swaps',
    icon: 'swap-horizontal-outline',
    label: 'Have easy swaps ready',
    showIfWorked: ['simple_swaps', 'one_change'],
    priority: 8,
  },

  // Flexible mindset
  {
    id: 'flexible_mindset',
    icon: 'infinite-outline',
    label: 'Flexible mindset today',
    showIfWorked: ['flexible_approach', 'no_restriction'],
    priority: 7,
  },

  // Family eating healthy too
  {
    id: 'family_support',
    icon: 'people-outline',
    label: 'Family on board',
    showIfWorked: ['family_meals', 'cooking_together'],
    showIfBarriers: ['family_different', 'picky_household'], // Show as positive when they have this challenge
    priority: 8,
  },

  // Tuned into hunger cues
  {
    id: 'listening_to_body',
    icon: 'body-outline',
    label: 'Tuned into my body',
    showIfWorked: ['intuitive_eating', 'mood_food_tracking'],
    priority: 7,
  },

  // Seeing progress
  {
    id: 'seeing_progress',
    icon: 'trending-up-outline',
    label: 'Seeing progress',
    showIfWorked: ['progress_photos', 'non_scale_wins'],
    priority: 8,
  },

  // Following a plan (hide if they avoid rigid plans)
  {
    id: 'following_plan',
    icon: 'clipboard-outline',
    label: 'Following a plan',
    showIfWorked: ['nutritionist', 'doctor_plan', 'medical_meal_plan'],
    hideIfAvoided: ['rigid_meal_plans'],
    priority: 7,
  },

  // Morning motivation (time-gated)
  {
    id: 'morning_fresh',
    icon: 'sunny-outline',
    label: 'Fresh start today',
    timeCondition: { beforeHour: 11 }, // Only show before 11am
    alwaysShow: true,
    priority: 6,
  },

  // Good energy
  {
    id: 'good_energy',
    icon: 'battery-full-outline',
    label: 'Good energy',
    alwaysShow: true,
    priority: 7,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if current time matches a time condition
 */
export function matchesTimeCondition(condition?: TimeCondition): boolean {
  if (!condition) return true;

  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();

  // Check hour conditions
  if (condition.afterHour !== undefined && currentHour < condition.afterHour) {
    return false;
  }
  if (condition.beforeHour !== undefined && currentHour >= condition.beforeHour) {
    return false;
  }

  // Check day of week (if specified, must match)
  if (condition.daysOfWeek && condition.daysOfWeek.length > 0) {
    // For days of week, we just boost priority rather than hide
    // So return true but caller can check for day match
  }

  return true;
}

/**
 * Check if option should be shown based on user's onboarding responses
 */
export function shouldShowOption(
  option: PersonalizedCheckInOption,
  userBarriers: string[],
  userGoals: string[],
  userWorked: string[],
  userAvoided: string[]
): boolean {
  // Always show options are always visible
  if (option.alwaysShow) return true;

  // Check if hidden by avoided preferences
  if (option.hideIfAvoided?.some(avoided => userAvoided.includes(avoided))) {
    return false;
  }

  // Check if any trigger condition is met
  const matchesBarrier = option.showIfBarriers?.some(b => userBarriers.includes(b));
  const matchesGoal = option.showIfGoals?.some(g => userGoals.includes(g));
  const matchesWorked = option.showIfWorked?.some(w => userWorked.includes(w));

  return Boolean(matchesBarrier || matchesGoal || matchesWorked);
}

/**
 * Get filtered and sorted check-in options based on user profile
 */
export function getPersonalizedCheckInOptions(
  allOptions: PersonalizedCheckInOption[],
  userBarriers: string[],
  userGoals: string[],
  userWorked: string[],
  userAvoided: string[]
): CheckInOption[] {
  const now = new Date();
  const currentDay = now.getDay();

  return allOptions
    // Filter by onboarding selections
    .filter(opt => shouldShowOption(opt, userBarriers, userGoals, userWorked, userAvoided))
    // Filter by time conditions
    .filter(opt => matchesTimeCondition(opt.timeCondition))
    // Sort by priority (and boost weekend options on weekends)
    .sort((a, b) => {
      let aPriority = a.priority || 5;
      let bPriority = b.priority || 5;

      // Boost priority for weekend-relevant options on Fri/Sat/Sun
      if ([5, 6, 0].includes(currentDay)) {
        if (a.timeCondition?.daysOfWeek?.some(d => [5, 6, 0].includes(d))) {
          aPriority += 2;
        }
        if (b.timeCondition?.daysOfWeek?.some(d => [5, 6, 0].includes(d))) {
          bPriority += 2;
        }
      }

      return bPriority - aPriority;
    })
    // Convert to simple CheckInOption format
    .map(({ id, icon, label }) => ({ id, icon, label }));
}

// ============================================
// USER PROFILE DATA EXTRACTORS
// ============================================

// Extended UserProfile type to include fields used by the new quiz
type ExtendedUserProfile = {
  primary_focus?: string;
  specific_challenges?: Record<string, string[]>;
  quiz_goals?: string[];
  goals?: string[];
  preferences?: string[];
  avoid_approaches?: string[];
  successful_strategies?: string[];
  failed_approaches?: string[];
  quiz_responses?: Array<{ questionId: string; value: any }>;
};

// Helper to find a quiz response by multiple possible question IDs (legacy support)
function findQuizResponse(
  quizResponses: Array<{ questionId: string; value: any }> | undefined,
  possibleIds: string[]
): any[] {
  if (!quizResponses) return [];

  for (const id of possibleIds) {
    const response = quizResponses.find(r => r.questionId === id);
    if (response && response.value) {
      return Array.isArray(response.value) ? response.value : [response.value];
    }
  }
  return [];
}

/**
 * Extract barriers/blockers from user profile
 * Primary source: specific_challenges[primary_focus] (new quiz structure)
 * Fallback: quiz_responses barriers_nutrition (old quiz)
 */
export function extractBarriersFromProfile(
  userProfile: ExtendedUserProfile | null | undefined
): string[] {
  if (!userProfile) return [];

  // New quiz structure: specific_challenges keyed by primary_focus
  const primaryFocus = userProfile.primary_focus;
  if (primaryFocus && userProfile.specific_challenges?.[primaryFocus]) {
    return userProfile.specific_challenges[primaryFocus];
  }

  // Also check common area keys
  const areaKeys = ['eating', 'nutrition', 'sleeping', 'sleep', 'productivity', 'fitness', 'exercise'];
  for (const key of areaKeys) {
    if (userProfile.specific_challenges?.[key]?.length) {
      return userProfile.specific_challenges[key];
    }
  }

  // Fallback to quiz_responses for old quiz structure
  return findQuizResponse(userProfile.quiz_responses, [
    'barriers_nutrition',
    'eating_blockers',
  ]);
}

/**
 * Extract nutrition goals from user profile
 * Primary source: quiz_goals or goals (new quiz structure)
 * Fallback: quiz_responses (old quiz)
 */
export function extractGoalsFromProfile(
  userProfile: ExtendedUserProfile | null | undefined
): string[] {
  if (!userProfile) return [];

  // New quiz structure: quiz_goals preserves original selections
  if (userProfile.quiz_goals?.length) {
    return userProfile.quiz_goals;
  }

  // Also check goals array
  if (userProfile.goals?.length) {
    return userProfile.goals as string[];
  }

  // Fallback to quiz_responses
  return findQuizResponse(userProfile.quiz_responses, [
    'nutrition_specifics',
    'eating_specifics',
  ]);
}

/**
 * Extract "what worked" / preferences from user profile
 * Primary source: preferences or successful_strategies (new quiz structure)
 * Fallback: quiz_responses (old quiz)
 */
export function extractWorkedFromProfile(
  userProfile: ExtendedUserProfile | null | undefined
): string[] {
  if (!userProfile) return [];

  // New quiz structure: preferences from things_you_love
  if (userProfile.preferences?.length) {
    return userProfile.preferences;
  }

  // Also check successful_strategies
  if (userProfile.successful_strategies?.length) {
    return userProfile.successful_strategies;
  }

  // Fallback to quiz_responses
  return findQuizResponse(userProfile.quiz_responses, [
    'what_worked_nutrition',
    'things_you_love',
  ]);
}

/**
 * Extract "what to avoid" preferences from user profile
 * Primary source: avoid_approaches or failed_approaches (new quiz structure)
 * Fallback: quiz_responses (old quiz)
 */
export function extractAvoidedFromProfile(
  userProfile: ExtendedUserProfile | null | undefined
): string[] {
  if (!userProfile) return [];

  // New quiz structure: avoid_approaches from hate_list
  if (userProfile.avoid_approaches?.length) {
    return userProfile.avoid_approaches;
  }

  // Also check failed_approaches
  if (userProfile.failed_approaches?.length) {
    return userProfile.failed_approaches;
  }

  // Fallback to quiz_responses
  return findQuizResponse(userProfile.quiz_responses, [
    'what_to_avoid_nutrition',
    'hate_list',
  ]);
}

/**
 * Convenience function to get all nutrition-related data from user profile
 * Works with both old quiz_responses structure and new profile fields
 */
export function extractNutritionProfileData(
  userProfile: ExtendedUserProfile | null | undefined
): {
  barriers: string[];
  goals: string[];
  worked: string[];
  avoided: string[];
} {
  return {
    barriers: extractBarriersFromProfile(userProfile),
    goals: extractGoalsFromProfile(userProfile),
    worked: extractWorkedFromProfile(userProfile),
    avoided: extractAvoidedFromProfile(userProfile),
  };
}

// Legacy function name for backwards compatibility
export const extractNutritionQuizData = (
  quizResponses: Array<{ questionId: string; value: any }> | undefined
) => extractNutritionProfileData({ quiz_responses: quizResponses });
