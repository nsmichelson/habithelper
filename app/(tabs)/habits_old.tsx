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
import Svg, { Circle, Line } from 'react-native-svg';
import { useCurrentDate } from '@/contexts/DateSimulationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HabitData {
  tipId: string;
  title: string;
  completedToday: number; // 0, 1, 2+ for multiple completions
  lastCompleted?: string;
  showUndo?: boolean;
  undoTimeout?: NodeJS.Timeout;
}

export default function HabitsScreen() {
  const currentDate = useCurrentDate();
  const [lovedHabits, setLovedHabits] = useState<HabitData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // Animations for each habit - move these BEFORE any conditional logic
  const scaleAnims = useRef<Record<string, Animated.Value>>({}).current;
  const progressAnims = useRef<Record<string, Animated.Value>>({}).current;
  const holdTimers = useRef<Record<string, NodeJS.Timeout>>({}).current;
  const justCompletedRef = useRef<Set<string>>(new Set()).current;

  // Ensure we have a stable reference to animation objects
  const getOrCreateAnimations = (tipId: string) => {
    if (!scaleAnims[tipId]) {
      scaleAnims[tipId] = new Animated.Value(1);
    }
    if (!progressAnims[tipId]) {
      progressAnims[tipId] = new Animated.Value(0);
    }
    return {
      scale: scaleAnims[tipId],
      progress: progressAnims[tipId]
    };
  };

  // Load habits when tab is focused
  useFocusEffect(
    useCallback(() => {
      console.log('Habits tab focused - loading habits');
      loadHabits();
    }, [])
  );

  // This will get new loved habits but preserve completion state
  const loadHabits = async () => {
    await refreshCompletionsOnly();
  };

  const refreshCompletionsOnly = async () => {
    console.log('  Refreshing completion states only...');
    const todayCompletions = await StorageService.getHabitCompletions(currentDate);

    setLovedHabits(prevHabits =>
      prevHabits.map(habit => ({
        ...habit,
        completedToday: todayCompletions.get(habit.tipId) || 0,
        showUndo: false,
        undoTimeout: undefined
      }))
    );
  };

  // When tab is focused, reload habits (but preserve animations)
  useEffect(() => {
    console.log('HabitsScreen mounted or focused');
    // We explicitly manage animations, so they don't need to be dependencies
    loadHabitsFromStorage();

    // Cleanup function
    return () => {
      // Clear all hold timers
      Object.values(holdTimers).forEach(timer => clearTimeout(timer));
      // Clear undo timeouts
      lovedHabits.forEach(habit => {
        if (habit.undoTimeout) {
          clearTimeout(habit.undoTimeout);
        }
      });
    };
  }, []);

  const loadHabitsFromStorage = async () => {
    console.log('\n=== LOADING HABITS FROM STORAGE ===');
    const allTips = await StorageService.getDailyTips();
    const todayCompletions = await loadTodayCompletions();

    console.log('All daily tips count:', allTips.length);
    console.log('Today completions:', Array.from(todayCompletions.entries()));

    // Debug: log all tips to see their structure
    if (allTips.length > 0) {
      console.log('Sample tip structure:', allTips[0]);
    }

    // Get loved tips (ones marked as 'went_great' in evening check-in OR quick completions)
    const lovedTipIds = new Set<string>();

    // Check all tips for 'went_great' status
    allTips.forEach(tip => {
      console.log(`  Checking tip ${tip.tip_id}:`);
      console.log('    - Evening check-in:', tip.evening_check_in);
      console.log('    - Quick completions:', tip.quick_completions?.length || 0);
      console.log('    - Is "went_great"?', tip.evening_check_in === 'went_great');
      if (tip.evening_check_in === 'went_great') {
        console.log('    ✓ Added to loved tips (went_great)');
        lovedTipIds.add(tip.tip_id);
      }

      // Also check quick completions for "worked_great" feedback
      if (tip.quick_completions && tip.quick_completions.length > 0) {
        tip.quick_completions.forEach(qc => {
          console.log('      Quick completion note:', qc.quick_note);
          if (qc.quick_note === 'worked_great') {
            console.log('    ✓ Added to loved tips (quick completion worked_great)');
            lovedTipIds.add(tip.tip_id);
          }
        });
      }
    });

    console.log('Total loved tip IDs found:', lovedTipIds.size);
    console.log('Loved tip IDs:', Array.from(lovedTipIds));

    // Create habit data for loved tips
    const lovedHabitsList: HabitData[] = [];

    if (lovedTipIds.size > 0) {
      Array.from(lovedTipIds).forEach((tipId, index) => {
        const tipData = getTipById(tipId);
        console.log(`  Getting tip data for ${tipId}:`, tipData ? 'Found' : 'Not found');

        if (!tipData) {
          console.warn(`  ⚠️ Tip ${tipId} not found in tips database`);
        }

        const completionCount = todayCompletions.get(tipId) || 0;
        console.log(`  Tip ${tipId} completion count today:`, completionCount);

        const habitData: HabitData = {
          tipId,
          title: tipData?.summary || `Habit ${index + 1}`,
          completedToday: completionCount,
        };

        // Initialize animation values
        const { progress } = getOrCreateAnimations(tipId);
        if (completionCount > 0) {
          progress.setValue(1); // Set to completed state
        } else {
          progress.setValue(0);
        }

        lovedHabitsList.push(habitData);
      });
    } else {
      console.log('No loved habits found');
    }

    // Debug animations state
    console.log('\n=== ANIMATIONS STATE ===');
    lovedHabitsList.forEach(habit => {
      const hasAnim = !!progressAnims[habit.tipId];
      console.log(`  ${habit.tipId}: Animation exists:`, hasAnim);
      if (hasAnim) {
        console.log(`    Current value: attempting to read...`);
        // We can't easily read the value, but we know it exists
      }
    });

    console.log('Total habits to display:', lovedHabitsList.length);
    lovedHabitsList.forEach((habit, index) => {
      console.log(`  ${index + 1}. ${habit.title.substring(0, 30)}... (completed: ${habit.completedToday}x)`);
    });

    console.log('  About to set lovedHabits state with', lovedHabitsList.length, 'habits');
    setLovedHabits(lovedHabitsList);
  };

  const loadTodayCompletions = async (): Promise<Map<string, number>> => {
    console.log('    Loading completions from centralized storage');
    const completions = await StorageService.getHabitCompletions(currentDate);
    console.log('    Loaded completions:', Array.from(completions.entries()));
    return completions;
  };

  const saveTodayCompletions = async (completions: Map<string, number>) => {
    console.log('  💾 Saving completions:', Array.from(completions.entries()));
    // Save each completion individually to the centralized storage
    for (const [tipId, count] of completions.entries()) {
      await StorageService.setHabitCompletion(tipId, count, currentDate);
    }
    // Also clear any that were set to 0
    const allCompletions = await StorageService.getHabitCompletions(currentDate);
    for (const [tipId] of allCompletions.entries()) {
      if (!completions.has(tipId)) {
        await StorageService.setHabitCompletion(tipId, 0, currentDate);
      }
    }
  };

  const handlePressIn = (habitId: string) => {
    console.log('\n📱 PRESS IN:', habitId);
    console.log('  Current lovedHabits state:', lovedHabits.map(h => ({
      id: h.tipId,
      completed: h.completedToday
    })));
    const habit = lovedHabits.find(h => h.tipId === habitId);
    if (!habit) return;

    const { scale, progress } = getOrCreateAnimations(habitId);

    // Only start hold timer if not already completed
    if (habit.completedToday === 0) {
      console.log('  Starting hold animation for uncompleted habit');
      // Start press animation
      Animated.spring(scale, {
        toValue: 0.95,
        damping: 10,
        useNativeDriver: true,
      }).start();

      // Start progress animation
      const timer = setTimeout(() => {
        console.log('  Hold timer fired - starting progress animation');
        Animated.timing(progress, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }).start((finished) => {
          if (finished) {
            console.log('  Progress animation completed');
            // Mark as completed
            handleComplete(habitId);
          } else {
            console.log('  Progress animation interrupted');
          }
        });
      }, 100); // Small delay before starting progress

      holdTimers[habitId] = timer;
    } else {
      console.log('  Habit already completed, not starting hold timer');
    }
  };

  const handlePressOut = (habitId: string) => {
    console.log('\n📱 PRESS OUT:', habitId);

    const habit = lovedHabits.find(h => h.tipId === habitId);
    if (!habit) return;

    const { scale, progress } = getOrCreateAnimations(habitId);

    // Clear hold timer
    if (holdTimers[habitId]) {
      console.log('  Clearing hold timer');
      clearTimeout(holdTimers[habitId]);
      delete holdTimers[habitId];
    }

    // Reset scale
    Animated.spring(scale, {
      toValue: 1,
      damping: 10,
      useNativeDriver: true,
    }).start();

    // Stop and reset progress if not completed
    if (habit.completedToday === 0) {
      console.log('  Resetting progress animation');
      progress.stopAnimation(() => {
        Animated.timing(progress, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    }
  };

  const handleComplete = (habitId: string) => {
    console.log('\n✅ COMPLETE:', habitId);
    const habit = lovedHabits.find(h => h.tipId === habitId);
    if (!habit || habit.completedToday > 0) {
      console.log('  Habit not found or already completed, skipping');
      return;
    }

    console.log('  Marking habit as completed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Mark this habit as just completed
    justCompletedRef.add(habitId);
    setTimeout(() => {
      justCompletedRef.delete(habitId);
    }, 500);

    // Update state
    const updatedHabits = lovedHabits.map(h => {
      if (h.tipId === habitId) {
        return { ...h, completedToday: 1 };
      }
      return h;
    });
    setLovedHabits(updatedHabits);

    // Save to storage
    saveTodayCompletions(new Map(
      updatedHabits
        .filter(h => h.completedToday > 0)
        .map(h => [h.tipId, h.completedToday])
    ));

    // Ensure animation is at completed state
    const { scale, progress } = getOrCreateAnimations(habitId);
    progress.setValue(1);

    // Bounce animation for feedback
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.1,
        damping: 10,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleUndo = (habitId: string) => {
    const habit = lovedHabits.find(h => h.tipId === habitId);
    if (!habit || habit.completedToday === 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Decrement the count
    const newCount = habit.completedToday - 1;

    // Clear undo timeout
    if (habit.undoTimeout) {
      clearTimeout(habit.undoTimeout);
    }

    // Update state
    const updatedHabits = lovedHabits.map(h => {
      if (h.tipId === habitId) {
        return {
          ...h,
          completedToday: newCount,
          showUndo: false,
          undoTimeout: undefined
        };
      }
      return h;
    });
    setLovedHabits(updatedHabits);

    // Update animation if going back to 0
    if (newCount === 0) {
      const { progress } = getOrCreateAnimations(habitId);
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }

    // Save to storage
    saveTodayCompletions(new Map(
      updatedHabits
        .filter(h => h.completedToday > 0)
        .map(h => [h.tipId, h.completedToday])
    ));
  };

  const handleTap = (habitId: string) => {
    console.log('\n👆 TAP:', habitId);

    // Don't process tap if we just completed via hold
    if (justCompletedRef.has(habitId)) {
      console.log('  Ignoring tap - just completed via hold');
      return;
    }

    const habit = lovedHabits.find(h => h.tipId === habitId);
    if (!habit) return;

    console.log('  Current completion count:', habit.completedToday);

    // Allow tap to increment if already completed at least once
    if (habit.completedToday > 0) {
      // Increment the count
      const newCount = habit.completedToday + 1;
      console.log('  Adding completion, new count:', newCount);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Clear any existing undo timeout
      if (habit.undoTimeout) {
        clearTimeout(habit.undoTimeout);
      }

      // Set up new undo timeout
      const undoTimeout = setTimeout(() => {
        setLovedHabits(prev => prev.map(h => {
          if (h.tipId === habitId) {
            return { ...h, showUndo: false, undoTimeout: undefined };
          }
          return h;
        }));
      }, 3000); // Hide undo after 3 seconds

      // Update state with undo button visible
      const updatedHabits = lovedHabits.map(h => {
        if (h.tipId === habitId) {
          return {
            ...h,
            completedToday: newCount,
            showUndo: true,
            undoTimeout
          };
        }
        // Hide undo on other habits
        return { ...h, showUndo: false, undoTimeout: undefined };
      });
      setLovedHabits(updatedHabits);

      // Animate scale for feedback
      const { scale } = getOrCreateAnimations(habitId);
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.05,
          damping: 10,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          damping: 10,
          useNativeDriver: true,
        }),
      ]).start();

      // Save to storage
      saveTodayCompletions(new Map(
        updatedHabits
          .filter(h => h.completedToday > 0)
          .map(h => [h.tipId, h.completedToday])
      ));
    } else {
      console.log('  Tap ignored - use hold to complete first');
    }
  };

  const handleLongPress = (habitId: string) => {
    console.log('\n🔄 LONG PRESS (reset):', habitId);
    const habit = lovedHabits.find(h => h.tipId === habitId);
    if (!habit || habit.completedToday === 0) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Reset to 0 completions
    const updatedHabits = lovedHabits.map(h => {
      if (h.tipId === habitId) {
        return { ...h, completedToday: 0 };
      }
      return h;
    });
    setLovedHabits(updatedHabits);

    // Reset progress animation
    const { progress } = getOrCreateAnimations(habitId);
    Animated.timing(progress, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Save to storage
    saveTodayCompletions(new Map(
      updatedHabits
        .filter(h => h.completedToday > 0)
        .map(h => [h.tipId, h.completedToday])
    ));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  const renderHabitCircle = (habit: HabitData, index: number) => {
    const { scale: scaleValue, progress: progressValue } = getOrCreateAnimations(habit.tipId);

    // Determine if completed
    const isCompleted = habit.completedToday > 0;
    const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    const baseSize = 80;
    const ringSpacing = 5;
    const strokeWidth = 3;
    // Support up to 5 rings, then show 5+
    const maxVisibleRings = 5;
    const ringsToShow = Math.min(habit.completedToday - 1, maxVisibleRings - 1);
    const size = baseSize + (maxVisibleRings * (strokeWidth + ringSpacing) * 2);
    const center = size / 2;
    const baseRadius = baseSize / 2 - strokeWidth;

    // Calculate progress for the main circle fill
    const circumference = baseRadius * 2 * Math.PI;
    const strokeDashoffset = progressValue.interpolate({
      inputRange: [0, 1],
      outputRange: [circumference, 0],
    });

    return (
      <View key={habit.tipId} style={styles.habitItem}>
        <View style={styles.habitWrapper}>
          <Pressable
            onPressIn={() => handlePressIn(habit.tipId)}
            onPressOut={() => handlePressOut(habit.tipId)}
            onPress={() => handleTap(habit.tipId)}
            onLongPress={() => handleLongPress(habit.tipId)}
            delayLongPress={1000}
            style={styles.habitPressable}
          >
            <Animated.View
              style={[
                styles.habitCircleContainer,
                { transform: [{ scale: scaleValue }] }
              ]}
            >
              <Svg width={size} height={size} style={styles.habitCircle}>
                {/* Render concentric rings for completions */}
                {habit.completedToday > 1 && Array.from({ length: ringsToShow }, (_, i) => {
                  const ringRadius = baseRadius + ((i + 1) * (strokeWidth + ringSpacing));
                  return (
                    <Circle
                      key={`ring-${i}`}
                      stroke="#22C55E"
                      fill="transparent"
                      cx={center}
                      cy={center}
                      r={ringRadius}
                      strokeWidth={strokeWidth}
                      opacity={0.8 - (i * 0.1)}  // Gentle fade for outer rings
                    />
                  );
                })}

                {/* Background circle */}
                <Circle
                  stroke={isCompleted ? "#22C55E" : "#e0e0e0"}
                  fill="white"
                  cx={center}
                  cy={center}
                  r={baseRadius}
                  strokeWidth={strokeWidth}
                />

                {/* Progress circle for initial hold completion */}
                <AnimatedCircle
                  stroke="#22C55E"
                  fill="transparent"
                  cx={center}
                  cy={center}
                  r={baseRadius}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(-90, ${center}, ${center})`}
                />
              </Svg>

              {/* Display in center of circle */}
              <View style={styles.completionIconContainer}>
                {habit.completedToday === 0 && (
                  <View />
                )}
                {habit.completedToday === 1 && (
                  <Ionicons name="checkmark" size={28} color="#22C55E" />
                )}
                {habit.completedToday > 1 && (
                  <Text style={styles.completionNumberText}>
                    {habit.completedToday >= 5 ? '5+' : habit.completedToday}
                  </Text>
                )}
              </View>
            </Animated.View>
          </Pressable>

          {/* Undo button */}
          {habit.showUndo && (
            <Pressable
              onPress={() => handleUndo(habit.tipId)}
              style={styles.undoButton}
            >
              <Ionicons name="arrow-undo" size={16} color="#666" />
              <Text style={styles.undoText}>Undo</Text>
            </Pressable>
          )}
        </View>

        <Text style={[
          styles.habitTitle,
          isCompleted && styles.habitTitleCompleted
        ]} numberOfLines={2}>
          {habit.title}
        </Text>
        {isCompleted && habit.completedToday > 1 && (
          <Text style={styles.completionCount}>
            {habit.completedToday}x today
          </Text>
        )}
      </View>
    );
  };

  const completedCount = lovedHabits.filter(h => h.completedToday > 0).length;
  const totalCount = lovedHabits.length;

  // Debug log current state
  console.log('\n🎯 RENDER: Habits tab rendering with', lovedHabits.length, 'habits');
  if (lovedHabits.length > 0) {
    console.log('  Habits to display:', lovedHabits.map(h => ({
      id: h.tipId,
      title: h.title.substring(0, 30) + '...',
      completedToday: h.completedToday
    })));
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FBF8']}
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
          {/* Simple Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Loved Habits (OLD)</Text>
            <Text style={styles.headerSubtitle}>
              {completedCount} of {totalCount} completed today
            </Text>
          </View>

          {/* Progress Bar */}
          {totalCount > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(completedCount / totalCount) * 100}%` }
                  ]}
                />
              </View>
            </View>
          )}

          {/* Habits Grid */}
          {lovedHabits.length > 0 ? (
            <View style={styles.habitsGrid}>
              {lovedHabits.map((habit, index) => renderHabitCircle(habit, index))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🌱</Text>
              <Text style={styles.emptyTitle}>No loved habits yet!</Text>
              <Text style={styles.emptyText}>
                Complete experiments and mark your favorites{'\n'}to see them here
              </Text>
            </View>
          )}

          {/* Instructions */}
          {lovedHabits.length > 0 && (
            <View style={styles.instructions}>
              <Text style={styles.instructionText}>
                Hold a circle to check off a habit
              </Text>
              <Text style={styles.instructionText}>
                Tap to add more completions (up to 4) • Long press to reset
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  habitItem: {
    width: SCREEN_WIDTH / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  habitWrapper: {
    alignItems: 'center',
  },
  habitPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionIconContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionNumberText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22C55E',
  },
  habitTitle: {
    marginTop: 8,
    fontSize: 12,
    color: '#424242',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  habitTitleCompleted: {
    color: '#22C55E',
    fontWeight: '600',
  },
  completionCount: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  undoButton: {
    position: 'absolute',
    bottom: -25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  undoText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
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
  instructions: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});