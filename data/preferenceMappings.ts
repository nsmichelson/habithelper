/**
 * Maps quiz preferences to tip tags for matching
 * This bridges the vocabulary gap between what users select and how tips are tagged
 */

/**
 * Maps quiz "things_you_love" values to tip fields (involves, mechanisms, features, when, where)
 * A quiz preference can map to multiple tip tags for better matching
 */
export const PREFERENCE_MAPPINGS: Record<string, string[]> = {
  // ============ SOCIAL ACTIVITIES ============
  'restaurant_friends': ['restaurants', 'dining_out', 'social', 'friends', 'meal_out'],
  'coffee_shops': ['coffee', 'cafe', 'latte', 'coffee_shop', 'beverages'],
  'group_activities': ['group', 'social', 'community', 'group_activity', 'classes'],
  'family_time': ['family', 'kids', 'family_friendly', 'kid_approved'],
  'parties_events': ['social', 'party', 'events', 'celebrations'],
  'helping_others': ['community', 'volunteering', 'social_support', 'helping'],
  'deep_conversations': ['mindfulness', 'reflection', 'social', 'connection'],

  // ============ PHYSICAL ACTIVITIES ============
  'walking': ['walking', 'walk', 'steps', 'movement', 'outdoor'],
  'dancing': ['dancing', 'dance', 'movement', 'music', 'rhythm'],
  'nature_outdoors': ['nature', 'outdoor', 'park', 'fresh_air', 'outside'],
  'playing_kids_pets': ['play', 'kids', 'pets', 'active_play', 'family'],
  'bike_rides': ['biking', 'cycling', 'bike', 'outdoor', 'cardio'],
  'swimming_water': ['swimming', 'water', 'pool', 'aquatic'],
  'gardening': ['gardening', 'garden', 'plants', 'outdoor', 'nature'],
  'sports_watching': ['sports', 'watching', 'relaxation', 'entertainment'],
  'sports_playing': ['sports', 'active', 'exercise', 'team_sports'],
  'hiking_exploring': ['hiking', 'nature', 'exploring', 'outdoor', 'adventure'],

  // ============ MEDIA & ENTERTAINMENT ============
  'podcasts_audiobooks': ['podcasts', 'audiobooks', 'audio', 'listening', 'learning'],
  'youtube_videos': ['videos', 'youtube', 'watching', 'screen_time', 'entertainment'],
  'music_listening': ['music', 'listening', 'audio', 'rhythm', 'relaxation'],
  'reading': ['reading', 'books', 'learning', 'quiet', 'solo'],
  'games_video': ['gaming', 'games', 'entertainment', 'screen_time', 'fun'],
  'games_board': ['games', 'board_games', 'social', 'family', 'fun'],
  'tv_movies': ['tv', 'movies', 'watching', 'relaxation', 'entertainment'],
  'social_media': ['social_media', 'online', 'connection', 'scrolling'],

  // ============ FOOD & COOKING ============
  'cooking_experimenting': ['cooking', 'meal_prep', 'kitchen', 'experimenting', 'recipes'],
  'baking': ['baking', 'cooking', 'kitchen', 'treats', 'homemade'],
  'trying_foods': ['food_variety', 'experimenting', 'new_foods', 'adventurous'],
  'wine_drinks': ['beverages', 'drinks', 'wine', 'alcohol_free', 'mocktails'],

  // ============ CREATIVE & HOBBIES ============
  'creative_projects': ['creative', 'crafts', 'projects', 'making', 'art'],
  'writing_expression': ['writing', 'journaling', 'expression', 'reflection'],
  'photography': ['photography', 'photos', 'visual', 'creative', 'memories'],
  'collecting': ['collecting', 'organizing', 'hobbies', 'systematic'],
  'diy_projects': ['diy', 'projects', 'building', 'fixing', 'hands_on'],

  // ============ WELLNESS & SELF-CARE ============
  'mindfulness_practice': ['mindfulness', 'meditation', 'breathing', 'calm', 'present'],
  'yoga_stretching': ['yoga', 'stretching', 'flexibility', 'movement', 'relaxation'],
  'spa_selfcare': ['selfcare', 'relaxation', 'pampering', 'spa', 'comfort'],
  'shopping': ['shopping', 'retail', 'browsing', 'treats', 'rewards'],
  'napping': ['napping', 'rest', 'sleep', 'relaxation', 'recovery'],
  'spiritual_practices': ['spiritual', 'prayer', 'meditation', 'reflection', 'faith'],

  // ============ LIFESTYLE PREFERENCES ============
  'spontaneous_adventures': ['spontaneous', 'adventure', 'flexible', 'unplanned', 'impulse_friendly'],
  'planning_organizing': ['planning', 'organizing', 'structure', 'routine', 'systematic'],
  'solo_time': ['solo', 'alone', 'quiet', 'solitude', 'solo_friendly'],
  'cozy_comfort': ['cozy', 'comfort', 'home', 'relaxation', 'warm'],
  'learning_new': ['learning', 'education', 'growth', 'new_skills', 'improvement'],
};

/**
 * Maps quiz blocker values to tip "helps_with" tags
 * Blockers represent challenges that tips can help address
 */
export const BLOCKER_MAPPINGS: Record<string, string[]> = {
  // ============ EATING BLOCKERS ============
  'hate_veggies': ['veggie_aversion', 'picky_eating', 'texture_issues'],
  'love_sweets': ['sweet_cravings', 'sugar_cravings', 'cravings'],
  'stress_eating': ['stress_eating', 'emotional_eating', 'stress'],
  'no_time_cook': ['time_constraints', 'quick_meals', 'busy_schedule'],
  'dont_know_cook': ['cooking_skills', 'kitchen_confidence', 'simple_recipes'],
  'expensive': ['budget', 'cost_concerns', 'affordability'],
  'family_different': ['family_preferences', 'multiple_meals', 'picky_family'],
  'social_events': ['social_pressure', 'event_eating', 'peer_pressure'],
  'travel_eating': ['travel', 'eating_out', 'on_the_go'],
  'bored_eating': ['boredom_eating', 'mindless_eating', 'idle_snacking'],
  'night_snacking': ['night_eating', 'evening_cravings', 'late_night_hunger'],
  'picky_eater': ['picky_eating', 'limited_foods', 'texture_issues'],
  'emotional_eating': ['emotional_eating', 'comfort_eating', 'mood_eating'],
  'no_willpower': ['motivation', 'self_control', 'consistency'],

  // ============ SLEEP BLOCKERS ============
  'racing_mind': ['racing_thoughts', 'anxiety', 'worry', 'overthinking'],
  'phone_addiction': ['screen_time', 'phone_habits', 'digital_distraction'],
  'netflix_binge': ['binge_watching', 'screen_time', 'entertainment'],
  'work_late': ['work_stress', 'long_hours', 'work_life_balance'],
  'kids_wake': ['parenting', 'interruptions', 'family_needs'],
  'partner_snores': ['sleep_disruption', 'noise', 'partner_issues'],
  'uncomfortable_bed': ['comfort', 'physical_discomfort', 'bed_quality'],
  'too_hot_cold': ['temperature', 'comfort', 'environment'],
  'noise': ['noise_sensitivity', 'disruptions', 'quiet_need'],
  'revenge_bedtime': ['procrastination', 'me_time', 'control'],

  // ============ PRODUCTIVITY BLOCKERS ============
  'distractions': ['distractions', 'focus', 'concentration'],
  'procrastination': ['procrastination', 'avoidance', 'starting_difficulty'],
  'perfectionism': ['perfectionism', 'overthinking', 'analysis_paralysis'],
  'no_system': ['organization', 'structure', 'chaos'],
  'too_many_tools': ['overwhelm', 'tool_overload', 'complexity'],
  'unclear_priorities': ['prioritization', 'decision_making', 'clarity'],
  'interruptions': ['interruptions', 'disruptions', 'boundaries'],
  'energy_crashes': ['energy', 'fatigue', 'stamina'],
  'overwhelming_tasks': ['overwhelm', 'large_tasks', 'breakdown_needed'],

  // Add more blocker mappings for other areas...
};

/**
 * Maps quiz "avoid_approaches" to tip tags to penalize
 * These are approaches users want to avoid
 */
export const AVOID_MAPPINGS: Record<string, string[]> = {
  'rigid_rules': ['strict', 'rules', 'rigid', 'inflexible'],
  'counting': ['counting', 'tracking', 'numbers', 'metrics', 'calories'],
  'gym': ['gym', 'fitness_center', 'weight_room'],
  'morning_routine': ['early_morning', 'dawn', 'sunrise', 'morning'],
  'meal_prep': ['meal_prep', 'batch_cooking', 'prep_work'],
  'meditation': ['meditation', 'sitting_still', 'formal_practice'],
  'journaling': ['journaling', 'writing', 'diary', 'logging'],
  'group_accountability': ['group', 'accountability', 'public', 'sharing'],
  'complex_recipes': ['complex', 'complicated', 'elaborate', 'gourmet'],
  'supplements': ['supplements', 'pills', 'vitamins', 'tablets'],
  'detailed_tracking': ['detailed', 'tracking', 'logging', 'recording'],
  'early_morning': ['early_morning', 'dawn', 'early'],
  'long_workouts': ['long', 'extended', 'marathon', '60min+'],
  'expensive_tools': ['expensive', 'costly', 'premium', 'high_cost'],
};

/**
 * Helper functions for the recommendation service
 */

export function getMappedPreferences(quizPreferences: string[]): string[] {
  const mapped = new Set<string>();

  quizPreferences.forEach(pref => {
    const mappings = PREFERENCE_MAPPINGS[pref] || [pref]; // Fallback to original if no mapping
    mappings.forEach(m => mapped.add(m));
  });

  return Array.from(mapped);
}

export function getMappedBlockers(quizBlockers: string[]): string[] {
  const mapped = new Set<string>();

  quizBlockers.forEach(blocker => {
    const mappings = BLOCKER_MAPPINGS[blocker] || [blocker];
    mappings.forEach(m => mapped.add(m));
  });

  return Array.from(mapped);
}

export function getMappedAvoidances(quizAvoids: string[]): string[] {
  const mapped = new Set<string>();

  quizAvoids.forEach(avoid => {
    const mappings = AVOID_MAPPINGS[avoid] || [avoid];
    mappings.forEach(m => mapped.add(m));
  });

  return Array.from(mapped);
}