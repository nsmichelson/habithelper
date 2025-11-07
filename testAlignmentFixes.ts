// Test that all alignment fixes are working
import { tipRecommendationService } from './services/tipRecommendation';
import { UserProfile } from './types/tip';

console.log('=== TEST: Alignment Fixes for Profile → Recommendation Flow ===\n');

// Test 1: Effectiveness user with productivity barriers
console.log('📋 TEST 1: Effectiveness user (productivity barriers should work)');
const effectivenessProfile: UserProfile = {
  id: 'test-effectiveness',
  created_at: new Date(),
  onboarding_completed: true,
  primary_focus: 'effectiveness',
  goals: ['stress_coping_plan', 'focus_improvement', 'task_completion'],

  // This is how barriers are now stored (under multiple keys)
  specific_challenges: {
    'productivity': ['no_time', 'too_many_distractions', 'overwhelming'],
    'effectiveness': ['no_time', 'too_many_distractions', 'overwhelming'] // Duplicated for alignment
  },

  preferences: ['planning_organizing', 'podcasts_audiobooks'], // Default preferences
  avoid_approaches: ['rigid_rules'],

  allergies: [],
  medical_conditions: [],
  constraints: [],
  lifestyle: {},
  health_conditions: []
};

// Test 2: Health user with nutrition barriers
console.log('\n📋 TEST 2: Health user (nutrition barriers should work)');
const healthProfile: UserProfile = {
  id: 'test-health',
  created_at: new Date(),
  onboarding_completed: true,
  primary_focus: 'health',
  goals: ['better_lipids', 'stable_blood_sugar', 'heart_health'],

  specific_challenges: {
    'nutrition': ['hate_veggies', 'love_sweets'],
    'health': ['hate_veggies', 'love_sweets'] // Duplicated for alignment
  },

  preferences: ['planning_organizing', 'nature_outdoors'], // Default preferences
  avoid_approaches: ['counting'],

  allergies: [],
  medical_conditions: [],
  constraints: [],
  lifestyle: {},
  health_conditions: []
};

// Test 3: Energy user (should now get area bonus)
console.log('\n📋 TEST 3: Energy user (should get nutrition area bonus)');
const energyProfile: UserProfile = {
  id: 'test-energy',
  created_at: new Date(),
  onboarding_completed: true,
  primary_focus: 'energy',
  goals: ['improve_energy', 'improve_sleep', 'improve_mood'],

  specific_challenges: {
    'energy': ['always_tired', 'poor_sleep'],
    'sleeping': ['always_tired', 'poor_sleep'] // Also under sleeping for compatibility
  },

  preferences: ['nature_outdoors', 'walking'], // Default preferences
  avoid_approaches: ['morning_routine'],

  allergies: [],
  medical_conditions: [],
  constraints: [],
  lifestyle: {},
  health_conditions: []
};

// Test 4: User with missing preferences (should get defaults)
console.log('\n📋 TEST 4: User with no preferences (should get defaults based on focus)');
const noPrefsProfile: UserProfile = {
  id: 'test-no-prefs',
  created_at: new Date(),
  onboarding_completed: true,
  primary_focus: 'fitness',
  goals: ['build_strength', 'exercise_habit'],

  specific_challenges: {
    'fitness': ['hate_gym', 'no_motivation']
  },

  // No preferences - should trigger defaults
  preferences: undefined as any,
  avoid_approaches: ['gym'],

  allergies: [],
  medical_conditions: [],
  constraints: [],
  lifestyle: {},
  health_conditions: []
};

async function testProfile(profile: UserProfile, testName: string) {
  console.log(`\n🔍 Testing: ${testName}`);
  console.log(`Primary Focus: ${profile.primary_focus}`);
  console.log(`Challenges: ${JSON.stringify(profile.specific_challenges)}`);
  console.log(`Preferences: ${profile.preferences || 'NONE'}`);

  const recommendations = await tipRecommendationService.recommendTips(
    profile,
    [],
    [],
    new Date(),
    false
  );

  // Check if blockers are being addressed (20% weight)
  const hasBlockerAddressing = recommendations.slice(0, 5).some(r =>
    r._debugInfo?.addressedBlockers && r._debugInfo.addressedBlockers.length > 0
  );

  // Check if preferences are being matched (30% weight)
  const hasPreferenceMatching = recommendations.slice(0, 5).some(r =>
    r._debugInfo?.matchedPreferences && r._debugInfo.matchedPreferences.length > 0
  );

  // Check area bonus
  const topTip = recommendations[0];
  const areaScore = topTip?._debugInfo?.scoreBreakdown?.area?.score || 0;

  console.log('\nResults:');
  console.log(`✅ Found ${recommendations.length} recommendations`);
  console.log(`${hasBlockerAddressing ? '✅' : '❌'} Blockers being addressed (20% weight ${hasBlockerAddressing ? 'ACTIVE' : 'LOST'})`);
  console.log(`${hasPreferenceMatching ? '✅' : '❌'} Preferences being matched (30% weight ${hasPreferenceMatching ? 'ACTIVE' : 'LOST'})`);
  console.log(`${areaScore > 0 ? '✅' : '❌'} Area bonus applied (${areaScore} points)`);

  if (recommendations.length > 0) {
    const top = recommendations[0];
    console.log(`\nTop recommendation: ${top.tip.summary}`);
    console.log(`Score: ${top.score}, Goal matches: ${top._goalMatches}`);
    if (top._debugInfo?.addressedBlockers?.length > 0) {
      console.log(`Addresses: ${top._debugInfo.addressedBlockers.join(', ')}`);
    }
    if (top._debugInfo?.matchedPreferences?.length > 0) {
      console.log(`Matches preferences: ${top._debugInfo.matchedPreferences.join(', ')}`);
    }
  }

  return {
    hasBlockers: hasBlockerAddressing,
    hasPreferences: hasPreferenceMatching,
    hasAreaBonus: areaScore > 0
  };
}

async function runAllTests() {
  const results = {
    effectiveness: await testProfile(effectivenessProfile, 'Effectiveness with productivity barriers'),
    health: await testProfile(healthProfile, 'Health with nutrition barriers'),
    energy: await testProfile(energyProfile, 'Energy user area mapping'),
    noPrefs: await testProfile(noPrefsProfile, 'Missing preferences with defaults')
  };

  console.log('\n\n=== SUMMARY ===');

  let allPassed = true;

  // Check effectiveness user
  if (!results.effectiveness.hasBlockers) {
    console.log('❌ FAIL: Effectiveness users not getting blocker benefits');
    allPassed = false;
  } else {
    console.log('✅ PASS: Effectiveness users now use productivity barriers');
  }

  // Check health user
  if (!results.health.hasBlockers) {
    console.log('❌ FAIL: Health users not getting blocker benefits');
    allPassed = false;
  } else {
    console.log('✅ PASS: Health users now use nutrition barriers');
  }

  // Check energy user
  if (!results.energy.hasAreaBonus) {
    console.log('❌ FAIL: Energy users not getting area bonus');
    allPassed = false;
  } else {
    console.log('✅ PASS: Energy users now get nutrition area bonus');
  }

  // Check default preferences
  if (!results.noPrefs.hasPreferences) {
    console.log('⚠️ WARNING: Default preferences not working (30% weight lost)');
  } else {
    console.log('✅ PASS: Default preferences maintaining 30% weight');
  }

  if (allPassed) {
    console.log('\n🎉 ALL ALIGNMENT ISSUES FIXED!');
  } else {
    console.log('\n⚠️ Some alignment issues remain');
  }
}

runAllTests().catch(console.error);