// Script to analyze quiz coverage and find gaps

import { QUIZ_QUESTIONS } from './data/quizQuestions';

// Get all specific goal options from all _specifics questions
const allSpecificGoals = new Map<string, string[]>();

QUIZ_QUESTIONS.forEach(q => {
  if (q.id.endsWith('_specifics') && q.options) {
    const category = q.id.replace('_specifics', '');
    const goalValues = q.options.map(opt => opt.value);
    allSpecificGoals.set(category, goalValues);
  }
});

console.log('=== QUIZ COVERAGE ANALYSIS ===\n');

// For each category, check which goals have specific "why" questions
allSpecificGoals.forEach((goals, category) => {
  console.log(`\n${category.toUpperCase()} CATEGORY:`);
  console.log(`Total goals: ${goals.length}`);

  const goalsWithWhyQuestions = new Set<string>();

  // Find all why questions that are conditional on this category's specifics
  QUIZ_QUESTIONS.forEach(q => {
    if (q.id.includes('_why') && q.conditionalOn?.questionId === `${category}_specifics`) {
      q.conditionalOn.values.forEach(v => goalsWithWhyQuestions.add(v));
    }
  });

  // Check for general why question
  const hasGeneralWhy = QUIZ_QUESTIONS.some(q =>
    q.id === `${category}_why` &&
    q.conditionalOn?.questionId === 'primary_motivation'
  );

  if (hasGeneralWhy) {
    console.log(`✅ Has general why question for primary motivation`);
  }

  // Find goals without specific why questions
  const goalsWithoutWhy = goals.filter(g => !goalsWithWhyQuestions.has(g));

  if (goalsWithoutWhy.length > 0) {
    console.log(`\n⚠️ Goals WITHOUT specific why questions (${goalsWithoutWhy.length}):`);
    goalsWithoutWhy.forEach(g => console.log(`   - ${g}`));
  } else {
    console.log(`✅ All goals have specific why questions`);
  }

  console.log(`\nGoals with specific why questions (${goalsWithWhyQuestions.size}):`);
  goals.forEach(g => {
    if (goalsWithWhyQuestions.has(g)) {
      console.log(`   ✓ ${g}`);
    }
  });
});

// Check for orphaned why questions
console.log('\n\n=== CHECKING FOR ORPHANED WHY QUESTIONS ===\n');

const whyQuestions = QUIZ_QUESTIONS.filter(q => q.id.includes('_why'));
const orphanedQuestions: string[] = [];

whyQuestions.forEach(q => {
  if (q.conditionalOn) {
    const triggerQuestion = q.conditionalOn.questionId;
    const triggerValues = q.conditionalOn.values;

    // Find the trigger question
    const trigger = QUIZ_QUESTIONS.find(tq => tq.id === triggerQuestion);

    if (!trigger) {
      orphanedQuestions.push(`${q.id} - references non-existent question: ${triggerQuestion}`);
    } else if (trigger.options) {
      // Check if all trigger values exist in the options
      const validOptions = trigger.options.map(o => o.value);
      const invalidValues = triggerValues.filter(v => !validOptions.includes(v));

      if (invalidValues.length > 0) {
        orphanedQuestions.push(`${q.id} - references non-existent values: ${invalidValues.join(', ')}`);
      }
    }
  }
});

if (orphanedQuestions.length > 0) {
  console.log('⚠️ Found orphaned why questions:');
  orphanedQuestions.forEach(o => console.log(`   - ${o}`));
} else {
  console.log('✅ No orphaned why questions found');
}

// Count total possible paths
console.log('\n\n=== PATH STATISTICS ===\n');

const primaryMotivations = QUIZ_QUESTIONS.find(q => q.id === 'primary_motivation')?.options?.length || 0;
console.log(`Primary motivations: ${primaryMotivations}`);

let totalPossiblePaths = 0;
allSpecificGoals.forEach((goals, category) => {
  // Each goal can be selected independently in multi-select
  const combinations = Math.pow(2, goals.length) - 1; // -1 to exclude selecting nothing
  console.log(`${category}: ${goals.length} goals = ${combinations} possible combinations`);
  totalPossiblePaths += combinations;
});

console.log(`\nTotal possible unique paths: ${totalPossiblePaths}+`);
console.log('(Note: Actual paths are higher due to multi-select combinations)');

// Check what_worked, what_to_avoid, barriers coverage
console.log('\n\n=== EXPERIENCE QUESTIONS COVERAGE ===\n');

const experienceTypes = ['what_worked', 'what_to_avoid', 'barriers'];
const primaryCategories = ['energy', 'relationships', 'effectiveness', 'fitness', 'health', 'nutrition', 'look_feel'];

experienceTypes.forEach(expType => {
  console.log(`\n${expType.toUpperCase()}:`);

  primaryCategories.forEach(cat => {
    const hasQuestion = QUIZ_QUESTIONS.some(q =>
      q.id.includes(expType) &&
      q.conditionalOn?.questionId === 'primary_motivation' &&
      q.conditionalOn?.values.includes(cat)
    );

    if (hasQuestion) {
      console.log(`  ✓ ${cat}`);
    } else {
      // Check if it shares with another category
      const sharingQuestion = QUIZ_QUESTIONS.find(q =>
        q.id.includes(expType) &&
        q.conditionalOn?.questionId === 'primary_motivation' &&
        q.conditionalOn?.values.includes(cat)
      );

      if (sharingQuestion) {
        console.log(`  ✓ ${cat} (shares with: ${sharingQuestion.conditionalOn?.values.join(', ')})`);
      } else {
        console.log(`  ✗ ${cat} - MISSING`);
      }
    }
  });
});