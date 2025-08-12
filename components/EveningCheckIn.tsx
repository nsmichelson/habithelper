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

const feedbackOptions: Array<{ value: TipFeedback; label: string; emoji: string; color: string; bgColor: string; lightBg: string; subtitle?: string }> = [
  { value: 'went_great', label: 'Loved it!', emoji: '💚', color: '#00C853', bgColor: '#00E676', lightBg: '#E8F5E9', subtitle: 'Amazing' },
  { value: 'went_ok', label: 'Pretty good', emoji: '☀️', color: '#FF6F00', bgColor: '#FFA726', lightBg: '#FFF3E0', subtitle: 'Solid try' },
  { value: 'not_great', label: 'Not for me', emoji: '💭', color: '#AB47BC', bgColor: '#BA68C8', lightBg: '#F3E5F5', subtitle: 'Good data' },
  { value: 'didnt_try', label: "Skipped it", emoji: '💙', color: '#1E88E5', bgColor: '#42A5F5', lightBg: '#E3F2FD', subtitle: 'Tomorrow' },
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
            colors={['#FFE0B2', '#FFCCBC', '#F8BBD0']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Header */}
            <View style={styles.header}>
              <LinearGradient
                colors={['#7E57C2', '#9575CD', '#B39DDB']}
                style={styles.moonIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.moonEmoji}>🌙</Text>
              </LinearGradient>
              <Text style={styles.title}>Evening Reflection</Text>
              <Text style={styles.subtitle}>
                {hasQuickCompletion 
                  ? "✨ You completed today's experiment!" 
                  : "How did your experiment go today?"}
              </Text>
            </View>

            {/* Tip Reminder */}
            <View style={styles.tipReminder}>
              <View style={styles.tipReminderHeader}>
                <Ionicons name="flask" size={16} color="#4CAF50" />
                <Text style={styles.tipLabel}>
                  {hasQuickCompletion ? "Today's completed experiment" : "Today's experiment"}
                </Text>
              </View>
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
                    💭 How did it affect the rest of your day?
                  </Text>
                  <View style={styles.feedbackContainer}>
                    {feedbackOptions.filter(opt => opt.value !== 'didnt_try').map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.feedbackButton,
                          { backgroundColor: option.lightBg, borderColor: option.bgColor },
                          selectedFeedback === option.value && styles.feedbackButtonSelected,
                          selectedFeedback === option.value && { 
                            backgroundColor: option.bgColor,
                            borderColor: option.color,
                            transform: [{ scale: 1.02 }]
                          }
                        ]}
                        onPress={() => handleFeedbackSelect(option.value)}
                      >
                        <Text style={styles.feedbackEmoji}>{option.emoji}</Text>
                        <View style={styles.feedbackTextContainer}>
                          <Text style={[
                            styles.feedbackLabel,
                            selectedFeedback === option.value && styles.feedbackLabelSelected
                          ]}>
                            {option.label}
                          </Text>
                          {option.subtitle && (
                            <Text style={[
                              styles.feedbackSubtitle,
                              selectedFeedback === option.value && styles.feedbackSubtitleSelected
                            ]}>
                              {option.subtitle}
                            </Text>
                          )}
                        </View>
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
                        { backgroundColor: option.lightBg, borderColor: option.bgColor },
                        selectedFeedback === option.value && styles.feedbackButtonSelected,
                        selectedFeedback === option.value && { 
                          backgroundColor: option.bgColor,
                          borderColor: option.color,
                          transform: [{ scale: 1.02 }]
                        }
                      ]}
                      onPress={() => handleFeedbackSelect(option.value)}
                    >
                      <Text style={styles.feedbackEmoji}>{option.emoji}</Text>
                      <View style={styles.feedbackTextContainer}>
                        <Text style={[
                          styles.feedbackLabel,
                          selectedFeedback === option.value && styles.feedbackLabelSelected
                        ]}>
                          {option.label}
                        </Text>
                        {option.subtitle && (
                          <Text style={[
                            styles.feedbackSubtitle,
                            selectedFeedback === option.value && styles.feedbackSubtitleSelected
                          ]}>
                            {option.subtitle}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Reflection Prompt */}
            {selectedFeedback && (
              <View style={styles.reflectionPrompt}>
                <Text style={styles.reflectionPromptText}>
                  {selectedFeedback === 'went_great' && "💭 What specifically made this work so well for you?"}
                  {selectedFeedback === 'went_ok' && "💭 What would make this experiment easier next time?"}
                  {selectedFeedback === 'not_great' && "💭 What did you learn about your preferences?"}
                  {selectedFeedback === 'didnt_try' && "💭 What got in the way today?"}
                </Text>
              </View>
            )}

            {/* Notes Section */}
            <Animated.View style={[styles.notesSection, notesAnimatedStyle]}>
              <Text style={styles.notesLabel}>
                {hasQuickCompletion 
                  ? 'Share your reflection (optional)' 
                  : 'Share your thoughts (optional)'}
              </Text>
              <TextInput
                style={styles.notesInput}
                placeholder={
                  hasQuickCompletion 
                    ? "Did you notice any lasting effects? Would you try it again?"
                    : "What made it work? What was challenging?"
                }
                placeholderTextColor="#999"
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
                  {selectedFeedback === 'went_great' && "Amazing! This experiment really worked for you 🌟"}
                  {selectedFeedback === 'went_ok' && "Nice! You're figuring out what works 💚"}
                  {selectedFeedback === 'not_great' && "That's helpful data! Now you know this isn't your thing 📊"}
                  {selectedFeedback === 'didnt_try' && "No problem! Ready for tomorrow's experiment? 🌱"}
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  moonIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#7E57C2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  moonEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    opacity: 0.95,
  },
  tipReminder: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipReminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tipLabel: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipSummary: {
    fontSize: 17,
    fontWeight: '600',
    color: '#212121',
    lineHeight: 24,
  },
  completionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  completionStatusText: {
    fontSize: 13,
    color: '#4CAF50',
    marginLeft: 6,
    fontWeight: '500',
  },
  reflectionSection: {
    marginBottom: 20,
  },
  reflectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  feedbackContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  feedbackButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  feedbackButtonSelected: {
    borderWidth: 2,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
    elevation: 5,
  },
  feedbackEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  feedbackTextContainer: {
    alignItems: 'center',
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#424242',
  },
  feedbackLabelSelected: {
    color: '#FFF',
  },
  feedbackSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  feedbackSubtitleSelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  checkMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  reflectionPrompt: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD54F',
    borderLeftWidth: 5,
    borderLeftColor: '#FFB300',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  reflectionPromptText: {
    fontSize: 14,
    color: '#F57C00',
    lineHeight: 20,
    fontWeight: '600',
  },
  notesSection: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  notesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    color: '#424242',
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtons: {
    gap: 12,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7E57C2',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#7E57C2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#C0C0C0',
    shadowOpacity: 0,
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
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  motivationalMessage: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E1BEE7',
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  motivationalText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6A1B9A',
    textAlign: 'center',
    lineHeight: 22,
  },
});