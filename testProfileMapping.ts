// Test comprehensive profile mapping from quiz responses
import { tipRecommendationService } from './services/tipRecommendation';
import { UserProfile } from './types/tip';

console.log('=== TEST: Comprehensive Profile Mapping ===\n');

// Simulate a complete quiz response set with all the critical fields
const simulatedProfile: UserProfile = {
  id: 'test-complete',
  created_at: new Date(),
  onboarding_completed: true,

  // Primary focus from primary_motivation
  primary_focus: 'effectiveness',

  // Goals from _specifics and _why questions (properly mapped)
  goals: [
    'improve_sleep',
    'sleep_quality',
    'improve_energy',
    'improve_mood',
    'stress_coping_plan',
    'stress_reset_routine',
    'stress_eating',
    'mindset_shift'
  ],

  // CRITICAL FIELD 1: Allergies (for allergen filtering)
  allergies: ['nuts', 'dairy'],
  medical_conditions: ['nut_allergy', 'lactose_intolerance'],

  // CRITICAL FIELD 2: Preferences from things_you_love (30% scoring weight)
  preferences: [
    'walking',
    'dancing',
    'podcasts_audiobooks',
    'nature_outdoors',
    'coffee_shops'
  ],

  // CRITICAL FIELD 3: Specific challenges from barriers_ questions (20% scoring weight)
  specific_challenges: {
    effectiveness: ['no_time', 'too_tired', 'overwhelming'],
    nutrition: ['hate_veggies', 'love_sweets'],
    fitness: ['hate_gym', 'no_motivation']
  },

  // CRITICAL FIELD 4: Avoid approaches from what_to_avoid_ questions (penalties in scoring)
  avoid_approaches: [
    'gym',
    'meal_prep',
    'counting',
    'morning_routine',
    'meditation',
    'rigid_rules'
  ],

  // Other fields
  quiz_goals: ['better_sleep', 'better_energy', 'manage_stress'],
  constraints: [],
  lifestyle: {},
  health_conditions: []
};

console.log('📋 SIMULATED PROFILE:');
console.log('Primary Focus:', simulatedProfile.primary_focus);
console.log('Goals:', simulatedProfile.goals.length, 'total');
console.log('Allergies:', simulatedProfile.allergies);
console.log('Preferences:', simulatedProfile.preferences);
console.log('Specific Challenges:', Object.keys(simulatedProfile.specific_challenges).map(k =>
  `${k}: ${simulatedProfile.specific_challenges[k].length} items`
));
console.log('Avoid Approaches:', simulatedProfile.avoid_approaches.length, 'items');

console.log('\n🔍 TESTING RECOMMENDATION ENGINE WITH COMPLETE PROFILE...\n');

// Test the recommendation engine with the complete profile
async function testRecommendations() {
  const recommendations = await tipRecommendationService.recommendTips(
    simulatedProfile,
    [],  // No previous tips
    [],  // No attempts
    new Date(),
    false  // Not relaxed mode
  );

  console.log('📊 RECOMMENDATION RESULTS:');
  console.log(`Found ${recommendations.length} eligible tips\n`);

  // Check if allergen filtering is working
  const nutsInTips = recommendations.filter(r =>
    r.tip.involves?.some(food => food.toLowerCase().includes('nut') || food.toLowerCase().includes('almond'))
  );

  const dairyInTips = recommendations.filter(r =>
    r.tip.involves?.some(food =>
      food.toLowerCase().includes('dairy') ||
      food.toLowerCase().includes('milk') ||
      food.toLowerCase().includes('cheese') ||
      food.toLowerCase().includes('yogurt')
    )
  );

  console.log('🥜 ALLERGEN FILTERING:');
  if (nutsInTips.length > 0) {
    console.error(`❌ FAILURE: Found ${nutsInTips.length} tips with nuts despite allergy!`);
    nutsInTips.slice(0, 2).forEach(t => console.log(`  - ${t.tip.summary}`));
  } else {
    console.log('✅ SUCCESS: No tips with nuts (allergen filtering working)');
  }

  if (dairyInTips.length > 0) {
    console.error(`❌ FAILURE: Found ${dairyInTips.length} tips with dairy despite allergy!`);
    dairyInTips.slice(0, 2).forEach(t => console.log(`  - ${t.tip.summary}`));
  } else {
    console.log('✅ SUCCESS: No tips with dairy (allergen filtering working)');
  }

  // Check if preferences are being scored
  console.log('\n💚 PREFERENCE MATCHING (30% weight):');
  const top5 = recommendations.slice(0, 5);
  top5.forEach((rec, i) => {
    const debugInfo = rec._debugInfo;
    if (debugInfo?.matchedPreferences && debugInfo.matchedPreferences.length > 0) {
      console.log(`Tip ${i+1}: Matched preferences: ${debugInfo.matchedPreferences.join(', ')}`);
    }
  });

  const hasPreferenceMatches = top5.some(r => r._debugInfo?.matchedPreferences?.length > 0);
  if (!hasPreferenceMatches) {
    console.warn('⚠️ WARNING: No preference matches in top 5 tips (30% weight unused)');
  }

  // Check if blockers are being addressed
  console.log('\n🚧 BLOCKER ADDRESSING (20% weight):');
  top5.forEach((rec, i) => {
    const debugInfo = rec._debugInfo;
    if (debugInfo?.addressedBlockers && debugInfo.addressedBlockers.length > 0) {
      console.log(`Tip ${i+1}: Addresses: ${debugInfo.addressedBlockers.join(', ')}`);
    }
  });

  const hasBlockerAddressing = top5.some(r => r._debugInfo?.addressedBlockers?.length > 0);
  if (!hasBlockerAddressing) {
    console.warn('⚠️ WARNING: No blockers addressed in top 5 tips (20% weight unused)');
  }

  // Check if avoidance is working
  console.log('\n🚫 AVOIDANCE PENALTIES:');
  const gymTips = recommendations.filter(r => r.tip.where?.includes('gym'));
  const mealPrepTips = recommendations.filter(r =>
    r.tip.features?.includes('meal_prep') || r.tip.mechanisms?.includes('planning_ahead')
  );

  if (gymTips.length > 0) {
    console.warn(`⚠️ Found ${gymTips.length} gym tips despite avoidance (should be penalized)`);
  } else {
    console.log('✅ No gym tips in recommendations');
  }

  if (mealPrepTips.length > 0) {
    console.warn(`⚠️ Found ${mealPrepTips.length} meal prep tips despite avoidance (should be penalized)`);
  } else {
    console.log('✅ No meal prep tips in recommendations');
  }

  // Show top 3 recommendations with scores
  console.log('\n🏆 TOP 3 RECOMMENDATIONS:');
  recommendations.slice(0, 3).forEach((rec, i) => {
    console.log(`\n${i+1}. ${rec.tip.summary}`);
    console.log(`   Score: ${rec.score}`);
    console.log(`   Goal Matches: ${rec._goalMatches}`);
    if (rec._debugInfo) {
      const d = rec._debugInfo;
      if (d.matchedPreferences?.length > 0) {
        console.log(`   Matched Preferences: ${d.matchedPreferences.join(', ')}`);
      }
      if (d.addressedBlockers?.length > 0) {
        console.log(`   Addresses Blockers: ${d.addressedBlockers.join(', ')}`);
      }
      if (d.avoidedItems?.length > 0) {
        console.log(`   ⚠️ Violates Avoidance: ${d.avoidedItems.join(', ')}`);
      }
    }
  });

  // Final summary
  console.log('\n📈 SUMMARY:');
  const allergenSafe = nutsInTips.length === 0 && dairyInTips.length === 0;
  const usesPreferences = hasPreferenceMatches;
  const addressesBlockers = hasBlockerAddressing;
  const respectsAvoidance = gymTips.length === 0 && mealPrepTips.length === 0;

  const allGood = allergenSafe && usesPreferences && addressesBlockers && respectsAvoidance;

  if (allGood) {
    console.log('✅ ALL PROFILE FIELDS ARE BEING USED CORRECTLY!');
  } else {
    console.log('❌ Some profile fields are not being used properly:');
    if (!allergenSafe) console.log('  - Allergen filtering not working');
    if (!usesPreferences) console.log('  - Preferences not being matched (30% weight lost)');
    if (!addressesBlockers) console.log('  - Blockers not being addressed (20% weight lost)');
    if (!respectsAvoidance) console.log('  - Avoidance preferences not being respected');
  }
}

// Run the test
testRecommendations().catch(console.error);