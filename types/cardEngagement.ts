/**
 * Types for motivation/education card engagement tracking
 */

// Card types that can be displayed
export type CardType =
  | 'quiz'
  | 'progressive_quiz'
  | 'fact'
  | 'tool'
  | 'strategy'
  | 'encouragement'
  | 'reframe'
  | 'tip';

// Feedback options
export type CardFeedback = 'helpful' | 'not_helpful';

// Context when a card is shown
export interface CardShowContext {
  tipArea?: string;              // Area of the current tip (nutrition, sleep, etc.)
  tipId?: string;                // ID of the current tip
  feelings?: string[];           // User's selected feelings from check-in
  obstacles?: string[];          // User's selected obstacles from check-in
  helpers?: string[];            // User's selected helpers from check-in
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek?: number;            // 0-6, Sunday = 0
}

// Individual card engagement record (stored in Firestore)
export interface CardEngagementRecord {
  // Identifiers
  odId: string;                  // Unique doc ID: `${userId}_${cardId}`
  cardId: string;
  cardType: CardType;

  // Exposure tracking
  firstShownAt: Date;
  lastShownAt: Date;
  totalShownCount: number;

  // Engagement tracking
  tappedCount: number;           // Opened modal/expanded card
  completedCount: number;        // Finished reading/activity
  ignoredCount: number;          // Shown but not tapped
  totalTimeSpentMs: number;      // Cumulative time in modal

  // Feedback tracking
  helpfulCount: number;          // Times marked helpful
  notHelpfulCount: number;       // Times marked not helpful
  lastFeedback: CardFeedback | null;
  lastFeedbackAt: Date | null;

  // Quiz-specific fields
  quizAttempts?: number;
  quizCorrectCount?: number;
  quizMastered?: boolean;
  currentQuizLevel?: number;     // For progressive quizzes (1, 2, 3)

  // Tool-specific fields
  toolStartedCount?: number;     // Clicked "Start" or "Try It"
  toolCompletedCount?: number;   // Finished the activity

  // Context tracking (arrays to identify patterns)
  shownWithAreas: string[];      // Which tip areas it was shown with
  shownAfterFeelings: string[];  // What feelings triggered it
  shownAfterObstacles: string[]; // What obstacles triggered it

  // Metadata
  updatedAt: Date;
}

// Partial record for updates
export type CardEngagementUpdate = Partial<Omit<CardEngagementRecord, 'odId' | 'cardId' | 'cardType' | 'firstShownAt'>>;

// Tool card definition
export interface ToolCard {
  id: string;
  type: 'tool';
  name: string;
  duration: string;              // e.g., "2 min"
  difficulty: 'easy' | 'moderate';
  bestFor: string[];             // e.g., ['stress', 'cravings', 'anxiety', 'boredom']
  requiresPrivacy: boolean;
  requiresEquipment: boolean;
  instructions: string[];
  audioGuided?: string;          // Optional audio URL
  timerSeconds?: number;         // If it's a timed activity
  icon: string;                  // Ionicon name
  iconBg: string;                // Background color
  iconColor: string;             // Icon color
}

// Progressive quiz definition
export interface ProgressiveQuiz {
  id: string;
  type: 'progressive_quiz';
  topic: string;                 // e.g., "Cravings"
  levels: {
    level: number;
    question: string;
    options: Array<{
      id: string;
      text: string;
      correct: boolean;
    }>;
    explanation: string;
    unlockAfterCorrect: number;  // How many correct answers to unlock next level
  }[];
  icon: string;
  iconBg: string;
  iconColor: string;
}

// Card selection criteria for the selection service
export interface CardSelectionCriteria {
  tipArea: string;
  feelings: string[];
  obstacles: string[];
  helpers: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  excludeCardIds?: string[];     // Cards to exclude (e.g., already shown today)
  maxCards?: number;             // Maximum cards to return (default 3)
}

// Card with computed priority score
export interface ScoredCard {
  card: any;                     // The actual card data
  score: number;                 // Computed priority score
  matchReasons: string[];        // Why this card was selected
}

// Card display frequency rules
export interface CardFrequencyRules {
  cardType: CardType;
  minDaysBetweenShows: number;
  maxShowsPerWeek: number;
  retireAfterMastery?: boolean;  // For quizzes
  refreshAfterDays?: number;     // When to reset frequency
}

// Default frequency rules
export const DEFAULT_FREQUENCY_RULES: CardFrequencyRules[] = [
  { cardType: 'quiz', minDaysBetweenShows: 7, maxShowsPerWeek: 2, retireAfterMastery: true },
  { cardType: 'progressive_quiz', minDaysBetweenShows: 3, maxShowsPerWeek: 3, retireAfterMastery: true },
  { cardType: 'fact', minDaysBetweenShows: 5, maxShowsPerWeek: 3, refreshAfterDays: 30 },
  { cardType: 'tool', minDaysBetweenShows: 1, maxShowsPerWeek: 7 },
  { cardType: 'strategy', minDaysBetweenShows: 3, maxShowsPerWeek: 4 },
  { cardType: 'encouragement', minDaysBetweenShows: 1, maxShowsPerWeek: 7 },
  { cardType: 'reframe', minDaysBetweenShows: 4, maxShowsPerWeek: 3, refreshAfterDays: 14 },
  { cardType: 'tip', minDaysBetweenShows: 3, maxShowsPerWeek: 4 },
];

// ============================================
// NOT HELPFUL LOGGING FOR PATTERN DETECTION
// ============================================

// Card attributes captured when logging "not helpful"
export interface NotHelpfulCardAttributes {
  tone: 'gentle' | 'energizing' | 'neutral' | 'playful' | 'serious';
  science_depth: 'light' | 'moderate' | 'deep';
  duration: 'quick' | 'medium' | 'long';
  category: string;               // e.g., 'breathing', 'distraction', 'reframe', 'education'
  requires_privacy?: boolean;
  requires_action?: boolean;      // Passive (read) vs active (do something)
}

// Context captured when a card is marked "not helpful"
export interface NotHelpfulContext {
  tipArea: string;
  tipId: string;
  userFeeling: string[];
  userObstacles: string[];
  userHelpers?: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek: number;
}

// Full log entry for "not helpful" feedback
export interface NotHelpfulLogEntry {
  id: string;                     // Unique log ID
  userId: string;
  cardId: string;
  cardType: CardType;
  cardAttributes: NotHelpfulCardAttributes;
  context: NotHelpfulContext;
  timestamp: Date;
}

// Aggregated pattern detection results
export interface UserCardPatterns {
  userId: string;

  // Attributes the user consistently dislikes
  dislikedTones?: ('gentle' | 'energizing' | 'neutral' | 'playful' | 'serious')[];
  dislikedScienceDepths?: ('light' | 'moderate' | 'deep')[];
  dislikedCategories?: string[];
  dislikesActiveCards?: boolean;
  dislikesPrivacyRequired?: boolean;

  // Contexts where user often marks unhelpful
  unhelpfulWhenTired?: boolean;
  unhelpfulWhenStressed?: boolean;
  unhelpfulTimeOfDay?: ('morning' | 'afternoon' | 'evening' | 'night')[];

  // Card types to avoid
  avoidCardTypes?: CardType[];

  // Aggregate stats
  totalNotHelpfulCount: number;
  lastUpdated: Date;
}
