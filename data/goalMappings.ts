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
  'more_veggies': ['increase_veggies', 'increase_vegetables', 'veggie_exposure', 'produce_intake'],
  'less_junk': ['less_processed_food', 'reduce_ultra_processed', 'reduce_takeout'],
  'portion_control': ['portion_control', 'satiety'],
  'less_sugar': ['reduce_sugar', 'reduce_cravings', 'stable_blood_sugar'],
  'more_protein': ['increase_protein', 'protein_intake'],
  'drink_water': ['hydration', 'improve_hydration', 'increase_hydration'],
  'mindful_eating': ['mindful_eating', 'satiety', 'self_awareness'],
  'meal_planning': ['meal_prep', 'time_saving'],
  'cook_more': ['meal_prep', 'food_safety'],
  'eating_schedule': ['morning_routine', 'healthy_breakfast', 'stable_blood_sugar'],
  'no_binge': ['emotional_eating', 'stress_eating', 'evening_grazing', 'craving_management'],
  'diabetic_eating': ['stable_blood_sugar', 'reduce_sugar', 'portion_control'],
  'pregnancy_eating': ['healthy_pregnancy', 'nutrient_density', 'food_safety'],
  'plant_based': ['plant_based', 'increase_veggies', 'increase_vegetables'],
  'no_alcohol': ['alcohol_free'],
  'increase_fiber': ['fiber_intake', 'increase_fiber', 'gut_health'],
  'weight_loss': ['weight_loss', 'portion_control', 'satiety'],
  'muscle_gain': ['muscle_gain', 'protein_intake', 'increase_protein'],
  'manage_cravings': ['craving_management', 'craving_satisfaction', 'reduce_cravings'],
  'reduce_processed': ['less_processed_food', 'reduce_ultra_processed'],
  'restaurant_better': ['reduce_takeout', 'mindful_eating', 'portion_control'],
  'reduce_caffeine': ['reduce_caffeine'],
  'reduce_carbs': ['reduce_carbs', 'stable_blood_sugar'],
  'reduce_fat': ['reduce_fat', 'better_lipids'],
  'reduce_sodium': ['reduce_sodium', 'heart_health'],

  // ============ SLEEP GOALS ============
  'fall_asleep': ['improve_sleep', 'sleep_quality'],
  'stay_asleep': ['improve_sleep', 'sleep_quality'],
  'earlier_bedtime': ['improve_sleep', 'morning_routine'],
  'consistent_schedule': ['sleep_routine', 'morning_routine', 'sleep_quality'],
  'wake_refreshed': ['improve_sleep', 'sleep_quality', 'improve_energy'],
  'less_screen': ['improve_sleep', 'sleep_quality'],
  'wind_down': ['improve_sleep', 'sleep_quality', 'mindset_shift'],
  'sleep_environment': ['improve_sleep', 'sleep_quality'],
  'stop_snoozing': ['morning_routine', 'improve_energy', 'wake_discipline'],

  // ============ PRODUCTIVITY GOALS ============
  'procrastination': ['task_completion', 'motivation', 'focus_improvement'],
  'focus': ['focus_improvement', 'reduce_distractions', 'deep_work'],
  'time_management': ['time_saving', 'task_prioritization', 'schedule_management'],
  'declutter': ['declutter', 'organize_home'],
  'organize_digital': ['organize_workspace', 'digital_organization'],
  'daily_routine': ['morning_routine', 'daily_structure', 'better_habits'],
  'prioritize': ['task_prioritization', 'decision_making', 'mindset_shift'],
  'finish_tasks': ['task_completion', 'follow_through', 'motivation'],
  'less_overwhelm': ['stress_management', 'task_prioritization', 'mindset_shift'],
  'planning': ['task_planning', 'schedule_management', 'time_saving'],

  // ============ EXERCISE GOALS ============
  'start_moving': ['improve_energy', 'exercise_habit'],
  'consistency': ['exercise_habit', 'workout_routine', 'better_habits'],
  'strength': ['strength_performance', 'muscle_gain'],
  'cardio': ['endurance_performance', 'heart_health'],
  'flexibility': ['flexibility', 'mobility'],
  'exercise_weight_loss': ['weight_loss', 'improve_energy'],
  'energy': ['improve_energy', 'improve_mood'],
  'find_enjoyable': ['motivation', 'exercise_enjoyment'],
  'home_workouts': ['home_fitness', 'workout_routine'],
  'active_lifestyle': ['better_habits', 'improve_energy', 'daily_movement'],
  'endurance_performance': ['endurance_performance'],
  'strength_performance': ['strength_performance'],

  // ============ MINDSET GOALS ============
  'stress': ['stress_management', 'stress_eating', 'mindset_shift'],
  'anxiety': ['anxiety_management', 'mindset_shift', 'improve_mood'],
  'negative_thoughts': ['positive_thinking', 'mindset_shift', 'self_awareness'],
  'self_compassion': ['self_compassion', 'self_awareness', 'mindset_shift'],
  'confidence': ['build_confidence', 'self_awareness'],
  'mindfulness': ['mindfulness_practice', 'mindful_eating', 'self_awareness'],
  'gratitude': ['gratitude_practice', 'mindset_shift', 'improve_mood'],
  'boundaries': ['healthy_boundaries', 'self_awareness'],
  'perfectionism': ['overcome_perfectionism', 'mindset_shift', 'self_awareness'],
  'motivation': ['motivation', 'goal_achievement'],

  // ============ RELATIONSHIP GOALS ============
  // Note: Most relationship goals don't have direct tip database matches
  // These might need new tips or could map to general wellness goals
  'communication': ['better_communication', 'self_awareness'],
  'quality_time': ['relationship_time', 'time_saving'],
  'social_connection': ['social_support', 'community_building'],
  'conflict_resolution': ['conflict_skills', 'self_awareness', 'mindset_shift'],
  'express_needs': ['assertiveness', 'self_awareness'],
  'listening': ['active_listening', 'mindfulness_practice', 'self_awareness'],
  'work_life_balance': ['work_life_balance', 'time_saving', 'boundary_setting'],
  'family_time': ['family_connection', 'time_saving', 'meal_prep'],
  'dating': ['dating_confidence', 'build_confidence', 'self_awareness'],
  'friendships': ['friendship_building', 'social_support']
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
  { value: 'no_binge', label: 'Stop binge eating / stress snacking' },
  { value: 'diabetic_eating', label: 'Manage blood sugar (diabetic)' },
  { value: 'pregnancy_eating', label: 'Eat better during pregnancy' },
  { value: 'plant_based', label: 'Switch to plant-based' },
  { value: 'no_alcohol', label: 'Cut out alcohol' },
  { value: 'increase_fiber', label: 'Increase fiber intake' },
  { value: 'weight_loss', label: 'Lose weight' },
  { value: 'muscle_gain', label: 'Build muscle' },
  { value: 'manage_cravings', label: 'Manage cravings better' },
  { value: 'reduce_processed', label: 'Cut processed foods' },
  { value: 'restaurant_better', label: 'Make better restaurant choices' },
  { value: 'reduce_caffeine', label: 'Reduce caffeine' },
  { value: 'reduce_carbs', label: 'Lower carb intake' },
  { value: 'reduce_fat', label: 'Reduce fat intake' },
  { value: 'reduce_sodium', label: 'Lower sodium' },
];

/**
 * Exercise goals to add
 */
export const NEW_EXERCISE_GOALS_TO_ADD = [
  { value: 'endurance_performance', label: 'Improve endurance/stamina' },
  { value: 'strength_performance', label: 'Increase strength performance' },
];