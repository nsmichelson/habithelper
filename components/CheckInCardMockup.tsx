/**
 * MOCKUP: Check-in Card and Flow
 *
 * This is a design mockup to explore the "symptoms equivalent" for Habit Helper.
 * Not integrated into the app yet - just for reviewing the concept.
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// The quick-tap options (like Flo's symptom bubbles)
const CHECK_IN_OPTIONS = {
  barriers: {
    label: 'What got in the way?',
    options: [
      { id: 'forgot', emoji: '🤔', label: 'Forgot' },
      { id: 'no_time', emoji: '⏰', label: 'No time' },
      { id: 'not_feeling_it', emoji: '😴', label: 'Not feeling it' },
      { id: 'too_hard', emoji: '😓', label: 'Too hard' },
      { id: 'social', emoji: '👥', label: 'Social situation' },
      { id: 'environment', emoji: '🏠', label: 'Wrong place' },
    ]
  },
  wins: {
    label: 'What helped today?',
    options: [
      { id: 'reminder', emoji: '🔔', label: 'Reminder helped' },
      { id: 'easy', emoji: '✨', label: 'Easier than expected' },
      { id: 'buddy', emoji: '👯', label: 'Did it with someone' },
      { id: 'routine', emoji: '🔄', label: 'Fit my routine' },
      { id: 'motivated', emoji: '💪', label: 'Felt motivated' },
      { id: 'enjoyed', emoji: '😊', label: 'Actually enjoyed it' },
    ]
  },
  feeling: {
    label: 'How do you feel about this tip?',
    options: [
      { id: 'loving_it', emoji: '🥰', label: 'Loving it' },
      { id: 'growing', emoji: '🌱', label: 'Growing on me' },
      { id: 'unsure', emoji: '🤷', label: 'Still unsure' },
      { id: 'struggling', emoji: '😕', label: 'Struggling' },
      { id: 'not_for_me', emoji: '🚫', label: 'Not for me' },
    ]
  }
};

export default function CheckInCardMockup() {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedBarriers, setSelectedBarriers] = useState<string[]>([]);
  const [selectedWins, setSelectedWins] = useState<string[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  const toggleSelection = (
    id: string,
    selected: string[],
    setSelected: (val: string[]) => void,
    multiSelect: boolean = true
  ) => {
    if (multiSelect) {
      if (selected.includes(id)) {
        setSelected(selected.filter(s => s !== id));
      } else {
        setSelected([...selected, id]);
      }
    } else {
      setSelected(selected.includes(id) ? [] : [id]);
    }
  };

  const handleSaveCheckIn = () => {
    // Would save to storage/state
    setHasCheckedInToday(true);
    setShowCheckIn(false);
  };

  const totalSelections = selectedBarriers.length + selectedWins.length + (selectedFeeling ? 1 : 0);

  return (
    <View style={styles.container}>
      {/* ============================================
          THE CARD (appears in horizontal scroll)
          ============================================ */}
      <Text style={styles.sectionLabel}>The Card in the Scroll:</Text>

      <TouchableOpacity
        onPress={() => setShowCheckIn(true)}
        style={styles.checkInCard}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={hasCheckedInToday ? ['#a7f3d0', '#6ee7b7'] : ['#fce7f3', '#fbcfe8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardTopRow}>
            <Text style={[
              styles.cardLabel,
              hasCheckedInToday && styles.cardLabelCheckedIn
            ]}>
              {hasCheckedInToday ? 'CHECKED IN' : 'CHECK IN'}
            </Text>
            <View style={[
              styles.cardPlusButton,
              hasCheckedInToday && styles.cardPlusButtonCheckedIn
            ]}>
              <Ionicons
                name={hasCheckedInToday ? "checkmark" : "add"}
                size={18}
                color={hasCheckedInToday ? "#059669" : "#ec4899"}
              />
            </View>
          </View>

          <Text style={[
            styles.cardTitle,
            hasCheckedInToday && styles.cardTitleCheckedIn
          ]}>
            {hasCheckedInToday ? "You're all set!" : "How's it going?"}
          </Text>

          <Text style={[
            styles.cardSubtitle,
            hasCheckedInToday && styles.cardSubtitleCheckedIn
          ]}>
            {hasCheckedInToday
              ? "Tap to update"
              : "Quick 10-sec check-in"
            }
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* ============================================
          THE CHECK-IN MODAL (bottom sheet)
          ============================================ */}
      <Modal
        visible={showCheckIn}
        transparent
        animationType="none"
        onRequestClose={() => setShowCheckIn(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setShowCheckIn(false)}
          />

          <View style={styles.bottomSheet}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <TouchableOpacity
                onPress={() => setShowCheckIn(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#9ca3af" />
              </TouchableOpacity>
              <View style={styles.sheetHandle} />
              <View style={{ width: 32 }} />
            </View>

            <ScrollView
              style={styles.sheetContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Title */}
              <Text style={styles.sheetTitle}>Quick Check-in</Text>
              <Text style={styles.sheetSubtitle}>
                Tap all that apply - helps us learn what works for you
              </Text>

              {/* Barriers Section */}
              <View style={styles.optionSection}>
                <Text style={styles.optionSectionLabel}>
                  {CHECK_IN_OPTIONS.barriers.label}
                </Text>
                <View style={styles.optionBubbles}>
                  {CHECK_IN_OPTIONS.barriers.options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => toggleSelection(
                        option.id,
                        selectedBarriers,
                        setSelectedBarriers
                      )}
                      style={[
                        styles.optionBubble,
                        selectedBarriers.includes(option.id) && styles.optionBubbleSelected
                      ]}
                    >
                      <Text style={styles.optionEmoji}>{option.emoji}</Text>
                      <Text style={[
                        styles.optionLabel,
                        selectedBarriers.includes(option.id) && styles.optionLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Wins Section */}
              <View style={styles.optionSection}>
                <Text style={styles.optionSectionLabel}>
                  {CHECK_IN_OPTIONS.wins.label}
                </Text>
                <View style={styles.optionBubbles}>
                  {CHECK_IN_OPTIONS.wins.options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => toggleSelection(
                        option.id,
                        selectedWins,
                        setSelectedWins
                      )}
                      style={[
                        styles.optionBubble,
                        styles.optionBubbleWin,
                        selectedWins.includes(option.id) && styles.optionBubbleWinSelected
                      ]}
                    >
                      <Text style={styles.optionEmoji}>{option.emoji}</Text>
                      <Text style={[
                        styles.optionLabel,
                        selectedWins.includes(option.id) && styles.optionLabelWinSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Feeling Section */}
              <View style={styles.optionSection}>
                <Text style={styles.optionSectionLabel}>
                  {CHECK_IN_OPTIONS.feeling.label}
                </Text>
                <View style={styles.feelingOptions}>
                  {CHECK_IN_OPTIONS.feeling.options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => setSelectedFeeling(
                        selectedFeeling === option.id ? null : option.id
                      )}
                      style={[
                        styles.feelingOption,
                        selectedFeeling === option.id && styles.feelingOptionSelected
                      ]}
                    >
                      <Text style={styles.feelingEmoji}>{option.emoji}</Text>
                      <Text style={[
                        styles.feelingLabel,
                        selectedFeeling === option.id && styles.feelingLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Optional: Quick note */}
              <TouchableOpacity style={styles.addNoteButton}>
                <Ionicons name="chatbubble-outline" size={16} color="#9ca3af" />
                <Text style={styles.addNoteText}>Add a note (optional)</Text>
              </TouchableOpacity>

              <View style={{ height: 100 }} />
            </ScrollView>

            {/* Save Button */}
            <View style={styles.saveButtonContainer}>
              <TouchableOpacity
                onPress={handleSaveCheckIn}
                style={[
                  styles.saveButton,
                  totalSelections === 0 && styles.saveButtonDisabled
                ]}
              >
                <LinearGradient
                  colors={totalSelections > 0 ? ['#fb923c', '#f59e0b'] : ['#d1d5db', '#d1d5db']}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {totalSelections > 0
                      ? `Save Check-in (${totalSelections})`
                      : 'Select at least one'
                    }
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowCheckIn(false)}
                style={styles.skipButton}
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================
          MOCKUP: What insights could look like
          ============================================ */}
      <Text style={[styles.sectionLabel, { marginTop: 40 }]}>
        Insights After Multiple Check-ins:
      </Text>

      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Ionicons name="bulb" size={20} color="#f59e0b" />
          <Text style={styles.insightTitle}>Pattern Detected</Text>
        </View>
        <Text style={styles.insightText}>
          You've logged "No time" on 3 mornings this week. Would you like tips that work better for busy mornings?
        </Text>
        <View style={styles.insightActions}>
          <TouchableOpacity style={styles.insightActionYes}>
            <Text style={styles.insightActionYesText}>Yes, show me</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.insightActionNo}>
            <Text style={styles.insightActionNoText}>Not now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Ionicons name="trending-up" size={20} color="#10b981" />
          <Text style={styles.insightTitle}>You're Growing!</Text>
        </View>
        <Text style={styles.insightText}>
          Your confidence with this tip went from "Struggling" on Day 1 to "Growing on me" today. Keep it up!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ============ THE CARD ============
  checkInCard: {
    width: 160,
    borderRadius: 16,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
    minHeight: 120,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    color: '#be185d',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardLabelCheckedIn: {
    color: '#047857',
  },
  cardPlusButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPlusButtonCheckedIn: {
    backgroundColor: '#d1fae5',
  },
  cardTitle: {
    color: '#be185d',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardTitleCheckedIn: {
    color: '#047857',
  },
  cardSubtitle: {
    color: '#f472b6',
    fontSize: 12,
  },
  cardSubtitleCheckedIn: {
    color: '#34d399',
  },

  // ============ THE MODAL ============
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
  },
  sheetContent: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },

  // ============ OPTIONS ============
  optionSection: {
    marginBottom: 24,
  },
  optionSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  optionBubbles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionBubbleSelected: {
    backgroundColor: '#fee2e2',
    borderColor: '#f87171',
  },
  optionBubbleWin: {
    backgroundColor: '#f0fdf4',
  },
  optionBubbleWinSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#4ade80',
  },
  optionEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  optionLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: '#dc2626',
    fontWeight: '600',
  },
  optionLabelWinSelected: {
    color: '#16a34a',
    fontWeight: '600',
  },

  // ============ FEELING OPTIONS ============
  feelingOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feelingOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    width: (SCREEN_WIDTH - 60) / 5 - 4,
  },
  feelingOptionSelected: {
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  feelingEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  feelingLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  feelingLabelSelected: {
    color: '#d97706',
    fontWeight: '600',
  },

  // ============ ADD NOTE ============
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  addNoteText: {
    color: '#9ca3af',
    fontSize: 14,
  },

  // ============ SAVE BUTTON ============
  saveButtonContainer: {
    padding: 20,
    paddingBottom: 36,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#9ca3af',
    fontSize: 14,
  },

  // ============ INSIGHTS ============
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  insightText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  insightActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  insightActionYes: {
    backgroundColor: '#fef3c7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  insightActionYesText: {
    color: '#d97706',
    fontWeight: '600',
    fontSize: 13,
  },
  insightActionNo: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  insightActionNoText: {
    color: '#9ca3af',
    fontSize: 13,
  },
});
