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
import { Tip, TipFeedback, QuickComplete } from '../types/tip';
import * as Haptics from 'expo-haptics';

interface Props {
  tip: Tip;
  onCheckIn: (feedback: TipFeedback, notes?: string) => void;
  onSkip: () => void;
  quickCompletions?: QuickComplete[];
}

const feedbackOptions: Array<{ value: TipFeedback; label: string; emoji: string; color: string }> = [
  { value: 'went_great', label: 'Went Great!', emoji: '🎉', color: '#4CAF50' },
  { value: 'went_ok', label: 'Went OK', emoji: '👍', color: '#FF9800' },
  { value: 'not_great', label: 'Not Great', emoji: '😕', color: '#F44336' },
  { value: 'didnt_try', label: "Didn't Try", emoji: '⏭️', color: '#757575' },
];

export default function EveningCheckIn({ tip, onCheckIn, onSkip, quickCompletions = [] }: Props) {
  const [selectedFeedback, setSelectedFeedback] = useState<TipFeedback | null>(null);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  
  const cardScale = useSharedValue(1);
  const notesHeight = useSharedValue(0);
  
  // Check if user already completed the experiment
  const hasQuickCompletion = quickCompletions.length > 0;

  const handleFeedbackSelect = (feedback: TipFeedback) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFeedback(feedback);
    
    // Show notes field for detailed feedback
    if (feedback !== 'didnt_try' && !showNotes) {
      setShowNotes(true);
      notesHeight.value = withSpring(1);
    }
  };

  const handleSubmit = () => {
    if (!selectedFeedback) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    cardScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
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
    maxHeight: notesHeight.value * 200,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          <LinearGradient
            colors={['#1E3A8A', '#3B82F6']}
            style={styles.gradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.moonIcon}>
                <Ionicons name="moon" size={32} color="#FFF" />
              </View>
              <Text style={styles.title}>Evening Check-In</Text>
              <Text style={styles.subtitle}>
                {hasQuickCompletion 
                  ? "Let's reflect on your completed experiment" 
                  : "How did today's experiment go?"}
              </Text>
            </View>

            {/* Tip Reminder */}
            <View style={styles.tipReminder}>
              <Text style={styles.tipLabel}>
                {hasQuickCompletion ? 'You completed:' : 'You tried:'}
              </Text>
              <Text style={styles.tipSummary}>{tip.summary}</Text>
              
              {/* Show quick completion status */}
              {hasQuickCompletion && (
                <View style={styles.completionStatus}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.completionStatusText}>
                    Completed {quickCompletions.length}x today
                    {quickCompletions[quickCompletions.length - 1]?.quick_note && 
                      ` • ${
                        quickCompletions[quickCompletions.length - 1].quick_note === 'worked_great' ? 'It worked great!' :
                        quickCompletions[quickCompletions.length - 1].quick_note === 'went_ok' ? 'It went ok' :
                        quickCompletions[quickCompletions.length - 1].quick_note === 'not_sure' ? 'You weren\'t sure' :
                        'It wasn\'t for you'
                      }`
                    }
                  </Text>
                </View>
              )}
            </View>

            {/* Different UI for already-completed vs not-completed */}
            {hasQuickCompletion ? (
              <>
                {/* Reflection Questions for Already Completed */}
                <View style={styles.reflectionSection}>
                  <Text style={styles.reflectionTitle}>
                    How did it affect the rest of your day?
                  </Text>
                  <View style={styles.feedbackContainer}>
                    {feedbackOptions.filter(opt => opt.value !== 'didnt_try').map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.feedbackButton,
                          selectedFeedback === option.value && styles.feedbackButtonSelected,
                          selectedFeedback === option.value && { borderColor: option.color }
                        ]}
                        onPress={() => handleFeedbackSelect(option.value)}
                      >
                        <Text style={styles.feedbackEmoji}>{option.emoji}</Text>
                        <Text style={[
                          styles.feedbackLabel,
                          selectedFeedback === option.value && styles.feedbackLabelSelected
                        ]}>
                          {option.label}
                        </Text>
                        {selectedFeedback === option.value && (
                          <View style={[styles.checkMark, { backgroundColor: option.color }]}>
                            <Ionicons name="checkmark" size={16} color="#FFF" />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Original Feedback Options for Not Completed */}
                <View style={styles.feedbackContainer}>
                  {feedbackOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.feedbackButton,
                        selectedFeedback === option.value && styles.feedbackButtonSelected,
                        selectedFeedback === option.value && { borderColor: option.color }
                      ]}
                      onPress={() => handleFeedbackSelect(option.value)}
                    >
                      <Text style={styles.feedbackEmoji}>{option.emoji}</Text>
                      <Text style={[
                        styles.feedbackLabel,
                        selectedFeedback === option.value && styles.feedbackLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                      {selectedFeedback === option.value && (
                        <View style={[styles.checkMark, { backgroundColor: option.color }]}>
                          <Ionicons name="checkmark" size={16} color="#FFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Notes Section */}
            <Animated.View style={[styles.notesSection, notesAnimatedStyle]}>
              <Text style={styles.notesLabel}>
                {hasQuickCompletion 
                  ? 'Any additional observations from your day? (optional)' 
                  : 'Any thoughts to share? (optional)'}
              </Text>
              <TextInput
                style={styles.notesInput}
                placeholder={
                  hasQuickCompletion 
                    ? "Did you notice any lasting effects? Would you try it again?"
                    : "What made it work? What was challenging?"
                }
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </Animated.View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !selectedFeedback && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!selectedFeedback}
              >
                <Text style={styles.submitButtonText}>Save Check-In</Text>
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
                <Text style={styles.skipButtonText}>Remind me later</Text>
              </TouchableOpacity>
            </View>

            {/* Motivational Message */}
            {selectedFeedback && (
              <View style={styles.motivationalMessage}>
                <Text style={styles.motivationalText}>
                  {selectedFeedback === 'went_great' && "Fantastic! You're building great habits! 🌟"}
                  {selectedFeedback === 'went_ok' && "Good effort! Every step counts! 💪"}
                  {selectedFeedback === 'not_great' && "That's okay! You learned something valuable! 🧠"}
                  {selectedFeedback === 'didnt_try' && "No worries! Tomorrow is a new opportunity! 🌅"}
                </Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  moonIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  tipReminder: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  tipSummary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 22,
  },
  completionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  completionStatusText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
  },
  reflectionSection: {
    marginBottom: 20,
  },
  reflectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  feedbackContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  feedbackButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  feedbackButtonSelected: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  feedbackEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  feedbackLabelSelected: {
    color: '#FFF',
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesSection: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  notesLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
    color: '#FFF',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionButtons: {
    gap: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textDecorationLine: 'underline',
  },
  motivationalMessage: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  motivationalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 20,
  },
});