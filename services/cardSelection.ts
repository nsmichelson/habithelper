/**
 * Card Selection Service
 *
 * Responsible for selecting and prioritizing motivation/education cards
 * based on user context, engagement history, and relevance scoring.
 */

import {
  collection,
  query,
  where,
  getDocs,
  Firestore,
  Timestamp
} from 'firebase/firestore';
import { COLLECTION_NAMES } from '@/config/firebase';
import {
  CardType,
  CardEngagementRecord,
  CardSelectionCriteria,
  ScoredCard,
  DEFAULT_FREQUENCY_RULES
} from '@/types/cardEngagement';
import { MotivationCard, MOTIVATION_CARDS } from '@/data/motivationCards';
import AnalyticsService from './analytics';

// Scoring weights
const SCORING_WEIGHTS = {
  TRIGGER_MATCH: 30,          // Card triggers match user's check-in selections
  AREA_MATCH: 20,             // Card is for the current tip area
  FRESHNESS: 15,              // Longer since last shown = higher score
  PAST_HELPFUL: 25,           // User marked helpful before
  PAST_NOT_HELPFUL: -50,      // User marked not helpful (strong penalty)
  NEVER_SEEN: 10,             // Bonus for cards user hasn't seen
  ENGAGEMENT_BONUS: 5,        // User engaged with this card before (tapped/completed)
  OVEREXPOSURE_PENALTY: -20,  // Shown too many times recently
};

// Days to consider for recency calculations
const RECENCY_WINDOW_DAYS = 7;

class CardSelectionService {

  /**
   * Select the best cards for the current user context
   */
  async selectCards(criteria: CardSelectionCriteria): Promise<ScoredCard[]> {
    const { tipArea, feelings, obstacles, helpers, timeOfDay, excludeCardIds = [], maxCards = 3 } = criteria;

    // Get user's engagement history from Firebase
    const engagementHistory = await this.getUserEngagementHistory();

    // Get all available motivation cards
    const availableCards = this.filterAvailableCards(
      MOTIVATION_CARDS,
      tipArea,
      excludeCardIds,
      engagementHistory
    );

    // Score each card
    const scoredCards: ScoredCard[] = availableCards.map(card => {
      const engagement = engagementHistory.get(card.id);
      const score = this.calculateCardScore(card, {
        feelings,
        obstacles,
        helpers,
        tipArea,
        timeOfDay,
        engagement
      });

      return {
        card,
        score: score.total,
        matchReasons: score.reasons
      };
    });

    // Sort by score descending
    scoredCards.sort((a, b) => b.score - a.score);

    // Take top candidates and add some randomization
    const topCandidates = scoredCards.slice(0, Math.min(maxCards * 2, scoredCards.length));
    const selected = this.randomizeTopCards(topCandidates, maxCards);

    // Ensure variety in card types
    return this.ensureVariety(selected, maxCards);
  }

  /**
   * Get user's card engagement history from Firebase
   */
  private async getUserEngagementHistory(): Promise<Map<string, CardEngagementRecord>> {
    const history = new Map<string, CardEngagementRecord>();

    const userId = AnalyticsService.getUserId();
    const firestore = AnalyticsService.getFirestore();

    if (!userId || !firestore) {
      return history;
    }

    try {
      const q = query(
        collection(firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS),
        where('odId', '>=', `${userId}_`),
        where('odId', '<', `${userId}_\uf8ff`)
      );

      const snapshot = await getDocs(q);
      snapshot.forEach(doc => {
        const data = doc.data() as CardEngagementRecord;
        history.set(data.cardId, data);
      });
    } catch (error) {
      console.error('Failed to fetch card engagement history:', error);
    }

    return history;
  }

  /**
   * Filter out cards that shouldn't be shown
   */
  private filterAvailableCards(
    allCards: MotivationCard[],
    tipArea: string,
    excludeCardIds: string[],
    engagementHistory: Map<string, CardEngagementRecord>
  ): MotivationCard[] {
    const now = new Date();

    return allCards.filter(card => {
      // Exclude explicitly excluded cards
      if (excludeCardIds.includes(card.id)) {
        return false;
      }

      // Check area restrictions
      if (card.triggers.areas && card.triggers.areas.length > 0) {
        if (!card.triggers.areas.includes(tipArea)) {
          return false;
        }
      }

      if (card.triggers.excludeAreas?.includes(tipArea)) {
        return false;
      }

      // Check engagement history for exclusion criteria
      const engagement = engagementHistory.get(card.id);
      if (engagement) {
        // Exclude if user marked as not helpful recently
        if (engagement.lastFeedback === 'not_helpful') {
          const lastFeedbackDate = engagement.lastFeedbackAt instanceof Date
            ? engagement.lastFeedbackAt
            : (engagement.lastFeedbackAt as any)?.toDate?.() || null;

          if (lastFeedbackDate) {
            const daysSinceFeedback = (now.getTime() - lastFeedbackDate.getTime()) / (1000 * 60 * 60 * 24);
            // Don't show cards marked unhelpful for 14 days
            if (daysSinceFeedback < 14) {
              return false;
            }
          }
        }

        // Check frequency rules for card type
        const rules = DEFAULT_FREQUENCY_RULES.find(r => r.cardType === card.type);
        if (rules) {
          const lastShownDate = engagement.lastShownAt instanceof Date
            ? engagement.lastShownAt
            : (engagement.lastShownAt as any)?.toDate?.() || null;

          if (lastShownDate) {
            const daysSinceShown = (now.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceShown < rules.minDaysBetweenShows) {
              return false;
            }
          }

          // Check if quiz is mastered and should be retired
          if (rules.retireAfterMastery && engagement.quizMastered) {
            return false;
          }
        }
      }

      return true;
    });
  }

  /**
   * Calculate priority score for a card
   */
  private calculateCardScore(
    card: MotivationCard,
    context: {
      feelings: string[];
      obstacles: string[];
      helpers: string[];
      tipArea: string;
      timeOfDay: string;
      engagement?: CardEngagementRecord;
    }
  ): { total: number; reasons: string[] } {
    let score = card.priority || 0; // Start with base priority
    const reasons: string[] = [];

    const { feelings, obstacles, helpers, tipArea, engagement } = context;

    // Trigger matching
    if (card.triggers.feelings?.some(f => feelings.includes(f))) {
      score += SCORING_WEIGHTS.TRIGGER_MATCH;
      reasons.push('Matches your feelings');
    }

    if (card.triggers.obstacles?.some(o => obstacles.includes(o))) {
      score += SCORING_WEIGHTS.TRIGGER_MATCH;
      reasons.push('Addresses your obstacles');
    }

    if (card.triggers.helpers?.some(h => helpers.includes(h))) {
      score += SCORING_WEIGHTS.TRIGGER_MATCH * 0.5; // Lower weight for helper matches
      reasons.push('Builds on what\'s working');
    }

    // Area match
    if (card.triggers.areas?.includes(tipArea)) {
      score += SCORING_WEIGHTS.AREA_MATCH;
      reasons.push('Relevant to your focus area');
    }

    // Engagement history scoring
    if (engagement) {
      // Past helpful feedback
      if (engagement.helpfulCount > 0) {
        score += SCORING_WEIGHTS.PAST_HELPFUL * Math.min(engagement.helpfulCount, 3);
        reasons.push('You found this helpful before');
      }

      // Past not helpful feedback (strong penalty)
      if (engagement.notHelpfulCount > 0) {
        score += SCORING_WEIGHTS.PAST_NOT_HELPFUL;
      }

      // Engagement bonus
      if (engagement.tappedCount > 0 || engagement.completedCount > 0) {
        score += SCORING_WEIGHTS.ENGAGEMENT_BONUS;
      }

      // Freshness score
      const lastShownDate = engagement.lastShownAt instanceof Date
        ? engagement.lastShownAt
        : (engagement.lastShownAt as any)?.toDate?.() || null;

      if (lastShownDate) {
        const daysSinceShown = (Date.now() - lastShownDate.getTime()) / (1000 * 60 * 60 * 24);
        const freshnessMultiplier = Math.min(daysSinceShown / RECENCY_WINDOW_DAYS, 1);
        score += SCORING_WEIGHTS.FRESHNESS * freshnessMultiplier;
      }

      // Overexposure penalty
      if (engagement.totalShownCount > 5) {
        score += SCORING_WEIGHTS.OVEREXPOSURE_PENALTY;
      }
    } else {
      // Never seen bonus
      score += SCORING_WEIGHTS.NEVER_SEEN;
      reasons.push('New insight for you');
    }

    return { total: Math.max(0, score), reasons };
  }

  /**
   * Add randomization to top candidates to avoid predictability
   */
  private randomizeTopCards(candidates: ScoredCard[], count: number): ScoredCard[] {
    if (candidates.length <= count) {
      return candidates;
    }

    // Shuffle the top candidates with weighted probability
    const selected: ScoredCard[] = [];
    const remaining = [...candidates];

    while (selected.length < count && remaining.length > 0) {
      // Weight selection towards higher scores but allow randomness
      const totalScore = remaining.reduce((sum, c) => sum + Math.max(1, c.score), 0);
      let random = Math.random() * totalScore;

      for (let i = 0; i < remaining.length; i++) {
        random -= Math.max(1, remaining[i].score);
        if (random <= 0) {
          selected.push(remaining[i]);
          remaining.splice(i, 1);
          break;
        }
      }
    }

    return selected;
  }

  /**
   * Ensure variety in selected card types
   */
  private ensureVariety(cards: ScoredCard[], maxCards: number): ScoredCard[] {
    const result: ScoredCard[] = [];
    const usedTypes = new Set<CardType>();

    // Track limits per type
    const typeLimits: Record<string, number> = {
      quiz: 1,
      progressive_quiz: 1,
      tool: 1
    };
    const typeCount: Record<string, number> = {};

    for (const card of cards) {
      if (result.length >= maxCards) break;

      const cardType = card.card.type as CardType;
      const limit = typeLimits[cardType];
      const currentCount = typeCount[cardType] || 0;

      // Check if we've hit the limit for this type
      if (limit !== undefined && currentCount >= limit) {
        continue;
      }

      result.push(card);
      typeCount[cardType] = currentCount + 1;
      usedTypes.add(cardType);
    }

    return result;
  }

  /**
   * Track that cards were shown to user
   */
  async trackCardsShown(
    cards: ScoredCard[],
    context: {
      tipArea: string;
      feelings: string[];
      obstacles: string[];
    }
  ): Promise<void> {
    const timeOfDay = this.getTimeOfDay();

    for (const scoredCard of cards) {
      await AnalyticsService.trackCardShown(
        scoredCard.card.id,
        scoredCard.card.type as CardType,
        {
          tipArea: context.tipArea,
          feelings: context.feelings,
          obstacles: context.obstacles,
          timeOfDay
        }
      );
    }
  }

  /**
   * Get current time of day category
   */
  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }
}

export default new CardSelectionService();
