import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { DailyTip, UserProfile, Tip } from '../types/tip';
import StorageService from '../services/storage';
import TipRecommendationService from '../services/tipRecommendation';

interface Props {
  visible: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  existingTips: DailyTip[];
  onTipGenerated: () => void;
}

export default function TestDataCalendar({ 
  visible, 
  onClose, 
  userProfile,
  existingTips,
  onTipGenerated 
}: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [generating, setGenerating] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the first day of the week for the month
  const startDay = monthStart.getDay();
  const emptyDays = Array(startDay).fill(null);

  // Check if a date has a tip
  const hasTip = (date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return existingTips.some(tip => 
      format(new Date(tip.presented_date), 'yyyy-MM-dd') === dateStr
    );
  };

  const handleDatePress = async (date: Date) => {
    if (hasTip(date)) {
      Alert.alert(
        'Date Already Has Tip',
        'This date already has an experiment. Would you like to replace it?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Replace', 
            style: 'destructive',
            onPress: () => generateTipForDate(date, true)
          }
        ]
      );
    } else {
      await generateTipForDate(date, false);
    }
  };

  const generateTipForDate = async (date: Date, replace: boolean = false) => {
    setGenerating(true);
    setSelectedDate(date);

    try {
      // Get tips that existed before this date (for realistic history)
      const priorTips = existingTips.filter(tip => 
        new Date(tip.presented_date) < date
      );

      // Get a recommendation
      const tipScore = TipRecommendationService.getDailyTip(
        userProfile,
        priorTips,
        [] // No attempts for test data
      );

      if (!tipScore) {
        Alert.alert('No Tips Available', 'Could not generate a tip for this date');
        return;
      }

      // If replacing, find and update existing tip
      if (replace) {
        const dateStr = format(date, 'yyyy-MM-dd');
        const existingTip = existingTips.find(tip => 
          format(new Date(tip.presented_date), 'yyyy-MM-dd') === dateStr
        );
        
        if (existingTip) {
          await StorageService.updateDailyTip(existingTip.id, {
            tip_id: tipScore.tip.tip_id,
            presented_date: date,
            user_response: undefined,
            responded_at: undefined,
            quick_completions: [],
            evening_check_in: undefined,
            check_in_at: undefined,
          });
        }
      } else {
        // Create new daily tip for this date
        const newDailyTip: DailyTip = {
          id: `test-${date.getTime()}`,
          user_id: userProfile.id,
          tip_id: tipScore.tip.tip_id,
          presented_date: date,
        };

        await StorageService.saveDailyTip(newDailyTip);
      }

      // Show options for what to do with this tip
      Alert.alert(
        'Tip Generated!',
        `Generated: "${tipScore.tip.summary}"\n\nWhat would you like to simulate?`,
        [
          {
            text: 'Just Presented',
            onPress: () => {
              onTipGenerated();
              Alert.alert('Done', 'Tip saved as presented only');
            }
          },
          {
            text: 'Tried It',
            onPress: async () => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const tip = existingTips.find(t => 
                format(new Date(t.presented_date), 'yyyy-MM-dd') === dateStr
              ) || { id: `test-${date.getTime()}` };
              
              await StorageService.updateDailyTip(tip.id, {
                user_response: 'try_it' as any,
                responded_at: new Date(date.getTime() + 3600000), // 1 hour later
              });
              
              onTipGenerated();
              Alert.alert('Done', 'Tip marked as tried');
            }
          },
          {
            text: 'Tried & Loved',
            onPress: async () => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const tip = existingTips.find(t => 
                format(new Date(t.presented_date), 'yyyy-MM-dd') === dateStr
              ) || { id: `test-${date.getTime()}` };
              
              await StorageService.updateDailyTip(tip.id, {
                user_response: 'try_it' as any,
                responded_at: new Date(date.getTime() + 3600000),
                evening_check_in: 'went_great' as any,
                check_in_at: new Date(date.getTime() + 43200000), // 12 hours later
              });
              
              onTipGenerated();
              Alert.alert('Done', 'Tip marked as tried and loved!');
            }
          },
          {
            text: 'Not for Me',
            onPress: async () => {
              // Create a rejection attempt for the algorithm to learn from
              const tipAttempt = {
                id: `test-attempt-${date.getTime()}`,
                tip_id: tipScore.tip.tip_id,
                attempted_at: date,
                created_at: date,
                feedback: 'not_for_me' as any,
                rejection_reason: 'not_interested', // Default reason for test data
              };
              
              await StorageService.saveTipAttempt(tipAttempt);
              
              // Generate a replacement tip for that same day
              const replacementTipScore = TipRecommendationService.getDailyTip(
                userProfile,
                priorTips,
                [tipAttempt] // Include the rejection in the algorithm
              );
              
              if (replacementTipScore) {
                const dateStr = format(date, 'yyyy-MM-dd');
                const tip = existingTips.find(t => 
                  format(new Date(t.presented_date), 'yyyy-MM-dd') === dateStr
                ) || { id: `test-${date.getTime()}` };
                
                // Update with the replacement tip
                await StorageService.updateDailyTip(tip.id, {
                  tip_id: replacementTipScore.tip.tip_id,
                  user_response: undefined, // Reset - they haven't responded to replacement
                  responded_at: undefined,
                });
                
                onTipGenerated();
                Alert.alert('Done', `Original tip rejected. Replaced with: "${replacementTipScore.tip.summary.substring(0, 50)}..."`);
              } else {
                onTipGenerated();
                Alert.alert('Done', 'Tip marked as not for me (no replacement available)');
              }
            }
          },
          {
            text: 'Maybe Later',
            onPress: async () => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const tip = existingTips.find(t => 
                format(new Date(t.presented_date), 'yyyy-MM-dd') === dateStr
              ) || { id: `test-${date.getTime()}` };
              
              await StorageService.updateDailyTip(tip.id, {
                user_response: 'maybe_later' as any,
                responded_at: new Date(date.getTime() + 1800000), // 30 min later
              });
              
              onTipGenerated();
              Alert.alert('Done', 'Tip marked as maybe later');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error generating test tip:', error);
      Alert.alert('Error', 'Failed to generate tip');
    } finally {
      setGenerating(false);
      setSelectedDate(null);
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FBF8']}
            style={styles.content}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.title}>Test Data Generator</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Month Navigation */}
            <View style={styles.monthNav}>
              <TouchableOpacity 
                onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
                style={styles.navButton}
              >
                <Ionicons name="chevron-back" size={24} color="#4CAF50" />
              </TouchableOpacity>
              
              <Text style={styles.monthText}>
                {format(currentMonth, 'MMMM yyyy')}
              </Text>
              
              <TouchableOpacity 
                onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
                style={styles.navButton}
              >
                <Ionicons name="chevron-forward" size={24} color="#4CAF50" />
              </TouchableOpacity>
            </View>

            {/* Week Days */}
            <View style={styles.weekDays}>
              {weekDays.map(day => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.calendar}>
                {/* Empty days at start of month */}
                {emptyDays.map((_, index) => (
                  <View key={`empty-${index}`} style={styles.dayCell} />
                ))}
                
                {/* Actual days */}
                {monthDays.map(day => {
                  const isToday = isSameDay(day, new Date());
                  const hasExistingTip = hasTip(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isPast = day < new Date();
                  
                  return (
                    <TouchableOpacity
                      key={day.toISOString()}
                      style={[
                        styles.dayCell,
                        isToday && styles.todayCell,
                        hasExistingTip && styles.hasDataCell,
                        isSelected && styles.selectedCell,
                      ]}
                      onPress={() => handleDatePress(day)}
                      disabled={generating || !isPast}
                    >
                      <Text style={[
                        styles.dayText,
                        isToday && styles.todayText,
                        hasExistingTip && styles.hasDataText,
                        !isPast && styles.futureText,
                      ]}>
                        {format(day, 'd')}
                      </Text>
                      {hasExistingTip && (
                        <View style={styles.dataDot} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>Has Data</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
                <Text style={styles.legendText}>Today</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#E0E0E0' }]} />
                <Text style={styles.legendText}>Future (Disabled)</Text>
              </View>
            </View>

            {/* Instructions */}
            <Text style={styles.instructions}>
              Tap any past date to generate test data for that day.
              {'\n'}Dates with green dots already have experiments.
            </Text>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  todayCell: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  hasDataCell: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    color: '#424242',
  },
  todayText: {
    fontWeight: '700',
    color: '#2196F3',
  },
  hasDataText: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  futureText: {
    color: '#BDBDBD',
  },
  dataDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  instructions: {
    marginTop: 20,
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 18,
  },
});