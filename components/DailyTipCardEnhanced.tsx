

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tip } from '../types/tip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  tip: Tip;
  onResponse: (response: 'try_it' | 'maybe_later') => void;
  onNotForMe: () => void;
  reasons?: string[];
}

export default function DailyTipCardSwipe({ tip, onResponse, onNotForMe, reasons = [] }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const handleResponse = (response: 'try_it' | 'maybe_later') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onResponse(response);
  };
  
  const handleNotForMe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNotForMe();
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const navigateCard = (direction: number) => {
    const newIndex = currentPage + direction;
    if (newIndex >= 0 && newIndex < 3) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const getDifficultyLabel = (tier: number) => {
    const labels = ['Very Easy', 'Easy', 'Moderate', 'Challenging', 'Very Challenging'];
    return labels[tier - 1] || 'Easy';
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
    <View style={styles.pageContainer}>
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.cardGradient}
      >
        <View style={styles.badges}>
          <View style={[styles.badge, styles.timeBadge]}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.badgeText}>{getTimeLabel(tip.time_cost_enum)}</Text>
          </View>
          <View style={[styles.badge, styles.difficultyBadge]}>
            <Text style={[styles.badgeText, { color: '#2E7D32' }]}>{getDifficultyLabel(tip.difficulty_tier)}</Text>
          </View>
        </View>
        
        <Text style={styles.summaryTitle}>{tip.summary}</Text>
        
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
      </LinearGradient>
    </View>
  );

  const renderHowToCard = () => (
    <View style={styles.pageContainer}>
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.cardGradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>How To Do It</Text>
          
          <Text style={styles.detailsText}>{tip.details_md}</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="sunny-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Best Time</Text>
              <Text style={styles.infoValue}>
                {(tip.time_of_day ?? []).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ') || 'Any time'}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="cash-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Cost</Text>
              <Text style={styles.infoValue}>{tip.money_cost_enum ?? 'Free'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Where</Text>
              <Text style={styles.infoValue}>
                {(tip.location_tags ?? []).map(l => l.charAt(0).toUpperCase() + l.slice(1)).join(', ') || 'Anywhere'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  const renderBenefitsCard = () => (
    <View style={styles.pageContainer}>
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.cardGradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Why This Works</Text>
          
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsSectionTitle}>IMMEDIATE BENEFITS</Text>
            <View style={styles.benefitsBox}>
              <Text style={styles.benefitItem}>✓ Increases blood flow and oxygen to muscles</Text>
              <Text style={styles.benefitItem}>✓ Releases endorphins for natural energy boost</Text>
              <Text style={styles.benefitItem}>✓ Improves mental clarity and focus</Text>
            </View>
          </View>

          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsSectionTitle}>LONG-TERM IMPACT</Text>
            <View style={[styles.benefitsBox, styles.longTermBox]}>
              <Text style={[styles.benefitItem, styles.longTermItem]}>• Better posture throughout the day</Text>
              <Text style={[styles.benefitItem, styles.longTermItem]}>• Reduced risk of injury</Text>
              <Text style={[styles.benefitItem, styles.longTermItem]}>• Improved flexibility and range of motion</Text>
            </View>
          </View>

          {(tip.goal_tags ?? []).length > 0 && (
            <View style={styles.goalsSection}>
              <Text style={styles.goalsSectionTitle}>This helps with:</Text>
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
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );

  const pages = [
    { key: 'summary', render: renderSummaryCard },
    { key: 'howto', render: renderHowToCard },
    { key: 'benefits', render: renderBenefitsCard },
  ];

  const DotIndicator = ({ index }: { index: number }) => {
    const animatedDotStyle = useAnimatedStyle(() => {
      const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
      
      const width = interpolate(
        scrollX.value,
        inputRange,
        [8, 28, 8],
        Extrapolate.CLAMP
      );
      
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.4, 1, 0.4],
        Extrapolate.CLAMP
      );

      return {
        width,
        opacity,
      };
    });

    const labelOpacity = useAnimatedStyle(() => {
      const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
      
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0, 1, 0],
        Extrapolate.CLAMP
      );

      return { opacity };
    });

    const labels = ['Summary', 'How To', 'Benefits'];

    return (
      <View style={styles.step}>
        <Animated.View style={[styles.dot, animatedDotStyle]} />
        <Animated.Text style={[styles.stepLabel, labelOpacity]}>{labels[index]}</Animated.Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <Text style={styles.headerLabel}>TODAY'S WELLNESS TIP</Text>
        
        {/* Progress Indicator */}
        <View style={styles.progressSteps}>
          {pages.map((_, index) => (
            <DotIndicator key={index} index={index} />
          ))}
        </View>
      </View>

      {/* Scrollable Card Content Area */}
      <View style={styles.cardContainer}>
        <View style={styles.cardWrapper}>
          {/* Card Content */}
          <View style={styles.cardMask}>
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
              decelerationRate="fast"
              bounces={false}
              onMomentumScrollEnd={(event) => {
                const newPage = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                setCurrentPage(newPage);
              }}
            />
          </View>
          
          {/* Navigation Arrows */}
          {currentPage > 0 && (
            <TouchableOpacity 
              style={[styles.navArrow, styles.navArrowLeft]}
              onPress={() => navigateCard(-1)}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={22} color="#4CAF50" />
            </TouchableOpacity>
          )}
          
          {currentPage < pages.length - 1 && (
            <TouchableOpacity 
              style={[styles.navArrow, styles.navArrowRight]}
              onPress={() => navigateCard(1)}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={22} color="#4CAF50" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Fixed Action Buttons */}
      <LinearGradient
        colors={['#f8faf9', '#f5f8f6']}
        style={[styles.actionContainer, { paddingBottom: 24 + insets.bottom }]}
      >
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => handleResponse('try_it')}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark-circle" size={26} color="#FFF" />
          <Text style={styles.primaryActionText}>I'll Try It!</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={[styles.secondaryAction, styles.maybeButton]}
            onPress={() => handleResponse('maybe_later')}
            activeOpacity={0.8}
          >
            <Ionicons name="bookmark-outline" size={18} color="#FF9800" />
            <Text style={styles.maybeButtonText}>Maybe Later</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.secondaryAction, styles.skipButton]}
            onPress={handleNotForMe}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={18} color="#757575" />
            <Text style={styles.skipButtonText}>Not for Me</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faf9',
  },
  fixedHeader: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#f8faf9',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.03)',
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 16,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    minWidth: 8,
  },
  stepLabel: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 4,
  },
  cardContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  cardWrapper: {
    position: 'relative',
  },
  cardMask: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  pageContainer: {
    width: SCREEN_WIDTH - 40, // Account for margins
    paddingHorizontal: 0,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 20,
    minHeight: 300,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollContent: {
    paddingBottom: 10,
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  navArrowLeft: {
    left: -12,
    transform: [{ translateY: -22 }],
  },
  navArrowRight: {
    right: -12,
    transform: [{ translateY: -22 }],
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
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
  summaryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 30,
    marginBottom: 16,
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginBottom: 24,
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
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 12,
  },
  benefitsBox: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
  },
  longTermBox: {
    backgroundColor: '#FFF3E0',
  },
  benefitItem: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
    marginBottom: 8,
  },
  longTermItem: {
    color: '#E65100',
  },
  goalsSection: {
    marginTop: 16,
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
  actionContainer: {
    marginTop: 'auto',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.04,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    gap: 8,
    marginBottom: 14,
  },
  primaryActionText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  maybeButton: {
    backgroundColor: '#FFF3E0',
  },
  maybeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
  },
  skipButton: {
    backgroundColor: '#F5F5F5',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
});