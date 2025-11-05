/**
 * Dynamic Option Mappings
 * Maps "why" question responses to relevant options in follow-up questions
 * This creates a personalized quiz experience based on user motivations
 */

import { QuizOption } from '../types/quiz';

// Type for mapping why values to what worked options
export type WhyToOptionsMapping = {
  [whyValue: string]: QuizOption[];
};

// ============ SLEEP/ENERGY WHY MAPPINGS ============

export const SLEEP_WHY_TO_WHAT_WORKED: WhyToOptionsMapping = {
  // If exhausted/tired
  'exhausted': [
    { value: 'consistent_schedule', label: 'Consistent sleep schedule' },
    { value: 'power_naps', label: 'Strategic napping' },
    { value: 'bedroom_setup', label: 'Better bedroom setup' },
    { value: 'sleep_supplements', label: 'Sleep supplements' },
  ],

  // If productivity focused
  'productivity': [
    { value: 'morning_routine', label: 'Morning routine' },
    { value: 'sleep_tracking', label: 'Sleep tracking' },
    { value: 'no_screens', label: 'No screens before bed' },
    { value: 'time_blocking', label: 'Time-blocked sleep schedule' },
  ],

  // If mood/mental health
  'mood': [
    { value: 'meditation', label: 'Meditation/relaxation' },
    { value: 'exercise', label: 'Regular exercise' },
    { value: 'journaling', label: 'Evening journaling' },
    { value: 'therapy', label: 'Therapy/counseling' },
  ],

  // If health concerns
  'health_concerns': [
    { value: 'sleep_study', label: 'Sleep study/medical help' },
    { value: 'cpap', label: 'CPAP or medical device' },
    { value: 'medication_review', label: 'Reviewing medications' },
    { value: 'diet_changes', label: 'Diet adjustments' },
  ],

  // If work performance
  'work_performance': [
    { value: 'caffeine_timing', label: 'Managing caffeine' },
    { value: 'lunch_naps', label: 'Lunch break naps' },
    { value: 'standing_desk', label: 'Standing desk for alertness' },
    { value: 'bright_light', label: 'Bright light therapy' },
  ],

  // If safety concerns
  'safety': [
    { value: 'alarm_apps', label: 'Multiple alarm apps' },
    { value: 'sleep_partner', label: 'Accountability partner' },
    { value: 'doctor_visit', label: 'Medical evaluation' },
    { value: 'driving_alternatives', label: 'Alternative transportation' },
  ],

  // If mental clarity
  'mental_clarity': [
    { value: 'no_alcohol', label: 'Avoiding alcohol' },
    { value: 'hydration', label: 'Better hydration' },
    { value: 'brain_dump', label: 'Brain dump before bed' },
    { value: 'morning_sunlight', label: 'Morning sunlight exposure' },
  ],

  // If physical recovery
  'physical_recovery': [
    { value: 'stretching', label: 'Evening stretching' },
    { value: 'magnesium', label: 'Magnesium supplement' },
    { value: 'recovery_tools', label: 'Recovery tools (foam roll, etc)' },
    { value: 'sleep_position', label: 'Better sleep position' },
  ],

  // If quality of life
  'quality_of_life': [
    { value: 'sleep_ritual', label: 'Calming bedtime ritual' },
    { value: 'weekend_catchup', label: 'Weekend sleep strategy' },
    { value: 'vacation_reset', label: 'Sleep reset vacation' },
    { value: 'lifestyle_change', label: 'Major lifestyle change' },
  ],

  // If role model
  'role_model': [
    { value: 'family_routine', label: 'Family bedtime routine' },
    { value: 'leading_example', label: 'Leading by example' },
    { value: 'household_rules', label: 'Household sleep rules' },
    { value: 'education', label: 'Teaching about sleep' },
  ],
};

// ============ NUTRITION WHY MAPPINGS ============

export const NUTRITION_WHY_TO_WHAT_WORKED: WhyToOptionsMapping = {
  // If health scare/medical
  'health_scare': [
    { value: 'doctor_plan', label: 'Following doctor\'s plan' },
    { value: 'medical_tracking', label: 'Tracking health markers' },
    { value: 'support_group', label: 'Health support group' },
    { value: 'nutritionist', label: 'Working with nutritionist' },
  ],

  // If look better
  'look_better': [
    { value: 'progress_photos', label: 'Progress photos' },
    { value: 'clothes_goals', label: 'Goal clothes' },
    { value: 'tracking_measurements', label: 'Body measurements' },
    { value: 'visual_reminders', label: 'Visual motivation' },
  ],

  // If feel better
  'feel_better': [
    { value: 'energy_journal', label: 'Energy level tracking' },
    { value: 'elimination_diet', label: 'Elimination diet' },
    { value: 'intuitive_eating', label: 'Intuitive eating' },
    { value: 'mood_food_tracking', label: 'Mood-food connection' },
  ],

  // If role model
  'role_model': [
    { value: 'family_meals', label: 'Family meal planning' },
    { value: 'cooking_together', label: 'Cooking with kids/family' },
    { value: 'garden', label: 'Growing own food' },
    { value: 'education', label: 'Teaching nutrition' },
  ],

  // If athletic goals
  'athletic_goals': [
    { value: 'meal_timing', label: 'Strategic meal timing' },
    { value: 'sports_nutrition', label: 'Sports nutrition plan' },
    { value: 'performance_tracking', label: 'Performance metrics' },
    { value: 'coach_guidance', label: 'Coach/trainer guidance' },
  ],

  // If pregnancy
  'pregnancy': [
    { value: 'prenatal_vitamins', label: 'Prenatal supplements' },
    { value: 'safe_foods', label: 'Safe food lists' },
    { value: 'small_meals', label: 'Small frequent meals' },
    { value: 'pregnancy_apps', label: 'Pregnancy nutrition apps' },
  ],

  // If chronic condition
  'chronic_condition': [
    { value: 'medication_timing', label: 'Food with medications' },
    { value: 'symptom_tracking', label: 'Symptom diary' },
    { value: 'trigger_foods', label: 'Identifying triggers' },
    { value: 'medical_meal_plan', label: 'Medical meal plan' },
  ],

  // If aging well
  'aging_well': [
    { value: 'mediterranean', label: 'Mediterranean style' },
    { value: 'anti_inflammatory', label: 'Anti-inflammatory foods' },
    { value: 'supplements', label: 'Targeted supplements' },
    { value: 'social_meals', label: 'Social eating' },
  ],

  // If confidence
  'confidence': [
    { value: 'success_journal', label: 'Success journaling' },
    { value: 'affirmations', label: 'Daily affirmations' },
    { value: 'non_scale_wins', label: 'Non-scale victories' },
    { value: 'self_compassion', label: 'Self-compassion practice' },
  ],

  // If tired of struggling
  'tired_of_struggling': [
    { value: 'simple_swaps', label: 'Simple food swaps' },
    { value: 'one_change', label: 'One change at a time' },
    { value: 'flexible_approach', label: '80/20 approach' },
    { value: 'no_restriction', label: 'No foods off limits' },
  ],
};

// ============ FITNESS WHY MAPPINGS ============

export const FITNESS_WHY_TO_WHAT_WORKED: WhyToOptionsMapping = {
  // For appearance/look better goals
  'appearance': [
    { value: 'progress_photos', label: 'Progress photos' },
    { value: 'strength_training', label: 'Weight training' },
    { value: 'hiit', label: 'HIIT workouts' },
    { value: 'body_measurements', label: 'Track measurements' },
  ],

  'look_better': [
    { value: 'progress_photos', label: 'Progress photos' },
    { value: 'strength_training', label: 'Weight training' },
    { value: 'hiit', label: 'HIIT workouts' },
    { value: 'consistency', label: 'Consistent schedule' },
  ],

  // For strength and functional goals
  'functional_strength': [
    { value: 'compound_movements', label: 'Compound exercises' },
    { value: 'bodyweight', label: 'Bodyweight training' },
    { value: 'core_work', label: 'Core strengthening' },
    { value: 'functional_patterns', label: 'Movement patterns' },
  ],

  'strength': [
    { value: 'progressive_overload', label: 'Progressive overload' },
    { value: 'compound_exercises', label: 'Compound movements' },
    { value: 'personal_trainer', label: 'Personal trainer' },
    { value: 'strength_program', label: 'Structured program' },
  ],

  // For energy and vitality
  'energy': [
    { value: 'morning_workout', label: 'Morning exercise' },
    { value: 'lunch_walks', label: 'Lunch break walks' },
    { value: 'desk_exercises', label: 'Desk exercises' },
    { value: 'active_breaks', label: 'Active work breaks' },
  ],

  // For confidence building
  'confidence': [
    { value: 'small_wins', label: 'Small victories' },
    { value: 'group_fitness', label: 'Group classes' },
    { value: 'personal_records', label: 'Track PRs' },
    { value: 'workout_selfies', label: 'Document progress' },
  ],

  // For health management
  'health': [
    { value: 'doctor_approved', label: 'Doctor-approved plan' },
    { value: 'health_tracking', label: 'Track health markers' },
    { value: 'moderate_exercise', label: 'Moderate intensity' },
    { value: 'regular_checkups', label: 'Regular checkups' },
  ],

  'health_issues': [
    { value: 'physical_therapy', label: 'Physical therapy' },
    { value: 'low_impact', label: 'Low impact exercise' },
    { value: 'medical_clearance', label: 'Doctor guidance' },
    { value: 'cardiac_rehab', label: 'Rehab program' },
  ],

  // For family and parenting
  'keep_up_kids': [
    { value: 'playground_workouts', label: 'Playground workouts' },
    { value: 'active_play', label: 'Active play time' },
    { value: 'family_activities', label: 'Family active time' },
    { value: 'home_workouts', label: 'Quick home workouts' },
  ],

  'role_model': [
    { value: 'family_activities', label: 'Family fitness' },
    { value: 'visible_routine', label: 'Visible exercise routine' },
    { value: 'healthy_habits', label: 'Model healthy habits' },
    { value: 'involve_family', label: 'Involve family' },
  ],

  // For mental health
  'mental_health': [
    { value: 'outdoor_exercise', label: 'Outdoor activities' },
    { value: 'yoga', label: 'Yoga practice' },
    { value: 'group_classes', label: 'Group fitness' },
    { value: 'mindful_movement', label: 'Mindful movement' },
  ],

  'stress_relief': [
    { value: 'boxing', label: 'Boxing/kickboxing' },
    { value: 'running', label: 'Running/jogging' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'dance', label: 'Dance classes' },
  ],

  // For athletic performance
  'athletic_performance': [
    { value: 'sport_specific', label: 'Sport-specific training' },
    { value: 'performance_coach', label: 'Performance coach' },
    { value: 'recovery_protocol', label: 'Recovery protocol' },
    { value: 'nutrition_timing', label: 'Nutrition timing' },
  ],

  'athletic_event': [
    { value: 'training_plan', label: 'Training plan' },
    { value: 'coach', label: 'Coach or mentor' },
    { value: 'race_registration', label: 'Event registration' },
    { value: 'training_group', label: 'Training group' },
  ],

  // For aging well
  'aging_well': [
    { value: 'balance_work', label: 'Balance exercises' },
    { value: 'flexibility', label: 'Flexibility work' },
    { value: 'functional_fitness', label: 'Functional movements' },
    { value: 'senior_classes', label: 'Age-appropriate classes' },
  ],

  // For metabolism
  'metabolism': [
    { value: 'strength_training', label: 'Build muscle mass' },
    { value: 'hiit', label: 'HIIT workouts' },
    { value: 'protein_timing', label: 'Protein timing' },
    { value: 'morning_workout', label: 'Morning exercise' },
  ],

  // For consistency and habit building
  'consistency': [
    { value: 'habit_stacking', label: 'Habit stacking' },
    { value: 'workout_calendar', label: 'Workout calendar' },
    { value: 'accountability_buddy', label: 'Accountability partner' },
    { value: 'small_commitments', label: 'Start small' },
  ],

  'habit': [
    { value: 'same_time', label: 'Same time daily' },
    { value: 'prep_night_before', label: 'Prep night before' },
    { value: 'visible_reminders', label: 'Visual cues' },
    { value: 'reward_system', label: 'Reward system' },
  ],

  // For social connection
  'social': [
    { value: 'workout_buddy', label: 'Workout partner' },
    { value: 'fitness_classes', label: 'Group classes' },
    { value: 'sports_league', label: 'Sports league' },
    { value: 'running_club', label: 'Running/walking club' },
  ],

  // For convenience and logistics
  'convenience': [
    { value: 'home_equipment', label: 'Home equipment' },
    { value: 'youtube_workouts', label: 'YouTube workouts' },
    { value: 'fitness_apps', label: 'Fitness apps' },
    { value: 'minimal_equipment', label: 'Minimal equipment' },
  ],

  'save_time': [
    { value: 'quick_hiit', label: 'Quick HIIT sessions' },
    { value: 'lunch_workouts', label: 'Lunch break workouts' },
    { value: 'home_gym', label: 'Home gym setup' },
    { value: 'efficient_routines', label: 'Efficient routines' },
  ],

  // For specific physical goals
  'mobility': [
    { value: 'daily_stretching', label: 'Daily stretching' },
    { value: 'mobility_drills', label: 'Mobility drills' },
    { value: 'foam_rolling', label: 'Foam rolling' },
    { value: 'yoga', label: 'Yoga practice' },
  ],

  'endurance': [
    { value: 'couch_to_5k', label: 'Couch to 5K' },
    { value: 'interval_training', label: 'Interval training' },
    { value: 'progressive_cardio', label: 'Progressive cardio' },
    { value: 'cross_training', label: 'Cross training' },
  ],

  'weight_loss': [
    { value: 'calorie_tracking', label: 'Track calories burned' },
    { value: 'cardio_strength_combo', label: 'Cardio + strength' },
    { value: 'daily_steps', label: '10K steps daily' },
    { value: 'active_lifestyle', label: 'Active lifestyle' },
  ],
};

// ============ PRODUCTIVITY WHY MAPPINGS ============

export const PRODUCTIVITY_WHY_TO_WHAT_WORKED: WhyToOptionsMapping = {
  // If career growth
  'career_growth': [
    { value: 'time_blocking', label: 'Time blocking' },
    { value: 'deep_work', label: 'Deep work sessions' },
    { value: 'skill_development', label: 'Skill development time' },
    { value: 'networking', label: 'Strategic networking' },
  ],

  // If reduce stress
  'reduce_stress': [
    { value: 'priority_matrix', label: 'Priority matrix' },
    { value: 'delegation', label: 'Delegating tasks' },
    { value: 'saying_no', label: 'Saying no more' },
    { value: 'boundaries', label: 'Work boundaries' },
  ],

  // If more free time
  'more_free_time': [
    { value: 'batching', label: 'Task batching' },
    { value: 'automation', label: 'Automating tasks' },
    { value: 'elimination', label: 'Eliminating tasks' },
    { value: 'efficient_systems', label: 'Efficient systems' },
  ],

  // If achieve goals
  'achieve_goals': [
    { value: 'goal_setting', label: 'SMART goals' },
    { value: 'accountability', label: 'Accountability partner' },
    { value: 'progress_tracking', label: 'Progress tracking' },
    { value: 'milestone_rewards', label: 'Milestone rewards' },
  ],

  // If financial
  'financial': [
    { value: 'side_hustle_time', label: 'Side hustle schedule' },
    { value: 'income_goals', label: 'Income-focused tasks' },
    { value: 'roi_prioritization', label: 'ROI prioritization' },
    { value: 'money_tracking', label: 'Financial tracking' },
  ],

  // If role model
  'role_model': [
    { value: 'visible_planning', label: 'Visible planning' },
    { value: 'family_calendar', label: 'Family calendar' },
    { value: 'teaching_skills', label: 'Teaching productivity' },
    { value: 'leading_example', label: 'Leading by example' },
  ],

  // If self worth
  'self_worth': [
    { value: 'accomplishment_list', label: 'Done lists' },
    { value: 'celebration', label: 'Celebrating wins' },
    { value: 'progress_journal', label: 'Progress journal' },
    { value: 'skill_building', label: 'Skill building' },
  ],

  // If balance
  'balance': [
    { value: 'work_hours', label: 'Fixed work hours' },
    { value: 'energy_management', label: 'Energy management' },
    { value: 'theme_days', label: 'Theme days' },
    { value: 'integration', label: 'Work-life integration' },
  ],

  // If creative time
  'creative_time': [
    { value: 'creative_blocks', label: 'Creative time blocks' },
    { value: 'inspiration_time', label: 'Inspiration gathering' },
    { value: 'maker_schedule', label: 'Maker schedule' },
    { value: 'creative_rituals', label: 'Creative rituals' },
  ],

  // If falling behind
  'falling_behind': [
    { value: 'catch_up_days', label: 'Catch-up days' },
    { value: 'realistic_planning', label: 'Realistic estimates' },
    { value: 'buffer_time', label: 'Buffer time' },
    { value: 'simplification', label: 'Simplifying systems' },
  ],
};

// ============ RELATIONSHIP WHY MAPPINGS ============

export const RELATIONSHIP_WHY_TO_WHAT_WORKED: WhyToOptionsMapping = {
  // If lonely
  'lonely': [
    { value: 'social_activities', label: 'Regular social activities' },
    { value: 'online_communities', label: 'Online communities' },
    { value: 'volunteering', label: 'Volunteering' },
    { value: 'pet_companionship', label: 'Pet companionship' },
  ],

  // If strengthen bonds
  'strengthen_bonds': [
    { value: 'quality_time', label: 'Scheduled quality time' },
    { value: 'shared_activities', label: 'Shared hobbies' },
    { value: 'regular_checkins', label: 'Regular check-ins' },
    { value: 'traditions', label: 'Creating traditions' },
  ],

  // If conflict resolution
  'conflict_resolution': [
    { value: 'communication_skills', label: 'Communication training' },
    { value: 'therapy', label: 'Couples/family therapy' },
    { value: 'cool_down_periods', label: 'Cool-down rules' },
    { value: 'mediation', label: 'Third-party mediation' },
  ],

  // If role model
  'role_model': [
    { value: 'family_meetings', label: 'Family meetings' },
    { value: 'teaching_moments', label: 'Teaching moments' },
    { value: 'modeling_behavior', label: 'Modeling behavior' },
    { value: 'open_communication', label: 'Open communication' },
  ],

  // If support system
  'support_system': [
    { value: 'reciprocal_help', label: 'Reciprocal helping' },
    { value: 'support_groups', label: 'Support groups' },
    { value: 'professional_help', label: 'Professional support' },
    { value: 'chosen_family', label: 'Building chosen family' },
  ],

  // If happiness
  'happiness': [
    { value: 'gratitude_practice', label: 'Gratitude for people' },
    { value: 'celebration', label: 'Celebrating together' },
    { value: 'laughter', label: 'More laughter/fun' },
    { value: 'positive_people', label: 'Positive people only' },
  ],

  // If life transition
  'life_transition': [
    { value: 'new_connections', label: 'New social circles' },
    { value: 'transition_support', label: 'Transition support' },
    { value: 'letting_go', label: 'Letting go gracefully' },
    { value: 'rebuilding', label: 'Rebuilding connections' },
  ],

  // If repair
  'repair': [
    { value: 'apologies', label: 'Genuine apologies' },
    { value: 'forgiveness_work', label: 'Forgiveness work' },
    { value: 'rebuilding_trust', label: 'Trust building' },
    { value: 'professional_help', label: 'Mediation/therapy' },
  ],

  // If growth
  'growth': [
    { value: 'self_awareness', label: 'Self-awareness work' },
    { value: 'feedback', label: 'Seeking feedback' },
    { value: 'relationship_books', label: 'Relationship education' },
    { value: 'practice', label: 'Practice new skills' },
  ],

  // If mental health
  'mental_health': [
    { value: 'therapy', label: 'Individual therapy' },
    { value: 'boundaries', label: 'Healthy boundaries' },
    { value: 'self_care', label: 'Self-care first' },
    { value: 'support_network', label: 'Support network' },
  ],
};

// ============ HELPER FUNCTIONS ============

/**
 * Get combined options for what worked based on selected why reasons
 * @param whySelections Array of why values selected by user
 * @param mappingSet The mapping to use (e.g., SLEEP_WHY_TO_WHAT_WORKED)
 * @returns Combined unique options for what worked question
 */
export function getCombinedOptionsForWhy(
  whySelections: string[],
  mappingSet: WhyToOptionsMapping
): QuizOption[] {
  const optionsMap = new Map<string, QuizOption>();

  // Add default/common options that should always appear
  const defaultOptions: QuizOption[] = [
    { value: 'nothing_yet', label: "Nothing's really worked yet" },
    { value: 'not_sure', label: "Not sure what's worked" },
  ];

  defaultOptions.forEach(opt => {
    optionsMap.set(opt.value, opt);
  });

  // Add specific options based on why selections
  whySelections.forEach(whyValue => {
    const options = mappingSet[whyValue] || [];
    options.forEach(opt => {
      optionsMap.set(opt.value, opt);
    });
  });

  // Return as array, maintaining order
  return Array.from(optionsMap.values());
}

/**
 * Get dynamic options for a question based on previous responses
 * @param questionId The question to get options for
 * @param responses All user responses so far
 * @returns Dynamic options for the question
 */
export function getDynamicOptions(
  questionId: string,
  responses: Array<{ questionId: string; values: string[] }>
): QuizOption[] | null {
  // Find ALL why question responses (there might be multiple if user selected 2 goals)
  const whyResponses = responses.filter(r => r.questionId.includes('_why'));

  if (whyResponses.length === 0) {
    return null; // No why question answered yet
  }

  // Combine all why values from all why questions
  const allWhyValues: string[] = [];
  whyResponses.forEach(response => {
    allWhyValues.push(...response.values);
  });

  // Determine which mapping(s) to use based on the question ID
  let mappings: WhyToOptionsMapping[] = [];

  if (questionId === 'what_worked_energy') {
    mappings.push(SLEEP_WHY_TO_WHAT_WORKED);
    // Could also include nutrition mappings if user selected nutrition goals
    const hasNutritionGoals = responses.find(r =>
      r.questionId === 'energy_specifics' &&
      r.values.some(v => ['reduce_sugar', 'eat_more_protein', 'drink_more_water', 'regular_meal_schedule'].includes(v))
    );
    if (hasNutritionGoals) {
      mappings.push(NUTRITION_WHY_TO_WHAT_WORKED);
    }
  } else if (questionId === 'what_worked_nutrition') {
    mappings.push(NUTRITION_WHY_TO_WHAT_WORKED);
    // Also add look_feel mappings if relevant
    const hasLookFeelGoals = responses.find(r =>
      r.questionId === 'look_feel_specifics'
    );
    if (hasLookFeelGoals) {
      mappings.push(LOOK_FEEL_WHY_TO_WHAT_WORKED);
    }
  } else if (questionId === 'what_worked_fitness') {
    mappings.push(FITNESS_WHY_TO_WHAT_WORKED);
  } else if (questionId === 'what_worked_productivity') {
    mappings.push(PRODUCTIVITY_WHY_TO_WHAT_WORKED);
  } else if (questionId === 'what_worked_health') {
    mappings.push(HEALTH_WHY_TO_WHAT_WORKED);
  } else if (questionId === 'what_worked_look_feel') {
    mappings.push(LOOK_FEEL_WHY_TO_WHAT_WORKED);
  } else if (questionId.includes('what_worked') &&
             (questionId.includes('relationship') ||
              questionId.includes('romantic') ||
              questionId.includes('family') ||
              questionId.includes('friendships') ||
              questionId.includes('boundaries'))) {
    mappings.push(RELATIONSHIP_WHY_TO_WHAT_WORKED);
  } else if (questionId === 'what_worked_general') {
    // General can pull from multiple mappings based on primary motivation
    const primaryMotivation = responses.find(r => r.questionId === 'primary_motivation');
    if (primaryMotivation) {
      if (primaryMotivation.values.includes('energy')) mappings.push(SLEEP_WHY_TO_WHAT_WORKED);
      if (primaryMotivation.values.includes('nutrition')) mappings.push(NUTRITION_WHY_TO_WHAT_WORKED);
      if (primaryMotivation.values.includes('fitness')) mappings.push(FITNESS_WHY_TO_WHAT_WORKED);
      if (primaryMotivation.values.includes('look_feel')) mappings.push(LOOK_FEEL_WHY_TO_WHAT_WORKED);
      if (primaryMotivation.values.includes('health')) mappings.push(HEALTH_WHY_TO_WHAT_WORKED);
      if (primaryMotivation.values.includes('effectiveness')) mappings.push(PRODUCTIVITY_WHY_TO_WHAT_WORKED);
      if (primaryMotivation.values.includes('relationships')) mappings.push(RELATIONSHIP_WHY_TO_WHAT_WORKED);
    }
  }

  if (mappings.length === 0) {
    return null; // No dynamic options for this question
  }

  // Combine options from all relevant mappings
  const optionsMap = new Map<string, QuizOption>();

  // Add default options
  const defaultOptions: QuizOption[] = [
    { value: 'nothing_yet', label: "Nothing's really worked yet" },
    { value: 'not_sure', label: "Not sure what's worked" },
  ];
  defaultOptions.forEach(opt => optionsMap.set(opt.value, opt));

  // Add options from each mapping based on why values
  mappings.forEach(mapping => {
    allWhyValues.forEach(whyValue => {
      const options = mapping[whyValue] || [];
      options.forEach(opt => {
        optionsMap.set(opt.value, opt);
      });
    });
  });

  return Array.from(optionsMap.values());
}

// ============ LOOK_FEEL WHY MAPPINGS ============

export const LOOK_FEEL_WHY_TO_WHAT_WORKED: WhyToOptionsMapping = {
  // Appearance focused
  'appearance': [
    { value: 'progress_photos', label: 'Progress photos' },
    { value: 'outfit_goals', label: 'Goal outfits' },
    { value: 'style_upgrade', label: 'Style improvements' },
    { value: 'grooming_routine', label: 'Better grooming' },
  ],

  'back_pain': [
    { value: 'ergonomic_setup', label: 'Ergonomic workspace' },
    { value: 'stretching_routine', label: 'Daily stretches' },
    { value: 'posture_reminders', label: 'Posture alerts' },
    { value: 'core_exercises', label: 'Core strengthening' },
  ],

  'dark_circles': [
    { value: 'sleep_hygiene', label: 'Sleep hygiene' },
    { value: 'eye_care', label: 'Eye care routine' },
    { value: 'hydration_tracking', label: 'Hydration tracking' },
    { value: 'stress_management', label: 'Stress reduction' },
  ],

  'skin_issues': [
    { value: 'skincare_routine', label: 'Consistent skincare' },
    { value: 'diet_tracking', label: 'Food-skin diary' },
    { value: 'stress_reduction', label: 'Stress management' },
    { value: 'hydration', label: 'Water intake' },
  ],

  'wardrobe_use': [
    { value: 'closet_organization', label: 'Closet organization' },
    { value: 'outfit_planning', label: 'Outfit planning' },
    { value: 'weight_tracking', label: 'Size tracking' },
    { value: 'donation_purge', label: 'Regular purging' },
  ],

  'skin_glow': [
    { value: 'water_tracking', label: 'Water tracking app' },
    { value: 'hydration_reminders', label: 'Hydration reminders' },
    { value: 'infused_water', label: 'Flavored water' },
    { value: 'hydrating_foods', label: 'Water-rich foods' },
  ],

  'body_composition': [
    { value: 'measurements', label: 'Body measurements' },
    { value: 'dexa_scan', label: 'Body scans' },
    { value: 'strength_cardio', label: 'Strength + cardio' },
    { value: 'protein_intake', label: 'Protein tracking' },
  ],
};

// ============ HEALTH WHY MAPPINGS ============

export const HEALTH_WHY_TO_WHAT_WORKED: WhyToOptionsMapping = {
  'physical_symptoms': [
    { value: 'symptom_diary', label: 'Symptom tracking' },
    { value: 'stress_techniques', label: 'Stress techniques' },
    { value: 'medical_consultation', label: 'Doctor consultation' },
    { value: 'lifestyle_changes', label: 'Lifestyle changes' },
  ],

  'immune_function': [
    { value: 'sleep_schedule', label: 'Sleep consistency' },
    { value: 'vitamin_d', label: 'Vitamin D' },
    { value: 'probiotics', label: 'Gut health' },
    { value: 'stress_management', label: 'Stress reduction' },
  ],

  'inflammation': [
    { value: 'anti_inflammatory_diet', label: 'Anti-inflammatory foods' },
    { value: 'omega_3', label: 'Omega-3s' },
    { value: 'turmeric', label: 'Turmeric/spices' },
    { value: 'elimination_diet', label: 'Elimination diet' },
  ],

  'kidney_health': [
    { value: 'water_bottle', label: 'Large water bottle' },
    { value: 'hydration_app', label: 'Tracking app' },
    { value: 'electrolytes', label: 'Electrolyte balance' },
    { value: 'reduce_sodium', label: 'Lower sodium' },
  ],

  'prevention': [
    { value: 'screening_calendar', label: 'Screening calendar' },
    { value: 'health_app', label: 'Health tracking app' },
    { value: 'annual_physical', label: 'Annual physicals' },
    { value: 'specialist_referrals', label: 'Specialist visits' },
  ],
};

// Export all mappings for use in other files
export const ALL_WHY_MAPPINGS = {
  sleep: SLEEP_WHY_TO_WHAT_WORKED,
  nutrition: NUTRITION_WHY_TO_WHAT_WORKED,
  fitness: FITNESS_WHY_TO_WHAT_WORKED,
  lookFeel: LOOK_FEEL_WHY_TO_WHAT_WORKED,
  health: HEALTH_WHY_TO_WHAT_WORKED,
  productivity: PRODUCTIVITY_WHY_TO_WHAT_WORKED,
  relationships: RELATIONSHIP_WHY_TO_WHAT_WORKED,
};