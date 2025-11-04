// Test script to debug the conditional logic issue

const { QUIZ_QUESTIONS, getConditionalQuestions } = require('./data/quizQuestions');

// Simulate user selecting relationships -> communicate better
const responses = [
  { questionId: 'primary_motivation', values: ['relationships'] },
  { questionId: 'relationship_specifics', values: ['improve_communication'] }
];

console.log('Testing with responses:', JSON.stringify(responses, null, 2));
console.log('\n');

const availableQuestions = getConditionalQuestions(responses);

// Find any sleep-related questions
const sleepQuestions = availableQuestions.filter(q =>
  q.question.toLowerCase().includes('sleep') ||
  q.id.includes('sleep')
);

if (sleepQuestions.length > 0) {
  console.log('WARNING: Found sleep-related questions when they should not appear:');
  sleepQuestions.forEach(q => {
    console.log(`  - ID: ${q.id}`);
    console.log(`    Question: ${q.question}`);
    console.log(`    ConditionalOn:`, q.conditionalOn);
  });
} else {
  console.log('✓ No sleep questions found (correct)');
}

console.log('\n');

// Show what "why" questions ARE included
const whyQuestions = availableQuestions.filter(q => q.id.includes('why'));
console.log(`Found ${whyQuestions.length} "why" questions:`);
whyQuestions.forEach(q => {
  console.log(`  - ${q.id}: ${q.question}`);
  if (q.conditionalOn) {
    console.log(`    Conditional on: ${q.conditionalOn.questionId} = ${q.conditionalOn.values.join(', ')}`);
  }
});