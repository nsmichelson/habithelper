

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
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tip } from '../types/tip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;

interface Props {
  tip: Tip;
  onResponse: (response: 'try_it' | 'maybe_later') => void;
  onNotForMe: () => void;
  reasons?: string[];
  userGoals?: string[];
}

export default function DailyTipCardSwipe({ tip, onResponse, onNotForMe, reasons = [], userGoals = [] }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  
  // State for personalization
  const [scaleNames, setScaleNames] = useState({
    level1: '',
    level5: '',
    level10: ''
  });
  const [savedScaleNames, setSavedScaleNames] = useState<typeof scaleNames | null>(null);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  
  // Parse details_md to extract sections
  const parseDetailsContent = () => {
    const content = tip.details_md || '';
    const sections: { experiment?: string; whyItWorks?: string; howToTry?: string } = {};
    
    // Extract "The Experiment" section
    const experimentMatch = content.match(/\*\*The Experiment:\*\*(.+?)(?=\*\*Why it Works:|\*\*How to|$)/s);
    if (experimentMatch) {
      sections.experiment = experimentMatch[1].trim();
    }
    
    // Extract "Why it Works" section
    const whyMatch = content.match(/\*\*Why it Works:\*\*(.+?)(?=\*\*How to|$)/s);
    if (whyMatch) {
      sections.whyItWorks = whyMatch[1].trim();
    }
    
    // Extract "How to Try It" section
    const howMatch = content.match(/\*\*How to Try It:\*\*(.+?)$/s);
    if (howMatch) {
      sections.howToTry = howMatch[1].trim();
    }
    
    return sections;
  };
  
  const detailsSections = parseDetailsContent();
  
  // Get relevant user goals that this tip meets
  const relevantGoals = userGoals.filter(userGoal => 
    tip.goal_tags.includes(userGoal)
  );
  
  // Check if this tip should have a personalization card
  const shouldShowPersonalization = tip.summary.toLowerCase().includes('hunger scale');
  
  // Animation for save button
  const saveButtonScale = useSharedValue(1);
  const saveButtonOpacity = useSharedValue(1);
  
  const handleSavePersonalization = () => {
    // Trigger delightful animation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    saveButtonScale.value = withSequence(
      withSpring(1.2, { damping: 15 }),
      withSpring(0.9, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );
    
    setShowSaveAnimation(true);
    setSavedScaleNames({ ...scaleNames });
    
    // Hide animation after a delay
    setTimeout(() => {
      setShowSaveAnimation(false);
    }, 2000);
  };
  
  const animatedSaveButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: saveButtonScale.value }],
      opacity: saveButtonOpacity.value
    };
  });

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
    if (newIndex >= 0 && newIndex < pages.length) {
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

  const renderGoalsCard = () => (
    <View style={styles.pageContainer}>
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.cardGradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Goals This Meets</Text>
          
          {relevantGoals.length > 0 ? (
            <View style={styles.goalsMatchSection}>
              <Text style={styles.goalsMatchTitle}>YOUR GOALS:</Text>
              <View style={styles.goalsMatchGrid}>
                {relevantGoals.map(goal => (
                  <View key={goal} style={styles.userGoalChip}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.userGoalText}>
                      {goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
          
          <View style={styles.allGoalsSection}>
            <Text style={styles.allGoalsTitle}>THIS TIP HELPS WITH:</Text>
            <View style={styles.goalsGrid}>
              {tip.goal_tags.map(goal => {
                const isUserGoal = relevantGoals.includes(goal);
                return (
                  <View 
                    key={goal} 
                    style={[styles.goalChip, isUserGoal && styles.goalChipHighlight]}
                  >
                    <Text style={[styles.goalChipText, isUserGoal && styles.goalChipTextHighlight]}>
                      {goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
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
          
          {detailsSections.howToTry ? (
            <View style={styles.howToContent}>
              {detailsSections.howToTry.split('\n').map((line, index) => {
                const isBullet = line.trim().startsWith('•');
                if (isBullet) {
                  return (
                    <View key={index} style={styles.bulletPoint}>
                      <Text style={styles.bulletIcon}>•</Text>
                      <Text style={styles.bulletText}>{line.replace('•', '').trim()}</Text>
                    </View>
                  );
                }
                return line.trim() ? (
                  <Text key={index} style={styles.detailsText}>{line}</Text>
                ) : null;
              })}
            </View>
          ) : (
            <Text style={styles.detailsText}>
              {detailsSections.experiment || tip.details_md}
            </Text>
          )}
          
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
          
          {detailsSections.whyItWorks ? (
            <View style={styles.whyItWorksSection}>
              <Text style={styles.whyItWorksText}>
                {detailsSections.whyItWorks}
              </Text>
            </View>
          ) : null}
          
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsSectionTitle}>TIP TYPE</Text>
            <View style={styles.tipTypeGrid}>
              {(tip.tip_type || []).map(type => (
                <View key={type} style={styles.tipTypeBadge}>
                  <Text style={styles.tipTypeText}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </View>
              ))}
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
  
  const renderPersonalizationCard = () => (
    <View style={styles.pageContainer}>
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA']}
        style={styles.cardGradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionTitle}>Make It Your Own</Text>
            
            {!savedScaleNames ? (
              <>
                <Text style={styles.personalizationPrompt}>
                  Let's personalize your hunger scale! What does each level feel like to you?
                </Text>
                
                <View style={styles.scaleInputContainer}>
                  <View style={styles.scaleLevel}>
                    <View style={styles.scaleLevelHeader}>
                      <View style={styles.scaleNumber}>
                        <Text style={styles.scaleNumberText}>1</Text>
                      </View>
                      <Text style={styles.scaleLevelLabel}>Starving</Text>
                    </View>
                    <TextInput
                      style={styles.scaleInput}
                      placeholder="e.g., Stomach growling loudly"
                      value={scaleNames.level1}
                      onChangeText={(text) => setScaleNames({ ...scaleNames, level1: text })}
                      multiline
                      numberOfLines={2}
                      placeholderTextColor="#999"
                    />
                  </View>
                  
                  <View style={styles.scaleLevel}>
                    <View style={styles.scaleLevelHeader}>
                      <View style={[styles.scaleNumber, styles.scaleNumberMid]}>
                        <Text style={styles.scaleNumberText}>5</Text>
                      </View>
                      <Text style={styles.scaleLevelLabel}>Satisfied</Text>
                    </View>
                    <TextInput
                      style={styles.scaleInput}
                      placeholder="e.g., Content and comfortable"
                      value={scaleNames.level5}
                      onChangeText={(text) => setScaleNames({ ...scaleNames, level5: text })}
                      multiline
                      numberOfLines={2}
                      placeholderTextColor="#999"
                    />
                  </View>
                  
                  <View style={styles.scaleLevel}>
                    <View style={styles.scaleLevelHeader}>
                      <View style={[styles.scaleNumber, styles.scaleNumberFull]}>
                        <Text style={styles.scaleNumberText}>10</Text>
                      </View>
                      <Text style={styles.scaleLevelLabel}>Stuffed</Text>
                    </View>
                    <TextInput
                      style={styles.scaleInput}
                      placeholder="e.g., Uncomfortably full"
                      value={scaleNames.level10}
                      onChangeText={(text) => setScaleNames({ ...scaleNames, level10: text })}
                      multiline
                      numberOfLines={2}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
                
                {(scaleNames.level1 || scaleNames.level5 || scaleNames.level10) && (
                  <Animated.View style={animatedSaveButtonStyle}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSavePersonalization}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="sparkles" size={20} color="#FFF" />
                      <Text style={styles.saveButtonText}>Save My Scale</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </>
            ) : (
              <View style={styles.savedScaleContainer}>
                <View style={styles.savedHeader}>
                  <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                  <Text style={styles.savedTitle}>Your Personal Hunger Scale</Text>
                </View>
                
                <View style={styles.savedScaleItems}>
                  {savedScaleNames.level1 && (
                    <View style={styles.savedScaleItem}>
                      <View style={[styles.savedScaleNumber, styles.scaleNumber]}>
                        <Text style={styles.savedScaleNumberText}>1</Text>
                      </View>
                      <Text style={styles.savedScaleText}>{savedScaleNames.level1}</Text>
                    </View>
                  )}
                  
                  {savedScaleNames.level5 && (
                    <View style={styles.savedScaleItem}>
                      <View style={[styles.savedScaleNumber, styles.scaleNumberMid]}>
                        <Text style={styles.savedScaleNumberText}>5</Text>
                      </View>
                      <Text style={styles.savedScaleText}>{savedScaleNames.level5}</Text>
                    </View>
                  )}
                  
                  {savedScaleNames.level10 && (
                    <View style={styles.savedScaleItem}>
                      <View style={[styles.savedScaleNumber, styles.scaleNumberFull]}>
                        <Text style={styles.savedScaleNumberText}>10</Text>
                      </View>
                      <Text style={styles.savedScaleText}>{savedScaleNames.level10}</Text>
                    </View>
                  )}
                </View>
                
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setSavedScaleNames(null)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="pencil" size={16} color="#4CAF50" />
                  <Text style={styles.editButtonText}>Edit My Scale</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {showSaveAnimation && (
              <View style={styles.celebrationOverlay}>
                <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                <Text style={styles.celebrationText}>Personalized! 🎉</Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );

  const pages = [
    { key: 'summary', render: renderSummaryCard },
    { key: 'goals', render: renderGoalsCard },
    { key: 'benefits', render: renderBenefitsCard },
    { key: 'howto', render: renderHowToCard },
    ...(shouldShowPersonalization ? [{ key: 'personalize', render: renderPersonalizationCard }] : []),
  ];

  const DotIndicator = ({ index }: { index: number }) => {
    const animatedDotStyle = useAnimatedStyle(() => {
      const inputRange = [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH];
      
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
      const inputRange = [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH];
      
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0, 1, 0],
        Extrapolate.CLAMP
      );

      return { opacity };
    });

    const labels = shouldShowPersonalization 
      ? ['Summary', 'Goals', 'Why', 'How', 'Plan']
      : ['Summary', 'Goals', 'Why', 'How'];

    return (
      <TouchableOpacity
        style={styles.step}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          flatListRef.current?.scrollToIndex({ index, animated: true });
          setCurrentPage(index);
        }}
        activeOpacity={0.7}
      >
        <Animated.View style={[styles.dot, animatedDotStyle]} />
        <Animated.Text style={[styles.stepLabel, labelOpacity]}>{labels[index]}</Animated.Text>
      </TouchableOpacity>
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
                const newPage = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
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
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  cardWrapper: {
    flex: 1,
    position: 'relative',
  },
  cardMask: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  pageContainer: {
    width: CARD_WIDTH,
    paddingHorizontal: 0,
    height: '100%',
  },
  cardGradient: {
    flex: 1,
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
  goalsMatchSection: {
    marginBottom: 24,
  },
  goalsMatchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  goalsMatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  userGoalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  userGoalText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
  },
  allGoalsSection: {
    marginTop: 8,
  },
  allGoalsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 8,
  },
  goalChipHighlight: {
    backgroundColor: '#C8E6C9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  goalChipTextHighlight: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  whyItWorksSection: {
    backgroundColor: '#F0F7FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  whyItWorksText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 24,
  },
  tipTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipTypeBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tipTypeText: {
    fontSize: 11,
    color: '#1976D2',
    fontWeight: '500',
  },
  howToContent: {
    marginBottom: 24,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  bulletIcon: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 10,
    fontWeight: '700',
  },
  bulletText: {
    fontSize: 15,
    color: '#424242',
    lineHeight: 22,
    flex: 1,
  },
  personalizationPrompt: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
    marginBottom: 24,
  },
  scaleInputContainer: {
    gap: 20,
  },
  scaleLevel: {
    marginBottom: 8,
  },
  scaleLevelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  scaleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE0B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleNumberMid: {
    backgroundColor: '#C8E6C9',
  },
  scaleNumberFull: {
    backgroundColor: '#FFCDD2',
  },
  scaleNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#424242',
  },
  scaleLevelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  scaleInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#424242',
    minHeight: 60,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 24,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  savedScaleContainer: {
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 20,
  },
  savedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  savedScaleItems: {
    gap: 16,
  },
  savedScaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
  },
  savedScaleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedScaleNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#424242',
  },
  savedScaleText: {
    fontSize: 15,
    color: '#424242',
    flex: 1,
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -80 }, { translateY: -50 }],
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  celebrationText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 8,
  },
  actionContainer: {
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