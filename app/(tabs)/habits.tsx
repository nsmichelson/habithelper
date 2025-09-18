import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  RefreshControl,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import StorageService from '@/services/storage';
import { DailyTip } from '@/types/tip';
import { getTipById } from '@/data/tips';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useCurrentDate } from '@/contexts/DateSimulationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HabitData {
  tipId: string;
  title: string;
  completedToday: number;
  lastCompleted?: string;
  streak?: number;
}

export default function HabitsScreen() {
  const currentDate = useCurrentDate();
  const [lovedHabits, setLovedHabits] = useState<HabitData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      console.log('Habits tab focused - loading habits');
      loadHabits();
    }, [])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadHabits = async () => {
    try {
      console.log('Loading habits...');
      const [allTips, todayCompletions] = await Promise.all([
        StorageService.getDailyTips(),
        StorageService.getHabitCompletions(currentDate)
      ]);

      // Find loved tips (marked as 'went_great' in evening check-in)
      const lovedTipIds = new Set<string>();

      allTips.forEach(tip => {
        if (tip.evening_check_in === 'went_great') {
          lovedTipIds.add(tip.tip_id);
        }
        // Also check quick completions for 'worked_great'
        if (tip.quick_completions?.some(qc => qc.quick_note === 'worked_great')) {
          lovedTipIds.add(tip.tip_id);
        }
      });

      console.log('Found', lovedTipIds.size, 'loved habits:', Array.from(lovedTipIds));

      const habitData: HabitData[] = Array.from(lovedTipIds).map(tipId => {
        const tip = getTipById(tipId);
        const completionCount = todayCompletions.get(tipId) || 0;

        // Calculate streak (simplified)
        const tipHistory = allTips.filter(t => t.tip_id === tipId && t.evening_check_in === 'went_great');
        const streak = tipHistory.length;

        return {
          tipId,
          title: tip?.summary || 'Unknown habit',
          completedToday: completionCount,
          streak,
        };
      });

      setLovedHabits(habitData);

      // Animate progress bar
      const completedCount = habitData.filter(h => h.completedToday > 0).length;
      const totalCount = habitData.length;
      if (totalCount > 0) {
        Animated.timing(progressAnim, {
          toValue: completedCount / totalCount,
          duration: 800,
          useNativeDriver: false,
        }).start();
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const handleHabitToggle = async (habitId: string) => {
    const habit = lovedHabits.find(h => h.tipId === habitId);
    if (!habit) return;

    const newCount = habit.completedToday === 0 ? 1 : 0;

    // Haptic feedback
    Haptics.impactAsync(
      newCount > 0 ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
    );

    // Update state
    setLovedHabits(prev => prev.map(h =>
      h.tipId === habitId ? { ...h, completedToday: newCount } : h
    ));

    // Save to storage
    await StorageService.setHabitCompletion(habitId, newCount, currentDate);

    // Update progress animation
    const updatedHabits = lovedHabits.map(h =>
      h.tipId === habitId ? { ...h, completedToday: newCount } : h
    );
    const completedCount = updatedHabits.filter(h => h.completedToday > 0).length;
    const totalCount = updatedHabits.length;

    Animated.timing(progressAnim, {
      toValue: completedCount / totalCount,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleIncrement = async (habitId: string) => {
    const habit = lovedHabits.find(h => h.tipId === habitId);
    if (!habit || habit.completedToday >= 5) return;

    const newCount = habit.completedToday + 1;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setLovedHabits(prev => prev.map(h =>
      h.tipId === habitId ? { ...h, completedToday: newCount } : h
    ));

    await StorageService.setHabitCompletion(habitId, newCount, currentDate);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  // Animation refs for habit cards - create them outside the render function
  const cardAnimations = useRef<{[key: string]: {fade: Animated.Value, scale: Animated.Value}}>({}).current;

  const getOrCreateCardAnimation = (tipId: string) => {
    if (!cardAnimations[tipId]) {
      cardAnimations[tipId] = {
        fade: new Animated.Value(0),
        scale: new Animated.Value(1),
      };
    }
    return cardAnimations[tipId];
  };

  // Animate cards when habits change
  useEffect(() => {
    lovedHabits.forEach((habit, index) => {
      const anims = getOrCreateCardAnimation(habit.tipId);
      Animated.timing(anims.fade, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, [lovedHabits]);

  const renderHabitCard = (habit: HabitData, index: number) => {
    const isCompleted = habit.completedToday > 0;
    const anims = getOrCreateCardAnimation(habit.tipId);

    return (
      <Animated.View
        key={habit.tipId}
        style={[
          styles.habitCard,
          {
            opacity: anims.fade,
            transform: [
              {
                translateY: anims.fade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
              { scale: anims.scale }
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleHabitToggle(habit.tipId)}
          onPressIn={() => {
            Animated.spring(anims.scale, {
              toValue: 0.98,
              useNativeDriver: true,
            }).start();
          }}
          onPressOut={() => {
            Animated.spring(anims.scale, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          }}
        >
          <View style={styles.cardContent}>
            {/* Checkbox */}
            <View style={styles.checkboxContainer}>
              <View style={[
                styles.checkbox,
                isCompleted && styles.checkboxCompleted
              ]}>
                {isCompleted && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </View>
            </View>

            {/* Habit Info */}
            <View style={styles.habitInfo}>
              <Text style={[
                styles.habitTitle,
                isCompleted && styles.habitTitleCompleted
              ]} numberOfLines={2}>
                {habit.title}
              </Text>

              <View style={styles.habitMeta}>
                {habit.streak && habit.streak > 0 && (
                  <View style={styles.streakBadge}>
                    <Ionicons name="flame" size={12} color="#FF6B35" />
                    <Text style={styles.streakText}>{habit.streak}</Text>
                  </View>
                )}

                {habit.completedToday > 1 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{habit.completedToday}x</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Action Button */}
            {isCompleted && habit.completedToday < 5 && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleIncrement(habit.tipId)}
              >
                <Ionicons name="add-circle" size={28} color="#4CAF50" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const completedCount = lovedHabits.filter(h => h.completedToday > 0).length;
  const totalCount = lovedHabits.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#E8F5E9', '#F5F5F5', '#FFFFFF']}
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
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Daily Habits</Text>
                <Text style={styles.subtitle}>
                  {completedCount === 0 ? "Start your day right!" :
                   completedCount === totalCount ? "Perfect! All done 🎉" :
                   `${completedCount} of ${totalCount} completed`}
                </Text>
              </View>

              {totalCount > 0 && (
                <View style={styles.progressCircle}>
                  <Text style={styles.progressText}>{progressPercentage}%</Text>
                </View>
              )}
            </View>

            {/* Progress Bar */}
            {totalCount > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Habits List */}
            {lovedHabits.length > 0 ? (
              <View style={styles.habitsContainer}>
                {lovedHabits.map((habit, index) => renderHabitCard(habit, index))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="heart-outline" size={64} color="#E0E0E0" />
                </View>
                <Text style={styles.emptyTitle}>No habits yet</Text>
                <Text style={styles.emptyText}>
                  Love experiments to add them{'\n'}as daily habits
                </Text>
              </View>
            )}

            {/* Tips */}
            {lovedHabits.length > 0 && (
              <View style={styles.tipsContainer}>
                <View style={styles.tipCard}>
                  <Ionicons name="bulb-outline" size={20} color="#FF9800" />
                  <Text style={styles.tipText}>
                    Tap to complete • Tap + to add more completions
                  </Text>
                </View>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 4,
  },
  progressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  habitsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  habitCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    color: '#212121',
    marginBottom: 4,
  },
  habitTitleCompleted: {
    color: '#757575',
    textDecorationLine: 'line-through',
  },
  habitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  streakText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginLeft: 4,
  },
  countBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  addButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 20,
  },
  tipsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 13,
    color: '#F57C00',
    marginLeft: 10,
    flex: 1,
  },
});