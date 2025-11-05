// Comprehensive audit of all quiz paths
import { QUIZ_QUESTIONS as quizQuestions, getConditionalQuestions } from './data/quizQuestions';

console.log('=== COMPREHENSIVE QUIZ PATH AUDIT ===\n');

// Find all _specifics questions (the goal selection questions)
const specificsQuestions = quizQuestions.filter(q => q.id.endsWith('_specifics'));

// Find all _why questions
const whyQuestions = quizQuestions.filter(q => q.id.endsWith('_why'));

// Find all what_worked questions
const whatWorkedQuestions = quizQuestions.filter(q => q.id.includes('what_worked'));

console.log('📊 QUIZ STRUCTURE OVERVIEW:');
console.log(`- Total questions: ${quizQuestions.length}`);
console.log(`- Specifics questions: ${specificsQuestions.length}`);
console.log(`- Why questions: ${whyQuestions.length}`);
console.log(`- What worked questions: ${whatWorkedQuestions.length}\n`);

// For each specifics question, check if all its options have corresponding why questions
console.log('🔍 CHECKING EACH PATH FOR COVERAGE:\n');

const gaps: string[] = [];
const covered: string[] = [];

specificsQuestions.forEach(specificsQ => {
  const pathName = specificsQ.id.replace('_specifics', '').toUpperCase();
  console.log(`\n━━━ ${pathName} PATH ━━━`);
  console.log(`Question: ${specificsQ.question}`);

  if (specificsQ.options) {
    console.log(`\nGoal options (${specificsQ.options.length} total):`);

    specificsQ.options.forEach(option => {
      // Check if there's a why question for this specific goal
      const hasDirectWhyQuestion = whyQuestions.some(whyQ => {
        if (whyQ.conditionalOn) {
          return whyQ.conditionalOn.questionId === specificsQ.id &&
                 whyQ.conditionalOn.values.includes(option.value);
        }
        return false;
      });

      // Check if there's a general why question for the category
      const hasGeneralWhyQuestion = whyQuestions.some(whyQ => {
        if (whyQ.conditionalOn) {
          return whyQ.conditionalOn.questionId === specificsQ.id &&
                 !whyQ.conditionalOn.values; // General question for all values
        }
        return false;
      });

      // Find the actual why question if it exists
      const whyQuestion = whyQuestions.find(whyQ => {
        if (whyQ.conditionalOn) {
          return whyQ.conditionalOn.questionId === specificsQ.id &&
                 (whyQ.conditionalOn.values?.includes(option.value) || !whyQ.conditionalOn.values);
        }
        return false;
      });

      const status = hasDirectWhyQuestion ? '✅' : (hasGeneralWhyQuestion ? '🔶' : '❌');
      const whyId = whyQuestion ? ` → ${whyQuestion.id}` : '';

      console.log(`  ${status} ${option.value}: "${option.label}"${whyId}`);

      if (!hasDirectWhyQuestion && !hasGeneralWhyQuestion) {
        gaps.push(`${pathName}: ${option.value} - "${option.label}"`);
      } else {
        covered.push(`${pathName}: ${option.value}`);
      }
    });
  }
});

// Check for orphaned why questions (why questions without matching specifics)
console.log('\n\n🔍 CHECKING FOR ORPHANED WHY QUESTIONS:\n');
whyQuestions.forEach(whyQ => {
  if (whyQ.conditionalOn) {
    const parentQuestion = quizQuestions.find(q => q.id === whyQ.conditionalOn?.questionId);
    if (!parentQuestion) {
      console.log(`❌ Orphaned: ${whyQ.id} depends on non-existent ${whyQ.conditionalOn.questionId}`);
    }
  }
});

// Summary
console.log('\n\n📋 SUMMARY REPORT:');
console.log('━━━━━━━━━━━━━━━━━');
console.log(`\n✅ Covered paths: ${covered.length}`);
console.log(`❌ Missing why questions: ${gaps.length}`);

if (gaps.length > 0) {
  console.log('\n⚠️  GAPS THAT NEED ATTENTION:');
  gaps.forEach(gap => {
    console.log(`  - ${gap}`);
  });
}

// Check what_worked questions
console.log('\n\n🔍 CHECKING WHAT_WORKED QUESTIONS:\n');
whatWorkedQuestions.forEach(wwQ => {
  console.log(`📝 ${wwQ.id}`);
  console.log(`   Question: "${wwQ.question}"`);
  console.log(`   Dynamic options: ${wwQ.dynamicOptions ? '✅ Yes' : '❌ No'}`);

  if (wwQ.conditionalOn) {
    console.log(`   Conditional on: ${wwQ.conditionalOn.questionId}`);
    if (wwQ.conditionalOn.values) {
      console.log(`   Values: ${wwQ.conditionalOn.values.join(', ')}`);
    }
  }
  console.log('');
});

// Legend
console.log('\n📖 LEGEND:');
console.log('✅ = Has specific why question');
console.log('🔶 = Covered by general why question');
console.log('❌ = Missing why question');