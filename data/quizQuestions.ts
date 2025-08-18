import { QuizQuestion } from '../types/quiz';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Introduction - Start fun!
  {
    id: 'real_talk',
    question: "Let's be real - what's your actual relationship with vegetables?",
    type: 'single_choice',
    category: 'food personality',
    required: true,
    helpText: 'No judgment here! We all have our things.',
    options: [
      { value: 'love_them', label: 'I genuinely love them' },
      { value: 'tolerate', label: 'I eat them because I should' },
      { value: 'hide_them', label: 'I have to hide them in other foods' },
      { value: 'avoid', label: 'I basically have the taste buds of a 5-year-old' },
      { value: 'complicated', label: "It's complicated - depends on the veggie" },
    ]
  },

  // What they can't give up
  {
    id: 'non_negotiables',
    question: "What's your food kryptonite? (The thing you'd never want to give up)",
    type: 'multiple_choice',
    category: 'food personality',
    required: false,
    helpText: "We won't make you give these up - promise! Select all that apply.",
    options: [
      { value: 'chocolate', label: 'Chocolate is life' },
      { value: 'cheese', label: 'Cheese on everything' },
      { value: 'coffee_drinks', label: 'Fancy coffee drinks' },
      { value: 'chips_crunchy', label: 'Crunchy salty snacks' },
      { value: 'bread_carbs', label: 'Bread/pasta/carbs' },
      { value: 'candy', label: 'Candy and sweets' },
      { value: 'soda', label: 'Soda/energy drinks' },
      { value: 'alcohol', label: 'My evening wine/beer' },
      { value: 'fast_food', label: 'Fast food (no shame!)' },
    ]
  },

  // Past attempts
  {
    id: 'diet_history',
    question: "What's your history with healthy eating attempts?",
    type: 'single_choice',
    category: 'experience',
    required: true,
    options: [
      { value: 'never_tried', label: "Haven't really tried to change" },
      { value: 'yo_yo', label: 'The classic yo-yo: good for a week, then chaos' },
      { value: 'too_extreme', label: "Tried going too extreme, crashed and burned" },
      { value: 'slow_progress', label: "Making slow progress but it's hard" },
      { value: 'doing_well', label: "Actually doing pretty well, just need refinement" },
      { value: 'overwhelmed', label: "Too much conflicting info, I'm overwhelmed" },
    ]
  },

  // Current life chaos level
  {
    id: 'life_chaos',
    question: "How chaotic is your life right now?",
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    helpText: "Be honest - we'll match tips to your actual life",
    options: [
      { value: 'zen', label: 'Pretty chill, I have time and energy' },
      { value: 'normal', label: 'Normal busy - work, life, the usual' },
      { value: 'juggling', label: 'Juggling a lot but managing' },
      { value: 'survival', label: 'Survival mode (kids/work/stress/all of it)' },
      { value: 'dumpster_fire', label: '🔥 Complete dumpster fire 🔥' },
    ]
  },

  // Medical stuff (but make it less clinical)
  {
    id: 'health_stuff',
    question: 'Any health stuff we should know about?',
    type: 'multiple_choice',
    category: 'medical',
    required: true,
    helpText: "We'll make sure suggestions are safe and helpful for you",
    options: [
      { value: 'none', label: "Nope, I'm good" },
      { value: 'diabetes', label: 'Diabetes (any type)' },
      { value: 'heart', label: 'Heart/cholesterol issues' },
      { value: 'digestive', label: 'Digestive issues (IBS, etc)' },
      { value: 'pregnancy', label: 'Pregnant or breastfeeding' },
      { value: 'allergies', label: 'Food allergies (we\'ll ask which ones next)' },
      { value: 'other', label: 'Something else' },
    ]
  },

  // Only show if they selected allergies
  {
    id: 'which_allergies',
    question: 'Which allergies do you have?',
    type: 'multiple_choice',
    category: 'medical',
    required: true,
    conditionalOn: { questionId: 'health_stuff', values: ['allergies'] },
    options: [
      { value: 'nuts', label: 'Nuts (peanuts/tree nuts)' },
      { value: 'dairy', label: 'Dairy/lactose' },
      { value: 'gluten', label: 'Gluten/celiac' },
      { value: 'eggs', label: 'Eggs' },
      { value: 'seafood', label: 'Fish/shellfish' },
      { value: 'soy', label: 'Soy' },
    ]
  },

  // What actually matters to them
  {
    id: 'real_goals',
    question: "What actually matters to you? (Not what you think you 'should' say)",
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    helpText: 'Pick your top 2-3 real motivations',
    options: [
      { value: 'look_good', label: 'Look better naked' },
      { value: 'more_energy', label: 'Not feel tired all the time' },
      { value: 'clothes_fit', label: 'Fit into my clothes better' },
      { value: 'health_scare', label: 'Doctor told me I need to change' },
      { value: 'keep_up_kids', label: 'Keep up with my kids' },
      { value: 'feel_confident', label: 'Feel more confident' },
      { value: 'less_bloated', label: 'Stop feeling bloated/gross' },
      { value: 'role_model', label: 'Be a good example for my family' },
      { value: 'athletic', label: 'Athletic performance' },
      { value: 'eat_more_veggies', label: 'Actually eat some vegetables' },
      { value: 'just_healthier', label: 'Just want to be healthier' },
    ]
  },

  // Kitchen reality
  {
    id: 'kitchen_reality',
    question: 'Your kitchen skills - where are you really?',
    type: 'single_choice',
    category: 'skills',
    required: true,
    options: [
      { value: 'microwave_master', label: 'Microwave is my best friend' },
      { value: 'basic', label: 'I can make eggs and pasta' },
      { value: 'follow_recipe', label: 'I can follow a recipe' },
      { value: 'confident', label: 'Pretty confident cook' },
      { value: 'chef', label: 'I actually love cooking' },
      { value: 'no_kitchen', label: "Don't even have a real kitchen" },
    ]
  },

  // Conditional: Interest in learning to cook (shows if kitchen_skills is microwave_master, basic, or no_kitchen)
  {
    id: 'cooking_interest',
    question: 'How do you feel about learning to cook?',
    type: 'single_choice',
    category: 'skills',
    required: false,
    condition: (responses) => {
      const skills = responses.find(r => r.questionId === 'kitchen_reality')?.value;
      return skills === 'microwave_master' || skills === 'basic' || skills === 'no_kitchen';
    },
    helpText: "This helps us know whether to suggest cooking tips",
    options: [
      { value: 'no_interest', label: "Not interested - just give me easy solutions" },
      { value: 'no_time', label: "Maybe someday, but not right now" },
      { value: 'curious', label: "Curious but need super simple starts" },
      { value: 'want_to_learn', label: "Yes! Teach me easy things" },
    ]
  },

  // Time reality
  {
    id: 'meal_time_truth',
    question: 'When you say you\'ll "meal prep on Sunday," what actually happens?',
    type: 'single_choice',
    category: 'lifestyle',
    required: false,
    options: [
      { value: 'actually_do', label: 'I actually do it!' },
      { value: 'sometimes', label: '50/50 chance it happens' },
      { value: 'good_intentions', label: 'Good intentions, rarely happens' },
      { value: 'never', label: 'LOL never gonna happen' },
      { value: 'what_sunday', label: "Sunday? That's my only free day!" },
    ]
  },

  // Eating style
  {
    id: 'eating_personality',
    question: 'Your eating personality is...',
    type: 'multiple_choice',
    category: 'personality',
    required: false,
    helpText: 'Check all that sound like you',
    options: [
      { value: 'grazer', label: 'Grazer - always snacking' },
      { value: 'meal_skipper', label: 'Meal skipper - forget to eat then starving' },
      { value: 'stress_eater', label: 'Stress eater - emotions = food' },
      { value: 'bored_eater', label: 'Bored eater - eat when nothing to do' },
      { value: 'social_eater', label: 'Social eater - food = socializing' },
      { value: 'night_owl', label: 'Night owl - late night munchies' },
      { value: 'speed_eater', label: 'Speed eater - inhale food' },
      { value: 'picky', label: 'Picky - specific textures/foods only' },
    ]
  },

  // Budget reality
  {
    id: 'money_truth',
    question: 'The money situation:',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { value: 'tight', label: 'Every penny counts' },
      { value: 'careful', label: 'Need to watch it' },
      { value: 'flexible', label: 'Some wiggle room' },
      { value: 'comfortable', label: 'Can spend on healthy stuff' },
      { value: 'no_limit', label: 'Money not an issue' },
    ]
  },

  // What they're willing to try
  {
    id: 'experiment_style',
    question: 'When it comes to trying new things with food:',
    type: 'single_choice',
    category: 'personality',
    required: true,
    options: [
      { value: 'tiny_steps', label: 'Baby steps only - tiny changes' },
      { value: 'one_thing', label: 'One new thing at a time' },
      { value: 'moderate', label: "I'll try reasonable stuff" },
      { value: 'adventurous', label: "Pretty adventurous" },
      { value: 'all_in', label: 'Go big or go home!' },
    ]
  },

  // Support system
  {
    id: 'home_situation',
    question: "Who else are you feeding/dealing with?",
    type: 'multiple_choice',
    category: 'lifestyle',
    required: false,
    helpText: "This affects what tips will actually work for you",
    options: [
      { value: 'just_me', label: 'Just me' },
      { value: 'supportive_partner', label: 'Partner who\s on board' },
      { value: 'resistant_partner', label: 'Partner who eats like a teenager' },
      { value: 'picky_kids', label: 'Picky kids' },
      { value: 'teenagers', label: 'Hungry teenagers' },
      { value: 'roommates', label: 'Roommates' },
      { value: 'parents', label: 'Living with parents' },
    ]
  },

  // Biggest challenge
  {
    id: 'biggest_obstacle',
    question: "What's your biggest obstacle to eating better?",
    type: 'single_choice',
    category: 'challenges',
    required: true,
    helpText: "We'll focus on tips that help with this",
    options: [
      { value: 'no_time', label: 'Literally no time' },
      { value: 'no_energy', label: 'Too exhausted to care' },
      { value: 'no_knowledge', label: "Don't know what to do" },
      { value: 'no_willpower', label: 'Willpower of a goldfish' },
      { value: 'social_pressure', label: 'Social situations/peer pressure' },
      { value: 'emotional', label: 'Emotional/stress eating' },
      { value: 'hate_cooking', label: 'Hate cooking' },
      { value: 'love_junk', label: 'Just love junk food too much' },
    ]
  },

  // Check-in preference (make it casual)
  {
    id: 'reminder_style',
    question: 'Want me to check in on how experiments went?',
    type: 'single_choice',
    category: 'preferences',
    required: true,
    options: [
      { value: 'morning', label: 'Morning - start fresh' },
      { value: 'lunch', label: 'Lunchtime check-in' },
      { value: 'evening_early', label: 'Early evening (6-7pm)' },
      { value: 'evening_late', label: 'Later evening (8-9pm)' },
      { value: 'no_thanks', label: "Nah, I'll check in when I want" },
    ]
  }
];

export function getQuestionById(id: string): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find(q => q.id === id);
}

export function getQuestionsByCategory(category: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => q.category === category);
}

export function getConditionalQuestions(responses: Array<{questionId: string, values?: string[], value?: any}>): QuizQuestion[] {
  // Filter questions based on conditional logic
  return QUIZ_QUESTIONS.filter(question => {
    if (!question.conditionalOn) return true;
    
    const response = responses.find(r => r.questionId === question.conditionalOn!.questionId);
    if (!response) return false;
    
    // Handle both .values and .value for backward compatibility
    const responseValues = response.values || (Array.isArray(response.value) ? response.value : [response.value]);
    return question.conditionalOn.values.some(v => responseValues.includes(v));
  });
}