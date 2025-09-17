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
  const [lovedHabits, setLovedHabits] = useState<HabitData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // Animations for each habit
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
    return { scale: scaleAnims[tipId], progress: progressAnims[tipId] };
  };

  useEffect(() => {
    loadHabits();
  }, []);

  // Refresh habits whenever the tab comes into focus
  // This will get new loved habits but preserve completion state
  useFocusEffect(
    useCallback(() => {
      console.log('\n📱 HABITS TAB FOCUSED - Refreshing...');
      loadHabits();
    }, [])
  );

  const refreshCompletionsOnly = async () => {
    console.log('  Refreshing completion states only...');
    const todayCompletions = await loadTodayCompletions();

    setLovedHabits(prevHabits =>
      prevHabits.map(habit => {
        const completionCount = todayCompletions.get(habit.tipId) || 0;
        const { progress } = getOrCreateAnimations(habit.tipId);

        if (completionCount > 0) {
          progress.setValue(1);  // Circle filled when completed
        } else {
          progress.setValue(0);
        }

        return { ...habit, completedToday: completionCount };
      })
    );
  };

  const loadHabits = async () => {
    try {
      console.log('\n\n=== HABITS TAB: LOADING LOVED HABITS ===');
      console.log('Timestamp:', new Date().toISOString());

      const dailyTips = await StorageService.getDailyTips();

    console.log('\n1. RAW DATA FROM STORAGE:');
    console.log('Total daily tips retrieved:', dailyTips.length);

    // Log each tip in detail
    dailyTips.forEach((tip, index) => {
      console.log(`\n  Tip ${index + 1}:`);
      console.log('    - ID:', tip.tip_id);
      console.log('    - Date:', tip.presented_date);
      console.log('    - User Response:', tip.user_response);
      console.log('    - Evening Check-in:', tip.evening_check_in);
      console.log('    - Quick Completions:', tip.quick_completions);
      if (tip.quick_completions && tip.quick_completions.length > 0) {
        tip.quick_completions.forEach((qc, qIndex) => {
          console.log(`      Quick ${qIndex + 1}: note=${qc.quick_note}, time=${qc.completed_at}`);
        });
      }
    });

    // Get loved tips (ones marked as 'went_great' in evening check-in OR quick completions)
    const lovedTipIds = new Set<string>();

    console.log('\n2. CHECKING FOR LOVED TIPS:');
    dailyTips.forEach((tip, index) => {
      console.log(`\n  Analyzing tip ${index + 1} (${tip.tip_id}):`);

      // Check evening check-in
      console.log('    - Evening check-in value:', tip.evening_check_in);
      console.log('    - Is "went_great"?', tip.evening_check_in === 'went_great');
      if (tip.evening_check_in === 'went_great') {
        console.log('    ✅ LOVED via evening check-in!');
        lovedTipIds.add(tip.tip_id);
      }

      // Also check quick completions for "worked_great"
      if (tip.quick_completions && tip.quick_completions.length > 0) {
        console.log('    - Quick completions count:', tip.quick_completions.length);
        tip.quick_completions.forEach((qc, qcIndex) => {
          console.log(`      Completion ${qcIndex + 1}: ${qc.quick_note}`);
          if (qc.quick_note === 'worked_great') {
            console.log('    ✅ LOVED via quick completion!');
            lovedTipIds.add(tip.tip_id);
          }
        });
      } else {
        console.log('    - No quick completions');
      }
    });

    console.log('\n3. RESULTS:');
    console.log('Total loved tip IDs found:', lovedTipIds.size);
    console.log('Loved tip IDs:', Array.from(lovedTipIds));

    // Create habit data for loved tips
    const lovedHabitsList: HabitData[] = [];

    console.log('\n4. CREATING HABIT DATA:');
    try {
      Array.from(lovedTipIds).forEach((tipId, index) => {
        console.log(`  Looking up habit ${index + 1}...`);
        console.log('    - Tip ID:', tipId);

        const tipData = getTipById(tipId);
        console.log('    - Tip found in database?', tipData ? 'YES' : 'NO');

        if (tipData) {
          console.log('    - Summary:', tipData.summary);
        } else {
          console.log('    - ❌ WARNING: Could not find tip data!');
        }

        // Initialize animations for this habit
        const anims = getOrCreateAnimations(tipId);
        // Start with progress at 0 for all habits (will be updated later if completed)
        anims.progress.setValue(0);

        const habitData = {
          tipId,
          title: tipData?.summary || 'Habit',
          completedToday: 0,
        };

        console.log('    - Created habit data:', habitData);
        lovedHabitsList.push(habitData);
      });
    } catch (error) {
      console.error('❌ ERROR in creating habit data:', error);
    }

    console.log('\n5. LOADING TODAY\'S COMPLETIONS:');
    // Load today's completions from storage
    const todayCompletions = await loadTodayCompletions();
    console.log('Today\'s completions map size:', todayCompletions.size);
    console.log('Today\'s completions:', Array.from(todayCompletions.entries()));

    lovedHabitsList.forEach(habit => {
      const completionCount = todayCompletions.get(habit.tipId) || 0;
      habit.completedToday = completionCount;
      console.log(`  ${habit.title}: ${completionCount} completions today`);
      // Set initial progress for completed habits
      if (completionCount > 0) {
        const { progress } = getOrCreateAnimations(habit.tipId);
        progress.setValue(1);  // Circle filled when completed
      }
    });

    console.log('\n6. FINAL LOVED HABITS LIST:');
    console.log('Total habits to display:', lovedHabitsList.length);
    lovedHabitsList.forEach((habit, index) => {
      console.log(`  ${index + 1}. ${habit.title} (ID: ${habit.tipId}, Completed: ${habit.completedToday}x)`);
    });

    console.log('\n7. SETTING STATE:');
    console.log('  About to set lovedHabits state with', lovedHabitsList.length, 'habits');
    setLovedHabits(lovedHabitsList);
    console.log('  State update triggered');
    console.log('=== END HABITS LOADING ===\n\n');
    } catch (error) {
      console.error('\n❌ FATAL ERROR in loadHabits:', error);
      console.error('Stack trace:', error.stack);
    }
  };

  const loadTodayCompletions = async (): Promise<Map<string, number>> => {
    const today = new Date().toDateString();
    const key = `habit_completions_${today}`;
    console.log('    Loading completions from key:', key);
    const stored = await StorageService.getItem(key);
    console.log('    Raw stored data:', stored);

    if (stored) {
      const data = JSON.parse(stored);
      console.log('    Parsed data:', data);
      const map = new Map(Object.entries(data).map(([k, v]) => [k, Number(v)]));
      console.log('    Created map:', Array.from(map.entries()));
      return map;
    }
    return new Map();
  };

  const saveTodayCompletions = async (completions: Map<string, number>) => {
    const today = new Date().toDateString();
    const key = `habit_completions_${today}`;
    const data = Object.fromEntries(completions);
    console.log('    Saving completions to key:', key);
    console.log('    Data to save:', data);
    await StorageService.setItem(key, JSON.stringify(data));
    console.log('    Successfully saved');
  };

  const handlePressIn = (habitId: string) => {
    console.log('\n🔍 PRESS IN:', habitId);
    console.log('  Current lovedHabits state:', lovedHabits.map(h => ({
      id: h.tipId,
      completed: h.completedToday
    })));
    const habit = lovedHabits.find(h => h.tipId === habitId);
    if (!habit) {
      console.log('  Habit not found!');
      return;
    }
    console.log('  Found habit - completed count:', habit.completedToday);

    // Only animate fill if not already completed
    if (habit.completedToday === 0) {
      // Start haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { scale, progress } = getOrCreateAnimations(habitId);
      console.log('  Starting fill animation...');

      // Animate the progress circle filling
      Animated.timing(progress, {
        toValue: 1,  // Fill the entire circle
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        console.log('  Fill animation complete');
      });

      // Start scale animation
      Animated.spring(scale, {
        toValue: 0.95,
        damping: 10,
        useNativeDriver: true,
      }).start();

      // Set timer to complete after hold
      holdTimers[habitId] = setTimeout(() => {
        console.log('  Timer triggered - completing habit');
        completeHabit(habitId);
      }, 300);  // Reduced from 500ms to 300ms
    }
  };

  const handlePressOut = (habitId: string) => {
    console.log('\n👆 PRESS OUT:', habitId);

    // Clear the timer if released early
    if (holdTimers[habitId]) {
      clearTimeout(holdTimers[habitId]);
      delete holdTimers[habitId];
      console.log('  Timer cleared');
    }

    const { scale, progress } = getOrCreateAnimations(habitId);
    const habit = lovedHabits.find(h => h.tipId === habitId);

    if (!habit) return;

    console.log('  Habit completed?', habit.completedToday > 0);
    console.log('  Progress value:', (progress as any)._value);

    // Reset scale animation
    Animated.spring(scale, {
      toValue: 1,
      damping: 10,
      useNativeDriver: true,
    }).start();

    // Only reset progress if:
    // 1. The habit is not completed AND
    // 2. The animation didn't finish (released early)
    if (habit.completedToday === 0 && (progress as any)._value < 1) {
      console.log('  Resetting progress to 0 (released early)');
      Animated.timing(progress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (habit.completedToday > 0) {
      // Keep progress filled for completed habits
      console.log(`  Keeping progress filled (${habit.completedToday} completions)`);
      progress.setValue(1);
    }
  };

  const completeHabit = async (habitId: string) => {
    console.log('\n✅ COMPLETING HABIT:', habitId);
    const habit = lovedHabits.find(h => h.tipId === habitId);
    if (!habit) return;

    // Mark as just completed to prevent handleTap from resetting
    justCompletedRef.add(habitId);
    setTimeout(() => {
      justCompletedRef.delete(habitId);
    }, 500);

    // Stronger haptic for completion
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Increment completion count
    const newCount = habit.completedToday + 1;
    console.log('  New completion count:', newCount);

    // Update state
    const updatedHabits = lovedHabits.map(h => {
      if (h.tipId === habitId) {
        return { ...h, completedToday: newCount };
      }
      return h;
    });
    setLovedHabits(updatedHabits);
    console.log('  State updated');

    const { scale, progress } = getOrCreateAnimations(habitId);

    // Animate completion
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.1,
        damping: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Set progress to filled
    progress.setValue(1);  // Fill the circle
    console.log('  Progress set to filled');

      // Clear any remaining timer to prevent double-completion
    if (holdTimers[habitId]) {
      clearTimeout(holdTimers[habitId]);
      delete holdTimers[habitId];
    }

    // Save to storage
    const completions = new Map<string, number>();
    updatedHabits.forEach(h => {
      if (h.completedToday > 0) {
        completions.set(h.tipId, h.completedToday);
      }
    });
    await saveTodayCompletions(completions);
    console.log('  Saved to storage');
  };

  const handleUndo = (habitId: string) => {
    console.log('\n↩️ UNDO:', habitId);
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
    }
  };

  // Add a long press handler to reset
  const handleLongPress = (habitId: string) => {
    console.log('\n🔄 LONG PRESS - Resetting:', habitId);
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

        {isCompleted && (
          <Text style={styles.habitSubtext}>
            {habit.completedToday === 1 ? 'Completed' : `${habit.completedToday}x today`}
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
          <Text style={styles.headerTitle}>Your Loved Habits</Text>
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  habitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  habitItem: {
    width: SCREEN_WIDTH / 3,
    alignItems: 'center',
    marginBottom: 32,
  },
  habitWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  habitPressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitCircleContainer: {
    width: 130,  // Increased to accommodate outer rings
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitCircle: {
    transform: [{ rotate: '0deg' }],
  },
  completionIconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  completionNumberText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22C55E',
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
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  undoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  habitTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#424242',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  habitTitleCompleted: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  habitSubtext: {
    fontSize: 11,
    color: '#4CAF50',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  instructions: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});