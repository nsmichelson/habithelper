import { QuizQuestion } from '../types/quiz';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Medical Conditions
  {
    id: 'medical_conditions',
    question: 'Do you have any of these medical conditions?',
    type: 'multiple_choice',
    category: 'medical',
    required: true,
    helpText: 'Select all that apply. This helps us ensure tips are safe for you.',
    options: [
      { value: 'none', label: 'None of these' },
      { value: 'pregnancy', label: 'Pregnant' },
      { value: 'breastfeeding', label: 'Breastfeeding' },
      { value: 't1_diabetes', label: 'Type 1 Diabetes' },
      { value: 't2_diabetes', label: 'Type 2 Diabetes' },
      { value: 'hypertension', label: 'High Blood Pressure' },
      { value: 'celiac', label: 'Celiac Disease' },
      { value: 'lactose_intolerance', label: 'Lactose Intolerant' },
      { value: 'ibs', label: 'IBS' },
    ]
  },
  
  // Allergies
  {
    id: 'food_allergies',
    question: 'Do you have any food allergies?',
    type: 'multiple_choice',
    category: 'medical',
    required: true,
    options: [
      { value: 'none', label: 'No allergies' },
      { value: 'nut_allergy', label: 'Nuts' },
      { value: 'shellfish_allergy', label: 'Shellfish' },
      { value: 'egg_allergy', label: 'Eggs' },
      { value: 'fish_allergy', label: 'Fish' },
      { value: 'soy_allergy', label: 'Soy' },
    ]
  },

  // Goals
  {
    id: 'primary_goals',
    question: 'What are your main health and nutrition goals?',
    type: 'multiple_choice',
    category: 'goals',
    required: true,
    helpText: 'Select up to 3 that matter most to you',
    options: [
      { value: 'weight_loss', label: 'Lose weight' },
      { value: 'muscle_gain', label: 'Build muscle' },
      { value: 'reduce_sugar', label: 'Reduce sugar intake' },
      { value: 'improve_energy', label: 'Have more energy' },
      { value: 'better_lipids', label: 'Improve cholesterol' },
      { value: 'improve_gut_health', label: 'Better digestion' },
      { value: 'increase_veggies', label: 'Eat more vegetables' },
      { value: 'improve_hydration', label: 'Drink more water' },
    ]
  },

  // Lifestyle - Time for cooking
  {
    id: 'cooking_time',
    question: 'How much time do you typically have for meal preparation?',
    type: 'single_choice',
    category: 'lifestyle',
    required: true,
    options: [
      { value: 'none', label: 'No time - I need grab-and-go options' },
      { value: 'minimal', label: '5-15 minutes per meal' },
      { value: 'moderate', label: '15-30 minutes per meal' },
      { value: 'plenty', label: '30+ minutes - I enjoy cooking' },
    ]
  },

  // Lifestyle - Where meals are eaten
  {
    id: 'meal_locations',
    question: 'Where do you typically eat your meals?',
    type: 'multiple_choice',
    category: 'lifestyle',
    required: false,
    options: [
      { value: 'home', label: 'At home' },
      { value: 'desk', label: 'At my desk' },
      { value: 'car', label: 'In my car' },
      { value: 'restaurants', label: 'Restaurants/takeout' },
      { value: 'social', label: 'Social gatherings' },
    ]
  },

  // Budget consciousness
  {
    id: 'budget_conscious',
    question: 'How important is budget when making food choices?',
    type: 'scale',
    category: 'lifestyle',
    required: true,
    helpText: '1 = Not important, 5 = Very important',
    min: 1,
    max: 5,
  },

  // Food preferences
  {
    id: 'food_preferences',
    question: 'Which best describes your eating style?',
    type: 'multiple_choice',
    category: 'preferences',
    required: false,
    options: [
      { value: 'sweet_tooth', label: 'I have a sweet tooth' },
      { value: 'savory', label: 'I prefer savory foods' },
      { value: 'variety', label: 'I need variety in my meals' },
      { value: 'routine', label: 'I like eating the same things' },
      { value: 'plant_based', label: 'I prefer plant-based foods' },
    ]
  },

  // Learning preferences
  {
    id: 'learning_interests',
    question: 'What would you like to learn about?',
    type: 'multiple_choice',
    category: 'learning',
    required: false,
    options: [
      { value: 'cooking_skills', label: 'How to cook healthy meals' },
      { value: 'nutrition_facts', label: 'Nutrition science and facts' },
      { value: 'meal_planning', label: 'Meal planning strategies' },
      { value: 'quick_tips', label: 'Just quick tips, no theory' },
    ]
  },

  // Starting difficulty
  {
    id: 'starting_difficulty',
    question: 'How challenging would you like your first experiments to be?',
    type: 'single_choice',
    category: 'preferences',
    required: true,
    helpText: "We'll adjust as we learn what works for you",
    options: [
      { value: 'easy', label: 'Start with tiny, easy changes' },
      { value: 'moderate', label: 'Some challenge is fine' },
      { value: 'ambitious', label: "I'm ready for bigger changes" },
    ]
  },

  // Notification preferences
  {
    id: 'reminder_time',
    question: 'When would you like your evening check-in reminder?',
    type: 'single_choice',
    category: 'preferences',
    required: true,
    options: [
      { value: '18:00', label: '6:00 PM' },
      { value: '19:00', label: '7:00 PM' },
      { value: '20:00', label: '8:00 PM' },
      { value: '21:00', label: '9:00 PM' },
      { value: 'none', label: "I'll check in on my own" },
    ]
  }
];

export function getQuestionById(id: string): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find(q => q.id === id);
}

export function getQuestionsByCategory(category: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => q.category === category);
}

export function getConditionalQuestions(responses: Array<{questionId: string, value: any}>): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(question => {
    if (!question.conditionalOn) return true;
    
    const response = responses.find(r => r.questionId === question.conditionalOn!.questionId);
    if (!response) return false;
    
    const responseValues = Array.isArray(response.value) ? response.value : [response.value];
    return question.conditionalOn.values.some(v => responseValues.includes(v));
  });
}