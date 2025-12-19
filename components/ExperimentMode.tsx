import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
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
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { QuickComplete } from '../types/tip';
import { SimplifiedTip } from '../types/simplifiedTip';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import QuickCompleteModal, { CompletionFeedback } from './QuickComplete';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  tip: SimplifiedTip;
  onViewDetails: () => void;
  timeUntilCheckIn: number; // hours until evening check-in
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

export default function ExperimentMode({ 
  tip, 
  onViewDetails, 
  timeUntilCheckIn, 
  onQuickComplete,
  quickCompletions = []
}: Props) {
  const [showQuickComplete, setShowQuickComplete] = useState(false);
  const [badgeMinimized, setBadgeMinimized] = useState(false);
  const scale = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const successPulseScale = useSharedValue(1);
  const cardEntranceScale = useSharedValue(0);
  const badgePosition = useSharedValue(0);
  const badgeSize = useSharedValue(1);
  const quickCompleteButtonScale = useSharedValue(0);
  const quickCompleteButtonOpacity = useSharedValue(0);

  // Calculate actual progress based on time
  const calculateProgress = () => {
    const currentHour = new Date().getHours();
    const checkInHour = 19; // 7 PM check-in
    
    // Assume experiment started now (or could be passed as prop)
    // If it's morning, we have more time; if afternoon, less time
    let totalHours = checkInHour - currentHour;
    if (totalHours <= 0) {
      return 100; // Check-in time has arrived
    }
    
    // Assume a typical experiment day is ~10 hours (9 AM to 7 PM)
    const typicalDayHours = 10;
    const hoursElapsed = typicalDayHours - totalHours;
    const progress = Math.max(0, Math.min(100, (hoursElapsed / typicalDayHours) * 100));
    
    return progress;
  };

  useEffect(() => {
    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Entrance animations
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    
    checkmarkScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.2, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 200 })
      )
    );

    // Main card entrance (no continuous animation)
    cardEntranceScale.value = withDelay(
      200,
      withSpring(1, { damping: 15, stiffness: 200 })
    );

    // Animate progress to actual current progress
    const currentProgress = calculateProgress();
    progressWidth.value = withDelay(
      500,
      withTiming(currentProgress, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
    );

    // After 3 seconds, minimize the success badge and show the "I Did It!" button prominently
    setTimeout(() => {
      // Animate badge to smaller size and move to top corner
      badgeSize.value = withSpring(0.3, { damping: 15, stiffness: 200 });
      badgePosition.value = withSpring(-150, { damping: 15, stiffness: 200 });
      
      // Fade in and scale up the "I Did It!" button with attention-grabbing animation
      quickCompleteButtonScale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 15, stiffness: 200 }),
        // Add a subtle pulse to draw attention
        withDelay(
          500,
          withRepeat(
            withSequence(
              withTiming(1.05, { duration: 1000 }),
              withTiming(1, { duration: 1000 })
            ),
            -1,
            true
          )
        )
      );
      quickCompleteButtonOpacity.value = withTiming(1, { duration: 300 });
      
      // Update state to change text content
      setBadgeMinimized(true);
    }, 3000);

    // Pulse animation only for success badge (stop when minimized)
    successPulseScale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const successBadgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * successPulseScale.value * badgeSize.value },
      { translateY: badgePosition.value },
    ],
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: cardEntranceScale.value },
    ],
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const quickCompleteButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: quickCompleteButtonScale.value }],
    opacity: quickCompleteButtonOpacity.value,
  }));

  const formatTimeRemaining = (hours: number) => {
    if (hours <= 0) return "Check-in time!";
    if (hours === 1) return "1 hour until check-in";
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} minutes until check-in`;
    }
    return `${Math.round(hours)} hours until check-in`;
  };

  return (
    <View style={styles.container}>
      {/* Confetti Animation */}
      <View style={styles.confettiContainer} pointerEvents="none">
        {Array.from({ length: 15 }).map((_, i) => (
          <ConfettiParticle
            key={i}
            delay={i * 100}
            startX={Math.random() * SCREEN_WIDTH}
          />
        ))}
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Badge */}
        <Animated.View style={[styles.successBadge, successBadgeAnimatedStyle]}>
          <LinearGradient
            colors={['#4CAF50', '#45B255']}
            style={[styles.successGradient, badgeMinimized && styles.successGradientMini]}
          >
            {!badgeMinimized ? (
              <>
                <Animated.View style={checkmarkAnimatedStyle}>
                  <Ionicons name="checkmark-circle" size={64} color="#FFF" />
                </Animated.View>
                <Text style={styles.successTitle}>You're Experimenting!</Text>
                <Text style={styles.successSubtitle}>Amazing commitment! 🎉</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                <Text style={styles.successTitleMini}>Experimenting</Text>
              </>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Active Experiment Card */}
        <Animated.View style={[styles.experimentCard, cardAnimatedStyle]}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FFF8']}
            style={styles.cardGradient}
          >
            
            <View style={styles.experimentHeader}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>ACTIVE EXPERIMENT</Text>
              </View>
            </View>

            <Text style={styles.experimentTitle}>{tip.summary}</Text>

            {/* Quick Complete Button - Now prominently placed at top */}
            {quickCompletions.length === 0 ? (
              <Animated.View style={[quickCompleteButtonAnimatedStyle]}>
                <TouchableOpacity 
                  style={styles.quickCompleteButtonProminent}
                  onPress={() => setShowQuickComplete(true)}
                >
                  <LinearGradient
                    colors={['#4CAF50', '#45B255']}
                    style={styles.quickCompleteGradientProminent}
                  >
                    <Ionicons name="rocket" size={28} color="#FFF" />
                    <Text style={styles.quickCompleteTextProminent}>I Did It!</Text>
                    <Text style={styles.quickCompleteSubtextProminent}>Mark as complete now</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
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
                        <Text style={styles.completedNote}>
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

            {/* Quick reminder of key details */}
            <View style={styles.quickDetails}>
              <View style={styles.detailChip}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.detailText}>
                  {tip.time.replace('-', ' to ').replace('min', ' minutes')}
                </Text>
              </View>
              <View style={styles.detailChip}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.detailText}>
                  {tip.location_tags[0]?.charAt(0).toUpperCase() + tip.location_tags[0]?.slice(1)}
                </Text>
              </View>
            </View>

            {/* Progress Tracker */}
            <View style={styles.progressSection}>
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
                <View style={styles.progressMarkers}>
                  <Text style={styles.progressMarkerStart}>Started</Text>
                  <Text style={styles.progressMarkerEnd}>7 PM</Text>
                </View>
              </View>
              <Text style={styles.progressText}>
                We'll check in with you this evening about how it went
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.primaryButton} onPress={onViewDetails}>
                <LinearGradient
                  colors={['#4CAF50', '#45B255']}
                  style={styles.buttonGradient}
                >
                  <Ionicons name="book-outline" size={20} color="#FFF" />
                  <Text style={styles.primaryButtonText}>Review Instructions</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryButton}>
                <Ionicons name="notifications-outline" size={20} color="#4CAF50" />
                <Text style={styles.secondaryButtonText}>Reminder Set</Text>
              </TouchableOpacity>
            </View>


            {/* Motivational Message */}
            <View style={styles.motivationalCard}>
              <LinearGradient
                colors={['#E8F5E9', '#F1F8E9']}
                style={styles.motivationalGradient}
              >
                <Text style={styles.motivationalEmoji}>💪</Text>
                <Text style={styles.motivationalText}>
                  You've got this! Small experiments lead to big changes.
                </Text>
              </LinearGradient>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Tips for Success */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Tips for Success</Text>
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
        </View>
      </ScrollView>

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
  successBadge: {
    margin: 16,
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
  successGradientMini: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  successTitleMini: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 4,
  },
  experimentCard: {
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardGradient: {
    padding: 20,
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
  quickDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
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
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressGradient: {
    flex: 1,
  },
  progressMarkers: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    top: 12,
  },
  progressMarkerStart: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  progressMarkerEnd: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 12,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    backgroundColor: '#FAFFFE',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  motivationalCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  motivationalGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  motivationalEmoji: {
    fontSize: 24,
  },
  motivationalText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D32',
    lineHeight: 20,
  },
  tipsCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
  quickCompleteButtonProminent: {
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  quickCompleteGradientProminent: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickCompleteTextProminent: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 8,
  },
  quickCompleteSubtextProminent: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
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
    flex: 1,
  },
  completedNote: {
    fontSize: 14,
    color: '#66BB6A',
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
});