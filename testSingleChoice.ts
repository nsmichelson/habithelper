// Test that conditional logic works with single choice

import { QUIZ_QUESTIONS, getConditionalQuestions } from './data/quizQuestions';

// Simulate user selecting relationships -> improve_communication (now single choice)
const responses = [
  { questionId: 'primary_motivation', values: ['relationships'] },
  { questionId: 'relationship_specifics', values: ['improve_communication'] }  // Single value in array
];

console.log('Testing single choice with responses:', JSON.stringify(responses, null, 2));
console.log('\n');

const availableQuestions = getConditionalQuestions(responses);

// Check that we still get the right conditional questions
const expectedQuestions = [
  'primary_motivation',
  'relationship_specifics',
  'relationship_why',
  'communication_why',
  // Should also have experience questions
];

console.log('Questions that should appear:');
availableQuestions.forEach((q, i) => {
  console.log(`${i + 1}. ${q.id}: ${q.question}`);
});

// Verify the right "why" questions appear
const whyQuestions = availableQuestions.filter(q => q.id.includes('_why'));
console.log('\n"Why" questions found:', whyQuestions.map(q => q.id));

// Test with nutrition path
console.log('\n\n=== Testing Nutrition Path ===');
const nutritionResponses = [
  { questionId: 'primary_motivation', values: ['nutrition'] },
  { questionId: 'nutrition_specifics', values: ['eat_more_veggies'] }  // Single choice
];

const nutritionQuestions = getConditionalQuestions(nutritionResponses);
const nutritionWhy = nutritionQuestions.filter(q => q.id.includes('_why'));
console.log('"Why" questions for vegetables:', nutritionWhy.map(q => q.id));

// Verify single choice doesn't break multi-value conditionals
const veggyWhy = QUIZ_QUESTIONS.find(q => q.id === 'veggies_why');
console.log('\nVeggies why question triggers on:', veggyWhy?.conditionalOn?.values);
console.log('User selected:', nutritionResponses[1].values);
console.log('Should trigger?', veggyWhy?.conditionalOn?.values.includes('eat_more_veggies'));