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
  'eat_more_veggies': ['increase_vegetables', 'produce_priority', 'produce_visibility', 'produce_sharing_circle'],
  'reduce_junk_food': ['less_processed_food', 'reduce_ultra_processed', 'treat_environment_design', 'impulse_control_shopping'],
  'control_portions': ['portion_control', 'satiety', 'fast_food_portion_cap'],
  'reduce_sugar': ['reduce_sugar', 'reduce_cravings', 'stable_blood_sugar'],
  'eat_more_protein': ['increase_protein', 'protein_intake', 'protein_shortcuts'],
  'drink_more_water': ['improve_hydration', 'increase_hydration', 'beverage_boundaries'],
  'practice_mindful_eating': ['mindful_eating', 'satiety', 'mindset_shift'],
  'improve_meal_planning': ['meal_prep', 'freezer_meal_backup', 'produce_priority'],
  'cook_at_home': ['meal_prep', 'food_safety', 'safe_meal_routine'],
  'regular_meal_schedule': ['morning_routine', 'healthy_breakfast', 'safe_meal_routine'],
  'stop_binge_eating': ['emotional_eating', 'stress_eating', 'stress_coping_plan', 'stress_distraction_tool', 'stress_reset_routine'],
  'manage_blood_sugar': ['stable_blood_sugar', 'reduce_sugar', 'portion_control', 'post_meal_relief'],
  'pregnancy_nutrition': ['healthy_pregnancy', 'nutrient_density', 'food_safety', 'prenatal_vitamin_routine', 'DHA_intake', 'iron_intake', 'choline_intake', 'calcium_intake'],
  'switch_to_plant_based': ['plant_based', 'increase_vegetables', 'increase_nutrients'],
  'quit_alcohol': ['alcohol_free'],
  'eat_more_fiber': ['fiber_intake', 'increase_fiber', 'constipation_relief', 'improve_gut_health'],
  'lose_weight_eating': ['weight_loss', 'portion_control', 'satiety'],
  'eat_for_muscle_gain': ['muscle_gain', 'protein_intake', 'increase_protein', 'protein_shortcuts'],
  'manage_cravings': ['craving_management', 'craving_satisfaction', 'stress_distraction_tool'],
  'reduce_processed_foods': ['less_processed_food', 'reduce_ultra_processed', 'food_delivery_boundary'],
  'healthier_restaurant_choices': ['reduce_takeout', 'mindful_eating', 'portion_control', 'fast_food_portion_cap'],
  'reduce_caffeine': ['reduce_caffeine'],
  'reduce_carbs': ['reduce_carbs', 'stable_blood_sugar'],
  'reduce_fat': ['reduce_fat', 'better_lipids'],
  'reduce_sodium': ['reduce_sodium', 'heart_health'],

  // ============ SLEEP GOALS ============
  'fall_asleep_easier': ['improve_sleep', 'sleep_quality'],
  'stay_asleep_night': ['improve_sleep', 'sleep_quality'],
  'go_to_bed_earlier': ['improve_sleep', 'morning_routine'],
  'consistent_sleep_schedule': ['improve_sleep', 'morning_routine', 'sleep_quality'],
  'wake_up_refreshed': ['improve_sleep', 'sleep_quality', 'improve_energy'],
  'reduce_screen_before_bed': ['improve_sleep', 'sleep_quality'],
  'bedtime_wind_down': ['improve_sleep', 'sleep_quality', 'mindset_shift'],
  'improve_sleep_environment': ['improve_sleep', 'sleep_quality'],
  'stop_hitting_snooze': ['morning_routine', 'improve_energy'],

  // ============ PRODUCTIVITY/EFFECTIVENESS GOALS ============
  'stop_procrastinating': ['task_completion', 'focus_improvement', 'declutter_momentum'],
  'improve_focus': ['focus_improvement', 'reduce_distractions', 'deep_work'],
  'better_time_management': ['schedule_management', 'task_prioritization', 'declutter_momentum'],
  'declutter_spaces': ['declutter', 'organize_home', 'paper_clutter'],
  'organize_digital_life': ['organize_workspace', 'digital_clutter'],
  'build_daily_routine': ['morning_routine', 'stress_reset_routine'],
  'prioritize_tasks': ['task_prioritization', 'decision_making', 'mindset_shift'],
  'finish_what_start': ['task_completion', 'follow_through'],
  'reduce_overwhelm': ['stress_coping_plan', 'task_prioritization', 'mindset_shift'],
  'improve_planning': ['task_planning', 'schedule_management', 'declutter_momentum'],

  // Effectiveness-specific goals from effectiveness_specifics question
  'better_sleep': ['improve_sleep', 'sleep_quality'],
  'better_energy': ['improve_energy', 'improve_mood'],
  'manage_stress': ['stress_coping_plan', 'stress_reset_routine', 'stress_eating'],  // Already exists in mindset but adding here for clarity

  // ============ EXERCISE GOALS ============
  'start_exercising': ['improve_energy', 'exercise_habit'],
  'consistent_workouts': ['exercise_habit', 'workout_routine'],
  'build_strength': ['strength_performance', 'muscle_gain'],
  'improve_cardio': ['endurance_performance', 'heart_health'],
  'increase_flexibility': ['flexibility', 'mobility'],
  'exercise_lose_weight': ['weight_loss', 'improve_energy'],
  'exercise_for_energy': ['improve_energy', 'improve_mood'],
  'find_enjoyable_exercise': ['exercise_enjoyment', 'mindset_shift'],
  'workout_at_home': ['home_fitness', 'workout_routine'],
  'more_active_lifestyle': ['exercise_habit', 'improve_energy'],
  'boost_endurance': ['endurance_performance'],
  'increase_strength_performance': ['strength_performance'],

  // ============ MINDSET GOALS ============
  'manage_stress': ['stress_coping_plan', 'stress_reset_routine', 'mindset_shift'],
  'reduce_anxiety': ['anxiety_management', 'mindset_shift', 'improve_mood'],
  'stop_negative_thoughts': ['positive_thinking', 'mindset_shift'],
  'practice_self_compassion': ['self_compassion', 'mindset_shift'],
  'build_confidence': ['build_confidence', 'mindset_shift'],
  'practice_mindfulness': ['mindfulness_practice', 'mindful_eating'],
  'cultivate_gratitude': ['gratitude_practice', 'mindset_shift', 'improve_mood'],
  'set_boundaries': ['healthy_boundaries', 'mindset_shift'],
  'overcome_perfectionism': ['overcome_perfectionism', 'mindset_shift'],
  'stay_motivated': ['goal_achievement', 'mindset_shift'],

  // ============ RELATIONSHIP GOALS ============
  // Note: Most relationship goals don't have direct tip database matches
  // These might need new tips or could map to general wellness goals
  'improve_communication': ['better_communication', 'mindset_shift'],
  'more_quality_time': ['relationship_time', 'declutter_momentum'],
  'stronger_social_connections': ['social_support', 'community_building'],
  'handle_conflicts_better': ['conflict_skills', 'mindset_shift'],
  'express_needs_clearly': ['assertiveness', 'mindset_shift'],
  'become_better_listener': ['active_listening', 'mindfulness_practice'],
  'improve_work_life_balance': ['work_life_balance', 'boundary_setting'],
  'more_family_time': ['family_connection', 'meal_prep'],
  'build_dating_confidence': ['dating_confidence', 'build_confidence'],
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