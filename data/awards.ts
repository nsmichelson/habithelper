import { Award } from '../types/awards';

export const AWARDS_DATABASE: Award[] = [
  // ========== STREAK AWARDS ==========
  {
    id: 'streak_3_day',
    name: 'Hat Trick Hero',
    description: 'Check in 3 days in a row',
    category: 'streak',
    tier: 'bronze',
    icon: '🎩',
    criteria: { type: 'streak', value: 3, unit: 'days' },
    sortOrder: 1,
    rarity: 'common',
    earnedMessage: "Three days strong! You're building momentum! 🎉",
    progressMessage: 'day streak'
  },
  {
    id: 'streak_7_day',
    name: 'Week Warrior',
    description: 'Check in 7 days in a row',
    category: 'streak',
    tier: 'silver',
    icon: '⚔️',
    criteria: { type: 'streak', value: 7, unit: 'days' },
    sortOrder: 2,
    rarity: 'uncommon',
    earnedMessage: "A full week! You're officially in the habit zone! 💪",
    progressMessage: 'day streak'
  },
  {
    id: 'streak_14_day',
    name: 'Fortnight Phoenix',
    description: 'Check in 14 days in a row',
    category: 'streak',
    tier: 'gold',
    icon: '🔥',
    criteria: { type: 'streak', value: 14, unit: 'days' },
    sortOrder: 3,
    rarity: 'rare',
    earnedMessage: "Two weeks of consistency! You're on fire! 🔥",
    progressMessage: 'day streak'
  },
  {
    id: 'streak_30_day',
    name: 'Monthly Maven',
    description: 'Check in 30 days in a row',
    category: 'streak',
    tier: 'platinum',
    icon: '👑',
    criteria: { type: 'streak', value: 30, unit: 'days' },
    sortOrder: 4,
    rarity: 'epic',
    earnedMessage: "30 days! You've mastered the art of showing up! 👑",
    progressMessage: 'day streak'
  },
  {
    id: 'streak_60_day',
    name: 'Habit Olympian',
    description: 'Check in 60 days in a row',
    category: 'streak',
    tier: 'diamond',
    icon: '🏆',
    criteria: { type: 'streak', value: 60, unit: 'days' },
    sortOrder: 5,
    rarity: 'legendary',
    earnedMessage: "60 days! You're a habit-forming legend! 🏆",
    progressMessage: 'day streak'
  },
  {
    id: 'streak_90_day',
    name: 'Transformation Titan',
    description: 'Check in 90 days in a row',
    category: 'streak',
    tier: 'diamond',
    icon: '💎',
    criteria: { type: 'streak', value: 90, unit: 'days' },
    sortOrder: 6,
    rarity: 'legendary',
    earnedMessage: "90 days! You've transformed your life! 💎",
    progressMessage: 'day streak'
  },

  // ========== SPEED AWARDS ==========
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Try an experiment within 10 minutes of accepting',
    category: 'speed',
    icon: '⚡',
    criteria: { type: 'time', value: 10, unit: 'minutes' },
    sortOrder: 20,
    rarity: 'uncommon',
    earnedMessage: "Lightning fast! You don't hesitate, you DO! ⚡"
  },
  {
    id: 'instant_action',
    name: 'Instant Action Hero',
    description: 'Try an experiment within 1 minute of accepting',
    category: 'speed',
    icon: '🚀',
    criteria: { type: 'time', value: 1, unit: 'minutes' },
    sortOrder: 21,
    rarity: 'rare',
    earnedMessage: "INSTANT ACTION! You're faster than fast! 🚀"
  },

  // ========== COMEBACK AWARDS ==========
  {
    id: 'second_chance',
    name: 'Second Chance Champion',
    description: 'Try something you previously marked as "maybe later"',
    category: 'comeback',
    icon: '🔄',
    criteria: { type: 'special', value: 1, condition: 'tried_maybe_later' },
    sortOrder: 30,
    rarity: 'uncommon',
    earnedMessage: "You came back to it! Sometimes timing is everything! 🔄"
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Try 5 "maybe later" experiments',
    category: 'comeback',
    tier: 'silver',
    icon: '🎯',
    criteria: { type: 'count', value: 5, condition: 'tried_maybe_later' },
    sortOrder: 31,
    rarity: 'rare',
    earnedMessage: "5 second chances taken! You're the Comeback Kid! 🎯"
  },
  {
    id: 'redemption_master',
    name: 'Redemption Master',
    description: 'Try 10 "maybe later" experiments',
    category: 'comeback',
    tier: 'gold',
    icon: '✨',
    criteria: { type: 'count', value: 10, condition: 'tried_maybe_later' },
    sortOrder: 32,
    rarity: 'epic',
    earnedMessage: "10 comebacks! You're the master of perfect timing! ✨"
  },

  // ========== GOAL PROGRESS AWARDS ==========
  {
    id: 'goal_starter',
    name: 'Goal Getter Started',
    description: 'Complete 3 experiments for any single goal',
    category: 'goal_progress',
    tier: 'bronze',
    icon: '🎯',
    criteria: { type: 'count', value: 3, unit: 'goals' },
    sortOrder: 40,
    rarity: 'common',
    earnedMessage: "3 experiments toward your goal! You're on your way! 🎯"
  },
  {
    id: 'goal_focused',
    name: 'Laser Focused',
    description: 'Complete 10 experiments for any single goal',
    category: 'goal_progress',
    tier: 'silver',
    icon: '🔍',
    criteria: { type: 'count', value: 10, unit: 'goals' },
    sortOrder: 41,
    rarity: 'uncommon',
    earnedMessage: "10 experiments for one goal! That's focus! 🔍"
  },
  {
    id: 'goal_crusher',
    name: 'Goal Crusher',
    description: 'Complete 25 experiments for any single goal',
    category: 'goal_progress',
    tier: 'gold',
    icon: '💥',
    criteria: { type: 'count', value: 25, unit: 'goals' },
    sortOrder: 42,
    rarity: 'rare',
    earnedMessage: "25 experiments! You're crushing this goal! 💥"
  },

  // ========== EXPLORATION AWARDS ==========
  {
    id: 'curious_cat',
    name: 'Curious Cat',
    description: 'Try experiments from 3 different categories',
    category: 'exploration',
    icon: '🐱',
    criteria: { type: 'pattern', value: 3, condition: 'different_categories' },
    sortOrder: 50,
    rarity: 'common',
    earnedMessage: "Exploring different areas! Curiosity for the win! 🐱"
  },
  {
    id: 'renaissance_soul',
    name: 'Renaissance Soul',
    description: 'Try experiments from all 4 areas',
    category: 'exploration',
    tier: 'gold',
    icon: '🎨',
    criteria: { type: 'pattern', value: 4, condition: 'all_areas' },
    sortOrder: 51,
    rarity: 'rare',
    earnedMessage: "You've tried it all! A true Renaissance Soul! 🎨"
  },
  {
    id: 'variety_virtuoso',
    name: 'Variety Virtuoso',
    description: 'Try 20 different experiments',
    category: 'exploration',
    tier: 'silver',
    icon: '🌈',
    criteria: { type: 'count', value: 20, unit: 'experiments', condition: 'unique' },
    sortOrder: 52,
    rarity: 'uncommon',
    earnedMessage: "20 different experiments! Variety is your spice of life! 🌈"
  },

  // ========== CONSISTENCY AWARDS ==========
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Check in every weekend for a month',
    category: 'consistency',
    icon: '🛡️',
    criteria: { type: 'pattern', value: 8, condition: 'weekend_checkins' },
    sortOrder: 60,
    rarity: 'uncommon',
    earnedMessage: "Every weekend for a month! Weekends are your power time! 🛡️"
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete 10 morning experiments (before 9am)',
    category: 'consistency',
    icon: '🐦',
    criteria: { type: 'pattern', value: 10, condition: 'morning_completion' },
    sortOrder: 61,
    rarity: 'uncommon',
    earnedMessage: "10 morning wins! The early bird gets the results! 🐦"
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete 10 evening check-ins (after 8pm)',
    category: 'consistency',
    icon: '🦉',
    criteria: { type: 'pattern', value: 10, condition: 'evening_checkin' },
    sortOrder: 62,
    rarity: 'uncommon',
    earnedMessage: "10 evening reflections! Night time is your right time! 🦉"
  },

  // ========== MILESTONE AWARDS ==========
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first experiment',
    category: 'milestone',
    icon: '👣',
    criteria: { type: 'count', value: 1, unit: 'experiments' },
    sortOrder: 70,
    rarity: 'common',
    earnedMessage: "Your journey begins! The first step is always the biggest! 👣"
  },
  {
    id: 'perfect_10',
    name: 'Perfect 10',
    description: 'Complete 10 experiments',
    category: 'milestone',
    tier: 'bronze',
    icon: '🔟',
    criteria: { type: 'count', value: 10, unit: 'experiments' },
    sortOrder: 71,
    rarity: 'common',
    earnedMessage: "10 experiments done! You're officially experimenting with life! 🔟"
  },
  {
    id: 'quarter_century',
    name: 'Quarter Century',
    description: 'Complete 25 experiments',
    category: 'milestone',
    tier: 'silver',
    icon: '🎪',
    criteria: { type: 'count', value: 25, unit: 'experiments' },
    sortOrder: 72,
    rarity: 'uncommon',
    earnedMessage: "25 experiments! You're a quarter of the way to mastery! 🎪"
  },
  {
    id: 'half_centurion',
    name: 'Half Centurion',
    description: 'Complete 50 experiments',
    category: 'milestone',
    tier: 'gold',
    icon: '⚡',
    criteria: { type: 'count', value: 50, unit: 'experiments' },
    sortOrder: 73,
    rarity: 'rare',
    earnedMessage: "50 experiments! Halfway to legendary status! ⚡"
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Complete 100 experiments',
    category: 'milestone',
    tier: 'platinum',
    icon: '💯',
    criteria: { type: 'count', value: 100, unit: 'experiments' },
    sortOrder: 74,
    rarity: 'epic',
    earnedMessage: "100 EXPERIMENTS! You're a true Centurion of Change! 💯"
  },

  // ========== SPECIAL AWARDS ==========
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Complete every daily experiment for a week',
    category: 'special',
    tier: 'gold',
    icon: '⭐',
    criteria: { type: 'pattern', value: 7, condition: 'all_completed_week' },
    sortOrder: 80,
    rarity: 'rare',
    earnedMessage: "A perfect week! Every single experiment completed! ⭐"
  },
  {
    id: 'bounce_back',
    name: 'Bounce Back Boss',
    description: 'Return after missing 3+ days',
    category: 'special',
    icon: '🏀',
    criteria: { type: 'special', value: 1, condition: 'returned_after_break' },
    sortOrder: 81,
    rarity: 'common',
    earnedMessage: "You're back! Every comeback makes you stronger! 🏀"
  },
  {
    id: 'love_magnet',
    name: 'Love Magnet',
    description: '10 experiments marked as "loved it"',
    category: 'special',
    tier: 'silver',
    icon: '❤️',
    criteria: { type: 'count', value: 10, condition: 'loved_experiments' },
    sortOrder: 82,
    rarity: 'uncommon',
    earnedMessage: "10 experiments you loved! You're finding what works! ❤️"
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable Force',
    description: '30 experiments marked as "loved it"',
    category: 'special',
    tier: 'platinum',
    icon: '🚂',
    criteria: { type: 'count', value: 30, condition: 'loved_experiments' },
    sortOrder: 83,
    rarity: 'epic',
    earnedMessage: "30 loved experiments! Nothing can stop you now! 🚂"
  },
  {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Find 5 experiments you love in first 2 weeks',
    category: 'special',
    tier: 'gold',
    icon: '🧠',
    criteria: { type: 'pattern', value: 5, condition: 'loved_in_14_days' },
    sortOrder: 84,
    rarity: 'rare',
    isSecret: true,
    earnedMessage: "5 wins in 2 weeks! You learn FAST! 🧠"
  },
  {
    id: 'adventurer',
    name: 'Brave Adventurer',
    description: 'Try 10 experiments rated "difficult"',
    category: 'special',
    tier: 'gold',
    icon: '🗺️',
    criteria: { type: 'count', value: 10, condition: 'difficult_experiments' },
    sortOrder: 85,
    rarity: 'rare',
    earnedMessage: "10 difficult experiments tackled! You fear nothing! 🗺️"
  }
];

// Helper functions to check award progress
export function getAwardById(id: string): Award | undefined {
  return AWARDS_DATABASE.find(a => a.id === id);
}

export function getAwardsByCategory(category: string): Award[] {
  return AWARDS_DATABASE.filter(a => a.category === category);
}

export function getSecretAwards(): Award[] {
  return AWARDS_DATABASE.filter(a => a.isSecret);
}

export function getVisibleAwards(): Award[] {
  return AWARDS_DATABASE.filter(a => !a.isSecret);
}