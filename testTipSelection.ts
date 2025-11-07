// Test that tips are correctly matched to user goals
import { tipRecommendationService } from './services/tipRecommendation';
import { UserProfile } from './types/tip';

console.log('=== TEST: Tip Selection Based on User Goals ===\n');

// Simulate the user from the quiz log:
// Primary motivation: effectiveness
// Specific goals: improve_sleep, sleep_quality, improve_energy, stress_coping_plan, stress_eating, mindset_shift
const testProfile: UserProfile = {
  id: 'test-1',
  created_at: new Date(),
  onboarding_completed: true,

  // Set from primary_motivation
  primary_focus: 'effectiveness',

  // Goals from the quiz (now properly mapped from better_sleep, better_energy, manage_stress)
  goals: [
    'improve_sleep',
    'sleep_quality',
    'improve_energy',
    'improve_mood',
    'stress_coping_plan',
    'stress_reset_routine',
    'stress_distraction_tool',
    'stress_eating',
    'mindset_shift'
  ],

  // Original quiz goals for reference
  quiz_goals: [
    'better_sleep',
    'better_energy',
    'manage_stress'
  ],

  medical_conditions: [],
  preferences: [],
  constraints: [],
  lifestyle: {},
  health_conditions: []
};

console.log('User Profile:');
console.log('  Primary Focus:', testProfile.primary_focus);
console.log('  Goals:', testProfile.goals.join(', '));

// Run the test
async function runTest() {
  // Get recommendations
  const recommendations = await tipRecommendationService.recommendTips(
    testProfile,
    [],  // No previous tips
    [],  // No attempts
    new Date(),
    false  // Not relaxed mode
  );

  console.log('\n📊 Top 5 Recommended Tips:\n');

  recommendations.slice(0, 5).forEach((rec, index) => {
    console.log(`${index + 1}. ${rec.tip.summary}`);
    console.log(`   Area: ${rec.tip.area}`);
    console.log(`   Tip Goals: ${rec.tip.goals.join(', ')}`);
    console.log(`   Score: ${rec.score}`);
    console.log(`   Goal Matches: ${rec._goalMatches}`);

    // Check if any goals match
    const matchingGoals = rec.tip.goals.filter(g => testProfile.goals.includes(g));
    if (matchingGoals.length > 0) {
      console.log(`   ✅ Matching Goals: ${matchingGoals.join(', ')}`);
    } else {
      console.log(`   ❌ NO MATCHING GOALS - THIS SHOULD NOT BE RECOMMENDED!`);
    }
    console.log('');
  });

  // Check for the problematic ginger chews tip
  const gingerTip = recommendations.find(r => r.tip.summary.toLowerCase().includes('ginger'));
  if (gingerTip) {
    console.log('⚠️  WARNING: Ginger chews tip found in recommendations!');
    console.log(`   Position: ${recommendations.indexOf(gingerTip) + 1}`);
    console.log(`   Score: ${gingerTip.score}`);
    console.log(`   Tip goals: ${gingerTip.tip.goals.join(', ')}`);
    console.log(`   User goals: ${testProfile.goals.join(', ')}`);
    console.log('   This tip should NOT be recommended for sleep/energy/stress goals!\n');
  } else {
    console.log('✅ Good news: Ginger chews tip NOT in recommendations (as expected)\n');
  }

  // Summary
  const allHaveGoalMatches = recommendations.slice(0, 5).every(rec => {
    const matchingGoals = rec.tip.goals.filter(g => testProfile.goals.includes(g));
    return matchingGoals.length > 0;
  });

  if (allHaveGoalMatches) {
    console.log('✅ SUCCESS: All top 5 recommendations have matching goals!');
  } else {
    console.log('❌ FAILURE: Some recommendations do not match user goals!');
  }
}

// Run the test
runTest().catch(console.error);