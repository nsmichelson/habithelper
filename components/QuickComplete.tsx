import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { THEMES, ThemeKey, getTheme } from '../constants/Themes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Types for feedback questions
export type FeedbackType = 'worked_great' | 'went_ok' | 'not_sure' | 'not_for_me';

export interface FollowUpQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    emoji?: string;
  }[];
  multiSelect?: boolean;
}

export interface CompletionFeedbackConfig {
  worked_great?: FollowUpQuestion[];
  went_ok?: FollowUpQuestion[];
  not_sure?: FollowUpQuestion[];
  not_for_me?: FollowUpQuestion[];
}

export interface CompletionFeedback {
  type: FeedbackType;
  followUpAnswers: {
    questionId: string;
    selectedOptions: string[];
  }[];
}

// Default follow-up questions for each feedback type
const DEFAULT_FOLLOWUP_QUESTIONS: CompletionFeedbackConfig = {
  worked_great: [
    {
      id: 'what_helped',
      question: 'What made it work so well?',
      options: [
        { id: 'easy', label: 'It was easy', emoji: '✨' },
        { id: 'timing', label: 'Good timing', emoji: '⏰' },
        { id: 'felt_good', label: 'Felt rewarding', emoji: '🎯' },
        { id: 'fit_routine', label: 'Fit my routine', emoji: '📅' },
      ],
    },
    {
      id: 'would_repeat',
      question: 'Would you do this again?',
      options: [
        { id: 'daily', label: 'Every day!', emoji: '🔁' },
        { id: 'sometimes', label: 'Sometimes', emoji: '🤔' },
        { id: 'special', label: 'Special occasions', emoji: '🌟' },
      ],
    },
  ],
  went_ok: [
    {
      id: 'what_was_tricky',
      question: 'What was tricky about it?',
      options: [
        { id: 'timing', label: 'Finding time', emoji: '⏰' },
        { id: 'remember', label: 'Remembering to do it', emoji: '🧠' },
        { id: 'motivation', label: 'Staying motivated', emoji: '💪' },
        { id: 'resources', label: 'Missing something I needed', emoji: '🔧' },
      ],
    },
    {
      id: 'would_adjust',
      question: 'Would a small tweak help?',
      options: [
        { id: 'easier_version', label: 'Simpler version', emoji: '⬇️' },
        { id: 'different_time', label: 'Different time of day', emoji: '🌅' },
        { id: 'more_prep', label: 'Better preparation', emoji: '📝' },
        { id: 'fine_as_is', label: "It's fine as is", emoji: '👍' },
      ],
    },
  ],
  not_sure: [
    {
      id: 'confusion_source',
      question: "What wasn't clear?",
      options: [
        { id: 'instructions', label: 'What to do', emoji: '📋' },
        { id: 'benefit', label: 'Why it helps', emoji: '🤷' },
        { id: 'results', label: "Can't tell if it worked", emoji: '📊' },
        { id: 'fit', label: 'If this is right for me', emoji: '🎯' },
      ],
    },
    {
      id: 'next_step',
      question: 'What would help?',
      options: [
        { id: 'try_again', label: 'Try it again', emoji: '🔄' },
        { id: 'more_info', label: 'More explanation', emoji: '📖' },
        { id: 'variation', label: 'A different approach', emoji: '🔀' },
        { id: 'skip', label: 'Skip this one', emoji: '⏭️' },
      ],
    },
  ],
  not_for_me: [
    {
      id: 'why_not',
      question: "What didn't work?",
      options: [
        { id: 'too_hard', label: 'Too difficult', emoji: '😓' },
        { id: 'no_time', label: 'No time for it', emoji: '⏰' },
        { id: 'not_relevant', label: "Doesn't fit my life", emoji: '🏠' },
        { id: 'tried_before', label: "Tried it, doesn't work for me", emoji: '🔄' },
      ],
    },
    {
      id: 'alternative_interest',
      question: 'What would you prefer instead?',
      options: [
        { id: 'easier', label: 'Something easier', emoji: '⬇️' },
        { id: 'different_approach', label: 'Different approach', emoji: '🔀' },
        { id: 'different_area', label: 'Different focus area', emoji: '🎯' },
        { id: 'break', label: 'Take a break', emoji: '☕' },
      ],
    },
  ],
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onQuickComplete: (feedback: CompletionFeedback) => void;
  themeKey?: ThemeKey;
  customQuestions?: CompletionFeedbackConfig;
}

export default function QuickComplete({
  visible,
  onClose,
  onQuickComplete,
  themeKey = 'orange',
  customQuestions
}: Props) {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selectedOptions: string[] }[]>([]);

  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);

  // Get theme colors
  const theme = getTheme(themeKey);

  // Get questions for the selected feedback type
  const getQuestions = (type: FeedbackType): FollowUpQuestion[] => {
    const custom = customQuestions?.[type];
    const defaults = DEFAULT_FOLLOWUP_QUESTIONS[type];
    return custom || defaults || [];
  };

  const currentQuestions = selectedFeedback ? getQuestions(selectedFeedback) : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= currentQuestions.length - 1;

  useEffect(() => {
    if (visible) {
      // Reset state
      setSelectedFeedback(null);
      setCurrentQuestionIndex(0);
      setAnswers([]);

      // Trigger haptic
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Animate in
      backdropOpacity.value = withTiming(1, { duration: 300 });
      cardScale.value = withSpring(1, { damping: 15, stiffness: 200 });

      checkScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.2, { damping: 8, stiffness: 200 }),
          withSpring(1, { damping: 12, stiffness: 150 })
        )
      );

      buttonsOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));
    } else {
      // Reset
      backdropOpacity.value = 0;
      cardScale.value = 0;
      checkScale.value = 0;
      buttonsOpacity.value = 0;
    }
  }, [visible]);

  const handleFeedbackSelect = (type: FeedbackType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFeedback(type);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleOptionSelect = (optionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Build the new answer
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({ questionId: currentQuestion.id, selectedOptions: [optionId] });
    setAnswers(newAnswers);

    // Auto-advance after brief delay (user can use back button if it was an accident)
    setTimeout(() => {
      if (isLastQuestion) {
        handleComplete(newAnswers);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 250);
  };

  const handleComplete = (finalAnswers: { questionId: string; selectedOptions: string[] }[]) => {
    if (!selectedFeedback) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    cardScale.value = withSequence(
      withSpring(1.05, { damping: 10, stiffness: 200 }),
      withTiming(0, { duration: 200 }, () => {
        runOnJS(onQuickComplete)({
          type: selectedFeedback,
          followUpAnswers: finalAnswers,
        });
        runOnJS(onClose)();
      })
    );

    backdropOpacity.value = withTiming(0, { duration: 300 });
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setSelectedFeedback(null);
    }
  };

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
  }));

  const feedbackOptions = [
    { value: 'worked_great' as FeedbackType, label: 'Worked great!', emoji: '🎉', color: theme.primary },
    { value: 'went_ok' as FeedbackType, label: 'It went ok', emoji: '👍', color: theme.primaryLight },
    { value: 'not_sure' as FeedbackType, label: 'Not sure', emoji: '🤔', color: theme.primaryLighter },
    { value: 'not_for_me' as FeedbackType, label: 'Not for me', emoji: '👎', color: '#9E9E9E' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          <LinearGradient
            colors={[theme.primaryLightest, '#FFFFFF']}
            style={styles.gradient}
          >
            {/* Success Check */}
            <Animated.View style={[styles.checkContainer, checkAnimatedStyle]}>
              <View style={[styles.checkCircle, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="checkmark" size={48} color="#FFF" />
              </View>
            </Animated.View>

            <Text style={styles.title}>You Did It! 🎉</Text>
            <Text style={styles.subtitle}>
              {selectedFeedback ? currentQuestion?.question || 'Great job completing the experiment!' : 'How did it go?'}
            </Text>

            <Animated.View style={[styles.optionsSection, buttonsAnimatedStyle]}>
              {!selectedFeedback ? (
                // Initial feedback selection
                <View style={styles.feedbackGrid}>
                  {feedbackOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.feedbackButton, { borderColor: option.color }]}
                      onPress={() => handleFeedbackSelect(option.value)}
                    >
                      <Text style={styles.feedbackEmoji}>{option.emoji}</Text>
                      <Text style={[styles.feedbackLabel, { color: option.color }]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : currentQuestion ? (
                // Follow-up questions
                <ScrollView
                  style={styles.questionScroll}
                  contentContainerStyle={styles.questionScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.optionsGrid}>
                    {currentQuestion.options.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        style={styles.optionButton}
                        onPress={() => handleOptionSelect(option.id)}
                      >
                        {option.emoji && <Text style={styles.optionEmoji}>{option.emoji}</Text>}
                        <Text style={styles.optionLabel}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              ) : null}
            </Animated.View>

            {/* Progress indicator for follow-up questions */}
            {selectedFeedback && currentQuestions.length > 1 && (
              <View style={styles.progressContainer}>
                {currentQuestions.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.progressDot,
                      { backgroundColor: index <= currentQuestionIndex ? theme.primary : '#E0E0E0' }
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Bottom actions */}
            <View style={styles.bottomActions}>
              {selectedFeedback ? (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Ionicons name="arrow-back" size={18} color={theme.primary} />
                  <Text style={[styles.backButtonText, { color: theme.primary }]}>Back</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.skipButton} onPress={onClose}>
                  <Text style={styles.skipButtonText}>Not yet</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouch: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  card: {
    width: SCREEN_WIDTH - 32,
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  gradient: {
    padding: 24,
    alignItems: 'center',
  },
  checkContainer: {
    marginBottom: 16,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  optionsSection: {
    width: '100%',
  },
  feedbackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  feedbackButton: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  questionScroll: {
    maxHeight: 280,
  },
  questionScrollContent: {
    paddingBottom: 8,
  },
  optionsGrid: {
    gap: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  optionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 15,
    color: '#424242',
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomActions: {
    marginTop: 16,
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 6,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#666',
  },
});
