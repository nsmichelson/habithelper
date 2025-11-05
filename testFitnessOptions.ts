// Test fitness dynamic options
import { getDynamicOptions } from './data/dynamicOptionMappings';

console.log('=== TEST: Fitness Path - Weight Loss & Muscle Building ===\n');

// Simulate the user's path: Fitness → Weight loss + Build muscle → Selecting why reasons
const fitnessResponses = [
  { questionId: 'primary_motivation', values: ['fitness'] },
  { questionId: 'fitness_specifics', values: ['exercise_lose_weight', 'build_strength'] }, // 2 goals
  { questionId: 'exercise_weight_loss_why', values: ['appearance', 'health', 'confidence'] },
  { questionId: 'build_strength_why', values: ['look_better', 'functional_strength', 'confidence'] }
];

const fitnessOptions = getDynamicOptions('what_worked_fitness', fitnessResponses);

console.log('Selected fitness goals:', fitnessResponses[1].values);
console.log('\nWhy reasons for weight loss:', fitnessResponses[2].values);
console.log('Why reasons for building strength:', fitnessResponses[3].values);

console.log('\n✅ Dynamic options for what_worked_fitness:');
fitnessOptions?.forEach(opt => {
  console.log(`  - ${opt.label}`);
});

// Check if any nutrition options are incorrectly appearing
const incorrectOptions = ['Success journaling', 'Self-compassion practice', 'Meal planning', 'Food journal'];
const foundIncorrect = fitnessOptions?.filter(opt =>
  incorrectOptions.some(bad => opt.label.includes(bad))
);

if (foundIncorrect && foundIncorrect.length > 0) {
  console.log('\n❌ ERROR: Found nutrition/other options that shouldn\'t be here:');
  foundIncorrect.forEach(opt => {
    console.log(`  - ${opt.label}`);
  });
} else {
  console.log('\n✅ No incorrect options found! All options are fitness-related.');
}

// Verify we have appropriate fitness options
const expectedTypes = ['progress photos', 'strength', 'HIIT', 'measurements', 'compound', 'trainer'];
const hasExpectedOptions = expectedTypes.some(type =>
  fitnessOptions?.some(opt => opt.label.toLowerCase().includes(type))
);

if (hasExpectedOptions) {
  console.log('✅ Has appropriate fitness-specific options');
} else {
  console.log('❌ Missing expected fitness options');
}