import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { DailyTip, QuickComplete, Tip } from '../types/tip';
import QuickCompleteModal from './QuickComplete';
import TipHistoryModal from './TipHistoryModal';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  tip: Tip;
  personalizedPlan?: string | null;
  onViewDetails: () => void;
  timeUntilCheckIn: number;
  onQuickComplete: (note?: 'worked_great' | 'went_ok' | 'not_sure' | 'not_for_me') => void;
  quickCompletions?: QuickComplete[];
  totalExperiments?: number;
  successfulExperiments?: number;
  tipHistory?: Array<{
    dailyTip: DailyTip;
    tip: Tip;
  }>;
  personalizationData?: {
    type?: string;
    prompt?: string;
    savedData?: any;
  };
}

// Confetti particle component
const ConfettiParticle = ({ delay, startX }: { delay: number; startX: number }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(-SCREEN_HEIGHT, {
        duration: 3000,
        easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      })
    );
    
    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(Math.random() * 100 - 50, { duration: 1500 }),
        withTiming(Math.random() * 100 - 50, { duration: 1500 })
      )
    );
    
    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: 3000, easing: Easing.linear }),
        1
      )
    );
    
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(2600, withTiming(0, { duration: 200 }))
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const colors = ['#4CAF50', '#FFC107', '#2196F3', '#E91E63', '#9C27B0'];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        animatedStyle,
        {
          left: startX,
          backgroundColor: color,
        },
      ]}
    />
  );
};

export default function ExperimentModeSwipe({ 
  tip, 
  personalizedPlan = null,
  onViewDetails, 
  timeUntilCheckIn, 
  onQuickComplete,
  quickCompletions = [],
  totalExperiments = 0,
  successfulExperiments = 0,
  tipHistory = [],
  personalizationData
}: Props) {
  const [showQuickComplete, setShowQuickComplete] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalTips, setModalTips] = useState<Array<{ dailyTip: DailyTip; tip: Tip }>>([]);
  const [showCelebration, setShowCelebration] = useState(true);
  const [hasSeenCelebration, setHasSeenCelebration] = useState(false);
  const [showTipDetails, setShowTipDetails] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  
  const scrollX = useSharedValue(0);
  const scale = useSharedValue(0);
  const celebrationScale = useSharedValue(0);
  const celebrationOpacity = useSharedValue(0);
  const mainButtonScale = useSharedValue(0.8);
  const mainButtonGlow = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const holdProgress = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate actual progress based on time
  const calculateProgress = () => {
    const currentHour = new Date().getHours();
    const checkInHour = 19; // 7 PM check-in
    
    let totalHours = checkInHour - currentHour;
    if (totalHours <= 0) {
      return 100;
    }
    
    const typicalDayHours = 10;
    const hoursElapsed = typicalDayHours - totalHours;
    const progress = Math.max(0, Math.min(100, (hoursElapsed / typicalDayHours) * 100));
    
    return progress;
  };

  const hideCelebrationAfterDelay = () => {
    setTimeout(() => {
      setShowCelebration(false);
      setHasSeenCelebration(true);
    }, 3500);
  };

  useEffect(() => {
    if (!hasSeenCelebration) {
      // Initial celebration animation
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      celebrationScale.value = withSpring(1, { 
        damping: 8, 
        stiffness: 100,
        mass: 0.5
      });
      
      celebrationOpacity.value = withTiming(1, { duration: 300 });
      
      // After celebration, fade it out and bring in the main button
      celebrationOpacity.value = withDelay(
        2500,
        withTiming(0, { 
          duration: 800,
          easing: Easing.bezier(0.4, 0, 0.2, 1)
        }, () => {
          runOnJS(hideCelebrationAfterDelay)();
        })
      );
      
      // Animate main button to be prominent
      mainButtonScale.value = withDelay(
        2000,
        withSpring(1, { 
          damping: 10, 
          stiffness: 150 
        })
      );
    } else {
      // If celebration has been seen, just show the button
      mainButtonScale.value = withSpring(1, { damping: 10, stiffness: 150 });
    }

    scale.value = withSpring(1, { damping: 15, stiffness: 200 });

    const currentProgress = calculateProgress();
    progressWidth.value = withDelay(
      500,
      withTiming(currentProgress, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
    );
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleSwipeToPage = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handlePressIn = () => {
    setIsHolding(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Start the hold progress animation
    holdProgress.value = withTiming(1, {
      duration: 1500, // 1.5 seconds to complete
      easing: Easing.linear,
    });

    // Set timeout to trigger completion
    holdTimeoutRef.current = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowQuickComplete(true);
      setIsHolding(false);
      holdProgress.value = 0;
    }, 1500);
  };

  const handlePressOut = () => {
    if (isHolding) {
      setIsHolding(false);
      // Cancel the completion
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
      // Reset the progress
      holdProgress.value = withTiming(0, { duration: 200 });
    }
  };

  const formatTimeRemaining = (hours: number) => {
    if (hours <= 0) return "Check-in time!";
    if (hours === 1) return "1 hour until check-in";
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} minutes until check-in`;
    }
    return `${Math.round(hours)} hours until check-in`;
  };

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
    opacity: celebrationOpacity.value,
  }));

  const mainButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mainButtonScale.value }],
  }));

  const holdProgressAnimatedStyle = useAnimatedStyle(() => {
    const strokeDasharray = 2 * Math.PI * 64; // circumference of circle with radius 64
    const strokeDashoffset = strokeDasharray * (1 - holdProgress.value);
    
    return {
      strokeDashoffset,
    };
  });

  const handleShowAllExperiments = () => {
    setModalTitle('All Experiments');
    setModalTips(tipHistory);
    setModalVisible(true);
  };

  const handleShowTriedExperiments = () => {
    setModalTitle('Experiments You Tried');
    const triedTips = tipHistory.filter(({ dailyTip }) => 
      dailyTip.user_response === 'try_it'
    );
    setModalTips(triedTips);
    setModalVisible(true);
  };

  const handleShowLovedExperiments = () => {
    setModalTitle('Experiments You Loved');
    const lovedTips = tipHistory.filter(({ dailyTip }) => 
      dailyTip.evening_check_in === 'went_great' || 
      dailyTip.quick_completions?.some(c => c.quick_note === 'worked_great')
    );
    setModalTips(lovedTips);
    setModalVisible(true);
  };

  const renderProgressCard = () => (
    <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
      {/* Celebration Overlay - only shows initially */}
      {showCelebration && !hasSeenCelebration && (
        <Animated.View 
          style={[
            styles.celebrationOverlay, 
            celebrationAnimatedStyle
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={['rgba(76, 175, 80, 0.95)', 'rgba(69, 178, 85, 0.95)']}
            style={styles.celebrationGradient}
          >
            <Ionicons name="rocket" size={72} color="#FFF" />
            <Text style={styles.celebrationTitle}>You're Experimenting!</Text>
            <Text style={styles.celebrationSubtitle}>Let's make it happen! 🎉</Text>
          </LinearGradient>
        </Animated.View>
      )}

      <LinearGradient
        colors={['#FFFFFF', '#F8FFF8']}
        style={styles.card}
      >
        {/* Compact Header */}
        <View style={styles.compactHeader}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>ACTIVE</Text>
          </View>
          <Text style={styles.timeText}>{formatTimeRemaining(timeUntilCheckIn)}</Text>
        </View>

        {/* Experiment Title */}
        <Text style={styles.experimentTitle}>{tip.summary}</Text>

        {/* Main Action Button - Circular with Hold to Confirm */}
        {quickCompletions.length === 0 ? (
          <View>
            <Animated.View style={[styles.circularButtonContainer, mainButtonAnimatedStyle]}>
              <TouchableOpacity 
                style={styles.circularButton}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.95}
              >
                <LinearGradient
                  colors={isHolding ? ['#45B255', '#4CAF50'] : ['#4CAF50', '#45B255']}
                  style={styles.circularButtonGradient}
                >
                  <Ionicons 
                    name="checkmark-circle" 
                    size={40} 
                    color="#FFF" 
                  />
                  <Text style={styles.circularButtonText}>
                    {isHolding ? 'Hold to\nComplete' : 'I did it!'}
                  </Text>
                </LinearGradient>
                
                {/* Progress Ring */}
                <Svg 
                  style={styles.progressRing} 
                  width={140} 
                  height={140}
                  viewBox="0 0 140 140"
                >
                  {/* Background circle - light gray */}
                  <Circle
                    cx="70"
                    cy="70"
                    r="64"
                    stroke="rgba(224, 224, 224, 0.8)"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress circle - fills as you hold */}
                  <AnimatedCircle
                    cx="70"
                    cy="70"
                    r="64"
                    stroke="#2E7D32"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 64}
                    animatedProps={holdProgressAnimatedStyle}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                  />
                </Svg>
              </TouchableOpacity>
            </Animated.View>
            
            {/* Quick Access Buttons */}
            <View style={styles.quickAccessButtons}>
              <TouchableOpacity 
                style={styles.quickAccessButton}
                onPress={() => handleSwipeToPage(1)}
              >
                <Ionicons name="book-outline" size={18} color="#4CAF50" />
                <Text style={styles.quickAccessText}>Tips</Text>
              </TouchableOpacity>
              
              {(personalizedPlan || tip.personalization_prompt) && (
                <TouchableOpacity 
                  style={styles.quickAccessButton}
                  onPress={() => handleSwipeToPage(2)}
                >
                  <Ionicons name="list-outline" size={18} color="#4CAF50" />
                  <Text style={styles.quickAccessText}>Plan</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.completedContainer}>
            <LinearGradient
              colors={['#E8F5E9', '#C8E6C9']}
              style={styles.completedGradient}
            >
              <View style={styles.completedContent}>
                <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.completedTitle}>
                    Completed {quickCompletions.length}x today! 🎉
                  </Text>
                  {quickCompletions[quickCompletions.length - 1]?.quick_note && (
                    <Text style={styles.completedNote}>
                      {
                        quickCompletions[quickCompletions.length - 1].quick_note === 'worked_great' ? 'That worked great!' :
                        quickCompletions[quickCompletions.length - 1].quick_note === 'went_ok' ? 'That went okay' :
                        quickCompletions[quickCompletions.length - 1].quick_note === 'not_sure' ? 'Not sure yet' :
                        'Not for me'
                      }
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity 
                style={styles.doAgainButton}
                onPress={() => setShowQuickComplete(true)}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45B255']}
                  style={styles.doAgainGradient}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#FFF" />
                  <Text style={styles.doAgainText}>Did it again</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Progress Bar - Subtle */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressAnimatedStyle]}>
              <LinearGradient
                colors={['#81C784', '#A5D6A7']}
                style={styles.progressGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
          <Text style={styles.progressLabel}>Progress through the day</Text>
        </View>

        {/* Quick Instructions */}
        <View style={styles.quickInstructions}>
          <Text style={styles.quickInstructionsTitle}>Quick Reminder:</Text>
          <Text style={styles.quickInstructionsText} numberOfLines={3}>
            {tip.details_md.split('\n')[0].replace('**The Experiment:** ', '')}
          </Text>
        </View>

        {/* Navigation Cards */}
        <View style={styles.navCards}>
          <TouchableOpacity 
            style={styles.navCard}
            onPress={() => handleSwipeToPage(1)}
          >
            <Ionicons name="book-outline" size={20} color="#4CAF50" />
            <Text style={styles.navCardText}>Full Instructions</Text>
          </TouchableOpacity>
          
          {(personalizedPlan || tip.personalization_prompt) && (
            <TouchableOpacity 
              style={styles.navCard}
              onPress={() => handleSwipeToPage(2)}
            >
              <Ionicons name="list-outline" size={20} color="#4CAF50" />
              <Text style={styles.navCardText}>Your Plan</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.navCard}
            onPress={() => handleSwipeToPage(3)}
          >
            <Ionicons name="trophy-outline" size={20} color="#4CAF50" />
            <Text style={styles.navCardText}>Your Stats</Text>
          </TouchableOpacity>
        </View>

      </LinearGradient>
    </View>
  );

  // Parse details_md to extract "How to Try It" section
  const parseHowToSection = () => {
    const content = tip.details_md || '';
    const howMatch = content.match(/\*\*How to Try It:\*\*(.+?)$/s);
    if (howMatch) {
      return howMatch[1].trim();
    }
    // Fallback to the experiment section if no "How to Try It" found
    const experimentMatch = content.match(/\*\*The Experiment:\*\*(.+?)(?=\*\*Why it Works:|\*\*How to|$)/s);
    if (experimentMatch) {
      return experimentMatch[1].trim();
    }
    return content;
  };

  const getTimeLabel = (time: string) => {
    const labels: Record<string, string> = {
      '0_5_min': '< 5 min',
      '5_15_min': '5-15 min',
      '15_60_min': '15-60 min',
      '>60_min': '> 1 hour',
    };
    return labels[time] || time;
  };

  const renderInstructionsCard = () => {
    const howToContent = parseHowToSection();
    
    return (
      <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FFF8']}
          style={styles.card}
        >
          <View style={styles.instructionsHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => handleSwipeToPage(0)}
            >
              <Ionicons name="chevron-back" size={20} color="#4CAF50" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.instructionsTitle}>How To Do It</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView 
            style={styles.instructionsScrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Tip Summary */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>TODAY'S EXPERIMENT</Text>
              <Text style={styles.summaryText}>{tip.summary}</Text>
            </View>

            {/* Full Instructions - parsed How To section */}
            <View style={styles.howToSection}>
              {howToContent.split('\n').map((line, index) => {
                const isBullet = line.trim().startsWith('•');
                if (isBullet) {
                  return (
                    <View key={index} style={styles.bulletPoint}>
                      <Text style={styles.bulletIcon}>•</Text>
                      <Text style={styles.bulletText}>{line.replace('•', '').trim()}</Text>
                    </View>
                  );
                }
                return line.trim() ? (
                  <Text key={index} style={styles.detailsText}>{line}</Text>
                ) : null;
              })}
            </View>

            {/* Info Grid - matching DailyTipCardEnhanced layout */}
            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Ionicons name="sunny-outline" size={20} color="#666" />
                <Text style={styles.infoCardLabel}>Best Time</Text>
                <Text style={styles.infoCardValue}>
                  {(tip.time_of_day ?? []).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ') || 'Any time'}
                </Text>
              </View>
              
              <View style={styles.infoCard}>
                <Ionicons name="cash-outline" size={20} color="#666" />
                <Text style={styles.infoCardLabel}>Cost</Text>
                <Text style={styles.infoCardValue}>{tip.money_cost_enum ?? 'Free'}</Text>
              </View>
              
              <View style={styles.infoCard}>
                <Ionicons name="location-outline" size={20} color="#666" />
                <Text style={styles.infoCardLabel}>Where</Text>
                <Text style={styles.infoCardValue}>
                  {(tip.location_tags ?? []).map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ') || 'Anywhere'}
                </Text>
              </View>
            </View>

            {/* Goals - optional section */}
            {tip.goal_tags && tip.goal_tags.length > 0 && (
              <View style={styles.goalsSection}>
                <Text style={styles.sectionTitle}>This Helps With</Text>
                <View style={styles.goalsGrid}>
                  {tip.goal_tags.map(goal => (
                    <View key={goal} style={styles.goalChip}>
                      <Text style={styles.goalChipText}>
                        {goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity 
          style={styles.floatingActionButton}
          onPress={() => {
            handleSwipeToPage(0);
            setShowQuickComplete(true);
          }}
        >
          <LinearGradient
            colors={['#4CAF50', '#45B255']}
            style={styles.floatingButtonGradient}
          >
            <Ionicons name="checkmark" size={24} color="#FFF" />
            <Text style={styles.floatingButtonText}>I'm Doing It!</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
    );
  };

  const renderPlanCard = () => {
    // Check if we have personalization data to show
    const hasPersonalization = tip.personalization_prompt || personalizedPlan;
    
    if (!hasPersonalization) {
      return null;
    }

    return (
      <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FFF8']}
          style={styles.card}
        >
          <View style={styles.instructionsHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => handleSwipeToPage(0)}
            >
              <Ionicons name="chevron-back" size={20} color="#4CAF50" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.instructionsTitle}>Your Plan</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView 
            style={styles.planScrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Show personalized plan if available */}
            {personalizedPlan && (
              <View style={styles.personalizedPlanSection}>
                <View style={styles.planHeader}>
                  <Ionicons name="clipboard-outline" size={24} color="#4CAF50" />
                  <Text style={styles.planTitle}>Your Personal Approach</Text>
                </View>
                <View style={styles.planContent}>
                  <Text style={styles.planText}>{personalizedPlan}</Text>
                </View>
              </View>
            )}

            {/* Show personalization prompt if available */}
            {tip.personalization_prompt && (
              <View style={styles.personalizationSection}>
                <Text style={styles.personalizationTitle}>Make It Your Own</Text>
                <View style={styles.personalizationPromptBox}>
                  <Text style={styles.personalizationPromptText}>
                    {tip.personalization_prompt}
                  </Text>
                  
                  {/* Show saved personalization data if available */}
                  {personalizationData?.savedData && (
                    <View style={styles.savedPersonalizationBox}>
                      <View style={styles.savedHeader}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        <Text style={styles.savedLabel}>Your Answer</Text>
                      </View>
                      <Text style={styles.savedDataText}>
                        {typeof personalizationData.savedData === 'string' 
                          ? personalizationData.savedData 
                          : JSON.stringify(personalizationData.savedData, null, 2)}
                      </Text>
                    </View>
                  )}
                  
                  {!personalizationData?.savedData && (
                    <TouchableOpacity 
                      style={styles.addPersonalizationButton}
                      onPress={() => {
                        // This would navigate to personalization in the non-experimenting mode
                        Alert.alert('Add Your Plan', 'Switch to planning mode to customize this tip');
                      }}
                    >
                      <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
                      <Text style={styles.addPersonalizationText}>Add Your Answer</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Quick reminders */}
            <View style={styles.remindersSection}>
              <Text style={styles.remindersSectionTitle}>Quick Reminders</Text>
              <View style={styles.remindersList}>
                <View style={styles.reminderItem}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#4CAF50" />
                  <Text style={styles.reminderText}>Track how it feels throughout the day</Text>
                </View>
                <View style={styles.reminderItem}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#4CAF50" />
                  <Text style={styles.reminderText}>Adjust as needed to fit your schedule</Text>
                </View>
                <View style={styles.reminderItem}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#4CAF50" />
                  <Text style={styles.reminderText}>Remember: progress over perfection!</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  };

  const renderStatsCard = () => (
    <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FFF8']}
        style={styles.card}
      >
        <View style={styles.instructionsHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => handleSwipeToPage(0)}
          >
            <Ionicons name="chevron-back" size={20} color="#4CAF50" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.instructionsTitle}>Your Progress</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView 
          style={styles.statsScrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Overview */}
          <View style={styles.statsOverview}>
            <Text style={styles.statsTitle}>Your Experiment Journey</Text>
            <View style={styles.statsGrid}>
              <TouchableOpacity 
                style={styles.statCard}
                onPress={handleShowAllExperiments}
              >
                <Text style={styles.statNumber}>{totalExperiments}</Text>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statSubLabel}>Experiments</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.statCard}
                onPress={handleShowTriedExperiments}
              >
                <Text style={styles.statNumber}>{successfulExperiments}</Text>
                <Text style={styles.statLabel}>Tried</Text>
                <Text style={styles.statSubLabel}>So far</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.statCard}
                onPress={handleShowLovedExperiments}
              >
                <Text style={styles.statNumber}>
                  {tipHistory.filter(({ dailyTip }) => 
                    dailyTip.evening_check_in === 'went_great' || 
                    dailyTip.quick_completions?.some(c => c.quick_note === 'worked_great')
                  ).length}
                </Text>
                <Text style={styles.statLabel}>Loved</Text>
                <Text style={styles.statSubLabel}>Keepers!</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Motivational Message */}
          <View style={styles.motivationalSection}>
            <LinearGradient
              colors={['#E8F5E9', '#F1F8E9']}
              style={styles.motivationalGradient}
            >
              <Ionicons name="star" size={32} color="#4CAF50" />
              <Text style={styles.motivationalTitle}>Keep Going!</Text>
              <Text style={styles.motivationalText}>
                Every experiment teaches you something valuable about what works for YOUR body and life.
              </Text>
            </LinearGradient>
          </View>

          {/* Success Rate */}
          {successfulExperiments > 0 && (
            <View style={styles.successRateCard}>
              <Text style={styles.successRateTitle}>Success Rate</Text>
              <View style={styles.successRateBar}>
                <View 
                  style={[
                    styles.successRateFill,
                    { width: `${(successfulExperiments / totalExperiments) * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.successRateText}>
                {Math.round((successfulExperiments / totalExperiments) * 100)}% experiments tried
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );

  const pages = [
    { key: 'progress', render: renderProgressCard },
    { key: 'instructions', render: renderInstructionsCard },
    ...(tip.personalization_prompt || personalizedPlan ? [{ key: 'plan', render: renderPlanCard }] : []),
    { key: 'stats', render: renderStatsCard },
  ];

  const DotIndicator = ({ index }: { index: number }) => {
    const animatedDotStyle = useAnimatedStyle(() => {
      const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
      
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1.2, 0.8],
        Extrapolate.CLAMP
      );
      
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.4, 1, 0.4],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return <Animated.View style={[styles.dot, animatedDotStyle]} />;
  };

  return (
    <View style={styles.container}>
      {/* Confetti Animation (only on first load) */}
      {showCelebration && !hasSeenCelebration && (
        <View style={styles.confettiContainer} pointerEvents="none">
          {Array.from({ length: 20 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 50}
              startX={Math.random() * SCREEN_WIDTH}
            />
          ))}
        </View>
      )}

      <Animated.FlatList
        ref={flatListRef}
        data={pages}
        renderItem={({ item }) => item.render()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.key}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const newPage = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentPage(newPage);
        }}
      />
      
      <View style={styles.pagination}>
        {pages.map((_, index) => (
          <DotIndicator key={index} index={index} />
        ))}
      </View>

      {/* Quick Complete Modal */}
      <QuickCompleteModal
        visible={showQuickComplete}
        onClose={() => setShowQuickComplete(false)}
        onQuickComplete={(note) => {
          onQuickComplete(note);
          setShowQuickComplete(false);
        }}
      />

      {/* Tip History Modal */}
      <TipHistoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalTitle}
        tips={modalTips}
      />
      
      {/* Plan Details Modal */}
      {personalizedPlan && (
        <View>
          <TouchableOpacity
            style={[
              styles.modalOverlay,
              { display: showPlanDetails ? 'flex' : 'none' }
            ]}
            activeOpacity={1}
            onPress={() => setShowPlanDetails(false)}
          >
            <TouchableOpacity
              style={styles.planModal}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.planModalHeader}>
                <Text style={styles.planModalTitle}>Your Plan</Text>
                <TouchableOpacity onPress={() => setShowPlanDetails(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <View style={styles.planModalContent}>
                <Text style={styles.planText}>{personalizedPlan}</Text>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    minHeight: 500,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  confettiParticle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
    bottom: -10,
  },
  celebrationOverlay: {
    position: 'absolute',
    top: '20%',
    left: 20,
    right: 20,
    zIndex: 100,
    borderRadius: 20,
    overflow: 'hidden',
  },
  celebrationGradient: {
    padding: 32,
    alignItems: 'center',
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 16,
    textAlign: 'center',
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 8,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4CAF50',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  experimentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 28,
    marginBottom: 24,
  },
  circularButtonContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circularButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  circularButtonGradient: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  progressRing: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  quickAccessButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    justifyContent: 'center',
  },
  quickAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FFF8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  completedContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  completedGradient: {
    padding: 20,
  },
  completedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  completedNote: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  doAgainButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  doAgainGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  doAgainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  progressSection: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E8E8E8',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressGradient: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  quickInstructions: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  quickInstructionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  quickInstructionsText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  navCards: {
    flexDirection: 'row',
    gap: 12,
  },
  navCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FFF8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  navCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  instructionsScrollView: {
    flex: 1,
    marginBottom: 80,
  },
  summaryBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4CAF50',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    lineHeight: 24,
  },
  howToSection: {
    marginBottom: 24,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  bulletIcon: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 10,
    fontWeight: '700',
  },
  bulletText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 22,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginBottom: 8,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoCardLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    marginTop: 8,
  },
  infoCardValue: {
    fontSize: 13,
    color: '#424242',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  goalsSection: {
    marginBottom: 20,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalChip: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  goalChipText: {
    fontSize: 11,
    color: '#E65100',
    fontWeight: '500',
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  floatingButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  floatingButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  statsScrollView: {
    flex: 1,
  },
  statsOverview: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    flex: 0.3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginTop: 4,
  },
  statSubLabel: {
    fontSize: 11,
    color: '#999',
  },
  motivationalSection: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  motivationalGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  motivationalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
  },
  motivationalText: {
    fontSize: 14,
    color: '#424242',
    textAlign: 'center',
    lineHeight: 20,
  },
  successRateCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  successRateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  successRateBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  successRateFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  successRateText: {
    fontSize: 12,
    color: '#666',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planModal: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 20,
    maxWidth: 400,
    width: '90%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  planModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  planModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  planModalContent: {
    padding: 20,
  },
  planText: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
  },
  planScrollView: {
    flex: 1,
    marginBottom: 80,
  },
  personalizedPlanSection: {
    marginBottom: 24,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  planContent: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  personalizationSection: {
    marginBottom: 24,
  },
  personalizationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  personalizationPromptBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
  },
  personalizationPromptText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 22,
    marginBottom: 16,
  },
  savedPersonalizationBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  savedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  savedLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
  savedDataText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  addPersonalizationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 12,
  },
  addPersonalizationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  remindersSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  remindersSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  remindersList: {
    gap: 10,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reminderText: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
  },
});