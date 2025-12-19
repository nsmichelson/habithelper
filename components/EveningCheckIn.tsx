import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { TipFeedback, QuickComplete } from '../types/tip';
import { SimplifiedTip } from '../types/simplifiedTip';
import * as Haptics from 'expo-haptics';
import { ThemeKey, getTheme } from '../constants/Themes';

interface Props {
  tip: SimplifiedTip;
  onCheckIn: (feedback: TipFeedback, notes?: string) => void;
  onSkip: () => void;
  quickCompletions?: QuickComplete[];
  themeKey?: ThemeKey;
}

export default function EveningCheckIn({
  tip,
  onCheckIn,
  onSkip,
  quickCompletions = [],
  themeKey = 'violet'
}: Props) {
  const [selectedFeedback, setSelectedFeedback] = useState<TipFeedback | null>(null);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const theme = getTheme(themeKey);
  const cardScale = useSharedValue(1);
  const notesHeight = useSharedValue(0);

  // Check if user already completed the experiment
  const hasQuickCompletion = quickCompletions.length > 0;

  // Flo-style feedback options using theme colors
  const feedbackOptions: Array<{ value: TipFeedback; label: string; icon: string }> = [
    { value: 'went_great', label: 'Loved it', icon: 'heart' },
    { value: 'went_ok', label: 'It was okay', icon: 'thumbs-up' },
    { value: 'not_for_me', label: 'Not for me', icon: 'close-circle' },
    { value: 'skipped', label: 'Didn\'t try', icon: 'time' },
  ];

  const handleFeedbackSelect = (feedback: TipFeedback) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFeedback(feedback);

    // Show notes field for detailed feedback
    if (!showNotes) {
      setShowNotes(true);
      notesHeight.value = withSpring(1);
    }
  };

  const handleSubmit = () => {
    if (!selectedFeedback) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    cardScale.value = withSequence(
      withTiming(0.98, { duration: 100 }),
      withSpring(1)
    );

    setTimeout(() => {
      onCheckIn(selectedFeedback, notes || undefined);
    }, 200);
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const notesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: notesHeight.value,
    maxHeight: notesHeight.value * 180,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primaryLightest }]}>
              <View style={[styles.iconInner, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="moon" size={28} color="#fff" />
              </View>
            </View>
            <Text style={[styles.title, { color: theme.primary }]}>Evening Reflection</Text>
            <Text style={styles.subtitle}>
              {hasQuickCompletion
                ? "How did your experiment affect your day?"
                : "How did today's experiment go?"}
            </Text>
          </View>

          {/* Tip Card */}
          <View style={[styles.tipCard, { borderColor: theme.primaryLightest }]}>
            <Text style={styles.tipLabel}>TODAY'S EXPERIMENT</Text>
            <Text style={styles.tipSummary}>{tip.summary}</Text>

            {hasQuickCompletion && (
              <View style={[styles.completedBadge, { backgroundColor: theme.primaryLightest }]}>
                <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                <Text style={[styles.completedText, { color: theme.primary }]}>
                  Completed {quickCompletions.length}x today
                </Text>
              </View>
            )}
          </View>

          {/* Feedback Options */}
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>How did it go?</Text>
            <View style={styles.feedbackGrid}>
              {feedbackOptions.map((option) => {
                const isSelected = selectedFeedback === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.feedbackButton,
                      isSelected && {
                        backgroundColor: theme.primaryLightest,
                        borderColor: theme.primary
                      }
                    ]}
                    onPress={() => handleFeedbackSelect(option.value)}
                  >
                    <View style={[
                      styles.feedbackIconCircle,
                      { backgroundColor: isSelected ? theme.primaryLight : '#f5f5f5' }
                    ]}>
                      <Ionicons
                        name={option.icon as any}
                        size={22}
                        color={isSelected ? '#fff' : '#9e9e9e'}
                      />
                    </View>
                    <Text style={[
                      styles.feedbackLabel,
                      isSelected && { color: theme.primary, fontWeight: '600' }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Notes Section */}
          <Animated.View style={[styles.notesSection, notesAnimatedStyle]}>
            <Text style={styles.notesLabel}>Add a note (optional)</Text>
            <TextInput
              style={[styles.notesInput, { borderColor: theme.primaryLighter }]}
              placeholder="What worked? What was challenging?"
              placeholderTextColor="#bdbdbd"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </Animated.View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: selectedFeedback ? theme.primary : '#e0e0e0' }
              ]}
              onPress={handleSubmit}
              disabled={!selectedFeedback}
            >
              <Text style={styles.submitButtonText}>Save Reflection</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={[styles.skipButtonText, { color: theme.primaryLight }]}>
                Maybe later
              </Text>
            </TouchableOpacity>
          </View>

          {/* Insight Message */}
          {selectedFeedback && (
            <View style={[styles.insightCard, { backgroundColor: theme.primaryLightest }]}>
              <Ionicons name="bulb-outline" size={18} color={theme.primary} />
              <Text style={[styles.insightText, { color: theme.primary }]}>
                {selectedFeedback === 'went_great' && "Great! We'll find more experiments like this for you."}
                {selectedFeedback === 'went_ok' && "Good to know. Small adjustments can make a big difference."}
                {selectedFeedback === 'not_for_me' && "Thanks for trying. We'll suggest something different."}
                {selectedFeedback === 'skipped' && "No worries. Tomorrow is a new opportunity."}
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },
  tipCard: {
    backgroundColor: '#fafafa',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
  },
  tipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9e9e9e',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tipSummary: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
    lineHeight: 23,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
  },
  completedText: {
    fontSize: 13,
    fontWeight: '500',
  },
  feedbackSection: {
    marginBottom: 24,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
    textAlign: 'center',
  },
  feedbackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  feedbackButton: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#eeeeee',
  },
  feedbackIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  feedbackLabel: {
    fontSize: 14,
    color: '#616161',
    fontWeight: '500',
  },
  notesSection: {
    marginBottom: 24,
    overflow: 'hidden',
  },
  notesLabel: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 10,
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: '#fafafa',
    borderRadius: 14,
    padding: 16,
    color: '#424242',
    fontSize: 15,
    minHeight: 90,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  actions: {
    gap: 12,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    gap: 10,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
