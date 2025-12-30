/**
 * Card Selection Service
 *
 * Responsible for selecting and prioritizing motivation/education cards
 * based on user context, engagement history, and relevance scoring.
 *
 * Key features:
 * - Prioritizes tip-associated tools and science content
 * - Matches user's science_interest preference
 * - Uses pattern detection to avoid disliked card types
 * - Includes "relevant surprise" selection for variety
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
  DEFAULT_FREQUENCY_RULES,
  NotHelpfulCardAttributes,
  UserCardPatterns
} from '@/types/cardEngagement';
import { MotivationCard, MOTIVATION_CARDS, MotivationCardDefinition, CardAttributes } from '@/data/motivationCards';
import { SimplifiedTip, AssociatedTool, AssociatedScience } from '@/types/simplifiedTip';
import { UserProfile } from '@/types/tip';
import AnalyticsService from './analytics';

// Scoring weights
const SCORING_WEIGHTS = {
  // === Tip-associated content (highest priority) ===
  TIP_ASSOCIATED_TOOL: 50,      // Tool that's specifically paired with current tip
  TIP_ASSOCIATED_SCIENCE: 40,   // Science content paired with current tip

  // === Context matching ===
  TRIGGER_MATCH: 30,            // Card triggers match user's check-in selections
  TIP_META_MATCH: 25,           // Matches tip's goals/mechanisms/drivers
  AREA_MATCH: 20,               // Card is for the current tip area
  SCIENCE_PREFERENCE_MATCH: 15, // Matches user's science interest level

  // === Engagement history ===
  PAST_HELPFUL: 25,             // User marked helpful before
  PAST_NOT_HELPFUL: -100,       // User marked not helpful (permanent suppression)
  PATTERN_MISMATCH: -30,        // Matches user's disliked patterns
  NEVER_SEEN: 10,               // Bonus for cards user hasn't seen
  ENGAGEMENT_BONUS: 5,          // User engaged with this card before (tapped/completed)

  // === Freshness ===
  FRESHNESS: 15,                // Longer since last shown = higher score
  OVEREXPOSURE_PENALTY: -20,    // Shown too many times recently
};

// Days to consider for recency calculations
const RECENCY_WINDOW_DAYS = 7;

// Probability of selecting a "relevant surprise" card instead of highest score
const RELEVANT_SURPRISE_PROBABILITY = 0.10; // 10% chance

// Extended criteria for card selection
export interface ExtendedCardSelectionCriteria extends CardSelectionCriteria {
  currentTip?: SimplifiedTip;      // The current tip for associated content
  userProfile?: UserProfile;        // User profile for preference matching
}

class CardSelectionService {
  private userPatterns: UserCardPatterns | null = null;
  private patternsLastFetched: number = 0;
  private readonly PATTERNS_CACHE_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Select the best cards for the current user context
   */
  async selectCards(criteria: CardSelectionCriteria): Promise<ScoredCard[]> {
    return this.selectCardsExtended(criteria as ExtendedCardSelectionCriteria);
  }

  /**
   * Select cards with full context including current tip and user profile
   */
  async selectCardsExtended(criteria: ExtendedCardSelectionCriteria): Promise<ScoredCard[]> {
    const {
      tipArea,
      feelings,
      obstacles,
      helpers,
      timeOfDay,
      excludeCardIds = [],
      maxCards = 3,
      currentTip,
      userProfile
    } = criteria;

    // Get user's engagement history and patterns from Firebase
    const [engagementHistory, patterns] = await Promise.all([
      this.getUserEngagementHistory(),
      this.getCachedUserPatterns()
    ]);

    // Build combined card pool
    const cardPool: Array<{
      card: MotivationCardDefinition | AssociatedTool | AssociatedScience;
      source: 'motivation' | 'tip_tool' | 'tip_science';
    }> = [];

    // 1. Add tip-associated tools (highest priority)
    if (currentTip?.associated_tools) {
      for (const tool of currentTip.associated_tools) {
        // Check if tool was marked not helpful
        const isNotHelpful = await AnalyticsService.isCardMarkedNotHelpful(tool.tool_id);
        if (!isNotHelpful && !excludeCardIds.includes(tool.tool_id)) {
          cardPool.push({ card: tool, source: 'tip_tool' });
        }
      }
    }

    // 2. Add tip-associated science content (filtered by user preference)
    if (currentTip?.associated_science) {
      const userSciencePreference = userProfile?.science_interest || 'moderate';
      for (const science of currentTip.associated_science) {
        // Filter by science depth preference
        if (this.matchesSciencePreference(science.science_depth, userSciencePreference)) {
          const isNotHelpful = await AnalyticsService.isCardMarkedNotHelpful(science.card_id);
          if (!isNotHelpful && !excludeCardIds.includes(science.card_id)) {
            cardPool.push({ card: science, source: 'tip_science' });
          }
        }
      }
    }

    // 3. Add general motivation cards (filtered)
    const availableMotivationCards = await this.filterAvailableCardsWithPatterns(
      MOTIVATION_CARDS,
      tipArea,
      excludeCardIds,
      engagementHistory,
      patterns,
      feelings,
      timeOfDay
    );

    for (const card of availableMotivationCards) {
      cardPool.push({ card, source: 'motivation' });
    }

    // Score all cards
    const scoredCards: ScoredCard[] = [];

    for (const { card, source } of cardPool) {
      const cardId = this.getCardId(card);
      const engagement = engagementHistory.get(cardId);

      const score = this.calculateExtendedCardScore(card, source, {
        feelings,
        obstacles,
        helpers,
        tipArea,
        timeOfDay,
        engagement,
        currentTip,
        userProfile,
        patterns
      });

      scoredCards.push({
        card,
        score: score.total,
        matchReasons: score.reasons
      });
    }

    // Sort by score descending
    scoredCards.sort((a, b) => b.score - a.score);

    // Apply "relevant surprise" logic
    const selected = this.selectWithRelevantSurprise(scoredCards, maxCards);

    // Ensure variety in card types
    return this.ensureVariety(selected, maxCards);
  }

  /**
   * Get card ID from any card type
   */
  private getCardId(card: MotivationCardDefinition | AssociatedTool | AssociatedScience): string {
    if ('tool_id' in card) return card.tool_id;
    if ('card_id' in card) return card.card_id;
    return (card as MotivationCardDefinition).id;
  }

  /**
   * Check if science content matches user's preference
   */
  private matchesSciencePreference(
    cardDepth: 'light' | 'moderate' | 'deep',
    userPreference: 'low' | 'moderate' | 'high'
  ): boolean {
    // Map preferences to acceptable depths
    const acceptableDepths: Record<string, string[]> = {
      'low': ['light'],
      'moderate': ['light', 'moderate'],
      'high': ['light', 'moderate', 'deep']
    };
    return acceptableDepths[userPreference]?.includes(cardDepth) ?? true;
  }

  /**
   * Get cached user patterns (refresh every 5 minutes)
   */
  private async getCachedUserPatterns(): Promise<UserCardPatterns | null> {
    const now = Date.now();
    if (this.userPatterns && (now - this.patternsLastFetched) < this.PATTERNS_CACHE_MS) {
      return this.userPatterns;
    }

    this.userPatterns = await AnalyticsService.getUserCardPatterns();
    this.patternsLastFetched = now;
    return this.userPatterns;
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
   * Filter cards with pattern-based exclusions
   */
  private async filterAvailableCardsWithPatterns(
    allCards: MotivationCardDefinition[],
    tipArea: string,
    excludeCardIds: string[],
    engagementHistory: Map<string, CardEngagementRecord>,
    patterns: UserCardPatterns | null,
    feelings: string[],
    timeOfDay: string
  ): Promise<MotivationCardDefinition[]> {
    const now = new Date();
    const filtered: MotivationCardDefinition[] = [];

    for (const card of allCards) {
      // Exclude explicitly excluded cards
      if (excludeCardIds.includes(card.id)) {
        continue;
      }

      // Check area restrictions
      if (card.triggers.areas && card.triggers.areas.length > 0) {
        if (!card.triggers.areas.includes(tipArea)) {
          continue;
        }
      }

      if (card.triggers.excludeAreas?.includes(tipArea)) {
        continue;
      }

      // Check engagement history for exclusion criteria
      const engagement = engagementHistory.get(card.id);
      if (engagement) {
        // PERMANENT EXCLUSION: if user marked as not helpful
        if (engagement.lastFeedback === 'not_helpful') {
          continue; // Never show again (permanent suppression)
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
              continue;
            }
          }

          // Check if quiz is mastered and should be retired
          if (rules.retireAfterMastery && engagement.quizMastered) {
            continue;
          }
        }
      }

      // Check pattern-based exclusions
      if (patterns && card.attributes) {
        const shouldAvoid = await this.checkPatternMatch(card.attributes, patterns, feelings, timeOfDay);
        if (shouldAvoid) {
          continue;
        }
      }

      filtered.push(card);
    }

    return filtered;
  }

  /**
   * Check if card attributes match user's disliked patterns
   */
  private async checkPatternMatch(
    attributes: CardAttributes,
    patterns: UserCardPatterns,
    feelings: string[],
    timeOfDay: string
  ): Promise<boolean> {
    // Check tone
    if (patterns.dislikedTones?.includes(attributes.tone)) {
      return true;
    }

    // Check science depth
    if (patterns.dislikedScienceDepths?.includes(attributes.science_depth)) {
      return true;
    }

    // Check category
    if (patterns.dislikedCategories?.includes(attributes.category)) {
      return true;
    }

    // Check active cards
    if (patterns.dislikesActiveCards && attributes.requires_action) {
      return true;
    }

    // Check privacy required
    if (patterns.dislikesPrivacyRequired && attributes.requires_privacy) {
      return true;
    }

    // Check time of day
    if (patterns.unhelpfulTimeOfDay?.includes(timeOfDay as any)) {
      return true;
    }

    // Check tired feeling
    if (patterns.unhelpfulWhenTired &&
        feelings.some(f => f === 'tired' || f === 'exhausted')) {
      return true;
    }

    // Check stressed feeling
    if (patterns.unhelpfulWhenStressed &&
        feelings.some(f => f === 'stressed' || f === 'anxious')) {
      return true;
    }

    return false;
  }

  /**
   * Calculate extended score for any card type (motivation, tool, science)
   */
  private calculateExtendedCardScore(
    card: MotivationCardDefinition | AssociatedTool | AssociatedScience,
    source: 'motivation' | 'tip_tool' | 'tip_science',
    context: {
      feelings: string[];
      obstacles: string[];
      helpers: string[];
      tipArea: string;
      timeOfDay: string;
      engagement?: CardEngagementRecord;
      currentTip?: SimplifiedTip;
      userProfile?: UserProfile;
      patterns?: UserCardPatterns | null;
    }
  ): { total: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
    const { feelings, obstacles, helpers, tipArea, engagement, currentTip, userProfile, patterns } = context;

    // === Source-based scoring (tip-associated content gets priority) ===
    if (source === 'tip_tool') {
      score += SCORING_WEIGHTS.TIP_ASSOCIATED_TOOL;
      reasons.push('Tool designed for this tip');

      // Check if tool matches current obstacles/feelings
      const tool = card as AssociatedTool;
      if (tool.bestFor?.some(b => obstacles.includes(b) || feelings.includes(b))) {
        score += SCORING_WEIGHTS.TRIGGER_MATCH;
        reasons.push('Helps with what you\'re facing');
      }
    } else if (source === 'tip_science') {
      score += SCORING_WEIGHTS.TIP_ASSOCIATED_SCIENCE;
      reasons.push('Learn why this tip works');

      // Bonus for matching science preference
      const science = card as AssociatedScience;
      const userPref = userProfile?.science_interest || 'moderate';
      if ((userPref === 'high' && science.science_depth === 'deep') ||
          (userPref === 'moderate' && science.science_depth === 'moderate') ||
          (userPref === 'low' && science.science_depth === 'light')) {
        score += SCORING_WEIGHTS.SCIENCE_PREFERENCE_MATCH;
        reasons.push('Matches your learning style');
      }
    } else {
      // Motivation card scoring
      const motivationCard = card as MotivationCardDefinition;
      score += motivationCard.priority || 0;

      // Trigger matching
      if (motivationCard.triggers.feelings?.some(f => feelings.includes(f))) {
        score += SCORING_WEIGHTS.TRIGGER_MATCH;
        reasons.push('Matches your feelings');
      }

      if (motivationCard.triggers.obstacles?.some(o => obstacles.includes(o))) {
        score += SCORING_WEIGHTS.TRIGGER_MATCH;
        reasons.push('Addresses your obstacles');
      }

      if (motivationCard.triggers.helpers?.some(h => helpers.includes(h))) {
        score += SCORING_WEIGHTS.TRIGGER_MATCH * 0.5;
        reasons.push('Builds on what\'s working');
      }

      // Area match
      if (motivationCard.triggers.areas?.includes(tipArea)) {
        score += SCORING_WEIGHTS.AREA_MATCH;
        reasons.push('Relevant to your focus area');
      }

      // Tip meta matching (goals, mechanisms, drivers)
      if (currentTip && motivationCard.triggers) {
        let metaMatches = 0;

        if (motivationCard.triggers.tipGoals?.some(g => currentTip.goals?.includes(g))) {
          metaMatches++;
        }
        if (motivationCard.triggers.tipMechanisms?.some(m => currentTip.mechanisms?.includes(m))) {
          metaMatches++;
        }

        if (metaMatches > 0) {
          score += SCORING_WEIGHTS.TIP_META_MATCH * metaMatches;
          reasons.push('Related to your current tip');
        }
      }

      // Pattern-based penalty
      if (patterns && motivationCard.attributes) {
        const matchesDisliked = patterns.dislikedTones?.includes(motivationCard.attributes.tone) ||
          patterns.dislikedScienceDepths?.includes(motivationCard.attributes.science_depth) ||
          patterns.dislikedCategories?.includes(motivationCard.attributes.category);

        if (matchesDisliked) {
          score += SCORING_WEIGHTS.PATTERN_MISMATCH;
        }
      }
    }

    // === Engagement history scoring (applies to all card types) ===
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
      reasons.push('New for you');
    }

    return { total: Math.max(0, score), reasons };
  }

  /**
   * Select cards with "relevant surprise" logic
   * 10% chance of swapping a top card with a relevant unseen card
   */
  private selectWithRelevantSurprise(scoredCards: ScoredCard[], maxCards: number): ScoredCard[] {
    if (scoredCards.length <= maxCards) {
      return scoredCards;
    }

    const selected = scoredCards.slice(0, maxCards);

    // With 10% probability, swap the last selected card with a "relevant surprise"
    if (Math.random() < RELEVANT_SURPRISE_PROBABILITY) {
      // Find cards that are relevant but not in top selections
      const remainingRelevant = scoredCards.slice(maxCards).filter(card => {
        // Consider "relevant" if score > 0 and has match reasons
        return card.score > 0 && card.matchReasons.length > 0;
      });

      // Further filter to cards the user hasn't seen before
      const unseenRelevant = remainingRelevant.filter(card =>
        card.matchReasons.includes('New for you') || card.matchReasons.includes('New insight for you')
      );

      const surprisePool = unseenRelevant.length > 0 ? unseenRelevant : remainingRelevant;

      if (surprisePool.length > 0) {
        // Pick a random card from the surprise pool
        const surpriseCard = surprisePool[Math.floor(Math.random() * surprisePool.length)];

        // Replace the last selected card with the surprise
        selected[selected.length - 1] = surpriseCard;
        console.log('🎲 Relevant surprise card selected:', this.getCardId(surpriseCard.card));
      }
    }

    return selected;
  }

  /**
   * Filter out cards that shouldn't be shown (legacy method for backward compatibility)
   */
  private filterAvailableCards(
    allCards: MotivationCardDefinition[],
    tipArea: string,
    excludeCardIds: string[],
    engagementHistory: Map<string, CardEngagementRecord>
  ): MotivationCardDefinition[] {
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
   * Calculate priority score for a card (legacy method)
   */
  private calculateCardScore(
    card: MotivationCardDefinition,
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
    if (card.triggers.feelings?.some((f: string) => feelings.includes(f))) {
      score += SCORING_WEIGHTS.TRIGGER_MATCH;
      reasons.push('Matches your feelings');
    }

    if (card.triggers.obstacles?.some((o: string) => obstacles.includes(o))) {
      score += SCORING_WEIGHTS.TRIGGER_MATCH;
      reasons.push('Addresses your obstacles');
    }

    if (card.triggers.helpers?.some((h: string) => helpers.includes(h))) {
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

    // Track limits per type
    const typeLimits: Record<string, number> = {
      quiz: 1,
      progressive_quiz: 1,
      tool: 1,
      tip_tool: 1,      // Tip-associated tool
      tip_science: 1    // Tip-associated science
    };
    const typeCount: Record<string, number> = {};

    for (const card of cards) {
      if (result.length >= maxCards) break;

      // Determine card type (handle all card sources)
      let cardType: string;
      if ('tool_id' in card.card) {
        cardType = 'tip_tool';
      } else if ('card_id' in card.card && 'science_depth' in card.card) {
        cardType = 'tip_science';
      } else {
        cardType = (card.card as MotivationCardDefinition).type;
      }

      const limit = typeLimits[cardType];
      const currentCount = typeCount[cardType] || 0;

      // Check if we've hit the limit for this type
      if (limit !== undefined && currentCount >= limit) {
        continue;
      }

      result.push(card);
      typeCount[cardType] = currentCount + 1;
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
      tipId?: string;
      feelings: string[];
      obstacles: string[];
      helpers?: string[];
    }
  ): Promise<void> {
    const timeOfDay = this.getTimeOfDay();

    for (const scoredCard of cards) {
      // Determine card ID and type based on card source
      let cardId: string;
      let cardType: CardType;

      if ('tool_id' in scoredCard.card) {
        cardId = scoredCard.card.tool_id;
        cardType = 'tool';
      } else if ('card_id' in scoredCard.card && 'science_depth' in scoredCard.card) {
        cardId = scoredCard.card.card_id;
        cardType = 'fact'; // Science cards are treated as facts
      } else {
        cardId = (scoredCard.card as MotivationCardDefinition).id;
        cardType = (scoredCard.card as MotivationCardDefinition).type;
      }

      await AnalyticsService.trackCardShown(
        cardId,
        cardType,
        {
          tipArea: context.tipArea,
          tipId: context.tipId,
          feelings: context.feelings,
          obstacles: context.obstacles,
          helpers: context.helpers,
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
