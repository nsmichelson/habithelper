import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { QuizQuestion, QuizResponse } from '../types/quiz';
import { NEW_QUIZ_QUESTIONS, getNextQuestions, mapQuizToProfile } from '../data/newQuizStructure';
import StorageService from '../services/storage';
import { UserProfile } from '../types/tip';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  onComplete: (profile: UserProfile) => void;
  existingProfile?: UserProfile;
  isRetake?: boolean;
}

// Progress bar component
const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring((current / total) * 100);
  }, [current, total]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, animatedStyle]} />
      </View>
      <Text style={styles.progressText}>
        Step {current} of {total}
      </Text>
    </View>
  );
};

export default function OnboardingQuizNew({ onComplete, existingProfile, isRetake = false }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, string[]>>(new Map());
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [availableQuestions, setAvailableQuestions] = useState<QuizQuestion[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scrollViewRef = React.useRef<ScrollView>(null);
  const questionOpacity = useSharedValue(1);

  // Initialize questions based on responses
  useEffect(() => {
    const questions = getNextQuestions(responses);
    setAvailableQuestions(questions);
  }, [responses]);

  // Load existing responses if retaking
  useEffect(() => {
    if (existingProfile && isRetake) {
      // Pre-populate responses from existing profile
      const initialResponses = new Map<string, string[]>();

      if (existingProfile.primary_focus) {
        initialResponses.set('primary_area', [existingProfile.primary_focus]);
      }

      if (existingProfile.goals && existingProfile.goals.length > 0) {
        const areaKey = `${existingProfile.primary_focus}_specifics`;
        initialResponses.set(areaKey, existingProfile.goals);
      }

      if (existingProfile.success_vision) {
        initialResponses.set('success_vision', [existingProfile.success_vision]);
      }

      setResponses(initialResponses);
    }
  }, [existingProfile, isRetake]);

  const currentQuestion = availableQuestions[currentQuestionIndex];
  const totalSteps = 8; // Approximate number of main questions

  // Initialize selected values when question changes
  useEffect(() => {
    if (currentQuestion) {
      const existingResponse = responses.get(currentQuestion.id);
      if (existingResponse) {
        setSelectedValues(existingResponse);
        if (currentQuestion.type === 'text') {
          setTextInput(existingResponse[0] || '');
        }
      } else {
        setSelectedValues([]);
        setTextInput('');
      }
    }
  }, [currentQuestion, responses]);

  const handleSingleChoice = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedValues([value]);
  };

  const handleMultipleChoice = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const canContinue = () => {
    if (!currentQuestion) return false;

    if (currentQuestion.type === 'text') {
      return textInput.trim().length > 0 || !currentQuestion.required;
    }

    return selectedValues.length > 0 || !currentQuestion.required;
  };

  const handleContinue = async () => {
    if (!canContinue()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Save current response
    const newResponses = new Map(responses);
    if (currentQuestion.type === 'text') {
      if (textInput.trim()) {
        newResponses.set(currentQuestion.id, [textInput.trim()]);
      }
    } else if (selectedValues.length > 0) {
      newResponses.set(currentQuestion.id, selectedValues);
    }
    setResponses(newResponses);

    // Animate transition
    setIsTransitioning(true);
    questionOpacity.value = withTiming(0, { duration: 200 }, () => {
      questionOpacity.value = withTiming(1, { duration: 200 });
    });

    setTimeout(() => {
      if (currentQuestionIndex < availableQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      } else {
        // Complete quiz
        handleComplete(newResponses);
      }
      setIsTransitioning(false);
    }, 250);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsTransitioning(true);

      questionOpacity.value = withTiming(0, { duration: 200 }, () => {
        questionOpacity.value = withTiming(1, { duration: 200 });
      });

      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        setIsTransitioning(false);
      }, 250);
    }
  };

  const handleComplete = async (finalResponses: Map<string, string[]>) => {
    // Convert responses to profile
    const profileData = mapQuizToProfile(finalResponses);

    // Create or update user profile
    const profile: UserProfile = {
      ...existingProfile,
      ...profileData,
      created_at: existingProfile?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      quiz_completed: true,
    };

    // Save to storage
    await StorageService.saveUserProfile(profile);
    await StorageService.saveQuizResponses(Array.from(finalResponses.entries()).map(([questionId, values]) => ({
      questionId,
      values
    })));

    onComplete(profile);
  };

  const animatedQuestionStyle = useAnimatedStyle(() => ({
    opacity: questionOpacity.value,
    transform: [
      {
        translateY: interpolate(
          questionOpacity.value,
          [0, 1],
          [20, 0]
        ),
      },
    ],
  }));

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#4A90E2', '#7B68EE']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading questions...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient colors={['#4A90E2', '#7B68EE']} style={styles.gradient}>
          {/* Header */}
          <View style={styles.header}>
            {currentQuestionIndex > 0 && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>
              {isRetake ? 'Update Your Preferences' : 'Let\'s Get Started'}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Progress */}
          <ProgressBar current={currentQuestionIndex + 1} total={totalSteps} />

          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.questionContainer, animatedQuestionStyle]}>
              {/* Question */}
              <Text style={styles.questionNumber}>
                Question {currentQuestionIndex + 1}
              </Text>
              <Text style={styles.question}>{currentQuestion.question}</Text>
              {currentQuestion.helpText && (
                <Text style={styles.helpText}>{currentQuestion.helpText}</Text>
              )}

              {/* Options or Input */}
              <View style={styles.optionsContainer}>
                {currentQuestion.type === 'text' ? (
                  <TextInput
                    style={styles.textInput}
                    value={textInput}
                    onChangeText={setTextInput}
                    placeholder={currentQuestion.placeholder}
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                ) : (
                  currentQuestion.options?.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.optionButton,
                          isSelected && styles.optionButtonSelected
                        ]}
                        onPress={() => {
                          if (currentQuestion.type === 'single_choice') {
                            handleSingleChoice(option.value);
                          } else {
                            handleMultipleChoice(option.value);
                          }
                        }}
                        disabled={isTransitioning}
                      >
                        <Text style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected
                        ]}>
                          {option.label}
                        </Text>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#FFF"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !canContinue() && styles.continueButtonDisabled
                ]}
                onPress={handleContinue}
                disabled={!canContinue() || isTransitioning}
              >
                <Text style={styles.continueButtonText}>
                  {currentQuestionIndex === availableQuestions.length - 1
                    ? 'Complete'
                    : currentQuestion.required || selectedValues.length > 0 || textInput
                      ? 'Continue'
                      : 'Skip'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  questionContainer: {
    marginTop: 20,
  },
  questionNumber: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    lineHeight: 32,
  },
  helpText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 30,
    lineHeight: 22,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: '#FFF',
  },
  optionText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 18,
    fontSize: 16,
    color: '#FFF',
    minHeight: 120,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  continueButton: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFF',
  },
});