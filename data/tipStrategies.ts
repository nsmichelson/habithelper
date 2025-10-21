/**
 * TIP STRATEGY IDEAS
 *
 * This document contains ideas for how to combine user preferences with their goals
 * to create appealing and effective tips.
 *
 * The key insight: Use what people LOVE to help them achieve their goals
 */

export const TIP_STRATEGIES = {
  // ============ COMBINING LOVES WITH GOALS ============

  restaurant_friends: {
    exercise: [
      "Walk or bike to restaurant meetups instead of driving",
      "Try active restaurant alternatives (bowling alley with food, mini golf with snacks)",
      "Walking meetings at coffee shops",
      "Restaurant hop on foot - appetizer at one place, main at another"
    ],
    eating: [
      "Share entrees to control portions",
      "Order veggie-forward appetizers to share",
      "Challenge friends to try the healthiest menu item",
      "Research restaurant menus ahead for healthy options"
    ],
    productivity: [
      "Restaurant as reward after completing big task",
      "Weekly planning sessions at favorite coffee shop",
      "Restaurant accountability meetups for goals"
    ]
  },

  walking_talking: {
    relationships: [
      "Walking phone calls with distant friends",
      "Walking dates instead of sitting dates",
      "Family walks after dinner"
    ],
    productivity: [
      "Walking brainstorm sessions",
      "Audio note-taking while walking",
      "Walking breaks between deep work sessions"
    ],
    mindset: [
      "Walking meditation",
      "Gratitude walks",
      "Walking therapy (self or with therapist)"
    ]
  },

  podcasts_audiobooks: {
    exercise: [
      "Only listen to favorite podcast while exercising",
      "Audiobook chapters = workout segments",
      "True crime walks (can't stop mid-episode!)"
    ],
    eating: [
      "Meal prep while listening to podcasts",
      "Nutrition/cooking podcasts while cooking",
      "Mindful eating without podcasts (save for movement)"
    ],
    sleeping: [
      "Sleep podcasts/stories",
      "No thriller podcasts after 8pm",
      "Morning podcast routine instead of night scrolling"
    ]
  },

  dancing: {
    exercise: [
      "5-minute dance party breaks",
      "YouTube dance workouts",
      "Dance while doing chores",
      "Kitchen dancing while cooking"
    ],
    mindset: [
      "Mood-boost dance sessions",
      "Dance out frustrations",
      "Victory dances for accomplishments"
    ],
    sleeping: [
      "Morning dance to wake up fully",
      "Gentle sway/stretch to slow music before bed"
    ]
  },

  // ============ ADDRESSING BLOCKERS WITH PREFERENCES ============

  hate_veggies_but_loves: {
    restaurant_friends: [
      "Try veggie dishes at ethnic restaurants (often more flavorful)",
      "Veggie appetizers to share (less pressure)",
      "Restaurant veggie challenges with friends"
    ],
    cooking_experimenting: [
      "Roast veggies until crispy (changes texture completely)",
      "Hide veggies in favorite dishes",
      "Veggie chips or fries experiments"
    ],
    games_puzzles: [
      "Veggie bingo - try one new prep method per week",
      "Rate veggies like wine tasting",
      "Veggie color challenge (eat rainbow)"
    ]
  },

  love_sweets_but_wants_less_sugar: {
    planning_organizing: [
      "Schedule sweet treats (not restrict, just plan)",
      "Portion control prep (pre-portion treats)",
      "Sweet treat budget system"
    ],
    cooking_experimenting: [
      "Homemade healthier versions",
      "Fruit-based desserts",
      "Dark chocolate upgrades"
    ],
    social_activities: [
      "Share desserts when out",
      "Coffee dates instead of dessert dates",
      "Non-food social rewards"
    ]
  },

  no_time_but_loves: {
    tech_gadgets: [
      "Meal delivery apps with healthy options",
      "Quick workout apps",
      "Time-tracking to find hidden pockets",
      "Automation tools for routine tasks"
    ],
    spontaneous: [
      "Grab-and-go healthy options prepped",
      "Spontaneous 2-minute movement breaks",
      "Flexible goals vs rigid schedules"
    ],
    busy_productive: [
      "Stack habits with existing routines",
      "Productive procrastination (exercise while avoiding task)",
      "Batch similar tasks together"
    ]
  },

  hate_gym_but_loves: {
    nature_outdoors: [
      "Hiking, trail walking",
      "Outdoor bodyweight exercises",
      "Gardening as exercise",
      "Outdoor sports/activities"
    ],
    family_time: [
      "Family active games",
      "Park visits with kids",
      "Family bike rides",
      "Dance parties at home"
    ],
    youtube_videos: [
      "Home workout videos",
      "No-equipment exercises",
      "Short burst workouts",
      "Follow-along yoga"
    ]
  },

  // ============ AREA-SPECIFIC COMBINATIONS ============

  sleep_issues_and_loves: {
    reading: [
      "Physical books instead of screens",
      "Boring books as sleep aid",
      "Morning reading routine to replace night scrolling"
    ],
    planning_organizing: [
      "Sleep schedule in planner",
      "Bedtime routine checklist",
      "Track sleep patterns"
    ],
    solo_time: [
      "Evening solo ritual (tea, stretch, quiet)",
      "Morning solo time to replace late night me-time",
      "Protect wind-down time"
    ]
  },

  productivity_issues_and_loves: {
    games_puzzles: [
      "Gamify task completion",
      "Puzzle breaks between tasks",
      "Challenge/achievement system"
    ],
    coffee_dates: [
      "Coffee shop work sessions",
      "Accountability coffee meetups",
      "Reward system with coffee treats"
    ],
    music_playlists: [
      "Focus playlists for different tasks",
      "Pump-up music for hard tasks",
      "Timer playlists (work length of playlist)"
    ]
  }
};

/**
 * KEY PRINCIPLES FOR TIP CREATION:
 *
 * 1. PAIR don't REPLACE
 *    - Don't take away what they love, add health to it
 *    - "Walk to restaurants" not "stop going to restaurants"
 *
 * 2. USE NATURAL MOTIVATORS
 *    - Social people: add social element to goals
 *    - Competitive people: add challenges/games
 *    - Creative people: add experimentation/variety
 *
 * 3. WORK WITH THEIR LIFE
 *    - Busy parents: family-inclusive activities
 *    - Remote workers: coffee shop variety
 *    - Night owls: don't force morning routines
 *
 * 4. ACKNOWLEDGE CONFLICTS
 *    - Hate veggies + want to eat healthier = find preparation methods
 *    - Love sweets + reduce sugar = strategic not restrictive
 *    - No time + exercise = micro-workouts and stacking
 *
 * 5. LEVERAGE THEIR STRENGTHS
 *    - Planners: use their planning skills
 *    - Spontaneous: build in flexibility
 *    - Tech-savvy: use apps and gadgets
 *    - Social: add community elements
 */

export function generateTipIdeas(
  goals: string[],
  loves: string[],
  blockers: string[],
  avoids: string[]
): string[] {
  const ideas: string[] = [];

  // This is where the recommendation algorithm would combine
  // user preferences to generate personalized tip suggestions

  return ideas;
}