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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { QuizQuestion } from '../types/quiz';
import { getNextQuestions, mapQuizToProfile } from '../data/newQuizStructure';
import StorageService from '../services/storage';
import { UserProfile } from '../types/tip';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemeKey, getTheme, getRandomThemeKey } from '../constants/Themes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  onComplete: (profile: UserProfile) => void;
  existingProfile?: UserProfile;
  isRetake?: boolean;
  shouldPersistProfile?: boolean;
  themeKey?: ThemeKey;
}

// Progress dots component
const ProgressDots = ({ current, total, theme }: { current: number; total: number; theme: any }) => {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressDots}>
        {Array.from({ length: total }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor: index <= current ? theme.primary : '#e0e0e0',
                width: index === current ? 24 : 8,
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default function OnboardingQuizNew({
  onComplete,
  existingProfile,
  isRetake = false,
  shouldPersistProfile = true,
  themeKey,
}: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, string[]>>(new Map());
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [availableQuestions, setAvailableQuestions] = useState<QuizQuestion[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeThemeKey] = useState<ThemeKey>(themeKey || getRandomThemeKey());

  const theme = getTheme(activeThemeKey);
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
  const totalSteps = 8;

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
    questionOpacity.value = withTiming(0, { duration: 150 }, () => {
      questionOpacity.value = withTiming(1, { duration: 150 });
    });

    setTimeout(() => {
      if (currentQuestionIndex < availableQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      } else {
        handleComplete(newResponses);
      }
      setIsTransitioning(false);
    }, 200);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsTransitioning(true);

      questionOpacity.value = withTiming(0, { duration: 150 }, () => {
        questionOpacity.value = withTiming(1, { duration: 150 });
      });

      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleComplete = async (finalResponses: Map<string, string[]>) => {
    const profileData = mapQuizToProfile(finalResponses);

    const profile: UserProfile = {
      ...existingProfile,
      ...profileData,
      created_at: existingProfile?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      quiz_completed: true,
    };

    if (shouldPersistProfile) {
      await StorageService.saveUserProfile(profile);
      await StorageService.saveQuizResponses(Array.from(finalResponses.entries()).map(([questionId, values]) => ({
        questionId,
        values
      })));
      await StorageService.setOnboardingCompleted(true);
    }

    onComplete(profile);
  };

  const animatedQuestionStyle = useAnimatedStyle(() => ({
    opacity: questionOpacity.value,
    transform: [
      {
        translateY: interpolate(
          questionOpacity.value,
          [0, 1],
          [10, 0]
        ),
      },
    ],
  }));

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={[styles.loadingCircle, { backgroundColor: theme.primaryLightest }]}>
            <View style={[styles.loadingInner, { backgroundColor: theme.primaryLight }]} />
          </View>
          <Text style={[styles.loadingText, { color: theme.primary }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          {currentQuestionIndex > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={theme.primary} />
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}
          <Text style={styles.headerTitle}>
            {isRetake ? 'Update Preferences' : 'Welcome'}
          </Text>
          <View style={styles.backButton} />
        </View>

        {/* Progress */}
        <ProgressDots current={currentQuestionIndex} total={totalSteps} theme={theme} />

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.questionContainer, animatedQuestionStyle]}>
            {/* Question */}
            <Text style={[styles.question, { color: theme.primary }]}>
              {currentQuestion.question}
            </Text>
            {currentQuestion.helpText && (
              <Text style={styles.helpText}>{currentQuestion.helpText}</Text>
            )}

            {/* Options or Input */}
            <View style={styles.optionsContainer}>
              {currentQuestion.type === 'text' ? (
                <TextInput
                  style={[styles.textInput, { borderColor: theme.primaryLighter }]}
                  value={textInput}
                  onChangeText={setTextInput}
                  placeholder={currentQuestion.placeholder}
                  placeholderTextColor="#bdbdbd"
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
                        isSelected && {
                          backgroundColor: theme.primaryLightest,
                          borderColor: theme.primary,
                        }
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
                      <View style={[
                        styles.optionCheckCircle,
                        {
                          borderColor: isSelected ? theme.primary : '#e0e0e0',
                          backgroundColor: isSelected ? theme.primary : 'transparent',
                        }
                      ]}>
                        {isSelected && (
                          <Ionicons name="checkmark" size={14} color="#fff" />
                        )}
                      </View>
                      <Text style={[
                        styles.optionText,
                        isSelected && { color: theme.primary, fontWeight: '600' }
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: canContinue() ? theme.primary : '#e0e0e0' }
            ]}
            onPress={handleContinue}
            disabled={!canContinue() || isTransitioning}
          >
            <Text style={styles.continueButtonText}>
              {currentQuestionIndex === availableQuestions.length - 1
                ? 'Get Started'
                : currentQuestion.required || selectedValues.length > 0 || textInput
                  ? 'Continue'
                  : 'Skip'}
            </Text>
            <Ionicons
              name={currentQuestionIndex === availableQuestions.length - 1 ? 'checkmark' : 'arrow-forward'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#424242',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  questionContainer: {
    marginTop: 16,
  },
  question: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  helpText: {
    fontSize: 15,
    color: '#757575',
    marginBottom: 32,
    lineHeight: 22,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#eeeeee',
  },
  optionCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionText: {
    fontSize: 16,
    color: '#424242',
    flex: 1,
    lineHeight: 22,
  },
  textInput: {
    backgroundColor: '#fafafa',
    borderRadius: 14,
    padding: 18,
    fontSize: 16,
    color: '#424242',
    minHeight: 120,
    borderWidth: 1.5,
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#fff',
  },
  continueButton: {
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loadingInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
