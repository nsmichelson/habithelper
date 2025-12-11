import { Ionicons } from '@expo/vector-icons';

// Types
export type MotivationCardType = 'tip' | 'encouragement' | 'reframe' | 'strategy' | 'fact' | 'quiz';

export type TriggerCondition = {
  feelings?: string[];
  obstacles?: string[];
  helpers?: string[];
  areas?: string[];  // If specified, card only shows for these areas. Empty/undefined = all areas
  excludeAreas?: string[]; // Areas where this card should NOT show
};

export type ModalContent = {
  title: string;
  description?: string;
  mainText?: string;
  question?: string;
  options?: Array<{ id: string; text: string; correct: boolean }>;
  answerExplanation?: string;
  buttonText?: string;
};

export type MotivationCardDefinition = {
  id: string;
  type: MotivationCardType;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  text: string;
  priority: number;
  triggers: TriggerCondition;
  modalContent?: ModalContent;
};

export type MotivationCard = Omit<MotivationCardDefinition, 'triggers'>;

// All motivation card definitions
export const MOTIVATION_CARDS: MotivationCardDefinition[] = [
  // ============================================
  // FEELING-BASED CARDS (All Areas)
  // ============================================
  {
    id: 'tired-gentle',
    type: 'encouragement',
    icon: 'heart-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Be Gentle',
    text: "Tired days are real. Even a tiny step counts - you don't have to be perfect today.",
    priority: 10,
    triggers: { feelings: ['tired'] },
    modalContent: {
      title: "Be Gentle With Yourself",
      description: "Pushing through exhaustion often leads to burnout, not progress.",
      mainText: "Today, success might just mean 'doing the bare minimum' and that is completely okay. Consistency matters more than intensity.",
      buttonText: "I accept this"
    }
  },
  {
    id: 'tired-energy',
    type: 'tip',
    icon: 'flash-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Quick Energy',
    text: 'A 5-min walk or glass of cold water can boost alertness more than you think.',
    priority: 8,
    triggers: { feelings: ['tired'] },
  },
  {
    id: 'stressed-breathe',
    type: 'strategy',
    icon: 'leaf-outline',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    title: 'Pause First',
    text: 'Try 3 deep breaths before deciding anything. Stress makes everything feel harder than it is.',
    priority: 10,
    triggers: { feelings: ['stressed'] },
    modalContent: {
      title: "The 4-7-8 Breath",
      description: "A quick reset for your nervous system.",
      mainText: "1. Inhale through nose for 4 seconds.\n2. Hold for 7 seconds.\n3. Exhale through mouth for 8 seconds.\n\nRepeat 3 times to lower cortisol levels instantly.",
      buttonText: "Feeling better"
    }
  },
  {
    id: 'good-momentum',
    type: 'encouragement',
    icon: 'rocket-outline',
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
    title: 'Ride the Wave',
    text: "You're in a good headspace - perfect time to build momentum!",
    priority: 7,
    triggers: { feelings: ['great', 'good'] },
  },

  // ============================================
  // NUTRITION-SPECIFIC: OBSTACLE TRIGGERS
  // ============================================
  {
    id: 'boredom-quiz',
    type: 'quiz',
    icon: 'game-controller-outline',
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
    title: 'Hungry vs Bored',
    text: "Not sure if you need food? Take the 10-second test.",
    priority: 10,
    triggers: { obstacles: ['boredom'], areas: ['nutrition'] },
    modalContent: {
      title: "The Apple Test",
      question: "If I offered you a plain apple right now, would you eat it?",
      options: [
        { id: 'yes', text: "Yes, I'd eat it", correct: true },
        { id: 'no', text: "No, I want chips/chocolate", correct: false }
      ],
      answerExplanation: "If you'd eat an apple, you're likely physically hungry. If only specific treats sound good, it's probably boredom or a craving!",
      buttonText: "Got it"
    }
  },
  {
    id: 'thirst-fact',
    type: 'fact',
    icon: 'water-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Brain Signals',
    text: "Your brain often mixes up thirst and hunger signals.",
    priority: 9,
    triggers: { obstacles: ['thirsty'], areas: ['nutrition'] },
    modalContent: {
      title: "Mixed Signals",
      description: "37% of people mistake thirst for hunger because the signals come from the same part of the brain (the hypothalamus).",
      mainText: "Try drinking a glass of water and waiting 15 minutes before eating. You might find the 'hunger' disappears!",
      buttonText: "I'll drink water"
    }
  },
  {
    id: 'social-strategy-bookend',
    type: 'strategy',
    icon: 'people-outline',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'The Bookend Strategy',
    text: "How to enjoy the party without derailing your progress.",
    priority: 9,
    triggers: { obstacles: ['social_eating', 'celebration'], areas: ['nutrition'] },
    modalContent: {
      title: "Bookend Your Event",
      description: "Don't go in starving! Eat a healthy snack before you go, and plan a healthy meal for the next day.",
      mainText: "When you arrive not ravenous, you can make choices based on what you *really* want to taste, rather than what your blood sugar is screaming for.",
      buttonText: "Good plan"
    }
  },
  {
    id: 'travel-survival',
    type: 'strategy',
    icon: 'map-outline',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    title: 'Travel Survival',
    text: "Stuck with gas station food? Here's the best of the worst.",
    priority: 8,
    triggers: { obstacles: ['traveling', 'no_healthy_options'], areas: ['nutrition'] },
    modalContent: {
      title: "The Best of the Worst",
      description: "If you have limited options, look for:",
      mainText: "• Jerky or boiled eggs (Protein)\n• Nuts or seeds (Healthy Fats)\n• Whole fruit (Fiber)\n\nAvoid the sugary drinks—they cause the energy crash that makes travel harder.",
      buttonText: "Noted"
    }
  },
  {
    id: 'cravings-delay',
    type: 'strategy',
    icon: 'timer-outline',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
    title: '10-Min Rule',
    text: "Cravings peak then fade. Wait 10 mins, drink water, then decide.",
    priority: 9,
    triggers: { obstacles: ['cravings'], areas: ['nutrition'] },
    modalContent: {
      title: "Surfing the Urge",
      description: "Cravings are like waves—they build, peak, and crash. They usually only last 3-5 minutes if you don't feed them.",
      mainText: "Set a timer for 10 minutes. If you still truly want it after the timer goes off, have a small amount mindfully.",
      buttonText: "Setting timer"
    }
  },
  {
    id: 'emotional-halt',
    type: 'strategy',
    icon: 'heart-dislike-outline',
    iconBg: '#fee2e2',
    iconColor: '#ef4444',
    title: 'Check H.A.L.T.',
    text: "Emotional hunger comes on suddenly. Physical hunger comes on gradually.",
    priority: 10,
    triggers: { obstacles: ['emotional'], areas: ['nutrition'] },
    modalContent: {
      title: "The H.A.L.T. Check",
      description: "Before you eat, ask yourself: Am I...",
      mainText: "• Hungry?\n• Angry?\n• Lonely?\n• Tired?\n\nIf it's not Hunger, food won't fix it. Try a 'comfort menu' item instead: call a friend, take a nap, or go for a walk.",
      buttonText: "Good check"
    }
  },

  // ============================================
  // NUTRITION-SPECIFIC: HELPER TRIGGERS
  // ============================================
  {
    id: 'environment-design',
    type: 'fact',
    icon: 'leaf-outline',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Visual Cues',
    text: "You are 3x more likely to eat the first food you see in the kitchen.",
    priority: 8,
    triggers: { helpers: ['healthy_food'], areas: ['nutrition'] },
    modalContent: {
      title: "The Fruit Bowl Effect",
      description: "Google found that simply moving fruit baskets to the front of the cafeteria increased consumption by 50%.",
      mainText: "By keeping healthy food visible and ready, you're hacking your own psychology. Well done!",
      buttonText: "Science!"
    }
  },
  {
    id: 'body-wisdom',
    type: 'encouragement',
    icon: 'thumbs-up-outline',
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5',
    title: 'Trusting Your Gut',
    text: "Listening to your body's 'enough' signal is a superpower.",
    priority: 8,
    triggers: { helpers: ['not_hungry'], areas: ['nutrition'] },
    modalContent: {
      title: "The Hunger Scale",
      description: "Many of us eat by the clock, not by our bodies.",
      mainText: "Recognizing you aren't hungry and choosing not to eat is a huge win for intuitive eating. You're building a healthy relationship with food.",
      buttonText: "Feeling good"
    }
  },
  {
    id: 'home-salt',
    type: 'fact',
    icon: 'home-outline',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    title: 'The Salt Secret',
    text: "Restaurant meals often contain 2-3x the sodium of home-cooked food.",
    priority: 7,
    triggers: { helpers: ['home'], areas: ['nutrition'] },
    modalContent: {
      title: "Hidden Sodium",
      description: "Restaurants use salt to boost flavor quickly.",
      mainText: "By eating at home today, you've automatically saved your heart and kidneys from a massive sodium spike. Your body thanks you!",
      buttonText: "Tasty & Healthy"
    }
  },
  {
    id: 'hydrated-boost',
    type: 'fact',
    icon: 'water-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Metabolism Boost',
    text: "Water does more than just quench thirst.",
    priority: 8,
    triggers: { helpers: ['hydrated'], areas: ['nutrition'] },
    modalContent: {
      title: "Liquid Energy",
      description: "Drinking 500ml of water can temporarily boost your metabolism by 24-30%.",
      mainText: "You're not just hydrating, you're revving up your body's engine. Keep it up!",
      buttonText: "Awesome"
    }
  },
  {
    id: 'leftover-gift',
    type: 'encouragement',
    icon: 'gift-outline',
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
    title: 'Gift to Future You',
    text: "Cooking once and eating twice is the ultimate consistency hack.",
    priority: 9,
    triggers: { helpers: ['leftovers', 'meal_prepped'], areas: ['nutrition'] },
    modalContent: {
      title: "Smart Move",
      description: "By preparing food ahead of time, you removed the friction of decision-making.",
      mainText: "Willpower is a finite resource. You saved yours for something else today. That's how habits stick!",
      buttonText: "Go me!"
    }
  },
  {
    id: 'rhythm-flow',
    type: 'encouragement',
    icon: 'infinite-outline',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    title: 'In the Flow',
    text: "Consistency feels easier when you find your rhythm.",
    priority: 7,
    triggers: { helpers: ['rhythm'], areas: ['nutrition'] },
  },

  // ============================================
  // GENERIC FALLBACK CARDS (Any Area)
  // ============================================
  {
    id: 'stress-eating-reframe',
    type: 'reframe',
    icon: 'bulb-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Stress Eating?',
    text: "It's your brain seeking comfort, not hunger. What else might help? A walk, music, or texting a friend?",
    priority: 9,
    triggers: { obstacles: ['stress_eating'] },
  },
  {
    id: 'busy-micro',
    type: 'tip',
    icon: 'time-outline',
    iconBg: '#ccfbf1',
    iconColor: '#0d9488',
    title: 'Micro-Moments',
    text: "Busy day? Look for 2-minute windows. Small actions add up more than you'd think.",
    priority: 8,
    triggers: { obstacles: ['busy'] },
  },
  {
    id: 'tired-easy-win',
    type: 'strategy',
    icon: 'checkmark-circle-outline',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    title: 'Easy Win',
    text: "Lower the bar today. What's the easiest version of this you could do?",
    priority: 8,
    triggers: { obstacles: ['tired', 'no_healthy_options'] },
  },
  {
    id: 'motivated-action',
    type: 'tip',
    icon: 'flash-outline',
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
    title: 'Strike Now',
    text: "Motivation fades - action creates more motivation. Start within the next 5 mins!",
    priority: 8,
    triggers: { helpers: ['motivated'] },
  },
  {
    id: 'support-share',
    type: 'tip',
    icon: 'chatbubble-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Share Your Goal',
    text: "Tell someone what you're trying today. Saying it out loud makes it more real.",
    priority: 6,
    triggers: { helpers: ['support'] },
  },
];

// Helper to determine if a card matches the current selections
function cardMatchesSelections(
  card: MotivationCardDefinition,
  selectedFeelings: string[],
  selectedObstacles: string[],
  selectedHelpers: string[],
  area: string
): boolean {
  const { triggers } = card;

  // Check area restrictions
  if (triggers.areas && triggers.areas.length > 0) {
    if (!triggers.areas.includes(area)) {
      return false;
    }
  }

  if (triggers.excludeAreas && triggers.excludeAreas.includes(area)) {
    return false;
  }

  // Check if any trigger condition is met
  let hasMatch = false;

  if (triggers.feelings && triggers.feelings.length > 0) {
    if (triggers.feelings.some(f => selectedFeelings.includes(f))) {
      hasMatch = true;
    }
  }

  if (triggers.obstacles && triggers.obstacles.length > 0) {
    if (triggers.obstacles.some(o => selectedObstacles.includes(o))) {
      hasMatch = true;
    }
  }

  if (triggers.helpers && triggers.helpers.length > 0) {
    if (triggers.helpers.some(h => selectedHelpers.includes(h))) {
      hasMatch = true;
    }
  }

  return hasMatch;
}

// Normalize area name (handle 'exercise' -> 'fitness' mapping)
function normalizeArea(area: string): string {
  if (area === 'exercise') return 'fitness';
  return area;
}

// Check if area should use nutrition cards as fallback
function isNutritionFallback(area: string): boolean {
  const knownAreas = ['fitness', 'sleep', 'stress', 'organization', 'relationships', 'mindset', 'productivity'];
  return !knownAreas.includes(area);
}

/**
 * Get matching motivation cards based on user's check-in selections
 *
 * @param selectedFeelings - Array of selected feeling IDs (e.g., ['tired', 'stressed'])
 * @param selectedObstacles - Array of selected obstacle IDs (e.g., ['boredom', 'cravings'])
 * @param selectedHelpers - Array of selected helper IDs (e.g., ['healthy_food', 'hydrated'])
 * @param area - The current tip/experiment area (e.g., 'nutrition', 'fitness')
 * @param maxCards - Maximum number of cards to return (default: 3)
 * @returns Array of matching MotivationCard objects, sorted by priority
 */
export function getMotivationCards(
  selectedFeelings: string[],
  selectedObstacles: string[],
  selectedHelpers: string[],
  area: string,
  maxCards: number = 3
): MotivationCard[] {
  const normalizedArea = normalizeArea(area);

  // For unknown areas, treat as nutrition for card matching
  const effectiveArea = isNutritionFallback(normalizedArea) ? 'nutrition' : normalizedArea;

  const matchingCards = MOTIVATION_CARDS
    .filter(card => cardMatchesSelections(
      card,
      selectedFeelings,
      selectedObstacles,
      selectedHelpers,
      effectiveArea
    ))
    .map(({ triggers, ...cardWithoutTriggers }) => cardWithoutTriggers) // Remove triggers from output
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxCards);

  return matchingCards;
}

// Export the type for use in components
export type { MotivationCard as MotivationCardOutput };
