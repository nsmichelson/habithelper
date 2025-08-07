import React, { useEffect, useRef } from 'react';
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
import { Tip } from '../types/tip';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  tip: Tip;
  onViewDetails: () => void;
  timeUntilCheckIn: number; // hours until evening check-in
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

export default function ExperimentMode({ tip, onViewDetails, timeUntilCheckIn }: Props) {
  const scale = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

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

    progressWidth.value = withDelay(
      500,
      withTiming(100, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
    );

    // Continuous pulse animation for the main card
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );

    // Glow animation
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * pulseScale.value },
    ],
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
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
        <Animated.View style={[styles.successBadge, cardAnimatedStyle]}>
          <LinearGradient
            colors={['#4CAF50', '#45B255']}
            style={styles.successGradient}
          >
            <Animated.View style={checkmarkAnimatedStyle}>
              <Ionicons name="checkmark-circle" size={64} color="#FFF" />
            </Animated.View>
            <Text style={styles.successTitle}>You're Experimenting!</Text>
            <Text style={styles.successSubtitle}>Amazing commitment! 🎉</Text>
          </LinearGradient>
        </Animated.View>

        {/* Active Experiment Card */}
        <Animated.View style={[styles.experimentCard, cardAnimatedStyle]}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FFF8']}
            style={styles.cardGradient}
          >
            {/* Glow effect */}
            <Animated.View style={[styles.glowEffect, glowAnimatedStyle]} />
            
            <View style={styles.experimentHeader}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>ACTIVE EXPERIMENT</Text>
              </View>
            </View>

            <Text style={styles.experimentTitle}>{tip.summary}</Text>

            {/* Quick reminder of key details */}
            <View style={styles.quickDetails}>
              <View style={styles.detailChip}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.detailText}>
                  {tip.time_cost_enum.replace(/_/g, ' ').replace('min', 'minutes')}
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
              <Text style={styles.progressTitle}>Your Progress Today</Text>
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
                Experiment in progress • {formatTimeRemaining(timeUntilCheckIn)}
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
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#4CAF50',
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
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
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
});