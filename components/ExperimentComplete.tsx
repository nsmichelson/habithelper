import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Tip, TipFeedback, DailyTip } from '../types/tip';
import * as Haptics from 'expo-haptics';
import TipHistoryModal from './TipHistoryModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  tip: Tip;
  feedback: TipFeedback;
  onGetNewTip?: () => void;
  totalExperiments?: number;
  successfulExperiments?: number;
  currentStreak?: number;
  tipHistory?: Array<{
    dailyTip: DailyTip;
    tip: Tip;
  }>;
}

// Star animation component
const AnimatedStar = ({ delay, index }: { delay: number; index: number }) => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.2, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      )
    );
    
    rotation.value = withDelay(
      delay,
      withTiming(360, { duration: 1000, easing: Easing.bezier(0.4, 0, 0.2, 1) })
    );
    
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const positions = [
    { top: 20, left: 30 },
    { top: 50, right: 40 },
    { bottom: 100, left: 50 },
    { bottom: 150, right: 30 },
    { top: 100, left: 20 },
  ];

  return (
    <Animated.View
      style={[
        styles.star,
        positions[index % positions.length],
        animatedStyle,
      ]}
    >
      <Ionicons name="star" size={24} color="#FFD700" />
    </Animated.View>
  );
};

export default function ExperimentComplete({ 
  tip, 
  feedback, 
  onGetNewTip,
  totalExperiments = 1,
  successfulExperiments = 1,
  currentStreak = 1,  // This is now "days since start"
  tipHistory = []
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalTips, setModalTips] = useState<Array<{ dailyTip: DailyTip; tip: Tip }>>([]);
  
  const cardScale = useSharedValue(0);
  const ribbonWidth = useSharedValue(0);
  const resultScale = useSharedValue(0);
  const statsOpacity = useSharedValue(0);

  const getFeedbackConfig = () => {
    switch (feedback) {
      case 'went_great':
        return {
          emoji: '🎉',
          title: 'Experiment Complete!',
          subtitle: 'You crushed it!',
          message: 'This experiment went great! You\'re building amazing habits.',
          color: '#4CAF50',
          gradientColors: ['#4CAF50', '#66BB6A'],
          icon: 'trophy',
        };
      case 'went_ok':
        return {
          emoji: '👍',
          title: 'Experiment Complete!',
          subtitle: 'Good effort!',
          message: 'Every experiment teaches you something. This one went okay!',
          color: '#FF9800',
          gradientColors: ['#FF9800', '#FFB74D'],
          icon: 'thumbs-up',
        };
      case 'not_great':
        return {
          emoji: '💪',
          title: 'Experiment Complete!',
          subtitle: 'You tried, that\'s what matters!',
          message: 'Not every experiment works out, but you learned something valuable!',
          color: '#2196F3',
          gradientColors: ['#2196F3', '#64B5F6'],
          icon: 'trending-up',
        };
      case 'didnt_try':
        return {
          emoji: '🌟',
          title: 'Day Complete!',
          subtitle: 'Tomorrow is a new opportunity',
          message: 'Life happens! Ready to try something new tomorrow?',
          color: '#9C27B0',
          gradientColors: ['#9C27B0', '#BA68C8'],
          icon: 'refresh',
        };
      default:
        return {
          emoji: '✅',
          title: 'Experiment Complete!',
          subtitle: 'Well done!',
          message: 'You completed today\'s experiment!',
          color: '#4CAF50',
          gradientColors: ['#4CAF50', '#66BB6A'],
          icon: 'checkmark-circle',
        };
    }
  };

  const config = getFeedbackConfig();

  useEffect(() => {
    // Trigger haptic feedback
    if (feedback === 'went_great') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animate entrance
    cardScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    
    ribbonWidth.value = withDelay(
      300,
      withTiming(100, { duration: 800, easing: Easing.bezier(0.4, 0, 0.2, 1) })
    );
    
    resultScale.value = withDelay(
      500,
      withSequence(
        withSpring(1.1, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      )
    );
    
    statsOpacity.value = withDelay(
      700,
      withTiming(1, { duration: 500 })
    );
  }, [feedback]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const ribbonAnimatedStyle = useAnimatedStyle(() => ({
    width: `${ribbonWidth.value}%`,
  }));

  const resultAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resultScale.value }],
  }));

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

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

  return (
    <View style={styles.container}>
      {/* Stars for "went_great" */}
      {feedback === 'went_great' && (
        <View style={styles.starsContainer} pointerEvents="none">
          {Array.from({ length: 5 }).map((_, i) => (
            <AnimatedStar key={i} delay={i * 150} index={i} />
          ))}
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Completion Card */}
        <Animated.View style={[styles.completionCard, cardAnimatedStyle]}>
          <LinearGradient
            colors={config.gradientColors as any}
            style={styles.gradientBackground}
          >
            {/* Ribbon Effect */}
            <View style={styles.ribbonContainer}>
              <Animated.View style={[styles.ribbon, ribbonAnimatedStyle]}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                  style={styles.ribbonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>

            {/* Result Badge */}
            <Animated.View style={[styles.resultBadge, resultAnimatedStyle]}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{config.emoji}</Text>
              </View>
              <Text style={styles.completionTitle}>{config.title}</Text>
              <Text style={styles.completionSubtitle}>{config.subtitle}</Text>
            </Animated.View>

            {/* Experiment Summary */}
            <View style={styles.experimentSummary}>
              <Text style={styles.experimentLabel}>Today's Experiment:</Text>
              <Text style={styles.experimentText}>{tip.summary}</Text>
            </View>

            {/* Result Message */}
            <View style={styles.messageContainer}>
              <Ionicons name={config.icon as any} size={24} color="#FFF" />
              <Text style={styles.message}>{config.message}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Card */}
        <Animated.View style={[styles.statsCard, statsAnimatedStyle]}>
          <Text style={styles.statsTitle}>Your Progress</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={24} color={config.color} />
              <Text style={styles.statNumber}>Day {currentStreak}</Text>
              <Text style={styles.statLabel}>Journey</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <TouchableOpacity style={styles.statItem} onPress={handleShowAllExperiments}>
              <Ionicons name="flask-outline" size={24} color={config.color} />
              <Text style={styles.statNumber}>{totalExperiments}</Text>
              <Text style={styles.statLabel}>Presented</Text>
              <View style={styles.tapIndicator}>
                <Ionicons name="chevron-forward" size={12} color={config.color} />
              </View>
            </TouchableOpacity>
            
            <View style={styles.statDivider} />
            
            <TouchableOpacity style={styles.statItem} onPress={handleShowTriedExperiments}>
              <Ionicons name="checkmark-circle-outline" size={24} color={config.color} />
              <Text style={styles.statNumber}>{successfulExperiments}</Text>
              <Text style={styles.statLabel}>Tried</Text>
              <View style={styles.tapIndicator}>
                <Ionicons name="chevron-forward" size={12} color={config.color} />
              </View>
            </TouchableOpacity>
            
            <View style={styles.statDivider} />
            
            <TouchableOpacity style={styles.statItem} onPress={handleShowLovedExperiments}>
              <Ionicons name="heart-outline" size={24} color={config.color} />
              <Text style={styles.statNumber}>
                {tipHistory.filter(({ dailyTip }) => 
                  dailyTip.evening_check_in === 'went_great' || 
                  dailyTip.quick_completions?.some(c => c.quick_note === 'worked_great')
                ).length}
              </Text>
              <Text style={styles.statLabel}>Loved</Text>
              <View style={styles.tapIndicator}>
                <Ionicons name="chevron-forward" size={12} color={config.color} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Motivational Quote */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>
              {feedback === 'went_great' 
                ? '"Success is the sum of small efforts repeated day in and day out."'
                : feedback === 'went_ok'
                ? '"Progress, not perfection."'
                : feedback === 'not_great'
                ? '"Every expert was once a beginner."'
                : '"Tomorrow is the first day of the rest of your life."'}
            </Text>
          </View>
        </Animated.View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={onGetNewTip}>
          <LinearGradient
            colors={['#F5F5F5', '#FFFFFF']}
            style={styles.actionButtonGradient}
          >
            <Text style={[styles.actionButtonText, { color: config.color }]}>
              See Tomorrow's Experiment
            </Text>
            <Ionicons name="arrow-forward" size={20} color={config.color} />
          </LinearGradient>
        </TouchableOpacity>

        {/* Reflection Prompt */}
        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionTitle}>Reflection</Text>
          <Text style={styles.reflectionText}>
            {feedback === 'went_great'
              ? 'What made this experiment work so well for you?'
              : feedback === 'went_ok'
              ? 'What would make this experiment easier next time?'
              : feedback === 'not_great'
              ? 'What did you learn from trying this experiment?'
              : 'What experiment are you most excited to try?'}
          </Text>
        </View>
      </ScrollView>

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
  },
  scrollContent: {
    paddingBottom: 100,
  },
  starsContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: '100%',
    zIndex: 10,
  },
  star: {
    position: 'absolute',
  },
  completionCard: {
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  gradientBackground: {
    padding: 24,
    alignItems: 'center',
  },
  ribbonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  ribbon: {
    height: '100%',
  },
  ribbonGradient: {
    flex: 1,
  },
  resultBadge: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emojiContainer: {
    marginBottom: 16,
  },
  emoji: {
    fontSize: 64,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  completionSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  experimentSummary: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  experimentLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  experimentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 22,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  message: {
    fontSize: 16,
    color: '#FFF',
    lineHeight: 22,
    flex: 1,
    textAlign: 'center',
  },
  statsCard: {
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  tapIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quoteContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionButton: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  reflectionCard: {
    margin: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
  },
  reflectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  reflectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});