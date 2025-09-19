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
  addDoc,
  updateDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { firebaseConfig, COLLECTION_NAMES } from '@/config/firebase';
import { UserProfile, DailyTip, TipAttempt, Tip } from '@/types/tip';

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
  async trackTipPresented(tip: Tip, userProfile: UserProfile, context: {
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
      tip_type: tip.tip_type?.join(',') || 'unknown',
      difficulty_tier: tip.difficulty_tier || 0,
      goal_alignment: tip.goal_tags?.join(',') || 'none',
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
          type: tip.tip_type,
          difficulty: tip.difficulty_tier,
          goals: tip.goal_tags,
          time_cost: tip.time_cost_enum,
          money_cost: tip.money_cost_enum,
          mental_effort: tip.mental_effort,
          physical_effort: tip.physical_effort
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
    response: 'try_it' | 'maybe_later' | 'not_for_me',
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
}

export default new AnalyticsService();