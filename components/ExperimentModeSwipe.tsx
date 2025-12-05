import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SimplifiedTip } from '../types/simplifiedTip';
import { DailyTip, QuickComplete } from '../types/tip';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Color Palette based on the design
const COLORS = {
  orange50: '#FFF7ED',
  amber50: '#FFFBEB',
  orange100: '#FFEDD5',
  orange200: '#FED7AA',
  amber200: '#FDE68A',
  orange300: '#FDBA74',
  orange400: '#FB923C',
  orange500: '#F97316',
  orange600: '#EA580C',
  orange800: '#9A3412',
  amber100: '#FEF3C7',
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  amber600: '#D97706',
  amber800: '#92400E',
  rose400: '#FB7185',
  rose500: '#F43F5E',
  pink500: '#EC4899',
  pink600: '#DB2777',
  emerald400: '#34D399',
  green50: '#F0FDF4',
  green100: '#DCFCE7',
  green200: '#BBF7D0',
  green300: '#86EFAC',
  green500: '#22C55E',
  green600: '#16A34A',
  green700: '#15803D',
  green800: '#166534',
  teal50: '#F0FDFA',
  teal100: '#CCFBF1',
  teal200: '#99F6E4',
  teal400: '#2DD4BF',
  teal500: '#14B8A6',
  teal600: '#0D9488',
  teal800: '#115E59',
  purple50: '#FAF5FF',
  purple100: '#F3E8FF',
  purple200: '#E9D5FF',
  purple300: '#D8B4FE',
  purple400: '#C084FC',
  purple500: '#A855F7',
  purple600: '#9333EA',
  red50: '#FEF2F2',
  red200: '#FECACA',
  red300: '#FCA5A5',
  red700: '#B91C1C',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  white: '#FFFFFF',
  white30: 'rgba(255, 255, 255, 0.3)',
  white50: 'rgba(255, 255, 255, 0.5)',
  white70: 'rgba(255, 255, 255, 0.7)',
  white20: 'rgba(255, 255, 255, 0.2)',
  black30: 'rgba(0, 0, 0, 0.3)',
};

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

export default function ExperimentModeSwipe({
  tip,
  personalizedPlan,
  onViewDetails,
  timeUntilCheckIn,
  onQuickComplete,
  quickCompletions = [],
  totalExperiments = 0,
  successfulExperiments = 0,
  tipHistory = [],
  isInFocusMode = false,
  focusProgress,
}: Props) {
  const [completed, setCompleted] = useState(quickCompletions.length > 0);
  const [showPlan, setShowPlan] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [viewedCards, setViewedCards] = useState<string[]>(['protip']);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  useEffect(() => {
    setCompleted(quickCompletions.length > 0);
  }, [quickCompletions]);

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompleted(true);
    onQuickComplete('worked_great');
  };

  const handleCardTap = (cardId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveCard(cardId);
    if (!viewedCards.includes(cardId)) {
      setViewedCards([...viewedCards, cardId]);
    }
  };

  const formatTimeRemaining = (hours: number) => {
    if (hours <= 0) return "Check-in time!";
    if (hours < 1) return "< 1h left";
    return `${Math.round(hours)}h left`;
  };

  const helpOptions = [
    { emoji: '😅', label: 'I forgot', description: 'Set a reminder for later' },
    { emoji: '⏰', label: 'No time right now', description: 'Try a 2-min version instead' },
    { emoji: '😔', label: 'Not feeling it', description: 'Get a motivation boost' },
    { emoji: '🤔', label: 'Something\'s in the way', description: 'Let\'s problem-solve together' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.orange50, COLORS.amber50, COLORS.orange100]}
        style={styles.backgroundGradient}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Mimicking the design */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>
              {new Date().getHours() < 12 ? 'Good Morning' :
               new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
            </Text>
            <Text style={styles.appTitle}>Habit Helper</Text>
          </View>
          <View style={styles.headerIconContainer}>
            <View style={styles.calendarIconCircle}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.gray600} />
            </View>
          </View>
        </View>

        {/* Main Tip Card */}
        <View style={styles.cardContainer}>
          <View style={styles.mainCard}>
            {/* Image/Visual Area with Action Buttons */}
            <View style={styles.cardVisualArea}>
              <LinearGradient
                colors={[COLORS.orange200, COLORS.amber200, COLORS.orange300]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                {/* Meta info */}
                <View style={styles.metaInfoContainer}>
                  <View style={styles.metaInfoRow}>
                    <Ionicons name="flame" size={12} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.metaInfoText}>
                      Day {isInFocusMode && focusProgress ? focusProgress.daysCompleted + 1 : 1}
                      {isInFocusMode && focusProgress ? `/${focusProgress.daysTotal}` : ''}
                    </Text>
                    <Text style={styles.metaInfoText}>•</Text>
                    <Text style={styles.metaInfoText}>{formatTimeRemaining(timeUntilCheckIn)}</Text>
                  </View>
                </View>

                {/* Decorative circles */}
                <View style={[styles.decorativeCircle, styles.circle1]} />
                <View style={[styles.decorativeCircle, styles.circle2]} />
                <View style={[styles.decorativeCircle, styles.circle3]} />

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                  {!completed ? (
                    <View style={styles.buttonsRow}>
                      {/* I Did It Button */}
                      <TouchableOpacity
                        onPress={handleComplete}
                        style={styles.actionButtonWrapper}
                        activeOpacity={0.9}
                      >
                        <View style={styles.actionButtonOuterRing}>
                          <LinearGradient
                            colors={[COLORS.orange400, COLORS.amber400]}
                            style={styles.actionButtonInner}
                          >
                            <Ionicons name="checkmark" size={24} color={COLORS.white} style={{marginBottom: 4}} />
                            <Text style={styles.actionButtonText}>I did it!</Text>
                          </LinearGradient>
                        </View>
                      </TouchableOpacity>

                      {/* Send Help Button */}
                      <TouchableOpacity
                        onPress={() => setShowHelpMenu(true)}
                        style={styles.actionButtonWrapper}
                        activeOpacity={0.9}
                      >
                        <View style={styles.actionButtonOuterRing}>
                          <LinearGradient
                            colors={[COLORS.rose400, COLORS.pink500]}
                            style={styles.actionButtonInner}
                          >
                            <Ionicons name="alert-circle" size={24} color={COLORS.white} style={{marginBottom: 4}} />
                            <Text style={styles.actionButtonText}>Send help</Text>
                          </LinearGradient>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.doneWrapper}>
                      <View style={styles.doneOuterRing}>
                        <LinearGradient
                          colors={[COLORS.emerald400, COLORS.green500]}
                          style={styles.doneInner}
                        >
                          <Ionicons name="checkmark" size={36} color={COLORS.white} />
                          <Text style={styles.doneText}>Done! 🎉</Text>
                        </LinearGradient>
                      </View>
                    </View>
                  )}

                  {!completed && (
                    <Text style={styles.tapHintText}>Tap to complete or get support</Text>
                  )}
                </View>
              </LinearGradient>
            </View>

            {/* Content Area */}
            <View style={styles.contentArea}>
              {!showPlan ? (
                <>
                  <Text style={styles.tipTitle} numberOfLines={2}>
                    {tip.summary}
                  </Text>
                  <Text style={styles.focusLabel}>TODAY'S FOCUS</Text>
                  <Text style={styles.tipDescription}>
                    {tip.short_description || tip.details_md.split('\n')[0].replace(/\*\*/g, '')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowPlan(true)}
                    style={styles.viewPlanButton}
                  >
                    <Text style={styles.viewPlanText}>View plan</Text>
                    <Ionicons name="chevron-forward" size={12} color={COLORS.gray400} />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.planHeader}>
                    <Text style={styles.planTitle}>Your Plan</Text>
                    <TouchableOpacity
                      onPress={() => setShowPlan(false)}
                      style={styles.backButton}
                    >
                      <Ionicons name="chevron-back" size={16} color={COLORS.gray400} />
                      <Text style={styles.backButtonText}>Back</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.planContentScroll} showsVerticalScrollIndicator={false}>
                    {personalizedPlan ? (
                       <View style={styles.planItem}>
                         <View style={[styles.planBadge, { backgroundColor: COLORS.green100 }]}>
                           <Ionicons name="checkmark" size={10} color={COLORS.green600} />
                         </View>
                         <Text style={styles.planText}>{personalizedPlan}</Text>
                       </View>
                    ) : (
                      <Text style={styles.planText}>{tip.details_md.replace(/\*\*/g, '')}</Text>
                    )}
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Daily Insights Section */}
        <View style={styles.insightsSection}>
          <Text style={styles.insightsLabel}>TODAY'S MOTIVATION</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.insightsScrollContent}
            decelerationRate="fast"
            snapToInterval={176 + 12} // width + gap
          >
            {/* Fun Fact Card */}
            <TouchableOpacity 
              onPress={() => handleCardTap('funfact')}
              style={[
                styles.insightCard,
                !viewedCards.includes('funfact') && styles.insightCardNewAmber
              ]}
              activeOpacity={0.9}
            >
              {!viewedCards.includes('funfact') && <View style={[styles.newDot, { backgroundColor: COLORS.amber400 }]} />}
              <View style={styles.insightHeader}>
                <View style={[
                  styles.insightIconCircle,
                  { backgroundColor: !viewedCards.includes('funfact') ? COLORS.amber100 : COLORS.amber50 }
                ]}>
                  <Ionicons name="bulb" size={16} color={!viewedCards.includes('funfact') ? COLORS.amber600 : COLORS.amber400} />
                </View>
                <Text style={[
                  styles.insightTitle,
                  { color: !viewedCards.includes('funfact') ? COLORS.gray700 : COLORS.gray500 }
                ]}>Fun Fact</Text>
              </View>
              <Text style={[
                styles.insightText,
                { color: !viewedCards.includes('funfact') ? COLORS.gray600 : COLORS.gray400 }
              ]} numberOfLines={3}>
                Did you know? Small habits are 3x more likely to stick than big ones!
              </Text>
            </TouchableOpacity>

            {/* Quiz Card */}
            <TouchableOpacity 
              onPress={() => handleCardTap('quiz')}
              style={[
                styles.insightCard,
                !viewedCards.includes('quiz') && styles.insightCardNewPurple
              ]}
              activeOpacity={0.9}
            >
              {!viewedCards.includes('quiz') && <View style={[styles.newDot, { backgroundColor: COLORS.purple400 }]} />}
              <View style={styles.insightHeader}>
                <View style={[
                  styles.insightIconCircle,
                  { backgroundColor: !viewedCards.includes('quiz') ? COLORS.purple100 : COLORS.purple50 }
                ]}>
                  <Ionicons name="school" size={16} color={!viewedCards.includes('quiz') ? COLORS.purple600 : COLORS.purple400} />
                </View>
                <Text style={[
                  styles.insightTitle,
                  { color: !viewedCards.includes('quiz') ? COLORS.gray700 : COLORS.gray500 }
                ]}>Quick Quiz</Text>
              </View>
              <Text style={[
                styles.insightText,
                { color: !viewedCards.includes('quiz') ? COLORS.gray600 : COLORS.gray400 }
              ]} numberOfLines={1}>Test your knowledge!</Text>
              <View style={[
                styles.quizButton,
                { backgroundColor: !viewedCards.includes('quiz') ? COLORS.purple500 : COLORS.purple300 }
              ]}>
                <Text style={styles.quizButtonText}>Take Quiz →</Text>
              </View>
            </TouchableOpacity>

            {/* Pro Tip Card */}
            <TouchableOpacity
              onPress={() => handleCardTap('protip')}
              style={[
                styles.insightCard,
                !viewedCards.includes('protip') && styles.insightCardNewTeal
              ]}
              activeOpacity={0.9}
            >
              {!viewedCards.includes('protip') && <View style={[styles.newDot, { backgroundColor: COLORS.teal400 }]} />}
              <View style={styles.insightHeader}>
                <View style={[
                  styles.insightIconCircle,
                  { backgroundColor: !viewedCards.includes('protip') ? COLORS.teal100 : COLORS.teal50 }
                ]}>
                  <Ionicons name="heart" size={16} color={!viewedCards.includes('protip') ? COLORS.teal600 : COLORS.teal400} />
                </View>
                <Text style={[
                  styles.insightTitle,
                  { color: !viewedCards.includes('protip') ? COLORS.gray700 : COLORS.gray500 }
                ]}>Pro Tip</Text>
              </View>
              <Text style={[
                styles.insightText,
                { color: !viewedCards.includes('protip') ? COLORS.gray600 : COLORS.gray400 }
              ]} numberOfLines={3}>
                Try pairing this habit with something you already do every day.
              </Text>
            </TouchableOpacity>

            {/* Community Card */}
            <TouchableOpacity 
              onPress={() => handleCardTap('community')}
              style={[
                styles.insightCard,
                !viewedCards.includes('community') && styles.insightCardNewOrange
              ]}
              activeOpacity={0.9}
            >
              {!viewedCards.includes('community') && <View style={[styles.newDot, { backgroundColor: COLORS.orange400 }]} />}
              <View style={styles.insightHeader}>
                <Text style={{fontSize: 20, marginRight: 8}}>👥</Text>
                <Text style={[
                  styles.insightTitle,
                  { color: !viewedCards.includes('community') ? COLORS.gray700 : COLORS.gray500 }
                ]}>Community</Text>
              </View>
              <Text style={[
                styles.insightText,
                { color: !viewedCards.includes('community') ? COLORS.gray600 : COLORS.gray400 }
              ]}>
                <Text style={[
                  styles.communityCount,
                  { color: !viewedCards.includes('community') ? COLORS.orange500 : COLORS.orange300 }
                ]}>2,341</Text> people did this tip today!
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Bottom spacer for safe area */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Help Menu Modal */}
      <Modal
        visible={showHelpMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHelpMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowHelpMenu(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity onPress={() => setShowHelpMenu(false)} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={COLORS.gray400} />
              </TouchableOpacity>
              <View style={styles.dragHandle} />
              <View style={{width: 32}} />
            </View>

            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>What's getting in the way?</Text>
              <Text style={styles.modalSubtitle}>No judgment — let's figure it out together</Text>
            </View>

            <View style={styles.helpOptionsContainer}>
              {helpOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setShowHelpMenu(false)}
                  style={styles.helpOptionButton}
                >
                  <Text style={styles.helpOptionEmoji}>{option.emoji}</Text>
                  <View style={styles.helpOptionTextContainer}>
                    <Text style={styles.helpOptionLabel}>{option.label}</Text>
                    <Text style={styles.helpOptionDescription}>{option.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.gray300} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setShowHelpMenu(false)}
              style={styles.nevermindButton}
            >
              <Text style={styles.nevermindText}>Never mind, I've got this 💪</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Generic Modal for Cards (FunFact, Quiz, etc) */}
      <Modal
        visible={activeCard !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveCard(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => { setActiveCard(null); setQuizAnswer(null); }}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <TouchableOpacity onPress={() => { setActiveCard(null); setQuizAnswer(null); }} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={COLORS.gray400} />
              </TouchableOpacity>
              <View style={styles.dragHandle} />
              <View style={{width: 32}} />
            </View>

            {activeCard === 'funfact' && (
              <>
                <View style={styles.modalCenterHeader}>
                  <View style={[styles.modalIconCircle, { backgroundColor: COLORS.amber100 }]}>
                    <Ionicons name="bulb" size={32} color={COLORS.amber500} />
                  </View>
                  <Text style={styles.modalTitle}>Did You Know?</Text>
                  <Text style={styles.modalBodyText}>
                    Small consistent actions build neural pathways that make habits automatic over time.
                  </Text>
                </View>
                <View style={[styles.bonusBox, { backgroundColor: COLORS.amber50 }]}>
                  <Text style={[styles.bonusText, { color: COLORS.amber800 }]}>
                    💡 <Text style={{fontWeight: '600'}}>Bonus:</Text> Even doing it poorly is better than not doing it at all!
                  </Text>
                </View>
                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    onPress={() => setActiveCard(null)}
                    style={styles.modalSecondaryButton}
                  >
                    <Text style={styles.modalSecondaryButtonText}>Got it</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setActiveCard(null)}
                    style={[styles.modalPrimaryButton, { backgroundColor: COLORS.amber500 }]}
                  >
                    <Text style={styles.modalPrimaryButtonText}>Share this 📤</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {activeCard === 'quiz' && (
              <>
                <View style={styles.modalCenterHeader}>
                  <View style={[styles.modalIconCircle, { backgroundColor: COLORS.purple100 }]}>
                    <Ionicons name="school" size={32} color={COLORS.purple500} />
                  </View>
                  <Text style={styles.modalTitle}>Quick Quiz</Text>
                  <Text style={styles.modalBodyText}>
                    What's the most effective way to build a new habit?
                  </Text>
                </View>

                <View style={styles.quizOptionsContainer}>
                  {[
                    { id: 'a', text: 'Rely on willpower', correct: false },
                    { id: 'b', text: 'Start small & consistent', correct: true },
                    { id: 'c', text: 'Wait for motivation', correct: false },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => setQuizAnswer(option.id)}
                      disabled={quizAnswer !== null}
                      style={[
                        styles.quizOptionButton,
                        quizAnswer === null
                          ? styles.quizOptionDefault
                          : option.correct
                            ? styles.quizOptionCorrect
                            : quizAnswer === option.id
                              ? styles.quizOptionWrong
                              : styles.quizOptionDimmed
                      ]}
                    >
                      <View style={[
                        styles.quizOptionLetter,
                        quizAnswer === null
                          ? { backgroundColor: COLORS.purple100 }
                          : option.correct
                            ? { backgroundColor: COLORS.green200 }
                            : quizAnswer === option.id
                              ? { backgroundColor: COLORS.red200 }
                              : { backgroundColor: COLORS.gray200 }
                      ]}>
                        <Text style={[
                          styles.quizOptionLetterText,
                          quizAnswer === null
                          ? { color: COLORS.purple600 }
                          : option.correct
                            ? { color: COLORS.green700 }
                            : quizAnswer === option.id
                              ? { color: COLORS.red700 }
                              : { color: COLORS.gray500 }
                        ]}>{option.id.toUpperCase()}</Text>
                      </View>
                      <Text style={[
                        styles.quizOptionText,
                         quizAnswer !== null && option.correct && { color: COLORS.green700 }
                      ]}>{option.text}</Text>
                      {quizAnswer !== null && option.correct && (
                        <Ionicons name="checkmark" size={20} color={COLORS.green500} style={{ marginLeft: 'auto' }} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {quizAnswer && (
                  <View style={[
                    styles.bonusBox,
                    { backgroundColor: quizAnswer === 'b' ? COLORS.green50 : COLORS.amber50 }
                  ]}>
                    <Text style={[
                      styles.bonusText,
                      { color: quizAnswer === 'b' ? COLORS.green800 : COLORS.amber800 }
                    ]}>
                      {quizAnswer === 'b'
                        ? '🎉 Nice work! Consistency beats intensity every time.'
                        : '💡 Good try! Starting small reduces friction and helps consistency.'}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => { setActiveCard(null); setQuizAnswer(null); }}
                  style={[styles.modalFullButton, { backgroundColor: COLORS.purple500 }]}
                >
                  <Text style={styles.modalFullButtonText}>{quizAnswer ? 'Done' : 'Skip for now'}</Text>
                </TouchableOpacity>
              </>
            )}

            {activeCard === 'protip' && (
              <>
                <View style={styles.modalCenterHeader}>
                  <View style={[styles.modalIconCircle, { backgroundColor: COLORS.teal100 }]}>
                    <Ionicons name="heart" size={32} color={COLORS.teal500} />
                  </View>
                  <Text style={styles.modalTitle}>Pro Tip</Text>
                  <Text style={styles.modalBodyText}>
                    Make this habit more enjoyable by pairing it with something you love!
                  </Text>
                </View>

                <View style={styles.proTipList}>
                  <View style={styles.proTipItem}>
                    <Text style={{fontSize: 24}}>🎧</Text>
                    <Text style={styles.proTipText}>Listen to a favorite podcast</Text>
                  </View>
                  <View style={styles.proTipItem}>
                    <Text style={{fontSize: 24}}>🎵</Text>
                    <Text style={styles.proTipText}>Create a special playlist</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setActiveCard(null)}
                  style={[styles.modalFullButton, { backgroundColor: COLORS.teal500 }]}
                >
                  <Text style={styles.modalFullButtonText}>Great idea!</Text>
                </TouchableOpacity>
              </>
            )}

            {activeCard === 'community' && (
              <>
                <View style={styles.modalCenterHeader}>
                  <Text style={{fontSize: 48, marginBottom: 16}}>👥</Text>
                  <Text style={styles.modalTitle}>You're Not Alone!</Text>
                  <Text style={styles.modalBodyText}>
                    <Text style={{fontWeight: 'bold', color: COLORS.orange500, fontSize: 24}}>2,341</Text> people completed this tip today
                  </Text>
                </View>

                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>87%</Text>
                    <Text style={styles.statLabel}>found it helpful</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>12k</Text>
                    <Text style={styles.statLabel}>tried this week</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>4.8⭐</Text>
                    <Text style={styles.statLabel}>avg rating</Text>
                  </View>
                </View>

                <View style={[styles.bonusBox, { backgroundColor: COLORS.gray50 }]}>
                  <Text style={[styles.bonusText, { color: COLORS.gray600, fontStyle: 'italic' }]}>
                    "Started doing this 2 weeks ago and I feel so much better. Game changer!"
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.gray400, marginTop: 4 }}>— Sarah, Day 14</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setActiveCard(null)}
                  style={[styles.modalFullButton, { backgroundColor: COLORS.orange500 }]}
                >
                  <Text style={styles.modalFullButtonText}>Share my win 🎉</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.orange50,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: SCREEN_HEIGHT,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 48, // Adjust for status bar
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.orange500,
  },
  headerIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarIconCircle: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mainCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  cardVisualArea: {
    height: 224,
    position: 'relative',
    overflow: 'hidden',
  },
  cardGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaInfoContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  metaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.1)', // subtle background for readability
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaInfoText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: COLORS.white20,
    borderRadius: 999,
  },
  circle1: {
    top: 16,
    left: 16,
    width: 80,
    height: 80,
  },
  circle2: {
    bottom: 16,
    right: 16,
    width: 64,
    height: 64,
  },
  circle3: {
    top: '50%',
    left: '50%',
    marginLeft: -80,
    marginTop: -80,
    width: 160,
    height: 160,
  },
  actionButtonsContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButtonWrapper: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.white30,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  actionButtonOuterRing: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
    backgroundColor: COLORS.white50,
    padding: 2,
  },
  actionButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  doneWrapper: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: COLORS.white30,
    padding: 4,
  },
  doneOuterRing: {
    width: '100%',
    height: '100%',
    borderRadius: 64,
    backgroundColor: COLORS.white50,
    padding: 4,
  },
  doneInner: {
    width: '100%',
    height: '100%',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
  tapHintText: {
    color: COLORS.white70,
    fontSize: 12,
    marginTop: 12,
    fontWeight: '500',
  },
  contentArea: {
    padding: 20,
  },
  tipTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  focusLabel: {
    color: COLORS.orange500,
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  tipDescription: {
    color: COLORS.gray600,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  viewPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  viewPlanText: {
    color: COLORS.gray400,
    fontSize: 12,
    fontWeight: '500',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray800,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    color: COLORS.gray400,
    fontSize: 14,
  },
  planContentScroll: {
    maxHeight: 200,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  planBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  planText: {
    fontSize: 14,
    color: COLORS.gray600,
    lineHeight: 22,
    flex: 1,
  },
  insightsSection: {
    paddingTop: 16,
    paddingBottom: 28, // Extra padding at bottom
  },
  insightsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray500,
    marginBottom: 12,
    paddingHorizontal: 20,  },
  insightsScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 16,
  },
  insightCard: {
    width: 176,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  insightCardNewAmber: {
    borderWidth: 2,
    borderColor: COLORS.amber200,
  },
  insightCardNewPurple: {
    borderWidth: 2,
    borderColor: COLORS.purple200,
  },
  insightCardNewTeal: {
    borderWidth: 2,
    borderColor: COLORS.teal200,
  },
  insightCardNewOrange: {
    borderWidth: 2,
    borderColor: COLORS.orange200,
  },
  newDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  quizButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  quizButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
  communityCount: {
    fontWeight: 'bold',
  },

  // Modals / Bottom Sheets
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.black30,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    maxHeight: '85%',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray100,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray300,
    borderRadius: 2,
  },
  modalTitleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.gray800,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray500,
    textAlign: 'center',
  },
  modalCenterHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalBodyText: {
    fontSize: 16,
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: 24,
  },
  helpOptionsContainer: {
    gap: 8,
  },
  helpOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.gray50,
    borderRadius: 16,
    gap: 16,
  },
  helpOptionEmoji: {
    fontSize: 24,
  },
  helpOptionTextContainer: {
    flex: 1,
  },
  helpOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: 2,
  },
  helpOptionDescription: {
    fontSize: 14,
    color: COLORS.gray500,
  },
  nevermindButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nevermindText: {
    color: COLORS.gray400,
    fontSize: 14,
    fontWeight: '500',
  },
  bonusBox: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  bonusText: {
    fontSize: 14,
    lineHeight: 20,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalPrimaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryButtonText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: 16,
  },
  modalSecondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryButtonText: {
    color: COLORS.gray600,
    fontWeight: '500',
    fontSize: 16,
  },
  modalFullButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFullButtonText: {
    color: COLORS.white,
    fontWeight: '500',
    fontSize: 16,
  },
  quizOptionsContainer: {
    gap: 8,
    marginBottom: 20,
  },
  quizOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
  },
  quizOptionDefault: {
    backgroundColor: COLORS.gray50,
    borderColor: 'transparent',
  },
  quizOptionCorrect: {
    backgroundColor: COLORS.green50,
    borderColor: COLORS.green300,
  },
  quizOptionWrong: {
    backgroundColor: COLORS.red50,
    borderColor: COLORS.red300,
  },
  quizOptionDimmed: {
    backgroundColor: COLORS.gray50,
    borderColor: 'transparent',
    opacity: 0.5,
  },
  quizOptionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizOptionLetterText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  quizOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray700,
    flex: 1,
  },
  proTipList: {
    gap: 12,
    marginBottom: 20,
  },
  proTipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.teal50,
    borderRadius: 12,
    gap: 12,
  },
  proTipText: {
    fontSize: 14,
    color: COLORS.teal800,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.orange50,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.orange600,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.orange800,
    marginTop: 2,
  },
});
