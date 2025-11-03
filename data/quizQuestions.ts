import { QuizQuestion } from '../types/quiz';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ========== QUESTION 1: What brings you here (outcome-focused) ==========
  {
    id: 'primary_motivation',
    question: "What brings you here?",
    type: 'single_choice',
    category: 'goals',
    required: true,
    helpText: 'Pick what matters most to you right now - you can always expand later',
    options: [
      { value: 'energy', label: '⚡ Improving energy levels' },
      { value: 'relationships', label: '💝 Improve relationships' },
      { value: 'effectiveness', label: '🎯 Become more effective' },
      { value: 'fitness', label: '💪 Improve fitness' },
      { value: 'health', label: '🏥 Improve health generally' },
      { value: 'nutrition', label: '🥗 Improve nutrition' },
      { value: 'look_feel', label: '✨ Look and feel better' },
    ]
  },

  // ========== QUESTION 2: Specific goals (conditional on primary motivation) ==========

  // For "Improving energy levels"
  {
    id: 'energy_specifics',
    question: "What specifically would help your energy?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_motivation', values: ['energy'] },
    helpText: "Pick 1-3 that could make the biggest difference",
    options: [
      { value: 'fall_asleep_easier', label: 'Fall asleep easier' },
      { value: 'wake_up_refreshed', label: 'Wake up actually refreshed' },
      { value: 'consistent_sleep_schedule', label: 'Get on a sleep schedule' },
      { value: 'reduce_sugar', label: 'Cut the sugar crashes' },
      { value: 'eat_more_protein', label: 'Get more sustained energy from food' },
      { value: 'drink_more_water', label: 'Stay better hydrated' },
      { value: 'exercise_for_energy', label: 'Use exercise to boost energy' },
      { value: 'manage_stress', label: 'Stop stress from draining me' },
      { value: 'reduce_screen_before_bed', label: 'Less screens disrupting sleep' },
      { value: 'regular_meal_schedule', label: 'Stop energy dips from irregular eating' },
    ]
  },

  // For "Improve relationships"
  {
    id: 'relationship_specifics',
    question: "What relationship area needs work?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_motivation', values: ['relationships'] },
    helpText: "Pick 1-3 to focus on",
    options: [
      { value: 'improve_communication', label: 'Communicate better' },
      { value: 'more_quality_time', label: 'Make more quality time' },
      { value: 'stronger_social_connections', label: 'Build stronger connections' },
      { value: 'handle_conflicts_better', label: 'Handle conflicts better' },
      { value: 'express_needs_clearly', label: 'Express my needs clearly' },
      { value: 'become_better_listener', label: 'Be a better listener' },
      { value: 'improve_work_life_balance', label: 'Balance work and relationships' },
      { value: 'more_family_time', label: 'Spend more family time' },
      { value: 'build_dating_confidence', label: 'Improve my dating life' },
      { value: 'strengthen_friendships', label: 'Nurture friendships better' },
      { value: 'set_boundaries', label: 'Set healthier boundaries' },
    ]
  },

  // For "Become more effective"
  {
    id: 'effectiveness_specifics',
    question: "What would make you more effective?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_motivation', values: ['effectiveness'] },
    helpText: "Pick 1-3 that would help most",
    options: [
      { value: 'stop_procrastinating', label: 'Stop procrastinating' },
      { value: 'improve_focus', label: 'Focus better' },
      { value: 'better_time_management', label: 'Manage time better' },
      { value: 'declutter_spaces', label: 'Declutter my workspace' },
      { value: 'organize_digital_life', label: 'Organize digital chaos' },
      { value: 'build_daily_routine', label: 'Build better routines' },
      { value: 'prioritize_tasks', label: 'Get better at prioritizing' },
      { value: 'finish_what_start', label: 'Actually finish things' },
      { value: 'reduce_overwhelm', label: 'Feel less overwhelmed' },
      { value: 'improve_planning', label: 'Plan ahead better' },
      { value: 'consistent_sleep_schedule', label: 'Fix my sleep schedule' },
    ]
  },

  // For "Improve fitness"
  {
    id: 'fitness_specifics',
    question: "What's your fitness focus?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_motivation', values: ['fitness'] },
    helpText: "Pick 1-3 goals",
    options: [
      { value: 'start_exercising', label: 'Just start moving' },
      { value: 'consistent_workouts', label: 'Be more consistent' },
      { value: 'build_strength', label: 'Build strength' },
      { value: 'improve_cardio', label: 'Improve cardio' },
      { value: 'increase_flexibility', label: 'Increase flexibility' },
      { value: 'exercise_lose_weight', label: 'Exercise for weight loss' },
      { value: 'find_enjoyable_exercise', label: 'Find exercise I enjoy' },
      { value: 'workout_at_home', label: 'Figure out home workouts' },
      { value: 'more_active_lifestyle', label: 'Be more active daily' },
      { value: 'boost_endurance', label: 'Build endurance' },
      { value: 'increase_strength_performance', label: 'Improve performance' },
    ]
  },

  // For "Improve health generally"
  {
    id: 'health_specifics',
    question: "What health areas concern you most?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_motivation', values: ['health'] },
    helpText: "Pick 1-3 priorities",
    options: [
      { value: 'manage_blood_sugar', label: 'Blood sugar management' },
      { value: 'lower_blood_pressure', label: 'Blood pressure' },
      { value: 'improve_gut_health', label: 'Digestive health' },
      { value: 'reduce_inflammation', label: 'Reduce inflammation' },
      { value: 'better_lipids', label: 'Cholesterol levels' },
      { value: 'manage_stress', label: 'Stress management' },
      { value: 'consistent_sleep_schedule', label: 'Better sleep' },
      { value: 'quit_alcohol', label: 'Reduce/quit alcohol' },
      { value: 'reduce_processed_foods', label: 'Cut processed foods' },
      { value: 'drink_more_water', label: 'Better hydration' },
      { value: 'regular_checkups', label: 'Stay on top of health' },
    ]
  },

  // For "Improve nutrition"
  {
    id: 'nutrition_specifics',
    question: "What nutrition changes do you want to make?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_motivation', values: ['nutrition'] },
    helpText: "Pick 1-3 to focus on",
    options: [
      { value: 'eat_more_veggies', label: 'Eat more vegetables' },
      { value: 'reduce_junk_food', label: 'Cut back on junk food' },
      { value: 'control_portions', label: 'Control portions better' },
      { value: 'reduce_sugar', label: 'Reduce sugar intake' },
      { value: 'eat_more_protein', label: 'Get more protein' },
      { value: 'drink_more_water', label: 'Drink more water' },
      { value: 'practice_mindful_eating', label: 'Stop mindless eating' },
      { value: 'improve_meal_planning', label: 'Plan meals better' },
      { value: 'cook_at_home', label: 'Cook more at home' },
      { value: 'regular_meal_schedule', label: 'Regular meal times' },
      { value: 'stop_binge_eating', label: 'Stop binge eating' },
      { value: 'manage_cravings', label: 'Manage cravings' },
      { value: 'healthier_restaurant_choices', label: 'Better restaurant choices' },
      { value: 'eat_more_fiber', label: 'Increase fiber' },
      { value: 'reduce_processed_foods', label: 'Cut processed foods' },
    ]
  },

  // For "Look and feel better"
  {
    id: 'look_feel_specifics',
    question: "What would help you look and feel better?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_motivation', values: ['look_feel'] },
    helpText: "Pick 1-3 that matter most",
    options: [
      { value: 'lose_weight_eating', label: 'Lose weight' },
      { value: 'eat_for_muscle_gain', label: 'Build muscle' },
      { value: 'less_bloated', label: 'Reduce bloating' },
      { value: 'clearer_skin', label: 'Clearer skin' },
      { value: 'build_strength', label: 'Get stronger' },
      { value: 'improve_cardio', label: 'Better fitness' },
      { value: 'build_confidence', label: 'Feel more confident' },
      { value: 'better_posture', label: 'Improve posture' },
      { value: 'drink_more_water', label: 'Better hydration' },
      { value: 'consistent_sleep_schedule', label: 'Get beauty sleep' },
      { value: 'reduce_stress', label: 'Less stress showing' },
      { value: 'clothes_fit_better', label: 'Fit into clothes better' },
    ]
  },

  // ========== QUESTION 3: Why (conditional on specifics chosen) ==========

  // Why for nutrition/eating goals
  {
    id: 'nutrition_why',
    question: "Why is changing your eating habits important to you?",
    type: 'multiple_choice',
    category: 'motivation',
    required: true,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['nutrition', 'health', 'look_feel', 'energy']
    },
    helpText: 'Be honest - pick what really drives you',
    options: [
      { value: 'health_scare', label: 'Doctor said I need to change' },
      { value: 'look_better', label: 'Want to look better' },
      { value: 'feel_better', label: 'Want to feel better' },
      { value: 'role_model', label: 'Be a good example for family' },
      { value: 'athletic_goals', label: 'Meet fitness/performance goals' },
      { value: 'pregnancy', label: 'Pregnancy/trying to conceive' },
      { value: 'chronic_condition', label: 'Manage a health condition' },
      { value: 'aging_well', label: 'Age well and stay healthy' },
      { value: 'confidence', label: 'Build confidence' },
      { value: 'tired_of_struggling', label: "Tired of the struggle" },
    ]
  },

  // Why for exercise goals
  {
    id: 'exercise_why',
    question: "Why does fitness matter to you right now?",
    type: 'multiple_choice',
    category: 'motivation',
    required: true,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['fitness']
    },
    helpText: 'Select what resonates',
    options: [
      { value: 'look_better', label: 'Want to look better' },
      { value: 'feel_stronger', label: 'Want to feel stronger' },
      { value: 'keep_up_kids', label: 'Keep up with kids/family' },
      { value: 'mental_health', label: 'Mental health benefits' },
      { value: 'health_issues', label: 'Health concerns' },
      { value: 'athletic_event', label: 'Training for something' },
      { value: 'aging_well', label: 'Stay active as I age' },
      { value: 'stress_relief', label: 'Need stress relief' },
      { value: 'energy_boost', label: 'Want more energy' },
      { value: 'social', label: 'Social/community aspect' },
    ]
  },

  // ========== QUESTION 4: What has worked (conditional) ==========

  {
    id: 'what_worked',
    question: "What has worked (or is working) for you?",
    type: 'multiple_choice',
    category: 'experience',
    required: false,
    helpText: 'Check all that have helped, even a little',
    options: [
      { value: 'small_changes', label: 'Small, gradual changes' },
      { value: 'accountability', label: 'Having accountability' },
      { value: 'routine', label: 'Strict routine' },
      { value: 'flexibility', label: 'Flexible approach' },
      { value: 'tracking', label: 'Tracking progress' },
      { value: 'meal_prep', label: 'Meal prepping' },
      { value: 'simple_swaps', label: 'Simple substitutions' },
      { value: 'education', label: 'Learning why things matter' },
      { value: 'rewards', label: 'Rewarding myself' },
      { value: 'buddy_system', label: 'Doing it with someone' },
      { value: 'professional_help', label: 'Professional guidance' },
      { value: 'apps_tools', label: 'Apps or tools' },
      { value: 'nothing_yet', label: "Nothing's really worked yet" },
    ]
  },

  // ========== QUESTION 5: What to avoid (conditional based on primary motivation) ==========

  // What to avoid - Nutrition/Health/Look&Feel
  {
    id: 'what_to_avoid_nutrition',
    question: "What hasn't worked or do you want to avoid?",
    type: 'multiple_choice',
    category: 'experience',
    required: false,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['nutrition', 'health', 'look_feel']
    },
    helpText: "We'll steer clear of these approaches",
    options: [
      { value: 'counting_calories', label: 'Counting calories/macros' },
      { value: 'extreme_restrictions', label: 'Cutting out entire food groups' },
      { value: 'complicated_recipes', label: 'Complicated recipes' },
      { value: 'meal_prep', label: 'Meal prepping on weekends' },
      { value: 'expensive_foods', label: 'Expensive special foods' },
      { value: 'supplements', label: 'Supplements/meal replacements' },
      { value: 'rigid_meal_plans', label: 'Rigid meal plans' },
      { value: 'fasting', label: 'Intermittent fasting' },
      { value: 'food_journaling', label: 'Detailed food journaling' },
      { value: 'public_weigh_ins', label: 'Public weigh-ins/accountability' },
      { value: 'bland_diet_food', label: 'Bland "diet" foods' },
      { value: 'all_or_nothing', label: 'All-or-nothing approaches' },
    ]
  },

  // What to avoid - Fitness
  {
    id: 'what_to_avoid_fitness',
    question: "What hasn't worked or do you want to avoid?",
    type: 'multiple_choice',
    category: 'experience',
    required: false,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['fitness']
    },
    helpText: "We'll steer clear of these approaches",
    options: [
      { value: 'gym_required', label: 'Going to a gym' },
      { value: 'early_morning', label: 'Early morning workouts' },
      { value: 'expensive_equipment', label: 'Expensive equipment' },
      { value: 'group_classes', label: 'Group fitness classes' },
      { value: 'running', label: 'Running/jogging' },
      { value: 'long_workouts', label: 'Long workout sessions' },
      { value: 'complex_programs', label: 'Complex training programs' },
      { value: 'public_exercise', label: 'Exercising in public' },
      { value: 'tracking_everything', label: 'Tracking every workout metric' },
      { value: 'competitive_sports', label: 'Competitive sports/activities' },
      { value: 'high_intensity', label: 'High intensity training' },
      { value: 'rigid_schedules', label: 'Rigid workout schedules' },
    ]
  },

  // What to avoid - Energy
  {
    id: 'what_to_avoid_energy',
    question: "What hasn't worked or do you want to avoid?",
    type: 'multiple_choice',
    category: 'experience',
    required: false,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['energy']
    },
    helpText: "We'll steer clear of these approaches",
    options: [
      { value: 'early_morning', label: 'Forcing early wake times' },
      { value: 'meditation', label: 'Meditation/mindfulness' },
      { value: 'sleep_tracking', label: 'Obsessive sleep tracking' },
      { value: 'supplements', label: 'Sleep supplements/pills' },
      { value: 'strict_bedtime', label: 'Rigid bedtime rules' },
      { value: 'no_screens', label: 'Complete screen elimination' },
      { value: 'cold_rooms', label: 'Super cold sleeping' },
      { value: 'expensive_mattress', label: 'Expensive sleep equipment' },
      { value: 'caffeine_elimination', label: 'Cutting out all caffeine' },
      { value: 'complex_routines', label: 'Complex wind-down routines' },
      { value: 'naps', label: 'Daytime napping' },
      { value: 'sleep_restriction', label: 'Sleep restriction therapy' },
    ]
  },

  // What to avoid - Effectiveness/Productivity
  {
    id: 'what_to_avoid_productivity',
    question: "What hasn't worked or do you want to avoid?",
    type: 'multiple_choice',
    category: 'experience',
    required: false,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['effectiveness']
    },
    helpText: "We'll steer clear of these approaches",
    options: [
      { value: 'early_morning', label: '5am morning routines' },
      { value: 'complex_systems', label: 'Complex productivity systems' },
      { value: 'time_blocking', label: 'Rigid time blocking' },
      { value: 'pomodoro', label: 'Pomodoro technique' },
      { value: 'everything_digital', label: 'All-digital organization' },
      { value: 'paper_only', label: 'Paper-only systems' },
      { value: 'detailed_tracking', label: 'Tracking every minute' },
      { value: 'expensive_tools', label: 'Expensive productivity tools' },
      { value: 'public_accountability', label: 'Public accountability' },
      { value: 'meditation', label: 'Meditation for focus' },
      { value: 'no_breaks', label: 'Working without breaks' },
      { value: 'multitasking', label: 'Trying to multitask' },
    ]
  },

  // What to avoid - Relationships
  {
    id: 'what_to_avoid_relationships',
    question: "What hasn't worked or do you want to avoid?",
    type: 'multiple_choice',
    category: 'experience',
    required: false,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['relationships']
    },
    helpText: "We'll steer clear of these approaches",
    options: [
      { value: 'group_therapy', label: 'Group therapy/workshops' },
      { value: 'scheduled_talks', label: 'Scheduled relationship talks' },
      { value: 'date_nights', label: 'Forced date nights' },
      { value: 'therapy_homework', label: 'Therapy homework exercises' },
      { value: 'public_sharing', label: 'Sharing relationship stuff publicly' },
      { value: 'self_help_books', label: 'Relationship self-help books' },
      { value: 'communication_scripts', label: 'Using communication scripts' },
      { value: 'couple_activities', label: 'Forced couple activities' },
      { value: 'vulnerability_exercises', label: 'Vulnerability exercises' },
      { value: 'conflict_rules', label: 'Strict conflict resolution rules' },
      { value: 'relationship_apps', label: 'Relationship improvement apps' },
      { value: 'social_events', label: 'Forced social events' },
    ]
  },

  // ========== QUESTION 6: Barriers (conditional based on primary motivation) ==========

  // Barriers - Nutrition/Health/Look&Feel
  {
    id: 'barriers_nutrition',
    question: "What makes healthy eating hard for you?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['nutrition', 'health', 'look_feel']
    },
    helpText: 'Be real - select all that apply',
    options: [
      { value: 'no_time', label: '⏰ No time to cook' },
      { value: 'budget_tight', label: '💰 Healthy food is expensive' },
      { value: 'family_different', label: '👨‍👩‍👧 Family wants different foods' },
      { value: 'picky_household', label: '🙅 Picky eaters at home' },
      { value: 'hate_cooking', label: '👨‍🍳 Hate/can\'t cook' },
      { value: 'travel_eating', label: '✈️ Travel/eat out a lot' },
      { value: 'emotional_eating', label: '💔 Emotional eating' },
      { value: 'stress_eating', label: '😰 Eat when stressed' },
      { value: 'bored_eating', label: '😑 Eat when bored' },
      { value: 'love_sweets', label: '🍫 Major sweet tooth' },
      { value: 'social_events', label: '🎉 Social events = food' },
      { value: 'no_willpower', label: '😔 Feel like no willpower' },
      { value: 'dont_know_nutrition', label: '🤷 Confusing nutrition info' },
      { value: 'night_snacking', label: '🌙 Late night cravings' },
    ]
  },

  // Barriers - Fitness
  {
    id: 'barriers_fitness',
    question: "What makes exercise hard for you?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['fitness']
    },
    helpText: 'Be honest - select all that apply',
    options: [
      { value: 'no_time', label: '⏰ No time' },
      { value: 'too_tired', label: '😴 Too tired/exhausted' },
      { value: 'no_childcare', label: '👶 No childcare' },
      { value: 'hate_gym', label: '🏋️ Hate gym environment' },
      { value: 'self_conscious', label: '😳 Feel self-conscious' },
      { value: 'dont_know_how', label: '🤷 Don\'t know how to start' },
      { value: 'injuries', label: '🤕 Injuries/physical limitations' },
      { value: 'weather', label: '🌧️ Weather dependent' },
      { value: 'no_motivation', label: '😑 Can\'t stay motivated' },
      { value: 'boring', label: '🥱 Find exercise boring' },
      { value: 'no_results', label: '📉 Don\'t see results' },
      { value: 'expensive', label: '💰 Too expensive' },
      { value: 'no_accountability', label: '🤝 No workout buddy' },
      { value: 'hate_sweating', label: '💦 Hate getting sweaty' },
    ]
  },

  // Barriers - Energy
  {
    id: 'barriers_energy',
    question: "What's sabotaging your energy?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['energy']
    },
    helpText: 'Check all that apply',
    options: [
      { value: 'work_schedule', label: '💼 Work schedule conflicts' },
      { value: 'racing_mind', label: '🧠 Can\'t turn off brain' },
      { value: 'phone_addiction', label: '📱 Can\'t stop scrolling' },
      { value: 'netflix_binge', label: '📺 One more episode syndrome' },
      { value: 'kids_wake', label: '👶 Kids wake me up' },
      { value: 'partner_schedule', label: '👫 Partner\'s different schedule' },
      { value: 'stress_anxiety', label: '😰 Stress and anxiety' },
      { value: 'uncomfortable_bed', label: '🛏️ Uncomfortable sleep setup' },
      { value: 'noise', label: '🔊 Noisy environment' },
      { value: 'revenge_bedtime', label: '🎮 Revenge bedtime procrastination' },
      { value: 'caffeine_dependent', label: '☕ Caffeine cycle' },
      { value: 'irregular_schedule', label: '🎲 Inconsistent schedule' },
      { value: 'afternoon_crash', label: '💥 Afternoon energy crashes' },
      { value: 'poor_nutrition', label: '🍔 Energy-draining diet' },
    ]
  },

  // Barriers - Productivity/Effectiveness
  {
    id: 'barriers_productivity',
    question: "What gets in the way of being productive?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['effectiveness']
    },
    helpText: 'Select all your productivity blockers',
    options: [
      { value: 'distractions', label: '📱 Constant distractions' },
      { value: 'procrastination', label: '⏰ Chronic procrastination' },
      { value: 'perfectionism', label: '✨ Perfectionism paralysis' },
      { value: 'no_system', label: '🤷 No organization system' },
      { value: 'overwhelm', label: '😰 Too much to do' },
      { value: 'unclear_priorities', label: '❓ Unclear priorities' },
      { value: 'meetings', label: '👥 Too many meetings' },
      { value: 'email_overload', label: '📧 Email overload' },
      { value: 'context_switching', label: '🔄 Constant task switching' },
      { value: 'no_boundaries', label: '🚫 No work boundaries' },
      { value: 'cluttered_space', label: '🗑️ Cluttered workspace' },
      { value: 'poor_tools', label: '💻 Bad tools/systems' },
      { value: 'decision_fatigue', label: '🤯 Decision fatigue' },
      { value: 'energy_management', label: '🔋 Poor energy management' },
    ]
  },

  // Barriers - Relationships
  {
    id: 'barriers_relationships',
    question: "What makes relationships challenging?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: ['relationships']
    },
    helpText: 'Be honest about your challenges',
    options: [
      { value: 'no_time', label: '⏰ No quality time' },
      { value: 'work_life_balance', label: '💼 Work takes over' },
      { value: 'communication_style', label: '💬 Different communication styles' },
      { value: 'conflict_avoidance', label: '😶 Avoid difficult conversations' },
      { value: 'trust_issues', label: '🔒 Trust issues' },
      { value: 'different_needs', label: '❤️ Different emotional needs' },
      { value: 'family_stress', label: '👨‍👩‍👧 Family dynamics' },
      { value: 'long_distance', label: '🌍 Distance/logistics' },
      { value: 'social_anxiety', label: '😰 Social anxiety' },
      { value: 'past_baggage', label: '🎒 Past relationship baggage' },
      { value: 'different_goals', label: '🎯 Different life goals' },
      { value: 'intimacy_issues', label: '💑 Intimacy challenges' },
      { value: 'financial_stress', label: '💰 Money stress' },
      { value: 'parenting_differences', label: '👶 Different parenting styles' },
    ]
  },

  // General barriers for multiple areas (shows if none of the above match)
  {
    id: 'barriers_general',
    question: "What makes change hard for you?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: {
      questionId: 'primary_motivation',
      values: [] // This will show when no specific condition is met
    },
    helpText: 'Select all that apply',
    options: [
      { value: 'no_time', label: '⏰ No time' },
      { value: 'budget_tight', label: '💰 Limited budget' },
      { value: 'family_life', label: '👨‍👩‍👧 Busy family life' },
      { value: 'work_demands', label: '💼 Demanding job' },
      { value: 'stress_overwhelm', label: '😰 Too stressed' },
      { value: 'no_support', label: '😔 No support system' },
      { value: 'health_issues', label: '🏥 Health limitations' },
      { value: 'dont_know_how', label: '🤷 Don\'t know where to start' },
      { value: 'no_motivation', label: '😑 Can\'t stay motivated' },
      { value: 'travel_often', label: '✈️ Travel frequently' },
      { value: 'shift_work', label: '🌙 Irregular schedule' },
    ]
  },

  // ========== QUESTION 7: Things you love (for habit pairing) ==========

  {
    id: 'things_you_love',
    question: "What are some things you genuinely enjoy?",
    type: 'multiple_choice',
    category: 'preferences',
    required: false,
    helpText: 'These help us make habits more appealing - pick any you enjoy',
    options: [
      { value: 'restaurants', label: '🍽️ Going to restaurants' },
      { value: 'walking', label: '🚶 Going on walks' },
      { value: 'podcasts', label: '🎧 Listening to podcasts' },
      { value: 'music', label: '🎵 Music' },
      { value: 'cooking_shows', label: '📺 Cooking shows' },
      { value: 'social_media', label: '📱 Social media' },
      { value: 'games', label: '🎮 Games/puzzles' },
      { value: 'reading', label: '📚 Reading' },
      { value: 'outdoors', label: '🏞️ Being outdoors' },
      { value: 'coffee_tea', label: '☕ Coffee/tea rituals' },
      { value: 'friends_time', label: '👥 Time with friends' },
      { value: 'alone_time', label: '🧘 Alone time' },
      { value: 'learning', label: '🎓 Learning new things' },
      { value: 'creating', label: '🎨 Creating/making things' },
      { value: 'helping_others', label: '🤝 Helping others' },
      { value: 'competing', label: '🏆 Friendly competition' },
    ]
  },

  // ========== QUESTION 8: Open field for additional context ==========

  {
    id: 'additional_context',
    question: "Anything else we should know to help find ideas that work for you?",
    type: 'text',
    category: 'context',
    required: false,
    placeholder: "E.g., dietary restrictions, injuries, upcoming events, specific preferences...",
    helpText: 'Optional - share anything that might help us personalize better'
  },

  // ========== Additional conditional deep-dives based on specific goals ==========

  // If someone selected eating-related goals, ask about food relationship
  {
    id: 'food_relationship',
    question: "Quick check - what's your relationship with cooking?",
    type: 'single_choice',
    category: 'skills',
    required: true,
    conditionalOn: {
      questionId: 'nutrition_specifics',
      values: ['cook_at_home', 'improve_meal_planning', 'meal_prep']
    },
    options: [
      { value: 'love_it', label: 'I enjoy it when I have time' },
      { value: 'tolerate', label: 'It\'s fine, just a chore' },
      { value: 'hate_it', label: 'Really don\'t like it' },
      { value: 'no_skills', label: 'Don\'t know how' },
      { value: 'no_kitchen', label: 'Limited kitchen access' },
    ]
  },

  // If stress/overwhelm is a barrier
  {
    id: 'stress_sources',
    question: "What's the main source of your stress?",
    type: 'multiple_choice',
    category: 'context',
    required: false,
    conditionalOn: {
      questionId: 'current_barriers',
      values: ['stress_overwhelm']
    },
    helpText: 'Helps us suggest stress-compatible strategies',
    options: [
      { value: 'work', label: 'Work pressures' },
      { value: 'family', label: 'Family responsibilities' },
      { value: 'health', label: 'Health concerns' },
      { value: 'financial', label: 'Financial stress' },
      { value: 'relationship', label: 'Relationship issues' },
      { value: 'everything', label: 'Everything at once' },
    ]
  },

  // For those with kids/family responsibilities
  {
    id: 'family_context',
    question: "What's your family situation?",
    type: 'single_choice',
    category: 'context',
    required: false,
    conditionalOn: {
      questionId: 'current_barriers',
      values: ['family_life', 'picky_household']
    },
    options: [
      { value: 'young_kids', label: 'Young kids (under 10)' },
      { value: 'teens', label: 'Teenagers' },
      { value: 'caregiver', label: 'Caring for parents/family' },
      { value: 'partner_different', label: 'Partner with different goals' },
      { value: 'complex', label: 'It\'s complicated' },
    ]
  }
];

/**
 * Gets the list of questions to display based on user responses
 * Filters out questions that don't meet conditional requirements
 */
export function getConditionalQuestions(responses: Array<{ questionId: string; values: string[] }>): QuizQuestion[] {
  const responseMap = new Map(responses.map(r => [r.questionId, r.values]));

  return QUIZ_QUESTIONS.filter(question => {
    // If no conditional requirement, always show the question
    if (!question.conditionalOn) {
      return true;
    }

    // Check if the conditional requirement is met
    const requiredResponses = responseMap.get(question.conditionalOn.questionId);
    if (!requiredResponses) {
      return false; // Required question hasn't been answered yet
    }

    // Check if any of the required values match the user's response
    return question.conditionalOn.values.some(value =>
      requiredResponses.includes(value)
    );
  });
}