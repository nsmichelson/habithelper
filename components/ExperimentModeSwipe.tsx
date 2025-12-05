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
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { SimplifiedTip } from '../types/simplifiedTip';
import { DailyTip, QuickComplete } from '../types/tip';
import QuickCompleteModal from './QuickComplete';
import TipHistoryModal from './TipHistoryModal';

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
  const [viewedCards, setViewedCards] = useState<string[]>(['protip']);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalTips, setModalTips] = useState<Array<{ dailyTip: DailyTip; tip: SimplifiedTip }>>([]);
  const [showCelebration, setShowCelebration] = useState(true);
  const [hasSeenCelebration, setHasSeenCelebration] = useState(false);
  const [centralizedCompletionCount, setCentralizedCompletionCount] = useState(0);

  const celebrationScale = useSharedValue(0);
  const celebrationOpacity = useSharedValue(0);
  const streak = focusProgress?.daysCompleted || 5;

  const helpOptions = [
    { emoji: '😅', label: 'I forgot', description: 'Set a reminder for later' },
    { emoji: '⏰', label: 'No time right now', description: 'Try a 2-min version instead' },
    { emoji: '😔', label: 'Not feeling it', description: 'Get a motivation boost' },
    { emoji: '🤔', label: "Something's in the way", description: "Let's problem-solve together" },
  ];

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

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompleted(true);
    setShowQuickComplete(true);
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
                <View style={styles.actionButtonsRow}>
                  {/* I Did It Button */}
                  <TouchableOpacity
                    onPress={handleComplete}
                    activeOpacity={0.9}
                    style={styles.actionButtonWrapper}
                  >
                    <View style={styles.actionButtonOuter}>
                      <View style={styles.actionButtonInner}>
                        <LinearGradient
                          colors={['#fb923c', '#f59e0b']}
                          style={styles.actionButtonGradient}
                        >
                          <Ionicons name="checkmark" size={24} color="#FFF" style={styles.actionButtonIcon} />
                          <Text style={styles.actionButtonText}>I did it!</Text>
                        </LinearGradient>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* Send Help Button */}
                  <TouchableOpacity
                    onPress={() => setShowHelpMenu(true)}
                    activeOpacity={0.9}
                    style={styles.actionButtonWrapper}
                  >
                    <View style={styles.actionButtonOuter}>
                      <View style={styles.actionButtonInner}>
                        <LinearGradient
                          colors={['#fb7185', '#ec4899']}
                          style={styles.actionButtonGradient}
                        >
                          <Ionicons name="alert-circle" size={24} color="#FFF" style={styles.actionButtonIcon} />
                          <Text style={styles.actionButtonText}>Send help</Text>
                        </LinearGradient>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.completedButtonWrapper}>
                  <View style={styles.actionButtonOuter}>
                    <View style={styles.actionButtonInner}>
                      <LinearGradient
                        colors={['#34d399', '#22c55e']}
                        style={styles.completedButtonGradient}
                      >
                        <Ionicons name="checkmark" size={36} color="#FFF" />
                        <Text style={styles.completedButtonText}>Done!</Text>
                      </LinearGradient>
                    </View>
                  </View>
                </View>
              )}
              {!completed && (
                <Text style={styles.actionHint}>Tap to complete or get support</Text>
              )}
            </View>
          </LinearGradient>

          {/* Content Area */}
          <View style={styles.contentArea}>
            {!showPlan ? (
              <>
                <Text style={styles.tipTitle}>{tip.summary}</Text>
                <Text style={styles.todaysFocus}>TODAY'S FOCUS</Text>
                <Text style={styles.tipDescription}>
                  {tip.short_description || tip.details_md.split('\n')[0].replace('**The Experiment:** ', '')}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPlan(true)}
                  style={styles.viewPlanButton}
                >
                  <Text style={styles.viewPlanText}>View plan</Text>
                  <Ionicons name="chevron-forward" size={12} color="#9ca3af" />
                </TouchableOpacity>
              </>
            ) : (
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
        animationType="slide"
        onRequestClose={() => setShowHelpMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowHelpMenu(false)}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHeader}>
            <TouchableOpacity
              onPress={() => setShowHelpMenu(false)}
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
                  onPress={() => setShowHelpMenu(false)}
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
              onPress={() => setShowHelpMenu(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Never mind, I've got this</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Fun Fact Modal */}
      <Modal
        visible={activeCard === 'funfact'}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveCard(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setActiveCard(null)}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHeader}>
            <TouchableOpacity
              onPress={() => setActiveCard(null)}
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
                onPress={() => setActiveCard(null)}
                style={styles.modalSecondaryButton}
              >
                <Text style={styles.modalSecondaryButtonText}>Got it</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveCard(null)}
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
        </View>
      </Modal>

      {/* Quiz Modal */}
      <Modal
        visible={activeCard === 'quiz'}
        transparent
        animationType="slide"
        onRequestClose={() => { setActiveCard(null); setQuizAnswer(null); }}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => { setActiveCard(null); setQuizAnswer(null); }}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHeader}>
            <TouchableOpacity
              onPress={() => { setActiveCard(null); setQuizAnswer(null); }}
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
              onPress={() => { setActiveCard(null); setQuizAnswer(null); }}
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
        </View>
      </Modal>

      {/* Pro Tip Modal */}
      <Modal
        visible={activeCard === 'protip'}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveCard(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setActiveCard(null)}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHeader}>
            <TouchableOpacity
              onPress={() => setActiveCard(null)}
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
              onPress={() => setActiveCard(null)}
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
        </View>
      </Modal>

      {/* Community Modal */}
      <Modal
        visible={activeCard === 'community'}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveCard(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setActiveCard(null)}
        />
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHeader}>
            <TouchableOpacity
              onPress={() => setActiveCard(null)}
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
              onPress={() => setActiveCard(null)}
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
  actionButtonWrapper: {
    width: 112,
    height: 112,
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
    width: 128,
    height: 128,
  },
  completedButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 4,
  },
  actionHint: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 12,
  },

  // Content Area Styles
  contentArea: {
    padding: 20,
  },
  tipTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  todaysFocus: {
    color: '#f97316',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  tipDescription: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
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
  insightCard: {
    width: 176,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
});
