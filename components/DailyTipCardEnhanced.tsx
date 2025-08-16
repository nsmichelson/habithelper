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
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Tip } from '../types/tip';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  tip: Tip;
  onResponse: (response: 'try_it' | 'maybe_later') => void;
  onNotForMe: () => void;
  reasons?: string[];
  userGoals?: string[]; // User's selected goals from profile
}

// Icon mapping for goals
const GOAL_ICONS: Record<string, { icon: string; color: string }> = {
  weight_loss: { icon: 'scale-bathroom', color: '#FF6B6B' },
  muscle_gain: { icon: 'dumbbell', color: '#4ECDC4' },
  reduce_sugar: { icon: 'candy-outline', color: '#FFB347' },
  improve_hydration: { icon: 'water', color: '#4FC3F7' },
  better_lipids: { icon: 'heart-pulse', color: '#FF5252' },
  less_processed_food: { icon: 'leaf', color: '#66BB6A' },
  increase_veggies: { icon: 'carrot', color: '#FF7043' },
  plant_based: { icon: 'sprout', color: '#81C784' },
  improve_energy: { icon: 'lightning-bolt', color: '#FFD54F' },
  improve_gut_health: { icon: 'stomach', color: '#BA68C8' },
};

// Sample science facts (in real app, these would come from tip data)
const getScienceFacts = (tip: Tip): { emoji: string; fact: string }[] => {
  // This would ideally be part of the tip data structure
  // For now, generating based on tip characteristics
  const facts = [];
  
  if (tip.goal_tags.includes('reduce_sugar')) {
    facts.push(
      { emoji: '📊', fact: 'Reduces blood sugar spikes by 40%' },
      { emoji: '🧠', fact: 'Improves focus within 2 hours' }
    );
  }
  
  if (tip.goal_tags.includes('improve_energy')) {
    facts.push(
      { emoji: '⚡', fact: 'Boosts energy levels naturally' },
      { emoji: '😴', fact: 'Better sleep quality at night' }
    );
  }
  
  if (tip.goal_tags.includes('weight_loss')) {
    facts.push(
      { emoji: '🔥', fact: 'Burns extra 50-100 calories' },
      { emoji: '📉', fact: 'Reduces cravings by 30%' }
    );
  }
  
  // Default facts if none match
  if (facts.length === 0) {
    facts.push(
      { emoji: '✅', fact: '87% success rate in studies' },
      { emoji: '⏱️', fact: 'Results visible in 3-5 days' }
    );
  }
  
  return facts;
};

// Difficulty variations (would come from backend)
const getDifficultyVariations = (tip: Tip) => {
  return {
    easier: {
      summary: tip.summary.replace('every day', 'twice a week'),
      details: "Start slow! Try this just twice this week and build from there.",
      time: '2 min',
      difficulty: 1,
    },
    harder: {
      summary: tip.summary.replace('one', 'three'),
      details: "Ready for a challenge? Do this 3 times today and track how you feel!",
      time: '15 min',
      difficulty: 3,
    }
  };
};

export default function DailyTipCardEnhanced({ 
  tip, 
  onResponse, 
  onNotForMe, 
  reasons = [],
  userGoals = []
}: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easier' | 'standard' | 'harder'>('standard');
  const scrollX = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const flatListRef = useRef<FlatList>(null);
  
  const scienceFacts = getScienceFacts(tip);
  const variations = getDifficultyVariations(tip);
  const relevantGoals = tip.goal_tags.filter(g => userGoals.includes(g));

  const handleResponse = (response: 'try_it' | 'maybe_later') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    cardScale.value = withSpring(0.95, {}, () => {
      cardScale.value = withSpring(1);
      runOnJS(onResponse)(response);
    });
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

  const handleSwipeToNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const nextIndex = Math.min(currentPage + 1, pages.length - 1);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const handleSwipeToPrev = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const prevIndex = Math.max(currentPage - 1, 0);
    flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
  };

  const handleDifficultySelect = (level: 'easier' | 'harder') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedDifficulty(level);
    // Scroll to the variation card
    flatListRef.current?.scrollToIndex({ index: 5, animated: true });
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  // Card 1: What it is
  const renderWhatItIsCard = () => (
    <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
      <LinearGradient
        colors={['#FFFFFF', '#F0FFF4']}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardBadge}>
            <Ionicons name="sparkles" size={16} color="#4CAF50" />
            <Text style={styles.cardBadgeText}>TODAY'S EXPERIMENT</Text>
          </View>
          <Text style={styles.cardNumber}>1 of 5</Text>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>What it is</Text>
          
          <View style={styles.tipHighlight}>
            <Text style={styles.tipSummary}>{tip.summary}</Text>
          </View>
          
          <View style={styles.quickInfoGrid}>
            <View style={styles.quickInfoItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.quickInfoLabel}>Time</Text>
              <Text style={styles.quickInfoValue}>
                {tip.time_cost_enum.replace('_', '-').replace('min', ' min')}
              </Text>
            </View>
            
            <View style={styles.quickInfoItem}>
              <Ionicons name="speedometer-outline" size={20} color="#666" />
              <Text style={styles.quickInfoLabel}>Difficulty</Text>
              <View style={styles.difficultyDots}>
                {[1, 2, 3, 4, 5].map(i => (
                  <View 
                    key={i}
                    style={[
                      styles.difficultyDot,
                      i <= tip.difficulty_tier && styles.difficultyDotActive
                    ]}
                  />
                ))}
              </View>
            </View>
            
            <View style={styles.quickInfoItem}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.quickInfoLabel}>Where</Text>
              <Text style={styles.quickInfoValue}>
                {tip.location_tags?.[0] || 'Anywhere'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Quick action buttons for those ready to go */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={[styles.quickActionButton, styles.quickTryButton]}
            onPress={() => handleResponse('try_it')}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFF" />
            <Text style={styles.quickTryButtonText}>I'll Try It!</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.learnMoreButton}
            onPress={handleSwipeToNext}
            activeOpacity={0.7}
          >
            <Text style={styles.learnMoreButtonText}>Learn more</Text>
            <Ionicons name="arrow-forward" size={18} color="#4CAF50" />
          </TouchableOpacity>
          
          <View style={styles.quickSecondaryButtons}>
            <TouchableOpacity
              style={[styles.quickActionButton, styles.quickMaybeButton]}
              onPress={() => handleResponse('maybe_later')}
              activeOpacity={0.7}
            >
              <Ionicons name="bookmark-outline" size={18} color="#FF9800" />
              <Text style={styles.quickMaybeButtonText}>Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionButton, styles.quickSkipButton]}
              onPress={handleNotForMe}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle-outline" size={18} color="#757575" />
              <Text style={styles.quickSkipButtonText}>Not for me</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  // Card 2: Why it matters for YOUR goals
  const renderWhyItMattersCard = () => (
    <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
      <LinearGradient
        colors={['#FFFFFF', '#FFF8E1']}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.cardBadge, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="trophy" size={16} color="#FF9800" />
            <Text style={[styles.cardBadgeText, { color: '#FF9800' }]}>YOUR GOALS</Text>
          </View>
          <Text style={styles.cardNumber}>2 of 5</Text>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Why this works for you</Text>
          
          <View style={styles.goalsContainer}>
            {relevantGoals.length > 0 ? (
              relevantGoals.map(goal => {
                const goalInfo = GOAL_ICONS[goal] || { icon: 'flag', color: '#666' };
                const goalLabel = goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                return (
                  <View key={goal} style={styles.goalItem}>
                    <View style={[styles.goalIcon, { backgroundColor: `${goalInfo.color}20` }]}>
                      <MaterialCommunityIcons 
                        name={goalInfo.icon as any} 
                        size={24} 
                        color={goalInfo.color} 
                      />
                    </View>
                    <View style={styles.goalTextContainer}>
                      <Text style={styles.goalTitle}>{goalLabel}</Text>
                      <Text style={styles.goalDescription}>
                        This directly supports this goal
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.generalBenefit}>
                <Text style={styles.generalBenefitText}>
                  This experiment helps build healthier habits gradually and sustainably
                </Text>
              </View>
            )}
          </View>
          
          {reasons.length > 0 && (
            <View style={styles.personalizedReasons}>
              <Text style={styles.personalizedTitle}>Picked for you because:</Text>
              {reasons.slice(0, 3).map((reason, idx) => (
                <View key={idx} style={styles.reasonChip}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.reasonChipText}>{reason}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.prevButton}
            onPress={handleSwipeToPrev}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleSwipeToNext}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>See the science</Text>
            <Ionicons name="arrow-forward" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  // Card 3: The Science
  const renderScienceCard = () => (
    <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
      <LinearGradient
        colors={['#FFFFFF', '#F3E5F5']}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.cardBadge, { backgroundColor: '#F3E5F5' }]}>
            <MaterialCommunityIcons name="flask" size={16} color="#9C27B0" />
            <Text style={[styles.cardBadgeText, { color: '#9C27B0' }]}>THE SCIENCE</Text>
          </View>
          <Text style={styles.cardNumber}>3 of 5</Text>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Why it actually works</Text>
          
          <View style={styles.scienceContainer}>
            {scienceFacts.map((fact, idx) => (
              <View key={idx} style={styles.scienceFact}>
                <View style={styles.scienceFactIcon}>
                  <Text style={styles.scienceFactEmoji}>{fact.emoji}</Text>
                </View>
                <Text style={styles.scienceFactText}>{fact.fact}</Text>
              </View>
            ))}
            
            <View style={styles.studyCard}>
              <View style={styles.studyHeader}>
                <MaterialCommunityIcons name="school" size={20} color="#7B1FA2" />
                <Text style={styles.studyTitle}>Research shows</Text>
              </View>
              <Text style={styles.studyText}>
                Small, consistent changes like this are 3x more likely to become lasting habits than dramatic changes
              </Text>
            </View>
            
            <View style={styles.trustIndicator}>
              <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
              <Text style={styles.trustText}>Reviewed by registered dietitians</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.prevButton}
            onPress={handleSwipeToPrev}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleSwipeToNext}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>How to do it</Text>
            <Ionicons name="arrow-forward" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  // Card 4: How to do it
  const renderHowToCard = () => (
    <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
      <LinearGradient
        colors={['#FFFFFF', '#E8F5E9']}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.cardBadge, { backgroundColor: '#E8F5E9' }]}>
            <MaterialCommunityIcons name="rocket-launch" size={16} color="#4CAF50" />
            <Text style={[styles.cardBadgeText, { color: '#4CAF50' }]}>HOW TO</Text>
          </View>
          <Text style={styles.cardNumber}>4 of 5</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollableContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.cardTitle}>Your action plan</Text>
          
          <View style={styles.stepsContainer}>
            <Text style={styles.detailsText}>{tip.details_md}</Text>
          </View>
          
          <View style={styles.difficultyOptions}>
            <Text style={styles.difficultyTitle}>Want to adjust the challenge?</Text>
            
            <TouchableOpacity 
              style={styles.difficultyButton}
              onPress={() => handleDifficultySelect('easier')}
              activeOpacity={0.7}
            >
              <View style={styles.difficultyButtonContent}>
                <MaterialCommunityIcons name="baby-carriage" size={24} color="#2196F3" />
                <View style={styles.difficultyTextContainer}>
                  <Text style={styles.difficultyButtonTitle}>Make it easier</Text>
                  <Text style={styles.difficultyButtonSubtitle}>Start gentle</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#2196F3" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.difficultyButton}
              onPress={() => handleDifficultySelect('harder')}
              activeOpacity={0.7}
            >
              <View style={styles.difficultyButtonContent}>
                <MaterialCommunityIcons name="fire" size={24} color="#FF5722" />
                <View style={styles.difficultyTextContainer}>
                  <Text style={styles.difficultyButtonTitle}>Level it up</Text>
                  <Text style={styles.difficultyButtonSubtitle}>Ready for more</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#FF5722" />
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={styles.prevButton}
            onPress={handleSwipeToPrev}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={18} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleSwipeToNext}
            activeOpacity={0.7}
          >
            <Text style={styles.nextButtonText}>Ready to try?</Text>
            <Ionicons name="arrow-forward" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  // Card 5: Decision Card
  const renderDecisionCard = () => (
    <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FBF8']}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardBadge}>
            <Ionicons name="flag" size={16} color="#4CAF50" />
            <Text style={styles.cardBadgeText}>DECISION TIME</Text>
          </View>
          <Text style={styles.cardNumber}>5 of 5</Text>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Ready to experiment?</Text>
          
          <View style={styles.summaryRecap}>
            <Text style={styles.recapTitle}>{tip.summary}</Text>
            <View style={styles.recapStats}>
              <View style={styles.recapStat}>
                <Ionicons name="time" size={16} color="#666" />
                <Text style={styles.recapStatText}>
                  {tip.time_cost_enum.replace('_', '-').replace('min', ' min')}
                </Text>
              </View>
              <View style={styles.recapStat}>
                <Ionicons name="trending-up" size={16} color="#666" />
                <Text style={styles.recapStatText}>
                  {relevantGoals.length} goals supported
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.decisionButtons}>
            <TouchableOpacity
              style={[styles.responseButton, styles.tryButton]}
              onPress={() => handleResponse('try_it')}
              activeOpacity={0.7}
            >
              <Ionicons name="rocket" size={24} color="#FFF" />
              <Text style={styles.tryButtonText}>I'll Try It!</Text>
              <Text style={styles.tryButtonSubtext}>Let's do this experiment</Text>
            </TouchableOpacity>
            
            <View style={styles.secondaryButtons}>
              <TouchableOpacity
                style={[styles.responseButton, styles.maybeButton]}
                onPress={() => handleResponse('maybe_later')}
                activeOpacity={0.7}
              >
                <Ionicons name="bookmark-outline" size={20} color="#FF9800" />
                <Text style={styles.maybeButtonText}>Maybe Later</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.responseButton, styles.skipButton]}
                onPress={handleNotForMe}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={20} color="#757575" />
                <Text style={styles.skipButtonText}>Not for Me</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.prevButton}
          onPress={handleSwipeToPrev}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color="#666" />
          <Text style={styles.prevButtonText}>Back to details</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  // Card 6: Difficulty Variation (shown when user selects easier/harder)
  const renderVariationCard = () => {
    const variation = selectedDifficulty === 'easier' ? variations.easier : variations.harder;
    const isEasier = selectedDifficulty === 'easier';
    
    return (
      <View style={[styles.pageContainer, { width: SCREEN_WIDTH }]}>
        <LinearGradient
          colors={isEasier ? ['#FFFFFF', '#E3F2FD'] : ['#FFFFFF', '#FFF3E0']}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardBadge, { 
              backgroundColor: isEasier ? '#E3F2FD' : '#FFF3E0' 
            }]}>
              <MaterialCommunityIcons 
                name={isEasier ? 'baby-carriage' : 'fire'} 
                size={16} 
                color={isEasier ? '#2196F3' : '#FF5722'} 
              />
              <Text style={[styles.cardBadgeText, { 
                color: isEasier ? '#2196F3' : '#FF5722' 
              }]}>
                {isEasier ? 'EASIER VERSION' : 'LEVELED UP'}
              </Text>
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              {isEasier ? 'Starting gentle' : 'Challenge accepted!'}
            </Text>
            
            <View style={styles.variationContent}>
              <Text style={styles.variationSummary}>{variation.summary}</Text>
              <Text style={styles.variationDetails}>{variation.details}</Text>
              
              <View style={styles.variationStats}>
                <View style={styles.variationStat}>
                  <Ionicons name="time-outline" size={20} color="#666" />
                  <Text style={styles.variationStatText}>{variation.time}</Text>
                </View>
                <View style={styles.variationStat}>
                  <Ionicons name="speedometer-outline" size={20} color="#666" />
                  <View style={styles.difficultyDots}>
                    {[1, 2, 3].map(i => (
                      <View 
                        key={i}
                        style={[
                          styles.difficultyDot,
                          i <= variation.difficulty && styles.difficultyDotActive
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.responseButton, styles.tryButton]}
              onPress={() => handleResponse('try_it')}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle" size={24} color="#FFF" />
              <Text style={styles.tryButtonText}>Try this version!</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backToStandardButton}
              onPress={() => {
                setSelectedDifficulty('standard');
                flatListRef.current?.scrollToIndex({ index: 4, animated: true });
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.backToStandardText}>Back to standard version</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const pages = [
    { key: 'what', render: renderWhatItIsCard },
    { key: 'why', render: renderWhyItMattersCard },
    { key: 'science', render: renderScienceCard },
    { key: 'how', render: renderHowToCard },
    { key: 'decision', render: renderDecisionCard },
    { key: 'variation', render: renderVariationCard },
  ];

  const DotIndicator = ({ index }: { index: number }) => {
    const animatedDotStyle = useAnimatedStyle(() => {
      const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
      
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1.4, 0.8],
        Extrapolate.CLAMP
      );
      
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.3, 1, 0.3],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    // Don't show dot for variation card
    if (index === 5) return null;

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
        {pages.slice(0, 5).map((_, index) => (
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
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    minHeight: 500,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4CAF50',
    letterSpacing: 0.5,
  },
  cardNumber: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  
  // What it is card styles
  tipHighlight: {
    backgroundColor: '#F0FFF4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  tipSummary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    lineHeight: 26,
  },
  quickInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  quickInfoItem: {
    alignItems: 'center',
  },
  quickInfoLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  quickInfoValue: {
    fontSize: 13,
    color: '#424242',
    fontWeight: '600',
    marginTop: 2,
  },
  difficultyDots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
  },
  difficultyDotActive: {
    backgroundColor: '#4CAF50',
  },
  
  // Why it matters card styles
  goalsContainer: {
    marginBottom: 20,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  goalDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  generalBenefit: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
  },
  generalBenefitText: {
    fontSize: 15,
    color: '#F57C00',
    lineHeight: 22,
    textAlign: 'center',
  },
  personalizedReasons: {
    marginTop: 20,
  },
  personalizedTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    gap: 6,
  },
  reasonChipText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },
  
  // Science card styles
  scienceContainer: {
    marginTop: 10,
  },
  scienceFact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scienceFactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scienceFactEmoji: {
    fontSize: 20,
  },
  scienceFactText: {
    flex: 1,
    fontSize: 15,
    color: '#424242',
    fontWeight: '500',
  },
  studyCard: {
    backgroundColor: '#F3E5F5',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  studyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  studyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7B1FA2',
  },
  studyText: {
    fontSize: 14,
    color: '#4A148C',
    lineHeight: 20,
  },
  trustIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  trustText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  
  // How to card styles
  scrollableContent: {
    flex: 1,
    marginBottom: 70,
  },
  stepsContainer: {
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 24,
  },
  difficultyOptions: {
    marginTop: 20,
  },
  difficultyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 12,
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  difficultyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  difficultyTextContainer: {
    flex: 1,
  },
  difficultyButtonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  difficultyButtonSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  
  // Decision card styles
  summaryRecap: {
    backgroundColor: '#F8FBF8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  recapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 12,
  },
  recapStats: {
    flexDirection: 'row',
    gap: 20,
  },
  recapStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recapStatText: {
    fontSize: 13,
    color: '#666',
  },
  decisionButtons: {
    gap: 12,
  },
  responseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  tryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    flexDirection: 'column',
    gap: 4,
  },
  tryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  tryButtonSubtext: {
    fontSize: 12,
    color: '#FFFFFF99',
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
  
  // Variation card styles
  variationContent: {
    marginBottom: 24,
  },
  variationSummary: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  variationDetails: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  variationStats: {
    flexDirection: 'row',
    gap: 24,
  },
  variationStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  variationStatText: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '600',
  },
  backToStandardButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backToStandardText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  
  // Navigation styles
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4CAF50',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  prevButtonText: {
    fontSize: 14,
    color: '#666',
  },
  
  // Pagination
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
  
  // Quick actions on first card
  quickActionsContainer: {
    marginTop: 20,
    gap: 10,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  quickTryButton: {
    backgroundColor: '#4CAF50',
  },
  quickTryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  learnMoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  quickSecondaryButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  quickMaybeButton: {
    flex: 1,
    backgroundColor: '#FFF3E0',
  },
  quickMaybeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
  },
  quickSkipButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  quickSkipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
});