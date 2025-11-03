/**
 * Test scenarios for the enhanced recommendation algorithm
 * Shows how different user profiles get personalized recommendations
 * Updated to match the new outcome-first quiz structure
 */

import { TipRecommendationService } from './tipRecommendation';
import { UserProfile } from '../types/tip';

// Sample user profiles based on new outcome-first quiz structure
const TEST_PROFILES = {
  // Profile 1: Energy-focused user (tired professional)
  energyProfile: {
    // From Q1: What brings you here?
    primary_motivation: 'energy',

    // From Q2: What specifically would help your energy?
    goals: ['fall_asleep_easier', 'wake_up_refreshed', 'reduce_sugar', 'manage_stress'],

    // From Q3: Why is this important?
    motivation_why: ['feel_better', 'tired_of_struggling'],

    // From Q4: What has worked?
    what_worked: ['small_changes', 'flexible_approach', 'apps_tools'],

    // From Q5: What to avoid? (energy-specific)
    what_to_avoid_energy: ['early_morning', 'meditation', 'strict_bedtime'],

    // From Q6: Current barriers?
    current_barriers: ['no_time', 'work_demands', 'stress_overwhelm'],

    // From Q7: Things you love?
    things_you_love: ['coffee_tea', 'podcasts', 'reading', 'alone_time'],

    // Additional context
    additional_context: 'Night owl by nature, work requires early mornings',

    // Standard profile fields
    medical_conditions: [],
    allergies: [],
    areas_of_interest: ['nutrition', 'fitness', 'stress'],
    onboarding_completed: true,
    created_at: new Date(),
    id: 'test-energy-1'
  } as UserProfile,

  // Profile 2: Nutrition-focused user (wants to eat better)
  nutritionProfile: {
    // From Q1: What brings you here?
    primary_motivation: 'nutrition',

    // From Q2: What nutrition changes?
    goals: ['eat_more_veggies', 'reduce_sugar', 'control_portions', 'manage_cravings'],

    // From Q3: Why is this important?
    motivation_why: ['health_scare', 'look_better', 'role_model'],

    // From Q4: What has worked?
    what_worked: ['simple_swaps', 'accountability', 'small_changes'],

    // From Q5: What to avoid? (nutrition-specific)
    what_to_avoid_nutrition: ['counting_calories', 'extreme_restrictions', 'complicated_recipes', 'meal_prep'],

    // From Q6: Current barriers?
    current_barriers: ['love_sweets', 'social_events', 'no_time', 'hate_cooking'],

    // From Q7: Things you love?
    things_you_love: ['restaurants', 'social_media', 'friends_time', 'coffee_tea'],

    // From conditional Q: Food relationship
    food_relationship: 'tolerate', // It's fine, just a chore

    // Standard profile fields
    medical_conditions: ['hypertension'],
    allergies: [],
    areas_of_interest: ['nutrition'],
    veggie_preference: 'hide_them',
    onboarding_completed: true,
    created_at: new Date(),
    id: 'test-nutrition-1'
  } as UserProfile,

  // Profile 3: Look & Feel Better focused (weight loss + confidence)
  lookFeelProfile: {
    // From Q1: What brings you here?
    primary_motivation: 'look_feel',

    // From Q2: What would help you look and feel better?
    goals: ['lose_weight_eating', 'less_bloated', 'build_confidence', 'clothes_fit_better'],

    // From Q3: Why is this important?
    motivation_why: ['look_better', 'feel_better', 'confidence'],

    // From Q4: What has worked?
    what_worked: ['tracking', 'accountability', 'routine'],

    // From Q5: What to avoid? (nutrition-specific for look/feel)
    what_to_avoid_nutrition: ['extreme_restrictions', 'public_weigh_ins', 'expensive_foods'],

    // From Q6: Current barriers?
    current_barriers: ['emotional_eating', 'no_motivation', 'stress_overwhelm'],

    // From Q7: Things you love?
    things_you_love: ['music', 'walking', 'creating', 'learning'],

    // Additional context
    additional_context: 'Yo-yo dieter, need something sustainable this time',

    // Standard profile fields
    medical_conditions: [],
    allergies: ['lactose_intolerance'],
    areas_of_interest: ['nutrition', 'fitness'],
    onboarding_completed: true,
    created_at: new Date(),
    id: 'test-lookfeel-1'
  } as UserProfile,

  // Profile 4: Effectiveness-focused (productivity + organization)
  effectivenessProfile: {
    // From Q1: What brings you here?
    primary_motivation: 'effectiveness',

    // From Q2: What would make you more effective?
    goals: ['stop_procrastinating', 'improve_focus', 'reduce_overwhelm', 'finish_what_start'],

    // From Q3: Why is this important?
    motivation_why: ['career_growth', 'reduce_stress', 'achieve_goals'],

    // From Q4: What has worked?
    what_worked: ['apps_tools', 'rewards', 'flexible_approach'],

    // From Q5: What to avoid? (productivity-specific)
    what_to_avoid_productivity: ['time_blocking', 'early_morning', 'complex_systems'],

    // From Q6: Current barriers?
    current_barriers: ['no_time', 'work_demands', 'dont_know_how'],

    // From Q7: Things you love?
    things_you_love: ['games', 'podcasts', 'coffee_tea', 'learning', 'competing'],

    // Standard profile fields
    medical_conditions: [],
    allergies: [],
    areas_of_interest: ['organization', 'stress'],
    onboarding_completed: true,
    created_at: new Date(),
    id: 'test-effectiveness-1'
  } as UserProfile,

  // Profile 5: Relationship-focused user
  relationshipProfile: {
    // From Q1: What brings you here?
    primary_motivation: 'relationships',

    // From Q2: What relationship area needs work?
    goals: ['improve_communication', 'more_quality_time', 'set_boundaries', 'improve_work_life_balance'],

    // From Q3: Why is this important?
    motivation_why: ['strengthen_bonds', 'reduce_conflict', 'feel_connected'],

    // From Q4: What has worked?
    what_worked: ['small_changes', 'professional_help', 'education'],

    // From Q5: What to avoid? (relationship-specific)
    what_to_avoid_relationships: ['group_therapy', 'public_sharing', 'scheduled_talks'],

    // From Q6: Current barriers?
    current_barriers: ['work_demands', 'no_time', 'family_life'],

    // From Q7: Things you love?
    things_you_love: ['friends_time', 'outdoors', 'helping_others', 'reading'],

    // From conditional Q: Family context
    family_context: 'young_kids',

    // Standard profile fields
    medical_conditions: [],
    allergies: [],
    areas_of_interest: ['stress'],
    onboarding_completed: true,
    created_at: new Date(),
    id: 'test-relationship-1'
  } as UserProfile,

  // Profile 6: Fitness-focused user (busy parent)
  fitnessProfile: {
    // From Q1: What brings you here?
    primary_motivation: 'fitness',

    // From Q2: What's your fitness focus?
    goals: ['start_exercising', 'find_enjoyable_exercise', 'more_active_lifestyle', 'exercise_for_energy'],

    // From Q3: Why does fitness matter?
    motivation_why: ['keep_up_kids', 'feel_stronger', 'stress_relief', 'energy_boost'],

    // From Q4: What has worked?
    what_worked: ['buddy_system', 'small_changes', 'flexible_approach'],

    // From Q5: What to avoid? (fitness-specific)
    what_to_avoid_fitness: ['gym_required', 'early_morning', 'expensive_equipment', 'rigid_schedules'],

    // From Q6: Current barriers?
    current_barriers: ['family_life', 'no_time', 'picky_household'],

    // From Q7: Things you love?
    things_you_love: ['outdoors', 'music', 'walking', 'competing', 'games'],

    // From conditional Q: Family context
    family_context: 'young_kids',

    // Additional context
    additional_context: 'Need activities I can do with kids around',

    // Standard profile fields
    medical_conditions: [],
    allergies: [],
    areas_of_interest: ['fitness'],
    onboarding_completed: true,
    created_at: new Date(),
    id: 'test-fitness-1'
  } as UserProfile,

  // Profile 7: Health-focused user (managing conditions)
  healthProfile: {
    // From Q1: What brings you here?
    primary_motivation: 'health',

    // From Q2: What health areas concern you?
    goals: ['manage_blood_sugar', 'lower_blood_pressure', 'reduce_processed_foods', 'manage_stress'],

    // From Q3: Why is this important?
    motivation_why: ['health_scare', 'chronic_condition', 'aging_well'],

    // From Q4: What has worked?
    what_worked: ['professional_help', 'tracking', 'education', 'routine'],

    // From Q5: What to avoid? (health/nutrition-specific)
    what_to_avoid_nutrition: ['supplements', 'extreme_restrictions', 'expensive_foods'],

    // From Q6: Current barriers?
    current_barriers: ['budget_tight', 'health_issues', 'dont_know_how'],

    // From Q7: Things you love?
    things_you_love: ['cooking_shows', 'learning', 'reading', 'coffee_tea'],

    // Additional context
    additional_context: 'Recently diagnosed with pre-diabetes and high blood pressure',

    // Standard profile fields
    medical_conditions: ['t2_diabetes', 'hypertension'],
    allergies: [],
    areas_of_interest: ['nutrition', 'stress'],
    onboarding_completed: true,
    created_at: new Date(),
    id: 'test-health-1'
  } as UserProfile
};

/**
 * Expected high-scoring tips for each profile based on new structure
 */
const EXPECTED_RECOMMENDATIONS = {
  energy: [
    "Wind-down podcast routine 30 min before bed",
    "Afternoon protein snack instead of sugar",
    "5-minute stress-relief breathing at desk",
    "Evening herbal tea ritual to signal bedtime",
    "Weekend sleep schedule consistency hack"
  ],

  nutrition: [
    "Hide veggies in your favorite restaurant dishes",
    "Social media food swap challenge with friends",
    "Coffee shop healthy treat alternatives",
    "Restaurant veggie appetizer experiment",
    "Sweet tooth satisfaction strategies"
  ],

  lookFeel: [
    "Walking playlist for mood and movement",
    "Creative portion control hacks",
    "Confidence-building morning routine",
    "Bloat-reducing food swaps",
    "Progress tracking without the scale"
  ],

  effectiveness: [
    "Gamified task completion system",
    "Coffee shop focus sessions",
    "Podcast-powered productivity blocks",
    "Competition-based deadline system",
    "Learning-enhanced break times"
  ],

  relationships: [
    "Family outdoor adventure planning",
    "Reading together as connection time",
    "Work boundary setting strategies",
    "Quality time during daily routines",
    "Communication during walks"
  ],

  fitness: [
    "Musical family dance parties",
    "Outdoor scavenger hunt workouts",
    "Playground fitness while kids play",
    "Walking competition with rewards",
    "Active gaming as exercise"
  ],

  health: [
    "Educational cooking show experiments",
    "Blood sugar tracking made simple",
    "Budget-friendly healthy swaps",
    "Stress management through learning",
    "Tea ritual for blood pressure"
  ]
};

/**
 * Test function to run recommendations with new quiz structure
 */
export async function testRecommendationAlgorithm() {
  const service = new TipRecommendationService();

  console.log('🧪 Testing Enhanced Recommendation Algorithm with New Quiz Structure\n');
  console.log('=' .repeat(60));

  for (const [name, profile] of Object.entries(TEST_PROFILES)) {
    const displayName = name.replace('Profile', '');
    console.log(`\n👤 ${displayName.toUpperCase()} PROFILE:`);
    console.log(`   Primary Motivation: ${profile.primary_motivation}`);
    console.log(`   Specific Goals: ${profile.goals?.slice(0, 3).join(', ')}...`);
    console.log(`   Why It Matters: ${profile.motivation_why?.join(', ')}`);
    console.log(`   Current Barriers: ${profile.current_barriers?.slice(0, 3).join(', ')}...`);
    console.log(`   Things They Love: ${profile.things_you_love?.slice(0, 3).join(', ')}...`);
    console.log(`   Avoids: ${profile.what_to_avoid?.slice(0, 3).join(', ')}...`);

    // Get recommendations
    const recommendations = await service.recommendTips(
      profile,
      [], // No previous tips
      [], // No attempts
      new Date(),
      false // Not relaxed mode
    );

    console.log(`\n   TOP 5 RECOMMENDATIONS:`);

    recommendations.slice(0, 5).forEach((rec, i) => {
      console.log(`\n   ${i + 1}. ${rec.tip.summary}`);
      console.log(`      Score: ${rec.score.toFixed(2)}`);
      console.log(`      Why: ${rec.reasoning.slice(0, 100)}...`);
    });

    // Compare with expected recommendations
    const expected = EXPECTED_RECOMMENDATIONS[name.replace('Profile', '')];
    if (expected) {
      console.log(`\n   EXPECTED PATTERNS:`);
      expected.forEach(exp => {
        console.log(`      ✓ ${exp}`);
      });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Test Complete - Review recommendations for quality\n');
}

/**
 * Helper to create a UserProfile from quiz responses matching new structure
 */
export function createProfileFromQuizResponses(responses: Record<string, any>): Partial<UserProfile> {
  return {
    // Core motivation
    primary_motivation: responses.primary_motivation,

    // Goals from specific questions (energy_specifics, nutrition_specifics, etc.)
    goals: responses[`${responses.primary_motivation}_specifics`] || [],

    // Why it matters
    motivation_why: responses.nutrition_why || responses.exercise_why || [],

    // Experience
    what_worked: responses.what_worked || [],
    // Get the area-specific what_to_avoid based on primary motivation
    what_to_avoid: getWhatToAvoid(responses),

    // Current situation
    current_barriers: responses.current_barriers || [],

    // Preferences for habit pairing
    things_you_love: responses.things_you_love || [],

    // Additional context
    additional_context: responses.additional_context,

    // Conditional deep-dives
    food_relationship: responses.food_relationship,
    stress_sources: responses.stress_sources,
    family_context: responses.family_context,

    // Areas of interest (derived from primary motivation)
    areas_of_interest: deriveAreasFromMotivation(responses.primary_motivation),

    // Set defaults
    medical_conditions: [],
    allergies: [],
    onboarding_completed: true,
    created_at: new Date()
  };
}

/**
 * Helper to derive areas of interest from primary motivation
 */
function deriveAreasFromMotivation(motivation: string): string[] {
  const mappings = {
    'energy': ['nutrition', 'fitness', 'stress'],
    'relationships': ['stress'],
    'effectiveness': ['organization', 'stress'],
    'fitness': ['fitness'],
    'health': ['nutrition', 'stress'],
    'nutrition': ['nutrition'],
    'look_feel': ['nutrition', 'fitness']
  };

  return mappings[motivation] || [];
}

/**
 * Helper to get the appropriate what_to_avoid field based on primary motivation
 */
function getWhatToAvoid(responses: Record<string, any>): string[] {
  const motivation = responses.primary_motivation;

  // Map motivations to their specific what_to_avoid question IDs
  const avoidFieldMap = {
    'nutrition': 'what_to_avoid_nutrition',
    'health': 'what_to_avoid_nutrition',
    'look_feel': 'what_to_avoid_nutrition',
    'fitness': 'what_to_avoid_fitness',
    'energy': 'what_to_avoid_energy',
    'effectiveness': 'what_to_avoid_productivity',
    'relationships': 'what_to_avoid_relationships'
  };

  const fieldName = avoidFieldMap[motivation];
  return responses[fieldName] || [];
}