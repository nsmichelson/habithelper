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
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import StorageService from '@/services/storage';
import { DailyTip, TipAttempt, UserProfile } from '@/types/tip';
import { getTipById } from '@/data/tips';
import Svg, { Circle, Path, G, Text as SvgText } from 'react-native-svg';
import EducationCards from '@/components/EducationCards';
import { organizationEducation } from '@/data/eduation_collection/organization';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string[];
  unlocked: boolean;
  progress: number;
  target: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface WeekComparison {
  metric: string;
  thisWeek: number;
  lastWeek: number;
  change: number;
  improved: boolean;
}

const MOTIVATIONAL_QUOTES = [
  { text: "Every expert was once a beginner.", author: "Unknown" },
  { text: "Progress, not perfection.", author: "Unknown" },
  { text: "Small steps daily lead to big changes yearly.", author: "Unknown" },
  { text: "Your only limit is you.", author: "Unknown" },
  { text: "Make it happen.", author: "Unknown" },
  { text: "Success is a series of small wins.", author: "Unknown" },
];

export default function ProgressScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([]);
  const [attempts, setAttempts] = useState<TipAttempt[]>([]);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [successPatterns, setSuccessPatterns] = useState<SuccessPattern[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [weekComparison, setWeekComparison] = useState<WeekComparison[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'analytics' | 'journey'>('overview');
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [showEducationCards, setShowEducationCards] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnims = useRef([...Array(6)].map(() => new Animated.Value(0.9))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const chartAnimValues = useRef([...Array(7)].map(() => new Animated.Value(0))).current;
  const confettiAnims = useRef([...Array(20)].map(() => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    opacity: new Animated.Value(0),
    rotate: new Animated.Value(0),
  }))).current;

  useEffect(() => {
    loadData();
    // Rotate through quotes
    const quoteInterval = setInterval(() => {
      const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      setCurrentQuote(randomQuote);
    }, 10000);
    return () => clearInterval(quoteInterval);
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

    // Pulse animation for selected cards
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Rotate animation for achievements
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      }),
    ).start();
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
      calculateAchievements(tips, tipAttempts);
      calculateWeekComparison(tips, tipAttempts);
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

  const calculateAchievements = (tips: DailyTip[], attempts: TipAttempt[]) => {
    const totalTried = tips.filter(t => t.user_response === 'try_it').length;
    const totalSuccess = tips.filter(t => 
      t.evening_check_in === 'went_great' || t.evening_check_in === 'went_ok'
    ).length;
    const currentStreak = calculateStreak(tips);
    const bestStreak = calculateBestStreak(tips);
    
    const achievementList: Achievement[] = [
      {
        id: 'first_step',
        title: 'First Step',
        description: 'Try your first experiment',
        icon: 'footsteps',
        color: ['#4CAF50', '#66BB6A'],
        unlocked: totalTried >= 1,
        progress: Math.min(totalTried, 1),
        target: 1,
        rarity: 'common',
      },
      {
        id: 'week_warrior',
        title: 'Week Warrior',
        description: 'Complete 7 experiments',
        icon: 'calendar',
        color: ['#2196F3', '#42A5F5'],
        unlocked: totalTried >= 7,
        progress: Math.min(totalTried, 7),
        target: 7,
        rarity: 'common',
      },
      {
        id: 'success_seeker',
        title: 'Success Seeker',
        description: '10 successful experiments',
        icon: 'trophy',
        color: ['#FFD700', '#FFC107'],
        unlocked: totalSuccess >= 10,
        progress: Math.min(totalSuccess, 10),
        target: 10,
        rarity: 'rare',
      },
      {
        id: 'streak_master',
        title: 'Streak Master',
        description: '7 day streak',
        icon: 'flame',
        color: ['#FF6B6B', '#FF8E53'],
        unlocked: bestStreak >= 7,
        progress: Math.min(bestStreak, 7),
        target: 7,
        rarity: 'rare',
      },
      {
        id: 'experiment_expert',
        title: 'Experiment Expert',
        description: 'Try 30 experiments',
        icon: 'flask',
        color: ['#9C27B0', '#BA68C8'],
        unlocked: totalTried >= 30,
        progress: Math.min(totalTried, 30),
        target: 30,
        rarity: 'epic',
      },
      {
        id: 'habit_hero',
        title: 'Habit Hero',
        description: 'Maintain a 30 day streak',
        icon: 'shield-checkmark',
        color: ['#E91E63', '#F06292'],
        unlocked: bestStreak >= 30,
        progress: Math.min(bestStreak, 30),
        target: 30,
        rarity: 'legendary',
      },
      {
        id: 'perfect_week',
        title: 'Perfect Week',
        description: '7 successful experiments in a row',
        icon: 'star',
        color: ['#00BCD4', '#26C6DA'],
        unlocked: false, // Calculate consecutive successes
        progress: 0,
        target: 7,
        rarity: 'epic',
      },
      {
        id: 'explorer',
        title: 'Explorer',
        description: 'Try 5 different experiment types',
        icon: 'compass',
        color: ['#FF9800', '#FFB74D'],
        unlocked: false, // Calculate unique categories
        progress: 0,
        target: 5,
        rarity: 'rare',
      },
    ];
    
    setAchievements(achievementList);
  };

  const calculateWeekComparison = (tips: DailyTip[], attempts: TipAttempt[]) => {
    const now = new Date();
    const thisWeekStart = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000);
    const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekEnd = new Date(thisWeekStart.getTime() - 1);
    
    const thisWeekTips = tips.filter(t => new Date(t.presented_date) >= thisWeekStart);
    const lastWeekTips = tips.filter(t => {
      const date = new Date(t.presented_date);
      return date >= lastWeekStart && date <= lastWeekEnd;
    });
    
    const comparisons: WeekComparison[] = [
      {
        metric: 'Experiments Tried',
        thisWeek: thisWeekTips.filter(t => t.user_response === 'try_it').length,
        lastWeek: lastWeekTips.filter(t => t.user_response === 'try_it').length,
        change: 0,
        improved: false,
      },
      {
        metric: 'Success Rate',
        thisWeek: thisWeekTips.length > 0 ? 
          Math.round((thisWeekTips.filter(t => t.evening_check_in === 'went_great').length / thisWeekTips.length) * 100) : 0,
        lastWeek: lastWeekTips.length > 0 ?
          Math.round((lastWeekTips.filter(t => t.evening_check_in === 'went_great').length / lastWeekTips.length) * 100) : 0,
        change: 0,
        improved: false,
      },
      {
        metric: 'Active Days',
        thisWeek: new Set(thisWeekTips.map(t => new Date(t.presented_date).toDateString())).size,
        lastWeek: new Set(lastWeekTips.map(t => new Date(t.presented_date).toDateString())).size,
        change: 0,
        improved: false,
      },
    ];
    
    // Calculate changes
    comparisons.forEach(comp => {
      comp.change = comp.thisWeek - comp.lastWeek;
      comp.improved = comp.change > 0;
    });
    
    setWeekComparison(comparisons);
  };

  const triggerConfetti = () => {
    confettiAnims.forEach((anim, index) => {
      const delay = index * 50;
      const randomX = (Math.random() - 0.5) * SCREEN_WIDTH;
      const randomRotation = Math.random() * 720;
      
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim.y, {
            toValue: SCREEN_HEIGHT,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.x, {
            toValue: randomX,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim.rotate, {
            toValue: randomRotation,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Reset for next trigger
        anim.y.setValue(0);
        anim.x.setValue(0);
        anim.rotate.setValue(0);
        anim.opacity.setValue(0);
      });
    });
  };

  const renderInsightCard = (insight: InsightCard, index: number) => (
    <Animated.View
      key={insight.id}
      style={[
        styles.insightCard,
        {
          opacity: fadeAnim,
          transform: [
            { scale: selectedInsight === insight.id ? pulseAnim : (scaleAnims[index] || 1) },
            { translateY: slideAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setSelectedInsight(insight.id === selectedInsight ? null : insight.id);
          if (insight.value > 20 && insight.id === '1') {
            triggerConfetti();
          }
        }}
      >
        <LinearGradient
          colors={insight.color}
          style={[styles.insightGradient, selectedInsight === insight.id && styles.insightGradientSelected]}
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
  
  const renderAchievement = (achievement: Achievement, index: number) => {
    const progress = (achievement.progress / achievement.target) * 100;
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    
    return (
      <TouchableOpacity
        key={achievement.id}
        style={[
          styles.achievementCard,
          achievement.unlocked && styles.achievementUnlocked,
          !achievement.unlocked && styles.achievementLocked,
        ]}
        onPress={() => {
          if (achievement.unlocked) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            triggerConfetti();
          } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        activeOpacity={0.8}
      >
        {achievement.unlocked ? (
          <LinearGradient
            colors={achievement.color}
            style={styles.achievementGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.View style={achievement.rarity === 'legendary' ? { transform: [{ rotate: spin }] } : {}}>
              <Ionicons name={achievement.icon as any} size={40} color="#FFFFFF" />
            </Animated.View>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <View style={styles.rarityBadge}>
              <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.achievementLockedContent}>
            <Ionicons name="lock-closed" size={30} color="#CCCCCC" />
            <Text style={styles.achievementLockedTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{achievement.progress}/{achievement.target}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderWeekComparison = () => (
    <View style={styles.comparisonContainer}>
      <Text style={styles.sectionTitle}>This Week vs Last Week</Text>
      {weekComparison.map((comp, index) => (
        <Animated.View
          key={comp.metric}
          style={[
            styles.comparisonCard,
            {
              opacity: fadeAnim,
              transform: [
                { translateX: Animated.multiply(slideAnim, index % 2 === 0 ? 1 : -1) },
              ],
            },
          ]}
        >
          <Text style={styles.comparisonMetric}>{comp.metric}</Text>
          <View style={styles.comparisonValues}>
            <View style={styles.weekValue}>
              <Text style={styles.weekLabel}>Last</Text>
              <Text style={styles.weekNumber}>{comp.lastWeek}</Text>
            </View>
            <View style={styles.changeIndicator}>
              <Ionicons 
                name={comp.improved ? 'arrow-up' : comp.change < 0 ? 'arrow-down' : 'remove'} 
                size={24} 
                color={comp.improved ? '#4CAF50' : comp.change < 0 ? '#F44336' : '#999999'} 
              />
              {comp.change !== 0 && (
                <Text style={[styles.changeText, comp.improved ? styles.changePositive : styles.changeNegative]}>
                  {comp.change > 0 ? '+' : ''}{comp.change}
                </Text>
              )}
            </View>
            <View style={styles.weekValue}>
              <Text style={styles.weekLabel}>This</Text>
              <Text style={[styles.weekNumber, comp.improved && styles.weekNumberHighlight]}>
                {comp.thisWeek}
              </Text>
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );

  const renderChart = () => {
    const last7Days = dailyTips.slice(-7);
    const maxHeight = 100;
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>7-Day Activity</Text>
        <View style={styles.chart}>
          {[...Array(7)].map((_, index) => {
            const tip = last7Days[index];
            const height = tip?.user_response === 'try_it' ? 
              (tip.evening_check_in === 'went_great' ? maxHeight : 
               tip.evening_check_in === 'went_ok' ? maxHeight * 0.7 : 
               maxHeight * 0.4) : 0;
            
            const animatedHeight = chartAnimValues[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0, height],
            });
            
            // Animate chart bars
            Animated.timing(chartAnimValues[index], {
              toValue: 1,
              duration: 500,
              delay: index * 100,
              useNativeDriver: false,
            }).start();
            
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1);
            
            return (
              <View key={index} style={styles.chartBar}>
                <Animated.View 
                  style={[
                    styles.bar,
                    { 
                      height: animatedHeight,
                      backgroundColor: tip?.evening_check_in === 'went_great' ? '#4CAF50' :
                                     tip?.evening_check_in === 'went_ok' ? '#FFC107' :
                                     tip?.user_response === 'try_it' ? '#FF9800' : '#E0E0E0'
                    }
                  ]} 
                />
                <Text style={styles.barLabel}>{dayLabel}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Great</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.legendText}>OK</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>Tried</Text>
          </View>
        </View>
      </View>
    );
  };

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

          {/* Motivational Quote */}
          <Animated.View style={[styles.quoteContainer, { opacity: fadeAnim }]}>
            <Text style={styles.quoteText}>"{currentQuote.text}"</Text>
            <Text style={styles.quoteAuthor}>— {currentQuote.author}</Text>
          </Animated.View>

          {/* Tab Selector */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.tabScrollContainer}
            contentContainerStyle={styles.tabScrollContent}
          >
            {(['overview', 'achievements', 'analytics', 'journey'] as const).map((tab) => (
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
                <Ionicons 
                  name={
                    tab === 'overview' ? 'home' :
                    tab === 'achievements' ? 'trophy' :
                    tab === 'analytics' ? 'stats-chart' : 'map'
                  } 
                  size={20} 
                  color={activeTab === tab ? '#4CAF50' : '#666'} 
                />
                <Text style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

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

          {activeTab === 'achievements' && (
            <View style={styles.achievementsContainer}>
              <Text style={styles.sectionTitle}>Your Achievements</Text>
              <View style={styles.achievementsGrid}>
                {achievements.map((achievement, index) => renderAchievement(achievement, index))}
              </View>
              
              {achievements.filter(a => a.unlocked).length >= 3 && (
                <View style={styles.motivationCard}>
                  <Text style={styles.motivationText}>
                    🏆 You've unlocked {achievements.filter(a => a.unlocked).length} achievements! 
                    Keep going to unlock them all!
                  </Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'analytics' && (
            <View style={styles.analyticsContainer}>
              {renderChart()}
              {renderWeekComparison()}
              
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
                    <Text style={styles.emptyEmoji}>📊</Text>
                    <Text style={styles.emptyTitle}>Building your profile...</Text>
                    <Text style={styles.emptyText}>
                      Complete more experiments to see detailed analytics!
                    </Text>
                  </View>
                )}
              </View>
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
      
      {/* Confetti Overlay */}
      <View style={styles.confettiContainer} pointerEvents="none">
        {confettiAnims.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                opacity: anim.opacity,
                transform: [
                  { translateY: anim.y },
                  { translateX: anim.x },
                  { rotate: anim.rotate.interpolate({
                    inputRange: [0, 720],
                    outputRange: ['0deg', '720deg'],
                  }) },
                ],
                backgroundColor: ['#FF6B6B', '#4CAF50', '#2196F3', '#FFD700', '#9C27B0'][index % 5],
              },
            ]}
          />
        ))}
      </View>
      
      {/* Test Education Cards Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          backgroundColor: '#E85D75',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setShowEducationCards(true);
        }}
      >
        <Ionicons name="school-outline" size={20} color="#FFF" />
        <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 14 }}>
          Learn About Organization
        </Text>
      </TouchableOpacity>
      
      {/* Education Cards Component */}
      <EducationCards
        content={organizationEducation}
        visible={showEducationCards}
        onClose={() => setShowEducationCards(false)}
        onComplete={() => {
          console.log('Education cards completed!');
          setShowEducationCards(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      />
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
  quoteContainer: {
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#424242',
    lineHeight: 20,
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  tabScrollContainer: {
    marginBottom: 20,
    maxHeight: 60,
  },
  tabScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
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
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    marginHorizontal: 4,
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
  insightGradientSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
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
  achievementsContainer: {
    paddingHorizontal: 24,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  achievementCard: {
    width: (SCREEN_WIDTH - 64) / 3,
    height: (SCREEN_WIDTH - 64) / 3,
    marginBottom: 16,
    borderRadius: 16,
  },
  achievementUnlocked: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementLocked: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  achievementGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4,
  },
  achievementLockedContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  achievementLockedTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 9,
    color: '#BBBBBB',
    textAlign: 'center',
    marginTop: 2,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 8,
    color: '#999',
    marginTop: 2,
  },
  rarityBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rarityText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  analyticsContainer: {
    paddingHorizontal: 24,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 12,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    borderRadius: 4,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#666',
  },
  comparisonContainer: {
    marginBottom: 20,
  },
  comparisonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  comparisonMetric: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  comparisonValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekValue: {
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  weekNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#424242',
  },
  weekNumberHighlight: {
    color: '#4CAF50',
  },
  changeIndicator: {
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  changePositive: {
    color: '#4CAF50',
  },
  changeNegative: {
    color: '#F44336',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: -10,
    left: SCREEN_WIDTH / 2 - 5,
  },
});