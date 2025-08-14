import React, { useState, useEffect } from 'react';
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
import OnboardingQuiz from '@/components/OnboardingQuiz';
import DailyTipCardSwipe from '@/components/DailyTipCardSwipe';
import EveningCheckIn from '@/components/EveningCheckIn';
import ExperimentModeSwipe from '@/components/ExperimentModeSwipe';
import ExperimentComplete from '@/components/ExperimentComplete';
import NotForMeFeedback from '@/components/NotForMeFeedback';
import StorageService from '@/services/storage';
import TipRecommendationService from '@/services/tipRecommendation';
import NotificationService from '@/services/notifications';
import { UserProfile, DailyTip, TipAttempt, TipFeedback, QuickComplete, Tip } from '@/types/tip';
import { getTipById } from '@/data/tips';
import { format } from 'date-fns';

// Proper type definitions to prevent confusion
type ResponseStatus = 'try_it' | 'not_for_me' | 'maybe_later';

// Validation helper
const isValidResponseStatus = (value: any): value is ResponseStatus => {
  return value === 'try_it' || value === 'not_for_me' || value === 'maybe_later';
};

// Normalize legacy or invalid response values
const normalizeResponseStatus = (value: any): ResponseStatus | undefined => {
  if (!value) return undefined;
  // Handle legacy 'not_interested' values
  if (value === 'not_interested') return 'not_for_me';
  // Only return if it's a valid status
  return isValidResponseStatus(value) ? value : undefined;
};

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyTip, setDailyTip] = useState<DailyTip | null>(null);
  const [currentTip, setCurrentTip] = useState<any>(null);
  const [tipReasons, setTipReasons] = useState<string[]>([]);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [previousTips, setPreviousTips] = useState<DailyTip[]>([]);
  const [attempts, setAttempts] = useState<TipAttempt[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [pendingOptOut, setPendingOptOut] = useState<{ tip: Tip; tipId: string } | null>(null);
  const [isReplacingTip, setIsReplacingTip] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Starting app initialization...');
      
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
      tip.evening_check_in === 'not_great'
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
          console.log(`    Goals: ${fullTip.goal_tags.join(', ')}`);
          console.log(`    Type: ${fullTip.tip_type.join(', ')}`);
        }
      });
    }
    
    if (notForMeTips.length > 0) {
      console.log('NOT FOR ME experiments:');
      notForMeTips.forEach(tip => {
        const fullTip = getTipById(tip.tip_id);
        if (fullTip) {
          console.log(`  - ${fullTip.summary}`);
          console.log(`    Goals: ${fullTip.goal_tags.join(', ')}`);
          console.log(`    Type: ${fullTip.tip_type.join(', ')}`);
        }
      });
    }
    
    // Check if we already have a tip for today
    const today = format(new Date(), 'yyyy-MM-dd');
    
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
    const todaysTip = todaysTips.find(t => normalizeResponseStatus(t.user_response) !== 'not_for_me')
                    ?? todaysTips[0];

    if (todaysTip) {
      // Normalize any legacy response values
      const normalizedTip = {
        ...todaysTip,
        user_response: normalizeResponseStatus(todaysTip.user_response)
      };
      setDailyTip(normalizedTip);
      
      // Load the EXISTING tip by its ID, not a new recommendation
      const existingTip = getTipById(todaysTip.tip_id);
      if (existingTip) {
        setCurrentTip(existingTip);
        // We can still show reasons if we want to recalculate them
        const tipScore = TipRecommendationService.getDailyTip(profile, tips, tipAttempts);
        setTipReasons(tipScore?.reasons || []);
      } else {
        // Fallback: if tip not found in database, get a new one
        console.warn(`Tip with ID ${todaysTip.tip_id} not found in database`);
        const tipScore = TipRecommendationService.getDailyTip(profile, tips, tipAttempts);
        if (tipScore) {
          setCurrentTip(tipScore.tip);
          setTipReasons(tipScore.reasons);
        }
      }
      
      // Check if we need to show check-in
      if (todaysTip.user_response === 'try_it' && !todaysTip.evening_check_in) {
        const now = new Date().getHours();
        if (now >= 18) {
          setShowCheckIn(true);
        }
      }
    } else {
      // Get a new tip for today
      const tipScore = TipRecommendationService.getDailyTip(profile, tips, tipAttempts);
      
      if (tipScore) {
        const newDailyTip: DailyTip = {
          id: Date.now().toString(),
          user_id: profile.id,
          tip_id: tipScore.tip.tip_id,
          presented_date: new Date(),
        };
        
        await StorageService.saveDailyTip(newDailyTip);
        setDailyTip(newDailyTip);
        setCurrentTip(tipScore.tip);
        setTipReasons(tipScore.reasons);
      }
    }
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    await loadDailyTip(profile, [], []);
  };

  const handleTipResponse = async (response: ResponseStatus) => {
    if (!dailyTip || !userProfile || !currentTip) return;

    // Now only handles try_it and maybe_later
    // not_for_me is handled by the separate onNotForMe callback
    const updatedTip = {
      ...dailyTip,
      user_response: response as any,
      responded_at: new Date(),
    };
    
    await StorageService.updateDailyTip(dailyTip.id, {
      user_response: response as any,
      responded_at: new Date(),
    });
    
    setDailyTip(updatedTip);

    if (response === 'try_it') {
      await NotificationService.scheduleEveningCheckIn(dailyTip.tip_id, 19);
      // Don't show alert - the ExperimentMode component will handle the celebration
    } else if (response === 'maybe_later') {
      // Create a snooze attempt for the recommendation algorithm
      const snoozeAttempt: TipAttempt = {
        id: Date.now().toString(),
        tip_id: currentTip.tip_id,
        attempted_at: new Date(),
        created_at: new Date(),
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
    const today = new Date();
    
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
    
    // Create a permanent opt-out attempt with reason
    const optOutAttempt: TipAttempt = {
      id: Date.now().toString(),
      tip_id: pendingOptOut.tipId,
      attempted_at: new Date(),
      created_at: new Date(),
      feedback: 'not_for_me',
      rejection_reason: reason || undefined,
    };
    
    await StorageService.saveTipAttempt(optOutAttempt);
    const updatedAttempts = [...attempts, optOutAttempt];
    setAttempts(updatedAttempts);
    
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
    
    // Show confirmation (only if reason was provided)
    if (reason) {
      Alert.alert(
        'Thanks for the feedback!',
        'This helps me find better experiments for you.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Got it!',
        'We won\'t show you this experiment again.',
        [{ text: 'OK' }]
      );
    }
    
    // Use a transient UI flag instead of persisting state
    setIsReplacingTip(true);
    
    // Get next tip and update the existing record
    setTimeout(async () => {
      try {
        const tipScore = TipRecommendationService.getDailyTip(userProfile, previousTips, updatedAttempts);
        
        if (tipScore) {
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

  const handleQuickComplete = async (note?: 'worked_great' | 'went_ok' | 'not_sure' | 'not_for_me') => {
    if (!dailyTip) return;

    const quickComplete: QuickComplete = {
      completed_at: new Date(),
      quick_note: note,
    };

    const updatedCompletions = [...(dailyTip.quick_completions || []), quickComplete];
    
    // Update the daily tip with quick completion
    await StorageService.updateDailyTip(dailyTip.id, {
      quick_completions: updatedCompletions,
    });

    setDailyTip({
      ...dailyTip,
      quick_completions: updatedCompletions,
    });

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

  const handleCheckIn = async (feedback: TipFeedback, notes?: string) => {
    if (!dailyTip || !currentTip) return;

    const hasQuickCompletion = dailyTip.quick_completions && dailyTip.quick_completions.length > 0;

    // Save the check-in with reflection notes if already completed
    await StorageService.updateDailyTip(dailyTip.id, {
      evening_check_in: feedback,
      check_in_at: new Date(),
      ...(hasQuickCompletion && notes ? { evening_reflection: notes } : {}),
    });

    // Save the attempt
    const attempt: TipAttempt = {
      id: Date.now().toString(),
      tip_id: dailyTip.tip_id,
      attempted_at: new Date(),
      feedback,
      notes: hasQuickCompletion ? `[Reflection] ${notes || ''}` : notes,
    };
    
    await StorageService.saveTipAttempt(attempt);
    
    // Update state to show completion view
    setDailyTip({
      ...dailyTip,
      evening_check_in: feedback,
      check_in_at: new Date(),
      ...(hasQuickCompletion && notes ? { evening_reflection: notes } : {}),
    });
    setShowCheckIn(false);
    setAttempts([...attempts, attempt]);

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
    return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
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
  return (
    <SafeAreaView style={styles.container}>
      {/* Feedback Modal */}
      {showFeedbackModal && pendingOptOut && (
        <NotForMeFeedback
          visible={showFeedbackModal}
          tip={pendingOptOut.tip}
          onClose={() => {
            setShowFeedbackModal(false);
            handleNotForMeFeedback(null);
          }}
          onFeedback={handleNotForMeFeedback}
        />
      )}
      
      <LinearGradient
        colors={['#E8F5E9', '#FFFFFF']}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {new Date().getHours() < 12 ? 'Good Morning' :
                 new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
                {/* Debug: Show current hour */}
                {__DEV__ && ` (${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')})`}
              </Text>
              <Text style={styles.title}>Habit Helper</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {/* Testing: Simulate new day */}
              {__DEV__ && (
                <TouchableOpacity 
                  style={styles.profileButton}
                  onPress={async () => {
                    // Get all recommendations and filter out previously shown tips
                    const allRecommendations = TipRecommendationService.getRecommendations(
                      userProfile!, 
                      previousTips, 
                      attempts,
                      10 // Get more recommendations to choose from
                    );
                    
                    // Filter out tips that have already been shown
                    const shownTipIds = previousTips.map(t => t.tip_id);
                    if (dailyTip) {
                      shownTipIds.push(dailyTip.tip_id);
                    }
                    
                    const newTips = allRecommendations.filter(
                      rec => !shownTipIds.includes(rec.tip.tip_id)
                    );
                    
                    if (newTips.length > 0) {
                      const tipScore = newTips[0]; // Get the best new tip
                      
                      // Create a fake "day 3" tip
                      const newDailyTip: DailyTip = {
                        id: `day3-${Date.now()}`,
                        user_id: userProfile!.id,
                        tip_id: tipScore.tip.tip_id,
                        presented_date: new Date(), // This would normally be tomorrow
                      };
                      
                      // Don't save to storage - just update state for testing
                      setDailyTip(newDailyTip);
                      setCurrentTip(tipScore.tip);
                      setTipReasons(tipScore.reasons);
                      setShowCheckIn(false);
                      
                      Alert.alert(
                        'Test Mode: Day 3',
                        `Showing a new tip you haven't seen before: "${tipScore.tip.summary.substring(0, 50)}..."`,
                        [{ text: 'OK' }]
                      );
                    } else {
                      Alert.alert(
                        'No New Tips',
                        'All tips have been shown. Add more tips to the database!',
                        [{ text: 'OK' }]
                      );
                    }
                  }}
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

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{previousTips.length + (dailyTip ? 1 : 0)}</Text>
              <Text style={styles.statLabel}>Experiments</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {previousTips.filter(tip => tip.user_response === 'try_it').length + 
                 (dailyTip?.user_response === 'try_it' ? 1 : 0)}
              </Text>
              <Text style={styles.statLabel}>Tried</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {previousTips.filter(tip => 
                  tip.quick_completions?.some(c => c.quick_note === 'worked_great') ||
                  tip.evening_check_in === 'went_great'
                ).length + 
                (dailyTip?.quick_completions?.some(c => c.quick_note === 'worked_great') || 
                 dailyTip?.evening_check_in === 'went_great' ? 1 : 0)}
              </Text>
              <Text style={styles.statLabel}>Loved</Text>
            </View>
          </View>

          {/* Daily Tip, Experiment Mode, or Completion View */}
          {console.log('Main content check - currentTip:', currentTip ? 'exists' : 'null', 'dailyTip:', dailyTip ? 'exists' : 'null')}
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
              <ExperimentModeSwipe
                tip={currentTip}
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
                  19 - new Date().getHours()
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
              />
            ) : !dailyTip.user_response ? (
              // Show tip card if no response yet
              <DailyTipCardSwipe
                tip={currentTip}
                onResponse={handleTipResponse}
                onNotForMe={() => {
                  // Only open modal, don't trigger replacement
                  setPendingOptOut({ tip: currentTip, tipId: currentTip.tip_id });
                  if (userProfile.skip_feedback_questions) {
                    handleNotForMeFeedback(null);
                  } else {
                    setShowFeedbackModal(true);
                  }
                }}
                reasons={tipReasons}
              />
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
                // Show the tip card again
                return (
                  <DailyTipCardSwipe
                    tip={currentTip}
                    onResponse={handleTipResponse}
                    onNotForMe={() => {
                      // Only open modal, don't trigger replacement
                      setPendingOptOut({ tip: currentTip, tipId: currentTip.tip_id });
                      if (userProfile.skip_feedback_questions) {
                        handleNotForMeFeedback(null);
                      } else {
                        setShowFeedbackModal(true);
                      }
                    }}
                    reasons={tipReasons}
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
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
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
    paddingTop: 20,
    paddingBottom: 16,
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
  profileButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
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
