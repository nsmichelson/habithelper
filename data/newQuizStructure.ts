import { QuizQuestion } from '../types/quiz';
import { getTipGoalsForQuizGoals } from './goalMappings';

/**
 * New Quiz Flow:
 * 1. Area selection (simple start)
 * 2. Specific goals within that area
 * 3. Vision of success
 * 4. Current blockers/challenges
 * 5. Things they love/enjoy
 * 6. Things that definitely don't work
 * 7. Life context (chaos level, role)
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
      { value: 'productivity', label: '📋 Productivity & organization' },
      { value: 'exercise', label: '💪 Exercise & movement' },
      { value: 'mindset', label: '🧠 Mindset & mental health' },
      { value: 'relationships', label: '💝 Relationships & social life' },
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


  // ========== STEP 5: THINGS YOU LOVE ==========
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

  // ========== STEP 6: THINGS THAT DON'T WORK ==========
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

  // ========== STEP 7: LIFE CONTEXT ==========
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

  // ========== OPTIONAL: HEALTH CONSIDERATIONS ==========
  {
    id: 'health_considerations',
    question: "Any health considerations we should know about?",
    type: 'multiple_choice',
    category: 'health',
    required: false,
    helpText: "This helps us filter out inappropriate suggestions (optional)",
    options: [
      { value: 'diabetes', label: '🩺 Diabetes' },
      { value: 'heart', label: '❤️ Heart/blood pressure' },
      { value: 'digestive', label: '🦠 Digestive issues' },
      { value: 'allergies', label: '🥜 Food allergies' },
      { value: 'pregnancy', label: '🤰 Pregnant/nursing' },
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
  }
];

// Helper function to get the right follow-up questions
export function getNextQuestions(responses: Map<string, string[]>): QuizQuestion[] {
  const questions = [...NEW_QUIZ_QUESTIONS];

  // Filter based on conditional logic
  return questions.filter(q => {
    if (!q.conditionalOn) return true;

    // Check primary condition
    const responseValues = responses.get(q.conditionalOn.questionId) || [];
    const primaryConditionMet = q.conditionalOn.values.some(v => responseValues.includes(v));

    // Check additional condition if exists (for compound conditionals)
    if ((q.conditionalOn as any).additionalCondition) {
      const additional = (q.conditionalOn as any).additionalCondition;
      const additionalValues = responses.get(additional.questionId) || [];
      const additionalConditionMet = additional.values.some((v: string) => additionalValues.includes(v));
      return primaryConditionMet && additionalConditionMet;
    }

    return primaryConditionMet;
  });
}

// Map quiz responses to user profile
export function mapQuizToProfile(responses: Map<string, any>): Partial<any> {
  const profile: any = {
    goals: [],           // Mapped tip database goals
    quiz_goals: [],      // Original quiz goals for reference
    preferences: [],
    constraints: [],
    lifestyle: {},
    health_conditions: [],
    specific_challenges: {}
  };

  // Map primary area to goals
  const primaryArea = responses.get('primary_area');
  if (primaryArea) {
    profile.primary_focus = primaryArea[0];

    // Map specific goals based on area
    const specificGoals = responses.get(`${primaryArea[0]}_specifics`) || [];
    // Store both the original quiz goals and the mapped tip goals
    profile.quiz_goals = specificGoals;
    // Convert quiz goals to tip database goals using the mapping
    profile.goals = getTipGoalsForQuizGoals(specificGoals);

    // Map area-specific blockers
    const blockerKey = `${primaryArea[0]}_blockers`;
    const specificBlockers = responses.get(blockerKey) || [];
    profile.specific_challenges[primaryArea[0]] = specificBlockers;

    // Add any follow-up preferences (like veggie or sweet alternatives)
    if (responses.get('veggie_specifics')) {
      profile.specific_challenges.veggie_approach = responses.get('veggie_specifics');
    }
    if (responses.get('sweet_alternatives')) {
      profile.specific_challenges.sweet_approach = responses.get('sweet_alternatives');
    }
  }

  // Vision of success
  profile.success_vision = responses.get('success_vision');

  // Things you love become preferences
  profile.preferences = responses.get('things_you_love') || [];

  // Things to avoid
  profile.avoid_approaches = responses.get('hate_list') || [];

  // Lifestyle factors
  profile.lifestyle.chaos_level = responses.get('chaos_level')?.[0];
  profile.lifestyle.life_role = responses.get('life_role')?.[0];

  // Health considerations
  const healthConsiderations = responses.get('health_considerations') || [];
  const allergies = responses.get('which_allergies') || [];

  profile.medical_conditions = [
    ...healthConsiderations.filter(h => h !== 'none' && h !== 'allergies'),
    ...allergies.map(a => `${a}_allergy`)
  ];

  return profile;
}