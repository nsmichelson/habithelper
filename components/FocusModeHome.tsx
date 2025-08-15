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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import StorageService from '@/services/storage';
import { UserProfile, DailyTip } from '@/types/tip';
import { getTipById } from '@/data/tips';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HabitItem {
  tipId: string;
  title: string;
  timeEstimate: string;
  level: number;
  completedToday: boolean;
  currentStreak: number;
  totalCompletions: number;
  lastCompleted?: string;
}

interface Props {
  userProfile: UserProfile;
  onExitFocusMode: () => void;
  onOpenAdvancement: (tipId: string) => void;
  onWeeklyDiscovery: () => void;
}

export default function FocusModeHome({ 
  userProfile, 
  onExitFocusMode,
  onOpenAdvancement,
  onWeeklyDiscovery 
}: Props) {
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const checkAnims = useRef<Record<string, Animated.Value>>({}).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadHabits();
    
    // Entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    
    // Pulse animation for incomplete habits
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Update progress animation
    const progress = habits.length > 0 ? completedCount / habits.length : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
    
    // Celebrate if all completed
    if (completedCount === habits.length && habits.length > 0 && !showCelebration) {
      triggerCelebration();
    }
  }, [completedCount, habits.length]);

  const loadHabits = async () => {
    if (!userProfile.focusMode?.lovedTipIds) return;
    
    const habitProgress = userProfile.focusMode.habitProgress || {};
    const today = new Date().toDateString();
    
    const habitList: HabitItem[] = userProfile.focusMode.lovedTipIds.map(tipId => {
      const tip = getTipById(tipId);
      const progress = habitProgress[tipId] || {
        level: 1,
        completedToday: false,
        lastCompleted: '',
        totalCompletions: 0,
        currentStreak: 0,
      };
      
      // Reset completedToday if it's a new day
      if (progress.lastCompleted && new Date(progress.lastCompleted).toDateString() !== today) {
        progress.completedToday = false;
      }
      
      // Initialize animation value for this habit
      if (!checkAnims[tipId]) {
        checkAnims[tipId] = new Animated.Value(progress.completedToday ? 1 : 0);
      }
      
      return {
        tipId,
        title: tip?.summary || 'Habit',
        timeEstimate: getTimeEstimate(tip?.time_cost_enum, progress.level),
        level: progress.level,
        completedToday: progress.completedToday,
        currentStreak: progress.currentStreak,
        totalCompletions: progress.totalCompletions,
        lastCompleted: progress.lastCompleted,
      };
    });
    
    setHabits(habitList);
    setCompletedCount(habitList.filter(h => h.completedToday).length);
  };

  const getTimeEstimate = (basetime?: string, level: number = 1): string => {
    if (!basetime) return '5 min';
    
    // Increase time with level
    const multiplier = 1 + (level - 1) * 0.5;
    
    if (basetime === '0_5_min') {
      const minutes = Math.round(5 * multiplier);
      return `${minutes} min`;
    } else if (basetime === '5_15_min') {
      const minutes = Math.round(10 * multiplier);
      return `${minutes} min`;
    } else if (basetime === '15_60_min') {
      const minutes = Math.round(30 * multiplier);
      return `${minutes} min`;
    }
    return '60+ min';
  };

  const toggleHabitCompletion = async (habitId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const habit = habits.find(h => h.tipId === habitId);
    if (!habit) return;
    
    const newCompleted = !habit.completedToday;
    const today = new Date().toISOString();
    
    // Animate checkbox
    Animated.spring(checkAnims[habitId], {
      toValue: newCompleted ? 1 : 0,
      damping: 10,
      useNativeDriver: true,
    }).start();
    
    // Update local state
    const updatedHabits = habits.map(h => {
      if (h.tipId === habitId) {
        return {
          ...h,
          completedToday: newCompleted,
          lastCompleted: newCompleted ? today : h.lastCompleted,
          totalCompletions: newCompleted ? h.totalCompletions + 1 : Math.max(0, h.totalCompletions - 1),
          currentStreak: calculateStreak(h, newCompleted),
        };
      }
      return h;
    });
    
    setHabits(updatedHabits);
    setCompletedCount(updatedHabits.filter(h => h.completedToday).length);
    
    // Save to storage
    await updateHabitProgress(habitId, newCompleted);
  };

  const calculateStreak = (habit: HabitItem, completed: boolean): number => {
    if (!completed) return 0;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (habit.lastCompleted) {
      const lastDate = new Date(habit.lastCompleted);
      const daysDiff = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) return habit.currentStreak; // Same day
      if (daysDiff === 1) return habit.currentStreak + 1; // Consecutive day
    }
    
    return 1; // Start new streak
  };

  const updateHabitProgress = async (tipId: string, completed: boolean) => {
    const profile = await StorageService.getUserProfile();
    if (!profile?.focusMode) return;
    
    const progress = profile.focusMode.habitProgress || {};
    const habit = habits.find(h => h.tipId === tipId);
    
    progress[tipId] = {
      level: habit?.level || 1,
      completedToday: completed,
      lastCompleted: completed ? new Date().toISOString() : habit?.lastCompleted || '',
      totalCompletions: habit?.totalCompletions || 0,
      currentStreak: habit?.currentStreak || 0,
    };
    
    await StorageService.saveUserProfile({
      ...profile,
      focusMode: {
        ...profile.focusMode,
        habitProgress: progress,
      }
    });
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    Animated.sequence([
      Animated.spring(celebrationAnim, {
        toValue: 1,
        damping: 8,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(celebrationAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCelebration(false));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const getMotivationalMessage = () => {
    const progress = habits.length > 0 ? completedCount / habits.length : 0;
    
    if (progress === 0) {
      return "Ready to tackle your habits? You've got this! 💪";
    } else if (progress < 0.5) {
      return "Great start! Keep the momentum going! 🚀";
    } else if (progress < 1) {
      return "Almost there! Finish strong! 🎯";
    } else {
      return "Perfect day! All habits completed! 🌟";
    }
  };

  const isWeeklyDiscoveryDay = () => {
    const today = new Date().getDay();
    return today === (userProfile.focusMode?.weeklyDiscoveryDay || 1); // Default to Monday
  };

  return (
    <ScrollView 
      style={styles.container}
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
        {/* Focus Mode Header */}
        <LinearGradient
          colors={['#E8F5E9', '#FFFFFF']}
          style={styles.header}
        >
          <View style={styles.modeIndicator}>
            <View style={styles.modeBadge}>
              <Ionicons name="filter" size={16} color="#4CAF50" />
              <Text style={styles.modeText}>Focus Mode</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={onExitFocusMode}
            >
              <Ionicons name="settings-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.greeting}>Today's Habits</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
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
            </View>
            <Text style={styles.progressText}>
              {completedCount} of {habits.length} completed
            </Text>
          </View>
          
          <Text style={styles.motivationalText}>{getMotivationalMessage()}</Text>
        </LinearGradient>

        {/* Weekly Discovery Card */}
        {isWeeklyDiscoveryDay() && (
          <TouchableOpacity
            style={styles.discoveryCard}
            onPress={onWeeklyDiscovery}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFF8E1', '#FFE082']}
              style={styles.discoveryGradient}
            >
              <Ionicons name="sparkles" size={24} color="#F57C00" />
              <View style={styles.discoveryContent}>
                <Text style={styles.discoveryTitle}>Weekly Discovery</Text>
                <Text style={styles.discoveryText}>Try something new today!</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#F57C00" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Habits List */}
        <View style={styles.habitsContainer}>
          {habits.map((habit, index) => {
            const checkScale = checkAnims[habit.tipId]?.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1]
            }) || 1;
            
            return (
              <Animated.View
                key={habit.tipId}
                style={[
                  styles.habitCard,
                  {
                    transform: [
                      { scale: !habit.completedToday ? pulseAnim : 1 }
                    ]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.habitMain}
                  onPress={() => toggleHabitCompletion(habit.tipId)}
                  activeOpacity={0.7}
                >
                  <Animated.View 
                    style={[
                      styles.checkbox,
                      habit.completedToday && styles.checkboxCompleted,
                      { transform: [{ scale: checkScale }] }
                    ]}
                  >
                    {habit.completedToday && (
                      <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                    )}
                  </Animated.View>
                  
                  <View style={styles.habitInfo}>
                    <Text style={[
                      styles.habitTitle,
                      habit.completedToday && styles.habitTitleCompleted
                    ]}>
                      {habit.title}
                    </Text>
                    <View style={styles.habitMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={12} color="#999" />
                        <Text style={styles.metaText}>{habit.timeEstimate}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="cellular" size={12} color="#999" />
                        <Text style={styles.metaText}>Level {habit.level}</Text>
                      </View>
                      {habit.currentStreak > 0 && (
                        <View style={styles.metaItem}>
                          <Ionicons name="flame" size={12} color="#FF6B6B" />
                          <Text style={styles.metaText}>{habit.currentStreak} days</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.expandButton}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setExpandedHabit(expandedHabit === habit.tipId ? null : habit.tipId);
                    }}
                  >
                    <Ionicons 
                      name={expandedHabit === habit.tipId ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
                
                {expandedHabit === habit.tipId && (
                  <View style={styles.habitExpanded}>
                    <View style={styles.habitStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{habit.totalCompletions}</Text>
                        <Text style={styles.statLabel}>Total</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{habit.currentStreak}</Text>
                        <Text style={styles.statLabel}>Streak</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{habit.level}</Text>
                        <Text style={styles.statLabel}>Level</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.advanceButton}
                      onPress={() => onOpenAdvancement(habit.tipId)}
                    >
                      <LinearGradient
                        colors={['#4CAF50', '#66BB6A']}
                        style={styles.advanceGradient}
                      >
                        <Text style={styles.advanceText}>Advance This Habit</Text>
                        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <Text style={styles.quickStatsTitle}>This Week</Text>
          <View style={styles.statsRow}>
            <View style={styles.quickStatCard}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.quickStatValue}>
                {habits.reduce((sum, h) => sum + (h.completedToday ? 1 : 0), 0) * 7}
              </Text>
              <Text style={styles.quickStatLabel}>Completed</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Ionicons name="flame" size={24} color="#FF6B6B" />
              <Text style={styles.quickStatValue}>
                {Math.max(...habits.map(h => h.currentStreak), 0)}
              </Text>
              <Text style={styles.quickStatLabel}>Best Streak</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.quickStatValue}>
                {habits.filter(h => h.level > 1).length}
              </Text>
              <Text style={styles.quickStatLabel}>Advanced</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Celebration Overlay */}
      {showCelebration && (
        <Animated.View 
          style={[
            styles.celebrationOverlay,
            {
              opacity: celebrationAnim,
              transform: [{ scale: celebrationAnim }]
            }
          ]}
        >
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationText}>Perfect Day!</Text>
          <Text style={styles.celebrationSubtext}>All habits completed!</Text>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  modeIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  modeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  settingsButton: {
    padding: 8,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#666',
  },
  motivationalText: {
    fontSize: 15,
    color: '#424242',
    fontStyle: 'italic',
  },
  discoveryCard: {
    marginHorizontal: 24,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  discoveryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  discoveryContent: {
    flex: 1,
  },
  discoveryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F57C00',
    marginBottom: 2,
  },
  discoveryText: {
    fontSize: 13,
    color: '#F57C00',
    opacity: 0.8,
  },
  habitsContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  habitMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  habitTitleCompleted: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  habitMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  expandButton: {
    padding: 8,
  },
  habitExpanded: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 16,
  },
  habitStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#424242',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  advanceButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  advanceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  advanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickStats: {
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 40,
  },
  quickStatsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#424242',
    marginVertical: 8,
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#999',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  celebrationEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 4,
  },
  celebrationSubtext: {
    fontSize: 16,
    color: '#666',
  },
});