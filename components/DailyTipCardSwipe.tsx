import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Tip } from '../types/tip';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  tip: Tip;
  onResponse: (response: 'try_it' | 'not_for_me' | 'maybe_later') => void;
  onNotForMe?: () => void; // Separate callback for opening feedback modal
  reasons?: string[];
}

export default function DailyTipCardSwipe({ tip, onResponse, onNotForMe, reasons = [] }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const flatListRef = useRef<FlatList>(null);

  const handleResponse = (response: 'try_it' | 'not_for_me' | 'maybe_later') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // For 'not_for_me', use the separate callback if provided
    if (response === 'not_for_me' && onNotForMe) {
      cardScale.value = withSpring(0.95, {}, () => {
        cardScale.value = withSpring(1);
        runOnJS(onNotForMe)();
      });
    } else {
      cardScale.value = withSpring(0.95, {}, () => {
        cardScale.value = withSpring(1);
        runOnJS(onResponse)(response);
      });
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleSwipeToDetails = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flatListRef.current?.scrollToIndex({ index: 1, animated: true });
  };

  const handleBackToSummary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const getDifficultyLabel = (tier: number) => {
    const labels = ['Very Easy', 'Easy', 'Moderate', 'Challenging', 'Very Challenging'];
    return labels[tier - 1];
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

  const renderSummaryCard = () => (
    <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FBF8']}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.label}>TODAY'S EXPERIMENT</Text>
            <View style={styles.badges}>
              <View style={[styles.badge, styles.timeBadge]}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.badgeText}>{getTimeLabel(tip.time_cost_enum)}</Text>
              </View>
              <View style={[styles.badge, styles.difficultyBadge]}>
                <Text style={styles.badgeText}>{getDifficultyLabel(tip.difficulty_tier)}</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.summary}>{tip.summary}</Text>
          
          {reasons.length > 0 && (
            <View style={styles.reasonsContainer}>
              {reasons.map((reason, index) => (
                <View key={index} style={styles.reasonChip}>
                  <Ionicons name="sparkles" size={12} color="#4CAF50" />
                  <Text style={styles.reasonText}>{reason}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.expandButton} 
          onPress={handleSwipeToDetails}
          activeOpacity={0.7}
        >
          <Text style={styles.expandButtonText}>See How To Do It</Text>
          <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
        </TouchableOpacity>

        <View style={styles.responseContainer}>
          <TouchableOpacity
            style={[styles.responseButton, styles.tryButton]}
            onPress={() => handleResponse('try_it')}
          >
            <Ionicons name="checkmark-circle" size={24} color="#FFF" />
            <Text style={styles.tryButtonText}>I'll Try It!</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryButtons}>
            <TouchableOpacity
              style={[styles.responseButton, styles.maybeButton]}
              onPress={() => handleResponse('maybe_later')}
            >
              <Ionicons name="bookmark-outline" size={20} color="#FF9800" />
              <Text style={styles.maybeButtonText}>Maybe Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.responseButton, styles.skipButton]}
              onPress={() => handleResponse('not_for_me')}
            >
              <Ionicons name="close-circle-outline" size={20} color="#757575" />
              <Text style={styles.skipButtonText}>Not for Me</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderDetailsCard = () => (
    <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FBF8']}
        style={styles.card}
      >
        <View style={styles.detailsHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToSummary}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color="#4CAF50" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailsTitle}>How To Do It</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView 
          style={styles.detailsScrollView}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.detailsText}>{tip.details_md}</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="restaurant-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Best Time</Text>
              <Text style={styles.infoValue}>
                {(tip.time_of_day ?? []).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ') || 'Any time'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="cash-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Cost</Text>
              <Text style={styles.infoValue}>{tip.money_cost_enum ?? '$'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Where</Text>
              <Text style={styles.infoValue}>
                {(tip.location_tags ?? []).map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ') || 'Anywhere'}
              </Text>
            </View>
          </View>
          
          <View style={styles.goalsSection}>
            <Text style={styles.goalsSectionTitle}>This helps with:</Text>
            <View style={styles.goalsGrid}>
              {(tip.goal_tags ?? []).map(goal => (
                <View key={goal} style={styles.goalChip}>
                  <Text style={styles.goalChipText}>
                    {goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.responseContainer}>
          <TouchableOpacity
            style={[styles.responseButton, styles.tryButton]}
            onPress={() => handleResponse('try_it')}
          >
            <Ionicons name="rocket" size={24} color="#FFF" />
            <Text style={styles.tryButtonText}>Start Now!</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryButtons}>
            <TouchableOpacity
              style={[styles.responseButton, styles.maybeButton]}
              onPress={() => handleResponse('maybe_later')}
            >
              <Ionicons name="bookmark-outline" size={20} color="#FF9800" />
              <Text style={styles.maybeButtonText}>Save for Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.responseButton, styles.skipButton]}
              onPress={() => handleResponse('not_for_me')}
            >
              <Ionicons name="close-circle-outline" size={20} color="#757575" />
              <Text style={styles.skipButtonText}>Skip This</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const pages = [
    { key: 'summary', render: renderSummaryCard },
    { key: 'details', render: renderDetailsCard },
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
    <Animated.View style={[styles.container, cardAnimatedStyle]}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  pageContainer: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
    letterSpacing: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  timeBadge: {
    backgroundColor: '#F5F5F5',
  },
  difficultyBadge: {
    backgroundColor: '#E8F5E9',
  },
  badgeText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  summary: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 28,
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reasonText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '500',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  detailsHeader: {
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
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  detailsScrollView: {
    flex: 1,
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: '#757575',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 12,
    color: '#424242',
    fontWeight: '600',
    marginTop: 2,
  },
  goalsSection: {
    marginTop: 16,
    marginBottom: 20,
  },
  goalsSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 8,
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
  responseContainer: {
    marginTop: 20,
    gap: 12,
  },
  responseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  tryButton: {
    backgroundColor: '#4CAF50',
  },
  tryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  maybeButton: {
    flex: 1,
    backgroundColor: '#FFF3E0',
  },
  maybeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
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