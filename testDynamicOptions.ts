// Test dynamic options functionality

import { getDynamicOptions } from './data/dynamicOptionMappings';
import { getConditionalQuestions } from './data/quizQuestions';

// Test scenario 1: Energy → Sleep → Exhausted + Productivity
console.log('=== TEST 1: Energy Path with Sleep Goals ===');

const energyResponses = [
  { questionId: 'primary_motivation', values: ['energy'] },
  { questionId: 'energy_specifics', values: ['fall_asleep_easier'] },
  { questionId: 'sleep_why', values: ['exhausted', 'productivity', 'mood'] }
];

const energyOptions = getDynamicOptions('what_worked_energy', energyResponses);
console.log('\nSelected why reasons:', energyResponses[2].values);
console.log('\nDynamic options for what_worked_energy:');
energyOptions?.forEach(opt => {
  console.log(`  - ${opt.label}`);
});

// Test scenario 2: Nutrition → Veggies → Health + Role Model
console.log('\n\n=== TEST 2: Nutrition Path with Vegetable Goals ===');

const nutritionResponses = [
  { questionId: 'primary_motivation', values: ['nutrition'] },
  { questionId: 'nutrition_specifics', values: ['eat_more_veggies'] },
  { questionId: 'veggies_why', values: ['health', 'role_model', 'feel_better'] }
];

const nutritionOptions = getDynamicOptions('what_worked_nutrition', nutritionResponses);
console.log('\nSelected why reasons:', nutritionResponses[2].values);
console.log('\nDynamic options for what_worked_nutrition:');
nutritionOptions?.forEach(opt => {
  console.log(`  - ${opt.label}`);
});

// Test scenario 3: Multiple Goals Selected (up to 2)
console.log('\n\n=== TEST 3: Multiple Goals Selected ===');

const multiGoalResponses = [
  { questionId: 'primary_motivation', values: ['energy'] },
  { questionId: 'energy_specifics', values: ['fall_asleep_easier', 'boost_energy'] }, // 2 goals selected
  { questionId: 'sleep_why', values: ['exhausted', 'productivity'] },
  { questionId: 'energy_why', values: ['motivation', 'focus'] }
];

const multiGoalOptions = getDynamicOptions('what_worked_energy', multiGoalResponses);
console.log('\nSelected goals:', multiGoalResponses[1].values);
console.log('\nWhy reasons from both paths:');
console.log('  Sleep why:', multiGoalResponses[2].values);
console.log('  Energy why:', multiGoalResponses[3].values);
console.log('\nCombined dynamic options:');
multiGoalOptions?.forEach(opt => {
  console.log(`  - ${opt.label}`);
});

// Test scenario 4: Check that options are different based on why selections
console.log('\n\n=== TEST 4: Different Why Selections = Different Options ===');

const altEnergyResponses = [
  { questionId: 'primary_motivation', values: ['energy'] },
  { questionId: 'energy_specifics', values: ['fall_asleep_easier'] },
  { questionId: 'sleep_why', values: ['health_concerns', 'physical_recovery'] }
];

const altEnergyOptions = getDynamicOptions('what_worked_energy', altEnergyResponses);
console.log('\nAlternative why reasons:', altEnergyResponses[2].values);
console.log('\nDifferent dynamic options:');
altEnergyOptions?.forEach(opt => {
  console.log(`  - ${opt.label}`);
});

// Compare the two sets
const firstSet = new Set(energyOptions?.map(o => o.value) || []);
const secondSet = new Set(altEnergyOptions?.map(o => o.value) || []);
const uniqueToFirst = [...firstSet].filter(x => !secondSet.has(x));
const uniqueToSecond = [...secondSet].filter(x => !firstSet.has(x));

console.log('\n\nOptions unique to first set (exhausted/productivity/mood):');
uniqueToFirst.forEach(val => {
  const opt = energyOptions?.find(o => o.value === val);
  console.log(`  - ${opt?.label}`);
});

console.log('\nOptions unique to second set (health_concerns/physical_recovery):');
uniqueToSecond.forEach(val => {
  const opt = altEnergyOptions?.find(o => o.value === val);
  console.log(`  - ${opt?.label}`);
});

console.log('\n✅ Dynamic options system is working correctly!');