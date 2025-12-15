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
  // NEW PERSONALIZED NUTRITION CARDS
  // ============================================

  // Sugar cravings (from love_sweets barrier)
  {
    id: 'sugar-cravings-strategy',
    type: 'strategy',
    icon: 'ice-cream-outline',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
    title: 'Sweet Tooth Hack',
    text: "Sugar cravings usually pass in 15-20 minutes. Can you wait it out?",
    priority: 10,
    triggers: { obstacles: ['sugar_cravings'], areas: ['nutrition'] },
    modalContent: {
      title: "Outsmart the Sweet Tooth",
      description: "Sugar cravings are intense but short-lived.",
      mainText: "Try this: Have a piece of fruit, brush your teeth, or drink flavored sparkling water. Often the craving passes before you finish!\n\nIf you still want something sweet after 20 mins, have a small portion mindfully.",
      buttonText: "I'll try it"
    }
  },

  // Late night cravings (time-gated, from night_snacking barrier)
  {
    id: 'late-night-strategy',
    type: 'strategy',
    icon: 'moon-outline',
    iconBg: '#312e81',
    iconColor: '#c7d2fe',
    title: 'Night Owl Snacking',
    text: "Late night hunger often isn't real hunger - it's habit or tiredness.",
    priority: 10,
    triggers: { obstacles: ['late_night_cravings'], areas: ['nutrition'] },
    modalContent: {
      title: "Breaking the Night Snack Cycle",
      description: "Your body confuses tiredness with hunger at night.",
      mainText: "Ask yourself: Am I actually hungry, or am I tired/bored/procrastinating sleep?\n\nTry: Herbal tea, brushing your teeth, or going to bed 30 mins earlier. Often sleep is what you really need.",
      buttonText: "Going to bed"
    }
  },

  // Afternoon slump (time-gated)
  {
    id: 'afternoon-slump-tip',
    type: 'tip',
    icon: 'sunny-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Afternoon Slump',
    text: "That 3pm energy crash? It's often dehydration or blood sugar, not real hunger.",
    priority: 9,
    triggers: { obstacles: ['afternoon_slump'], areas: ['nutrition'] },
    modalContent: {
      title: "Beat the 3pm Crash",
      description: "The afternoon slump is predictable - and preventable.",
      mainText: "Try these in order:\n1. Drink a full glass of water\n2. Take a 5-minute walk\n3. Have a protein-rich snack (not sugar!)\n\nSugar gives a quick boost but crashes you harder in 30 mins.",
      buttonText: "Got it"
    }
  },

  // Budget constraints
  {
    id: 'budget-tip',
    type: 'tip',
    icon: 'wallet-outline',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Budget-Friendly Win',
    text: "Healthy eating doesn't have to be expensive. Frozen veggies are just as nutritious!",
    priority: 7,
    triggers: { obstacles: ['budget'], areas: ['nutrition'] },
    modalContent: {
      title: "Eat Well on a Budget",
      description: "Some of the healthiest foods are also the cheapest.",
      mainText: "Budget superstars:\n• Frozen vegetables (same nutrition as fresh!)\n• Eggs (protein powerhouse)\n• Beans & lentils\n• Oats\n• Bananas & apples\n\nBatch cooking saves money AND time.",
      buttonText: "Good to know"
    }
  },

  // Family wants different food
  {
    id: 'family-food-strategy',
    type: 'strategy',
    icon: 'home-outline',
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5',
    title: 'Family Meal Hack',
    text: "Cook one base meal, customize toppings. Everyone wins!",
    priority: 8,
    triggers: { obstacles: ['family_food'], areas: ['nutrition'] },
    modalContent: {
      title: "One Meal, Many Versions",
      description: "You don't have to cook separate meals.",
      mainText: "The 'build your own' approach:\n• Taco night: same protein, everyone picks toppings\n• Pasta: you have veggies, kids have plain\n• Buddha bowls: same base, different additions\n\nYou eat healthy without being a short-order cook.",
      buttonText: "Smart!"
    }
  },

  // Don't feel like cooking
  {
    id: 'no-cook-tip',
    type: 'tip',
    icon: 'restaurant-outline',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    title: 'No-Cook Night',
    text: "Not every healthy meal needs cooking. Sandwiches, salads, and wraps count!",
    priority: 8,
    triggers: { obstacles: ['dont_want_cook'], areas: ['nutrition'] },
    modalContent: {
      title: "Healthy Without the Stove",
      description: "Cooking fatigue is real. These require zero cooking:",
      mainText: "• Deli turkey + cheese + veggies in a wrap\n• Greek yogurt + fruit + nuts\n• Hummus + veggies + pita\n• Rotisserie chicken + bagged salad\n• Overnight oats (prep night before)\n\nHealthy ≠ complicated.",
      buttonText: "Easy wins"
    }
  },

  // Willpower low
  {
    id: 'willpower-reframe',
    type: 'reframe',
    icon: 'battery-dead-outline',
    iconBg: '#fee2e2',
    iconColor: '#ef4444',
    title: 'Willpower Reality',
    text: "Willpower is a muscle that gets tired. That's normal, not a character flaw.",
    priority: 9,
    triggers: { obstacles: ['willpower_low'], areas: ['nutrition'] },
    modalContent: {
      title: "It's Not About Willpower",
      description: "Willpower depletes throughout the day - that's science, not weakness.",
      mainText: "When willpower is low, rely on environment instead:\n• Remove temptations from sight\n• Pre-portion snacks\n• Have healthy options front and center\n\nSmart setup beats strong willpower every time.",
      buttonText: "Makes sense"
    }
  },

  // Urge to binge/overeat
  {
    id: 'binge-urge-strategy',
    type: 'strategy',
    icon: 'warning-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Pause Button',
    text: "Feeling the urge to overeat? Let's slow this down together.",
    priority: 10,
    triggers: { obstacles: ['urge_to_binge'], areas: ['nutrition'] },
    modalContent: {
      title: "The 5-Minute Pause",
      description: "Binge urges feel urgent but usually pass.",
      mainText: "Try this:\n1. Set a 5-minute timer\n2. Leave the kitchen/food area\n3. Do something with your hands (text someone, stretch, etc.)\n4. After 5 mins, check in: Still want it?\n\nIf yes, have a portion mindfully. No guilt.",
      buttonText: "I'll pause"
    }
  },

  // Mindless eating
  {
    id: 'mindless-eating-tip',
    type: 'tip',
    icon: 'phone-portrait-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Mindful Moment',
    text: "Eating while distracted? You'll eat 25% more without realizing.",
    priority: 8,
    triggers: { obstacles: ['mindless_eating'], areas: ['nutrition'] },
    modalContent: {
      title: "One Meal, Full Attention",
      description: "Screens while eating = eating more without satisfaction.",
      mainText: "Just for this meal:\n• Put the phone face-down\n• Sit at a table (not the couch)\n• Take 3 breaths before eating\n• Notice the first 3 bites\n\nYou'll feel more satisfied with less food.",
      buttonText: "I'll try it"
    }
  },

  // Simple swaps helper
  {
    id: 'simple-swaps-encouragement',
    type: 'encouragement',
    icon: 'swap-horizontal-outline',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Swap Champion',
    text: "Small swaps add up. You're playing the long game - and winning.",
    priority: 8,
    triggers: { helpers: ['simple_swaps'], areas: ['nutrition'] },
  },

  // Flexible mindset helper
  {
    id: 'flexible-mindset-encouragement',
    type: 'encouragement',
    icon: 'infinite-outline',
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
    title: 'Flexible Wins',
    text: "No all-or-nothing thinking today. That's exactly the mindset that sticks!",
    priority: 8,
    triggers: { helpers: ['flexible_mindset'], areas: ['nutrition'] },
    modalContent: {
      title: "The 80/20 Mindset",
      description: "Perfectionism kills progress. Flexibility builds habits.",
      mainText: "Eating well 80% of the time is sustainable.\nEating 'perfectly' 100% of the time leads to burnout and binges.\n\nYou're doing this the smart way.",
      buttonText: "Balance FTW"
    }
  },

  // Family on board helper
  {
    id: 'family-support-encouragement',
    type: 'encouragement',
    icon: 'people-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Team Effort',
    text: "Having family support makes healthy eating so much easier. That's a win!",
    priority: 8,
    triggers: { helpers: ['family_support'], areas: ['nutrition'] },
  },

  // Listening to body helper
  {
    id: 'body-signals-encouragement',
    type: 'encouragement',
    icon: 'body-outline',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    title: 'Body Wisdom',
    text: "You're tuning into your body's signals. That's intuitive eating in action!",
    priority: 8,
    triggers: { helpers: ['listening_to_body'], areas: ['nutrition'] },
  },

  // Seeing progress helper
  {
    id: 'progress-momentum',
    type: 'encouragement',
    icon: 'trending-up-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Momentum Building',
    text: "Noticing progress - even small wins - keeps you motivated. Keep looking for them!",
    priority: 8,
    triggers: { helpers: ['seeing_progress'], areas: ['nutrition'] },
  },

  // Morning fresh helper
  {
    id: 'morning-fresh-tip',
    type: 'tip',
    icon: 'sunny-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Fresh Start Energy',
    text: "Morning motivation is real! Make your healthy choice before it fades.",
    priority: 7,
    triggers: { helpers: ['morning_fresh'], areas: ['nutrition'] },
  },

  // Good energy helper
  {
    id: 'good-energy-tip',
    type: 'tip',
    icon: 'battery-full-outline',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Ride the Energy',
    text: "Good energy = easier decisions. This is the perfect time to prep something healthy!",
    priority: 7,
    triggers: { helpers: ['good_energy'], areas: ['nutrition'] },
  },

  // ============================================
  // CONDITION-BASED CARDS: PREGNANCY
  // ============================================
  {
    id: 'pregnancy-cravings',
    type: 'encouragement',
    icon: 'heart-outline',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
    title: 'Pregnancy Cravings',
    text: "Pregnancy cravings are hormonal and intense - be gentle with yourself.",
    priority: 10,
    triggers: { obstacles: ['pregnancy_cravings'], areas: ['nutrition'] },
    modalContent: {
      title: "Cravings Are Normal",
      description: "Hormonal changes during pregnancy can create intense, specific cravings.",
      mainText: "Tips for managing:\n• Honor small portions of what you crave\n• Balance it with something nutritious\n• Stay hydrated - thirst mimics cravings\n• Don't feel guilty - your body is doing amazing work",
      buttonText: "I've got this"
    }
  },
  {
    id: 'food-aversions',
    type: 'strategy',
    icon: 'close-circle-outline',
    iconBg: '#fee2e2',
    iconColor: '#ef4444',
    title: 'Food Aversions',
    text: "When foods you normally love suddenly repulse you, work around it.",
    priority: 10,
    triggers: { obstacles: ['food_aversions'], areas: ['nutrition'] },
    modalContent: {
      title: "Working With Aversions",
      description: "Food aversions are your body's way of protecting you - don't fight them.",
      mainText: "Strategies:\n• Focus on foods that don't trigger aversion\n• Eat cold foods (less smell)\n• Try bland, simple foods\n• Get nutrients from different sources\n• This usually improves after first trimester",
      buttonText: "Good ideas"
    }
  },
  {
    id: 'morning-sickness',
    type: 'tip',
    icon: 'medical-outline',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Nausea Help',
    text: "Small, frequent meals can help keep nausea at bay.",
    priority: 10,
    triggers: { obstacles: ['nausea'], areas: ['nutrition'] },
    modalContent: {
      title: "Managing Nausea",
      description: "An empty stomach often makes nausea worse.",
      mainText: "What can help:\n• Keep crackers by your bed for morning\n• Eat small amounts every 2-3 hours\n• Ginger (tea, candies, or supplements)\n• Cold foods are often more tolerable\n• Avoid strong smells\n• Stay hydrated with small sips",
      buttonText: "Thanks"
    }
  },
  {
    id: 'pregnancy-reflux',
    type: 'strategy',
    icon: 'flame-outline',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    title: 'Acid Reflux',
    text: "That burning feeling? Smaller meals and staying upright can help.",
    priority: 9,
    triggers: { obstacles: ['acid_reflux'], areas: ['nutrition'] },
    modalContent: {
      title: "Taming the Burn",
      description: "Pregnancy hormones relax the valve between stomach and esophagus.",
      mainText: "Relief strategies:\n• Eat smaller, more frequent meals\n• Avoid lying down after eating\n• Skip spicy, acidic, or fatty foods\n• Elevate your head when sleeping\n• Wear loose-fitting clothes\n• Avoid eating close to bedtime",
      buttonText: "I'll try these"
    }
  },
  {
    id: 'pregnancy-exhaustion',
    type: 'encouragement',
    icon: 'bed-outline',
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5',
    title: 'Growing a Human',
    text: "You're building a whole person. Exhaustion is valid - easy meals are okay.",
    priority: 9,
    triggers: { obstacles: ['pregnancy_exhaustion'], areas: ['nutrition'] },
    modalContent: {
      title: "Rest Is Productive",
      description: "Your body is working overtime even when you're sitting still.",
      mainText: "Give yourself permission to:\n• Rely on simple, easy meals\n• Accept help with cooking\n• Choose convenience over perfection\n• Rest when you need to\n\nNourishing yourself is nourishing baby - however that looks today.",
      buttonText: "Permission granted"
    }
  },

  // ============================================
  // CONDITION-BASED CARDS: DIGESTIVE ISSUES
  // ============================================
  {
    id: 'stomach-upset',
    type: 'strategy',
    icon: 'medical-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Gentle Eating',
    text: "When your stomach is off, stick to gentle foods. This will pass.",
    priority: 10,
    triggers: { obstacles: ['stomach_upset'], areas: ['nutrition'] },
    modalContent: {
      title: "Foods That Soothe",
      description: "Give your digestive system a break with easy-to-digest foods.",
      mainText: "Gentle options:\n• Plain rice or toast\n• Bananas\n• Bone broth or clear soup\n• Ginger tea\n• Plain crackers\n\nAvoid: fatty, spicy, or high-fiber foods until you feel better.",
      buttonText: "Taking it easy"
    }
  },
  {
    id: 'bloating-tip',
    type: 'tip',
    icon: 'water-outline',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    title: 'Beat the Bloat',
    text: "Bloating is uncomfortable. Slow eating and warm drinks can help.",
    priority: 9,
    triggers: { obstacles: ['bloating'], areas: ['nutrition'] },
    modalContent: {
      title: "Reducing Bloat",
      description: "Bloating often comes from how you eat, not just what you eat.",
      mainText: "Try these:\n• Eat slowly, chew thoroughly\n• Avoid carbonated drinks\n• Walk after meals\n• Warm water or peppermint tea\n• Limit salt and gas-producing foods\n• Don't skip meals (causes overeating later)",
      buttonText: "Helpful"
    }
  },
  {
    id: 'food-fear',
    type: 'encouragement',
    icon: 'shield-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Food Anxiety',
    text: "Scared certain foods will upset you? Start small and track what works.",
    priority: 9,
    triggers: { obstacles: ['food_fear'], areas: ['nutrition'] },
    modalContent: {
      title: "Building Food Confidence",
      description: "Fear of triggering symptoms can limit your diet unnecessarily.",
      mainText: "A gentle approach:\n• Keep a simple food diary\n• Introduce one food at a time\n• Notice patterns without judgment\n• Work with a dietitian if needed\n\nMany foods you fear might actually be fine in small amounts.",
      buttonText: "Worth trying"
    }
  },

  // ============================================
  // CONDITION-BASED CARDS: DIABETES/BLOOD SUGAR
  // ============================================
  {
    id: 'blood-sugar-off',
    type: 'strategy',
    icon: 'pulse-outline',
    iconBg: '#fee2e2',
    iconColor: '#ef4444',
    title: 'Blood Sugar Help',
    text: "Feeling off? Pair carbs with protein to stabilize your levels.",
    priority: 10,
    triggers: { obstacles: ['blood_sugar_off'], areas: ['nutrition'] },
    modalContent: {
      title: "Balancing Blood Sugar",
      description: "Pairing foods strategically helps prevent spikes and crashes.",
      mainText: "Quick fixes:\n• Add protein to carbs (cheese with crackers)\n• Choose whole grains over refined\n• Include healthy fats\n• Eat at regular intervals\n• Stay hydrated\n\nNote: If you feel very unwell, check your levels and follow your medical plan.",
      buttonText: "Good reminder"
    }
  },
  {
    id: 'carb-cravings',
    type: 'reframe',
    icon: 'nutrition-outline',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    title: 'Carb Cravings',
    text: "Craving carbs hard? Your body might be telling you something.",
    priority: 9,
    triggers: { obstacles: ['carb_cravings'], areas: ['nutrition'] },
    modalContent: {
      title: "Understanding Carb Cravings",
      description: "Intense carb cravings can signal blood sugar fluctuations.",
      mainText: "What to do:\n• Have a smart carb choice (whole grain, fruit)\n• Pair it with protein or fat\n• Check if you're due for a meal\n• Stay ahead with regular eating\n\nDenying all carbs often backfires - choose wisely instead.",
      buttonText: "Makes sense"
    }
  },

  // ============================================
  // CONDITION-BASED CARDS: HEART/BLOOD PRESSURE
  // ============================================
  {
    id: 'heart-healthy-tip',
    type: 'tip',
    icon: 'heart-outline',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
    title: 'Heart Smart',
    text: "Every heart-healthy choice adds up. Small swaps make a big difference.",
    priority: 8,
    triggers: { helpers: ['heart_conscious'], areas: ['nutrition'] },
    modalContent: {
      title: "Heart-Healthy Wins",
      description: "Protecting your heart doesn't require perfection.",
      mainText: "Easy heart-smart swaps:\n• Olive oil instead of butter\n• Fish twice a week\n• More fruits and vegetables\n• Reduce processed foods\n• Watch the salt\n\nYou're making choices that matter!",
      buttonText: "Every bit counts"
    }
  },

  // ============================================
  // CONDITION-BASED CARDS: MENTAL HEALTH
  // ============================================
  {
    id: 'no-appetite',
    type: 'encouragement',
    icon: 'cafe-outline',
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5',
    title: 'No Appetite',
    text: "Not hungry at all? Even small bites count. Your body still needs fuel.",
    priority: 10,
    triggers: { obstacles: ['no_appetite'], areas: ['nutrition'] },
    modalContent: {
      title: "When Food Doesn't Appeal",
      description: "Loss of appetite is real and valid. Let's work with it.",
      mainText: "Low-effort nourishment:\n• Smoothies or protein shakes\n• Yogurt or pudding\n• Cheese and crackers\n• Nut butter on toast\n• Soup or broth\n\nSomething is always better than nothing. Be patient with yourself.",
      buttonText: "I'll try something small"
    }
  },
  {
    id: 'comfort-food-pull',
    type: 'strategy',
    icon: 'heart-dislike-outline',
    iconBg: '#fee2e2',
    iconColor: '#ef4444',
    title: 'Comfort Pull',
    text: "Reaching for comfort food? That's a valid response to hard feelings.",
    priority: 10,
    triggers: { obstacles: ['comfort_food_pull'], areas: ['nutrition'] },
    modalContent: {
      title: "Food and Feelings",
      description: "Using food for comfort isn't weakness - it's human.",
      mainText: "A gentler approach:\n• Acknowledge the feeling first\n• Ask: What do I really need?\n• If food helps, eat it mindfully\n• Add something nourishing alongside\n• Don't punish yourself after\n\nCompassion works better than restriction.",
      buttonText: "Being kind to myself"
    }
  },
  {
    id: 'eating-feels-hard',
    type: 'encouragement',
    icon: 'hand-left-outline',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    title: 'Hard Day',
    text: "When eating itself feels hard, just getting something in is a win.",
    priority: 10,
    triggers: { obstacles: ['eating_feels_hard'], areas: ['nutrition'] },
    modalContent: {
      title: "One Small Step",
      description: "Sometimes the goal is just... eating something. That's enough.",
      mainText: "The easiest options:\n• Meal replacement shake\n• Ready-to-eat food (no prep)\n• Delivery is okay\n• Snack foods count\n\nYou're doing your best. That's all anyone can do.",
      buttonText: "That's enough for today"
    }
  },

  // ============================================
  // CONDITION-BASED CARDS: PARENT OF YOUNG KIDS
  // ============================================
  {
    id: 'kids-food-temptation',
    type: 'strategy',
    icon: 'people-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Kid Food Zone',
    text: "Surrounded by goldfish and juice boxes? The struggle is real.",
    priority: 9,
    triggers: { obstacles: ['kids_food_temptation'], areas: ['nutrition'] },
    modalContent: {
      title: "Surviving Kid Food",
      description: "When your house is full of tempting snacks for little ones.",
      mainText: "Strategies that work:\n• Keep your snacks separate and visible\n• Eat with the kids, not their leftovers\n• Have a 'parent only' shelf\n• Buy kid snacks you don't love\n• Pre-portion your own treats\n\nYou can't eliminate it, but you can manage it.",
      buttonText: "Good ideas"
    }
  },
  {
    id: 'parenting-exhaustion',
    type: 'encouragement',
    icon: 'moon-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'Parent Tired',
    text: "Parenting little ones is exhausting. Quick, easy food is fine.",
    priority: 9,
    triggers: { obstacles: ['parenting_exhaustion'], areas: ['nutrition'] },
    modalContent: {
      title: "Survival Mode Meals",
      description: "Sleep-deprived parents need easy wins, not gourmet cooking.",
      mainText: "No-shame easy options:\n• Rotisserie chicken + bagged salad\n• Frozen meals (yes, really)\n• Cheese, crackers, and fruit\n• Breakfast for dinner\n• Delivery when needed\n\nYou're keeping tiny humans alive. That's the priority.",
      buttonText: "I needed to hear this"
    }
  },

  // ============================================
  // CONDITION-BASED CARDS: SHIFT WORKERS
  // ============================================
  {
    id: 'weird-eating-hours',
    type: 'strategy',
    icon: 'time-outline',
    iconBg: '#312e81',
    iconColor: '#c7d2fe',
    title: 'Off-Hours Eating',
    text: "Eating at 3am? Your body still needs regular fuel - just shifted.",
    priority: 9,
    triggers: { obstacles: ['weird_eating_hours'], areas: ['nutrition'] },
    modalContent: {
      title: "Shift Work Nutrition",
      description: "Odd hours don't mean abandoning good eating - just adapting it.",
      mainText: "Shift worker tips:\n• Treat your 'midnight' like morning\n• Pack meals like a normal day, just shifted\n• Avoid heavy meals before sleep\n• Lighter eating in your 'evening'\n• Prep on days off\n\nConsistency in YOUR schedule matters most.",
      buttonText: "That helps"
    }
  },
  {
    id: 'vending-only',
    type: 'tip',
    icon: 'cube-outline',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    title: 'Vending Machine Life',
    text: "When the vending machine is your only option, choose strategically.",
    priority: 9,
    triggers: { obstacles: ['vending_only'], areas: ['nutrition'] },
    modalContent: {
      title: "Best Vending Choices",
      description: "Not ideal, but you can find decent options.",
      mainText: "Better vending picks:\n• Nuts or trail mix\n• Cheese/peanut butter crackers\n• Beef jerky\n• Granola bars (less sugar)\n• Water over soda\n\nLong term: Keep a stash of your own snacks at work.",
      buttonText: "Noted"
    }
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
