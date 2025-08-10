import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Tip } from '../types/tip';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  tip: Tip;
  onResponse: (response: 'try_it' | 'not_interested' | 'maybe_later') => void;
  reasons?: string[];
}

export default function DailyTipCardPager({ tip, onResponse, reasons = [] }: Props) {
  // Animations
  const cardScale = useSharedValue(1);
  const scrollX = useSharedValue(0);

  // Layout
  const [cardWidth, setCardWidth] = useState(0);
  const pagerRef = useAnimatedRef<Animated.ScrollView>();
  const [page, setPage] = useState(0);

  const DETAILS_MAX_HEIGHT = Math.min(420, SCREEN_HEIGHT * 0.55);

  const handleResponse = (response: 'try_it' | 'not_interested' | 'maybe_later') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    cardScale.value = withSpring(0.95, {}, () => {
      cardScale.value = withSpring(1);
      runOnJS(onResponse)(response);
    });
  };

  const goToPage = (idx: number) => {
    if (!cardWidth) return;
    Haptics.selectionAsync();
    scrollTo(pagerRef, idx * cardWidth, 0, true);
  };

  const onHorizontalScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
    onMomentumEnd: (e) => {
      const w = cardWidth || 1;
      const idx = Math.round(e.contentOffset.x / w);
      if (idx !== page) {
        runOnJS(setPage)(idx);
        runOnJS(() => Haptics.selectionAsync());
      }
    },
  });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const dot1Style = useAnimatedStyle(() => {
    const w = cardWidth || SCREEN_WIDTH;
    const s = interpolate(scrollX.value, [-w, 0, w], [0.9, 1.2, 0.9], Extrapolate.CLAMP);
    const o = interpolate(scrollX.value, [-w, 0, w], [0.5, 1, 0.5], Extrapolate.CLAMP);
    return { transform: [{ scale: s }], opacity: o };
  });

  const dot2Style = useAnimatedStyle(() => {
    const w = cardWidth || SCREEN_WIDTH;
    const s = interpolate(scrollX.value, [0, w, 2 * w], [0.9, 1.2, 0.9], Extrapolate.CLAMP);
    const o = interpolate(scrollX.value, [0, w, 2 * w], [0.5, 1, 0.5], Extrapolate.CLAMP);
    return { transform: [{ scale: s }], opacity: o };
  });

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
    return labels[time] ?? time;
  };

  return (
    <Animated.View style={[styles.container, cardAnimatedStyle]}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FBF8']}
        style={styles.card}
        onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
      >
        {/* Pager */}
        <Animated.ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces
          decelerationRate="fast"
          onScroll={onHorizontalScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ alignItems: 'stretch' }}
        >
          {/* PAGE 1 — Summary */}
          <View style={[styles.page, { width: cardWidth || SCREEN_WIDTH }]}>
            {/* Header */}
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

              {/* Reasons why this tip was chosen */}
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

            {/* Call to view details */}
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => goToPage(1)}
              accessibilityRole="button"
              accessibilityHint="Opens the how-to instructions"
            >
              <Text style={styles.expandButtonText}>See How To Do It</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {/* PAGE 2 — How-to / Details */}
          <View style={[styles.page, { width: cardWidth || SCREEN_WIDTH }]}>
            {/* Back to summary */}
            <View style={styles.detailsHeaderRow}>
              <TouchableOpacity
                onPress={() => goToPage(0)}
                style={styles.backBtn}
                accessibilityRole="button"
                accessibilityLabel="Back to summary"
              >
                <Ionicons name="chevron-back" size={20} color="#4CAF50" />
                <Text style={styles.backBtnText}>Summary</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <Ionicons name="construct-outline" size={18} color="#666" />
                <Text style={styles.detailsTitle}>How to do it</Text>
              </View>
            </View>

            <ScrollView
              style={{ maxHeight: DETAILS_MAX_HEIGHT }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              <Text style={styles.detailsText}>{tip.details_md}</Text>

              {/* Additional Info */}
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Ionicons name="restaurant-outline" size={20} color="#666" />
                  <Text style={styles.infoLabel}>Best Time</Text>
                  <Text style={styles.infoValue}>
                    {tip.time_of_day
                      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
                      .join(', ')}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Ionicons name="cash-outline" size={20} color="#666" />
                  <Text style={styles.infoLabel}>Cost</Text>
                  <Text style={styles.infoValue}>{tip.money_cost_enum}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                  <Text style={styles.infoLabel}>Where</Text>
                  <Text style={styles.infoValue}>
                    {tip.location_tags
                      .map((l) => l.charAt(0).toUpperCase() + l.slice(1))
                      .join(', ')}
                  </Text>
                </View>
              </View>

              {/* Goals this helps with */}
              <View style={styles.goalsSection}>
                <Text style={styles.goalsSectionTitle}>This helps with:</Text>
                <View style={styles.goalsGrid}>
                  {tip.goal_tags.map((goal) => (
                    <View key={goal} style={styles.goalChip}>
                      <Text style={styles.goalChipText}>
                        {goal.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </Animated.ScrollView>

        {/* Pager dots */}
        <View style={styles.pagerDots}>
          <Animated.View style={[styles.dot, dot1Style]} />
          <Animated.View style={[styles.dot, dot2Style]} />
        </View>

        {/* Response Buttons (show on both pages) */}
        <View style={styles.responseContainer}>
          <TouchableOpacity
            style={[styles.responseButton, styles.tryButton]}
            onPress={() => handleResponse('try_it')}
          >
            <Ionicons name="checkmark-circle" size={24} color="#FFF" />
            <Text style={styles.tryButtonText}>
              {page === 0 ? "I'll Try It!" : 'Start Now'}
            </Text>
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
              onPress={() => handleResponse('not_interested')}
            >
              <Ionicons name="close-circle-outline" size={20} color="#757575" />
              <Text style={styles.skipButtonText}>Not for Me</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { margin: 16 },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  page: { },
  header: { marginBottom: 16 },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  label: { fontSize: 12, fontWeight: '700', color: '#4CAF50', letterSpacing: 1 },
  badges: { flexDirection: 'row', gap: 8 },
  badge: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4,
  },
  timeBadge: { backgroundColor: '#F5F5F5' },
  difficultyBadge: { backgroundColor: '#E8F5E9' },
  badgeText: { fontSize: 11, color: '#666', fontWeight: '600' },
  summary: { fontSize: 20, fontWeight: '700', color: '#212121', lineHeight: 28 },

  reasonsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 },
  reasonChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4,
  },
  reasonText: { fontSize: 11, color: '#2E7D32', fontWeight: '500' },

  expandButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 8,
  },
  expandButtonText: { fontSize: 14, fontWeight: '600', color: '#4CAF50' },

  detailsHeaderRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingRight: 8 },
  backBtnText: { fontSize: 13, fontWeight: '600', color: '#4CAF50' },
  detailsTitle: { fontSize: 14, fontWeight: '700', color: '#424242' },

  detailsText: { fontSize: 15, color: '#424242', lineHeight: 22, marginBottom: 20 },

  infoGrid: {
    flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20, paddingVertical: 16,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E0E0E0',
  },
  infoItem: { alignItems: 'center' },
  infoLabel: { fontSize: 11, color: '#757575', marginTop: 4 },
  infoValue: { fontSize: 12, color: '#424242', fontWeight: '600', marginTop: 2 },

  goalsSection: { marginTop: 16 },
  goalsSectionTitle: { fontSize: 12, fontWeight: '600', color: '#757575', marginBottom: 8 },
  goalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goalChip: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  goalChipText: { fontSize: 11, color: '#E65100', fontWeight: '500' },

  pagerDots: { flexDirection: 'row', alignSelf: 'center', gap: 8, marginTop: 10 },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#C8E6C9',
  },

  responseContainer: { marginTop: 16, gap: 12 },
  responseButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8,
  },
  tryButton: { backgroundColor: '#4CAF50' },
  tryButtonText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  secondaryButtons: { flexDirection: 'row', gap: 12 },
  maybeButton: { flex: 1, backgroundColor: '#FFF3E0' },
  maybeButtonText: { fontSize: 14, fontWeight: '600', color: '#FF9800' },
  skipButton: { flex: 1, backgroundColor: '#F5F5F5' },
  skipButtonText: { fontSize: 14, fontWeight: '600', color: '#757575' },
});
