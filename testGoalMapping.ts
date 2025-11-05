// Test that goals are properly mapped from quiz responses
import { getTipGoalsForQuizGoals } from './data/goalMappings';

console.log('=== TEST: Goal Mapping from Quiz Responses ===\n');

// Simulate quiz responses for someone taking the effectiveness path
const testResponses = [
  { questionId: 'primary_motivation', values: ['effectiveness'] },
  { questionId: 'effectiveness_specifics', values: ['better_sleep', 'better_energy', 'manage_stress'] },
  { questionId: 'effectiveness_sleep_why', values: ['energy', 'mood', 'health'] },
  { questionId: 'effectiveness_energy_why', values: ['productivity', 'exercise', 'mood'] },
  { questionId: 'effectiveness_stress_why', values: ['eating_habits', 'sleep', 'relationships'] }
];

console.log('📝 Quiz Responses:');
testResponses.forEach(r => {
  console.log(`  ${r.questionId}: ${r.values.join(', ')}`);
});

console.log('\n🔄 Processing goal mappings...\n');

// Process each response type
const allGoals = new Set<string>();

testResponses.forEach(response => {
  if (response.questionId.includes('_specifics')) {
    console.log(`\nProcessing ${response.questionId}:`);
    console.log('  Input values:', response.values);

    const mappedGoals = getTipGoalsForQuizGoals(response.values);
    console.log('  Mapped to tip goals:', mappedGoals);

    mappedGoals.forEach(goal => allGoals.add(goal));
  }

  if (response.questionId.includes('_why')) {
    console.log(`\nProcessing ${response.questionId}:`);
    console.log('  Input values:', response.values);

    const mappedGoals = getTipGoalsForQuizGoals(response.values);
    console.log('  Mapped to tip goals:', mappedGoals);

    mappedGoals.forEach(goal => allGoals.add(goal));
  }
});

console.log('\n📊 FINAL GOALS COLLECTION:');
console.log('  Unique goals:', Array.from(allGoals));
console.log('  Total count:', allGoals.size);

if (allGoals.size === 0) {
  console.log('\n❌ ERROR: No goals were mapped! Profile would have empty goals array.');
} else {
  console.log('\n✅ SUCCESS: Goals were properly mapped. Profile will have', allGoals.size, 'goals for tip filtering.');
}

// Check if specific expected goals are present
const expectedGoals = ['improve_sleep', 'improve_energy', 'stress_management'];
const missingGoals = expectedGoals.filter(g => !allGoals.has(g));

if (missingGoals.length > 0) {
  console.log('\n⚠️ WARNING: Some expected goals are missing:', missingGoals);
} else {
  console.log('✅ All expected core goals are present');
}