export type AwardCategory = 
  | 'streak'           // Daily check-in streaks
  | 'speed'           // Quick action awards
  | 'comeback'        // Trying "maybe later" items
  | 'goal_progress'   // Progress toward specific goals
  | 'exploration'     // Trying diverse tips
  | 'consistency'     // Regular engagement patterns
  | 'milestone'       // Total experiments milestones
  | 'special';        // Special/seasonal awards

export type AwardTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Award {
  id: string;
  name: string;
  description: string;
  category: AwardCategory;
  tier?: AwardTier;
  icon: string; // Emoji or icon name
  
  // Criteria for earning
  criteria: {
    type: 'streak' | 'count' | 'time' | 'pattern' | 'special';
    value: number;
    unit?: 'days' | 'experiments' | 'minutes' | 'goals';
    goalTag?: string; // For goal-specific awards
    condition?: string; // Additional conditions
  };
  
  // Display
  isSecret?: boolean; // Hidden until earned
  sortOrder: number; // Display order
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  
  // Motivational text
  earnedMessage: string; // Message shown when earned
  progressMessage?: string; // Message showing progress (e.g., "2/7 days")
}

export interface UserAward {
  awardId: string;
  earnedAt: Date;
  progress?: number; // For trackable progress
  notified?: boolean; // Whether user was notified
}

export interface AwardProgress {
  awardId: string;
  currentValue: number;
  targetValue: number;
  percentage: number;
  lastUpdated: Date;
}