import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAnalytics,
  Analytics,
  logEvent,
  setUserId,
  setUserProperties
} from 'firebase/analytics';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  increment,
  arrayUnion
} from 'firebase/firestore';
import { firebaseConfig, COLLECTION_NAMES } from '@/config/firebase';
import { UserProfile, DailyTip, TipAttempt } from '@/types/tip';
import { SimplifiedTip } from '@/types/simplifiedTip';
import {
  CardType,
  CardFeedback,
  CardShowContext,
  CardEngagementRecord,
  NotHelpfulCardAttributes,
  NotHelpfulContext,
  NotHelpfulLogEntry,
  UserCardPatterns
} from '@/types/cardEngagement';

class AnalyticsService {
  private app: FirebaseApp | null = null;
  private analytics: Analytics | null = null;
  private firestore: Firestore | null = null;
  private userId: string | null = null;
  private sessionId: string | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    try {
      // Only initialize if we have valid config
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        this.app = initializeApp(firebaseConfig);
        this.analytics = getAnalytics(this.app);
        this.firestore = getFirestore(this.app);
        this.isInitialized = true;
        this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log('🔥 Firebase initialized successfully');
      } else {
        console.log('⚠️ Firebase not configured - analytics disabled');
      }
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
    }
  }

  // Set user ID for tracking
  async setUser(userProfile: UserProfile) {
    if (!this.isInitialized || !this.analytics || !this.firestore) return;

    this.userId = userProfile.id;
    setUserId(this.analytics, userProfile.id);

    // Set user properties for segmentation
    const userProperties = {
      age_group: this.getAgeGroup(userProfile.age),
      has_medical_conditions: (userProfile.medical_conditions?.length || 0) > 0 ? 'yes' : 'no',
      goal_count: String(userProfile.goals?.length || 0),
      primary_goal: userProfile.goals?.[0] || 'none',
      cooking_time: userProfile.cooking_time_available || 'unknown',
      budget_conscious: userProfile.budget_conscious ? 'yes' : 'no',
      wants_cooking_learning: userProfile.wants_to_learn_cooking ? 'yes' : 'no',
      quiz_completed: userProfile.quiz_responses ? 'yes' : 'no'
    };

    setUserProperties(this.analytics, userProperties);

    // Store user profile in Firestore for analysis
    try {
      await setDoc(doc(this.firestore, COLLECTION_NAMES.USER_PROFILES, userProfile.id), {
        ...this.sanitizeUserProfile(userProfile),
        updated_at: serverTimestamp(),
        last_session_id: this.sessionId
      }, { merge: true });
    } catch (error) {
      console.error('Failed to store user profile:', error);
    }
  }

  // Track when a tip is presented to user
  async trackTipPresented(tip: SimplifiedTip, userProfile: UserProfile, context: {
    isFromSavedList?: boolean;
    isFocusMode?: boolean;
    dayOfWeek?: number;
    hourOfDay?: number;
    daysSinceOnboarding?: number;
  } = {}) {
    if (!this.isInitialized || !this.analytics || !this.firestore) return;

    // Log to Firebase Analytics
    logEvent(this.analytics, 'tip_presented', {
      tip_id: tip.tip_id,
      tip_type: tip.mechanisms?.join(',') || 'unknown',
      difficulty_tier: tip.difficulty || 0,
      goal_alignment: tip.goals?.join(',') || 'none',
      is_saved_tip: context.isFromSavedList ? 1 : 0,
      is_focus_mode: context.isFocusMode ? 1 : 0,
      hour_of_day: context.hourOfDay || new Date().getHours(),
      day_of_week: context.dayOfWeek || new Date().getDay()
    });

    // Store detailed interaction in Firestore
    try {
      await addDoc(collection(this.firestore, COLLECTION_NAMES.TIP_INTERACTIONS), {
        user_id: this.userId,
        session_id: this.sessionId,
        tip_id: tip.tip_id,
        tip_metadata: {
          type: tip.mechanisms,
          difficulty: tip.difficulty,
          goals: tip.goals,
          time_cost: tip.time,
          money_cost: tip.cost,
          effort: tip.effort
        },
        user_context: {
          user_goals: userProfile.goals,
          user_conditions: userProfile.medical_conditions,
          days_since_start: Math.floor((Date.now() - new Date(userProfile.created_at).getTime()) / (1000 * 60 * 60 * 24))
        },
        presentation_context: context,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to track tip presentation:', error);
    }
  }

  // Track user's initial response to tip
  async trackTipResponse(
    tipId: string,
    response: 'try_it' | 'maybe_later' | 'not_interested',
    rejectionReason?: string
  ) {
    if (!this.isInitialized || !this.analytics || !this.firestore) return;

    // Log to Firebase Analytics
    logEvent(this.analytics, 'tip_response', {
      tip_id: tipId,
      response: response,
      rejection_reason: rejectionReason || 'none'
    });

    // Store in Firestore
    try {
      await addDoc(collection(this.firestore, COLLECTION_NAMES.TIP_OUTCOMES), {
        user_id: this.userId,
        session_id: this.sessionId,
        tip_id: tipId,
        initial_response: response,
        rejection_reason: rejectionReason,
        response_timestamp: serverTimestamp()
      });

      // Update aggregated stats for this tip
      await this.updateTipStats(tipId, response, 'response');
    } catch (error) {
      console.error('Failed to track tip response:', error);
    }
  }

  // Track evening check-in result
  async trackCheckIn(
    tipId: string,
    result: 'went_great' | 'went_ok' | 'not_great' | 'didnt_try',
    reflection?: string,
    personalizationUsed?: boolean
  ) {
    if (!this.isInitialized || !this.analytics || !this.firestore) return;

    // Log to Firebase Analytics
    logEvent(this.analytics, 'tip_checkin', {
      tip_id: tipId,
      result: result,
      used_personalization: personalizationUsed ? 1 : 0,
      success: result === 'went_great' ? 1 : 0
    });

    // Store in Firestore
    try {
      await addDoc(collection(this.firestore, COLLECTION_NAMES.TIP_OUTCOMES), {
        user_id: this.userId,
        session_id: this.sessionId,
        tip_id: tipId,
        checkin_result: result,
        reflection: reflection,
        personalization_used: personalizationUsed,
        checkin_timestamp: serverTimestamp()
      });

      // Update aggregated stats
      await this.updateTipStats(tipId, result, 'checkin');
    } catch (error) {
      console.error('Failed to track check-in:', error);
    }
  }

  // Track when a tip becomes a loved habit
  async trackHabitLoved(tipId: string, daysToLove: number) {
    if (!this.isInitialized || !this.analytics || !this.firestore) return;

    logEvent(this.analytics, 'habit_loved', {
      tip_id: tipId,
      days_to_love: daysToLove
    });

    try {
      await this.updateTipStats(tipId, 'loved', 'habit');
    } catch (error) {
      console.error('Failed to track habit loved:', error);
    }
  }

  // Track focus mode engagement
  async trackFocusMode(tipId: string, action: 'started' | 'completed' | 'abandoned', daysCompleted?: number) {
    if (!this.isInitialized || !this.analytics) return;

    logEvent(this.analytics, 'focus_mode', {
      tip_id: tipId,
      action: action,
      days_completed: daysCompleted || 0
    });
  }

  // Update aggregated statistics for tips
  private async updateTipStats(
    tipId: string,
    outcome: string,
    type: 'response' | 'checkin' | 'habit'
  ) {
    if (!this.firestore) return;

    const statsRef = doc(this.firestore, COLLECTION_NAMES.AGGREGATED_TIP_STATS, tipId);

    const updates: any = {
      last_updated: serverTimestamp()
    };

    switch (type) {
      case 'response':
        updates[`responses.${outcome}`] = increment(1);
        updates['total_presentations'] = increment(1);
        break;
      case 'checkin':
        updates[`checkins.${outcome}`] = increment(1);
        break;
      case 'habit':
        updates['times_loved'] = increment(1);
        break;
    }

    try {
      await setDoc(statsRef, updates, { merge: true });
    } catch (error) {
      console.error('Failed to update tip stats:', error);
    }
  }

  // Helper to get age group for segmentation
  private getAgeGroup(age?: number): string {
    if (!age) return 'unknown';
    if (age < 18) return 'under_18';
    if (age < 25) return '18_24';
    if (age < 35) return '25_34';
    if (age < 45) return '35_44';
    if (age < 55) return '45_54';
    if (age < 65) return '55_64';
    return '65_plus';
  }

  // Remove sensitive data from user profile
  private sanitizeUserProfile(profile: UserProfile) {
    const { id, goals, medical_conditions, age, created_at, ...rest } = profile;
    return {
      id,
      goals,
      medical_conditions: medical_conditions?.length || 0, // Store count, not actual conditions
      age_group: this.getAgeGroup(age),
      created_at,
      ...rest
    };
  }

  // Track custom events
  async trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (!this.isInitialized || !this.analytics) return;
    logEvent(this.analytics, eventName, parameters);
  }

  // ==========================================
  // CARD ENGAGEMENT TRACKING
  // ==========================================

  // Generate document ID for card engagement
  private getCardEngagementDocId(cardId: string): string {
    return `${this.userId}_${cardId}`;
  }

  // Track when a card is shown to user
  async trackCardShown(cardId: string, cardType: CardType, context: CardShowContext = {}) {
    if (!this.isInitialized || !this.analytics || !this.firestore || !this.userId) return;

    // Log to Firebase Analytics
    logEvent(this.analytics, 'card_shown', {
      card_id: cardId,
      card_type: cardType,
      tip_area: context.tipArea || 'unknown',
      time_of_day: context.timeOfDay || 'unknown'
    });

    // Update or create engagement record in Firestore
    try {
      const docId = this.getCardEngagementDocId(cardId);
      const docRef = doc(this.firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Update existing record
        const updates: any = {
          lastShownAt: serverTimestamp(),
          totalShownCount: increment(1),
          ignoredCount: increment(1), // Assume ignored until tapped
          updatedAt: serverTimestamp()
        };

        // Add context to arrays if provided
        if (context.tipArea) {
          updates.shownWithAreas = arrayUnion(context.tipArea);
        }
        if (context.feelings && context.feelings.length > 0) {
          updates.shownAfterFeelings = arrayUnion(...context.feelings);
        }
        if (context.obstacles && context.obstacles.length > 0) {
          updates.shownAfterObstacles = arrayUnion(...context.obstacles);
        }

        await updateDoc(docRef, updates);
      } else {
        // Create new record
        const newRecord: Partial<CardEngagementRecord> = {
          odId: docId,
          cardId,
          cardType,
          firstShownAt: new Date(),
          lastShownAt: new Date(),
          totalShownCount: 1,
          tappedCount: 0,
          completedCount: 0,
          ignoredCount: 1, // Assume ignored until tapped
          totalTimeSpentMs: 0,
          helpfulCount: 0,
          notHelpfulCount: 0,
          lastFeedback: null,
          lastFeedbackAt: null,
          shownWithAreas: context.tipArea ? [context.tipArea] : [],
          shownAfterFeelings: context.feelings || [],
          shownAfterObstacles: context.obstacles || [],
          updatedAt: new Date()
        };

        await setDoc(docRef, {
          ...newRecord,
          firstShownAt: serverTimestamp(),
          lastShownAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Failed to track card shown:', error);
    }
  }

  // Track when user taps/opens a card
  async trackCardTapped(cardId: string) {
    if (!this.isInitialized || !this.analytics || !this.firestore || !this.userId) return;

    logEvent(this.analytics, 'card_tapped', { card_id: cardId });

    try {
      const docId = this.getCardEngagementDocId(cardId);
      const docRef = doc(this.firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS, docId);

      await updateDoc(docRef, {
        tappedCount: increment(1),
        ignoredCount: increment(-1), // Decrement ignored since they engaged
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to track card tapped:', error);
    }
  }

  // Track when user completes reading/viewing a card
  async trackCardCompleted(cardId: string, timeSpentMs: number) {
    if (!this.isInitialized || !this.analytics || !this.firestore || !this.userId) return;

    logEvent(this.analytics, 'card_completed', {
      card_id: cardId,
      time_spent_ms: timeSpentMs
    });

    try {
      const docId = this.getCardEngagementDocId(cardId);
      const docRef = doc(this.firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS, docId);

      await updateDoc(docRef, {
        completedCount: increment(1),
        totalTimeSpentMs: increment(timeSpentMs),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to track card completed:', error);
    }
  }

  // Track user feedback (helpful/not helpful)
  async trackCardFeedback(cardId: string, helpful: boolean) {
    if (!this.isInitialized || !this.analytics || !this.firestore || !this.userId) return;

    const feedback: CardFeedback = helpful ? 'helpful' : 'not_helpful';

    logEvent(this.analytics, 'card_feedback', {
      card_id: cardId,
      feedback: feedback
    });

    try {
      const docId = this.getCardEngagementDocId(cardId);
      const docRef = doc(this.firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS, docId);

      const updates: any = {
        lastFeedback: feedback,
        lastFeedbackAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (helpful) {
        updates.helpfulCount = increment(1);
      } else {
        updates.notHelpfulCount = increment(1);
      }

      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Failed to track card feedback:', error);
    }
  }

  // Track when user starts a tool activity
  async trackToolStarted(cardId: string) {
    if (!this.isInitialized || !this.analytics || !this.firestore || !this.userId) return;

    logEvent(this.analytics, 'tool_started', { card_id: cardId });

    try {
      const docId = this.getCardEngagementDocId(cardId);
      const docRef = doc(this.firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS, docId);

      await updateDoc(docRef, {
        toolStartedCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to track tool started:', error);
    }
  }

  // Track when user completes a tool activity
  async trackToolCompleted(cardId: string) {
    if (!this.isInitialized || !this.analytics || !this.firestore || !this.userId) return;

    logEvent(this.analytics, 'tool_completed', { card_id: cardId });

    try {
      const docId = this.getCardEngagementDocId(cardId);
      const docRef = doc(this.firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS, docId);

      await updateDoc(docRef, {
        toolCompletedCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to track tool completed:', error);
    }
  }

  // Track quiz answer (for regular and progressive quizzes)
  async trackQuizAnswer(cardId: string, correct: boolean, level?: number) {
    if (!this.isInitialized || !this.analytics || !this.firestore || !this.userId) return;

    logEvent(this.analytics, 'quiz_answered', {
      card_id: cardId,
      correct: correct ? 1 : 0,
      level: level || 1
    });

    try {
      const docId = this.getCardEngagementDocId(cardId);
      const docRef = doc(this.firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS, docId);

      const updates: any = {
        quizAttempts: increment(1),
        updatedAt: serverTimestamp()
      };

      if (correct) {
        updates.quizCorrectCount = increment(1);
      }

      if (level !== undefined) {
        updates.currentQuizLevel = level;
      }

      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Failed to track quiz answer:', error);
    }
  }

  // Mark a quiz as mastered
  async markQuizMastered(cardId: string) {
    if (!this.isInitialized || !this.firestore || !this.userId) return;

    try {
      const docId = this.getCardEngagementDocId(cardId);
      const docRef = doc(this.firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS, docId);

      await updateDoc(docRef, {
        quizMastered: true,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to mark quiz mastered:', error);
    }
  }

  // Get card engagement record for a specific card
  async getCardEngagement(cardId: string): Promise<CardEngagementRecord | null> {
    if (!this.isInitialized || !this.firestore || !this.userId) return null;

    try {
      const docId = this.getCardEngagementDocId(cardId);
      const docRef = doc(this.firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as CardEngagementRecord;
      }
      return null;
    } catch (error) {
      console.error('Failed to get card engagement:', error);
      return null;
    }
  }

  // Get user ID (for card selection service)
  getUserId(): string | null {
    return this.userId;
  }

  // Get Firestore instance (for card selection service)
  getFirestore(): Firestore | null {
    return this.firestore;
  }

  // ==========================================
  // ENHANCED NOT HELPFUL LOGGING
  // ==========================================

  /**
   * Track when user marks a card as "not helpful" with full context for pattern detection.
   * This logs detailed attributes about the card and user's context to identify
   * what types of cards don't work for specific users.
   */
  async trackNotHelpfulWithContext(
    cardId: string,
    cardType: CardType,
    cardAttributes: NotHelpfulCardAttributes,
    context: NotHelpfulContext
  ) {
    if (!this.isInitialized || !this.analytics || !this.firestore || !this.userId) return;

    // Log to Firebase Analytics
    logEvent(this.analytics, 'card_not_helpful', {
      card_id: cardId,
      card_type: cardType,
      tone: cardAttributes.tone,
      science_depth: cardAttributes.science_depth,
      category: cardAttributes.category,
      tip_area: context.tipArea,
      time_of_day: context.timeOfDay
    });

    try {
      // 1. Update the card engagement record (existing behavior)
      const engagementDocId = this.getCardEngagementDocId(cardId);
      const engagementDocRef = doc(this.firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS, engagementDocId);

      await updateDoc(engagementDocRef, {
        lastFeedback: 'not_helpful',
        lastFeedbackAt: serverTimestamp(),
        notHelpfulCount: increment(1),
        updatedAt: serverTimestamp()
      });

      // 2. Log detailed entry to NOT_HELPFUL_LOGS collection
      const logId = `${this.userId}_${cardId}_${Date.now()}`;
      const logEntry: Omit<NotHelpfulLogEntry, 'timestamp'> & { timestamp: any } = {
        id: logId,
        userId: this.userId,
        cardId,
        cardType,
        cardAttributes,
        context,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(this.firestore, COLLECTION_NAMES.NOT_HELPFUL_LOGS), logEntry);

      // 3. Update user's pattern aggregates
      await this.updateUserCardPatterns(cardAttributes, context);

    } catch (error) {
      console.error('Failed to track not helpful with context:', error);
    }
  }

  /**
   * Update user's card patterns based on new "not helpful" feedback.
   * This aggregates patterns over time to identify what types of cards don't work for the user.
   */
  private async updateUserCardPatterns(
    cardAttributes: NotHelpfulCardAttributes,
    context: NotHelpfulContext
  ) {
    if (!this.firestore || !this.userId) return;

    try {
      const patternsDocRef = doc(this.firestore, COLLECTION_NAMES.USER_CARD_PATTERNS, this.userId);
      const patternsSnap = await getDoc(patternsDocRef);

      if (patternsSnap.exists()) {
        // Update existing patterns
        const updates: any = {
          totalNotHelpfulCount: increment(1),
          lastUpdated: serverTimestamp()
        };

        // Add to arrays for pattern detection
        // Tone tracking
        updates[`toneNotHelpfulCounts.${cardAttributes.tone}`] = increment(1);

        // Science depth tracking
        updates[`scienceDepthNotHelpfulCounts.${cardAttributes.science_depth}`] = increment(1);

        // Category tracking
        updates[`categoryNotHelpfulCounts.${cardAttributes.category}`] = increment(1);

        // Time of day tracking
        updates[`timeOfDayNotHelpfulCounts.${context.timeOfDay}`] = increment(1);

        // Active card tracking
        if (cardAttributes.requires_action) {
          updates.activeCardNotHelpfulCount = increment(1);
        }

        // Privacy required tracking
        if (cardAttributes.requires_privacy) {
          updates.privacyRequiredNotHelpfulCount = increment(1);
        }

        // Feeling-based tracking (when tired, stressed, etc.)
        if (context.userFeeling.includes('tired') || context.userFeeling.includes('exhausted')) {
          updates.notHelpfulWhenTiredCount = increment(1);
        }
        if (context.userFeeling.includes('stressed') || context.userFeeling.includes('anxious')) {
          updates.notHelpfulWhenStressedCount = increment(1);
        }

        await updateDoc(patternsDocRef, updates);
      } else {
        // Create new patterns record
        const newPatterns = {
          userId: this.userId,
          totalNotHelpfulCount: 1,

          // Initialize counts
          toneNotHelpfulCounts: {
            [cardAttributes.tone]: 1
          },
          scienceDepthNotHelpfulCounts: {
            [cardAttributes.science_depth]: 1
          },
          categoryNotHelpfulCounts: {
            [cardAttributes.category]: 1
          },
          timeOfDayNotHelpfulCounts: {
            [context.timeOfDay]: 1
          },
          activeCardNotHelpfulCount: cardAttributes.requires_action ? 1 : 0,
          privacyRequiredNotHelpfulCount: cardAttributes.requires_privacy ? 1 : 0,
          notHelpfulWhenTiredCount: (context.userFeeling.includes('tired') || context.userFeeling.includes('exhausted')) ? 1 : 0,
          notHelpfulWhenStressedCount: (context.userFeeling.includes('stressed') || context.userFeeling.includes('anxious')) ? 1 : 0,

          lastUpdated: serverTimestamp()
        };

        await setDoc(patternsDocRef, newPatterns);
      }
    } catch (error) {
      console.error('Failed to update user card patterns:', error);
    }
  }

  /**
   * Get user's card patterns for use in card selection.
   * Returns computed patterns based on aggregated "not helpful" feedback.
   */
  async getUserCardPatterns(): Promise<UserCardPatterns | null> {
    if (!this.isInitialized || !this.firestore || !this.userId) return null;

    try {
      const patternsDocRef = doc(this.firestore, COLLECTION_NAMES.USER_CARD_PATTERNS, this.userId);
      const patternsSnap = await getDoc(patternsDocRef);

      if (!patternsSnap.exists()) return null;

      const data = patternsSnap.data();
      const totalCount = data.totalNotHelpfulCount || 0;

      // Only compute patterns if we have enough data (at least 5 not helpful marks)
      if (totalCount < 5) {
        return {
          userId: this.userId,
          totalNotHelpfulCount: totalCount,
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        };
      }

      // Compute disliked tones (if > 40% of not helpful cards have this tone)
      const dislikedTones: UserCardPatterns['dislikedTones'] = [];
      const toneCounts = data.toneNotHelpfulCounts || {};
      for (const tone of ['gentle', 'energizing', 'neutral', 'playful', 'serious'] as const) {
        if ((toneCounts[tone] || 0) / totalCount > 0.4) {
          dislikedTones.push(tone);
        }
      }

      // Compute disliked science depths
      const dislikedScienceDepths: UserCardPatterns['dislikedScienceDepths'] = [];
      const depthCounts = data.scienceDepthNotHelpfulCounts || {};
      for (const depth of ['light', 'moderate', 'deep'] as const) {
        if ((depthCounts[depth] || 0) / totalCount > 0.4) {
          dislikedScienceDepths.push(depth);
        }
      }

      // Compute disliked categories
      const dislikedCategories: string[] = [];
      const categoryCounts = data.categoryNotHelpfulCounts || {};
      for (const category in categoryCounts) {
        if ((categoryCounts[category] || 0) / totalCount > 0.3) {
          dislikedCategories.push(category);
        }
      }

      // Compute unhelpful times of day
      const unhelpfulTimeOfDay: UserCardPatterns['unhelpfulTimeOfDay'] = [];
      const timeCounts = data.timeOfDayNotHelpfulCounts || {};
      for (const time of ['morning', 'afternoon', 'evening', 'night'] as const) {
        if ((timeCounts[time] || 0) / totalCount > 0.4) {
          unhelpfulTimeOfDay.push(time);
        }
      }

      return {
        userId: this.userId,
        dislikedTones: dislikedTones.length > 0 ? dislikedTones : undefined,
        dislikedScienceDepths: dislikedScienceDepths.length > 0 ? dislikedScienceDepths : undefined,
        dislikedCategories: dislikedCategories.length > 0 ? dislikedCategories : undefined,
        dislikesActiveCards: (data.activeCardNotHelpfulCount || 0) / totalCount > 0.5,
        dislikesPrivacyRequired: (data.privacyRequiredNotHelpfulCount || 0) / totalCount > 0.5,
        unhelpfulWhenTired: (data.notHelpfulWhenTiredCount || 0) / totalCount > 0.4,
        unhelpfulWhenStressed: (data.notHelpfulWhenStressedCount || 0) / totalCount > 0.4,
        unhelpfulTimeOfDay: unhelpfulTimeOfDay.length > 0 ? unhelpfulTimeOfDay : undefined,
        totalNotHelpfulCount: totalCount,
        lastUpdated: data.lastUpdated?.toDate() || new Date()
      };
    } catch (error) {
      console.error('Failed to get user card patterns:', error);
      return null;
    }
  }

  /**
   * Check if a specific card has been marked as not helpful by this user.
   * Used to permanently suppress cards the user found unhelpful.
   */
  async isCardMarkedNotHelpful(cardId: string): Promise<boolean> {
    if (!this.isInitialized || !this.firestore || !this.userId) return false;

    try {
      const docId = this.getCardEngagementDocId(cardId);
      const docRef = doc(this.firestore, COLLECTION_NAMES.CARD_ENGAGEMENTS, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.lastFeedback === 'not_helpful';
      }
      return false;
    } catch (error) {
      console.error('Failed to check if card is marked not helpful:', error);
      return false;
    }
  }

  /**
   * Check if card attributes match user's disliked patterns.
   * Returns true if we should avoid showing this card based on detected patterns.
   */
  async shouldAvoidCardBasedOnPatterns(
    cardAttributes: NotHelpfulCardAttributes,
    context?: Partial<NotHelpfulContext>
  ): Promise<boolean> {
    const patterns = await this.getUserCardPatterns();
    if (!patterns) return false;

    // Check tone
    if (patterns.dislikedTones?.includes(cardAttributes.tone)) {
      return true;
    }

    // Check science depth
    if (patterns.dislikedScienceDepths?.includes(cardAttributes.science_depth)) {
      return true;
    }

    // Check category
    if (patterns.dislikedCategories?.includes(cardAttributes.category)) {
      return true;
    }

    // Check active cards
    if (patterns.dislikesActiveCards && cardAttributes.requires_action) {
      return true;
    }

    // Check privacy required
    if (patterns.dislikesPrivacyRequired && cardAttributes.requires_privacy) {
      return true;
    }

    // Check context-based patterns
    if (context) {
      // Check time of day
      if (context.timeOfDay && patterns.unhelpfulTimeOfDay?.includes(context.timeOfDay)) {
        return true;
      }

      // Check if user is tired
      if (patterns.unhelpfulWhenTired &&
          context.userFeeling?.some(f => f === 'tired' || f === 'exhausted')) {
        return true;
      }

      // Check if user is stressed
      if (patterns.unhelpfulWhenStressed &&
          context.userFeeling?.some(f => f === 'stressed' || f === 'anxious')) {
        return true;
      }
    }

    return false;
  }
}

export default new AnalyticsService();