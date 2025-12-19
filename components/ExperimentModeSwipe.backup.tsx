import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  interpolate,
  Extrapolate,
  Easing,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Tip, QuickComplete } from '../types/tip';
import * as Haptics from 'expo-haptics';
import QuickCompleteModal, { CompletionFeedback } from './QuickComplete';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  tip: Tip;
  onViewDetails: () => void;
  timeUntilCheckIn: number;
  onQuickComplete: (feedback: CompletionFeedback) => void;
  quickCompletions?: QuickComplete[];
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
  onViewDetails, 
  timeUntilCheckIn, 
  onQuickComplete,
  quickCompletions = []
}: Props) {
  const [showQuickComplete, setShowQuickComplete] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useSharedValue(0);
  const scale = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const successPulseScale = useSharedValue(1);
  const flatListRef = useRef<FlatList>(null);

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

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    scale.value = withSpring(1, { damping: 15, stiffness: 200 });

    const currentProgress = calculateProgress();
    progressWidth.value = withDelay(
      500,
      withTiming(currentProgress, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
    );

    successPulseScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
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

  const successBadgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * successPulseScale.value }],
  }));

  // Motivational messages to rotate through
  const motivationalMessages = [
    { emoji: '💪', text: "You've got this! Small experiments lead to big changes." },
    { emoji: '🌟', text: "Every experiment is a step toward discovering what works for you!" },
    { emoji: '🎯', text: "Focus on progress, not perfection. You're doing great!" },
    { emoji: '🚀', text: "One small change today, one giant leap for your habits!" },
    { emoji: '✨', text: "Remember: You're brave for trying something new today!" },
  ];

  const randomMotivational = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  const renderProgressCard = () => (
    <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
      {/* Success Badge */}
      <Animated.View style={[styles.successBadge, successBadgeAnimatedStyle]}>
        <LinearGradient
          colors={['#4CAF50', '#45B255']}
          style={styles.successGradient}
        >
          <Ionicons name="checkmark-circle" size={64} color="#FFF" />
          <Text style={styles.successTitle}>You're Experimenting!</Text>
          <Text style={styles.successSubtitle}>Amazing commitment! 🎉</Text>
        </LinearGradient>
      </Animated.View>

      {/* Active Experiment Card */}
      <LinearGradient
        colors={['#FFFFFF', '#F8FFF8']}
        style={styles.card}
      >
        <View style={styles.experimentHeader}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>ACTIVE EXPERIMENT</Text>
          </View>
        </View>

        <Text style={styles.experimentTitle}>{tip.summary}</Text>

        {/* Progress Tracker */}
        <Animated.View style={[styles.progressSection, progressSectionAnimatedStyle]}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Time Until Check-in</Text>
            <Text style={styles.progressTime}>{formatTimeRemaining(timeUntilCheckIn)}</Text>
          </View>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressAnimatedStyle]}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.progressGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
          <Text style={styles.progressText}>
            We'll check in with you this evening about how it went
          </Text>
        </Animated.View>

        {/* Quick Complete Button or Status */}
        {quickCompletions.length === 0 ? (
          <TouchableOpacity 
            style={styles.quickCompleteButton}
            onPress={() => setShowQuickComplete(true)}
          >
            <LinearGradient
              colors={['#4CAF50', '#45B255']}
              style={styles.quickCompleteGradient}
            >
              <Ionicons name="rocket" size={24} color="#FFF" />
              <Text style={styles.quickCompleteText}>I Did It!</Text>
              <Text style={styles.quickCompleteSubtext}>Mark as complete now</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBadge}>
            <LinearGradient
              colors={['#E8F5E9', '#C8E6C9']}
              style={styles.completedGradient}
            >
              <View style={styles.completedHeader}>
                <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.completedText}>
                    Completed {quickCompletions.length}x today!
                  </Text>
                  {quickCompletions[quickCompletions.length - 1]?.quick_note && (
                    <Text style={styles.completedFeedback}>
                      Last time: {
                        quickCompletions[quickCompletions.length - 1].quick_note === 'worked_great' ? '🎉 Worked great!' :
                        quickCompletions[quickCompletions.length - 1].quick_note === 'went_ok' ? '👍 Went ok' :
                        quickCompletions[quickCompletions.length - 1].quick_note === 'not_sure' ? '🤔 Not sure' :
                        '👎 Not for me'
                      }
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity 
                style={styles.addAnotherButton}
                onPress={() => setShowQuickComplete(true)}
              >
                <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
                <Text style={styles.addAnotherText}>Did it again</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Swipe hint */}
        <TouchableOpacity 
          style={styles.swipeHint}
          onPress={() => handleSwipeToPage(1)}
        >
          <Text style={styles.swipeHintText}>Swipe for instructions</Text>
          <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderInstructionsCard = () => (
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
            <Text style={styles.backButtonText}>Progress</Text>
          </TouchableOpacity>
          <Text style={styles.instructionsTitle}>Quick Instructions</Text>
          <View style={{ width: 80 }} />
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

          {/* How to do it */}
          <View style={styles.howToSection}>
            <Text style={styles.sectionTitle}>How To Do It</Text>
            <Text style={styles.detailsText}>{tip.details_md}</Text>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Time Needed</Text>
                <Text style={styles.infoValue}>
                  {tip.time_cost_enum.replace(/_/g, ' ').replace('min', 'minutes')}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Best Location</Text>
                <Text style={styles.infoValue}>
                  {tip.location_tags.map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="restaurant-outline" size={20} color="#666" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Best Time</Text>
                <Text style={styles.infoValue}>
                  {tip.time_of_day.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
                </Text>
              </View>
            </View>
          </View>

          {/* Goals */}
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
        </ScrollView>

        {/* Quick action button */}
        <TouchableOpacity 
          style={styles.doItNowButton}
          onPress={() => {
            handleSwipeToPage(0);
            setShowQuickComplete(true);
          }}
        >
          <LinearGradient
            colors={['#4CAF50', '#45B255']}
            style={styles.doItNowGradient}
          >
            <Text style={styles.doItNowText}>I'm Doing It Now!</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderEncouragementCard = () => (
    <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FFF8']}
        style={styles.card}
      >
        <View style={styles.encouragementHeader}>
          <Text style={styles.encouragementTitle}>You Can Do This! 💪</Text>
        </View>

        <ScrollView 
          style={styles.encouragementScrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Main motivational message */}
          <View style={styles.motivationalCard}>
            <LinearGradient
              colors={['#E8F5E9', '#F1F8E9']}
              style={styles.motivationalGradient}
            >
              <Text style={styles.motivationalEmoji}>{randomMotivational.emoji}</Text>
              <Text style={styles.motivationalText}>{randomMotivational.text}</Text>
            </LinearGradient>
          </View>

          {/* Why This Works */}
          <View style={styles.whyItWorksSection}>
            <Text style={styles.sectionTitle}>Why This Experiment Works</Text>
            <View style={styles.benefitsList}>
              {tip.tip_type.map((type, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons name="sparkles" size={16} color="#4CAF50" />
                  <Text style={styles.benefitText}>
                    {type === 'healthy_swap' && "It's a simple swap that doesn't feel like sacrifice"}
                    {type === 'crave_buster' && "Helps manage cravings naturally"}
                    {type === 'planning_ahead' && "Setting yourself up for success"}
                    {type === 'environment_design' && "Makes the healthy choice the easy choice"}
                    {type === 'skill_building' && "Building a skill you can use forever"}
                    {type === 'mindset_shift' && "Changes how you think about habits"}
                    {type === 'habit_stacking' && "Builds on what you already do well"}
                    {type === 'time_ritual' && "Creates a positive routine"}
                    {type === 'mood_regulation' && "Supports your emotional wellbeing"}
                    {type === 'self_monitoring' && "Increases awareness of your patterns"}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Tips for Success */}
          <View style={styles.tipsCard}>
            <Text style={styles.sectionTitle}>Tips for Success</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              <Text style={styles.tipText}>Set a specific time to try this experiment</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              <Text style={styles.tipText}>Keep it simple - don't overthink it</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              <Text style={styles.tipText}>Remember: it's just an experiment, not a test!</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#4CAF50" />
              <Text style={styles.tipText}>Be curious about how it feels</Text>
            </View>
          </View>

          {/* Reminder */}
          <View style={styles.reminderCard}>
            <Ionicons name="notifications" size={24} color="#FF9800" />
            <View style={{ flex: 1 }}>
              <Text style={styles.reminderTitle}>Evening Check-in Set</Text>
              <Text style={styles.reminderText}>
                We'll check in at 7 PM to see how it went
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  const pages = [
    { key: 'progress', render: renderProgressCard },
    { key: 'instructions', render: renderInstructionsCard },
    { key: 'encouragement', render: renderEncouragementCard },
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
      {quickCompletions.length === 0 && (
        <View style={styles.confettiContainer} pointerEvents="none">
          {Array.from({ length: 15 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={i * 100}
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
        onQuickComplete={(feedback) => {
          onQuickComplete(feedback);
          setShowQuickComplete(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
  successBadge: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  successGradient: {
    padding: 24,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  experimentHeader: {
    marginBottom: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4CAF50',
    letterSpacing: 0.5,
  },
  experimentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 28,
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
  },
  progressTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressGradient: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  quickCompleteButton: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  quickCompleteGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  quickCompleteText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 8,
  },
  quickCompleteSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  completedBadge: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  completedGradient: {
    padding: 16,
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  completedFeedback: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  addAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  addAnotherText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  swipeHintText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
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
    marginBottom: 20,
  },
  summaryBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 11,
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
    marginBottom: 20,
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
  },
  quickInfo: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '600',
    marginTop: 2,
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
  doItNowButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  doItNowGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  doItNowText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  encouragementHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  encouragementTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
  },
  encouragementScrollView: {
    flex: 1,
  },
  motivationalCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  motivationalGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  motivationalEmoji: {
    fontSize: 32,
  },
  motivationalText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
    lineHeight: 24,
  },
  whyItWorksSection: {
    marginBottom: 20,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: '#F8FFF8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
  },
  reminderText: {
    fontSize: 12,
    color: '#FF9800',
    marginTop: 2,
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
});