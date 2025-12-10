import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
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
import { SimplifiedTip } from '../types/simplifiedTip';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  tip: SimplifiedTip;
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

  // Reset to first page when tip changes
  useEffect(() => {
    setPage(0);
    scrollX.value = 0;
    pagerRef.current?.scrollTo({ x: 0, y: 0, animated: false });
  }, [tip.tip_id]);

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
      '0-5min': '< 5 min',
      '5-15min': '5-15 min',
      '15-30min': '15-30 min',
      '30min+': '> 30 min',
    };
    return labels[time] ?? time;
  };

  // Get gradient colors based on tip area
  const getAreaGradient = (): [string, string] => {
    const gradients: Record<string, [string, string]> = {
      nutrition: ['#81C784', '#4CAF50'],
      fitness: ['#64B5F6', '#2196F3'],
      sleep: ['#9575CD', '#673AB7'],
      stress: ['#FFB74D', '#FF9800'],
      organization: ['#4DD0E1', '#00BCD4'],
      relationships: ['#F06292', '#E91E63'],
    };
    return gradients[tip.area] || ['#81C784', '#4CAF50'];
  };

  // Get area icon
  const getAreaIcon = (): keyof typeof Ionicons.glyphMap => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      nutrition: 'nutrition-outline',
      fitness: 'fitness-outline',
      sleep: 'moon-outline',
      stress: 'leaf-outline',
      organization: 'calendar-outline',
      relationships: 'heart-outline',
    };
    return icons[tip.area] || 'sparkles-outline';
  };

  const hasCoverImage = tip.media?.cover?.url;

  return (
    <Animated.View style={[styles.container, cardAnimatedStyle]}>
      <View
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
          {/* PAGE 1 — Visual Summary */}
          <View style={[styles.page, { width: cardWidth || SCREEN_WIDTH }]}>
            {hasCoverImage ? (
              <ImageBackground
                source={{ uri: tip.media!.cover!.url }}
                style={styles.heroBackground}
                imageStyle={styles.heroImage}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.heroOverlay}
                >
                  <View style={styles.heroContent}>
                    {/* Badges at top */}
                    <View style={styles.heroBadges}>
                      <View style={[styles.badge, styles.heroBadge]}>
                        <Ionicons name="time-outline" size={14} color="#FFF" />
                        <Text style={styles.heroBadgeText}>{getTimeLabel(tip.time)}</Text>
                      </View>
                      <View style={[styles.badge, styles.heroBadge]}>
                        <Text style={styles.heroBadgeText}>{getDifficultyLabel(tip.difficulty)}</Text>
                      </View>
                    </View>

                    {/* Title at bottom */}
                    <View style={styles.heroTitleContainer}>
                      <Text style={styles.heroLabel}>TODAY'S EXPERIMENT</Text>
                      <Text style={styles.heroTitle}>{tip.summary}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </ImageBackground>
            ) : (
              <LinearGradient
                colors={getAreaGradient()}
                style={styles.heroBackground}
              >
                <View style={styles.heroContent}>
                  {/* Area icon as visual element */}
                  <View style={styles.heroIconContainer}>
                    <Ionicons name={getAreaIcon()} size={64} color="rgba(255,255,255,0.3)" />
                  </View>

                  {/* Badges at top */}
                  <View style={styles.heroBadges}>
                    <View style={[styles.badge, styles.heroBadge]}>
                      <Ionicons name="time-outline" size={14} color="#FFF" />
                      <Text style={styles.heroBadgeText}>{getTimeLabel(tip.time)}</Text>
                    </View>
                    <View style={[styles.badge, styles.heroBadge]}>
                      <Text style={styles.heroBadgeText}>{getDifficultyLabel(tip.difficulty)}</Text>
                    </View>
                  </View>

                  {/* Title at bottom */}
                  <View style={styles.heroTitleContainer}>
                    <Text style={styles.heroLabel}>TODAY'S EXPERIMENT</Text>
                    <Text style={styles.heroTitle}>{tip.summary}</Text>
                  </View>
                </View>
              </LinearGradient>
            )}

            {/* Call to view details */}
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => goToPage(1)}
              accessibilityRole="button"
              accessibilityHint="Opens the how-to instructions"
            >
              <Text style={styles.expandButtonText}>Learn More</Text>
              <Ionicons name="chevron-forward" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          {/* PAGE 2 — Details */}
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
                <Text style={styles.backBtnText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.detailsTitle}>{tip.summary}</Text>
            </View>

            <ScrollView
              style={{ maxHeight: DETAILS_MAX_HEIGHT }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {/* Short description moved here */}
              {tip.short_description && (
                <Text style={styles.shortDescription}>{tip.short_description}</Text>
              )}

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

              {/* How to do it section */}
              <View style={styles.howToSection}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="construct-outline" size={18} color="#4CAF50" />
                  <Text style={styles.sectionTitle}>How to do it</Text>
                </View>
                <Text style={styles.detailsText}>{tip.details_md}</Text>
              </View>

              {/* Additional Info */}
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Ionicons name="sunny-outline" size={20} color="#666" />
                  <Text style={styles.infoLabel}>When</Text>
                  <Text style={styles.infoValue}>
                    {(tip.when || [])
                      .slice(0, 2)
                      .map((t) => t.replace(/_/g, ' ').charAt(0).toUpperCase() + t.replace(/_/g, ' ').slice(1))
                      .join(', ')}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <Ionicons name="cash-outline" size={20} color="#666" />
                  <Text style={styles.infoLabel}>Cost</Text>
                  <Text style={styles.infoValue}>{tip.cost}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                  <Text style={styles.infoLabel}>Where</Text>
                  <Text style={styles.infoValue}>
                    {(tip.where || [])
                      .slice(0, 2)
                      .map((l) => l.charAt(0).toUpperCase() + l.slice(1))
                      .join(', ')}
                  </Text>
                </View>
              </View>

              {/* Goals this helps with */}
              <View style={styles.goalsSection}>
                <Text style={styles.goalsSectionTitle}>This helps with:</Text>
                <View style={styles.goalsGrid}>
                  {(tip.goals || []).map((goal) => (
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
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { margin: 16 },
  card: {
    borderRadius: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  page: {},

  // Hero styles for PAGE 1
  heroBackground: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    margin: 12,
  },
  heroImage: {
    borderRadius: 16,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  heroIconContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  heroBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroBadgeText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  heroTitleContainer: {
    marginTop: 'auto',
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    lineHeight: 28,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  expandButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CAF50',
  },

  // Details page styles (PAGE 2)
  detailsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    flex: 1,
  },

  shortDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  reasonText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },

  howToSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#424242',
  },
  detailsText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 22,
  },

  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
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
    textAlign: 'center',
  },

  goalsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
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
    paddingVertical: 5,
    borderRadius: 8,
  },
  goalChipText: {
    fontSize: 11,
    color: '#E65100',
    fontWeight: '500',
  },

  pagerDots: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C8E6C9',
  },

  responseContainer: {
    padding: 16,
    paddingTop: 8,
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
});
