import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import StorageService from '@/services/storage';
import { DailyTip, TipAttempt, UserProfile } from '@/types/tip';
import { getTipById } from '@/data/tips';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface InsightCard {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  color: string[];
  trend?: 'up' | 'down' | 'stable';
}

interface SuccessPattern {
  title: string;
  description: string;
  emoji: string;
  count: number;
}

export default function ProgressScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);
  const [attempts, setAttempts] = useState<TipAttempt[]>([]);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [successPatterns, setSuccessPatterns] = useState<SuccessPattern[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'journey'>('overview');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnims = useRef([...Array(6)].map(() => new Animated.Value(0.9))).current;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 15,
        stiffness: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger card animations
    scaleAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        delay: index * 100,
        damping: 10,
        stiffness: 100,
        useNativeDriver: true,
      }).start();
    });
  }, [insights]);

  const loadData = async () => {
    const profile = await StorageService.getUserProfile();
    const tips = await StorageService.getDailyTips();
    const tipAttempts = await StorageService.getTipAttempts();
    
    setUserProfile(profile);
    setDailyTips(tips);
    setAttempts(tipAttempts);
    
    if (profile && tips.length > 0) {
      calculateInsights(tips, tipAttempts);
      findSuccessPatterns(tips, tipAttempts);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const calculateInsights = (tips: DailyTip[], attempts: TipAttempt[]) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Calculate metrics
    const totalExperiments = tips.length;
    const triedExperiments = tips.filter(t => t.user_response === 'try_it').length;
    const successfulExperiments = tips.filter(t => 
      t.evening_check_in === 'went_great' || t.evening_check_in === 'went_ok'
    ).length;
    
    const weeklyTips = tips.filter(t => new Date(t.presented_date) >= weekAgo);
    const weeklyTried = weeklyTips.filter(t => t.user_response === 'try_it').length;
    
    const successRate = triedExperiments > 0 
      ? Math.round((successfulExperiments / triedExperiments) * 100)
      : 0;
    
    const currentStreak = calculateStreak(tips);
    const bestStreak = calculateBestStreak(tips);
    
    // Find most successful category
    const categorySuccess = calculateCategorySuccess(tips);
    const topCategory = Object.entries(categorySuccess)
      .sort(([,a], [,b]) => b - a)[0];
    
    const newInsights: InsightCard[] = [
      {
        id: '1',
        title: 'Current Streak',
        value: currentStreak,
        subtitle: currentStreak === 1 ? 'day' : 'days',
        icon: 'flame',
        color: ['#FF6B6B', '#FF8E53'],
        trend: currentStreak > 0 ? 'up' : 'stable',
      },
      {
        id: '2',
        title: 'Success Rate',
        value: `${successRate}%`,
        subtitle: 'of experiments worked',
        icon: 'trending-up',
        color: ['#4CAF50', '#8BC34A'],
        trend: successRate > 50 ? 'up' : 'down',
      },
      {
        id: '3',
        title: 'This Week',
        value: weeklyTried,
        subtitle: weeklyTried === 1 ? 'experiment tried' : 'experiments tried',
        icon: 'calendar',
        color: ['#2196F3', '#03A9F4'],
      },
      {
        id: '4',
        title: 'Total Journey',
        value: totalExperiments,
        subtitle: totalExperiments === 1 ? 'experiment' : 'experiments',
        icon: 'rocket',
        color: ['#9C27B0', '#E91E63'],
      },
      {
        id: '5',
        title: 'Best Streak',
        value: bestStreak,
        subtitle: bestStreak === 1 ? 'day record' : 'days record',
        icon: 'trophy',
        color: ['#FFD700', '#FFA000'],
      },
      {
        id: '6',
        title: 'Top Category',
        value: topCategory?.[0] || 'None',
        subtitle: `${topCategory?.[1] || 0}% success`,
        icon: 'star',
        color: ['#00BCD4', '#00ACC1'],
      },
    ];
    
    setInsights(newInsights);
  };

  const calculateStreak = (tips: DailyTip[]): number => {
    const sortedTips = [...tips].sort((a, b) => 
      new Date(b.presented_date).getTime() - new Date(a.presented_date).getTime()
    );
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const tip of sortedTips) {
      const tipDate = new Date(tip.presented_date);
      tipDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - tipDate.getTime()) / (24 * 60 * 60 * 1000));
      
      if (daysDiff === streak && tip.user_response === 'try_it') {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  };

  const calculateBestStreak = (tips: DailyTip[]): number => {
    const sortedTips = [...tips].sort((a, b) => 
      new Date(a.presented_date).getTime() - new Date(b.presented_date).getTime()
    );
    
    let currentStreak = 0;
    let bestStreak = 0;
    let lastDate: Date | null = null;
    
    for (const tip of sortedTips) {
      if (tip.user_response === 'try_it') {
        const tipDate = new Date(tip.presented_date);
        tipDate.setHours(0, 0, 0, 0);
        
        if (lastDate) {
          const daysDiff = Math.floor((tipDate.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000));
          if (daysDiff === 1) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }
        
        lastDate = tipDate;
        bestStreak = Math.max(bestStreak, currentStreak);
      }
    }
    
    return bestStreak;
  };

  const calculateCategorySuccess = (tips: DailyTip[]): Record<string, number> => {
    const categories: Record<string, { tried: number; success: number }> = {};
    
    for (const dailyTip of tips) {
      if (dailyTip.user_response === 'try_it') {
        const tip = getTipById(dailyTip.tip_id);
        if (tip?.tip_type) {
          for (const type of tip.tip_type) {
            if (!categories[type]) {
              categories[type] = { tried: 0, success: 0 };
            }
            categories[type].tried++;
            if (dailyTip.evening_check_in === 'went_great' || 
                dailyTip.evening_check_in === 'went_ok') {
              categories[type].success++;
            }
          }
        }
      }
    }
    
    const successRates: Record<string, number> = {};
    for (const [type, data] of Object.entries(categories)) {
      if (data.tried > 0) {
        successRates[type] = Math.round((data.success / data.tried) * 100);
      }
    }
    
    return successRates;
  };

  const findSuccessPatterns = (tips: DailyTip[], attempts: TipAttempt[]) => {
    const patterns: SuccessPattern[] = [];
    
    // Time of day analysis
    const morningSuccess = tips.filter(t => {
      const hour = new Date(t.presented_date).getHours();
      return hour < 12 && t.evening_check_in === 'went_great';
    }).length;
    
    if (morningSuccess >= 3) {
      patterns.push({
        title: 'Morning Person',
        description: 'You crush morning experiments!',
        emoji: '🌅',
        count: morningSuccess,
      });
    }
    
    // Consistency pattern
    const weekendTips = tips.filter(t => {
      const day = new Date(t.presented_date).getDay();
      return (day === 0 || day === 6) && t.user_response === 'try_it';
    });
    
    if (weekendTips.length >= 5) {
      patterns.push({
        title: 'Weekend Warrior',
        description: 'You stay consistent on weekends',
        emoji: '🎯',
        count: weekendTips.length,
      });
    }
    
    // Quick wins
    const quickWins = tips.filter(t => {
      const tip = getTipById(t.tip_id);
      return tip?.time_cost_enum === '0_5_min' && 
             t.evening_check_in === 'went_great';
    }).length;
    
    if (quickWins >= 5) {
      patterns.push({
        title: 'Quick Win Master',
        description: 'Small changes, big impact',
        emoji: '⚡',
        count: quickWins,
      });
    }
    
    // Adventurous
    const difficultTried = tips.filter(t => {
      const tip = getTipById(t.tip_id);
      return tip?.difficulty_tier >= 3 && t.user_response === 'try_it';
    }).length;
    
    if (difficultTried >= 3) {
      patterns.push({
        title: 'Adventurous Spirit',
        description: 'You embrace challenges',
        emoji: '🚀',
        count: difficultTried,
      });
    }
    
    setSuccessPatterns(patterns);
  };

  const renderInsightCard = (insight: InsightCard, index: number) => (
    <Animated.View
      key={insight.id}
      style={[
        styles.insightCard,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnims[index] || 1 },
            { translateY: slideAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <LinearGradient
          colors={insight.color}
          style={styles.insightGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.insightHeader}>
            <Ionicons name={insight.icon as any} size={24} color="#FFFFFF" />
            {insight.trend && (
              <Ionicons 
                name={`trending-${insight.trend}` as any} 
                size={16} 
                color="#FFFFFF" 
                style={styles.trendIcon}
              />
            )}
          </View>
          <Text style={styles.insightValue}>{insight.value}</Text>
          <Text style={styles.insightSubtitle}>{insight.subtitle}</Text>
          <Text style={styles.insightTitle}>{insight.title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSuccessPattern = (pattern: SuccessPattern, index: number) => (
    <Animated.View
      key={pattern.title}
      style={[
        styles.patternCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
          ],
        },
      ]}
    >
      <Text style={styles.patternEmoji}>{pattern.emoji}</Text>
      <View style={styles.patternContent}>
        <Text style={styles.patternTitle}>{pattern.title}</Text>
        <Text style={styles.patternDescription}>{pattern.description}</Text>
        <View style={styles.patternBadge}>
          <Text style={styles.patternCount}>×{pattern.count}</Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8F5E9', '#FFFFFF']}
        style={styles.gradient}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#4CAF50"
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>
              {userProfile?.name ? `${userProfile.name}'s` : 'Your'} Journey
            </Text>
            <Text style={styles.subtitle}>
              Discovering what works for you
            </Text>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            {(['overview', 'patterns', 'journey'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab && styles.activeTab,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveTab(tab);
                }}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <>
              {/* Insight Cards Grid */}
              <View style={styles.insightsGrid}>
                {insights.map((insight, index) => renderInsightCard(insight, index))}
              </View>

              {/* Motivational Message */}
              {insights.length > 0 && (
                <View style={styles.motivationCard}>
                  <Text style={styles.motivationText}>
                    {insights[0].value > 0 
                      ? "🎉 You're on fire! Keep exploring what works."
                      : "🌱 Every journey starts with a single step. You've got this!"}
                  </Text>
                </View>
              )}
            </>
          )}

          {activeTab === 'patterns' && (
            <View style={styles.patternsContainer}>
              {successPatterns.length > 0 ? (
                <>
                  <Text style={styles.sectionTitle}>Your Success Patterns</Text>
                  {successPatterns.map((pattern, index) => renderSuccessPattern(pattern, index))}
                  
                  <View style={styles.insightBox}>
                    <Ionicons name="bulb" size={24} color="#FFA000" />
                    <Text style={styles.insightText}>
                      Based on your patterns, you might enjoy experiments that are quick, 
                      social, and focused on {insights[5]?.value || 'healthy swaps'}.
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>🔍</Text>
                  <Text style={styles.emptyTitle}>Patterns emerging...</Text>
                  <Text style={styles.emptyText}>
                    Try a few more experiments and we'll spot your success patterns!
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'journey' && (
            <View style={styles.journeyContainer}>
              <Text style={styles.sectionTitle}>Your Experiment Timeline</Text>
              
              {dailyTips.slice(-7).reverse().map((tip, index) => {
                const tipData = getTipById(tip.tip_id);
                const isSuccess = tip.evening_check_in === 'went_great';
                const isTried = tip.user_response === 'try_it';
                
                return (
                  <Animated.View
                    key={tip.id}
                    style={[
                      styles.timelineItem,
                      {
                        opacity: fadeAnim,
                        transform: [
                          { translateX: Animated.multiply(slideAnim, index % 2 === 0 ? 1 : -1) },
                        ],
                      },
                    ]}
                  >
                    <View style={[
                      styles.timelineDot,
                      isSuccess && styles.timelineDotSuccess,
                      !isTried && styles.timelineDotSkipped,
                    ]} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineDate}>
                        {new Date(tip.presented_date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Text>
                      <Text style={styles.timelineTitle}>
                        {tipData?.summary || 'Experiment'}
                      </Text>
                      <View style={styles.timelineStatus}>
                        <Text style={[
                          styles.timelineStatusText,
                          isSuccess && styles.timelineStatusSuccess,
                        ]}>
                          {!isTried ? 'Skipped' : 
                           isSuccess ? 'Success!' :
                           tip.evening_check_in === 'went_ok' ? 'Okay' :
                           tip.evening_check_in === 'not_great' ? 'Not great' :
                           'Tried'}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>
                );
              })}
              
              {dailyTips.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyEmoji}>🗺️</Text>
                  <Text style={styles.emptyTitle}>Your journey begins!</Text>
                  <Text style={styles.emptyText}>
                    Start experimenting to build your personal success story.
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#4CAF50',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  insightCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    marginBottom: 16,
  },
  insightGradient: {
    padding: 16,
    borderRadius: 20,
    minHeight: 120,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trendIcon: {
    opacity: 0.8,
  },
  insightValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  insightSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  motivationCard: {
    marginHorizontal: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  motivationText: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    lineHeight: 24,
  },
  patternsContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  patternCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  patternEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  patternContent: {
    flex: 1,
  },
  patternTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  patternDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  patternBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  patternCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  insightBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 12,
  },
  journeyContainer: {
    paddingHorizontal: 24,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
    marginRight: 12,
  },
  timelineDotSuccess: {
    backgroundColor: '#4CAF50',
  },
  timelineDotSkipped: {
    backgroundColor: '#FFA000',
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  timelineDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
  },
  timelineStatus: {
    alignSelf: 'flex-start',
  },
  timelineStatusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  timelineStatusSuccess: {
    color: '#4CAF50',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});