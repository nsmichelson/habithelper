import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl,
  Pressable,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import ConfettiCannon from 'react-native-confetti-cannon';
import StorageService from '@/services/storage';
import { UserProfile, DailyTip } from '@/types/tip';
import { getTipById } from '@/data/tips';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface HabitData {
  tipId: string;
  title: string;
  emoji: string;
  timeEstimate: string;
  completedToday: boolean;
  streak: number;
  bestStreak: number;
  totalDays: number;
  lastCompleted?: string;
  isLoved: boolean;
  category?: string;
}

const HABIT_EMOJIS = ['💪', '🥗', '💧', '🚶', '🧘', '😴', '📚', '🎯', '⭐', '🌟'];
const CELEBRATION_MESSAGES = [
  "You're crushing it! 🎉",
  "Habit hero in action! 🦸",
  "Look at you go! 🚀",
  "Unstoppable! 💪",
  "You're on fire! 🔥",
  "Keep the magic alive! ✨"
];

export default function HabitsScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [lovedHabits, setLovedHabits] = useState<HabitData[]>([]);
  const [suggestedHabits, setSuggestedHabits] = useState<HabitData[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [totalStreak, setTotalStreak] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [selectedHabit, setSelectedHabit] = useState<HabitData | null>(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  
  const insets = useSafeAreaInsets();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef<Record<string, Animated.Value>>({}).current;
  const rotateAnims = useRef<Record<string, Animated.Value>>({}).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    loadHabits();
    startAnimations();
  }, []);

  useEffect(() => {
    // Update progress
    const progress = lovedHabits.length > 0 ? completedToday / lovedHabits.length : 0;
    Animated.spring(progressAnim, {
      toValue: progress,
      damping: 15,
      useNativeDriver: false,
    }).start();

    // Check for celebrations
    if (completedToday === lovedHabits.length && lovedHabits.length > 0) {
      celebrate('all');
    }
  }, [completedToday, lovedHabits.length]);

  const startAnimations = () => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loadHabits = async () => {
    const profile = await StorageService.getUserProfile();
    const dailyTips = await StorageService.getDailyTips();
    
    if (!profile) return;
    setUserProfile(profile);

    // Get loved tips (ones marked as 'went_great')
    const lovedTipIds = new Set<string>();
    const habitMap: Record<string, HabitData> = {};
    
    dailyTips.forEach(tip => {
      if (tip.evening_check_in === 'went_great') {
        lovedTipIds.add(tip.tip_id);
      }
    });

    // Create habit data for loved tips
    const today = new Date().toDateString();
    const lovedHabitsList: HabitData[] = [];
    
    Array.from(lovedTipIds).forEach((tipId, index) => {
      const tipData = getTipById(tipId);
      const tipHistory = dailyTips.filter(dt => dt.tip_id === tipId);
      const completions = tipHistory.filter(t => t.evening_check_in === 'went_great').length;
      
      // Initialize animations for this habit
      if (!scaleAnims[tipId]) {
        scaleAnims[tipId] = new Animated.Value(0.9);
        rotateAnims[tipId] = new Animated.Value(0);
      }
      
      // Calculate streak
      const streak = calculateStreak(tipHistory);
      const bestStreak = calculateBestStreak(tipHistory);
      
      lovedHabitsList.push({
        tipId,
        title: tipData?.summary || 'Habit',
        emoji: HABIT_EMOJIS[index % HABIT_EMOJIS.length],
        timeEstimate: getTimeDisplay(tipData?.time_cost_enum),
        completedToday: false, // Will be loaded from storage
        streak,
        bestStreak,
        totalDays: completions,
        isLoved: true,
        category: tipData?.tip_type?.[0],
      });
    });

    // Load today's completions from storage
    const todayCompletions = await loadTodayCompletions();
    lovedHabitsList.forEach(habit => {
      habit.completedToday = todayCompletions.has(habit.tipId);
    });

    setLovedHabits(lovedHabitsList);
    setCompletedToday(lovedHabitsList.filter(h => h.completedToday).length);

    // Animate entrance
    lovedHabitsList.forEach((habit, index) => {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.spring(scaleAnims[habit.tipId], {
          toValue: 1,
          damping: 10,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Calculate total streak
    const overallStreak = Math.max(...lovedHabitsList.map(h => h.streak), 0);
    setTotalStreak(overallStreak);
  };

  const calculateStreak = (history: DailyTip[]): number => {
    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.presented_date).getTime() - new Date(a.presented_date).getTime()
    );
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const tip of sortedHistory) {
      if (tip.evening_check_in === 'went_great') {
        const tipDate = new Date(tip.presented_date);
        tipDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today.getTime() - tipDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    return streak;
  };

  const calculateBestStreak = (history: DailyTip[]): number => {
    let currentStreak = 0;
    let bestStreak = 0;
    
    const sortedHistory = [...history].sort((a, b) => 
      new Date(a.presented_date).getTime() - new Date(b.presented_date).getTime()
    );
    
    sortedHistory.forEach(tip => {
      if (tip.evening_check_in === 'went_great') {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return bestStreak;
  };

  const getTimeDisplay = (timeCost?: string): string => {
    if (!timeCost) return '5 min';
    switch (timeCost) {
      case '0_5_min': return '< 5 min';
      case '5_15_min': return '10 min';
      case '15_60_min': return '30 min';
      default: return '60+ min';
    }
  };

  const loadTodayCompletions = async (): Promise<Set<string>> => {
    // In a real app, load from AsyncStorage
    // For now, return empty set
    return new Set();
  };

  const saveTodayCompletions = async (completions: Set<string>) => {
    // Save to AsyncStorage
    const today = new Date().toDateString();
    await StorageService.setItem(`habit_completions_${today}`, JSON.stringify(Array.from(completions)));
  };

  const toggleHabitCompletion = async (habitId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const habit = lovedHabits.find(h => h.tipId === habitId);
    if (!habit) return;
    
    const newCompleted = !habit.completedToday;
    
    // Animate the change
    if (newCompleted) {
      // Celebration animation
      Animated.sequence([
        Animated.spring(scaleAnims[habitId], {
          toValue: 1.2,
          damping: 5,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnims[habitId], {
          toValue: 1,
          damping: 10,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Rotate animation for fun
      Animated.timing(rotateAnims[habitId], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        rotateAnims[habitId].setValue(0);
      });
      
      // Check for milestone
      if (habit.streak === 6) { // About to hit 7-day streak
        celebrate('streak');
      }
    }
    
    // Update state
    const updatedHabits = lovedHabits.map(h => {
      if (h.tipId === habitId) {
        return { ...h, completedToday: newCompleted };
      }
      return h;
    });
    
    setLovedHabits(updatedHabits);
    setCompletedToday(updatedHabits.filter(h => h.completedToday).length);
    
    // Save to storage
    const completions = new Set(updatedHabits.filter(h => h.completedToday).map(h => h.tipId));
    await saveTodayCompletions(completions);
  };

  const celebrate = (type: 'all' | 'streak' | 'milestone') => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const messages = {
      all: "Perfect Day! All habits completed! 🎉",
      streak: "7-Day Streak! You're unstoppable! 🔥",
      milestone: "New milestone reached! 🏆"
    };
    
    setCelebrationMessage(messages[type]);
    setShowConfetti(true);
    confettiRef.current?.start();
    
    setTimeout(() => {
      setShowConfetti(false);
      setCelebrationMessage('');
    }, 3000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const renderHabitCard = (habit: HabitData) => {
    const scaleValue = scaleAnims[habit.tipId] || new Animated.Value(1);
    const rotateValue = rotateAnims[habit.tipId] || new Animated.Value(0);
    
    const spin = rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    
    return (
      <Animated.View
        key={habit.tipId}
        style={[
          styles.habitCard,
          {
            transform: [
              { scale: scaleValue },
              { rotate: spin }
            ]
          }
        ]}
      >
        <Pressable
          onPress={() => toggleHabitCompletion(habit.tipId)}
          onLongPress={() => setSelectedHabit(habit)}
          style={({ pressed }) => [
            styles.habitPressable,
            pressed && styles.habitPressed,
            habit.completedToday && styles.habitCompleted
          ]}
        >
          <LinearGradient
            colors={habit.completedToday ? 
              ['#E8F5E9', '#C8E6C9'] : 
              ['#FFFFFF', '#FAFAFA']
            }
            style={styles.habitGradient}
          >
            {/* Emoji Badge */}
            <View style={[
              styles.habitEmoji,
              habit.completedToday && styles.habitEmojiCompleted
            ]}>
              <Text style={styles.emojiText}>{habit.emoji}</Text>
              {habit.completedToday && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
              )}
            </View>
            
            {/* Habit Info */}
            <Text style={[
              styles.habitTitle,
              habit.completedToday && styles.habitTitleCompleted
            ]} numberOfLines={2}>
              {habit.title}
            </Text>
            
            {/* Stats Row */}
            <View style={styles.habitStats}>
              {habit.streak > 0 && (
                <View style={styles.statBadge}>
                  <Ionicons name="flame" size={12} color="#FF6B6B" />
                  <Text style={styles.statText}>{habit.streak}</Text>
                </View>
              )}
              <View style={styles.statBadge}>
                <Ionicons name="time-outline" size={12} color="#666" />
                <Text style={styles.statText}>{habit.timeEstimate}</Text>
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMotivation = () => {
    const progress = lovedHabits.length > 0 ? completedToday / lovedHabits.length : 0;
    
    if (progress === 0) {
      return "Ready to make today amazing? 🌟";
    } else if (progress < 0.5) {
      return "Great start! Keep going! 💪";
    } else if (progress < 1) {
      return "Almost there! Finish strong! 🎯";
    } else {
      return "Perfect! You're incredible! 🎉";
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <LinearGradient
            colors={['#E8F5E9', '#FFFFFF']}
            style={styles.header}
          >
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>{userProfile?.name || 'Habit Hero'}</Text>
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddHabit(true)}
              >
                <LinearGradient
                  colors={['#4CAF50', '#66BB6A']}
                  style={styles.addGradient}
                >
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {/* Today's Progress */}
            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>Today's Progress</Text>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }
                  ]}
                />
                {/* Progress dots */}
                {lovedHabits.map((_, index) => (
                  <View 
                    key={index}
                    style={[
                      styles.progressDot,
                      { left: `${(index / Math.max(lovedHabits.length - 1, 1)) * 100}%` }
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.progressText}>
                {completedToday} of {lovedHabits.length} habits completed
              </Text>
              <Text style={styles.motivationText}>{getMotivation()}</Text>
            </View>
            
            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#FFE0B2', '#FFCC80']}
                  style={styles.statGradient}
                >
                  <Ionicons name="flame" size={20} color="#FF6B35" />
                  <Text style={styles.statNumber}>{totalStreak}</Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#E1BEE7', '#CE93D8']}
                  style={styles.statGradient}
                >
                  <Ionicons name="star" size={20} color="#8E24AA" />
                  <Text style={styles.statNumber}>{lovedHabits.length}</Text>
                  <Text style={styles.statLabel}>Loved Habits</Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#BBDEFB', '#90CAF9']}
                  style={styles.statGradient}
                >
                  <Ionicons name="trending-up" size={20} color="#1976D2" />
                  <Text style={styles.statNumber}>
                    {lovedHabits.reduce((sum, h) => sum + h.totalDays, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Total Days</Text>
                </LinearGradient>
              </View>
            </View>
          </LinearGradient>

          {/* Loved Habits Grid */}
          <View style={styles.habitsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Daily Habits</Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.seeAll}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            {lovedHabits.length > 0 ? (
              <View style={styles.habitsGrid}>
                {lovedHabits.map(renderHabitCard)}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
                  <Text style={styles.emptyEmoji}>🌱</Text>
                </Animated.View>
                <Text style={styles.emptyTitle}>No habits yet!</Text>
                <Text style={styles.emptyText}>
                  Complete experiments and mark your favorites to see them here
                </Text>
              </View>
            )}
          </View>

          {/* Streak Calendar Preview */}
          <View style={styles.calendarSection}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <View style={styles.weekView}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                const today = new Date().getDay();
                const isToday = index === today;
                const isPast = index < today;
                const hasHabits = isPast || isToday;
                
                return (
                  <View key={index} style={styles.dayColumn}>
                    <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                      {day}
                    </Text>
                    <View style={[
                      styles.dayCircle,
                      isToday && styles.dayCircleToday,
                      hasHabits && completedToday > 0 && styles.dayCircleActive
                    ]}>
                      {hasHabits && completedToday === lovedHabits.length && (
                        <Ionicons name="checkmark" size={16} color="#4CAF50" />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Celebration Overlay */}
      {showConfetti && (
        <View style={styles.celebrationOverlay}>
          <BlurView intensity={80} style={StyleSheet.absoluteFillObject}>
            <View style={styles.celebrationContent}>
              <Text style={styles.celebrationText}>{celebrationMessage}</Text>
            </View>
          </BlurView>
        </View>
      )}

      {/* Confetti */}
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={50}
          origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
          fadeOut
        />
      )}

      {/* Habit Detail Modal */}
      {selectedHabit && (
        <Modal
          visible={!!selectedHabit}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedHabit(null)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setSelectedHabit(null)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{selectedHabit.title}</Text>
              
              <View style={styles.modalStats}>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatValue}>{selectedHabit.streak}</Text>
                  <Text style={styles.modalStatLabel}>Current Streak</Text>
                </View>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatValue}>{selectedHabit.bestStreak}</Text>
                  <Text style={styles.modalStatLabel}>Best Streak</Text>
                </View>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatValue}>{selectedHabit.totalDays}</Text>
                  <Text style={styles.modalStatLabel}>Total Days</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setSelectedHabit(null)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addGradient: {
    padding: 10,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressDot: {
    position: 'absolute',
    top: 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  motivationText: {
    fontSize: 15,
    color: '#424242',
    fontWeight: '500',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  habitsSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAll: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  habitCard: {
    width: (SCREEN_WIDTH - 56) / 2,
    marginBottom: 12,
  },
  habitPressable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  habitPressed: {
    opacity: 0.8,
  },
  habitCompleted: {
    transform: [{ scale: 0.98 }],
  },
  habitGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 20,
  },
  habitEmoji: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitEmojiCompleted: {
    backgroundColor: '#E8F5E9',
  },
  emojiText: {
    fontSize: 24,
  },
  checkmark: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  habitTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#424242',
    textAlign: 'center',
    flex: 1,
  },
  habitTitleCompleted: {
    color: '#666',
  },
  habitStats: {
    flexDirection: 'row',
    gap: 6,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  statText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 60,
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
  calendarSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  weekView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  dayLabelToday: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircleToday: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  dayCircleActive: {
    backgroundColor: '#E8F5E9',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  celebrationContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});