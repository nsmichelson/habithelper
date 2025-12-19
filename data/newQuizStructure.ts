import { QuizQuestion } from '../types/quiz';
import { getTipGoalsForQuizGoals } from './goalMappings';

/**
 * Updated Quiz Flow:
 * 1. Area selection (simple start)
 * 2. Specific goals within that area
 * 3. Vision of success
 * 4. Current blockers/challenges
 * 5. NEW: Driver identification (why the behavior happens)
 * 6. NEW: Previous attempts & why they stopped
 * 7. NEW: Practical context (meal patterns, timing, kitchen, budget)
 * 8. Things they love/enjoy
 * 9. Things that definitely don't work
 * 10. Life context (chaos level, role)
 * 11. Health considerations (expanded)
 * 12. NEW: Food relationship screen (sensitive)
 */

export const NEW_QUIZ_QUESTIONS: QuizQuestion[] = [
  // ========== STEP 1: AREA SELECTION ==========
  {
    id: 'primary_area',
    question: "Where do you most want to make a change?",
    type: 'single_choice',
    category: 'goals',
    required: true,
    helpText: "Let's start with one area - you can always add more later!",
    options: [
      { value: 'eating', label: '🥗 Eating habits' },
      { value: 'sleeping', label: '😴 Sleeping better' },
      { value: 'mindset', label: '🧠 Mindset & stress' },
      // Temporarily hidden - keeping for future:
      // { value: 'productivity', label: '📋 Productivity & organization' },
      // { value: 'exercise', label: '💪 Exercise & movement' },
      // { value: 'relationships', label: '💝 Relationships & social life' },
    ]
  },

  // ========== STEP 2: SPECIFIC GOALS BY AREA ==========

  // Eating habits specific goals
  {
    id: 'eating_specifics',
    question: "What specific eating habit do you want to work on?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['eating'] },
    helpText: "Pick 1-3 that feel most important right now",
    options: [
      { value: 'eat_more_veggies', label: 'Eat more vegetables & fruits' },
      { value: 'reduce_junk_food', label: 'Cut back on junk/processed food' },
      { value: 'control_portions', label: 'Better portion control' },
      { value: 'reduce_sugar', label: 'Reduce sugar intake' },
      { value: 'eat_more_protein', label: 'Get more protein' },
      { value: 'drink_more_water', label: 'Drink more water' },
      { value: 'practice_mindful_eating', label: 'Stop mindless snacking' },
      { value: 'improve_meal_planning', label: 'Plan meals better' },
      { value: 'cook_at_home', label: 'Cook at home more' },
      { value: 'regular_meal_schedule', label: 'Regular eating times' },
      { value: 'stop_binge_eating', label: 'Stop binge/stress eating' },
      { value: 'manage_blood_sugar', label: 'Manage blood sugar' },
      { value: 'pregnancy_nutrition', label: 'Eat better during pregnancy' },
      { value: 'switch_to_plant_based', label: 'Switch to plant-based' },
      { value: 'quit_alcohol', label: 'Cut out alcohol' },
      { value: 'eat_more_fiber', label: 'Increase fiber intake' },
      { value: 'lose_weight_eating', label: 'Lose weight' },
      { value: 'eat_for_muscle_gain', label: 'Build muscle' },
      { value: 'manage_cravings', label: 'Manage cravings better' },
      { value: 'healthier_restaurant_choices', label: 'Better restaurant choices' },
      { value: 'reduce_caffeine', label: 'Reduce caffeine' },
      { value: 'reduce_carbs', label: 'Lower carb intake' },
      { value: 'reduce_fat', label: 'Reduce fat intake' },
      { value: 'reduce_sodium', label: 'Lower sodium' },
    ]
  },

  // Sleep specific goals
  {
    id: 'sleep_specifics',
    question: "What specific sleep issue do you want to tackle?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['sleeping'] },
    helpText: "Pick 1-3 that affect you most",
    options: [
      { value: 'fall_asleep_easier', label: 'Fall asleep faster' },
      { value: 'stay_asleep_night', label: 'Stop waking up at night' },
      { value: 'go_to_bed_earlier', label: 'Go to bed earlier' },
      { value: 'consistent_sleep_schedule', label: 'Consistent sleep schedule' },
      { value: 'wake_up_refreshed', label: 'Wake up feeling refreshed' },
      { value: 'reduce_screen_before_bed', label: 'Less screens before bed' },
      { value: 'bedtime_wind_down', label: 'Better wind-down routine' },
      { value: 'improve_sleep_environment', label: 'Optimize sleep environment' },
      { value: 'stop_hitting_snooze', label: 'Stop hitting snooze' },
    ]
  },

  // Productivity specific goals
  {
    id: 'productivity_specifics',
    question: "What productivity challenge do you want to solve?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['productivity'] },
    helpText: "Pick 1-3 that would make the biggest difference",
    options: [
      { value: 'stop_procrastinating', label: 'Stop procrastinating' },
      { value: 'improve_focus', label: 'Better focus & concentration' },
      { value: 'better_time_management', label: 'Manage time better' },
      { value: 'declutter_spaces', label: 'Declutter my space' },
      { value: 'organize_digital_life', label: 'Organize digital life' },
      { value: 'build_daily_routine', label: 'Build better routines' },
      { value: 'prioritize_tasks', label: 'Better at prioritizing' },
      { value: 'finish_what_start', label: 'Actually finish what I start' },
      { value: 'reduce_overwhelm', label: 'Feel less overwhelmed' },
      { value: 'improve_planning', label: 'Plan ahead better' },
    ]
  },

  // Exercise specific goals
  {
    id: 'exercise_specifics',
    question: "What's your exercise goal?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['exercise'] },
    helpText: "Pick 1-3 to focus on",
    options: [
      { value: 'start_exercising', label: 'Just start moving more' },
      { value: 'consistent_workouts', label: 'Exercise consistently' },
      { value: 'build_strength', label: 'Build strength' },
      { value: 'improve_cardio', label: 'Improve cardio/endurance' },
      { value: 'increase_flexibility', label: 'Increase flexibility' },
      { value: 'exercise_lose_weight', label: 'Exercise for weight loss' },
      { value: 'exercise_for_energy', label: 'Have more energy' },
      { value: 'find_enjoyable_exercise', label: 'Find exercise I enjoy' },
      { value: 'workout_at_home', label: 'Exercise at home' },
      { value: 'more_active_lifestyle', label: 'Be more active daily' },
      { value: 'boost_endurance', label: 'Improve athletic endurance' },
      { value: 'increase_strength_performance', label: 'Increase strength performance' },
    ]
  },

  // Mindset specific goals
  {
    id: 'mindset_specifics',
    question: "What mindset challenge do you face?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['mindset'] },
    helpText: "Pick 1-3 that resonate most",
    options: [
      { value: 'manage_stress', label: 'Manage stress better' },
      { value: 'reduce_anxiety', label: 'Reduce anxiety' },
      { value: 'stop_negative_thoughts', label: 'Stop negative thinking' },
      { value: 'practice_self_compassion', label: 'Be kinder to myself' },
      { value: 'build_confidence', label: 'Build confidence' },
      { value: 'practice_mindfulness', label: 'Be more present' },
      { value: 'cultivate_gratitude', label: 'Practice gratitude' },
      { value: 'set_boundaries', label: 'Set better boundaries' },
      { value: 'overcome_perfectionism', label: 'Let go of perfectionism' },
      { value: 'stay_motivated', label: 'Stay motivated' },
    ]
  },

  // Relationships specific goals
  {
    id: 'relationship_specifics',
    question: "What relationship area needs attention?",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['relationships'] },
    helpText: "Pick 1-3 to work on",
    options: [
      { value: 'improve_communication', label: 'Better communication' },
      { value: 'more_quality_time', label: 'More quality time' },
      { value: 'stronger_social_connections', label: 'Build social connections' },
      { value: 'handle_conflicts_better', label: 'Handle conflicts better' },
      { value: 'express_needs_clearly', label: 'Express my needs' },
      { value: 'become_better_listener', label: 'Be a better listener' },
      { value: 'improve_work_life_balance', label: 'Balance work & relationships' },
      { value: 'more_family_time', label: 'More family time' },
      { value: 'build_dating_confidence', label: 'Improve dating life' },
      { value: 'strengthen_friendships', label: 'Nurture friendships' },
    ]
  },

  // ========== STEP 3: VISION OF SUCCESS ==========
  {
    id: 'success_vision',
    question: "If you were successful with this change, what would your life look like?",
    type: 'text',
    category: 'motivation',
    required: true,
    placeholder: "Describe in a few sentences what success looks like to you...",
    helpText: "Paint a picture of your ideal outcome - be specific!"
  },

  // ========== STEP 4: AREA-SPECIFIC BLOCKERS ==========

  // Eating-specific blockers
  {
    id: 'eating_blockers',
    question: "What makes healthy eating hard for you?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['eating'] },
    helpText: "Be honest - select all that apply",
    options: [
      { value: 'hate_veggies', label: '🥦 I don\'t like vegetables' },
      { value: 'love_sweets', label: '🍫 Major sweet tooth' },
      { value: 'stress_eating', label: '😰 I eat when stressed' },
      { value: 'no_time_cook', label: '⏰ No time to cook' },
      { value: 'dont_know_cook', label: '👨‍🍳 Don\'t know how to cook' },
      { value: 'expensive', label: '💰 Healthy food is expensive' },
      { value: 'family_different', label: '👨‍👩‍👧 Family wants different foods' },
      { value: 'social_events', label: '🎉 Social events = food temptation' },
      { value: 'travel_eating', label: '✈️ Travel/eating out a lot' },
      { value: 'bored_eating', label: '😑 I eat when bored' },
      { value: 'night_snacking', label: '🌙 Late night cravings' },
      { value: 'picky_eater', label: '🙅 Very picky eater' },
      { value: 'emotional_eating', label: '💔 Emotional eating' },
      { value: 'no_willpower', label: '😔 Feel like I have no willpower' },
    ]
  },

  // Sleep-specific blockers
  {
    id: 'sleep_blockers',
    question: "What's messing with your sleep?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['sleeping'] },
    helpText: "Select all that apply",
    options: [
      { value: 'racing_mind', label: '🧠 Can\'t turn off my brain' },
      { value: 'phone_addiction', label: '📱 Can\'t stop scrolling' },
      { value: 'netflix_binge', label: '📺 One more episode syndrome' },
      { value: 'work_late', label: '💻 Working late' },
      { value: 'kids_wake', label: '👶 Kids wake me up' },
      { value: 'partner_schedule', label: '👫 Partner has different schedule' },
      { value: 'noise', label: '🔊 Noisy environment' },
      { value: 'uncomfortable', label: '🛏️ Uncomfortable bed/room' },
      { value: 'anxiety_worry', label: '😟 Anxiety/worrying' },
      { value: 'revenge_bedtime', label: '🎮 Revenge bedtime procrastination' },
      { value: 'inconsistent', label: '🎲 Inconsistent schedule' },
      { value: 'caffeine', label: '☕ Too much caffeine' },
      { value: 'naps', label: '😴 Napping during day' },
    ]
  },

  // Productivity-specific blockers
  {
    id: 'productivity_blockers',
    question: "What kills your productivity?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['productivity'] },
    helpText: "Check all your productivity killers",
    options: [
      { value: 'distractions', label: '📱 Constant distractions' },
      { value: 'procrastination', label: '⏰ Chronic procrastination' },
      { value: 'perfectionism', label: '💯 Perfectionism paralysis' },
      { value: 'no_system', label: '🗂️ No organization system' },
      { value: 'too_many_tools', label: '🛠️ Too many apps/tools' },
      { value: 'unclear_priorities', label: '❓ Don\'t know what\'s important' },
      { value: 'overcommitted', label: '😵 Say yes to everything' },
      { value: 'adhd_add', label: '🧠 ADHD/attention issues' },
      { value: 'energy_crashes', label: '🔋 Energy ups and downs' },
      { value: 'messy_space', label: '🗑️ Cluttered workspace' },
      { value: 'interruptions', label: '🚨 Constant interruptions' },
      { value: 'no_motivation', label: '😑 No motivation' },
      { value: 'overwhelming_tasks', label: '🌊 Tasks feel too big' },
    ]
  },

  // Exercise-specific blockers
  {
    id: 'exercise_blockers',
    question: "What stops you from exercising?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['exercise'] },
    helpText: "Be real - what gets in the way?",
    options: [
      { value: 'hate_gym', label: '🏋️ Hate the gym' },
      { value: 'self_conscious', label: '😳 Feel self-conscious' },
      { value: 'no_time', label: '⏰ No time' },
      { value: 'too_tired', label: '😴 Always too tired' },
      { value: 'boring', label: '😑 Exercise is boring' },
      { value: 'hurts', label: '🤕 It hurts/injuries' },
      { value: 'no_results', label: '📉 Don\'t see results' },
      { value: 'expensive', label: '💰 Gym/classes too expensive' },
      { value: 'weather', label: '🌧️ Weather dependent' },
      { value: 'no_childcare', label: '👶 No childcare' },
      { value: 'dont_know_how', label: '❓ Don\'t know where to start' },
      { value: 'hate_sweating', label: '💦 Hate getting sweaty' },
      { value: 'no_accountability', label: '🤝 No workout buddy' },
    ]
  },

  // Mindset-specific blockers
  {
    id: 'mindset_blockers',
    question: "What mental patterns hold you back?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['mindset'] },
    helpText: "Which of these sound familiar?",
    options: [
      { value: 'negative_spiral', label: '🌀 Negative thought spirals' },
      { value: 'comparison', label: '📱 Comparing to others' },
      { value: 'impostor', label: '🎭 Impostor syndrome' },
      { value: 'catastrophizing', label: '😱 Always expect the worst' },
      { value: 'people_pleasing', label: '🤝 Can\'t say no' },
      { value: 'perfectionism', label: '💯 Nothing\'s ever good enough' },
      { value: 'past_trauma', label: '💔 Past experiences' },
      { value: 'no_boundaries', label: '🚫 Poor boundaries' },
      { value: 'self_critical', label: '😔 Too hard on myself' },
      { value: 'avoidance', label: '🙈 Avoiding feelings' },
      { value: 'overthinking', label: '🤯 Overthink everything' },
      { value: 'no_support', label: '🏝️ Feel alone' },
    ]
  },

  // Relationship-specific blockers
  {
    id: 'relationship_blockers',
    question: "What makes relationships challenging?",
    type: 'multiple_choice',
    category: 'challenges',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['relationships'] },
    helpText: "What gets in the way?",
    options: [
      { value: 'no_time', label: '⏰ No time for people' },
      { value: 'conflict_avoidance', label: '😰 Avoid difficult conversations' },
      { value: 'communication', label: '💬 Struggle to express myself' },
      { value: 'trust_issues', label: '🔒 Hard to trust' },
      { value: 'different_needs', label: '⚖️ Different needs/expectations' },
      { value: 'work_priority', label: '💼 Work always comes first' },
      { value: 'social_anxiety', label: '😟 Social anxiety' },
      { value: 'introvert_drain', label: '🔋 Socializing drains me' },
      { value: 'toxic_patterns', label: '🔄 Repeat unhealthy patterns' },
      { value: 'boundaries', label: '🚧 Can\'t set boundaries' },
      { value: 'long_distance', label: '📍 Distance/logistics' },
      { value: 'past_hurt', label: '💔 Past relationship hurt' },
    ]
  },

  // ========== NEW STEP 5: EATING DRIVER IDENTIFICATION ==========
  {
    id: 'eating_triggers',
    question: "Be honest—when you eat in a way that doesn't feel great afterward, what's usually going on?",
    type: 'multiple_choice',
    category: 'drivers',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['eating'] },
    helpText: "Select all that apply - no judgment here",
    options: [
      { value: 'waited_too_long', label: '😤 I waited way too long to eat and became a hungry gremlin' },
      { value: 'stress_comfort', label: '😰 I\'m stressed, anxious, or overwhelmed and food takes the edge off' },
      { value: 'bored_fidgety', label: '😑 I\'m bored and need something to do with my hands/mouth' },
      { value: 'ritual_habit', label: '📺 It\'s just what I do at that time—like a ritual (hello, 9pm kitchen laps)' },
      { value: 'autopilot', label: '🤷 I don\'t even realize I\'m doing it until the bag is empty' },
      { value: 'social_awkward', label: '👥 I\'m with other people and it feels weird to be the one not eating' },
      { value: 'fomo_special', label: '✨ It feels like a special occasion and I don\'t want to miss out' },
      { value: 'enjoying_it', label: '😋 It just tastes really good and I\'m enjoying myself, honestly' },
      { value: 'no_idea', label: '🤔 I have no idea, it just happens' },
    ]
  },

  // ========== NEW STEP 6: PREVIOUS ATTEMPTS ==========
  {
    id: 'previous_attempts',
    question: "What have you already tried? No judgment—we've all been there.",
    type: 'multiple_choice',
    category: 'history',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['eating'] },
    helpText: "Select all that apply",
    options: [
      { value: 'calorie_tracking', label: '📱 Calorie counting or tracking apps (MyFitnessPal, LoseIt, etc.)' },
      { value: 'keto_low_carb', label: '🥓 Keto, low-carb, or Atkins-style diets' },
      { value: 'intermittent_fasting', label: '⏰ Intermittent fasting (16:8, OMAD, etc.)' },
      { value: 'sunday_meal_prep', label: '🍱 Big Sunday meal prep sessions' },
      { value: 'meal_kits', label: '📦 Meal kit services (HelloFresh, Blue Apron, etc.)' },
      { value: 'elimination', label: '🚫 Cutting out entire food groups (no sugar, no gluten, no dairy)' },
      { value: 'commercial_programs', label: '📊 Programs like Weight Watchers, Noom, or Jenny Craig' },
      { value: 'clean_eating', label: '🥗 "Clean eating" or Whole30-style challenges' },
      { value: 'cleanses', label: '🧃 Juice cleanses or detoxes' },
      { value: 'eat_less_move_more', label: '🏃 Just trying to "eat less and move more"' },
      { value: 'first_attempt', label: '🆕 Nothing structured—this is my first real attempt' },
    ]
  },

  // Why it stopped working (conditional on having tried something)
  {
    id: 'why_stopped',
    question: "If something worked for a bit and then fell apart, what usually happened?",
    type: 'single_choice',
    category: 'history',
    required: true,
    conditionalOn: { questionId: 'previous_attempts', values: ['calorie_tracking', 'keto_low_carb', 'intermittent_fasting', 'sunday_meal_prep', 'meal_kits', 'elimination', 'commercial_programs', 'clean_eating', 'cleanses', 'eat_less_move_more'] },
    helpText: "Pick the one that resonates most",
    options: [
      { value: 'all_or_nothing', label: '💥 One slip-up and I felt like I "ruined it" so I gave up' },
      { value: 'life_chaos', label: '🌪️ Life got crazy and I couldn\'t keep up with the system' },
      { value: 'food_boredom', label: '😴 I got so bored of eating the same things' },
      { value: 'social_hard', label: '🎉 It made social situations really hard or awkward' },
      { value: 'deprivation_snap', label: '🍪 I felt deprived and eventually snapped' },
      { value: 'too_complicated', label: '🤯 It was too complicated to keep track of everything' },
      { value: 'slow_results', label: '📉 I didn\'t see results fast enough and got discouraged' },
      { value: 'became_obsessive', label: '😟 It started making me obsessive or anxious about food' },
      { value: 'unclear', label: '🤷 I honestly don\'t know—I just… stopped' },
    ]
  },

  // ========== NEW STEP 7: PRACTICAL CONTEXT ==========

  // Meal pattern
  {
    id: 'meal_pattern',
    question: "What does a typical eating day actually look like for you?",
    type: 'single_choice',
    category: 'context',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['eating'] },
    helpText: "Pick the one that's closest",
    options: [
      { value: 'three_meals', label: '🍽️ Pretty normal—breakfast, lunch, dinner-ish' },
      { value: 'skip_breakfast', label: '☕ I skip breakfast (not hungry or no time) and eat more later' },
      { value: 'skip_lunch', label: '😵 Lunch? What lunch? I look up and it\'s 3pm' },
      { value: 'grazer', label: '🍿 I graze and snack more than I eat actual meals' },
      { value: 'dinner_heavy', label: '🌙 Most of my eating happens at dinner (and after)' },
      { value: 'totally_random', label: '🎲 Honestly, it\'s chaos—different every day' },
    ]
  },

  // Trouble times
  {
    id: 'trouble_time',
    question: "When does healthy eating go off the rails for you?",
    type: 'multiple_choice',
    category: 'context',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['eating'] },
    helpText: "Select all that apply",
    options: [
      { value: 'morning_rush', label: '🌅 Mornings—I\'m rushing and food is the last priority' },
      { value: 'afternoon_crash', label: '😩 That 3-4pm crash when I\'ll eat anything not nailed down' },
      { value: 'after_work', label: '🚗 Right after work—I\'m starving and stressed and the wheels come off' },
      { value: 'evening', label: '📺 Evenings—couch time, kitchen laps, the whole thing' },
      { value: 'late_night', label: '🌙 Late night—once the kids are down or I\'m finally relaxing' },
      { value: 'weekends', label: '🎉 Weekends—less structure = more chaos' },
      { value: 'all_day', label: '😅 All day honestly—there\'s no one "bad" time' },
    ]
  },

  // Kitchen reality
  {
    id: 'kitchen_reality',
    question: "What's the real situation with your kitchen and cooking?",
    type: 'single_choice',
    category: 'context',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['eating'] },
    helpText: "Pick the one that's most true",
    options: [
      { value: 'full_kitchen_time', label: '👨‍🍳 Full kitchen and I actually have time to use it' },
      { value: 'full_kitchen_no_time', label: '😅 Full kitchen but LOL when would I cook' },
      { value: 'limited_kitchen', label: '🏢 Limited setup—small kitchen, shared space, or dorm life' },
      { value: 'microwave_only', label: '📦 Basically just a microwave and a dream' },
      { value: 'no_kitchen_travel', label: '✈️ I\'m on the road a lot—hotel rooms, airports, eating out' },
      { value: 'cant_cook', label: '🤷 I have a kitchen but honestly, I don\'t know how to cook' },
    ]
  },

  // Budget reality
  {
    id: 'budget_reality',
    question: "Real talk: how much does cost affect what you eat?",
    type: 'single_choice',
    category: 'context',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['eating'] },
    options: [
      { value: 'not_issue', label: '💳 Not really an issue' },
      { value: 'somewhat', label: '🛒 Somewhat—I look for deals but it\'s manageable' },
      { value: 'major_factor', label: '💰 Major factor—budget is tight' },
      { value: 'food_insecurity', label: '😔 Real struggle to afford enough food' },
    ]
  },

  // Feeding who
  {
    id: 'feeding_who',
    question: "Who else are you trying to feed around here?",
    type: 'single_choice',
    category: 'context',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['eating'] },
    options: [
      { value: 'just_me', label: '🙋 Just myself' },
      { value: 'me_partner', label: '👫 Me and a partner' },
      { value: 'family_same', label: '👨‍👩‍👧 Family that (mostly) eats the same things' },
      { value: 'family_different', label: '🍟 Family with different preferences/picky kids' },
      { value: 'varies', label: '🔄 Varies a lot' },
    ]
  },

  // ========== STEP 8: THINGS YOU LOVE ==========
  {
    id: 'things_you_love',
    question: "What do you genuinely enjoy in life?",
    type: 'multiple_choice',
    category: 'preferences',
    required: true,
    helpText: "Select all that bring you joy - we'll use these to make tips more appealing",
    options: [
      // Social activities
      { value: 'restaurant_friends', label: '🍽️ Going to restaurants with friends' },
      { value: 'coffee_shops', label: '☕ Coffee shops & cafes' },
      { value: 'group_activities', label: '👥 Group activities & classes' },
      { value: 'family_time', label: '👨‍👩‍👧 Family activities' },
      { value: 'parties_events', label: '🎉 Parties & social events' },
      { value: 'helping_others', label: '🤝 Helping others/volunteering' },
      { value: 'deep_conversations', label: '💬 Deep conversations' },

      // Movement & outdoor activities
      { value: 'walking', label: '🚶 Walking' },
      { value: 'dancing', label: '💃 Dancing to music' },
      { value: 'nature_outdoors', label: '🌳 Being in nature' },
      { value: 'playing_kids_pets', label: '🐕 Playing with kids/pets' },
      { value: 'bike_rides', label: '🚴 Bike rides' },
      { value: 'swimming_water', label: '🏊 Swimming/water activities' },
      { value: 'gardening', label: '🌱 Gardening' },
      { value: 'sports_watching', label: '⚽ Watching sports' },
      { value: 'sports_playing', label: '🏃 Playing sports' },
      { value: 'hiking_exploring', label: '🥾 Hiking & exploring' },

      // Entertainment & media
      { value: 'podcasts_audiobooks', label: '🎧 Podcasts/audiobooks' },
      { value: 'youtube_videos', label: '📺 YouTube/videos' },
      { value: 'music_listening', label: '🎵 Listening to music' },
      { value: 'music_making', label: '🎸 Making music' },
      { value: 'reading', label: '📚 Reading' },
      { value: 'games_video', label: '🎮 Video games' },
      { value: 'games_board', label: '🎲 Board games/cards' },
      { value: 'puzzles_brain', label: '🧩 Puzzles & brain teasers' },
      { value: 'tv_movies', label: '🎬 TV shows/movies' },
      { value: 'social_media', label: '📱 Social media' },
      { value: 'photography', label: '📸 Photography' },

      // Food & cooking
      { value: 'trying_restaurants', label: '🍜 Trying new restaurants' },
      { value: 'cooking_experimenting', label: '👨‍🍳 Cooking/experimenting' },
      { value: 'baking', label: '🧁 Baking' },
      { value: 'farmers_markets', label: '🥕 Farmers markets' },
      { value: 'food_culture', label: '🌮 Cultural foods' },
      { value: 'wine_cocktails', label: '🍷 Wine/cocktails' },
      { value: 'coffee_tea', label: '☕ Coffee/tea rituals' },

      // Creative & hobbies
      { value: 'creative_projects', label: '🎨 Art/craft projects' },
      { value: 'writing_journaling', label: '✍️ Writing/journaling' },
      { value: 'diy_projects', label: '🔨 DIY/home projects' },
      { value: 'collecting', label: '📦 Collecting things' },
      { value: 'fashion_style', label: '👗 Fashion/personal style' },
      { value: 'decorating', label: '🏠 Decorating spaces' },

      // Learning & growth
      { value: 'learning_new', label: '🎓 Learning new things' },
      { value: 'documentaries', label: '🎥 Documentaries' },
      { value: 'workshops_seminars', label: '👥 Workshops/seminars' },
      { value: 'self_improvement', label: '📈 Self-improvement' },
      { value: 'spiritual_practices', label: '🕉️ Spiritual practices' },

      // Lifestyle preferences
      { value: 'spontaneous_adventures', label: '✨ Spontaneous adventures' },
      { value: 'planning_organizing', label: '📅 Planning & organizing' },
      { value: 'solo_time', label: '🧘 Solo/quiet time' },
      { value: 'busy_productive', label: '⚡ Staying busy' },
      { value: 'tech_gadgets', label: '📱 Tech & gadgets' },
      { value: 'minimalism', label: '🌿 Simple/minimalist' },
      { value: 'traditions_rituals', label: '🕯️ Traditions & rituals' },
      { value: 'travel_exploring', label: '✈️ Travel & exploring' },
      { value: 'cozy_comfort', label: '🛋️ Cozy comfort' },
      { value: 'competition', label: '🏆 Competition/challenges' },
      { value: 'shopping', label: '🛍️ Shopping' },
      { value: 'animals', label: '🦜 Animals' },
    ]
  },

  // ========== STEP 9: THINGS THAT DON'T WORK ==========
  {
    id: 'hate_list',
    question: "What definitely DOESN'T work for you?",
    type: 'multiple_choice',
    category: 'preferences',
    required: false,
    helpText: "We'll avoid suggesting these approaches",
    options: [
      { value: 'rigid_rules', label: '📏 Strict rules & restrictions' },
      { value: 'counting', label: '🔢 Counting (calories/macros/etc)' },
      { value: 'gym', label: '🏋️ Going to the gym' },
      { value: 'morning_routine', label: '🌅 Early morning routines' },
      { value: 'meal_prep', label: '🥗 Meal prepping' },
      { value: 'meditation', label: '🧘 Meditation/sitting still' },
      { value: 'journaling', label: '📓 Journaling/writing' },
      { value: 'group_accountability', label: '👥 Group accountability' },
      { value: 'complex_recipes', label: '👨‍🍳 Complicated recipes' },
      { value: 'supplements', label: '💊 Taking supplements' },
      { value: 'cold_turkey', label: '🚫 Going cold turkey' },
      { value: 'public_commitments', label: '📢 Public commitments' },
      { value: 'detailed_tracking', label: '📊 Detailed tracking' },
      { value: 'long_workouts', label: '⏱️ Long workout sessions' },
    ]
  },

  // ========== STEP 10: LIFE CONTEXT ==========
  {
    id: 'chaos_level',
    question: "How would you describe your daily life right now?",
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { value: 'very_structured', label: '📅 Very structured & predictable' },
      { value: 'mostly_routine', label: '🔄 Mostly routine with some variety' },
      { value: 'flexible', label: '🌊 Flexible but manageable' },
      { value: 'unpredictable', label: '🎲 Pretty unpredictable day-to-day' },
      { value: 'total_chaos', label: '🌪️ Total chaos (and that\'s ok!)' },
    ]
  },

  {
    id: 'life_role',
    question: "Which best describes your current life situation?",
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    helpText: "This helps us suggest tips that fit your lifestyle",
    options: [
      { value: 'student', label: '🎓 Student' },
      { value: 'professional', label: '💼 Working professional' },
      { value: 'shift_worker', label: '🔄 Shift worker/irregular hours' },
      { value: 'parent_young', label: '👶 Parent of young kids' },
      { value: 'parent_teens', label: '👦 Parent of older kids/teens' },
      { value: 'caregiver', label: '💝 Caregiver' },
      { value: 'remote_worker', label: '🏠 Remote worker' },
      { value: 'retired', label: '🌅 Retired/semi-retired' },
      { value: 'entrepreneur', label: '🚀 Entrepreneur/self-employed' },
      { value: 'mixed', label: '🎭 Bit of everything' },
    ]
  },

  // ========== STEP 11: HEALTH CONSIDERATIONS (EXPANDED) ==========
  {
    id: 'health_considerations',
    question: "Any health considerations we should know about?",
    type: 'multiple_choice',
    category: 'health',
    required: false,
    helpText: "This helps us filter out inappropriate suggestions (optional)",
    options: [
      { value: 'diabetes', label: '🩺 Diabetes or pre-diabetes' },
      { value: 'heart', label: '❤️ Heart/blood pressure issues' },
      { value: 'pcos', label: '🔄 PCOS or insulin resistance' },
      { value: 'ibs_digestive', label: '🦠 IBS or digestive issues' },
      { value: 'gerd_reflux', label: '🔥 GERD/acid reflux' },
      { value: 'thyroid', label: '⚡ Thyroid condition' },
      { value: 'menopause', label: '🌡️ Perimenopause/menopause' },
      { value: 'postpartum', label: '👶 Postpartum (within past year)' },
      { value: 'breastfeeding', label: '🤱 Currently breastfeeding' },
      { value: 'pregnant', label: '🤰 Pregnant' },
      { value: 'allergies', label: '🥜 Food allergies' },
      { value: 'mobility', label: '♿ Mobility limitations' },
      { value: 'mental_health', label: '🧠 Mental health conditions' },
      { value: 'none', label: '✅ None of these' },
    ]
  },

  // If allergies selected
  {
    id: 'which_allergies',
    question: "Which food allergies/intolerances?",
    type: 'multiple_choice',
    category: 'health',
    required: true,
    conditionalOn: { questionId: 'health_considerations', values: ['allergies'] },
    options: [
      { value: 'gluten', label: '🌾 Gluten/Celiac' },
      { value: 'dairy', label: '🥛 Dairy/Lactose' },
      { value: 'nuts', label: '🥜 Nuts' },
      { value: 'eggs', label: '🥚 Eggs' },
      { value: 'soy', label: '🌱 Soy' },
      { value: 'seafood', label: '🦐 Seafood/Shellfish' },
    ]
  },

  // ========== NEW STEP 12: FOOD RELATIONSHIP SCREEN (SENSITIVE) ==========
  {
    id: 'tracking_history',
    question: "How do you feel about tracking food—calories, macros, all that?",
    type: 'single_choice',
    category: 'food_relationship',
    required: true,
    conditionalOn: { questionId: 'primary_area', values: ['eating'] },
    options: [
      { value: 'helpful', label: '👍 It\'s been helpful for me' },
      { value: 'neutral', label: '🤷 Neutral—take it or leave it' },
      { value: 'stressful', label: '😰 It makes me anxious or obsessive' },
      { value: 'triggers_worse', label: '😔 It\'s triggered worse eating patterns for me' },
      { value: 'never_tried', label: '🆕 Never really tried it' },
    ]
  },

  {
    id: 'eating_history_screen',
    question: "Have any of these ever been part of your story?",
    type: 'multiple_choice',
    category: 'food_relationship',
    required: false,
    conditionalOn: { questionId: 'primary_area', values: ['eating'] },
    helpText: "This is optional but helps us take better care of you",
    options: [
      { value: 'restrict_binge', label: '🔄 Cycles of restricting then overeating' },
      { value: 'secret_eating', label: '🤫 Eating in secret or hiding food' },
      { value: 'guilt_shame', label: '😔 Intense guilt/shame after eating' },
      { value: 'lost_period', label: '⚠️ Lost period due to eating/exercise' },
      { value: 'none_of_these', label: '✅ None of these' },
    ]
  },

  // Texture issues (for picky eaters)
  {
    id: 'texture_issues',
    question: "Are there textures you really can't handle?",
    type: 'multiple_choice',
    category: 'preferences',
    required: false,
    conditionalOn: { questionId: 'eating_blockers', values: ['picky_eater'] },
    helpText: "This helps us suggest foods you'll actually eat",
    options: [
      { value: 'mushy', label: '🥣 Mushy/soft (cooked vegetables, bananas)' },
      { value: 'slimy', label: '🫠 Slimy (okra, certain mushrooms)' },
      { value: 'stringy', label: '🧵 Stringy/fibrous' },
      { value: 'mixed_textures', label: '🥗 Mixed textures in one dish' },
      { value: 'not_texture', label: '👅 It\'s more about taste than texture' },
    ]
  },
];


// ==========================================
// PROFILE MAPPING WITH TAGGING SYSTEM
// ==========================================

// Driver mapping from quiz responses
const DRIVER_MAPPINGS: Record<string, string> = {
  'waited_too_long': 'driver:actually_hungry',
  'stress_comfort': 'driver:dopamine_emotional',
  'bored_fidgety': 'driver:something_to_do',
  'ritual_habit': 'driver:situational_habit',
  'autopilot': 'driver:autopilot',
  'social_awkward': 'driver:social_pressure',
  'fomo_special': 'driver:fomo',
  'enjoying_it': 'driver:tastes_good',
  'no_idea': 'driver:needs_exploration',
};

// Pattern mapping from "why stopped" responses
const PATTERN_MAPPINGS: Record<string, string[]> = {
  'all_or_nothing': ['pattern:all_or_nothing', 'exclude:rigid_rules'],
  'life_chaos': ['pattern:needs_simplicity', 'exclude:complex_systems'],
  'food_boredom': ['pattern:needs_variety', 'strategy:rotate_options'],
  'social_hard': ['pattern:social_priority', 'strategy:social_early'],
  'deprivation_snap': ['pattern:deprivation_sensitive', 'strategy:add_first'],
  'too_complicated': ['pattern:needs_simplicity', 'exclude:complex_tracking'],
  'slow_results': ['pattern:needs_non_scale_wins', 'strategy:other_metrics'],
  'became_obsessive': ['pattern:tracking_sensitive', 'exclude:counting', 'context:gentle_approach'],
  'unclear': ['pattern:needs_exploration'],
};

// Meal pattern mappings
const MEAL_PATTERN_MAPPINGS: Record<string, string[]> = {
  'three_meals': ['pattern:structured'],
  'skip_breakfast': ['pattern:back_loaded', 'focus:morning_protein'],
  'skip_lunch': ['pattern:skip_lunch', 'focus:midday_intervention'],
  'grazer': ['pattern:grazer', 'strategy:meal_structure'],
  'dinner_heavy': ['pattern:back_loaded', 'focus:front_load'],
  'totally_random': ['pattern:chaotic', 'strategy:single_anchor'],
};

// Timing mappings
const TIMING_MAPPINGS: Record<string, string> = {
  'morning_rush': 'timing:morning',
  'afternoon_crash': 'timing:afternoon',
  'after_work': 'timing:post_work',
  'evening': 'timing:evening',
  'late_night': 'timing:late_night',
  'weekends': 'timing:weekends',
  'all_day': 'timing:all_day',
};

// Kitchen context mappings
const KITCHEN_MAPPINGS: Record<string, string[]> = {
  'full_kitchen_time': ['context:can_cook'],
  'full_kitchen_no_time': ['context:no_time', 'strategy:assembly_meals', 'strategy:shortcuts'],
  'limited_kitchen': ['context:limited_kitchen', 'strategy:microwave_friendly', 'strategy:minimal_equipment'],
  'microwave_only': ['context:microwave', 'exclude:cooking_required'],
  'no_kitchen_travel': ['context:traveler', 'strategy:restaurant', 'strategy:travel_snacks'],
  'cant_cook': ['context:cooking_basics', 'strategy:assembly_meals', 'strategy:simple_techniques'],
};

// Life role context mappings
const LIFE_ROLE_MAPPINGS: Record<string, string[]> = {
  'shift_worker': ['context:shift_work', 'exclude:standard_meal_timing', 'exclude:if'],
  'parent_young': ['context:overwhelmed_parent', 'exclude:complex_meal_prep', 'strategy:one_handed', 'strategy:assembly'],
  'student': ['context:student', 'context:budget_aware', 'strategy:dorm_friendly'],
  'remote_worker': ['context:wfh', 'risk:grazing'],
  'caregiver': ['context:caregiver', 'context:time_poor'],
  'entrepreneur': ['context:unpredictable', 'strategy:flexible_framework'],
};

// Health condition mappings
const HEALTH_MAPPINGS: Record<string, string[]> = {
  'pcos': ['context:pcos', 'exclude:skip_breakfast', 'exclude:if', 'strategy:savory_breakfast', 'strategy:blood_sugar'],
  'menopause': ['context:menopause', 'exclude:cardio_only', 'strategy:protein_priority', 'strategy:strength'],
  'ibs_digestive': ['context:ibs', 'exclude:generic_fiber', 'strategy:fodmap_aware'],
  'gerd_reflux': ['context:gerd', 'strategy:timing_matters', 'strategy:trigger_tracking'],
  'breastfeeding': ['context:breastfeeding', 'exclude:aggressive_deficit', 'exclude:low_carb', 'strategy:calorie_floor'],
  'postpartum': ['context:postpartum', 'strategy:gentle', 'strategy:patience'],
  'diabetes': ['context:diabetes', 'strategy:blood_sugar', 'strategy:post_meal_walks'],
  'pregnant': ['context:pregnant', 'exclude:restriction', 'exclude:weight_loss'],
};

// Food relationship flags
const FOOD_RELATIONSHIP_MAPPINGS: Record<string, string[]> = {
  'stressful': ['context:tracking_sensitive', 'exclude:counting', 'exclude:weighing'],
  'triggers_worse': ['context:gentle_approach_required', 'exclude:counting', 'exclude:restriction', 'exclude:cheat_days'],
  'restrict_binge': ['context:gentle_approach_required', 'exclude:restriction', 'strategy:structured_eating', 'strategy:add_first'],
  'secret_eating': ['context:gentle_approach_required', 'strategy:no_shame', 'strategy:professional_referral'],
  'guilt_shame': ['context:gentle_approach_required', 'strategy:gentle_language'],
  'lost_period': ['context:gentle_approach_required', 'exclude:deficit', 'strategy:professional_referral'],
};

// Budget mappings
const BUDGET_MAPPINGS: Record<string, string[]> = {
  'major_factor': ['context:budget', 'exclude:superfoods', 'exclude:specialty_ingredients', 'strategy:cheap_protein', 'strategy:frozen_canned'],
  'food_insecurity': ['context:food_insecurity', 'context:budget', 'strategy:maximize_nutrition_dollar'],
};

// Feeding others mappings
const FEEDING_MAPPINGS: Record<string, string[]> = {
  'family_different': ['context:picky_family', 'strategy:component_cooking', 'strategy:family_friendly_swaps'],
};

// Build exclusion rules based on "hate list"
const HATE_LIST_EXCLUSIONS: Record<string, string[]> = {
  'rigid_rules': ['exclude:strict_protocols', 'exclude:all_or_nothing'],
  'counting': ['exclude:calorie_counting', 'exclude:macro_tracking', 'exclude:weighing_food'],
  'meal_prep': ['exclude:batch_cooking', 'exclude:tupperware_strategies'],
  'complex_recipes': ['exclude:complex_recipes', 'strategy:assembly_meals'],
  'cold_turkey': ['exclude:elimination', 'strategy:gradual'],
  'detailed_tracking': ['exclude:tracking', 'exclude:logging'],
};


// Helper function to get the right follow-up questions
export function getNextQuestions(responses: Map<string, string[]>): QuizQuestion[] {
  const questions = [...NEW_QUIZ_QUESTIONS];

  return questions.filter(q => {
    if (!q.conditionalOn) return true;

    const responseValues = responses.get(q.conditionalOn.questionId) || [];
    const primaryConditionMet = q.conditionalOn.values.some(v => responseValues.includes(v));

    if ((q.conditionalOn as any).additionalCondition) {
      const additional = (q.conditionalOn as any).additionalCondition;
      const additionalValues = responses.get(additional.questionId) || [];
      const additionalConditionMet = additional.values.some((v: string) => additionalValues.includes(v));
      return primaryConditionMet && additionalConditionMet;
    }

    return primaryConditionMet;
  });
}


// ==========================================
// MAIN PROFILE MAPPING FUNCTION
// ==========================================

export function mapQuizToProfile(responses: Map<string, any>): Partial<any> {
  const profile: any = {
    // Core goal info
    goals: [],
    quiz_goals: [],
    primary_focus: null,
    success_vision: null,
    
    // NEW: Comprehensive tagging system
    tags: {
      drivers: [],           // Why they eat the way they do
      contexts: [],          // Life situation constraints
      patterns: [],          // Behavioral patterns from history
      timings: [],           // When they struggle
      strategies: [],        // What approaches to use
      exclusions: [],        // What to NEVER suggest
    },
    
    // Existing fields (keeping for backwards compatibility)
    preferences: [],
    constraints: [],
    lifestyle: {},
    health_conditions: [],
    medical_conditions: [],
    specific_challenges: {},
    avoid_approaches: [],
    
    // NEW: Detailed context for tip personalization
    practical_context: {
      kitchen: null,
      budget: null,
      feeding: null,
      meal_pattern: null,
      trouble_times: [],
    },
    
    // NEW: Food relationship flags
    food_relationship: {
      tracking_comfort: null,
      flags: [],
      requires_gentle_approach: false,
    },
    
    // NEW: History info
    history: {
      previous_attempts: [],
      why_stopped: null,
    },
  };

  // ========== MAP PRIMARY AREA & GOALS ==========
  const primaryArea = responses.get('primary_area');
  if (primaryArea) {
    profile.primary_focus = primaryArea[0];

    const specificGoals = responses.get(`${primaryArea[0]}_specifics`) || [];
    profile.quiz_goals = specificGoals;
    profile.goals = getTipGoalsForQuizGoals(specificGoals);

    const blockerKey = `${primaryArea[0]}_blockers`;
    const specificBlockers = responses.get(blockerKey) || [];
    profile.specific_challenges[primaryArea[0]] = specificBlockers;
  }

  // ========== MAP VISION ==========
  profile.success_vision = responses.get('success_vision');

  // ========== MAP DRIVERS (NEW) ==========
  const eatingTriggers = responses.get('eating_triggers') || [];
  for (const trigger of eatingTriggers) {
    if (DRIVER_MAPPINGS[trigger]) {
      profile.tags.drivers.push(DRIVER_MAPPINGS[trigger]);
    }
  }

  // ========== MAP PREVIOUS ATTEMPTS & PATTERNS (NEW) ==========
  const previousAttempts = responses.get('previous_attempts') || [];
  profile.history.previous_attempts = previousAttempts;

  const whyStopped = responses.get('why_stopped')?.[0];
  if (whyStopped) {
    profile.history.why_stopped = whyStopped;
    const patterns = PATTERN_MAPPINGS[whyStopped] || [];
    for (const pattern of patterns) {
      if (pattern.startsWith('pattern:')) {
        profile.tags.patterns.push(pattern);
      } else if (pattern.startsWith('exclude:')) {
        profile.tags.exclusions.push(pattern);
      } else if (pattern.startsWith('strategy:')) {
        profile.tags.strategies.push(pattern);
      } else if (pattern.startsWith('context:')) {
        profile.tags.contexts.push(pattern);
      }
    }
  }

  // ========== MAP PRACTICAL CONTEXT (NEW) ==========
  
  // Meal pattern
  const mealPattern = responses.get('meal_pattern')?.[0];
  if (mealPattern) {
    profile.practical_context.meal_pattern = mealPattern;
    const patterns = MEAL_PATTERN_MAPPINGS[mealPattern] || [];
    for (const pattern of patterns) {
      if (pattern.startsWith('pattern:')) {
        profile.tags.patterns.push(pattern);
      } else if (pattern.startsWith('focus:') || pattern.startsWith('strategy:')) {
        profile.tags.strategies.push(pattern);
      }
    }
  }

  // Trouble times
  const troubleTimes = responses.get('trouble_time') || [];
  profile.practical_context.trouble_times = troubleTimes;
  for (const time of troubleTimes) {
    if (TIMING_MAPPINGS[time]) {
      profile.tags.timings.push(TIMING_MAPPINGS[time]);
    }
  }

  // Kitchen reality
  const kitchenReality = responses.get('kitchen_reality')?.[0];
  if (kitchenReality) {
    profile.practical_context.kitchen = kitchenReality;
    const tags = KITCHEN_MAPPINGS[kitchenReality] || [];
    for (const tag of tags) {
      if (tag.startsWith('context:')) {
        profile.tags.contexts.push(tag);
      } else if (tag.startsWith('strategy:')) {
        profile.tags.strategies.push(tag);
      } else if (tag.startsWith('exclude:')) {
        profile.tags.exclusions.push(tag);
      }
    }
  }

  // Budget
  const budgetReality = responses.get('budget_reality')?.[0];
  if (budgetReality) {
    profile.practical_context.budget = budgetReality;
    const tags = BUDGET_MAPPINGS[budgetReality] || [];
    for (const tag of tags) {
      if (tag.startsWith('context:')) {
        profile.tags.contexts.push(tag);
      } else if (tag.startsWith('strategy:')) {
        profile.tags.strategies.push(tag);
      } else if (tag.startsWith('exclude:')) {
        profile.tags.exclusions.push(tag);
      }
    }
  }

  // Feeding who
  const feedingWho = responses.get('feeding_who')?.[0];
  if (feedingWho) {
    profile.practical_context.feeding = feedingWho;
    const tags = FEEDING_MAPPINGS[feedingWho] || [];
    for (const tag of tags) {
      if (tag.startsWith('context:')) {
        profile.tags.contexts.push(tag);
      } else if (tag.startsWith('strategy:')) {
        profile.tags.strategies.push(tag);
      }
    }
  }

  // ========== MAP PREFERENCES & HATE LIST ==========
  profile.preferences = responses.get('things_you_love') || [];
  profile.avoid_approaches = responses.get('hate_list') || [];

  // Convert hate list to exclusions
  const hateList = responses.get('hate_list') || [];
  for (const hate of hateList) {
    if (HATE_LIST_EXCLUSIONS[hate]) {
      profile.tags.exclusions.push(...HATE_LIST_EXCLUSIONS[hate]);
    }
  }

  // ========== MAP LIFESTYLE ==========
  profile.lifestyle.chaos_level = responses.get('chaos_level')?.[0];
  profile.lifestyle.life_role = responses.get('life_role')?.[0];

  // Add life role context tags
  const lifeRole = responses.get('life_role')?.[0];
  if (lifeRole && LIFE_ROLE_MAPPINGS[lifeRole]) {
    const tags = LIFE_ROLE_MAPPINGS[lifeRole];
    for (const tag of tags) {
      if (tag.startsWith('context:')) {
        profile.tags.contexts.push(tag);
      } else if (tag.startsWith('exclude:')) {
        profile.tags.exclusions.push(tag);
      } else if (tag.startsWith('strategy:')) {
        profile.tags.strategies.push(tag);
      } else if (tag.startsWith('risk:')) {
        profile.tags.patterns.push(tag);
      }
    }
  }

  // ========== MAP HEALTH CONDITIONS (EXPANDED) ==========
  const healthConsiderations = responses.get('health_considerations') || [];
  const allergies = responses.get('which_allergies') || [];

  profile.medical_conditions = [
    ...healthConsiderations.filter((h: string) => h !== 'none' && h !== 'allergies'),
    ...allergies.map((a: string) => `${a}_allergy`)
  ];
  profile.health_conditions = profile.medical_conditions;

  // Add health-based context tags
  for (const condition of healthConsiderations) {
    if (HEALTH_MAPPINGS[condition]) {
      const tags = HEALTH_MAPPINGS[condition];
      for (const tag of tags) {
        if (tag.startsWith('context:')) {
          profile.tags.contexts.push(tag);
        } else if (tag.startsWith('exclude:')) {
          profile.tags.exclusions.push(tag);
        } else if (tag.startsWith('strategy:')) {
          profile.tags.strategies.push(tag);
        }
      }
    }
  }

  // ========== MAP FOOD RELATIONSHIP (NEW - SENSITIVE) ==========
  const trackingHistory = responses.get('tracking_history')?.[0];
  profile.food_relationship.tracking_comfort = trackingHistory;

  if (trackingHistory && FOOD_RELATIONSHIP_MAPPINGS[trackingHistory]) {
    const tags = FOOD_RELATIONSHIP_MAPPINGS[trackingHistory];
    for (const tag of tags) {
      if (tag.startsWith('context:')) {
        profile.tags.contexts.push(tag);
        if (tag === 'context:gentle_approach_required') {
          profile.food_relationship.requires_gentle_approach = true;
        }
      } else if (tag.startsWith('exclude:')) {
        profile.tags.exclusions.push(tag);
      }
    }
  }

  const eatingHistoryScreen = responses.get('eating_history_screen') || [];
  profile.food_relationship.flags = eatingHistoryScreen.filter((f: string) => f !== 'none_of_these');

  for (const flag of eatingHistoryScreen) {
    if (flag !== 'none_of_these' && FOOD_RELATIONSHIP_MAPPINGS[flag]) {
      const tags = FOOD_RELATIONSHIP_MAPPINGS[flag];
      for (const tag of tags) {
        if (tag.startsWith('context:')) {
          profile.tags.contexts.push(tag);
          if (tag === 'context:gentle_approach_required') {
            profile.food_relationship.requires_gentle_approach = true;
          }
        } else if (tag.startsWith('exclude:')) {
          profile.tags.exclusions.push(tag);
        } else if (tag.startsWith('strategy:')) {
          profile.tags.strategies.push(tag);
        }
      }
    }
  }

  // ========== MAP TEXTURE ISSUES (FOR PICKY EATERS) ==========
  const textureIssues = responses.get('texture_issues') || [];
  if (textureIssues.length > 0) {
    profile.specific_challenges.texture_issues = textureIssues;
    profile.tags.contexts.push('context:texture_sensitive');
    profile.tags.strategies.push('strategy:texture_matching');
  }

  // ========== DEDUPLICATE ALL TAGS ==========
  profile.tags.drivers = [...new Set(profile.tags.drivers)];
  profile.tags.contexts = [...new Set(profile.tags.contexts)];
  profile.tags.patterns = [...new Set(profile.tags.patterns)];
  profile.tags.timings = [...new Set(profile.tags.timings)];
  profile.tags.strategies = [...new Set(profile.tags.strategies)];
  profile.tags.exclusions = [...new Set(profile.tags.exclusions)];

  return profile;
}


// ==========================================
// HELPER FUNCTIONS FOR TIP SELECTION
// ==========================================

/**
 * Check if a tip should be excluded based on user's exclusion tags
 */
export function shouldExcludeTip(tipTags: string[], userExclusions: string[]): boolean {
  return tipTags.some(tag => userExclusions.includes(tag));
}

/**
 * Get the primary driver to focus on (for curriculum sequencing)
 */
export function getPrimaryDriver(drivers: string[]): string | null {
  // Priority order based on research
  const priorityOrder = [
    'driver:actually_hungry',      // Fix this first - it's foundational
    'driver:dopamine_emotional',   // Then address emotional drivers
    'driver:situational_habit',    // Then habits
    'driver:autopilot',            // Then autopilot
    'driver:something_to_do',      // Then fidgeting
    'driver:social_pressure',      // Social is contextual
    'driver:fomo',                 // FOMO is contextual
    'driver:tastes_good',          // This is actually fine if managed
  ];

  for (const driver of priorityOrder) {
    if (drivers.includes(driver)) {
      return driver;
    }
  }
  return drivers[0] || null;
}

/**
 * Get trouble times sorted by priority (for tip timing)
 */
export function getPriorityTroubleTimes(timings: string[]): string[] {
  const priorityOrder = [
    'timing:afternoon',    // 4pm crash is very fixable
    'timing:evening',      // Common and addressable
    'timing:post_work',    // Transition time
    'timing:late_night',   // After kids down
    'timing:morning',      // Rush time
    'timing:weekends',     // Less structure
    'timing:all_day',      // Needs single anchor first
  ];

  return priorityOrder.filter(t => timings.includes(t));
}

/**
 * Check if user requires gentle approach (for sensitive tip filtering)
 */
export function requiresGentleApproach(profile: any): boolean {
  return profile.food_relationship?.requires_gentle_approach ||
         profile.tags.contexts.includes('context:gentle_approach_required') ||
         profile.tags.contexts.includes('context:tracking_sensitive');
}

/**
 * Get context-appropriate strategies for a user
 */
export function getRecommendedStrategies(profile: any): string[] {
  const strategies = [...profile.tags.strategies];
  
  // Add universal wins if not excluded
  const universalStrategies = [
    'strategy:protein_anchor',
    'strategy:template_meals',
    'strategy:emergency_meals',
    'strategy:add_first',
    'strategy:post_meal_walk',
    'strategy:weekly_averages',
  ];
  
  for (const strategy of universalStrategies) {
    if (!profile.tags.exclusions.some((e: string) => 
      strategy.toLowerCase().includes(e.replace('exclude:', ''))
    )) {
      strategies.push(strategy);
    }
  }
  
  return [...new Set(strategies)];
}

// import { QuizQuestion } from '../types/quiz';
// import { getTipGoalsForQuizGoals } from './goalMappings';

// /**
//  * New Quiz Flow:
//  * 1. Area selection (simple start)
//  * 2. Specific goals within that area
//  * 3. Vision of success
//  * 4. Current blockers/challenges
//  * 5. Things they love/enjoy
//  * 6. Things that definitely don't work
//  * 7. Life context (chaos level, role)
//  */

// export const NEW_QUIZ_QUESTIONS: QuizQuestion[] = [
//   // ========== STEP 1: AREA SELECTION ==========
//   {
//     id: 'primary_area',
//     question: "Where do you most want to make a change?",
//     type: 'single_choice',
//     category: 'goals',
//     required: true,
//     helpText: "Let's start with one area - you can always add more later!",
//     options: [
//       { value: 'eating', label: '🥗 Eating habits' },
//       { value: 'sleeping', label: '😴 Sleeping better' },
//       { value: 'productivity', label: '📋 Productivity & organization' },
//       { value: 'exercise', label: '💪 Exercise & movement' },
//       { value: 'mindset', label: '🧠 Mindset & mental health' },
//       { value: 'relationships', label: '💝 Relationships & social life' },
//     ]
//   },

//   // ========== STEP 2: SPECIFIC GOALS BY AREA ==========

//   // Eating habits specific goals
//   {
//     id: 'eating_specifics',
//     question: "What specific eating habit do you want to work on?",
//     type: 'multiple_choice',
//     category: 'goals',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['eating'] },
//     helpText: "Pick 1-3 that feel most important right now",
//     options: [
//       { value: 'eat_more_veggies', label: 'Eat more vegetables & fruits' },
//       { value: 'reduce_junk_food', label: 'Cut back on junk/processed food' },
//       { value: 'control_portions', label: 'Better portion control' },
//       { value: 'reduce_sugar', label: 'Reduce sugar intake' },
//       { value: 'eat_more_protein', label: 'Get more protein' },
//       { value: 'drink_more_water', label: 'Drink more water' },
//       { value: 'practice_mindful_eating', label: 'Stop mindless snacking' },
//       { value: 'improve_meal_planning', label: 'Plan meals better' },
//       { value: 'cook_at_home', label: 'Cook at home more' },
//       { value: 'regular_meal_schedule', label: 'Regular eating times' },
//       { value: 'stop_binge_eating', label: 'Stop binge/stress eating' },
//       { value: 'manage_blood_sugar', label: 'Manage blood sugar' },
//       { value: 'pregnancy_nutrition', label: 'Eat better during pregnancy' },
//       { value: 'switch_to_plant_based', label: 'Switch to plant-based' },
//       { value: 'quit_alcohol', label: 'Cut out alcohol' },
//       { value: 'eat_more_fiber', label: 'Increase fiber intake' },
//       { value: 'lose_weight_eating', label: 'Lose weight' },
//       { value: 'eat_for_muscle_gain', label: 'Build muscle' },
//       { value: 'manage_cravings', label: 'Manage cravings better' },
//       { value: 'healthier_restaurant_choices', label: 'Better restaurant choices' },
//       { value: 'reduce_caffeine', label: 'Reduce caffeine' },
//       { value: 'reduce_carbs', label: 'Lower carb intake' },
//       { value: 'reduce_fat', label: 'Reduce fat intake' },
//       { value: 'reduce_sodium', label: 'Lower sodium' },
//     ]
//   },

//   // Sleep specific goals
//   {
//     id: 'sleep_specifics',
//     question: "What specific sleep issue do you want to tackle?",
//     type: 'multiple_choice',
//     category: 'goals',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['sleeping'] },
//     helpText: "Pick 1-3 that affect you most",
//     options: [
//       { value: 'fall_asleep_easier', label: 'Fall asleep faster' },
//       { value: 'stay_asleep_night', label: 'Stop waking up at night' },
//       { value: 'go_to_bed_earlier', label: 'Go to bed earlier' },
//       { value: 'consistent_sleep_schedule', label: 'Consistent sleep schedule' },
//       { value: 'wake_up_refreshed', label: 'Wake up feeling refreshed' },
//       { value: 'reduce_screen_before_bed', label: 'Less screens before bed' },
//       { value: 'bedtime_wind_down', label: 'Better wind-down routine' },
//       { value: 'improve_sleep_environment', label: 'Optimize sleep environment' },
//       { value: 'stop_hitting_snooze', label: 'Stop hitting snooze' },
//     ]
//   },

//   // Productivity specific goals
//   {
//     id: 'productivity_specifics',
//     question: "What productivity challenge do you want to solve?",
//     type: 'multiple_choice',
//     category: 'goals',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['productivity'] },
//     helpText: "Pick 1-3 that would make the biggest difference",
//     options: [
//       { value: 'stop_procrastinating', label: 'Stop procrastinating' },
//       { value: 'improve_focus', label: 'Better focus & concentration' },
//       { value: 'better_time_management', label: 'Manage time better' },
//       { value: 'declutter_spaces', label: 'Declutter my space' },
//       { value: 'organize_digital_life', label: 'Organize digital life' },
//       { value: 'build_daily_routine', label: 'Build better routines' },
//       { value: 'prioritize_tasks', label: 'Better at prioritizing' },
//       { value: 'finish_what_start', label: 'Actually finish what I start' },
//       { value: 'reduce_overwhelm', label: 'Feel less overwhelmed' },
//       { value: 'improve_planning', label: 'Plan ahead better' },
//     ]
//   },

//   // Exercise specific goals
//   {
//     id: 'exercise_specifics',
//     question: "What's your exercise goal?",
//     type: 'multiple_choice',
//     category: 'goals',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['exercise'] },
//     helpText: "Pick 1-3 to focus on",
//     options: [
//       { value: 'start_exercising', label: 'Just start moving more' },
//       { value: 'consistent_workouts', label: 'Exercise consistently' },
//       { value: 'build_strength', label: 'Build strength' },
//       { value: 'improve_cardio', label: 'Improve cardio/endurance' },
//       { value: 'increase_flexibility', label: 'Increase flexibility' },
//       { value: 'exercise_lose_weight', label: 'Exercise for weight loss' },
//       { value: 'exercise_for_energy', label: 'Have more energy' },
//       { value: 'find_enjoyable_exercise', label: 'Find exercise I enjoy' },
//       { value: 'workout_at_home', label: 'Exercise at home' },
//       { value: 'more_active_lifestyle', label: 'Be more active daily' },
//       { value: 'boost_endurance', label: 'Improve athletic endurance' },
//       { value: 'increase_strength_performance', label: 'Increase strength performance' },
//     ]
//   },

//   // Mindset specific goals
//   {
//     id: 'mindset_specifics',
//     question: "What mindset challenge do you face?",
//     type: 'multiple_choice',
//     category: 'goals',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['mindset'] },
//     helpText: "Pick 1-3 that resonate most",
//     options: [
//       { value: 'manage_stress', label: 'Manage stress better' },
//       { value: 'reduce_anxiety', label: 'Reduce anxiety' },
//       { value: 'stop_negative_thoughts', label: 'Stop negative thinking' },
//       { value: 'practice_self_compassion', label: 'Be kinder to myself' },
//       { value: 'build_confidence', label: 'Build confidence' },
//       { value: 'practice_mindfulness', label: 'Be more present' },
//       { value: 'cultivate_gratitude', label: 'Practice gratitude' },
//       { value: 'set_boundaries', label: 'Set better boundaries' },
//       { value: 'overcome_perfectionism', label: 'Let go of perfectionism' },
//       { value: 'stay_motivated', label: 'Stay motivated' },
//     ]
//   },

//   // Relationships specific goals
//   {
//     id: 'relationship_specifics',
//     question: "What relationship area needs attention?",
//     type: 'multiple_choice',
//     category: 'goals',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['relationships'] },
//     helpText: "Pick 1-3 to work on",
//     options: [
//       { value: 'improve_communication', label: 'Better communication' },
//       { value: 'more_quality_time', label: 'More quality time' },
//       { value: 'stronger_social_connections', label: 'Build social connections' },
//       { value: 'handle_conflicts_better', label: 'Handle conflicts better' },
//       { value: 'express_needs_clearly', label: 'Express my needs' },
//       { value: 'become_better_listener', label: 'Be a better listener' },
//       { value: 'improve_work_life_balance', label: 'Balance work & relationships' },
//       { value: 'more_family_time', label: 'More family time' },
//       { value: 'build_dating_confidence', label: 'Improve dating life' },
//       { value: 'strengthen_friendships', label: 'Nurture friendships' },
//     ]
//   },

//   // ========== STEP 3: VISION OF SUCCESS ==========
//   {
//     id: 'success_vision',
//     question: "If you were successful with this change, what would your life look like?",
//     type: 'text',
//     category: 'motivation',
//     required: true,
//     placeholder: "Describe in a few sentences what success looks like to you...",
//     helpText: "Paint a picture of your ideal outcome - be specific!"
//   },

//   // ========== STEP 4: AREA-SPECIFIC BLOCKERS ==========

//   // Eating-specific blockers
//   {
//     id: 'eating_blockers',
//     question: "What makes healthy eating hard for you?",
//     type: 'multiple_choice',
//     category: 'challenges',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['eating'] },
//     helpText: "Be honest - select all that apply",
//     options: [
//       { value: 'hate_veggies', label: '🥦 I don\'t like vegetables' },
//       { value: 'love_sweets', label: '🍫 Major sweet tooth' },
//       { value: 'stress_eating', label: '😰 I eat when stressed' },
//       { value: 'no_time_cook', label: '⏰ No time to cook' },
//       { value: 'dont_know_cook', label: '👨‍🍳 Don\'t know how to cook' },
//       { value: 'expensive', label: '💰 Healthy food is expensive' },
//       { value: 'family_different', label: '👨‍👩‍👧 Family wants different foods' },
//       { value: 'social_events', label: '🎉 Social events = food temptation' },
//       { value: 'travel_eating', label: '✈️ Travel/eating out a lot' },
//       { value: 'bored_eating', label: '😑 I eat when bored' },
//       { value: 'night_snacking', label: '🌙 Late night cravings' },
//       { value: 'picky_eater', label: '🙅 Very picky eater' },
//       { value: 'emotional_eating', label: '💔 Emotional eating' },
//       { value: 'no_willpower', label: '😔 Feel like I have no willpower' },
//     ]
//   },

//   // Sleep-specific blockers
//   {
//     id: 'sleep_blockers',
//     question: "What's messing with your sleep?",
//     type: 'multiple_choice',
//     category: 'challenges',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['sleeping'] },
//     helpText: "Select all that apply",
//     options: [
//       { value: 'racing_mind', label: '🧠 Can\'t turn off my brain' },
//       { value: 'phone_addiction', label: '📱 Can\'t stop scrolling' },
//       { value: 'netflix_binge', label: '📺 One more episode syndrome' },
//       { value: 'work_late', label: '💻 Working late' },
//       { value: 'kids_wake', label: '👶 Kids wake me up' },
//       { value: 'partner_schedule', label: '👫 Partner has different schedule' },
//       { value: 'noise', label: '🔊 Noisy environment' },
//       { value: 'uncomfortable', label: '🛏️ Uncomfortable bed/room' },
//       { value: 'anxiety_worry', label: '😟 Anxiety/worrying' },
//       { value: 'revenge_bedtime', label: '🎮 Revenge bedtime procrastination' },
//       { value: 'inconsistent', label: '🎲 Inconsistent schedule' },
//       { value: 'caffeine', label: '☕ Too much caffeine' },
//       { value: 'naps', label: '😴 Napping during day' },
//     ]
//   },

//   // Productivity-specific blockers
//   {
//     id: 'productivity_blockers',
//     question: "What kills your productivity?",
//     type: 'multiple_choice',
//     category: 'challenges',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['productivity'] },
//     helpText: "Check all your productivity killers",
//     options: [
//       { value: 'distractions', label: '📱 Constant distractions' },
//       { value: 'procrastination', label: '⏰ Chronic procrastination' },
//       { value: 'perfectionism', label: '💯 Perfectionism paralysis' },
//       { value: 'no_system', label: '🗂️ No organization system' },
//       { value: 'too_many_tools', label: '🛠️ Too many apps/tools' },
//       { value: 'unclear_priorities', label: '❓ Don\'t know what\'s important' },
//       { value: 'overcommitted', label: '😵 Say yes to everything' },
//       { value: 'adhd_add', label: '🧠 ADHD/attention issues' },
//       { value: 'energy_crashes', label: '🔋 Energy ups and downs' },
//       { value: 'messy_space', label: '🗑️ Cluttered workspace' },
//       { value: 'interruptions', label: '🚨 Constant interruptions' },
//       { value: 'no_motivation', label: '😑 No motivation' },
//       { value: 'overwhelming_tasks', label: '🌊 Tasks feel too big' },
//     ]
//   },

//   // Exercise-specific blockers
//   {
//     id: 'exercise_blockers',
//     question: "What stops you from exercising?",
//     type: 'multiple_choice',
//     category: 'challenges',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['exercise'] },
//     helpText: "Be real - what gets in the way?",
//     options: [
//       { value: 'hate_gym', label: '🏋️ Hate the gym' },
//       { value: 'self_conscious', label: '😳 Feel self-conscious' },
//       { value: 'no_time', label: '⏰ No time' },
//       { value: 'too_tired', label: '😴 Always too tired' },
//       { value: 'boring', label: '😑 Exercise is boring' },
//       { value: 'hurts', label: '🤕 It hurts/injuries' },
//       { value: 'no_results', label: '📉 Don\'t see results' },
//       { value: 'expensive', label: '💰 Gym/classes too expensive' },
//       { value: 'weather', label: '🌧️ Weather dependent' },
//       { value: 'no_childcare', label: '👶 No childcare' },
//       { value: 'dont_know_how', label: '❓ Don\'t know where to start' },
//       { value: 'hate_sweating', label: '💦 Hate getting sweaty' },
//       { value: 'no_accountability', label: '🤝 No workout buddy' },
//     ]
//   },

//   // Mindset-specific blockers
//   {
//     id: 'mindset_blockers',
//     question: "What mental patterns hold you back?",
//     type: 'multiple_choice',
//     category: 'challenges',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['mindset'] },
//     helpText: "Which of these sound familiar?",
//     options: [
//       { value: 'negative_spiral', label: '🌀 Negative thought spirals' },
//       { value: 'comparison', label: '📱 Comparing to others' },
//       { value: 'impostor', label: '🎭 Impostor syndrome' },
//       { value: 'catastrophizing', label: '😱 Always expect the worst' },
//       { value: 'people_pleasing', label: '🤝 Can\'t say no' },
//       { value: 'perfectionism', label: '💯 Nothing\'s ever good enough' },
//       { value: 'past_trauma', label: '💔 Past experiences' },
//       { value: 'no_boundaries', label: '🚫 Poor boundaries' },
//       { value: 'self_critical', label: '😔 Too hard on myself' },
//       { value: 'avoidance', label: '🙈 Avoiding feelings' },
//       { value: 'overthinking', label: '🤯 Overthink everything' },
//       { value: 'no_support', label: '🏝️ Feel alone' },
//     ]
//   },

//   // Relationship-specific blockers
//   {
//     id: 'relationship_blockers',
//     question: "What makes relationships challenging?",
//     type: 'multiple_choice',
//     category: 'challenges',
//     required: true,
//     conditionalOn: { questionId: 'primary_area', values: ['relationships'] },
//     helpText: "What gets in the way?",
//     options: [
//       { value: 'no_time', label: '⏰ No time for people' },
//       { value: 'conflict_avoidance', label: '😰 Avoid difficult conversations' },
//       { value: 'communication', label: '💬 Struggle to express myself' },
//       { value: 'trust_issues', label: '🔒 Hard to trust' },
//       { value: 'different_needs', label: '⚖️ Different needs/expectations' },
//       { value: 'work_priority', label: '💼 Work always comes first' },
//       { value: 'social_anxiety', label: '😟 Social anxiety' },
//       { value: 'introvert_drain', label: '🔋 Socializing drains me' },
//       { value: 'toxic_patterns', label: '🔄 Repeat unhealthy patterns' },
//       { value: 'boundaries', label: '🚧 Can\'t set boundaries' },
//       { value: 'long_distance', label: '📍 Distance/logistics' },
//       { value: 'past_hurt', label: '💔 Past relationship hurt' },
//     ]
//   },


//   // ========== STEP 5: THINGS YOU LOVE ==========
//   {
//     id: 'things_you_love',
//     question: "What do you genuinely enjoy in life?",
//     type: 'multiple_choice',
//     category: 'preferences',
//     required: true,
//     helpText: "Select all that bring you joy - we'll use these to make tips more appealing",
//     options: [
//       // Social activities
//       { value: 'restaurant_friends', label: '🍽️ Going to restaurants with friends' },
//       { value: 'coffee_shops', label: '☕ Coffee shops & cafes' },
//       { value: 'group_activities', label: '👥 Group activities & classes' },
//       { value: 'family_time', label: '👨‍👩‍👧 Family activities' },
//       { value: 'parties_events', label: '🎉 Parties & social events' },
//       { value: 'helping_others', label: '🤝 Helping others/volunteering' },
//       { value: 'deep_conversations', label: '💬 Deep conversations' },

//       // Movement & outdoor activities
//       { value: 'walking', label: '🚶 Walking' },
//       { value: 'dancing', label: '💃 Dancing to music' },
//       { value: 'nature_outdoors', label: '🌳 Being in nature' },
//       { value: 'playing_kids_pets', label: '🐕 Playing with kids/pets' },
//       { value: 'bike_rides', label: '🚴 Bike rides' },
//       { value: 'swimming_water', label: '🏊 Swimming/water activities' },
//       { value: 'gardening', label: '🌱 Gardening' },
//       { value: 'sports_watching', label: '⚽ Watching sports' },
//       { value: 'sports_playing', label: '🏃 Playing sports' },
//       { value: 'hiking_exploring', label: '🥾 Hiking & exploring' },

//       // Entertainment & media
//       { value: 'podcasts_audiobooks', label: '🎧 Podcasts/audiobooks' },
//       { value: 'youtube_videos', label: '📺 YouTube/videos' },
//       { value: 'music_listening', label: '🎵 Listening to music' },
//       { value: 'music_making', label: '🎸 Making music' },
//       { value: 'reading', label: '📚 Reading' },
//       { value: 'games_video', label: '🎮 Video games' },
//       { value: 'games_board', label: '🎲 Board games/cards' },
//       { value: 'puzzles_brain', label: '🧩 Puzzles & brain teasers' },
//       { value: 'tv_movies', label: '🎬 TV shows/movies' },
//       { value: 'social_media', label: '📱 Social media' },
//       { value: 'photography', label: '📸 Photography' },

//       // Food & cooking
//       { value: 'trying_restaurants', label: '🍜 Trying new restaurants' },
//       { value: 'cooking_experimenting', label: '👨‍🍳 Cooking/experimenting' },
//       { value: 'baking', label: '🧁 Baking' },
//       { value: 'farmers_markets', label: '🥕 Farmers markets' },
//       { value: 'food_culture', label: '🌮 Cultural foods' },
//       { value: 'wine_cocktails', label: '🍷 Wine/cocktails' },
//       { value: 'coffee_tea', label: '☕ Coffee/tea rituals' },

//       // Creative & hobbies
//       { value: 'creative_projects', label: '🎨 Art/craft projects' },
//       { value: 'writing_journaling', label: '✍️ Writing/journaling' },
//       { value: 'diy_projects', label: '🔨 DIY/home projects' },
//       { value: 'collecting', label: '📦 Collecting things' },
//       { value: 'fashion_style', label: '👗 Fashion/personal style' },
//       { value: 'decorating', label: '🏠 Decorating spaces' },

//       // Learning & growth
//       { value: 'learning_new', label: '🎓 Learning new things' },
//       { value: 'documentaries', label: '🎥 Documentaries' },
//       { value: 'workshops_seminars', label: '👥 Workshops/seminars' },
//       { value: 'self_improvement', label: '📈 Self-improvement' },
//       { value: 'spiritual_practices', label: '🕉️ Spiritual practices' },

//       // Lifestyle preferences
//       { value: 'spontaneous_adventures', label: '✨ Spontaneous adventures' },
//       { value: 'planning_organizing', label: '📅 Planning & organizing' },
//       { value: 'solo_time', label: '🧘 Solo/quiet time' },
//       { value: 'busy_productive', label: '⚡ Staying busy' },
//       { value: 'tech_gadgets', label: '📱 Tech & gadgets' },
//       { value: 'minimalism', label: '🌿 Simple/minimalist' },
//       { value: 'traditions_rituals', label: '🕯️ Traditions & rituals' },
//       { value: 'travel_exploring', label: '✈️ Travel & exploring' },
//       { value: 'cozy_comfort', label: '🛋️ Cozy comfort' },
//       { value: 'competition', label: '🏆 Competition/challenges' },
//       { value: 'shopping', label: '🛍️ Shopping' },
//       { value: 'animals', label: '🦜 Animals' },
//     ]
//   },

//   // ========== STEP 6: THINGS THAT DON'T WORK ==========
//   {
//     id: 'hate_list',
//     question: "What definitely DOESN'T work for you?",
//     type: 'multiple_choice',
//     category: 'preferences',
//     required: false,
//     helpText: "We'll avoid suggesting these approaches",
//     options: [
//       { value: 'rigid_rules', label: '📏 Strict rules & restrictions' },
//       { value: 'counting', label: '🔢 Counting (calories/macros/etc)' },
//       { value: 'gym', label: '🏋️ Going to the gym' },
//       { value: 'morning_routine', label: '🌅 Early morning routines' },
//       { value: 'meal_prep', label: '🥗 Meal prepping' },
//       { value: 'meditation', label: '🧘 Meditation/sitting still' },
//       { value: 'journaling', label: '📓 Journaling/writing' },
//       { value: 'group_accountability', label: '👥 Group accountability' },
//       { value: 'complex_recipes', label: '👨‍🍳 Complicated recipes' },
//       { value: 'supplements', label: '💊 Taking supplements' },
//       { value: 'cold_turkey', label: '🚫 Going cold turkey' },
//       { value: 'public_commitments', label: '📢 Public commitments' },
//       { value: 'detailed_tracking', label: '📊 Detailed tracking' },
//       { value: 'long_workouts', label: '⏱️ Long workout sessions' },
//     ]
//   },

//   // ========== STEP 7: LIFE CONTEXT ==========
//   {
//     id: 'chaos_level',
//     question: "How would you describe your daily life right now?",
//     type: 'single_choice',
//     category: 'lifestyle',
//     required: true,
//     options: [
//       { value: 'very_structured', label: '📅 Very structured & predictable' },
//       { value: 'mostly_routine', label: '🔄 Mostly routine with some variety' },
//       { value: 'flexible', label: '🌊 Flexible but manageable' },
//       { value: 'unpredictable', label: '🎲 Pretty unpredictable day-to-day' },
//       { value: 'total_chaos', label: '🌪️ Total chaos (and that\'s ok!)' },
//     ]
//   },

//   {
//     id: 'life_role',
//     question: "Which best describes your current life situation?",
//     type: 'single_choice',
//     category: 'lifestyle',
//     required: true,
//     helpText: "This helps us suggest tips that fit your lifestyle",
//     options: [
//       { value: 'student', label: '🎓 Student' },
//       { value: 'professional', label: '💼 Working professional' },
//       { value: 'shift_worker', label: '🔄 Shift worker/irregular hours' },
//       { value: 'parent_young', label: '👶 Parent of young kids' },
//       { value: 'parent_teens', label: '👦 Parent of older kids/teens' },
//       { value: 'caregiver', label: '💝 Caregiver' },
//       { value: 'remote_worker', label: '🏠 Remote worker' },
//       { value: 'retired', label: '🌅 Retired/semi-retired' },
//       { value: 'entrepreneur', label: '🚀 Entrepreneur/self-employed' },
//       { value: 'mixed', label: '🎭 Bit of everything' },
//     ]
//   },

//   // ========== OPTIONAL: HEALTH CONSIDERATIONS ==========
//   {
//     id: 'health_considerations',
//     question: "Any health considerations we should know about?",
//     type: 'multiple_choice',
//     category: 'health',
//     required: false,
//     helpText: "This helps us filter out inappropriate suggestions (optional)",
//     options: [
//       { value: 'diabetes', label: '🩺 Diabetes' },
//       { value: 'heart', label: '❤️ Heart/blood pressure' },
//       { value: 'digestive', label: '🦠 Digestive issues' },
//       { value: 'allergies', label: '🥜 Food allergies' },
//       { value: 'pregnancy', label: '🤰 Pregnant/nursing' },
//       { value: 'mobility', label: '♿ Mobility limitations' },
//       { value: 'mental_health', label: '🧠 Mental health conditions' },
//       { value: 'none', label: '✅ None of these' },
//     ]
//   },

//   // If allergies selected
//   {
//     id: 'which_allergies',
//     question: "Which food allergies/intolerances?",
//     type: 'multiple_choice',
//     category: 'health',
//     required: true,
//     conditionalOn: { questionId: 'health_considerations', values: ['allergies'] },
//     options: [
//       { value: 'gluten', label: '🌾 Gluten/Celiac' },
//       { value: 'dairy', label: '🥛 Dairy/Lactose' },
//       { value: 'nuts', label: '🥜 Nuts' },
//       { value: 'eggs', label: '🥚 Eggs' },
//       { value: 'soy', label: '🌱 Soy' },
//       { value: 'seafood', label: '🦐 Seafood/Shellfish' },
//     ]
//   }
// ];

// // Helper function to get the right follow-up questions
// export function getNextQuestions(responses: Map<string, string[]>): QuizQuestion[] {
//   const questions = [...NEW_QUIZ_QUESTIONS];

//   // Filter based on conditional logic
//   return questions.filter(q => {
//     if (!q.conditionalOn) return true;

//     // Check primary condition
//     const responseValues = responses.get(q.conditionalOn.questionId) || [];
//     const primaryConditionMet = q.conditionalOn.values.some(v => responseValues.includes(v));

//     // Check additional condition if exists (for compound conditionals)
//     if ((q.conditionalOn as any).additionalCondition) {
//       const additional = (q.conditionalOn as any).additionalCondition;
//       const additionalValues = responses.get(additional.questionId) || [];
//       const additionalConditionMet = additional.values.some((v: string) => additionalValues.includes(v));
//       return primaryConditionMet && additionalConditionMet;
//     }

//     return primaryConditionMet;
//   });
// }

// // Map quiz responses to user profile
// export function mapQuizToProfile(responses: Map<string, any>): Partial<any> {
//   const profile: any = {
//     goals: [],           // Mapped tip database goals
//     quiz_goals: [],      // Original quiz goals for reference
//     preferences: [],
//     constraints: [],
//     lifestyle: {},
//     health_conditions: [],
//     specific_challenges: {}
//   };

//   // Map primary area to goals
//   const primaryArea = responses.get('primary_area');
//   if (primaryArea) {
//     profile.primary_focus = primaryArea[0];

//     // Map specific goals based on area
//     const specificGoals = responses.get(`${primaryArea[0]}_specifics`) || [];
//     // Store both the original quiz goals and the mapped tip goals
//     profile.quiz_goals = specificGoals;
//     // Convert quiz goals to tip database goals using the mapping
//     profile.goals = getTipGoalsForQuizGoals(specificGoals);

//     // Map area-specific blockers
//     const blockerKey = `${primaryArea[0]}_blockers`;
//     const specificBlockers = responses.get(blockerKey) || [];
//     profile.specific_challenges[primaryArea[0]] = specificBlockers;

//     // Add any follow-up preferences (like veggie or sweet alternatives)
//     if (responses.get('veggie_specifics')) {
//       profile.specific_challenges.veggie_approach = responses.get('veggie_specifics');
//     }
//     if (responses.get('sweet_alternatives')) {
//       profile.specific_challenges.sweet_approach = responses.get('sweet_alternatives');
//     }
//   }

//   // Vision of success
//   profile.success_vision = responses.get('success_vision');

//   // Things you love become preferences
//   profile.preferences = responses.get('things_you_love') || [];

//   // Things to avoid
//   profile.avoid_approaches = responses.get('hate_list') || [];

//   // Lifestyle factors
//   profile.lifestyle.chaos_level = responses.get('chaos_level')?.[0];
//   profile.lifestyle.life_role = responses.get('life_role')?.[0];

//   // Health considerations
//   const healthConsiderations = responses.get('health_considerations') || [];
//   const allergies = responses.get('which_allergies') || [];

//   profile.medical_conditions = [
//     ...healthConsiderations.filter(h => h !== 'none' && h !== 'allergies'),
//     ...allergies.map(a => `${a}_allergy`)
//   ];

//   return profile;
// }