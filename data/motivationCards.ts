import { Ionicons } from '@expo/vector-icons';

// Types
export type MotivationCardType = 'tip' | 'encouragement' | 'reframe' | 'strategy' | 'fact' | 'quiz' | 'tool';

export type TriggerCondition = {
  feelings?: string[];
  obstacles?: string[];
  helpers?: string[];
  areas?: string[];  // If specified, card only shows for these areas. Empty/undefined = all areas
  excludeAreas?: string[]; // Areas where this card should NOT show
  // NEW: Tip-based triggers
  tipGoals?: string[];        // Match tip's goals (e.g., ['reduce_sugar', 'eat_more_vegetables'])
  tipMechanisms?: string[];   // Match tip's mechanisms (e.g., ['dopamine_regulation', 'habit_stacking'])
  tipDrivers?: string[];      // Match tip's drivers (e.g., ['driver:emotional_eating', 'driver:boredom'])
  tipDifficulty?: number[];   // Match tip difficulty levels (e.g., [3, 4, 5] for harder tips)
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

// Card attributes for pattern detection when marked "not helpful"
export type CardAttributes = {
  tone: 'gentle' | 'energizing' | 'neutral' | 'playful' | 'serious';
  science_depth: 'light' | 'moderate' | 'deep';
  duration: 'quick' | 'medium' | 'long';       // How long to read/do
  category: string;                             // e.g., 'breathing', 'distraction', 'reframe', 'education'
  requires_privacy?: boolean;                   // Can they do it in public?
  requires_action?: boolean;                    // Is it passive (read) or active (do something)?
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
  // NEW: Attributes for pattern detection
  attributes?: CardAttributes;
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
  area: string,
  tipGoals?: string[],
  tipMechanisms?: string[]
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

  // Check tip-based triggers (goals and mechanisms from the current tip)
  if (tipGoals && tipGoals.length > 0 && triggers.tipGoals && triggers.tipGoals.length > 0) {
    if (triggers.tipGoals.some(g => tipGoals.includes(g))) {
      hasMatch = true;
    }
  }

  if (tipMechanisms && tipMechanisms.length > 0 && triggers.tipMechanisms && triggers.tipMechanisms.length > 0) {
    if (triggers.tipMechanisms.some(m => tipMechanisms.includes(m))) {
      hasMatch = true;
    }
  }

  return hasMatch;
}

// Normalize area name (handle mappings like 'exercise' -> 'fitness', 'eating' -> 'nutrition')
function normalizeArea(area: string): string {
  if (area === 'exercise') return 'fitness';
  if (area === 'eating') return 'nutrition';
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
 * @param tipGoals - Optional: goals from the current tip (e.g., ['craving_management', 'reduce_sugar'])
 * @param tipMechanisms - Optional: mechanisms from the current tip (e.g., ['craving_substitution', 'sensory'])
 * @returns Array of matching MotivationCard objects, sorted by priority
 */
export function getMotivationCards(
  selectedFeelings: string[],
  selectedObstacles: string[],
  selectedHelpers: string[],
  area: string,
  maxCards: number = 3,
  tipGoals?: string[],
  tipMechanisms?: string[]
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
      effectiveArea,
      tipGoals,
      tipMechanisms
    ))
    .map(({ triggers, ...cardWithoutTriggers }) => cardWithoutTriggers) // Remove triggers from output
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxCards);

  return matchingCards;
}

// Export the type for use in components
export type { MotivationCard as MotivationCardOutput };

// ============================================
// TIP-SPECIFIC MOTIVATION CARDS
// These cards are designed to pair with specific nutrition tips
// and include full CardAttributes for pattern detection
// ============================================

export const TIP_SPECIFIC_CARDS: MotivationCardDefinition[] = [
  // ============================================
  // CRAVINGS & CRUNCH-RELATED CARDS
  // For tips about snack swaps, crunchy alternatives
  // ============================================
  {
    id: 'craving-texture-quiz',
    type: 'quiz',
    icon: 'help-circle-outline',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
    title: 'Craving Detective',
    text: "Is it the taste you want, or the texture? Let's figure it out.",
    priority: 12,
    triggers: {
      obstacles: ['cravings', 'boredom'],
      areas: ['nutrition'],
      tipGoals: ['reduce_sugar', 'weight_loss', 'less_processed_food'],
      tipMechanisms: ['sensory']
    },
    modalContent: {
      title: "What Are You Really Craving?",
      question: "Close your eyes and imagine eating chips. What part feels most satisfying?",
      options: [
        { id: 'crunch', text: "The satisfying CRUNCH", correct: true },
        { id: 'salt', text: "The salty flavor", correct: false },
        { id: 'hand', text: "Having something to do with my hands", correct: false },
        { id: 'all', text: "All of the above!", correct: false }
      ],
      answerExplanation: "If it's the crunch, try carrots, snap peas, or air-popped popcorn. If it's salt, try pickles or seaweed snacks. If it's hand-to-mouth motion, try sunflower seeds in the shell - they slow you down!",
      buttonText: "Now I know!"
    },
    attributes: {
      tone: 'playful',
      science_depth: 'light',
      duration: 'quick',
      category: 'self-discovery',
      requires_privacy: false,
      requires_action: true
    }
  },
  {
    id: 'crunch-satisfaction-fact',
    type: 'fact',
    icon: 'ear-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Crunch Science',
    text: "The sound of crunching actually makes food taste better. Your brain is wired for it!",
    priority: 9,
    triggers: {
      obstacles: ['cravings'],
      areas: ['nutrition'],
      tipMechanisms: ['sensory']
    },
    modalContent: {
      title: "The Sound of Satisfaction",
      description: "Researchers call it the 'crunch effect'.",
      mainText: "Studies show the louder the crunch, the more satisfying the food feels. That's why chips are so addictive!\n\nGood news: Carrots, celery, apples, and snap peas deliver serious crunch with way more nutrition. Your brain gets the satisfaction without the regret.",
      buttonText: "Mind blown"
    },
    attributes: {
      tone: 'neutral',
      science_depth: 'moderate',
      duration: 'quick',
      category: 'education',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'craving-delay-tool',
    type: 'tool',
    icon: 'timer-outline',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    title: '5-Minute Delay',
    text: "Try this quick technique before giving in to a craving.",
    priority: 11,
    triggers: {
      obstacles: ['cravings', 'urge_to_binge'],
      areas: ['nutrition'],
      tipGoals: ['reduce_sugar', 'weight_loss']
    },
    modalContent: {
      title: "The 5-Minute Craving Delay",
      description: "Cravings peak and pass. This tool helps you ride the wave.",
      mainText: "1. Set a timer for 5 minutes\n2. Leave the room with the food\n3. Do something engaging (text a friend, scroll social media, stretch)\n4. When the timer goes off, check in: Still want it?\n\nIf yes, have a small portion mindfully. No guilt. The point is breaking the automatic response.",
      buttonText: "Starting timer"
    },
    attributes: {
      tone: 'gentle',
      science_depth: 'light',
      duration: 'medium',
      category: 'distraction',
      requires_privacy: false,
      requires_action: true
    }
  },

  // ============================================
  // HYDRATION & THIRST CARDS
  // For tips about drinking water, water before meals
  // ============================================
  {
    id: 'thirst-hunger-science',
    type: 'fact',
    icon: 'water-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Thirst in Disguise',
    text: "37% of people mistake thirst for hunger. Your brain literally confuses the signals.",
    priority: 10,
    triggers: {
      obstacles: ['thirsty', 'cravings'],
      areas: ['nutrition'],
      tipGoals: ['improve_hydration', 'weight_loss']
    },
    modalContent: {
      title: "The Hydration Hack",
      description: "The hypothalamus controls both hunger and thirst - and sometimes gets them mixed up.",
      mainText: "Before reaching for a snack, try this:\n\n1. Drink a full glass of water\n2. Wait 15 minutes\n3. Check in: Still hungry?\n\nOften the 'hunger' disappears! This simple test can prevent hundreds of unnecessary calories.",
      buttonText: "I'll try it"
    },
    attributes: {
      tone: 'neutral',
      science_depth: 'moderate',
      duration: 'quick',
      category: 'education',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'water-timing-strategy',
    type: 'strategy',
    icon: 'time-outline',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    title: 'Water Timing',
    text: "When you drink matters almost as much as how much you drink.",
    priority: 8,
    triggers: {
      helpers: ['hydrated'],
      areas: ['nutrition'],
      tipGoals: ['improve_hydration']
    },
    modalContent: {
      title: "Strategic Hydration",
      description: "Timing your water can boost its benefits.",
      mainText: "• Morning: Drink water before coffee to rehydrate after sleep\n• Before meals: Helps with portion control\n• During exercise: Sip every 15-20 minutes\n• Evening: Taper off 2 hours before bed\n\nYou're not just drinking water - you're optimizing it!",
      buttonText: "Smart!"
    },
    attributes: {
      tone: 'energizing',
      science_depth: 'light',
      duration: 'quick',
      category: 'strategy',
      requires_privacy: false,
      requires_action: false
    }
  },

  // ============================================
  // EMOTIONAL & BOREDOM EATING CARDS
  // For tips about mindful eating, emotional triggers
  // ============================================
  {
    id: 'emotional-eating-reframe',
    type: 'reframe',
    icon: 'heart-outline',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
    title: 'Food & Feelings',
    text: "Using food for comfort isn't weakness - it's your brain trying to help you.",
    priority: 10,
    triggers: {
      obstacles: ['emotional', 'stress_eating', 'comfort_food_pull'],
      areas: ['nutrition']
    },
    modalContent: {
      title: "Why We Comfort Eat",
      description: "It's biology, not weakness.",
      mainText: "When stressed, your brain seeks dopamine - and food delivers. That's not a character flaw, it's evolution.\n\nThe goal isn't to never comfort eat. It's to:\n• Notice when you're doing it\n• Ask what you really need\n• Sometimes choose food anyway, mindfully\n\nCompassion works better than willpower.",
      buttonText: "I needed that"
    },
    attributes: {
      tone: 'gentle',
      science_depth: 'moderate',
      duration: 'quick',
      category: 'reframe',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'boredom-eating-quiz',
    type: 'quiz',
    icon: 'game-controller-outline',
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
    title: 'Boredom Check',
    text: "Is your body asking for food, or is your brain asking for stimulation?",
    priority: 11,
    triggers: {
      obstacles: ['boredom', 'mindless_eating'],
      areas: ['nutrition']
    },
    modalContent: {
      title: "The Boredom Test",
      question: "Would an apple sound good right now?",
      options: [
        { id: 'yes', text: "Yes, I'd eat an apple", correct: true },
        { id: 'no', text: "No, I want something specific", correct: false }
      ],
      answerExplanation: "If you'd eat an apple, you're genuinely hungry - eat something! If only specific treats sound good, you're probably bored or craving stimulation. Try: a 5-minute walk, texting a friend, or a quick game on your phone.",
      buttonText: "Makes sense"
    },
    attributes: {
      tone: 'playful',
      science_depth: 'light',
      duration: 'quick',
      category: 'self-discovery',
      requires_privacy: false,
      requires_action: true
    }
  },
  {
    id: 'mindless-eating-tool',
    type: 'tool',
    icon: 'eye-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: 'First Three Bites',
    text: "A quick mindfulness technique that changes how you experience food.",
    priority: 9,
    triggers: {
      obstacles: ['mindless_eating', 'speed_eating'],
      areas: ['nutrition'],
      tipMechanisms: ['sensory']
    },
    modalContent: {
      title: "The First Three Bites",
      description: "Most of our enjoyment happens in the first few bites. After that, we're often just... eating.",
      mainText: "Try this:\n1. Before eating, take 3 deep breaths\n2. Really notice your first bite - temperature, texture, flavor\n3. Do the same for bites 2 and 3\n4. After that, eat normally\n\nThis 30-second practice often leads to eating less while enjoying more.",
      buttonText: "I'll try it now"
    },
    attributes: {
      tone: 'gentle',
      science_depth: 'light',
      duration: 'quick',
      category: 'mindfulness',
      requires_privacy: false,
      requires_action: true
    }
  },

  // ============================================
  // MEAL PREP & PLANNING CARDS
  // For tips about batch cooking, leftovers, prep
  // ============================================
  {
    id: 'meal-prep-motivation',
    type: 'encouragement',
    icon: 'restaurant-outline',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Future You Thanks You',
    text: "Every meal you prep is a gift to your future self. That's not cheesy, it's science.",
    priority: 8,
    triggers: {
      helpers: ['leftovers', 'meal_prepped'],
      areas: ['nutrition'],
      tipMechanisms: ['convenience']
    },
    modalContent: {
      title: "The Prep Payoff",
      description: "Decision fatigue is real. You make ~200 food decisions daily.",
      mainText: "When you prep ahead, you're not just saving time. You're:\n• Removing decisions when willpower is low\n• Making the healthy choice the easy choice\n• Protecting yourself from 'hangry' decisions\n\nThis is playing chess while everyone else plays checkers.",
      buttonText: "Go me!"
    },
    attributes: {
      tone: 'energizing',
      science_depth: 'light',
      duration: 'quick',
      category: 'encouragement',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'batch-cooking-fact',
    type: 'fact',
    icon: 'layers-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Batch Power',
    text: "People who meal prep are 2x more likely to maintain a healthy weight.",
    priority: 8,
    triggers: {
      helpers: ['meal_prepped'],
      areas: ['nutrition'],
      tipGoals: ['weight_loss']
    },
    modalContent: {
      title: "The Research Is Clear",
      description: "Meal preppers consistently outperform non-preppers.",
      mainText: "Studies show meal preppers:\n• Eat more fruits and vegetables\n• Consume less fast food\n• Have better diet quality overall\n• Spend less money on food\n\nYou're not just cooking - you're stacking the odds in your favor.",
      buttonText: "Science win!"
    },
    attributes: {
      tone: 'neutral',
      science_depth: 'moderate',
      duration: 'quick',
      category: 'education',
      requires_privacy: false,
      requires_action: false
    }
  },

  // ============================================
  // SUGAR & SWEET CRAVINGS CARDS
  // For tips about reducing sugar, sweet alternatives
  // ============================================
  {
    id: 'sugar-craving-science',
    type: 'fact',
    icon: 'cube-outline',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
    title: 'Sugar Brain',
    text: "Sugar lights up the same brain regions as addictive substances. You're not weak - you're wired.",
    priority: 10,
    triggers: {
      obstacles: ['sugar_cravings'],
      areas: ['nutrition'],
      tipGoals: ['reduce_sugar']
    },
    modalContent: {
      title: "Why Sugar Is So Hard to Resist",
      description: "Sugar activates your brain's reward center - hard.",
      mainText: "MRI studies show sugar triggers dopamine release similar to addictive drugs. That's not a metaphor - it's neuroscience.\n\nGood news: Your taste buds adapt. After 2-3 weeks of reduced sugar, foods taste sweeter and cravings decrease.\n\nYou're not fighting weakness. You're rewiring your brain.",
      buttonText: "I can do this"
    },
    attributes: {
      tone: 'neutral',
      science_depth: 'deep',
      duration: 'medium',
      category: 'education',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'sweet-swap-strategy',
    type: 'strategy',
    icon: 'swap-horizontal-outline',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    title: 'Sweet Swap Ladder',
    text: "You don't have to go from candy to carrots. There's a ladder.",
    priority: 9,
    triggers: {
      obstacles: ['sugar_cravings'],
      areas: ['nutrition'],
      tipGoals: ['reduce_sugar']
    },
    modalContent: {
      title: "The Sweetness Ladder",
      description: "Gradual is sustainable. Cold turkey often fails.",
      mainText: "Instead of eliminating sweets, try stepping down:\n\n• Candy → Dark chocolate\n• Ice cream → Frozen yogurt → Frozen banana\n• Soda → Juice + sparkling water → Flavored water\n• Cookies → Dates with nut butter → Apple with cinnamon\n\nEach step trains your taste buds while still satisfying the craving.",
      buttonText: "Doable!"
    },
    attributes: {
      tone: 'gentle',
      science_depth: 'light',
      duration: 'quick',
      category: 'strategy',
      requires_privacy: false,
      requires_action: false
    }
  },

  // ============================================
  // PORTION CONTROL CARDS
  // For tips about eating less, hunger scales
  // ============================================
  {
    id: 'portion-visual-fact',
    type: 'fact',
    icon: 'hand-right-outline',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    title: 'Plate Illusion',
    text: "Smaller plates make portions look bigger. Your brain literally can't tell the difference.",
    priority: 8,
    triggers: {
      obstacles: ['portion_control'],
      areas: ['nutrition'],
      tipGoals: ['weight_loss'],
      tipMechanisms: ['decision_ease']
    },
    modalContent: {
      title: "The Delboeuf Illusion",
      description: "Your eyes deceive you at every meal.",
      mainText: "The same portion looks:\n• Small on a 12-inch plate\n• Satisfying on a 9-inch plate\n\nStudies show people served themselves 22% less when using smaller plates - without feeling deprived.\n\nYou don't need more willpower. You need smaller plates.",
      buttonText: "Mind hack!"
    },
    attributes: {
      tone: 'playful',
      science_depth: 'moderate',
      duration: 'quick',
      category: 'education',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'hunger-scale-tool',
    type: 'tool',
    icon: 'thermometer-outline',
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5',
    title: 'Hunger Scale Check',
    text: "Rate your hunger 1-10 before eating. It takes 30 seconds but changes everything.",
    priority: 9,
    triggers: {
      helpers: ['listening_to_body'],
      areas: ['nutrition'],
      tipMechanisms: ['sensory']
    },
    modalContent: {
      title: "The 1-10 Hunger Scale",
      description: "Eat when you're at 3-4, stop at 6-7. Simple but powerful.",
      mainText: "Before eating, ask: 'Where am I?'\n\n1-2: Ravenous, shaky\n3-4: Hungry, ready to eat ← Start here\n5: Neutral\n6-7: Satisfied, comfortable ← Stop here\n8-10: Stuffed, uncomfortable\n\nMost people eat at 1-2 and stop at 8-9. Shifting this window changes everything.",
      buttonText: "Checking in now"
    },
    attributes: {
      tone: 'neutral',
      science_depth: 'light',
      duration: 'quick',
      category: 'self-discovery',
      requires_privacy: false,
      requires_action: true
    }
  },

  // ============================================
  // VEGGIE & HEALTHY FOOD CARDS
  // For tips about sneaking veggies, eating more plants
  // ============================================
  {
    id: 'hidden-veggie-strategy',
    type: 'strategy',
    icon: 'leaf-outline',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Veggie Stealth Mode',
    text: "The best veggie is the one you don't notice. Here's how to hide them.",
    priority: 8,
    triggers: {
      areas: ['nutrition'],
      tipGoals: ['increase_veggies'],
      tipMechanisms: ['convenience']
    },
    modalContent: {
      title: "Sneaky Veggie Wins",
      description: "You don't have to love vegetables. You just have to eat them.",
      mainText: "Invisible veggie hacks:\n• Blend spinach into smoothies (you can't taste it)\n• Grate zucchini into pasta sauce\n• Add cauliflower to mac and cheese\n• Purée white beans into soups\n• Mash sweet potato into brownies\n\nNo one said you have to taste them to get the benefits!",
      buttonText: "Sneaky!"
    },
    attributes: {
      tone: 'playful',
      science_depth: 'light',
      duration: 'quick',
      category: 'strategy',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'fiber-fullness-fact',
    type: 'fact',
    icon: 'cellular-outline',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    title: 'Fiber Magic',
    text: "Fiber is basically a cheat code for feeling full longer.",
    priority: 8,
    triggers: {
      helpers: ['healthy_food'],
      areas: ['nutrition'],
      tipGoals: ['increase_veggies', 'improve_gut_health']
    },
    modalContent: {
      title: "The Fullness Fiber",
      description: "Fiber slows digestion, stabilizes blood sugar, and feeds good gut bacteria.",
      mainText: "High-fiber foods keep you satisfied because:\n• They take longer to chew\n• They absorb water and expand in your stomach\n• They slow glucose absorption (no crash)\n• They feed bacteria that signal fullness\n\nBonus: Most people eat half the fiber they need. Easy win!",
      buttonText: "Fiber it up"
    },
    attributes: {
      tone: 'neutral',
      science_depth: 'moderate',
      duration: 'quick',
      category: 'education',
      requires_privacy: false,
      requires_action: false
    }
  },

  // ============================================
  // SOCIAL EATING CARDS
  // For tips about eating at events, restaurants
  // ============================================
  {
    id: 'social-eating-strategy',
    type: 'strategy',
    icon: 'people-outline',
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5',
    title: 'Party Survival',
    text: "You can enjoy the party without derailing your progress. It's about strategy, not willpower.",
    priority: 10,
    triggers: {
      obstacles: ['social_eating', 'celebration'],
      areas: ['nutrition']
    },
    modalContent: {
      title: "The Social Eating Playbook",
      description: "Events don't have to mean overeating.",
      mainText: "Before: Eat a protein-rich snack. Never arrive starving.\n\nDuring:\n• Scout the food first, then choose\n• Hold a drink in your dominant hand\n• Stand away from the food table\n• Focus on people, not plates\n\nAfter: Return to normal immediately. One event doesn't define your week.",
      buttonText: "Game plan ready"
    },
    attributes: {
      tone: 'energizing',
      science_depth: 'light',
      duration: 'quick',
      category: 'strategy',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'restaurant-ordering-tip',
    type: 'tip',
    icon: 'restaurant-outline',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    title: 'Order First',
    text: "The person who orders first at a restaurant makes the healthiest choice. Be that person.",
    priority: 8,
    triggers: {
      obstacles: ['social_eating'],
      areas: ['nutrition']
    },
    modalContent: {
      title: "The First Order Effect",
      description: "Social pressure is real. Use it to your advantage.",
      mainText: "Research shows:\n• Ordering first prevents 'menu envy'\n• You're less influenced by others' choices\n• Saying it out loud commits you to it\n\nPro move: Check the menu online before you go. Decide in advance. Order first. Done.",
      buttonText: "Power move"
    },
    attributes: {
      tone: 'energizing',
      science_depth: 'moderate',
      duration: 'quick',
      category: 'strategy',
      requires_privacy: false,
      requires_action: false
    }
  },

  // ============================================
  // LATE NIGHT EATING CARDS
  // For tips about night snacking
  // ============================================
  {
    id: 'night-eating-reframe',
    type: 'reframe',
    icon: 'moon-outline',
    iconBg: '#312e81',
    iconColor: '#c7d2fe',
    title: 'Night Owl Truth',
    text: "Late night hunger often isn't hunger at all. It's procrastination, boredom, or tiredness in disguise.",
    priority: 10,
    triggers: {
      obstacles: ['late_night_cravings'],
      areas: ['nutrition']
    },
    modalContent: {
      title: "Decoding Night Cravings",
      description: "Your body confuses signals at night.",
      mainText: "Ask yourself:\n• Am I procrastinating sleep?\n• Am I actually tired?\n• Am I bored with what I'm watching/doing?\n• Did I eat enough during the day?\n\nOften the answer isn't food - it's bed, a better show, or a daytime eating fix.",
      buttonText: "Good point"
    },
    attributes: {
      tone: 'gentle',
      science_depth: 'light',
      duration: 'quick',
      category: 'reframe',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'kitchen-closed-strategy',
    type: 'strategy',
    icon: 'lock-closed-outline',
    iconBg: '#fee2e2',
    iconColor: '#ef4444',
    title: 'Kitchen Closed',
    text: "Set a 'kitchen closes at X' time. It's not about willpower - it's about rules.",
    priority: 9,
    triggers: {
      obstacles: ['late_night_cravings', 'night_snacking'],
      areas: ['nutrition']
    },
    modalContent: {
      title: "The Kitchen Closes Rule",
      description: "Decisions are easier when they're already made.",
      mainText: "Pick a time (8pm, 9pm) when the kitchen 'closes'.\n\nAfter that:\n• Brush your teeth (signals 'eating done')\n• Tea or water only\n• If truly hungry, a small protein snack is okay\n\nThe point isn't perfection - it's removing the nightly negotiation with yourself.",
      buttonText: "Setting my time"
    },
    attributes: {
      tone: 'neutral',
      science_depth: 'light',
      duration: 'quick',
      category: 'strategy',
      requires_privacy: false,
      requires_action: true
    }
  },

  // ============================================
  // ENERGY & AFTERNOON SLUMP CARDS
  // For tips about maintaining energy
  // ============================================
  {
    id: 'afternoon-slump-science',
    type: 'fact',
    icon: 'sunny-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: '3pm Crash',
    text: "That afternoon slump is predictable - and preventable. It's biology, not laziness.",
    priority: 9,
    triggers: {
      obstacles: ['afternoon_slump'],
      areas: ['nutrition']
    },
    modalContent: {
      title: "Why 3pm Hits Hard",
      description: "Your circadian rhythm naturally dips in the afternoon.",
      mainText: "The 'post-lunch dip' is caused by:\n• Natural circadian rhythm (siesta time!)\n• Blood sugar drop from lunch\n• Dehydration building up\n\nFixes:\n1. Drink water first\n2. Take a 5-min walk\n3. Have a protein snack, NOT sugar\n\nSugar gives a 15-min boost, then crashes you harder.",
      buttonText: "Makes sense"
    },
    attributes: {
      tone: 'neutral',
      science_depth: 'moderate',
      duration: 'quick',
      category: 'education',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'energy-food-tip',
    type: 'tip',
    icon: 'flash-outline',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Energy Foods',
    text: "Not all foods give you energy. Some steal it. Here's the cheat sheet.",
    priority: 8,
    triggers: {
      helpers: ['good_energy'],
      areas: ['nutrition']
    },
    modalContent: {
      title: "Energy Givers vs. Energy Takers",
      description: "What you eat determines how you feel 2 hours later.",
      mainText: "Energy GIVERS:\n• Protein (eggs, nuts, Greek yogurt)\n• Complex carbs (oats, whole grain)\n• Fiber + fat combos\n\nEnergy TAKERS:\n• Simple sugars (crash incoming)\n• Large portions (blood goes to digestion)\n• High-fat + high-carb combos\n\nPlan your energy, don't react to it.",
      buttonText: "Energy cheat sheet"
    },
    attributes: {
      tone: 'energizing',
      science_depth: 'light',
      duration: 'quick',
      category: 'strategy',
      requires_privacy: false,
      requires_action: false
    }
  }
];

// ============================================
// DOPPELGANGER TIP SPECIFIC CARDS
// For the "Find a healthier doppelganger for your strongest craving" tip
// Tip ID: 9f34f055-f5d0-434a-94c4-7127415321f6
// ============================================

export const DOPPELGANGER_TIP_CARDS: MotivationCardDefinition[] = [
  {
    id: 'doppelganger-decode-quiz',
    type: 'quiz',
    icon: 'search-outline',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
    title: 'Craving Decoder',
    text: "What's the REAL reason you want that food? Let's decode it.",
    priority: 12,
    triggers: {
      obstacles: ['cravings', 'sugar_cravings'],
      areas: ['nutrition'],
      tipGoals: ['craving_management', 'less_processed_food'],
      tipMechanisms: ['craving_substitution', 'sensory']
    },
    modalContent: {
      title: "Decode Your Craving",
      question: "Think about your craving. What's the MAIN thing that sounds satisfying?",
      options: [
        { id: 'texture', text: "The texture (crunchy, creamy, chewy)", correct: true },
        { id: 'temp', text: "The temperature (cold, warm, hot)", correct: false },
        { id: 'flavor', text: "The flavor (sweet, salty, savory)", correct: false },
        { id: 'ritual', text: "The ritual (unwrapping, scooping, dipping)", correct: false }
      ],
      answerExplanation: "Great! Now you can find a healthier 'twin' that matches that same quality. Craving crunchy chips? Try snap peas or popcorn. Creamy ice cream? Try frozen banana 'nice cream'. The key is matching the sensory experience!",
      buttonText: "Now I get it!"
    },
    attributes: {
      tone: 'playful',
      science_depth: 'light',
      duration: 'quick',
      category: 'self-discovery',
      requires_privacy: false,
      requires_action: true
    }
  },
  {
    id: 'doppelganger-swap-guide',
    type: 'strategy',
    icon: 'swap-horizontal-outline',
    iconBg: '#d1fae5',
    iconColor: '#059669',
    title: 'Swap Cheat Sheet',
    text: "The ultimate craving-to-doppelganger translation guide.",
    priority: 11,
    triggers: {
      obstacles: ['cravings'],
      areas: ['nutrition'],
      tipGoals: ['craving_management', 'less_processed_food'],
      tipMechanisms: ['craving_substitution']
    },
    modalContent: {
      title: "Craving → Doppelganger Swaps",
      description: "Match the sensory experience, upgrade the nutrition.",
      mainText: "🍦 COLD & CREAMY\nIce cream → Frozen banana 'nice cream'\nMilkshake → Protein smoothie\n\n🥨 CRUNCHY & SALTY\nChips → Air-popped popcorn, seaweed snacks\nPretzels → Roasted chickpeas, snap peas\n\n🍫 SWEET & RICH\nCandy → Frozen grapes, dark chocolate\nCookies → Dates with almond butter\n\n🧀 SAVORY & SATISFYING\nCheese puffs → Cheese crisps, nuts\nFries → Baked sweet potato wedges",
      buttonText: "Saving this!"
    },
    attributes: {
      tone: 'energizing',
      science_depth: 'light',
      duration: 'medium',
      category: 'strategy',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'doppelganger-science',
    type: 'fact',
    icon: 'bulb-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Why Swaps Work',
    text: "Your brain cares more about the experience than the exact food. Science says so.",
    priority: 10,
    triggers: {
      areas: ['nutrition'],
      tipGoals: ['craving_management'],
      tipMechanisms: ['craving_substitution', 'sensory']
    },
    modalContent: {
      title: "The Science of Satisfaction",
      description: "Cravings are often about sensory experiences, not specific foods.",
      mainText: "Research shows that cravings have distinct 'signatures':\n\n• Texture cravings (crunch, creaminess)\n• Temperature cravings (cold, warm)\n• Flavor cravings (sweet, salty, umami)\n• Mouthfeel cravings (chewy, smooth)\n\nWhen you match 2-3 of these qualities with a healthier option, your brain often can't tell the difference! It gets the satisfaction without knowing it's been 'tricked'.",
      buttonText: "Mind = blown"
    },
    attributes: {
      tone: 'neutral',
      science_depth: 'moderate',
      duration: 'quick',
      category: 'education',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'doppelganger-experiment-tool',
    type: 'tool',
    icon: 'flask-outline',
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
    title: 'Swap Experiment',
    text: "Try this 3-step method to find your perfect doppelganger.",
    priority: 11,
    triggers: {
      obstacles: ['cravings', 'sugar_cravings'],
      areas: ['nutrition'],
      tipGoals: ['craving_management'],
      tipMechanisms: ['craving_substitution', 'autonomy']
    },
    modalContent: {
      title: "The Doppelganger Experiment",
      description: "Finding the right swap takes a little trial and error. Here's how:",
      mainText: "Step 1: IDENTIFY\nWhat's the craving? Write down 2-3 qualities that make it satisfying (crunchy, salty, cold, etc.)\n\nStep 2: TEST\nTry 2-3 healthier options that match those qualities. Rate each 1-10 on satisfaction.\n\nStep 3: STOCK\nWhen you find one that scores 7+, keep it stocked! A good doppelganger only works if it's available.\n\nPro tip: It doesn't need to be a 10. A 7 that's always there beats a 10 you have to make.",
      buttonText: "Starting my experiment"
    },
    attributes: {
      tone: 'playful',
      science_depth: 'light',
      duration: 'medium',
      category: 'self-discovery',
      requires_privacy: false,
      requires_action: true
    }
  },
  {
    id: 'doppelganger-not-deprivation',
    type: 'reframe',
    icon: 'heart-outline',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: "It's Not About 'Less'",
    text: "Finding a doppelganger isn't about deprivation. It's about getting smarter.",
    priority: 9,
    triggers: {
      obstacles: ['cravings'],
      areas: ['nutrition'],
      tipGoals: ['craving_management'],
      tipMechanisms: ['autonomy']
    },
    modalContent: {
      title: "Swapping ≠ Suffering",
      description: "This isn't about willpower or saying no. It's about saying yes... differently.",
      mainText: "The goal isn't to never have what you crave. It's to:\n\n✓ Satisfy the craving more often with something better\n✓ Save the 'real thing' for when it really matters\n✓ Stop the guilt-craving-binge cycle\n\nA good doppelganger means you can say YES to the craving without the regret. That's freedom, not restriction.",
      buttonText: "I like that"
    },
    attributes: {
      tone: 'gentle',
      science_depth: 'light',
      duration: 'quick',
      category: 'reframe',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'doppelganger-frozen-grape-hack',
    type: 'tip',
    icon: 'snow-outline',
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    title: 'Frozen Grape Hack',
    text: "The easiest doppelganger ever: frozen grapes taste like candy.",
    priority: 8,
    triggers: {
      obstacles: ['sugar_cravings'],
      areas: ['nutrition'],
      tipGoals: ['craving_management', 'reduce_sugar']
    },
    modalContent: {
      title: "The 2-Minute Candy Doppelganger",
      description: "No prep, no recipe, just freeze and eat.",
      mainText: "Wash grapes, spread on a tray, freeze for 2 hours.\n\nWhy it works:\n• Cold intensifies sweetness\n• You have to eat them slowly (frozen!)\n• The 'pop' when you bite is satisfying\n• They feel like a treat, not health food\n\nBonus swaps:\n• Frozen banana slices = ice cream bites\n• Frozen mango = tropical candy\n• Frozen blueberries = mini popsicles",
      buttonText: "Freezing some now!"
    },
    attributes: {
      tone: 'playful',
      science_depth: 'light',
      duration: 'quick',
      category: 'strategy',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'doppelganger-crunch-alternatives',
    type: 'tip',
    icon: 'volume-high-outline',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    title: 'Crunch Without Chips',
    text: "Missing that satisfying crunch? These swaps deliver.",
    priority: 8,
    triggers: {
      obstacles: ['cravings'],
      areas: ['nutrition'],
      tipGoals: ['craving_management', 'less_processed_food'],
      tipMechanisms: ['sensory']
    },
    modalContent: {
      title: "The Crunch Collection",
      description: "Your chip-replacement lineup.",
      mainText: "SALTY CRUNCH:\n• Seaweed snacks (crazy satisfying)\n• Rice cakes with everything bagel seasoning\n• Roasted chickpeas\n• Pickles (zero calories, max crunch)\n\nSWEET CRUNCH:\n• Apple slices with cinnamon\n• Freeze-dried fruit\n• Dark chocolate rice cakes\n\nVEGGIE CRUNCH:\n• Snap peas + hummus\n• Jicama sticks\n• Bell pepper strips\n• Cucumber with tajin",
      buttonText: "Adding to grocery list"
    },
    attributes: {
      tone: 'energizing',
      science_depth: 'light',
      duration: 'quick',
      category: 'strategy',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'doppelganger-80-percent-rule',
    type: 'strategy',
    icon: 'pie-chart-outline',
    iconBg: '#e0e7ff',
    iconColor: '#4f46e5',
    title: 'The 80% Rule',
    text: "You don't need a perfect swap. 80% as good is good enough.",
    priority: 9,
    triggers: {
      obstacles: ['cravings'],
      areas: ['nutrition'],
      tipGoals: ['craving_management']
    },
    modalContent: {
      title: "Good Enough > Perfect",
      description: "Waiting for the perfect doppelganger? Stop.",
      mainText: "A swap that's 80% as satisfying works if:\n• It's always available\n• It's easy to grab\n• You actually like it\n\nThe math:\nPerfect swap you don't have = 0% satisfaction\n80% swap in your fridge = 80% satisfaction\n\nStock what's good enough. Save the 'real thing' for special occasions when it really matters.",
      buttonText: "80% it is"
    },
    attributes: {
      tone: 'neutral',
      science_depth: 'light',
      duration: 'quick',
      category: 'strategy',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'doppelganger-name-it',
    type: 'encouragement',
    icon: 'pricetag-outline',
    iconBg: '#fce7f3',
    iconColor: '#db2777',
    title: 'Name Your Swap',
    text: "Give your doppelganger a fun name. It makes it feel more special.",
    priority: 7,
    triggers: {
      helpers: ['simple_swaps'],
      areas: ['nutrition'],
      tipGoals: ['craving_management']
    },
    modalContent: {
      title: "Make It Yours",
      description: "A named swap becomes a thing you DO, not a thing you're missing.",
      mainText: "Examples from real people:\n\n• 'Nice cream' (frozen banana ice cream)\n• 'Sir Crunch-a-Lot' (their go-to crunchy snack)\n• 'Choco-fix' (dark chocolate squares)\n• 'Frosty grapes' (frozen grape stash)\n• 'The good stuff' (their upgraded version)\n\nNaming it makes it YOUR thing - not a sad substitute. It's psychology in action!",
      buttonText: "Love this"
    },
    attributes: {
      tone: 'playful',
      science_depth: 'light',
      duration: 'quick',
      category: 'encouragement',
      requires_privacy: false,
      requires_action: false
    }
  },
  {
    id: 'doppelganger-stock-strategy',
    type: 'strategy',
    icon: 'cube-outline',
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    title: 'Stock the Swap',
    text: "A swap only works if it's there when you need it. Here's how to stay ready.",
    priority: 8,
    triggers: {
      helpers: ['healthy_food', 'meal_prepped'],
      areas: ['nutrition'],
      tipGoals: ['craving_management'],
      tipMechanisms: ['convenience']
    },
    modalContent: {
      title: "Always Be Stocked",
      description: "The best swap in the world fails if it's not in your kitchen.",
      mainText: "The Doppelganger Prep System:\n\n1. IDENTIFY your top 3 cravings\n2. FIND a swap for each one\n3. ADD them to your standard grocery list\n4. PREP them so they're grab-ready\n   (wash grapes, portion nuts, make popcorn)\n5. PLACE them where you'll see them first\n\nWhen the craving hits at 9pm, you won't have time to prep. Do it in advance.",
      buttonText: "Prepping now"
    },
    attributes: {
      tone: 'energizing',
      science_depth: 'light',
      duration: 'quick',
      category: 'strategy',
      requires_privacy: false,
      requires_action: true
    }
  }
];

// Add tip-specific cards to the main array
MOTIVATION_CARDS.push(...TIP_SPECIFIC_CARDS);
MOTIVATION_CARDS.push(...DOPPELGANGER_TIP_CARDS);
