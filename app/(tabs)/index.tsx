import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  setCurrentTip as setCurrentTipRedux, 
  setDailyTip as setDailyTipRedux, 
  savePersonalizationData, 
  setTipReasons as setTipReasonsRedux,
  startFocusMode,
  selectIsInFocusMode,
  selectFocusTipId,
  selectFocusProgress
} from '@/store/slices/dailyTipSlice';
import OnboardingQuizNew from '@/components/OnboardingQuizNew';
import DailyTipCardSwipe from '@/components/DailyTipCardSwipe';
import DailyTipCardEnhanced from '@/components/DailyTipCardEnhanced';
import EveningCheckIn from '@/components/EveningCheckIn';
import ExperimentModeSwipe from '@/components/ExperimentModeSwipe';
import ExperimentComplete from '@/components/ExperimentComplete';
import NotForMeFeedback from '@/components/NotForMeFeedback';
import RejectedTipView from '@/components/RejectedTipView';
import TipHistoryModal from '@/components/TipHistoryModal';
import TestDataCalendar from '@/components/TestDataCalendar';
import { useCurrentDate, useDateSimulation } from '@/contexts/DateSimulationContext';
import IdentityQuizStep from '@/components/quiz/IdentityQuizStep';
import AwardsModal from '@/components/AwardsModal';
import AwardBanner from '@/components/AwardBanner';
import FocusModePrompt from '@/components/FocusModePrompt';
import StorageService from '@/services/storage';
import { tipRecommendationService } from '@/services/tipRecommendation';
import NotificationService from '@/services/notifications';
import AwardService from '@/services/awardService';
import AnalyticsService from '@/services/analytics';
import { preloadImages } from '@/services/imagePreloader';
import { useAwards, useAwardTrigger } from '@/hooks/useAwards';
import { UserProfile, DailyTip, TipAttempt, TipFeedback, QuickComplete } from '@/types/tip';
import { SimplifiedTip } from '@/types/simplifiedTip';
import { getTipById } from '@/data/simplifiedTips';
import { ThemeKey } from '@/constants/Themes';
import { format } from 'date-fns';

// Proper type definitions to prevent confusion
type ResponseStatus = 'try_it' | 'not_interested' | 'maybe_later';

type QuickNote = NonNullable<QuickComplete['quick_note']>;
type InsightSource = 'quick-complete' | 'evening-check-in';

// Validation helper
const isValidResponseStatus = (value: any): value is ResponseStatus => {
  return value === 'try_it' || value === 'not_interested' || value === 'maybe_later';
};

// Normalize legacy or invalid response values
const normalizeResponseStatus = (value: any): ResponseStatus | undefined => {
  if (!value) return undefined;
  // Handle legacy 'not_for_me' values (map to new 'not_interested')
  if (value === 'not_for_me') return 'not_interested';
  // Only return if it's a valid status
  return isValidResponseStatus(value) ? value : undefined;
};

// ---- Saved tips helpers ----

// Returns Tip[] that were "maybe_later" and are now due,
// using DailyTips as the source since that's where the saved status is stored
const getSavedTipsDue = (allAttempts: TipAttempt[], dailyTips?: DailyTip[], currentDate?: Date): SimplifiedTip[] => {
  const now = currentDate || new Date();
  
  console.log('STAR - Getting saved tips due.');
  console.log('STAR - Total attempts:', allAttempts.length);
  console.log('STAR - Total daily tips:', dailyTips?.length || 0);
  
  if (!dailyTips || dailyTips.length === 0) {
    console.log('STAR - No daily tips provided, returning empty array');
    return [];
  }
  
  // Find all daily tips that were saved for later
  const savedTips = dailyTips.filter(dt => dt.user_response === 'maybe_later');
  console.log('STAR - DailyTips with maybe_later:', savedTips.map(dt => ({
    tip_id: dt.tip_id,
    user_response: dt.user_response,
    presented_date: dt.presented_date
  })));
  
  // For each saved tip, check if there's a corresponding TipAttempt to get snooze_until
  const savedWithSnooze = savedTips.map(dt => {
    const attempt = allAttempts.find(a => a.tip_id === dt.tip_id && a.feedback === 'maybe_later');
    const snoozeUntil = attempt?.snooze_until ? new Date(attempt.snooze_until) : 
                        new Date(dt.presented_date.getTime() + 7 * 24 * 60 * 60 * 1000); // Default 7 days
    const isDue = snoozeUntil <= now;
    
    console.log('STAR - Checking saved tip:', dt.tip_id, 'isDue:', isDue, 'snooze_until:', snoozeUntil);
    
    return {
      dailyTip: dt,
      snoozeUntil,
      isDue
    };
  });
  
  // Filter to only due tips
  const dueTips = savedWithSnooze
    .filter(item => item.isDue)
    .sort((a, b) => a.snoozeUntil.getTime() - b.snoozeUntil.getTime()); // Oldest due first
  
  // Get the actual Tip objects
  const result = dueTips
    .map(item => getTipById(item.dailyTip.tip_id))
    .filter(Boolean) as SimplifiedTip[];
  
  console.log('STAR - Final saved tips due count:', result.length, result.map(t => t.tip_id));
  return result;
};

export default function HomeScreen() {
  // Date simulation
  const currentDate = useCurrentDate();
  const { isSimulating } = useDateSimulation();

  // Redux
  const dispatch = useAppDispatch();
  const reduxSavedData = useAppSelector(state => state.dailyTip.pendingPersonalizationData);
  const isInFocusMode = useAppSelector(selectIsInFocusMode);
  const focusTipId = useAppSelector(selectFocusTipId);
  const focusProgress = useAppSelector(selectFocusProgress);
  
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyTip, setDailyTip] = useState<DailyTip | null>(null);
  const [currentTip, setCurrentTip] = useState<any>(null);
  const [tipReasons, setTipReasons] = useState<string[]>([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [previousTips, setPreviousTips] = useState<DailyTip[]>([]);
  const [attempts, setAttempts] = useState<TipAttempt[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [pendingOptOut, setPendingOptOut] = useState<{ tip: SimplifiedTip; tipId: string; existingFeedback?: string } | null>(null);
  const [rejectedTipInfo, setRejectedTipInfo] = useState<{ tip: SimplifiedTip; attempt?: TipAttempt } | null>(null);
  const [isReplacingTip, setIsReplacingTip] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalTips, setModalTips] = useState<Array<{ dailyTip: DailyTip; tip: SimplifiedTip }>>([]);
  const [showFocusPrompt, setShowFocusPrompt] = useState(false);
  const [showHeaderStats, setShowHeaderStats] = useState(false); // Start with hidden to see the difference
  const [showAwardsModal, setShowAwardsModal] = useState(false);
  const [newAward, setNewAward] = useState<any>(null);
  const [initialAwardsTab, setInitialAwardsTab] = useState<'all' | 'earned' | 'progress'>('all');
  
  // Awards hooks
  const { earnedAwards, allAwards, newAwards, awardProgress, checkForNewAwards, markAwardsSeen } = useAwards();
  const { checkAfterTipResponse, checkAfterCheckIn } = useAwardTrigger();
  const [showTestCalendar, setShowTestCalendar] = useState(false);
  const [showIdentityBuilder, setShowIdentityBuilder] = useState(false);
  const [recentlySurfacedSavedIds, setRecentlySurfacedSavedIds] = useState<string[]>([]);
  const [cycledTipIds, setCycledTipIds] = useState<string[]>([]);
  const [cardThemeKey, setCardThemeKey] = useState<ThemeKey | undefined>(undefined);

  useEffect(() => {
    initializeApp();
  }, []);

  // Track the current date string to detect changes
  const currentDateString = currentDate.toDateString();
  const prevDateRef = useRef<string>();

  // Reload tip data when simulation date changes
  useEffect(() => {
    // Only reload if the date actually changed (not on initial mount)
    if (prevDateRef.current && prevDateRef.current !== currentDateString && userProfile) {
      console.log('🔄 Simulation date changed from', prevDateRef.current, 'to', currentDateString);
      const reloadForNewDate = async () => {
        setLoading(true);
        // Reload tips from storage first to get the latest data
        const tips = await StorageService.getDailyTips();
        setPreviousTips(tips);
        const tipAttempts = await StorageService.getTipAttempts();
        setAttempts(tipAttempts);
        // Now load the tip for the new date
        await loadDailyTip(userProfile, tips, tipAttempts);
        setLoading(false);
      };
      reloadForNewDate();
    }
    prevDateRef.current = currentDateString;
  }, [currentDateString, userProfile]); // Re-run when date changes

  // Dev function to completely reset all data
  const resetAllDataIncludingAwards = async () => {
    console.log('Resetting ALL data including awards...');
    await StorageService.clearAllData(); // This now includes awards
    await AwardService.clearAllAwards(); // Double-check awards are cleared
    console.log('All data cleared, reloading app...');
    setLoading(true);
    setUserProfile(null);
    setDailyTip(null);
    setCurrentTip(null);
    await initializeApp();
  };

  const initializeApp = async () => {
    try {
      console.log('Starting app initialization...');

      // Preload images in parallel with other initialization
      const imagePreloadPromise = preloadImages().catch(err => {
        console.warn('Image preload failed (non-critical):', err);
      });

      // Check if onboarding is completed
      const onboardingCompleted = await StorageService.isOnboardingCompleted();
      console.log('Onboarding completed:', onboardingCompleted);
      
      if (onboardingCompleted) {
        const profile = await StorageService.getUserProfile();
        console.log('User profile loaded:', profile ? 'Yes' : 'No');
        setUserProfile(profile);
        
        // Load previous tips and attempts
        const tips = await StorageService.getDailyTips();
        console.log('Previous tips loaded:', tips.length);
        setPreviousTips(tips);
        
        const tipAttempts = await StorageService.getTipAttempts();
        console.log('Tip attempts loaded:', tipAttempts.length);
        setAttempts(tipAttempts);
        
        // Load today's tip or get a new one - only if profile exists
        if (profile) {
          await loadDailyTip(profile, tips, tipAttempts);
        } else {
          console.error('User profile is null, cannot load daily tip');
        }
        
        // Setup notifications
        await NotificationService.requestPermissions();
      }
      
      console.log('Initialization complete, setting loading to false');
      // Wait for image preloading to complete (but don't block if it fails)
      await imagePreloadPromise;
    } catch (error: any) {
      console.error('Error initializing app:', error);
      console.error('Error stack:', error?.stack);
    } finally {
      console.log('Finally block - setting loading to false');
      setLoading(false);
    }
  };

  const loadDailyTip = async (
    profile: UserProfile,
    tips: DailyTip[],
    tipAttempts: TipAttempt[]
  ) => {
    // Clear any previous state when loading a new day's tip
    setShowCheckIn(false);
    setRejectedTipInfo(null);

    // Ensure profile has required fields
    if (!profile.goals) {
      console.warn('User profile missing goals, initializing empty array');
      profile.goals = [];
    }
    if (!profile.medical_conditions) {
      console.warn('User profile missing medical_conditions, initializing empty array');
      profile.medical_conditions = [];
    }
    
    // Debug logging to understand user profile and history
    console.log('=== USER PROFILE & LEARNING ===');
    console.log('User Profile:', {
      goals: profile.goals,
      medical_conditions: profile.medical_conditions,
      cooking_time: profile.cooking_time_available,
      budget_conscious: profile.budget_conscious,
      wants_to_learn_cooking: profile.wants_to_learn_cooking,
      interested_in_nutrition: profile.interested_in_nutrition_facts,
      quiz_responses: profile.quiz_responses?.length || 0,
    });
    
    // Analyze what's working and not working
    const lovedTips = tips.filter(tip => 
      tip.quick_completions?.some(c => c.quick_note === 'worked_great') ||
      tip.evening_check_in === 'went_great'
    );
    
    const notForMeTips = tips.filter(tip =>
      tip.quick_completions?.some(c => c.quick_note === 'not_for_me') ||
      tip.evening_check_in === 'not_for_me'
    );
    
    const triedTips = tips.filter(tip => tip.user_response === 'try_it');
    
    console.log('=== EXPERIMENT HISTORY ===');
    console.log(`Total experiments presented: ${tips.length}`);
    console.log(`Experiments tried: ${triedTips.length}`);
    console.log(`Experiments loved: ${lovedTips.length}`);
    console.log(`Experiments not for me: ${notForMeTips.length}`);
    
    if (lovedTips.length > 0) {
      console.log('LOVED experiments (worked great):');
      lovedTips.forEach(tip => {
        const fullTip = getTipById(tip.tip_id);
        if (fullTip) {
          console.log(`  - ${fullTip.summary}`);
          console.log(`    Goals: ${fullTip.goals.join(', ')}`);
          console.log(`    Mechanisms: ${fullTip.mechanisms.join(', ')}`);
        }
      });
    }
    
    if (notForMeTips.length > 0) {
      console.log('NOT FOR ME experiments:');
      notForMeTips.forEach(tip => {
        const fullTip = getTipById(tip.tip_id);
        if (fullTip) {
          console.log(`  - ${fullTip.summary}`);
          console.log(`    Goals: ${fullTip.goals.join(', ')}`);
          console.log(`    Mechanisms: ${fullTip.mechanisms.join(', ')}`);
        }
      });
    }
    
    // Check if we already have a tip for today
    const today = format(currentDate, 'yyyy-MM-dd');
    
    // Handle multiple "today" entries (from earlier bugs)
    const todaysTips = tips
      .filter(t => format(new Date(t.presented_date), 'yyyy-MM-dd') === today)
      .sort((a, b) => new Date(b.presented_date).getTime() - new Date(a.presented_date).getTime());
    
    // Debug logging for sanity check
    if (todaysTips.length > 1) {
      console.log('WARNING: Multiple entries for today:', todaysTips.map(t => ({
        id: t.id,
        tip_id: t.tip_id,
        user_response: t.user_response,
        presented: t.presented_date,
      })));
    }
    
    // Prefer an entry that isn't "not_for_me"
    const todaysTip = todaysTips.find(t => normalizeResponseStatus(t.user_response) !== 'not_interested')
                    ?? todaysTips[0];

    if (todaysTip) {
      // Normalize any legacy response values
      let normalizedTip = {
        ...todaysTip,
        user_response: normalizeResponseStatus(todaysTip.user_response)
      };

      // If in focus mode and tip doesn't have a response yet, auto-set to 'try_it'
      if (isInFocusMode && focusTipId && !normalizedTip.user_response) {
        console.log('🎯 FOCUS MODE: Auto-setting today\'s tip to try_it');
        normalizedTip.user_response = 'try_it';
        normalizedTip.responded_at = currentDate;

        // Update in storage
        await StorageService.updateDailyTip(todaysTip.id, {
          user_response: 'try_it',
          responded_at: currentDate
        });
      }

      setDailyTip(normalizedTip);
      
      // Load the EXISTING tip by its ID, not a new recommendation
      const existingTip = getTipById(todaysTip.tip_id);
      if (existingTip) {
        setCurrentTip(existingTip);
        // We can still show reasons if we want to recalculate them
        const tipScores = await tipRecommendationService.recommendTips(profile, tips, tipAttempts, isSimulating ? currentDate : undefined);
        const tipScore = tipScores[0];
        setTipReasons(tipScore?.reasons || []);
      } else {
        // Fallback: if tip not found in database, get a new one
        console.warn(`Tip with ID ${todaysTip.tip_id} not found in database`);
        const tipScores = await tipRecommendationService.recommendTips(profile, tips, tipAttempts, isSimulating ? currentDate : undefined);
        if (tipScores && tipScores.length > 0) {
          const tipScore = tipScores[0];
          setCurrentTip(tipScore.tip);
          setTipReasons(tipScore.reasons);
        }
      }
      
      // Check if we need to show check-in
      if (todaysTip.user_response === 'try_it' && !todaysTip.evening_check_in) {
        const now = currentDate.getHours();
        if (now >= 18) {
          setShowCheckIn(true);
        }
      }
    } else {
      // Check if we're in focus mode - if so, keep using the same tip
      let tipToUse = null;
      let reasons: string[] = [];
      
      if (isInFocusMode && focusTipId) {
        // In focus mode - use the same tip
        const focusTip = getTipById(focusTipId);
        if (focusTip) {
          tipToUse = focusTip;
          reasons = ['Focus Mode: Mastering this habit'];
          console.log('🎯 FOCUS MODE: Loading focus tip', focusTipId);
        }
      }
      
      // If not in focus mode or focus tip not found, get a new tip
      if (!tipToUse) {
        const tipScores = await tipRecommendationService.recommendTips(profile, tips, tipAttempts, isSimulating ? currentDate : undefined);
        if (tipScores && tipScores.length > 0) {
          const tipScore = tipScores[0];
          tipToUse = tipScore.tip;
          reasons = tipScore.reasons;
        }
      }
      
      if (tipToUse) {
        // In focus mode, find the most recent personalization data for this tip
        let focusModePersonalizationData = undefined;
        if (isInFocusMode && focusTipId) {
          // Look for the most recent daily tip with this tip_id that has personalization data
          const previousTipWithPlan = tips
            .filter(t => t.tip_id === focusTipId && t.personalization_data)
            .sort((a, b) => new Date(b.presented_date).getTime() - new Date(a.presented_date).getTime())[0];

          if (previousTipWithPlan) {
            focusModePersonalizationData = previousTipWithPlan.personalization_data;
            console.log('🎯 FOCUS MODE: Found previous personalization data:', focusModePersonalizationData);
          }
        }

        const newDailyTip: DailyTip = {
          id: Date.now().toString(),
          user_id: profile.id,
          tip_id: tipToUse.tip_id,
          presented_date: currentDate,
          // In focus mode, automatically set response to 'try_it' and carry over personalization
          ...(isInFocusMode && focusTipId ? {
            user_response: 'try_it',
            responded_at: currentDate,
            personalization_data: focusModePersonalizationData
          } : {})
        };

        console.log('🎯 Creating daily tip, isInFocusMode:', isInFocusMode, 'user_response:', newDailyTip.user_response);

        await StorageService.saveDailyTip(newDailyTip);
        setDailyTip(newDailyTip);
        setCurrentTip(tipToUse);
        setTipReasons(reasons);

        // Track tip presentation for analytics
        await AnalyticsService.trackTipPresented(tipToUse, profile, {
          isFromSavedList: false,
          isFocusMode: isInFocusMode,
          dayOfWeek: currentDate.getDay(),
          hourOfDay: currentDate.getHours(),
          daysSinceOnboarding: Math.floor((currentDate.getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
        });

        // Sync with Redux
        dispatch(setDailyTipRedux(newDailyTip));
        dispatch(setCurrentTipRedux(tipToUse));
        dispatch(setTipReasonsRedux(reasons));
      }
    }
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    await AnalyticsService.setUser(profile);
    await loadDailyTip(profile, [], []);
  };

  const handleTipResponse = async (response: ResponseStatus) => {
    console.log('==========================================');
    console.log('INDEX.TSX - handleTipResponse START');
    console.log('Response:', response);
    console.log('Current dailyTip.user_response BEFORE update:', dailyTip?.user_response);
    console.log('==========================================');
    
    if (!dailyTip || !userProfile || !currentTip) {
      console.log('index.tsx - Missing required data:', { dailyTip: !!dailyTip, userProfile: !!userProfile, currentTip: !!currentTip });
      return;
    }

    // Clear rejection info if user changes their mind
    if (rejectedTipInfo && rejectedTipInfo.tip.tip_id === currentTip.tip_id) {
      setRejectedTipInfo(null);
    }

    // Get the latest personalization data from Redux since it might have just been saved
    const latestPersonalizationData = reduxSavedData || dailyTip.personalization_data;
    console.log('index.tsx - Using personalization data from Redux:', latestPersonalizationData);

    // Now only handles try_it and maybe_later
    // not_for_me is handled by the separate onNotForMe callback
    const updatedTip = {
      ...dailyTip,
      user_response: response as any,
      responded_at: currentDate,
      personalization_data: latestPersonalizationData, // Include the latest personalization data
    };
    
    console.log('index.tsx - Updating daily tip with response:', response);
    console.log('index.tsx - Current dailyTip personalization_data:', dailyTip.personalization_data);
    console.log('index.tsx - Updated tip object:', updatedTip);
    
    await StorageService.updateDailyTip(dailyTip.id, {
      user_response: response as any,
      responded_at: currentDate,
      personalization_data: latestPersonalizationData, // Save personalization data too
    });
    
    console.log('index.tsx - About to setDailyTip with updatedTip');
    setDailyTip(updatedTip);
    
    // Also update Redux
    dispatch(setDailyTipRedux(updatedTip));
    
    console.log('==========================================');
    console.log('INDEX.TSX - State updated');
    console.log('updatedTip.user_response:', updatedTip.user_response);
    console.log('updatedTip.personalization_data:', updatedTip.personalization_data);
    console.log('==========================================');

    // Track the response in analytics
    await AnalyticsService.trackTipResponse(currentTip.tip_id, response);

    if (response === 'try_it') {
      console.log('index.tsx - User chose try_it, scheduling evening check-in');
      await NotificationService.scheduleEveningCheckIn(dailyTip.tip_id, 19);
      console.log('index.tsx - Evening check-in scheduled');
      console.log('==========================================');
      console.log('INDEX.TSX - handleTipResponse END for try_it');
      console.log('==========================================');
      // Don't show alert - the ExperimentMode component will handle the celebration

      // Check for new awards after responding
      setTimeout(async () => {
        console.log('Checking for new awards after try_it response...');
        const newlyEarnedAwards = await checkForNewAwards();
        console.log('Awards found after try_it:', newlyEarnedAwards);
        if (newlyEarnedAwards.length > 0) {
          console.log('Setting newAward state for banner:', newlyEarnedAwards[0]);
          setNewAward(newlyEarnedAwards[0]);
        }
      }, 1000);
    } else if (response === 'maybe_later') {
      // Create a snooze attempt for the recommendation algorithm
      const snoozeAttempt: TipAttempt = {
        id: Date.now().toString(),
        tip_id: currentTip.tip_id,
        attempted_at: currentDate,
        created_at: currentDate,
        feedback: 'maybe_later',
        snooze_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };
      await StorageService.saveTipAttempt(snoozeAttempt);
      const updatedAttempts = [...attempts, snoozeAttempt];
      setAttempts(updatedAttempts);
      
      Alert.alert(
        'Saved for Later',
        'We\'ll revisit this experiment in about a week!',
        [{ text: 'OK' }]
      );
      
      // Get next tip after alert
      setTimeout(() => {
        loadDailyTip(userProfile, previousTips, updatedAttempts);
      }, 500);
    }
  };

  const handleShowAllExperiments = () => {
    // Deduplicate by tip_id
    const seenTipIds = new Set<string>();
    const allTips = previousTips
      .filter(dt => {
        if (seenTipIds.has(dt.tip_id)) {
          return false;
        }
        seenTipIds.add(dt.tip_id);
        return true;
      })
      .map(dt => ({
        dailyTip: dt,
        tip: getTipById(dt.tip_id)!
      }))
      .filter(item => item.tip);
    
    if (dailyTip && currentTip && !seenTipIds.has(currentTip.tip_id)) {
      allTips.push({ dailyTip, tip: currentTip });
    }
    
    setModalTitle('All Experiments');
    setModalTips(allTips);
    setShowHistoryModal(true);
  };

  const handleShowTriedExperiments = () => {
    // Deduplicate by tip_id to avoid showing the same tip multiple times
    const seenTipIds = new Set<string>();
    const triedTips = previousTips
      .filter(dt => dt.user_response === 'try_it')
      .filter(dt => {
        // Only include if we haven't seen this tip_id yet
        if (seenTipIds.has(dt.tip_id)) {
          return false;
        }
        seenTipIds.add(dt.tip_id);
        return true;
      })
      .map(dt => ({
        dailyTip: dt,
        tip: getTipById(dt.tip_id)!
      }))
      .filter(item => item.tip);
    
    if (dailyTip?.user_response === 'try_it' && currentTip && !seenTipIds.has(currentTip.tip_id)) {
      triedTips.push({ dailyTip, tip: currentTip });
    }
    
    setModalTitle('Experiments You Tried');
    setModalTips(triedTips);
    setShowHistoryModal(true);
  };

  const handleShowLovedExperiments = () => {
    // Deduplicate by tip_id
    const seenTipIds = new Set<string>();
    const lovedTips = previousTips
      .filter(dt => 
        dt.evening_check_in === 'went_great' || 
        dt.quick_completions?.some(c => c.quick_note === 'worked_great')
      )
      .filter(dt => {
        if (seenTipIds.has(dt.tip_id)) {
          return false;
        }
        seenTipIds.add(dt.tip_id);
        return true;
      })
      .map(dt => ({
        dailyTip: dt,
        tip: getTipById(dt.tip_id)!
      }))
      .filter(item => item.tip);
    
    if ((dailyTip?.evening_check_in === 'went_great' || 
         dailyTip?.quick_completions?.some(c => c.quick_note === 'worked_great')) && 
        currentTip && !seenTipIds.has(currentTip.tip_id)) {
      lovedTips.push({ dailyTip, tip: currentTip });
    }
    
    setModalTitle('Experiments You Loved');
    setModalTips(lovedTips);
    setShowHistoryModal(true);
  };

  // Helper function to get unique tip count
  const getUniqueTipCount = (tips: DailyTip[]) => {
    const uniqueTipIds = new Set(tips.map(t => t.tip_id));
    return uniqueTipIds.size;
  };

  const calculateDaysSinceStart = () => {
    // Calculate days since first tip was presented
    if (!previousTips || previousTips.length === 0) return 1;
    
    // Find the earliest tip with a valid date (using presented_date field)
    const validTips = previousTips.filter(tip => tip.presented_date);
    if (validTips.length === 0) return 1;
    
    const sortedTips = [...validTips].sort((a, b) => 
      new Date(a.presented_date).getTime() - new Date(b.presented_date).getTime()
    );
    
    const firstTipDate = new Date(sortedTips[0].presented_date);
    const today = currentDate;
    
    // Check if the date is valid
    if (isNaN(firstTipDate.getTime())) {
      console.log('Invalid first tip date:', sortedTips[0].presented_date);
      return 1;
    }
    
    const dayDiff = Math.floor((today.getTime() - firstTipDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Return at least 1, and handle negative or NaN values
    return Math.max(1, dayDiff + 1);
  };

  const handleNotForMeFeedback = async (reason: string | null, skipFuture?: boolean) => {
    if (!pendingOptOut || !userProfile || !dailyTip) return;

    // Track the not_for_me response with rejection reason
    if (pendingOptOut.tip) {
      await AnalyticsService.trackTipResponse(pendingOptOut.tip.tip_id, 'not_interested', reason || undefined);
    }

    // If we're updating existing feedback, find and update the existing attempt
    if (pendingOptOut.existingFeedback && rejectedTipInfo?.attempt) {
      // Update the existing attempt with more detailed feedback
      const updatedAttempt: TipAttempt = {
        ...rejectedTipInfo.attempt,
        rejection_reason: reason || rejectedTipInfo.attempt.rejection_reason,
        updated_at: currentDate,
      };

      // Update in storage (you might need to add an updateTipAttempt method)
      await StorageService.saveTipAttempt(updatedAttempt);
      
      // Update local state
      const updatedAttempts = attempts.map(a => 
        a.id === updatedAttempt.id ? updatedAttempt : a
      );
      setAttempts(updatedAttempts);
      setRejectedTipInfo({ ...rejectedTipInfo, attempt: updatedAttempt });
    } else {
      // Create a new permanent opt-out attempt with reason
      const optOutAttempt: TipAttempt = {
        id: Date.now().toString(),
        tip_id: pendingOptOut.tipId,
        attempted_at: currentDate,
        created_at: currentDate,
        feedback: 'not_for_me',
        rejection_reason: reason || undefined,
      };
      
      await StorageService.saveTipAttempt(optOutAttempt);
      const updatedAttempts = [...attempts, optOutAttempt];
      setAttempts(updatedAttempts);
      
      // Store the rejected tip info to show the rejection view
      setRejectedTipInfo({ tip: pendingOptOut.tip, attempt: optOutAttempt });
    }
    
    // Update user preference if they don't want to be asked again
    if (skipFuture) {
      const updatedProfile = {
        ...userProfile,
        skip_feedback_questions: true,
      };
      await StorageService.saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    }
    
    // Close modal and clear pending
    setShowFeedbackModal(false);
    setPendingOptOut(null);
    
    // Don't show alerts anymore - the UI will handle feedback
  };
  
  const handleFindNewTip = async () => {
    if (!userProfile || !dailyTip) return;
    
    // Use a transient UI flag instead of persisting state
    setIsReplacingTip(true);
    setRejectedTipInfo(null);
    
    // Get next tip and update the existing record
    const updatedAttempts = attempts;
    setTimeout(async () => {
      try {
        const tipScores = await tipRecommendationService.recommendTips(userProfile, previousTips, updatedAttempts, isSimulating ? currentDate : undefined);

        if (tipScores && tipScores.length > 0) {
          const tipScore = tipScores[0];
          // UPDATE the existing daily tip record instead of creating a new one
          await StorageService.updateDailyTip(dailyTip.id, {
            tip_id: tipScore.tip.tip_id,
            // Clear any state that belongs to the previous tip
            user_response: undefined,
            responded_at: undefined,
            quick_completions: [],
            evening_check_in: undefined,
            check_in_at: undefined,
            evening_reflection: undefined,
            // Keep the same date
            presented_date: dailyTip.presented_date,
          });
          
          // Update local state
          const replaced: DailyTip = {
            ...dailyTip,
            tip_id: tipScore.tip.tip_id,
            user_response: undefined,
            responded_at: undefined,
            quick_completions: [],
            evening_check_in: undefined,
            check_in_at: undefined,
            evening_reflection: undefined,
          };
          setDailyTip(replaced);
          setCurrentTip(tipScore.tip);
          setTipReasons(tipScore.reasons);
        } else {
          // Fallback: no more tips available
          Alert.alert(
            'No more experiments today',
            'We ran out of good suggestions. Check back tomorrow!',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error finding replacement tip:', error);
        Alert.alert(
          'Could not find a new experiment',
          'Please try again later.',
          [{ text: 'OK' }]
        );
      } finally {
        // Always clear the loading state
        setIsReplacingTip(false);
      }
    }, 100);
  };

  // Helper to grab the next saved tip that hasn't been surfaced this session
  const getNextSavedTip = (): SimplifiedTip | undefined => {
    const due = getSavedTipsDue(attempts, previousTips, currentDate);
    console.log('STAR - Saved tips due:', due.length, due.map(t => ({ id: t.tip_id, summary: t.summary })));
    console.log('STAR - Recently surfaced IDs:', recentlySurfacedSavedIds);
    const available = due.find(t => !recentlySurfacedSavedIds.includes(t.tip_id));
    console.log('STAR - Next available saved tip:', available?.tip_id, available?.summary);
    return available;
  };

  const handleUseSavedTip = async () => {
    if (!userProfile || !dailyTip) return;

    const nextSaved = getNextSavedTip();
    if (!nextSaved) {
      // Fallback to your existing finder if somehow empty
      await handleFindNewTip();
      return;
    }

    try {
      // Reuse today's DailyTip record; just swap the tip and clear per-tip state.
      await StorageService.updateDailyTip(dailyTip.id, {
        tip_id: nextSaved.tip_id,
        user_response: undefined,
        responded_at: undefined,
        quick_completions: [],
        evening_check_in: undefined,
        check_in_at: undefined,
        evening_reflection: undefined,
        presented_date: dailyTip.presented_date, // keep same day
      });

      const replaced: DailyTip = {
        ...dailyTip,
        tip_id: nextSaved.tip_id,
        user_response: undefined,
        responded_at: undefined,
        quick_completions: [],
        evening_check_in: undefined,
        check_in_at: undefined,
        evening_reflection: undefined,
      };

      setDailyTip(replaced);
      setCurrentTip(nextSaved);
      setTipReasons([]); // optional: compute reasons if you have a helper
      setRejectedTipInfo(null); // leave the rejection screen
      setRecentlySurfacedSavedIds(ids => [...ids, nextSaved.tip_id]);
    } catch (error) {
      console.error('Error loading saved tip:', error);
      Alert.alert('Could not open saved tip', 'Please try again.', [{ text: 'OK' }]);
    }
  };

  const QUICK_NOTE_TO_FEEDBACK: Record<QuickNote, TipFeedback> = {
    worked_great: 'went_great',
    went_ok: 'went_ok',
    not_sure: 'went_ok',
    not_for_me: 'not_for_me',
  };

  const QUICK_NOTE_LABEL: Record<QuickNote, string> = {
    worked_great: 'worked great',
    went_ok: 'went ok',
    not_sure: 'not sure yet',
    not_for_me: 'not for me',
  };

  const handleQuickComplete = async (note?: 'worked_great' | 'went_ok' | 'not_sure' | 'not_for_me') => {
    console.log('\n🎆 QUICK COMPLETE TRIGGERED');
    console.log('  Note:', note);
    if (!dailyTip || !currentTip) {
      console.log('  ❌ No dailyTip or currentTip, returning early');
      return;
    }

    console.log('  Current dailyTip ID:', dailyTip.id);
    console.log('  Current tip_id:', dailyTip.tip_id);
    console.log('  Existing quick completions:', dailyTip.quick_completions);

    const quickComplete: QuickComplete = {
      completed_at: currentDate,
      quick_note: note,
    };

    const updatedCompletions = [...(dailyTip.quick_completions || []), quickComplete];
    console.log('  Updated completions will be:', updatedCompletions);

    // Update the daily tip with quick completion
    console.log('  Saving to storage...');
    await StorageService.updateDailyTip(dailyTip.id, {
      quick_completions: updatedCompletions,
    });

    const quickCompletionCount = updatedCompletions.length;

    // Track quick completion as a check-in event (similar to evening check-in but during the day)
    if (note) {
      const feedbackMap = {
        'worked_great': 'went_great' as const,
        'went_ok': 'went_ok' as const,
        'not_sure': 'went_ok' as const,
        'not_for_me': 'not_great' as const,
      };
      await AnalyticsService.trackCheckIn(
        currentTip.tip_id,
        feedbackMap[note],
        'Quick completion during the day',
        !!dailyTip.personalization_data
      );
    }

    if (note) {
      const quickNote: QuickNote = note;
      const derivedFeedback = QUICK_NOTE_TO_FEEDBACK[quickNote];
      const attempt: TipAttempt = {
        id: `quick-${Date.now()}`,
        tip_id: dailyTip.tip_id,
        attempted_at: currentDate,
        feedback: derivedFeedback,
        notes: `[Quick Complete] ${QUICK_NOTE_LABEL[quickNote]}`,
      };

      await StorageService.saveTipAttempt(attempt);

      const updatedAttemptsList = mergeAttemptIntoList(attempts, attempt);
      setAttempts(updatedAttemptsList);

      logCheckInImpact(
        'quick-complete',
        derivedFeedback,
        attempt.notes,
        attempt,
        quickCompletionCount,
        updatedAttemptsList,
        currentTip as SimplifiedTip | null
      );
    } else {
      console.log('  ℹ️ Quick complete recorded without a qualitative note — skipping recommendation insight log.');
    }

    // If marked as "worked_great", increment the centralized habit completion count
    if (note === 'worked_great') {
      console.log('  Incrementing centralized habit completion count...');
      const newCount = await StorageService.incrementHabitCompletion(dailyTip.tip_id);
      console.log('  New completion count:', newCount);

      // Track as a habit loved event
      const daysSinceFirstTried = Math.floor((currentDate.getTime() - new Date(dailyTip.presented_date).getTime()) / (1000 * 60 * 60 * 24));
      await AnalyticsService.trackHabitLoved(dailyTip.tip_id, daysSinceFirstTried);
    }

    console.log('  ✅ Saved to storage');

    setDailyTip({
      ...dailyTip,
      quick_completions: updatedCompletions,
    });

    if (note === 'worked_great') {
      console.log('  🎉 This was marked as WORKED GREAT - should appear in Habits tab!');
    }
    
    // Check for new awards after completing
    setTimeout(async () => {
      console.log('Checking for new awards after quick complete...');
      const newlyEarnedAwards = await checkForNewAwards();
      console.log('Newly earned awards:', newlyEarnedAwards);
      if (newlyEarnedAwards.length > 0) {
        console.log('Setting new award for notification:', newlyEarnedAwards[0]);
        setNewAward(newlyEarnedAwards[0]);
      }
    }, 500);

    // Show a brief celebration with feedback-specific message
    Alert.alert(
      'Awesome! 🎉',
      note === 'worked_great' ? 'Fantastic! We\'ll find more experiments like this for you!' :
      note === 'went_ok' ? 'Good! Every experiment helps you learn what works!' :
      note === 'not_sure' ? 'That\'s okay! Sometimes it takes time to see the effects.' :
      note === 'not_for_me' ? 'Thanks for trying! Not every experiment works for everyone.' :
      'Way to go!',
      [{ text: 'Thanks!' }]
    );

    // Feedback value for algorithm:
    // - worked_great: boost similar tips
    // - went_ok: neutral, continue with variety
    // - not_sure: maybe try similar tips later
    // - not_for_me: reduce similar tips
  };

  const mergeAttemptIntoList = (existingAttempts: TipAttempt[], newAttempt: TipAttempt): TipAttempt[] => {
    const newAttemptDate = new Date(newAttempt.attempted_at).toDateString();
    let merged = false;

    const normalizedAttempts = existingAttempts.map(existing => {
      if (existing.tip_id !== newAttempt.tip_id) {
        return existing;
      }

      const existingDate = new Date(existing.attempted_at).toDateString();
      if (existingDate === newAttemptDate) {
        merged = true;
        return { ...existing, ...newAttempt };
      }

      return existing;
    });

    if (!merged) {
      normalizedAttempts.push(newAttempt);
    }

    return normalizedAttempts;
  };

  const logCheckInImpact = (
    source: InsightSource,
    feedback: TipFeedback,
    notes: string | undefined,
    attempt: TipAttempt,
    quickCompletionCount: number,
    allAttempts: TipAttempt[],
    tip: SimplifiedTip | null
  ) => {
    console.log('--- Recommendation Engine Insight ---');
    if (!tip) {
      console.log('  (Tip data missing — unable to describe impact)');
      console.log('--- End Recommendation Insight ---');
      return;
    }

    console.log(
      '  Event source:',
      source === 'quick-complete' ? 'Quick Complete (daytime)' : 'Evening Check-In'
    );
    console.log(`  Tip: ${tip.tip_id} • ${tip.summary}`);
    console.log('  Goals connected to this experiment:', tip.goals?.join(', ') || '—');
    console.log('  Feedback recorded:', feedback);
    console.log('  Reflection / note detail:', notes || '—');
    console.log('  Quick completions logged today:', quickCompletionCount);

    if (source === 'quick-complete') {
      console.log('  This quick complete immediately updates the ranking inputs for upcoming recommendations.');
      console.log('  An evening reflection later today will overwrite or enrich this provisional signal.');
    }

    const tipAttemptHistory = allAttempts
      .filter(a => a.tip_id === attempt.tip_id)
      .sort((a, b) => new Date(b.attempted_at).getTime() - new Date(a.attempted_at).getTime());

    const attemptCounts = tipAttemptHistory.reduce<Record<string, number>>((acc, item) => {
      const key = (item.feedback ?? 'skipped') as string;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const successNumerator = tipAttemptHistory.reduce((acc, item) => {
      if (item.feedback === 'went_great') return acc + 1;
      if (item.feedback === 'went_ok') return acc + 0.5;
      return acc;
    }, 0);
    const successRate = tipAttemptHistory.length > 0
      ? successNumerator / tipAttemptHistory.length
      : 0;

    if (tipAttemptHistory.length > 0) {
      console.log('  Attempt history for this tip (newest first):');
      tipAttemptHistory.forEach((entry, index) => {
        const attemptDate = new Date(entry.attempted_at);
        const descriptor = entry.notes ? ` • notes: ${entry.notes}` : '';
        console.log(`    ${index + 1}. ${entry.feedback || 'unknown'} on ${attemptDate.toDateString()}${descriptor}`);
      });
    } else {
      console.log('  This is the first recorded attempt for this experiment.');
    }

    console.log('  Feedback counts so far:', attemptCounts);
    console.log(
      '  Success score numerator (great = 1, ok = 0.5):',
      `${successNumerator.toFixed(1)} / ${tipAttemptHistory.length}`
    );
    console.log('  Approximate success rate used in ranking:', `${Math.round(successRate * 100)}%`);

    const snoozedAttempt = tipAttemptHistory.find(a => a.feedback === 'maybe_later' && a.snooze_until);
    if (snoozedAttempt) {
      console.log('  Snooze active until:', new Date(snoozedAttempt.snooze_until!).toDateString());
    } else {
      console.log('  No active snooze for this experiment.');
    }

    const hasOptOut = tipAttemptHistory.some(a => a.feedback === 'not_for_me');
    console.log('  Permanently opted out?:', hasOptOut);

    console.log('  Personalization impact:');
    switch (feedback) {
      case 'went_great': {
        console.log('    • Marks this as a top fit — boosts the success score so similar tips rank higher.');
        console.log('    • Adds to your liked experiments and habit streak tracking for goals:', tip.goals?.join(', ') || '—');
        if (source === 'quick-complete') {
          console.log('    • Immediately increases the daytime success weight so upcoming recs lean into this pattern.');
        } else if (quickCompletionCount === 0) {
          console.log('    • Increments the habit completion counter (see storage logs above).');
        } else {
          console.log('    • Reinforces the earlier quick-complete success with a full reflection.');
        }
        console.log('    • Keeps the tip eligible for Focus Mode prompts and awards.');
        break;
      }
      case 'went_ok': {
        console.log('    • Gives partial credit (0.5 weight) — tip stays in rotation but below “went great” items.');
        console.log('    • Helps calibrate difficulty preferences before tomorrow’s recommendation.');
        break;
      }
      case 'not_for_me': {
        console.log('    • Sets a permanent opt-out — tipRecommendationService will filter this tip out.');
        console.log('    • Drops the success rate so similar experiments are deprioritized.');
        break;
      }
      case 'maybe_later': {
        const snoozeDate = attempt.snooze_until ? new Date(attempt.snooze_until) : null;
        console.log('    • Saves it to the “try later” list — we will resurface it after the snooze window.');
        console.log(
          '    • Snooze window ends:',
          snoozeDate ? snoozeDate.toDateString() : 'unknown (default 7 days)'
        );
        console.log('    • Does not count as a success yet, so we keep exploring other options meanwhile.');
        break;
      }
      case 'skipped': {
        console.log('    • Records a skip — lowers the success rate slightly so we may try easier or new ideas next.');
        console.log('    • Tip remains eligible and can resurface soon.');
        break;
      }
      default: {
        console.log('    • Feedback logged with default handling.');
      }
    }

    console.log('--- End Recommendation Insight ---');
  };

  const handleCheckIn = async (feedback: TipFeedback, notes?: string) => {
    console.log('\n🌙 EVENING CHECK-IN TRIGGERED');
    console.log('  Feedback:', feedback);
    console.log('  Notes:', notes);

    if (!dailyTip || !currentTip) {
      console.log('  ❌ Missing dailyTip or currentTip');
      return;
    }

    console.log('  Current dailyTip ID:', dailyTip.id);

    // Track evening check-in in analytics
    await AnalyticsService.trackCheckIn(
      currentTip.tip_id,
      feedback as 'went_great' | 'went_ok' | 'not_great' | 'didnt_try',
      notes,
      !!dailyTip.personalization_data
    );
    console.log('  Current tip_id:', dailyTip.tip_id);
    console.log('  Current tip summary:', currentTip.summary);

    const hasQuickCompletion = dailyTip.quick_completions && dailyTip.quick_completions.length > 0;
    console.log('  Has quick completions?', hasQuickCompletion);

    // Save the check-in with reflection notes if already completed
    console.log('  Saving evening check-in to storage...');
    const updateData = {
      evening_check_in: feedback,
      check_in_at: currentDate,
      ...(hasQuickCompletion && notes ? { evening_reflection: notes } : {}),
    };
    console.log('  Update data:', updateData);
    await StorageService.updateDailyTip(dailyTip.id, updateData);

    // If marked as "went_great", increment the centralized habit completion count
    // But only if not already marked through quick complete
    if (feedback === 'went_great') {
      const alreadyMarkedGreat = dailyTip.quick_completions?.some(qc => qc.quick_note === 'worked_great');
      if (!alreadyMarkedGreat) {
        console.log('  Incrementing centralized habit completion count from evening check-in...');
        const newCount = await StorageService.incrementHabitCompletion(dailyTip.tip_id);
        console.log('  New completion count:', newCount);

        // Track habit loved event
        const daysSinceFirstTried = Math.floor((currentDate.getTime() - new Date(dailyTip.presented_date).getTime()) / (1000 * 60 * 60 * 24));
        await AnalyticsService.trackHabitLoved(dailyTip.tip_id, daysSinceFirstTried);
      } else {
        console.log('  Already marked as worked_great in quick complete, not incrementing again');
      }
    }
    console.log('  ✅ Saved to storage');

    if (feedback === 'went_great') {
      console.log('  🎉 This was marked as WENT GREAT - should appear in Habits tab!');
    }

    // Save the attempt
    const attempt: TipAttempt = {
      id: Date.now().toString(),
      tip_id: dailyTip.tip_id,
      attempted_at: currentDate,
      feedback,
      notes: hasQuickCompletion ? `[Reflection] ${notes || ''}` : notes,
    };
    
    await StorageService.saveTipAttempt(attempt);

    const updatedAttemptsList = mergeAttemptIntoList(attempts, attempt);

    logCheckInImpact(
      'evening-check-in',
      feedback,
      attempt.notes,
      attempt,
      dailyTip.quick_completions?.length || 0,
      updatedAttemptsList,
      currentTip as SimplifiedTip | null
    );
    
    // Update state to show completion view
    setDailyTip({
      ...dailyTip,
      evening_check_in: feedback,
      check_in_at: currentDate,
      ...(hasQuickCompletion && notes ? { evening_reflection: notes } : {}),
    });
    setShowCheckIn(false);
    setAttempts(updatedAttemptsList);
    
    // If user loved the tip, show focus mode prompt
    console.log('=== FOCUS MODE CHECK ===');
    console.log('Feedback received:', feedback);
    console.log('Is "went_great"?:', feedback === 'went_great');
    console.log('Currently in focus mode?:', isInFocusMode);
    console.log('Should show prompt?:', feedback === 'went_great' && !isInFocusMode);
    
    if (feedback === 'went_great' && !isInFocusMode) {
      console.log('TRIGGERING FOCUS MODE PROMPT in 1 second...');
      setTimeout(() => {
        console.log('SETTING showFocusPrompt to TRUE');
        setShowFocusPrompt(true);
      }, 1000); // Small delay to let the check-in UI close first
    } else {
      console.log('NOT showing focus prompt because:');
      if (feedback !== 'went_great') console.log('- Feedback is not "went_great"');
      if (isInFocusMode) console.log('- Already in focus mode');
    }
    
    // Check for new awards AFTER saving the check-in
    setTimeout(async () => {
      console.log('Checking for new awards after evening check-in...');
      console.log('Updated dailyTip has evening_check_in:', feedback);
      const newlyEarnedAwards = await checkForNewAwards();
      console.log('Awards found after check-in:', newlyEarnedAwards);
      if (newlyEarnedAwards.length > 0) {
        console.log('Setting newAward state for banner:', newlyEarnedAwards[0]);
        setNewAward(newlyEarnedAwards[0]);
      }
    }, 500);

    // Don't show alert - the ExperimentComplete component will handle the celebration
  };

  console.log('Render - loading state:', loading, 'userProfile:', userProfile ? 'exists' : 'null');
  console.log('Render - showCheckIn:', showCheckIn, 'currentTip:', currentTip ? 'exists' : 'null');
  
  if (loading) {
    console.log('Returning loading screen');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!userProfile) {
    console.log('Returning onboarding quiz');
    return <OnboardingQuizNew onComplete={handleOnboardingComplete} shouldPersistProfile={true} />;
  }

  if (showCheckIn && currentTip) {
    console.log('Returning evening check-in');
    return (
      <EveningCheckIn
        tip={currentTip}
        onCheckIn={handleCheckIn}
        onSkip={() => setShowCheckIn(false)}
        quickCompletions={dailyTip?.quick_completions || []}
      />
    );
  }

  console.log('Returning main app view');
  
  // Check if we should show DailyTipCardEnhanced (special layout without ScrollView)
  // Show enhanced card if tip exists and either no response yet OR rejected with feedback OR saved for later
  const shouldShowEnhancedCard = currentTip && dailyTip && (!dailyTip.user_response || 
    (rejectedTipInfo && rejectedTipInfo.tip.tip_id === currentTip.tip_id) ||
    dailyTip.user_response === 'maybe_later');
  
  console.log('==========================================');
  console.log('COMPONENT RENDER DECISION:');
  console.log('shouldShowEnhancedCard:', shouldShowEnhancedCard);
  console.log('currentTip exists:', !!currentTip);
  console.log('dailyTip exists:', !!dailyTip);
  console.log('dailyTip.user_response:', dailyTip?.user_response);
  console.log('rejectedTipInfo exists:', !!rejectedTipInfo);
  console.log('showCheckIn:', showCheckIn);
  console.log('==========================================');
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Simulation Mode Banner */}
      {isSimulating && (
        <TouchableOpacity
          style={styles.simulationBanner}
          onPress={() => setShowTestCalendar(true)}
        >
          <Ionicons name="time-outline" size={18} color="#FFF" />
          <Text style={styles.simulationText}>
            Simulating: {format(currentDate, 'MMM d, yyyy')}
          </Text>
          <Text style={styles.simulationTapText}>Tap to manage</Text>
        </TouchableOpacity>
      )}

      {/* Feedback Modal */}
      {console.log('Modal render check - showFeedbackModal:', showFeedbackModal, 'pendingOptOut:', pendingOptOut?.tipId) && null}
      {showFeedbackModal && pendingOptOut && (
        <NotForMeFeedback
          visible={showFeedbackModal}
          tip={pendingOptOut.tip}
          existingFeedback={pendingOptOut.existingFeedback}
          onClose={() => {
            console.log('Modal onClose called');
            setShowFeedbackModal(false);
            handleNotForMeFeedback(null);
          }}
          onFeedback={handleNotForMeFeedback}
        />
      )}
      
      {/* Tip History Modal */}
      <TipHistoryModal
        visible={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title={modalTitle}
        tips={modalTips}
      />
      
      {/* Awards Modal */}
      <AwardsModal
        visible={showAwardsModal}
        onClose={() => {
          setShowAwardsModal(false);
          setInitialAwardsTab('all'); // Reset to default when closing
        }}
        allAwards={allAwards}
        earnedAwards={earnedAwards}
        awardProgress={awardProgress}
        newAwardIds={newAwards.map(a => a.id)}
        initialTab={initialAwardsTab}
      />
      
      {/* Focus Mode Prompt - Moved up for proper rendering */}
      {(() => {
        console.log('=== FOCUS MODE PROMPT RENDER CHECK (TOP LEVEL) ===');
        console.log('currentTip exists?:', !!currentTip);
        console.log('showFocusPrompt state:', showFocusPrompt);
        console.log('Will render FocusModePrompt?:', !!(currentTip && showFocusPrompt));
        return null;
      })()}
      {currentTip && (
        <FocusModePrompt
          visible={showFocusPrompt}
          tip={currentTip}
          onClose={() => {
            console.log('FocusModePrompt onClose called');
            setShowFocusPrompt(false);
          }}
          onFocusMode={async (days) => {
            console.log('Focus mode selected for', days, 'days');
            dispatch(startFocusMode({
              tipId: currentTip.tip_id,
              days
            }));

            // Track focus mode started
            await AnalyticsService.trackFocusMode(currentTip.tip_id, 'started');

            setShowFocusPrompt(false);
            Alert.alert(
              'Focus Mode Activated! 🎯',
              `You'll focus on "${currentTip.summary}" for the next ${days} days. Let's build this habit together!`,
              [{ text: 'Let\'s do this!', style: 'default' }]
            );
          }}
          onNewTipTomorrow={() => {
            console.log('User chose new tip tomorrow');
            setShowFocusPrompt(false);
            // Normal flow continues - new tip tomorrow
          }}
        />
      )}
      
      {/* Award Banner */}
      <AwardBanner
        award={newAward}
        visible={!!newAward}
        onClose={() => {
          console.log('AwardBanner onClose - marking award as seen:', newAward?.name);
          if (newAward) {
            markAwardsSeen([newAward.id]);
          }
          setNewAward(null);
        }}
        onTap={() => {
          console.log('AwardBanner onTap - opening awards modal on progress tab');
          setInitialAwardsTab('progress');
          setShowAwardsModal(true);
        }}
      />
      
      {/* Test Data Calendar - Dev Only */}
      {__DEV__ && userProfile && (
        <TestDataCalendar
          visible={showTestCalendar}
          onClose={() => setShowTestCalendar(false)}
          userProfile={userProfile}
          existingTips={previousTips}
          onTipGenerated={async () => {
            // Reload tips after generating test data
            const tips = await StorageService.getDailyTips();
            setPreviousTips(tips);
            // Reload current day's tip if needed
            if (userProfile) {
              await loadDailyTip(userProfile, tips, attempts);
            }
          }}
        />
      )}
      
      {/* Debug button to test focus prompt */}
      {__DEV__ && currentTip && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20,
            backgroundColor: '#FF6B6B',
            padding: 12,
            borderRadius: 25,
            zIndex: 9999,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          onPress={() => {
            console.log('=== DEBUG BUTTON PRESSED ===');
            console.log('Current showFocusPrompt:', showFocusPrompt);
            console.log('Current tip:', currentTip?.summary);
            console.log('Setting showFocusPrompt to true...');
            setShowFocusPrompt(true);
          }}
        >
          <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>Test Focus</Text>
        </TouchableOpacity>
      )}
      
      {/* Identity Builder Modal */}
      {showIdentityBuilder && userProfile && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FFF', zIndex: 1000 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <IdentityQuizStep
              userGoals={userProfile.goals || []}
              onComplete={async (adjectives, role) => {
                const updatedProfile = {
                  ...userProfile,
                  identityAdjectives: adjectives,
                  identityRole: role,
                  identityPhrase: `${adjectives.join(' ')} ${role}`
                };
                await StorageService.saveUserProfile(updatedProfile);
                setUserProfile(updatedProfile);
                setShowIdentityBuilder(false);
              }}
              onBack={() => setShowIdentityBuilder(false)}
            />
          </SafeAreaView>
        </View>
      )}
      
      <LinearGradient
        colors={['#E8F5E9', '#FFFFFF']}
        style={styles.gradient}
      >
        {shouldShowEnhancedCard ? (
          // Special layout for DailyTipCardEnhanced - no ScrollView
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
            <View style={{ flex: 1, paddingRight: 100 }}>
              <Text style={styles.greeting}>
                {currentDate.getHours() < 12 ? 'Good Morning' :
                 currentDate.getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
                {/* Debug: Show current hour */}
                {__DEV__ && ` (${currentDate.getHours()}:${String(currentDate.getMinutes()).padStart(2, '0')})`}
              </Text>
              <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
                {userProfile?.identityPhrase ? (
                  <>
                    {userProfile.identityPhrase.split(' ').map((word, index) => (
                      <Text key={index} style={index < userProfile.identityPhrase.split(' ').length - 1 ? styles.identityAdjective : styles.identityRole}>
                        {word}{index < userProfile.identityPhrase.split(' ').length - 1 ? ' ' : ''}
                      </Text>
                    ))}
                  </>
                ) : 'Habit Helper'}
              </Text>
              
              {/* Focus Mode Indicator */}
              {isInFocusMode && focusProgress && (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                  backgroundColor: '#4CAF50',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  alignSelf: 'flex-start',
                }}>
                  <Ionicons name="fitness" size={16} color="#FFF" />
                  <Text style={{
                    color: '#FFF',
                    fontSize: 12,
                    fontWeight: '600',
                    marginLeft: 6,
                  }}>
                    Focus Mode • Day {focusProgress.daysCompleted + 1} of {focusProgress.daysTotal}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.headerIconsContainer}>
              {/* Testing: Open test data calendar */}
              {__DEV__ && (
                <TouchableOpacity 
                  style={styles.profileButton}
                  onPress={() => setShowTestCalendar(true)}
                >
                  <Ionicons name="calendar-outline" size={32} color="#9C27B0" />
                </TouchableOpacity>
              )}
              
              {/* Go to identity builder */}
              <TouchableOpacity
                onPress={() => setShowHeaderStats(!showHeaderStats)}
                style={[styles.profileButton, { marginRight: 8 }]}
              >
                <Ionicons 
                  name={showHeaderStats ? "stats-chart" : "stats-chart-outline"} 
                  size={28} 
                  color="#4CAF50" 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={() => setShowIdentityBuilder(true)}
              >
                <Ionicons name="person-circle-outline" size={32} color="#4CAF50" />
              </TouchableOpacity>
              
              {/* Testing: Cycle through tips */}
              {__DEV__ && (
                <>
                <TouchableOpacity 
                  style={[styles.profileButton, {backgroundColor: '#FF5252', borderRadius: 16, padding: 4}]}
                  onPress={resetAllDataIncludingAwards}
                >
                  <Ionicons name="refresh-circle" size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.profileButton}
                  onPress={async () => {
                    if (!userProfile || !dailyTip) return;
                    
                    // Add current tip to cycled list
                    const newCycledIds = currentTip ? [...cycledTipIds, currentTip.tip_id] : cycledTipIds;
                    
                    // Get the next recommended tip, excluding all cycled tips
                    const tipScores = await tipRecommendationService.recommendTips(
                      userProfile,
                      previousTips,
                      attempts,
                      isSimulating ? currentDate : undefined // testModeDate
                    );

                    // Filter out cycled tips
                    const availableTips = tipScores.filter(s => !newCycledIds.includes(s.tip.tip_id));

                    if (availableTips.length > 0) {
                      const tipScore = availableTips[0];
                      // Update the existing daily tip record
                      await StorageService.updateDailyTip(dailyTip.id, {
                        tip_id: tipScore.tip.tip_id,
                        user_response: undefined,
                        responded_at: undefined,
                        quick_completions: [],
                        evening_check_in: undefined,
                        check_in_at: undefined,
                        evening_reflection: undefined,
                      });
                      
                      const updatedTip: DailyTip = {
                        ...dailyTip,
                        tip_id: tipScore.tip.tip_id,
                        user_response: undefined,
                        responded_at: undefined,
                        quick_completions: [],
                        evening_check_in: undefined,
                        check_in_at: undefined,
                        evening_reflection: undefined,
                      };
                      
                      setDailyTip(updatedTip);
                      setCurrentTip(tipScore.tip);
                      setTipReasons(tipScore.reasons);
                      setRejectedTipInfo(null);
                      setCycledTipIds(newCycledIds);
                      
                      console.log(`Cycled through ${newCycledIds.length} tips so far`);
                    } else {
                      // No more tips available - reset the cycle
                      console.log('All tips cycled! Resetting...');
                      setCycledTipIds([]);
                      Alert.alert(
                        'Cycle Complete',
                        `You've cycled through all ${newCycledIds.length} eligible tips for today! Starting over...`,
                        [{ text: 'OK' }]
                      );
                      
                      // Get first tip again
                      const firstTips = await tipRecommendationService.recommendTips(
                        userProfile,
                        previousTips,
                        attempts,
                        isSimulating ? currentDate : undefined
                      );

                      if (firstTips && firstTips.length > 0) {
                        const firstTip = firstTips[0];
                        await StorageService.updateDailyTip(dailyTip.id, {
                          tip_id: firstTip.tip.tip_id,
                          user_response: undefined,
                          responded_at: undefined,
                        });
                        
                        setDailyTip({
                          ...dailyTip,
                          tip_id: firstTip.tip.tip_id,
                          user_response: undefined,
                          responded_at: undefined,
                        });
                        setCurrentTip(firstTip.tip);
                        setTipReasons(firstTip.reasons);
                      }
                    }
                  }}
                >
                  <Ionicons name="shuffle-outline" size={32} color="#2196F3" />
                </TouchableOpacity>

              {/* Temporary reset button for testing */}
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={async () => {
                  Alert.alert(
                    'Reset Tips',
                    'Clear all tip data for testing? (Quiz responses will be kept)',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Reset', 
                        style: 'destructive',
                        onPress: async () => {
                          await StorageService.clearTipData();
                          setPreviousTips([]);
                          setAttempts([]);
                          setDailyTip(null);
                          setCurrentTip(null);
                          setShowCheckIn(false);
                          // Reload with fresh tip
                          await loadDailyTip(userProfile!, [], []);
                          Alert.alert('Done', 'Tip data has been reset');
                        }
                      }
                    ]
                  );
                }}
              >
                <Ionicons name="refresh-circle-outline" size={32} color="#FF9800" />
              </TouchableOpacity>
              </>
              )}
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={async () => {
                  Alert.alert(
                    'Profile Settings',
                    'What would you like to do?',
                    [
                      { 
                        text: 'Retake Quiz', 
                        onPress: async () => {
                          // Clear profile to restart quiz
                          await StorageService.setOnboardingCompleted(false);
                          setUserProfile(null);
                          setDailyTip(null);
                          setCurrentTip(null);
                        }
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel'
                      }
                    ]
                  );
                }}
              >
                <Ionicons name="person-circle-outline" size={32} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats - Conditionally rendered */}
          {showHeaderStats && (
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={styles.statCard}
              onPress={handleShowAllExperiments}
              activeOpacity={0.7}
            >
              <Text style={styles.statNumber}>{getUniqueTipCount(previousTips) + (dailyTip && !previousTips.some(t => t.tip_id === dailyTip.tip_id) ? 1 : 0)}</Text>
              <Text style={styles.statLabel}>Experiments</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statCard}
              onPress={handleShowTriedExperiments}
              activeOpacity={0.7}
            >
              <Text style={styles.statNumber}>
                {getUniqueTipCount(previousTips.filter(tip => tip.user_response === 'try_it')) + 
                 (dailyTip?.user_response === 'try_it' && !previousTips.some(t => t.tip_id === dailyTip.tip_id && t.user_response === 'try_it') ? 1 : 0)}
              </Text>
              <Text style={styles.statLabel}>Tried</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statCard}
              onPress={handleShowLovedExperiments}
              activeOpacity={0.7}
            >
              <Text style={styles.statNumber}>
                {getUniqueTipCount(previousTips.filter(tip => 
                  tip.quick_completions?.some(c => c.quick_note === 'worked_great') ||
                  tip.evening_check_in === 'went_great'
                )) + 
                ((dailyTip?.quick_completions?.some(c => c.quick_note === 'worked_great') || 
                  dailyTip?.evening_check_in === 'went_great') && 
                 !previousTips.some(t => t.tip_id === dailyTip.tip_id && 
                   (t.quick_completions?.some(c => c.quick_note === 'worked_great') || t.evening_check_in === 'went_great')) ? 1 : 0)}
              </Text>
              <Text style={styles.statLabel}>Loved</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.statCard, styles.awardsCard]}
              onPress={() => setShowAwardsModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.statNumber}>🏆</Text>
              <Text style={styles.statLabel}>{earnedAwards.length}</Text>
              {newAwards.length > 0 && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>{newAwards.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          )}

            
            {/* DailyTipCardEnhanced takes up remaining space */}
            <DailyTipCardEnhanced
              tip={currentTip}
              onResponse={handleTipResponse}
              onThemeChange={setCardThemeKey}
              onSavePersonalization={async (data) => {
                try {
                  console.log('index.tsx - onSavePersonalization called with data:', data);
                  // Save personalization data to the current daily tip
                  if (dailyTip) {
                    const updatedDailyTip = { ...dailyTip, personalization_data: data };
                    console.log('index.tsx - Updating daily tip with personalization_data:', updatedDailyTip);
                    setDailyTip(updatedDailyTip);
                    
                    console.log('index.tsx - About to dispatch setDailyTipRedux');
                    // Update Redux store
                    dispatch(setDailyTipRedux(updatedDailyTip));
                    
                    console.log('index.tsx - About to dispatch savePersonalizationData');
                    dispatch(savePersonalizationData(data));
                    
                    console.log('index.tsx - About to update storage');
                    await StorageService.updateDailyTip(dailyTip.id, {
                      personalization_data: data
                    });
                    console.log('index.tsx - Daily tip updated in storage and Redux');
                  } else {
                    console.log('index.tsx - No dailyTip to update!');
                  }
                } catch (error) {
                  console.error('index.tsx - Error in onSavePersonalization:', error);
                  // Re-throw to let the caller handle it
                  throw error;
                }
              }}
              savedPersonalizationData={dailyTip?.personalization_data}
              onNotForMe={() => {
                console.log('Not for me clicked!');
                console.log('Current tip:', currentTip?.tip_id);
                console.log('Skip feedback questions:', userProfile?.skip_feedback_questions);
                
                // Only open modal, don't trigger replacement
                setPendingOptOut({ tip: currentTip, tipId: currentTip.tip_id });
                if (userProfile.skip_feedback_questions) {
                  console.log('Skipping feedback modal, going straight to rejection');
                  handleNotForMeFeedback(null);
                } else {
                  console.log('Setting showFeedbackModal to true');
                  setShowFeedbackModal(true);
                }
              }}
              reasons={tipReasons}
              userGoals={userProfile.goals}
              rejectionInfo={
                rejectedTipInfo && rejectedTipInfo.tip.tip_id === currentTip.tip_id
                  ? {
                      feedback: 'not_for_me' as const,
                      reason: rejectedTipInfo.attempt?.rejection_reason
                    }
                  : undefined
              }
              maybeLaterInfo={
                dailyTip.user_response === 'maybe_later'
                  ? {
                      feedback: 'maybe_later' as const,
                      savedAt: dailyTip.responded_at
                    }
                  : undefined
              }
            />
          </View>
        ) : (
          // Regular layout with ScrollView for other content
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flex: 1, paddingRight: 100 }}>
                <Text style={styles.greeting}>
                  {new Date().getHours() < 12 ? 'Good Morning' :
                   new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
                  {/* Debug: Show current hour */}
                  {__DEV__ && ` (${currentDate.getHours()}:${String(currentDate.getMinutes()).padStart(2, '0')})`}
                </Text>
                <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
                  {userProfile?.identityPhrase ? (
                    <>
                      {userProfile.identityPhrase.split(' ').map((word, index) => (
                        <Text key={index} style={index < userProfile.identityPhrase.split(' ').length - 1 ? styles.identityAdjective : styles.identityRole}>
                          {word}{index < userProfile.identityPhrase.split(' ').length - 1 ? ' ' : ''}
                        </Text>
                      ))}
                    </>
                  ) : 'Habit Helper'}
                </Text>
              </View>
              <View style={styles.headerIconsContainer}>
                {/* Testing: Open test data calendar */}
                {__DEV__ && (
                  <TouchableOpacity 
                    style={styles.profileButton}
                    onPress={() => setShowTestCalendar(true)}
                  >
                    <Ionicons name="calendar-outline" size={32} color="#9C27B0" />
                  </TouchableOpacity>
                )}
                
                {/* Temporary reset button for testing */}
                <TouchableOpacity 
                  style={styles.profileButton}
                  onPress={async () => {
                    Alert.alert(
                      'Reset Tips',
                      'Clear all tip data for testing? (Quiz responses will be kept)',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Reset', 
                          style: 'destructive',
                          onPress: async () => {
                            await StorageService.clearTipData();
                            setPreviousTips([]);
                            setAttempts([]);
                            setDailyTip(null);
                            setCurrentTip(null);
                            setShowCheckIn(false);
                            setCycledTipIds([]); // Reset cycle tracking
                            // Reload with fresh tip
                            await loadDailyTip(userProfile!, [], []);
                            Alert.alert('Done', 'Tip data has been reset');
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Ionicons name="refresh-circle-outline" size={32} color="#FF9800" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.profileButton}
                  onPress={async () => {
                    Alert.alert(
                      'Profile Settings',
                      'What would you like to do?',
                      [
                        { 
                          text: 'Retake Quiz', 
                          onPress: async () => {
                            // Clear profile to restart quiz
                            await StorageService.setOnboardingCompleted(false);
                            setUserProfile(null);
                            setDailyTip(null);
                            setCurrentTip(null);
                          }
                        },
                        {
                          text: 'Cancel',
                          style: 'cancel'
                        }
                      ]
                    );
                  }}
                >
                  <Ionicons name="person-circle-outline" size={32} color="#4CAF50" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats - Hidden during Experiment Mode (when user has accepted tip but not completed check-in) */}
            {!(dailyTip?.user_response === 'try_it' && !dailyTip?.evening_check_in) && (
            <View style={styles.statsContainer}>
              <TouchableOpacity
                style={styles.statCard}
                onPress={handleShowAllExperiments}
                activeOpacity={0.7}
              >
                <Text style={styles.statNumber}>{getUniqueTipCount(previousTips) + (dailyTip && !previousTips.some(t => t.tip_id === dailyTip.tip_id) ? 1 : 0)}</Text>
                <Text style={styles.statLabel}>Experiments</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statCard}
                onPress={handleShowTriedExperiments}
                activeOpacity={0.7}
              >
                <Text style={styles.statNumber}>
                  {getUniqueTipCount(previousTips.filter(tip => tip.user_response === 'try_it')) +
                   (dailyTip?.user_response === 'try_it' && !previousTips.some(t => t.tip_id === dailyTip.tip_id && t.user_response === 'try_it') ? 1 : 0)}
                </Text>
                <Text style={styles.statLabel}>Tried</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statCard}
                onPress={handleShowLovedExperiments}
                activeOpacity={0.7}
              >
                <Text style={styles.statNumber}>
                  {getUniqueTipCount(previousTips.filter(tip =>
                    tip.quick_completions?.some(c => c.quick_note === 'worked_great') ||
                    tip.evening_check_in === 'went_great'
                  )) +
                  ((dailyTip?.quick_completions?.some(c => c.quick_note === 'worked_great') ||
                    dailyTip?.evening_check_in === 'went_great') &&
                   !previousTips.some(t => t.tip_id === dailyTip.tip_id &&
                     (t.quick_completions?.some(c => c.quick_note === 'worked_great') || t.evening_check_in === 'went_great')) ? 1 : 0)}
                </Text>
                <Text style={styles.statLabel}>Loved</Text>
              </TouchableOpacity>
            </View>
            )}

            {/* Daily Tip, Experiment Mode, or Completion View */}
            {console.log('Main content check - currentTip:', currentTip ? 'exists' : 'null', 'dailyTip:', dailyTip ? 'exists' : 'null') && null}
            {currentTip && dailyTip ? (
            dailyTip.evening_check_in ? (
              // Show completion view after check-in
              <ExperimentComplete
                tip={currentTip}
                feedback={dailyTip.evening_check_in}
                totalExperiments={previousTips.length + 1} // +1 for today's experiment
                successfulExperiments={previousTips.filter(t => t.user_response === 'try_it').length + 1} // +1 since they completed today's
                currentStreak={(() => {
                  const days = calculateDaysSinceStart();
                  console.log('Days since start:', days, 'Previous tips:', previousTips.length);
                  return days;
                })()}
                tipHistory={(() => {
                  // Build tip history with full tip objects
                  const history = previousTips.map(dt => ({
                    dailyTip: dt,
                    tip: getTipById(dt.tip_id)!
                  })).filter(item => item.tip); // Filter out any where tip wasn't found
                  
                  // Add today's tip to the history
                  history.push({
                    dailyTip: dailyTip,
                    tip: currentTip
                  });
                  
                  return history;
                })()}
                onGetNewTip={() => {
                  // Reset for tomorrow (this would ideally load tomorrow's tip)
                  Alert.alert(
                    'Come back tomorrow!',
                    'Check back tomorrow for your next experiment.',
                    [{ text: 'OK' }]
                  );
                }}
              />
            ) : dailyTip.user_response === 'try_it' ? (
              // Show Experiment Mode when user has committed to trying
              (() => {
                console.log('==========================================');
                console.log('RENDERING: ExperimentModeSwipe');
                console.log('dailyTip.user_response:', dailyTip.user_response);
                console.log('dailyTip.personalization_data:', dailyTip.personalization_data);
                console.log('==========================================');
                return null;
              })() || (
              <ExperimentModeSwipe
                tip={currentTip}
                personalizationData={(() => {
                  const dataToPass = dailyTip.personalization_data || reduxSavedData;
                  console.log('index.tsx - Passing personalizationData to ExperimentModeSwipe:', dataToPass);
                  console.log('index.tsx - From dailyTip:', dailyTip.personalization_data);
                  console.log('index.tsx - From Redux:', reduxSavedData);
                  return dataToPass;
                })()}
                onSavePersonalization={async (data) => {
                  try {
                    console.log('index.tsx - ExperimentModeSwipe onSavePersonalization called:', data);
                    if (dailyTip) {
                      const updatedDailyTip = { ...dailyTip, personalization_data: data };
                      await StorageService.saveDailyTip(updatedDailyTip);
                      dispatch(savePersonalizationData(data));
                      setDailyTip(updatedDailyTip);
                      dispatch(setDailyTipRedux(updatedDailyTip));
                      console.log('index.tsx - Personalization saved from ExperimentModeSwipe');
                    }
                  } catch (error) {
                    console.error('index.tsx - Error saving personalization from ExperimentModeSwipe:', error);
                  }
                }}
                isInFocusMode={isInFocusMode}
                focusProgress={focusProgress || undefined}
                showHeaderStats={showHeaderStats}
                onToggleHeaderStats={() => setShowHeaderStats(!showHeaderStats)}
                onViewDetails={() => {
                  // Could open a modal or navigate to details
                  Alert.alert(
                    'Experiment Details',
                    currentTip.details_md.replace(/\*\*/g, '').replace(/•/g, '\n•'),
                    [{ text: 'Got it!' }]
                  );
                }}
                timeUntilCheckIn={
                  // Calculate hours until evening check-in (assuming 7 PM)
                  19 - currentDate.getHours()
                }
                onQuickComplete={handleQuickComplete}
                quickCompletions={dailyTip.quick_completions || []}
                totalExperiments={previousTips.length + 1}
                successfulExperiments={previousTips.filter(t => t.user_response === 'try_it').length}
                tipHistory={(() => {
                  // Build tip history with full tip objects
                  const history = previousTips.map(dt => ({
                    dailyTip: dt,
                    tip: getTipById(dt.tip_id)!
                  })).filter(item => item.tip); // Filter out any where tip wasn't found

                  return history;
                })()}
                userProfile={userProfile}
                themeKey={cardThemeKey}
              />
              )
            ) : rejectedTipInfo ? (
              // Show the rejected tip view with feedback
              (() => {
                const savedTips = getSavedTipsDue(attempts, previousTips, currentDate);
                const availableSaved = savedTips.filter(t => !recentlySurfacedSavedIds.includes(t.tip_id));
                console.log('STAR - RejectedTipView render - Available saved tips:', availableSaved.length);
                console.log('STAR - Previous tips count:', previousTips.length);
                return (
                  <RejectedTipView
                    tip={rejectedTipInfo.tip}
                    rejection={rejectedTipInfo.attempt}
                    onRequestFeedback={() => {
                      setPendingOptOut({ 
                        tip: rejectedTipInfo.tip, 
                        tipId: rejectedTipInfo.tip.tip_id,
                        existingFeedback: rejectedTipInfo.attempt?.rejection_reason 
                      });
                      setShowFeedbackModal(true);
                    }}
                    onFindNewTip={handleFindNewTip}
                    savedCount={availableSaved.length}
                    onUseSavedTip={handleUseSavedTip}
                  />
                );
              })()
            ) : !dailyTip.user_response ? (
              // This case is handled above with shouldShowEnhancedCard
              null
            ) : dailyTip.user_response === 'maybe_later' ? (
              // User said "maybe later"
              <View style={styles.noTipCard}>
                <Ionicons name="bookmark" size={48} color="#FF9800" />
                <Text style={styles.noTipTitle}>Tip saved for later</Text>
                <Text style={styles.noTipText}>
                  We'll keep this in mind for another day. Check back tomorrow for a new experiment!
                </Text>
              </View>
            ) : isReplacingTip ? (
              // Loading next tip after "not for me" feedback
              <View style={styles.noTipCard}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.noTipTitle}>Finding another experiment...</Text>
                <Text style={styles.noTipText}>
                  Let's find something that works better for you!
                </Text>
              </View>
            ) : (
              // Unknown state - reset to show tip card
              (() => {
                console.warn('Unknown response state:', dailyTip.user_response);
                // Reset the invalid state
                if (dailyTip) {
                  StorageService.updateDailyTip(dailyTip.id, {
                    user_response: undefined,
                    responded_at: undefined,
                  });
                  setDailyTip({ ...dailyTip, user_response: undefined });
                }
                // Show the enhanced tip card again
                return (
                  <DailyTipCardEnhanced
                    tip={currentTip}
                    onResponse={handleTipResponse}
                    onThemeChange={setCardThemeKey}
                    onSavePersonalization={async (data) => {
                      // Save personalization data to the current daily tip
                      if (dailyTip) {
                        const updatedDailyTip = { ...dailyTip, personalization_data: data };
                        setDailyTip(updatedDailyTip);
                        await StorageService.updateDailyTip(updatedDailyTip);
                      }
                    }}
                    savedPersonalizationData={dailyTip?.personalization_data}
                    onNotForMe={() => {
                      console.log('Not for me clicked (fallback)!');
                      console.log('Current tip:', currentTip?.tip_id);
                      console.log('Skip feedback questions:', userProfile?.skip_feedback_questions);
                      
                      // Only open modal, don't trigger replacement
                      setPendingOptOut({ tip: currentTip, tipId: currentTip.tip_id });
                      if (userProfile.skip_feedback_questions) {
                        console.log('Skipping feedback modal, going straight to rejection');
                        handleNotForMeFeedback(null);
                      } else {
                        console.log('Setting showFeedbackModal to true');
                        setShowFeedbackModal(true);
                      }
                    }}
                    reasons={tipReasons}
                    userGoals={userProfile.goals}
                    rejectionInfo={
                      rejectedTipInfo && rejectedTipInfo.tip.tip_id === currentTip.tip_id
                        ? {
                            feedback: 'not_for_me' as const,
                            reason: rejectedTipInfo.attempt?.rejection_reason
                          }
                        : undefined
                    }
                    maybeLaterInfo={
                      dailyTip.user_response === 'maybe_later'
                        ? {
                            feedback: 'maybe_later' as const,
                            savedAt: dailyTip.responded_at
                          }
                        : undefined
                    }
                  />
                );
              })()
            )
          ) : (
            // No tip available
            <View style={styles.noTipCard}>
              <Ionicons name="sparkles" size={48} color="#4CAF50" />
              <Text style={styles.noTipTitle}>Loading your experiment...</Text>
              <Text style={styles.noTipText}>
                We're finding the perfect tip for you!
              </Text>
            </View>
            )}
          </ScrollView>
        )}
      </LinearGradient>
      
      {/* Focus Mode Prompt removed - now placed after Awards Modal */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  simulationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  simulationText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  simulationTapText: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.9,
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    position: 'relative',
  },
  headerIconsContainer: {
    position: 'absolute',
    right: 20,
    top: 8,
    flexDirection: 'row',
    gap: 8,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
  },
  identityAdjective: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  identityRole: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2E7D32',
  },
  profileButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  awardsCard: {
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  noTipCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 32,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  noTipTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginTop: 16,
    marginBottom: 8,
  },
  noTipText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
