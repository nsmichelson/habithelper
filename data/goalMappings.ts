/**
 * Central mapping between quiz goals and tip database goals
 * This ensures consistency between what users select and what tips they see
 */

export interface GoalMapping {
  quizGoal: string;
  tipGoals: string[]; // Can map to multiple tip goals
  category: 'eating' | 'sleep' | 'productivity' | 'exercise' | 'mindset' | 'relationships';
}

/**
 * Maps quiz goal values to tip database goal values
 * Some quiz goals map to multiple tip goals for better coverage
 */
export const GOAL_MAPPINGS: Record<string, string[]> = {
  // ============ EATING GOALS ============
  'eat_more_veggies': ['increase_veggies', 'increase_vegetables', 'veggie_exposure', 'produce_intake'],
  'reduce_junk_food': ['less_processed_food', 'reduce_ultra_processed', 'reduce_takeout'],
  'control_portions': ['portion_control', 'satiety'],
  'reduce_sugar': ['reduce_sugar', 'reduce_cravings', 'stable_blood_sugar'],
  'eat_more_protein': ['increase_protein', 'protein_intake'],
  'drink_more_water': ['hydration', 'improve_hydration', 'increase_hydration'],
  'practice_mindful_eating': ['mindful_eating', 'satiety', 'self_awareness'],
  'improve_meal_planning': ['meal_prep', 'time_saving'],
  'cook_at_home': ['meal_prep', 'food_safety'],
  'regular_meal_schedule': ['morning_routine', 'healthy_breakfast', 'stable_blood_sugar'],
  'stop_binge_eating': ['emotional_eating', 'stress_eating', 'evening_grazing', 'craving_management'],
  'manage_blood_sugar': ['stable_blood_sugar', 'reduce_sugar', 'portion_control'],
  'pregnancy_nutrition': ['healthy_pregnancy', 'nutrient_density', 'food_safety'],
  'switch_to_plant_based': ['plant_based', 'increase_veggies', 'increase_vegetables'],
  'quit_alcohol': ['alcohol_free'],
  'eat_more_fiber': ['fiber_intake', 'increase_fiber', 'gut_health'],
  'lose_weight_eating': ['weight_loss', 'portion_control', 'satiety'],
  'eat_for_muscle_gain': ['muscle_gain', 'protein_intake', 'increase_protein'],
  'manage_cravings': ['craving_management', 'craving_satisfaction', 'reduce_cravings'],
  'reduce_processed_foods': ['less_processed_food', 'reduce_ultra_processed'],
  'healthier_restaurant_choices': ['reduce_takeout', 'mindful_eating', 'portion_control'],
  'reduce_caffeine': ['reduce_caffeine'],
  'reduce_carbs': ['reduce_carbs', 'stable_blood_sugar'],
  'reduce_fat': ['reduce_fat', 'better_lipids'],
  'reduce_sodium': ['reduce_sodium', 'heart_health'],

  // ============ SLEEP GOALS ============
  'fall_asleep_easier': ['improve_sleep', 'sleep_quality'],
  'stay_asleep_night': ['improve_sleep', 'sleep_quality'],
  'go_to_bed_earlier': ['improve_sleep', 'morning_routine'],
  'consistent_sleep_schedule': ['sleep_routine', 'morning_routine', 'sleep_quality'],
  'wake_up_refreshed': ['improve_sleep', 'sleep_quality', 'improve_energy'],
  'reduce_screen_before_bed': ['improve_sleep', 'sleep_quality'],
  'bedtime_wind_down': ['improve_sleep', 'sleep_quality', 'mindset_shift'],
  'improve_sleep_environment': ['improve_sleep', 'sleep_quality'],
  'stop_hitting_snooze': ['morning_routine', 'improve_energy', 'wake_discipline'],

  // ============ PRODUCTIVITY GOALS ============
  'stop_procrastinating': ['task_completion', 'motivation', 'focus_improvement'],
  'improve_focus': ['focus_improvement', 'reduce_distractions', 'deep_work'],
  'better_time_management': ['time_saving', 'task_prioritization', 'schedule_management'],
  'declutter_spaces': ['declutter', 'organize_home'],
  'organize_digital_life': ['organize_workspace', 'digital_organization'],
  'build_daily_routine': ['morning_routine', 'daily_structure', 'better_habits'],
  'prioritize_tasks': ['task_prioritization', 'decision_making', 'mindset_shift'],
  'finish_what_start': ['task_completion', 'follow_through', 'motivation'],
  'reduce_overwhelm': ['stress_management', 'task_prioritization', 'mindset_shift'],
  'improve_planning': ['task_planning', 'schedule_management', 'time_saving'],

  // ============ EXERCISE GOALS ============
  'start_exercising': ['improve_energy', 'exercise_habit'],
  'consistent_workouts': ['exercise_habit', 'workout_routine', 'better_habits'],
  'build_strength': ['strength_performance', 'muscle_gain'],
  'improve_cardio': ['endurance_performance', 'heart_health'],
  'increase_flexibility': ['flexibility', 'mobility'],
  'exercise_lose_weight': ['weight_loss', 'improve_energy'],
  'exercise_for_energy': ['improve_energy', 'improve_mood'],
  'find_enjoyable_exercise': ['motivation', 'exercise_enjoyment'],
  'workout_at_home': ['home_fitness', 'workout_routine'],
  'more_active_lifestyle': ['better_habits', 'improve_energy', 'daily_movement'],
  'boost_endurance': ['endurance_performance'],
  'increase_strength_performance': ['strength_performance'],

  // ============ MINDSET GOALS ============
  'manage_stress': ['stress_management', 'stress_eating', 'mindset_shift'],
  'reduce_anxiety': ['anxiety_management', 'mindset_shift', 'improve_mood'],
  'stop_negative_thoughts': ['positive_thinking', 'mindset_shift', 'self_awareness'],
  'practice_self_compassion': ['self_compassion', 'self_awareness', 'mindset_shift'],
  'build_confidence': ['build_confidence', 'self_awareness'],
  'practice_mindfulness': ['mindfulness_practice', 'mindful_eating', 'self_awareness'],
  'cultivate_gratitude': ['gratitude_practice', 'mindset_shift', 'improve_mood'],
  'set_boundaries': ['healthy_boundaries', 'self_awareness'],
  'overcome_perfectionism': ['overcome_perfectionism', 'mindset_shift', 'self_awareness'],
  'stay_motivated': ['motivation', 'goal_achievement'],

  // ============ RELATIONSHIP GOALS ============
  // Note: Most relationship goals don't have direct tip database matches
  // These might need new tips or could map to general wellness goals
  'improve_communication': ['better_communication', 'self_awareness'],
  'more_quality_time': ['relationship_time', 'time_saving'],
  'stronger_social_connections': ['social_support', 'community_building'],
  'handle_conflicts_better': ['conflict_skills', 'self_awareness', 'mindset_shift'],
  'express_needs_clearly': ['assertiveness', 'self_awareness'],
  'become_better_listener': ['active_listening', 'mindfulness_practice', 'self_awareness'],
  'improve_work_life_balance': ['work_life_balance', 'time_saving', 'boundary_setting'],
  'more_family_time': ['family_connection', 'time_saving', 'meal_prep'],
  'build_dating_confidence': ['dating_confidence', 'build_confidence', 'self_awareness'],
  'strengthen_friendships': ['friendship_building', 'social_support']
};

/**
 * Get tip database goals for a quiz goal
 */
export function getTipGoalsForQuizGoal(quizGoal: string): string[] {
  return GOAL_MAPPINGS[quizGoal] || [];
}

/**
 * Get all tip goals for an array of quiz goals
 */
export function getTipGoalsForQuizGoals(quizGoals: string[]): string[] {
  const tipGoals = new Set<string>();

  quizGoals.forEach(quizGoal => {
    const mappedGoals = getTipGoalsForQuizGoal(quizGoal);
    mappedGoals.forEach(goal => tipGoals.add(goal));
  });

  return Array.from(tipGoals);
}

/**
 * Check if a tip matches any of the user's quiz goals
 */
export function tipMatchesQuizGoals(tipGoals: string[], userQuizGoals: string[]): boolean {
  const userTipGoals = getTipGoalsForQuizGoals(userQuizGoals);
  return tipGoals.some(tipGoal => userTipGoals.includes(tipGoal));
}

/**
 * List of quiz goals that need to be added to the quiz structure
 */
export const NEW_EATING_GOALS_TO_ADD = [
  { value: 'stop_binge_eating', label: 'Stop binge eating / stress snacking' },
  { value: 'manage_blood_sugar', label: 'Manage blood sugar (diabetic)' },
  { value: 'pregnancy_nutrition', label: 'Eat better during pregnancy' },
  { value: 'switch_to_plant_based', label: 'Switch to plant-based' },
  { value: 'quit_alcohol', label: 'Cut out alcohol' },
  { value: 'eat_more_fiber', label: 'Increase fiber intake' },
  { value: 'lose_weight_eating', label: 'Lose weight' },
  { value: 'eat_for_muscle_gain', label: 'Build muscle' },
  { value: 'manage_cravings', label: 'Manage cravings better' },
  { value: 'reduce_processed_foods', label: 'Cut processed foods' },
  { value: 'healthier_restaurant_choices', label: 'Make better restaurant choices' },
  { value: 'reduce_caffeine', label: 'Reduce caffeine' },
  { value: 'reduce_carbs', label: 'Lower carb intake' },
  { value: 'reduce_fat', label: 'Reduce fat intake' },
  { value: 'reduce_sodium', label: 'Lower sodium' },
];

/**
 * Exercise goals to add
 */
export const NEW_EXERCISE_GOALS_TO_ADD = [
  { value: 'boost_endurance', label: 'Improve endurance/stamina' },
  { value: 'increase_strength_performance', label: 'Increase strength performance' },
];