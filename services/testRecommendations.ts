/**
 * Test scenarios for the enhanced recommendation algorithm
 * Shows how different user profiles get personalized recommendations
 */

import { TipRecommendationService } from './tipRecommendation';
import { UserProfile } from '../types/tip';

// Sample user profiles based on new quiz structure
const TEST_PROFILES = {
  // Profile 1: Restaurant lover who hates veggies
  sarahProfile: {
    primary_focus: 'eating',
    goals: ['more_veggies', 'less_sugar'],
    preferences: ['restaurant_friends', 'coffee_shops', 'walking', 'podcasts_audiobooks'],
    specific_challenges: {
      eating: ['hate_veggies', 'love_sweets', 'social_events', 'no_time_cook']
    },
    avoid_approaches: ['meal_prep', 'counting', 'complex_recipes'],
    lifestyle: {
      chaos_level: 'flexible',
      life_role: 'professional'
    },
    success_vision: 'I want to enjoy eating healthier without feeling restricted',
    medical_conditions: [],
    allergies: []
  } as UserProfile,

  // Profile 2: Busy parent who wants to exercise
  mikeProfile: {
    primary_focus: 'exercise',
    goals: ['start_moving', 'energy', 'consistency'],
    preferences: ['playing_kids_pets', 'nature_outdoors', 'music_listening', 'spontaneous_adventures'],
    specific_challenges: {
      exercise: ['no_time', 'too_tired', 'hate_gym', 'no_childcare']
    },
    avoid_approaches: ['gym', 'long_workouts', 'morning_routine'],
    lifestyle: {
      chaos_level: 'total_chaos',
      life_role: 'parent_young'
    },
    success_vision: 'Feel energized and set a good example for my kids',
    medical_conditions: [],
    allergies: []
  } as UserProfile,

  // Profile 3: Night owl with sleep issues
  alexProfile: {
    primary_focus: 'sleeping',
    goals: ['fall_asleep', 'consistent_schedule', 'wake_refreshed'],
    preferences: ['reading', 'podcasts_audiobooks', 'games_video', 'cozy_comfort', 'solo_time'],
    specific_challenges: {
      sleeping: ['racing_mind', 'phone_addiction', 'revenge_bedtime', 'netflix_binge']
    },
    avoid_approaches: ['meditation', 'morning_routine', 'rigid_rules'],
    lifestyle: {
      chaos_level: 'mostly_routine',
      life_role: 'remote_worker'
    },
    success_vision: 'Actually feel rested and stop being exhausted all day',
    medical_conditions: [],
    allergies: []
  } as UserProfile,

  // Profile 4: Creative person with productivity issues
  jamieProfile: {
    primary_focus: 'productivity',
    goals: ['procrastination', 'finish_tasks', 'less_overwhelm'],
    preferences: ['creative_projects', 'music_listening', 'coffee_shops', 'spontaneous_adventures'],
    specific_challenges: {
      productivity: ['procrastination', 'perfectionism', 'distractions', 'overwhelming_tasks']
    },
    avoid_approaches: ['rigid_rules', 'detailed_tracking', 'morning_routine'],
    lifestyle: {
      chaos_level: 'unpredictable',
      life_role: 'entrepreneur'
    },
    success_vision: 'Actually finish my creative projects without the stress',
    medical_conditions: [],
    allergies: []
  } as UserProfile
};

/**
 * Expected high-scoring tips for each profile
 */
const EXPECTED_RECOMMENDATIONS = {
  sarah: [
    "Try veggie appetizers at your favorite restaurant with friends",
    "Walking coffee date followed by healthy breakfast",
    "Listen to nutrition podcasts during grocery shopping",
    "Order extra veggies when dining out - they're professionally prepared",
    "Sweet afternoon coffee drink as scheduled treat"
  ],

  mike: [
    "5-minute dance party with kids before dinner",
    "Nature scavenger hunt with family",
    "Playground workout while kids play",
    "Evening family walk with music",
    "Active games in backyard - no equipment needed"
  ],

  alex: [
    "Replace last episode with audiobook in bed",
    "Gaming curfew with wind-down playlist",
    "Cozy reading corner for phone-free time",
    "Sleep stories podcast instead of scrolling",
    "Reward good sleep with morning gaming time"
  ],

  jamie: [
    "Coffee shop creative sessions with timer",
    "Music playlists for different project phases",
    "Creative sprint challenges - beat the song",
    "Change locations when stuck",
    "Tiny task list - only 3 items allowed"
  ]
};

/**
 * Test function to run recommendations
 */
export async function testRecommendationAlgorithm() {
  const service = new TipRecommendationService();

  console.log('🧪 Testing Enhanced Recommendation Algorithm\n');
  console.log('=' .repeat(60));

  for (const [name, profile] of Object.entries(TEST_PROFILES)) {
    const displayName = name.replace('Profile', '');
    console.log(`\n👤 ${displayName.toUpperCase()}'S PROFILE:`);
    console.log(`   Focus: ${profile.primary_focus}`);
    console.log(`   Loves: ${profile.preferences?.slice(0, 3).join(', ')}...`);
    console.log(`   Challenges: ${profile.specific_challenges?.[profile.primary_focus]?.slice(0, 3).join(', ')}...`);
    console.log(`   Avoids: ${profile.avoid_approaches?.slice(0, 3).join(', ')}...`);

    // Get recommendations
    const recommendations = await service.recommendTips(
      profile,
      [], // No previous tips
      [], // No attempts
      new Date(),
      false // Not relaxed mode
    );

    console.log(`\n   TOP 5 RECOMMENDATIONS:`);

    recommendations.slice(0, 5).forEach((rec, i) => {
      console.log(`\n   ${i + 1}. ${rec.tip.summary}`);
      console.log(`      Score: ${rec.score.toFixed(1)}`);
      console.log(`      Why: ${rec.reasons.slice(0, 2).join(', ')}`);

      // Show how it uses their preferences
      const prefMatches = rec.reasons.find(r => r.includes('Uses:'));
      if (prefMatches) {
        console.log(`      ✨ ${prefMatches}`);
      }

      // Show what it addresses
      const helpsMatches = rec.reasons.find(r => r.includes('Helps with:'));
      if (helpsMatches) {
        console.log(`      🎯 ${helpsMatches}`);
      }
    });

    console.log('\n' + '-'.repeat(60));
  }

  console.log('\n✅ Test Complete!\n');

  return {
    profiles: TEST_PROFILES,
    expectedRecommendations: EXPECTED_RECOMMENDATIONS
  };
}

/**
 * Example output:
 *
 * SARAH'S PROFILE:
 *   Focus: eating
 *   Loves: restaurant_friends, coffee_shops, walking...
 *   Challenges: hate_veggies, love_sweets, social_events...
 *
 *   TOP RECOMMENDATIONS:
 *   1. Try the vegetable appetizer sampler at a new restaurant
 *      Score: 82.5
 *      Why: Uses: restaurant_friends, social, Helps with: hate_veggies
 *
 *   2. Walking coffee date with healthy breakfast spot
 *      Score: 78.3
 *      Why: Uses: coffee_shops, walking, Matches 2/4 goals
 *
 * This shows how the algorithm now prioritizes tips that:
 * - Use activities the person already loves
 * - Address their specific blockers
 * - Avoid things they hate
 * - Fit their lifestyle
 */