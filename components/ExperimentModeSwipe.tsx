import StorageService from '@/services/storage';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { SimplifiedTip } from '../types/simplifiedTip';
import { DailyTip, QuickComplete } from '../types/tip';
import QuickCompleteModal from './QuickComplete';
import TipHistoryModal from './TipHistoryModal';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  tip: SimplifiedTip;
  personalizedPlan?: string | null;
  onViewDetails: () => void;
  timeUntilCheckIn: number;
  onQuickComplete: (note?: 'worked_great' | 'went_ok' | 'not_sure' | 'not_for_me') => void;
  quickCompletions?: QuickComplete[];
  totalExperiments?: number;
  successfulExperiments?: number;
  tipHistory?: Array<{
    dailyTip: DailyTip;
    tip: SimplifiedTip;
  }>;
  personalizationData?: {
    type?: string;
    prompt?: string;
    savedData?: any;
  };
  showHeaderStats?: boolean;
  onToggleHeaderStats?: () => void;
  isInFocusMode?: boolean;
  focusProgress?: {
    daysCompleted: number;
    daysTotal: number;
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
  personalizationData,
  showHeaderStats = false,
  onToggleHeaderStats,
  isInFocusMode = false,
  focusProgress
}: Props) {
  const [showQuickComplete, setShowQuickComplete] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [viewedCards, setViewedCards] = useState<string[]>(['protip']);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalTips, setModalTips] = useState<Array<{ dailyTip: DailyTip; tip: SimplifiedTip }>>([]);
  const [showCelebration, setShowCelebration] = useState(true);
  const [hasSeenCelebration, setHasSeenCelebration] = useState(false);
  const [centralizedCompletionCount, setCentralizedCompletionCount] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  // Check-in state
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedInFavor, setSelectedInFavor] = useState<string[]>([]);
  const [selectedObstacles, setSelectedObstacles] = useState<string[]>([]);

  const celebrationScale = useSharedValue(0);
  const celebrationOpacity = useSharedValue(0);
  const holdProgress = useSharedValue(0);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const streak = focusProgress?.daysCompleted || 5;

  // Bottom sheet animations
  const backdropOpacity = useSharedValue(0);
  const sheetTranslateY = useSharedValue(400);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const openSheet = () => {
    backdropOpacity.value = withTiming(1, { duration: 250 });
    sheetTranslateY.value = withSpring(0, { damping: 20, stiffness: 300 });
  };

  const closeSheet = (callback?: () => void) => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    sheetTranslateY.value = withTiming(400, { duration: 250 }, () => {
      if (callback) {
        runOnJS(callback)();
      }
    });
  };

  // Open sheet when modals become visible
  useEffect(() => {
    if (showHelpMenu || activeCard || showCheckIn) {
      openSheet();
    }
  }, [showHelpMenu, activeCard, showCheckIn]);

  const helpOptions = [
    { emoji: '😅', label: 'I forgot', description: 'Set a reminder for later' },
    { emoji: '⏰', label: 'No time right now', description: 'Try a 2-min version instead' },
    { emoji: '😔', label: 'Not feeling it', description: 'Get a motivation boost' },
    { emoji: '🤔', label: "Something's in the way", description: "Let's problem-solve together" },
  ];

  // Check-in options with Ionicons
  const checkInOptions = {
    feeling: {
      label: "How are you feeling?",
      options: [
        { id: 'great', icon: 'sunny-outline' as const, label: 'Great' },
        { id: 'good', icon: 'happy-outline' as const, label: 'Good' },
        { id: 'okay', icon: 'remove-outline' as const, label: 'Okay' },
        { id: 'tired', icon: 'moon-outline' as const, label: 'Tired' },
        { id: 'stressed', icon: 'cloudy-outline' as const, label: 'Stressed' },
      ]
    },
    inFavor: {
      label: "What's working in your favor?",
      options: [
        { id: 'motivated', icon: 'flash-outline' as const, label: 'Feeling motivated' },
        { id: 'energized', icon: 'battery-full-outline' as const, label: 'Energized' },
        { id: 'free_time', icon: 'time-outline' as const, label: 'Have free time' },
        { id: 'prepared', icon: 'checkbox-outline' as const, label: 'Already prepped' },
        { id: 'support', icon: 'people-outline' as const, label: 'Have support' },
        { id: 'good_mood', icon: 'happy-outline' as const, label: 'In a good mood' },
      ]
    },
    obstacles: {
      label: "What might get in the way?",
      options: [
        { id: 'busy', icon: 'calendar-outline' as const, label: 'Busy schedule' },
        { id: 'tired', icon: 'moon-outline' as const, label: 'Feeling tired' },
        { id: 'stressed', icon: 'cloudy-outline' as const, label: 'Stressed out' },
        { id: 'unprepared', icon: 'alert-circle-outline' as const, label: 'Not prepared' },
        { id: 'temptation', icon: 'pizza-outline' as const, label: 'Temptations around' },
        { id: 'alone', icon: 'person-outline' as const, label: 'No support today' },
      ]
    }
  };

  const toggleInFavor = (id: string) => {
    if (selectedInFavor.includes(id)) {
      setSelectedInFavor(selectedInFavor.filter(f => f !== id));
    } else {
      setSelectedInFavor([...selectedInFavor, id]);
    }
  };

  const toggleObstacle = (id: string) => {
    if (selectedObstacles.includes(id)) {
      setSelectedObstacles(selectedObstacles.filter(o => o !== id));
    } else {
      setSelectedObstacles([...selectedObstacles, id]);
    }
  };

  const handleSaveCheckIn = () => {
    closeSheet(() => setShowCheckIn(false));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const totalCheckInSelections = selectedInFavor.length + selectedObstacles.length + (selectedFeeling ? 1 : 0);

  // Load centralized completion count on mount
  useEffect(() => {
    const loadCompletionCount = async () => {
      const completions = await StorageService.getHabitCompletions();
      const count = completions.get(tip.tip_id) || 0;
      setCentralizedCompletionCount(count);

      // If already completed today, mark as completed
      if (count > 0 || quickCompletions.length > 0) {
        setCompleted(true);
      }
    };
    loadCompletionCount();
  }, [tip.tip_id, quickCompletions.length]);

  useEffect(() => {
    if (!hasSeenCelebration) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      celebrationScale.value = withSpring(1, {
        damping: 8,
        stiffness: 100,
        mass: 0.5
      });

      celebrationOpacity.value = withTiming(1, { duration: 300 });

      celebrationOpacity.value = withDelay(
        2500,
        withTiming(0, {
          duration: 800,
          easing: Easing.bezier(0.4, 0, 0.2, 1)
        })
      );

      setTimeout(() => {
        setShowCelebration(false);
        setHasSeenCelebration(true);
      }, 3500);
    }
  }, []);

  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
    opacity: celebrationOpacity.value,
  }));

  // Progress ring animation for hold-to-complete
  const holdProgressAnimatedProps = useAnimatedProps(() => {
    const circumference = 2 * Math.PI * 75; // radius of 75 for larger button
    const strokeDashoffset = circumference * (1 - holdProgress.value);
    return {
      strokeDashoffset,
    };
  });

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompleted(true);
    setShowQuickComplete(true);
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
      setCompleted(true);
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

  const handleCardTap = (cardId: string) => {
    setActiveCard(cardId);
    if (!viewedCards.includes(cardId)) {
      setViewedCards([...viewedCards, cardId]);
    }
  };

  const formatTimeRemaining = (hours: number) => {
    if (hours <= 0) return "Check-in time!";
    if (hours === 1) return "1h left";
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m left`;
    }
    return `${Math.round(hours)}h left`;
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Tip Card */}
        <View style={styles.mainCard}>
          {/* Image/Visual Area with Action Buttons */}
          <LinearGradient
            colors={['#fed7aa', '#fde68a', '#fdba74']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.visualArea}
          >
            {/* Celebration Overlay */}
            {showCelebration && !hasSeenCelebration && (
              <Animated.View style={[styles.celebrationOverlay, celebrationAnimatedStyle]}>
                <LinearGradient
                  colors={['rgba(76, 175, 80, 0.95)', 'rgba(69, 178, 85, 0.95)']}
                  style={styles.celebrationGradient}
                >
                  <Ionicons name="rocket" size={72} color="#FFF" />
                  <Text style={styles.celebrationTitle}>You're Experimenting!</Text>
                  <Text style={styles.celebrationSubtitle}>Let's make it happen!</Text>
                </LinearGradient>
              </Animated.View>
            )}

            {/* Meta info - top left */}
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <Ionicons name="flame" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.metaText}>Day {streak}/7</Text>
              </View>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{formatTimeRemaining(timeUntilCheckIn)}</Text>
            </View>

            {/* Decorative circles */}
            <View style={[styles.decorCircle, styles.decorCircle1]} />
            <View style={[styles.decorCircle, styles.decorCircle2]} />
            <View style={[styles.decorCircle, styles.decorCircle3]} />

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              {!completed ? (
                <View style={styles.actionButtonsContainer}>
                  {/* I Did It Button - Hold to Complete (Primary/Large) */}
                  <TouchableOpacity
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.95}
                    style={styles.primaryButtonWrapper}
                  >
                    <View style={styles.primaryButtonOuter}>
                      <View style={styles.primaryButtonInner}>
                        <LinearGradient
                          colors={isHolding ? ['#ea580c', '#d97706'] : ['#fb923c', '#f59e0b']}
                          style={styles.primaryButtonGradient}
                        >
                          <Ionicons name="checkmark-sharp" size={38} color="#FFF" style={styles.actionButtonIcon} />
                          <Text style={styles.primaryButtonText}>
                            {isHolding ? 'Hold...' : 'I did it!'}
                          </Text>
                        </LinearGradient>
                      </View>
                    </View>
                    {/* Progress Ring */}
                    <Svg
                      style={styles.primaryProgressRing}
                      width={160}
                      height={160}
                      viewBox="0 0 160 160"
                    >
                      {/* Background circle */}
                      <Circle
                        cx="80"
                        cy="80"
                        r="75"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="8"
                        fill="none"
                      />
                      {/* Progress circle */}
                      <AnimatedCircle
                        cx="80"
                        cy="80"
                        r="75"
                        stroke="#fff"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 75}
                        animatedProps={holdProgressAnimatedProps}
                        strokeLinecap="round"
                        transform="rotate(-90 80 80)"
                      />
                    </Svg>
                  </TouchableOpacity>

                  {/* Send Help Button (Secondary/Small - floating lower right) */}
                  <TouchableOpacity
                    onPress={() => setShowHelpMenu(true)}
                    activeOpacity={0.9}
                    style={styles.secondaryButtonWrapper}
                  >
                    <View style={styles.secondaryButtonOuter}>
                      <View style={styles.secondaryButtonInner}>
                        <LinearGradient
                          colors={['#fb7185', '#ec4899']}
                          style={styles.secondaryButtonGradient}
                        >
                          <Ionicons name="heart" size={18} color="#FFF" />
                          <Text style={styles.secondaryButtonText}>Help</Text>
                        </LinearGradient>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.completedButtonWrapper}>
                  <View style={styles.primaryButtonOuter}>
                    <View style={styles.primaryButtonInner}>
                      <LinearGradient
                        colors={['#34d399', '#22c55e']}
                        style={styles.completedButtonGradient}
                      >
                        <Ionicons name="checkmark-sharp" size={44} color="#FFF" />
                        <Text style={styles.completedButtonText}>Done!</Text>
                      </LinearGradient>
                    </View>
                  </View>
                </View>
              )}
              {!completed && (
                <Text style={styles.actionHint}>
                  {isHolding ? 'Keep holding...' : 'Hold to complete or tap for support'}
                </Text>
              )}
            </View>
          </LinearGradient>

          {/* Content Area */}
          <View style={styles.contentArea}>
            {!showPlan && !showDetails ? (
              // Default view - just title and action links
              <>
                <Text style={styles.todaysFocus}>TODAY'S FOCUS</Text>
                <Text style={styles.tipTitle}>{tip.summary}</Text>
                <View style={styles.contentLinks}>
                  <TouchableOpacity
                    onPress={() => setShowDetails(true)}
                    style={styles.contentLink}
                  >
                    <Ionicons name="information-circle-outline" size={16} color="#9ca3af" />
                    <Text style={styles.contentLinkText}>Details</Text>
                  </TouchableOpacity>
                  <Text style={styles.contentLinkDivider}>•</Text>
                  <TouchableOpacity
                    onPress={() => setShowPlan(true)}
                    style={styles.contentLink}
                  >
                    <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
                    <Text style={styles.contentLinkText}>Plan</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : showDetails ? (
              // Details view
              <>
                <View style={styles.planHeader}>
                  <Text style={styles.planTitle}>About This Tip</Text>
                  <TouchableOpacity
                    onPress={() => setShowDetails(false)}
                    style={styles.backButton}
                  >
                    <Ionicons name="chevron-back" size={16} color="#9ca3af" />
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.tipDescription}>
                  {tip.short_description || tip.details_md.split('\n')[0].replace('**The Experiment:** ', '')}
                </Text>
                {tip.details_md && (
                  <Text style={styles.tipDetailsExtra}>
                    {tip.details_md
                      .replace('**The Experiment:** ', '')
                      .replace(/\*\*/g, '')
                      .split('\n')
                      .filter((line: string) => line.trim())
                      .slice(1, 4)
                      .join('\n\n')}
                  </Text>
                )}
              </>
            ) : (
              // Plan view
              <>
                <View style={styles.planHeader}>
                  <Text style={styles.planTitle}>Your 7-Day Plan</Text>
                  <TouchableOpacity
                    onPress={() => setShowPlan(false)}
                    style={styles.backButton}
                  >
                    <Ionicons name="chevron-back" size={16} color="#9ca3af" />
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.planSteps}>
                  <View style={styles.planStep}>
                    <View style={[styles.planStepIndicator, styles.planStepComplete]}>
                      <Text style={styles.planStepCheckmark}>✓</Text>
                    </View>
                    <Text style={styles.planStepText}>Days 1-4: Walk after one meal</Text>
                  </View>
                  <View style={styles.planStep}>
                    <View style={[styles.planStepIndicator, styles.planStepCurrent]}>
                      <Text style={styles.planStepNumber}>5</Text>
                    </View>
                    <Text style={styles.planStepText}>Days 5-6: Walk after two meals</Text>
                  </View>
                  <View style={styles.planStep}>
                    <View style={[styles.planStepIndicator, styles.planStepPending]}>
                      <Text style={styles.planStepNumberPending}>7</Text>
                    </View>
                    <Text style={styles.planStepTextPending}>Day 7: Walk after every meal</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Daily Insights Section */}
        <View style={styles.insightsSection}>
          <Text style={styles.insightsSectionTitle}>TODAY'S MOTIVATION</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.insightsScroll}
          >
            {/* Check-in Card - Featured first card */}
            {(() => {
              const hasSelections = selectedInFavor.length > 0 || selectedObstacles.length > 0 || selectedFeeling;
              return (
                <TouchableOpacity
                  onPress={() => setShowCheckIn(true)}
                  style={styles.heroCard}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={hasSelections ? ['#fef3c7', '#fde68a'] : ['#fed7aa', '#fde68a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroCardGradient}
                  >
                    <View style={styles.heroCardTopRow}>
                      <Text style={styles.heroCardLabelOrange}>CHECK-IN</Text>
                      <View style={styles.heroCardPlusButton}>
                        <Ionicons
                          name={hasSelections ? "create-outline" : "add"}
                          size={18}
                          color="#ea580c"
                        />
                      </View>
                    </View>

                {/* Show icons if any selections exist, otherwise show prompt */}
                {hasSelections ? (
                  // Show selected icons
                  <>
                    <View style={styles.checkInIconsRow}>
                      {selectedFeeling && (
                        <View style={styles.checkInCardIconBubble}>
                          <Ionicons
                            name={checkInOptions.feeling.options.find(f => f.id === selectedFeeling)?.icon || 'help-outline'}
                            size={14}
                            color="#ea580c"
                          />
                        </View>
                      )}
                      {selectedInFavor.slice(0, 2).map((favorId) => {
                        const favor = checkInOptions.inFavor.options.find(f => f.id === favorId);
                        return favor ? (
                          <View key={favorId} style={styles.checkInCardIconBubble}>
                            <Ionicons name={favor.icon} size={14} color="#ea580c" />
                          </View>
                        ) : null;
                      })}
                      {selectedObstacles.slice(0, 2).map((obstacleId) => {
                        const obstacle = checkInOptions.obstacles.options.find(o => o.id === obstacleId);
                        return obstacle ? (
                          <View key={obstacleId} style={styles.checkInCardIconBubble}>
                            <Ionicons name={obstacle.icon} size={14} color="#ea580c" />
                          </View>
                        ) : null;
                      })}
                      {(selectedInFavor.length + selectedObstacles.length) > 4 && (
                        <View style={styles.checkInCardIconBubble}>
                          <Text style={styles.checkInCardIconBubbleMoreText}>
                            +{selectedInFavor.length + selectedObstacles.length - 4}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.heroCardSubtitleOrange}>Tap to update</Text>
                  </>
                ) : (
                  // Show prompt when nothing selected
                  <>
                    <Text style={styles.heroCardTitleOrange}>How's today?</Text>
                    <Text style={styles.heroCardSubtitleOrange}>Quick check-in</Text>
                  </>
                )}
                  </LinearGradient>
                </TouchableOpacity>
              );
            })()}

            {/* Fun Fact Card */}
            <TouchableOpacity
              onPress={() => handleCardTap('funfact')}
              style={[
                styles.insightCard,
                !viewedCards.includes('funfact') && styles.insightCardUnread
              ]}
            >
              {!viewedCards.includes('funfact') && <View style={[styles.unreadDot, { backgroundColor: '#fbbf24' }]} />}
              <View style={styles.insightCardHeader}>
                <View style={[styles.insightIcon, { backgroundColor: viewedCards.includes('funfact') ? '#fef3c7' : '#fef9c3' }]}>
                  <Ionicons name="bulb" size={16} color={viewedCards.includes('funfact') ? '#d97706' : '#ca8a04'} />
                </View>
                <Text style={[styles.insightCardTitle, viewedCards.includes('funfact') && styles.insightCardTitleViewed]}>Fun Fact</Text>
              </View>
              <Text style={[styles.insightCardText, viewedCards.includes('funfact') && styles.insightCardTextViewed]}>
                Walking after eating can lower blood sugar by up to 30%!
              </Text>
            </TouchableOpacity>

            {/* Quiz Card */}
            <TouchableOpacity
              onPress={() => handleCardTap('quiz')}
              style={[
                styles.insightCard,
                !viewedCards.includes('quiz') && styles.insightCardUnreadPurple
              ]}
            >
              {!viewedCards.includes('quiz') && <View style={[styles.unreadDot, { backgroundColor: '#a855f7' }]} />}
              <View style={styles.insightCardHeader}>
                <View style={[styles.insightIcon, { backgroundColor: viewedCards.includes('quiz') ? '#f3e8ff' : '#ede9fe' }]}>
                  <Ionicons name="school" size={16} color={viewedCards.includes('quiz') ? '#9333ea' : '#7c3aed'} />
                </View>
                <Text style={[styles.insightCardTitle, viewedCards.includes('quiz') && styles.insightCardTitleViewed]}>Quick Quiz</Text>
              </View>
              <Text style={[styles.insightCardText, viewedCards.includes('quiz') && styles.insightCardTextViewed]}>Test your knowledge!</Text>
              <View style={[styles.quizButton, viewedCards.includes('quiz') && styles.quizButtonViewed]}>
                <Text style={styles.quizButtonText}>Take Quiz →</Text>
              </View>
            </TouchableOpacity>

            {/* Pro Tip Card */}
            <TouchableOpacity
              onPress={() => handleCardTap('protip')}
              style={[
                styles.insightCard,
                !viewedCards.includes('protip') && styles.insightCardUnreadTeal
              ]}
            >
              {!viewedCards.includes('protip') && <View style={[styles.unreadDot, { backgroundColor: '#14b8a6' }]} />}
              <View style={styles.insightCardHeader}>
                <View style={[styles.insightIcon, { backgroundColor: viewedCards.includes('protip') ? '#ccfbf1' : '#d1fae5' }]}>
                  <Ionicons name="heart" size={16} color={viewedCards.includes('protip') ? '#0d9488' : '#059669'} />
                </View>
                <Text style={[styles.insightCardTitle, viewedCards.includes('protip') && styles.insightCardTitleViewed]}>Pro Tip</Text>
              </View>
              <Text style={[styles.insightCardText, viewedCards.includes('protip') && styles.insightCardTextViewed]}>
                Try walking with a podcast to make it more enjoyable!
              </Text>
            </TouchableOpacity>

            {/* Community Card */}
            <TouchableOpacity
              onPress={() => handleCardTap('community')}
              style={[
                styles.insightCard,
                !viewedCards.includes('community') && styles.insightCardUnreadOrange
              ]}
            >
              {!viewedCards.includes('community') && <View style={[styles.unreadDot, { backgroundColor: '#f97316' }]} />}
              <View style={styles.insightCardHeader}>
                <Text style={styles.communityEmoji}>👥</Text>
                <Text style={[styles.insightCardTitle, viewedCards.includes('community') && styles.insightCardTitleViewed]}>Community</Text>
              </View>
              <Text style={[styles.insightCardText, viewedCards.includes('community') && styles.insightCardTextViewed]}>
                <Text style={[styles.communityCount, viewedCards.includes('community') && styles.communityCountViewed]}>2,341</Text> people did this tip today!
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Help Menu Bottom Sheet */}
      <Modal
        visible={showHelpMenu}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => setShowHelpMenu(false))}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => setShowHelpMenu(false))}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomSheet, sheetAnimatedStyle]}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => setShowHelpMenu(false))}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.bottomSheetContent}>
              <Text style={styles.bottomSheetTitle}>What's getting in the way?</Text>
              <Text style={styles.bottomSheetSubtitle}>No judgment — let's figure it out together</Text>

              <View style={styles.helpOptions}>
                {helpOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => closeSheet(() => setShowHelpMenu(false))}
                    style={styles.helpOption}
                  >
                    <Text style={styles.helpOptionEmoji}>{option.emoji}</Text>
                    <View style={styles.helpOptionContent}>
                      <Text style={styles.helpOptionLabel}>{option.label}</Text>
                      <Text style={styles.helpOptionDescription}>{option.description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => closeSheet(() => setShowHelpMenu(false))}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Never mind, I've got this</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Fun Fact Modal */}
      <Modal
        visible={activeCard === 'funfact'}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => setActiveCard(null))}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => setActiveCard(null))}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomSheet, sheetAnimatedStyle]}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => setActiveCard(null))}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.modalContent}>
              <View style={[styles.modalIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="bulb" size={32} color="#f59e0b" />
              </View>
              <Text style={styles.modalTitle}>Did You Know?</Text>
              <Text style={styles.modalDescription}>
                Walking after eating can lower blood sugar levels by <Text style={styles.modalHighlight}>up to 30%</Text>. This happens because your muscles use glucose for energy during movement, helping to regulate insulin response.
              </Text>

              <View style={styles.modalBonus}>
                <Text style={styles.modalBonusText}>
                  💡 <Text style={styles.modalBonusBold}>Bonus:</Text> Even a 2-3 minute walk can make a noticeable difference!
                </Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => closeSheet(() => setActiveCard(null))}
                  style={styles.modalSecondaryButton}
                >
                  <Text style={styles.modalSecondaryButtonText}>Got it</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => closeSheet(() => setActiveCard(null))}
                  style={styles.modalPrimaryButton}
                >
                  <LinearGradient
                    colors={['#f59e0b', '#d97706']}
                    style={styles.modalPrimaryButtonGradient}
                  >
                    <Text style={styles.modalPrimaryButtonText}>Share this</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Quiz Modal */}
      <Modal
        visible={activeCard === 'quiz'}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => { setActiveCard(null); setQuizAnswer(null); })}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => { setActiveCard(null); setQuizAnswer(null); })}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomSheet, sheetAnimatedStyle]}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => { setActiveCard(null); setQuizAnswer(null); })}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.modalContent}>
              <View style={[styles.modalIcon, { backgroundColor: '#f3e8ff' }]}>
                <Ionicons name="school" size={32} color="#9333ea" />
              </View>
              <Text style={styles.modalTitle}>Quick Quiz</Text>
              <Text style={styles.quizQuestion}>
                When is the best time to take a walk for blood sugar benefits?
              </Text>

              <View style={styles.quizOptions}>
                {[
                  { id: 'a', text: 'Right before eating', correct: false },
                  { id: 'b', text: 'Within 30 min after eating', correct: true },
                  { id: 'c', text: '2 hours after eating', correct: false },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => setQuizAnswer(option.id)}
                    disabled={quizAnswer !== null}
                    style={[
                      styles.quizOption,
                      quizAnswer === null && styles.quizOptionDefault,
                      quizAnswer !== null && option.correct && styles.quizOptionCorrect,
                      quizAnswer === option.id && !option.correct && styles.quizOptionIncorrect,
                      quizAnswer !== null && !option.correct && quizAnswer !== option.id && styles.quizOptionFaded
                    ]}
                  >
                    <View style={[
                      styles.quizOptionLetter,
                      quizAnswer === null && styles.quizOptionLetterDefault,
                      quizAnswer !== null && option.correct && styles.quizOptionLetterCorrect,
                      quizAnswer === option.id && !option.correct && styles.quizOptionLetterIncorrect
                    ]}>
                      <Text style={[
                        styles.quizOptionLetterText,
                        quizAnswer !== null && option.correct && styles.quizOptionLetterTextCorrect
                      ]}>
                        {option.id.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[
                      styles.quizOptionText,
                      quizAnswer !== null && option.correct && styles.quizOptionTextCorrect
                    ]}>
                      {option.text}
                    </Text>
                    {quizAnswer !== null && option.correct && (
                      <Ionicons name="checkmark" size={20} color="#22c55e" style={styles.quizCheckmark} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {quizAnswer && (
                <View style={[styles.quizResult, quizAnswer === 'b' ? styles.quizResultCorrect : styles.quizResultIncorrect]}>
                  <Text style={[styles.quizResultText, quizAnswer === 'b' ? styles.quizResultTextCorrect : styles.quizResultTextIncorrect]}>
                    {quizAnswer === 'b'
                      ? "Nice work! Walking within 30 minutes after eating is most effective because that's when blood sugar peaks."
                      : "💡 Good try! The best time is within 30 minutes after eating, when blood sugar levels are at their peak."}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => closeSheet(() => { setActiveCard(null); setQuizAnswer(null); })}
                style={styles.quizDoneButton}
              >
                <LinearGradient
                  colors={['#9333ea', '#7c3aed']}
                  style={styles.quizDoneButtonGradient}
                >
                  <Text style={styles.quizDoneButtonText}>{quizAnswer ? 'Done' : 'Skip for now'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Pro Tip Modal */}
      <Modal
        visible={activeCard === 'protip'}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => setActiveCard(null))}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => setActiveCard(null))}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomSheet, sheetAnimatedStyle]}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => setActiveCard(null))}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.modalContent}>
              <View style={[styles.modalIcon, { backgroundColor: '#ccfbf1' }]}>
                <Ionicons name="heart" size={32} color="#14b8a6" />
              </View>
              <Text style={styles.modalTitle}>Pro Tip</Text>
              <Text style={styles.modalDescription}>
                Make your walk more enjoyable by pairing it with something you love!
              </Text>

              <View style={styles.proTipSuggestions}>
                <View style={styles.proTipItem}>
                  <Text style={styles.proTipEmoji}>🎧</Text>
                  <Text style={styles.proTipText}>Listen to a favorite podcast or audiobook</Text>
                </View>
                <View style={styles.proTipItem}>
                  <Text style={styles.proTipEmoji}>📞</Text>
                  <Text style={styles.proTipText}>Call a friend or family member</Text>
                </View>
                <View style={styles.proTipItem}>
                  <Text style={styles.proTipEmoji}>🎵</Text>
                  <Text style={styles.proTipText}>Create a special walking playlist</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => closeSheet(() => setActiveCard(null))}
                style={styles.proTipDoneButton}
              >
                <LinearGradient
                  colors={['#14b8a6', '#0d9488']}
                  style={styles.proTipDoneButtonGradient}
                >
                  <Text style={styles.proTipDoneButtonText}>Great idea!</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Community Modal */}
      <Modal
        visible={activeCard === 'community'}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => setActiveCard(null))}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => setActiveCard(null))}
            />
          </Animated.View>
          <Animated.View style={[styles.bottomSheet, sheetAnimatedStyle]}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => setActiveCard(null))}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.communityModalEmoji}>👥</Text>
              <Text style={styles.modalTitle}>You're Not Alone!</Text>
              <Text style={styles.communityModalCount}>
                <Text style={styles.communityModalNumber}>2,341</Text> people completed this tip today
              </Text>

              <View style={styles.communityStats}>
                <View style={styles.communityStatItem}>
                  <Text style={styles.communityStatNumber}>87%</Text>
                  <Text style={styles.communityStatLabel}>found it helpful</Text>
                </View>
                <View style={styles.communityStatItem}>
                  <Text style={styles.communityStatNumber}>12k</Text>
                  <Text style={styles.communityStatLabel}>tried this week</Text>
                </View>
                <View style={styles.communityStatItem}>
                  <Text style={styles.communityStatNumber}>4.8⭐</Text>
                  <Text style={styles.communityStatLabel}>avg rating</Text>
                </View>
              </View>

              <View style={styles.communityTestimonial}>
                <Text style={styles.communityTestimonialText}>
                  "Started doing this 2 weeks ago and I feel so much better after lunch. Game changer!"
                </Text>
                <Text style={styles.communityTestimonialAuthor}>— Sarah, Day 14</Text>
              </View>

              <TouchableOpacity
                onPress={() => closeSheet(() => setActiveCard(null))}
                style={styles.communityShareButton}
              >
                <LinearGradient
                  colors={['#f97316', '#ea580c']}
                  style={styles.communityShareButtonGradient}
                >
                  <Text style={styles.communityShareButtonText}>Share my win</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Check-in Modal */}
      <Modal
        visible={showCheckIn}
        transparent
        animationType="none"
        onRequestClose={() => closeSheet(() => setShowCheckIn(false))}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalBackdrop, backdropAnimatedStyle]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => closeSheet(() => setShowCheckIn(false))}
            />
          </Animated.View>
          <Animated.View style={[styles.checkInSheet, sheetAnimatedStyle]}>
            {/* Header */}
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity
                onPress={() => closeSheet(() => setShowCheckIn(false))}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.bottomSheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <ScrollView
              style={styles.checkInScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <Text style={styles.checkInTitle}>Check-in</Text>
              <Text style={styles.checkInSubtitle}>
                How's today shaping up?
              </Text>

              {/* Feeling Section - First */}
              <View style={styles.checkInSection}>
                <Text style={styles.checkInSectionLabel}>
                  {checkInOptions.feeling.label}
                </Text>
                <View style={styles.checkInFeelings}>
                  {checkInOptions.feeling.options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => setSelectedFeeling(
                        selectedFeeling === option.id ? null : option.id
                      )}
                      style={[
                        styles.checkInFeeling,
                        selectedFeeling === option.id && styles.checkInFeelingSelected
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={24}
                        color={selectedFeeling === option.id ? '#f59e0b' : '#9ca3af'}
                      />
                      <Text style={[
                        styles.checkInFeelingLabel,
                        selectedFeeling === option.id && styles.checkInFeelingLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* In Favor Section */}
              <View style={styles.checkInSection}>
                <Text style={styles.checkInSectionLabel}>
                  {checkInOptions.inFavor.label}
                </Text>
                <View style={styles.checkInBubbles}>
                  {checkInOptions.inFavor.options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => toggleInFavor(option.id)}
                      style={[
                        styles.checkInBubble,
                        styles.checkInBubbleInFavor,
                        selectedInFavor.includes(option.id) && styles.checkInBubbleInFavorSelected
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={16}
                        color={selectedInFavor.includes(option.id) ? '#059669' : '#9ca3af'}
                        style={styles.checkInBubbleIcon}
                      />
                      <Text style={[
                        styles.checkInBubbleLabel,
                        selectedInFavor.includes(option.id) && styles.checkInBubbleLabelInFavorSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Obstacles Section */}
              <View style={styles.checkInSection}>
                <Text style={styles.checkInSectionLabel}>
                  {checkInOptions.obstacles.label}
                </Text>
                <View style={styles.checkInBubbles}>
                  {checkInOptions.obstacles.options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => toggleObstacle(option.id)}
                      style={[
                        styles.checkInBubble,
                        styles.checkInBubbleObstacle,
                        selectedObstacles.includes(option.id) && styles.checkInBubbleObstacleSelected
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={16}
                        color={selectedObstacles.includes(option.id) ? '#ea580c' : '#9ca3af'}
                        style={styles.checkInBubbleIcon}
                      />
                      <Text style={[
                        styles.checkInBubbleLabel,
                        selectedObstacles.includes(option.id) && styles.checkInBubbleLabelObstacleSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ height: 100 }} />
            </ScrollView>

            {/* Save Button */}
            <View style={styles.checkInSaveContainer}>
              <TouchableOpacity
                onPress={handleSaveCheckIn}
                style={[
                  styles.checkInSaveButton,
                  totalCheckInSelections === 0 && styles.checkInSaveButtonDisabled
                ]}
                disabled={totalCheckInSelections === 0}
              >
                <LinearGradient
                  colors={totalCheckInSelections > 0 ? ['#fb923c', '#f59e0b'] : ['#d1d5db', '#d1d5db']}
                  style={styles.checkInSaveButtonGradient}
                >
                  <Text style={styles.checkInSaveButtonText}>
                    {totalCheckInSelections > 0
                      ? `Save Check-in (${totalCheckInSelections})`
                      : 'Select at least one'
                    }
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => closeSheet(() => setShowCheckIn(false))}
                style={styles.checkInSkipButton}
              >
                <Text style={styles.checkInSkipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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

  // Main Card Styles
  mainCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  visualArea: {
    height: 224,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 100,
    borderRadius: 20,
    overflow: 'hidden',
  },
  celebrationGradient: {
    padding: 24,
    alignItems: 'center',
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 12,
    textAlign: 'center',
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 4,
  },
  metaInfo: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginHorizontal: 6,
  },
  decorCircle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
  },
  decorCircle1: {
    top: 16,
    left: 16,
    width: 80,
    height: 80,
  },
  decorCircle2: {
    bottom: 16,
    right: 16,
    width: 64,
    height: 64,
  },
  decorCircle3: {
    top: '50%',
    left: '50%',
    marginTop: -80,
    marginLeft: -80,
    width: 160,
    height: 160,
  },
  actionButtonsContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  // Primary "I did it" button - large, left of center
  primaryButtonWrapper: {
    width: 160,
    height: 160,
    position: 'relative',
    marginLeft: -50,
  },
  primaryProgressRing: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  primaryButtonOuter: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 4,
  },
  primaryButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 76,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 2,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 74,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  //work on this
  // Secondary "Help" button - small, positioned lower-right of primary
  secondaryButtonWrapper: {
    position: 'absolute',
    right: -75,
    bottom: -20,
    width: 72,
    height: 72,
  },
  secondaryButtonOuter: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 3,
  },
  secondaryButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 2,
    overflow: 'hidden',
  },
  secondaryButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 11,
    marginTop: 2,
  },
  // Legacy styles kept for completed state
  actionButtonWrapper: {
    width: 112,
    height: 112,
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  actionButtonOuter: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 4,
  },
  actionButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 52,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 2,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonIcon: {
    marginBottom: 4,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  completedButtonWrapper: {
    width: 160,
    height: 160,
  },
  completedButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 74,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginTop: 4,
  },
  actionHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 16,
  },

  // Content Area Styles
  contentArea: {
    padding: 20,
  },
  tipTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  todaysFocus: {
    color: '#f97316',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  contentLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  contentLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  contentLinkText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  contentLinkDivider: {
    color: '#d1d5db',
    fontSize: 12,
  },
  tipDescription: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tipDetailsExtra: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 22,
  },
  viewPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  viewPlanText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  planSteps: {
    gap: 8,
  },
  planStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planStepIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planStepComplete: {
    backgroundColor: '#dcfce7',
  },
  planStepCurrent: {
    backgroundColor: '#ffedd5',
  },
  planStepPending: {
    backgroundColor: '#f3f4f6',
  },
  planStepCheckmark: {
    color: '#16a34a',
    fontSize: 12,
  },
  planStepNumber: {
    color: '#ea580c',
    fontSize: 12,
    fontWeight: '700',
  },
  planStepNumberPending: {
    color: '#9ca3af',
    fontSize: 12,
  },
  planStepText: {
    color: '#4b5563',
    fontSize: 14,
  },
  planStepTextPending: {
    color: '#9ca3af',
    fontSize: 14,
  },

  // Insights Section
  insightsSection: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  insightsSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
  },
  insightsScroll: {
    gap: 12,
    paddingRight: 20,
  },
  // Hero Card - Featured first card (same width as others, but colorful)
  heroCard: {
    width: 160,
    borderRadius: 16,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  heroCardGradient: {
    flex: 1,
    padding: 16,
  },
  heroCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroCardLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  heroCardPlusButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroCardTitleOrange: {
    color: '#9a3412',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroCardTitleCheckedIn: {
    color: '#047857',
  },
  heroCardSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  heroCardSubtitleOrange: {
    color: '#c2410c',
    fontSize: 12,
  },
  heroCardSubtitleCheckedIn: {
    color: '#059669',
    fontSize: 12,
    marginTop: 8,
  },
  heroCardLabelOrange: {
    color: '#9a3412',
  },
  heroCardLabelCheckedIn: {
    color: '#047857',
  },
  heroCardPlusButtonCheckedIn: {
    backgroundColor: '#d1fae5',
  },
  heroCardCheckedIn: {
    shadowColor: '#10b981',
  },
  checkInIconsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  // Icon bubbles on the card (warm colors)
  checkInCardIconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkInCardIconBubbleMoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ea580c',
  },
  // Icon bubbles in the modal (keep green/orange distinction)
  checkInIconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkInIconBubbleConcern: {
    backgroundColor: '#ffedd5',
  },
  checkInIconBubbleFeeling: {
    backgroundColor: '#fef3c7',
  },
  checkInIconBubbleMore: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkInIconBubbleMoreText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  heroProgressContainer: {
    marginTop: 'auto',
  },
  heroProgressTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  // Regular insight cards
  insightCard: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightCardUnread: {
    borderWidth: 2,
    borderColor: '#fde68a',
  },
  insightCardUnreadPurple: {
    borderWidth: 2,
    borderColor: '#e9d5ff',
  },
  insightCardUnreadTeal: {
    borderWidth: 2,
    borderColor: '#99f6e4',
  },
  insightCardUnreadOrange: {
    borderWidth: 2,
    borderColor: '#fed7aa',
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  insightCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightCardTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#374151',
  },
  insightCardTitleViewed: {
    color: '#6b7280',
  },
  insightCardText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
  },
  insightCardTextViewed: {
    color: '#9ca3af',
  },
  communityEmoji: {
    fontSize: 20,
  },
  communityCount: {
    fontWeight: '700',
    color: '#f97316',
  },
  communityCountViewed: {
    color: '#fdba74',
  },
  quizButton: {
    backgroundColor: '#9333ea',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  quizButtonViewed: {
    backgroundColor: '#c4b5fd',
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  // Bottom Sheet & Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  helpOptions: {
    gap: 8,
  },
  helpOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  helpOptionEmoji: {
    fontSize: 24,
  },
  helpOptionContent: {
    flex: 1,
  },
  helpOptionLabel: {
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  helpOptionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },

  // Modal Content Styles
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalHighlight: {
    fontWeight: '700',
    color: '#f59e0b',
  },
  modalBonus: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    width: '100%',
  },
  modalBonusText: {
    fontSize: 14,
    color: '#92400e',
  },
  modalBonusBold: {
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  modalSecondaryButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  modalPrimaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalPrimaryButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalPrimaryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },

  // Quiz Modal Styles
  quizQuestion: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  quizOptions: {
    width: '100%',
    gap: 8,
    marginBottom: 20,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  quizOptionDefault: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quizOptionCorrect: {
    backgroundColor: '#dcfce7',
    borderWidth: 2,
    borderColor: '#86efac',
  },
  quizOptionIncorrect: {
    backgroundColor: '#fee2e2',
    borderWidth: 2,
    borderColor: '#fca5a5',
  },
  quizOptionFaded: {
    backgroundColor: '#f9fafb',
    opacity: 0.5,
  },
  quizOptionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizOptionLetterDefault: {
    backgroundColor: '#e9d5ff',
  },
  quizOptionLetterCorrect: {
    backgroundColor: '#bbf7d0',
  },
  quizOptionLetterIncorrect: {
    backgroundColor: '#fecaca',
  },
  quizOptionLetterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7c3aed',
  },
  quizOptionLetterTextCorrect: {
    color: '#15803d',
  },
  quizOptionText: {
    flex: 1,
    fontWeight: '500',
    color: '#374151',
  },
  quizOptionTextCorrect: {
    color: '#15803d',
  },
  quizCheckmark: {
    marginLeft: 'auto',
  },
  quizResult: {
    borderRadius: 16,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  quizResultCorrect: {
    backgroundColor: '#dcfce7',
  },
  quizResultIncorrect: {
    backgroundColor: '#fef3c7',
  },
  quizResultText: {
    fontSize: 14,
  },
  quizResultTextCorrect: {
    color: '#166534',
  },
  quizResultTextIncorrect: {
    color: '#92400e',
  },
  quizDoneButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  quizDoneButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  quizDoneButtonText: {
    color: '#fff',
    fontWeight: '500',
  },

  // Pro Tip Modal Styles
  proTipSuggestions: {
    width: '100%',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  proTipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccfbf1',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  proTipEmoji: {
    fontSize: 24,
  },
  proTipText: {
    flex: 1,
    fontSize: 14,
    color: '#134e4a',
  },
  proTipDoneButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  proTipDoneButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  proTipDoneButtonText: {
    color: '#fff',
    fontWeight: '500',
  },

  // Community Modal Styles
  communityModalEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  communityModalCount: {
    fontSize: 16,
    color: '#4b5563',
  },
  communityModalNumber: {
    fontSize: 30,
    fontWeight: '700',
    color: '#f97316',
  },
  communityStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
  communityStatItem: {
    flex: 1,
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  communityStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ea580c',
  },
  communityStatLabel: {
    fontSize: 12,
    color: '#9a3412',
    marginTop: 4,
  },
  communityTestimonial: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
  },
  communityTestimonialText: {
    fontSize: 14,
    color: '#4b5563',
    fontStyle: 'italic',
  },
  communityTestimonialAuthor: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
  communityShareButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  communityShareButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  communityShareButtonText: {
    color: '#fff',
    fontWeight: '500',
  },

  // Check-in Modal Styles
  checkInSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  checkInScrollContent: {
    padding: 20,
  },
  checkInTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  checkInSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  checkInSection: {
    marginBottom: 24,
  },
  checkInSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  checkInBubbles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  checkInBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  checkInBubbleIcon: {
    marginRight: 6,
  },
  checkInBubbleInFavor: {
    backgroundColor: '#f0fdf4',
  },
  checkInBubbleInFavorSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#4ade80',
  },
  checkInBubbleObstacle: {
    backgroundColor: '#fff7ed',
  },
  checkInBubbleObstacleSelected: {
    backgroundColor: '#ffedd5',
    borderColor: '#fb923c',
  },
  checkInBubbleLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  checkInBubbleLabelInFavorSelected: {
    color: '#059669',
    fontWeight: '600',
  },
  checkInBubbleLabelObstacleSelected: {
    color: '#ea580c',
    fontWeight: '600',
  },
  checkInFeelings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkInFeeling: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    width: 62,
  },
  checkInFeelingSelected: {
    backgroundColor: '#ffedd5',
    borderWidth: 2,
    borderColor: '#fb923c',
  },
  checkInFeelingLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  checkInFeelingLabelSelected: {
    color: '#ea580c',
    fontWeight: '600',
  },
  checkInSaveContainer: {
    padding: 20,
    paddingBottom: 36,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  checkInSaveButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  checkInSaveButtonDisabled: {
    opacity: 0.7,
  },
  checkInSaveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkInSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkInSkipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkInSkipButtonText: {
    color: '#9ca3af',
    fontSize: 14,
  },
});
