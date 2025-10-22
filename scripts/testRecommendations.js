/**
 * Script to test the recommendation algorithm with sample profiles
 * Run with: node scripts/testRecommendations.js
 */

// Import the test function
const { testRecommendationAlgorithm } = require('../services/testRecommendations');

async function runTests() {
  console.log('\n🚀 Starting Recommendation Algorithm Tests...\n');

  try {
    const results = await testRecommendationAlgorithm();

    console.log('\n📊 Summary:');
    console.log(`Tested ${Object.keys(results.profiles).length} different user profiles`);
    console.log('Each profile received personalized recommendations based on:');
    console.log('  - Activities they love');
    console.log('  - Specific challenges they face');
    console.log('  - Things they want to avoid');
    console.log('  - Their lifestyle context');

  } catch (error) {
    console.error('❌ Error running tests:', error);
  }
}

// Run the tests
runTests();