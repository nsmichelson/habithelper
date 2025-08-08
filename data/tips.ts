import { Tip } from '../types/tip';

export const TIPS_DATABASE: Tip[] = [
  {
    tip_id: 'a1b2c3d4-0001-4001-a001-1234567890ab',
    summary: 'Swap one sugary drink for water or sparkling water.',
    details_md: `**The Experiment:** For one day, whenever you would normally reach for a soda, sweetened juice, or other sugary beverage, substitute it with plain or naturally flavored sparkling water.

**Why it Works:** Sugary drinks are a major source of "empty" calories and added sugars, which can contribute to weight gain and blood sugar fluctuations. Water or sparkling water provides hydration and can offer the satisfying carbonation of soda without the sugar or calories, helping to break the sugar habit.

**How to Try It:**
• Keep a pitcher of cold water or a few cans of sparkling water in the fridge
• If you enjoy flavor, add a squeeze of fresh lemon, lime, or a few muddled berries yourself
• When at a restaurant, ask for water or sparkling water with lemon instead of soda`,
    contraindications: ['phenylketonuria'],
    goal_tags: ['weight_loss', 'reduce_sugar', 'improve_hydration', 'less_processed_food'],
    tip_type: ['healthy_swap', 'crave_buster'],
    motivational_mechanism: ['sensory', 'decision_ease'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work', 'restaurant', 'social_event', 'commute'],
    social_mode: 'either',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['craving_event', 'meal_time', 'snack_time'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed'
  },
  {
    tip_id: 'a1b2c3d4-0002-4002-a002-1234567890ac',
    summary: 'Add one serving of vegetables to your dinner.',
    details_md: `**The Experiment:** Intentionally add one extra serving of vegetables to your dinner plate tonight. A serving is about the size of your fist or one cup.

**Why it Works:** Most people don't eat enough vegetables. They are packed with vitamins, minerals, fiber, and antioxidants that are crucial for health and can lower the risk of chronic diseases. Adding volume with low-calorie, high-fiber vegetables can also help you feel fuller, aiding in portion control and weight management.

**How to Try It:**
• Add a handful of spinach to a pasta sauce or soup
• Steam or roast a side of broccoli or green beans
• Start your meal with a simple side salad
• Frozen vegetables are a quick and easy option; just microwave and serve`,
    contraindications: [],
    goal_tags: ['increase_veggies', 'weight_loss', 'improve_gut_health', 'less_processed_food', 'plant_based'],
    tip_type: ['healthy_swap', 'habit_stacking'],
    motivational_mechanism: ['mastery', 'sensory'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'either',
    time_of_day: ['evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed'
  },
  {
    tip_id: 'f4a5b6c7-d8e9-0123-fabc-456789012345',
    summary: 'Eat one meal without distractions.',
    details_md: `**The Experiment:** Choose one meal today—breakfast, lunch, or dinner—and eat it without any distractions. This means no phone, no TV, no computer, no reading. Just you and your food.

**Why it Works:** Mindful eating helps you reconnect with your body's natural hunger and fullness signals. Eating without distraction allows you to slow down, savor flavors and textures, and better recognize when you are satisfied, which can prevent overeating.

**How to Try It:**
• Sit at a table
• Put your phone in another room
• Pay attention to the colors, smells, sounds, and textures of your food
• Try putting your fork down between bites to pace yourself`,
    contraindications: [],
    goal_tags: ['weight_loss', 'improve_gut_health'],
    tip_type: ['mindset_shift', 'environment_design'],
    motivational_mechanism: ['sensory', 'comfort'],
    time_cost_enum: '15_60_min',
    money_cost_enum: '$',
    mental_effort: 3,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 3,
    created_by: 'dietitian_reviewed'
  },
  {
    tip_id: 'a1b2c3d4-0006-4006-a006-1234567890b0',
    summary: 'Habit Stack: Drink a glass of water before your morning coffee.',
    details_md: `**The Experiment:** Before you have your first cup of coffee or tea in the morning, drink a full 8 oz (240 ml) glass of water.

**Why it Works:** This is a classic "habit stacking" technique, attaching a new desired habit (drinking water) to a strong existing habit (morning coffee). It starts your day with hydration, as you're often dehydrated after sleeping, and can help you reach your daily fluid goals.

**How to Try It:**
• The night before, place a glass and a pitcher of water right next to your coffee maker
• Make it a non-negotiable rule: water first, then coffee`,
    contraindications: [],
    goal_tags: ['improve_hydration', 'improve_energy'],
    tip_type: ['habit_stacking', 'time_ritual'],
    motivational_mechanism: ['decision_ease', 'energy_boost'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['morning'],
    cue_context: ['craving_event'],
    difficulty_tier: 1,
    created_by: 'coach_curated'
  },
  {
    tip_id: 'a1b2c3d4-0010-4010-a010-1234567890b4',
    summary: "The Kitchen Makeover: Hide one 'red light' food.",
    details_md: `**The Experiment:** Identify one food or snack in your kitchen that you tend to overeat or know isn't helping your goals (a "red light" food). Move it out of sight.

**Why it Works:** This is a small-scale version of the "kitchen makeover". You are changing your food environment to make the less-healthy choice harder to access. Out of sight is often out of mind. This reduces the number of times you have to exercise willpower during the day.

**How to Try It:**
• Move the cookies from the counter to a high shelf in the pantry
• Put the bag of chips in an opaque container instead of its original crinkly bag
• Ask a family member to store a tempting item where you won't easily find it`,
    contraindications: [],
    goal_tags: ['weight_loss', 'reduce_sugar', 'less_processed_food'],
    tip_type: ['environment_design'],
    motivational_mechanism: ['decision_ease'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon', 'evening', 'late_night'],
    cue_context: ['boredom', 'stress'],
    difficulty_tier: 1,
    created_by: 'coach_curated'
  },
  {
    tip_id: 'a1b2c3d4-0019-4019-a019-1234567890bd',
    summary: 'Go for a 10-minute walk after a meal.',
    details_md: `**The Experiment:** After one of your main meals today, go for a brisk 10-minute walk.

**Why it Works:** Walking after a meal can aid digestion and help stabilize blood sugar levels. It's a gentle way to incorporate more physical activity into your day, which contributes to overall energy expenditure and health. It also serves as a positive post-meal ritual instead of immediately sitting on the couch.

**How to Try It:**
• Right after you finish eating, put on your shoes and head out the door
• Walk around your neighborhood, a nearby park, or even just around your office building
• Listen to a podcast or music to make it more enjoyable`,
    contraindications: ['elderly_frailty'],
    goal_tags: ['weight_loss', 'improve_gut_health', 'reduce_sugar', 'improve_energy'],
    tip_type: ['habit_stacking', 'time_ritual'],
    motivational_mechanism: ['energy_boost', 'comfort'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 2,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'coach_curated'
  },
  {
    tip_id: 'a1b2c3d4-0030-4030-a030-1234567890c8',
    summary: 'Drink a glass of water when you feel a snack craving.',
    details_md: `**The Experiment:** The next time you feel a craving for a snack, especially when you know you're not truly hungry (e.g., out of boredom or stress), drink a full glass of water first.

**Why it Works:** Thirst is often mistaken for hunger. Pausing to drink water gives you a moment to check in with your body's cues. It may satisfy the craving, or at least give you time to make a more mindful choice about whether you really need to eat.

**How to Try It:**
• When a craving hits, go to the kitchen or water cooler and drink an 8 oz (240 ml) glass of water
• Wait 10-15 minutes
• Re-evaluate if you are still hungry. If you are, choose a healthy snack. If not, you've successfully hydrated and avoided unnecessary calories`,
    contraindications: [],
    goal_tags: ['improve_hydration', 'weight_loss', 'mindset_shift', 'reduce_sugar'],
    tip_type: ['crave_buster', 'mindset_shift'],
    motivational_mechanism: ['decision_ease', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['afternoon', 'evening', 'late_night'],
    cue_context: ['craving_event', 'boredom', 'stress'],
    difficulty_tier: 2,
    created_by: 'coach_curated'
  }
];

// Helper function to get tips that are safe for a user's medical conditions
export function getSafeTips(medicalConditions: string[]): Tip[] {
  return TIPS_DATABASE.filter(tip => 
    !tip.contraindications.some(contra => 
      medicalConditions.includes(contra)
    )
  );
}

// Helper function to get tips matching user goals
export function getTipsForGoals(goals: string[]): Tip[] {
  return TIPS_DATABASE.filter(tip =>
    tip.goal_tags.some(tag => goals.includes(tag))
  );
}

// Helper function to get tips by difficulty
export function getTipsByDifficulty(maxDifficulty: number): Tip[] {
  return TIPS_DATABASE.filter(tip => tip.difficulty_tier <= maxDifficulty);
}

// Helper function to get a specific tip by ID
export function getTipById(tipId: string): Tip | undefined {
  return TIPS_DATABASE.find(tip => tip.tip_id === tipId);
}