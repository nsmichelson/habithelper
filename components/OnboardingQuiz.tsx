import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { QuizQuestion, QuizResponse } from '../types/quiz';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import StorageService from '../services/storage';
import { UserProfile } from '../types/tip';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingQuiz({ onComplete }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  
  const progress = useSharedValue(0);
  const questionOpacity = useSharedValue(1);
  
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  useEffect(() => {
    progress.value = withSpring(progressPercentage);
  }, [currentQuestionIndex]);

  const handleSingleChoice = (value: string) => {
    setSelectedValues([value]);
  };

  const handleMultipleChoice = (value: string) => {
    if (value === 'none') {
      setSelectedValues(['none']);
    } else {
      const newValues = selectedValues.filter(v => v !== 'none');
      if (selectedValues.includes(value)) {
        setSelectedValues(newValues.filter(v => v !== value));
      } else {
        setSelectedValues([...newValues, value]);
      }
    }
  };

  const handleNext = async () => {
    if (selectedValues.length === 0 && currentQuestion.required) {
      Alert.alert('Required', 'Please select at least one option');
      return;
    }

    // Save response
    const response: QuizResponse = {
      questionId: currentQuestion.id,
      value: currentQuestion.type === 'single_choice' ? selectedValues[0] : selectedValues,
    };
    
    const newResponses = [...responses, response];
    setResponses(newResponses);

    // Animate transition
    questionOpacity.value = withTiming(0, { duration: 200 }, () => {
      questionOpacity.value = withTiming(1, { duration: 200 });
    });

    // Move to next question or complete
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedValues([]);
      }, 200);
    } else {
      // Complete onboarding
      await completeOnboarding(newResponses);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      questionOpacity.value = withTiming(0, { duration: 200 }, () => {
        questionOpacity.value = withTiming(1, { duration: 200 });
      });

      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        // Restore previous response
        const prevResponse = responses[currentQuestionIndex - 1];
        if (prevResponse) {
          setSelectedValues(
            Array.isArray(prevResponse.value) 
              ? prevResponse.value 
              : [prevResponse.value as string]
          );
        }
      }, 200);
    }
  };

  const completeOnboarding = async (allResponses: QuizResponse[]) => {
    // Process responses into user profile
    const profile: UserProfile = {
      id: Date.now().toString(),
      created_at: new Date(),
      onboarding_completed: true,
      medical_conditions: [],
      goals: [],
    };

    // Process each response
    allResponses.forEach(response => {
      const values = Array.isArray(response.value) ? response.value : [response.value];
      
      switch (response.questionId) {
        case 'medical_conditions':
          profile.medical_conditions = values.filter(v => v !== 'none');
          break;
        case 'food_allergies':
          profile.medical_conditions.push(...values.filter(v => v !== 'none'));
          break;
        case 'primary_goals':
          profile.goals = values;
          break;
        case 'cooking_time':
          profile.cooking_time_available = values[0] as any;
          break;
        case 'meal_locations':
          profile.eating_locations = values;
          break;
        case 'budget_conscious':
          profile.budget_conscious = response.value as number >= 4;
          break;
        case 'food_preferences':
          profile.dietary_preferences = values;
          break;
        case 'learning_interests':
          profile.wants_to_learn_cooking = values.includes('cooking_skills');
          profile.interested_in_nutrition_facts = values.includes('nutrition_facts');
          break;
      }
    });

    // Save to storage
    await StorageService.saveUserProfile(profile);
    await StorageService.saveQuizResponses(allResponses);
    await StorageService.setOnboardingCompleted(true);

    // Call completion callback
    onComplete(profile);
  };

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const questionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: questionOpacity.value,
  }));

  const renderOption = (option: { value: string; label: string }) => {
    const isSelected = selectedValues.includes(option.value);
    
    return (
      <TouchableOpacity
        key={option.value}
        style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
        onPress={() => {
          if (currentQuestion.type === 'single_choice') {
            handleSingleChoice(option.value);
          } else {
            handleMultipleChoice(option.value);
          }
        }}
      >
        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
          {option.label}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        )}
      </TouchableOpacity>
    );
  };

  const renderScaleOptions = () => {
    const min = currentQuestion.min || 1;
    const max = currentQuestion.max || 5;
    const selected = selectedValues[0] ? parseInt(selectedValues[0]) : null;
    
    return (
      <View style={styles.scaleContainer}>
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabelText}>Not Important</Text>
          <Text style={styles.scaleLabelText}>Very Important</Text>
        </View>
        <View style={styles.scaleButtons}>
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(value => (
            <TouchableOpacity
              key={value}
              style={[
                styles.scaleButton,
                selected === value && styles.scaleButtonSelected
              ]}
              onPress={() => handleSingleChoice(value.toString())}
            >
              <Text style={[
                styles.scaleButtonText,
                selected === value && styles.scaleButtonTextSelected
              ]}>
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8F5E9', '#FFFFFF']}
        style={styles.gradient}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
          </Text>
        </View>

        {/* Question */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.questionContainer, questionAnimatedStyle]}>
            <Text style={styles.category}>{currentQuestion.category.toUpperCase()}</Text>
            <Text style={styles.question}>{currentQuestion.question}</Text>
            
            {currentQuestion.helpText && (
              <Text style={styles.helpText}>{currentQuestion.helpText}</Text>
            )}

            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuestion.type === 'scale' 
                ? renderScaleOptions()
                : currentQuestion.options?.map(renderOption)}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#666" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedValues.length === 0 && currentQuestion.required && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? 'Complete' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  gradient: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    paddingVertical: 20,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
    letterSpacing: 1,
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
    lineHeight: 32,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    fontSize: 16,
    color: '#424242',
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  nextButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 8,
  },
  scaleContainer: {
    marginTop: 20,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  scaleLabelText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  scaleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scaleButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    minHeight: 50,
  },
  scaleButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  scaleButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  scaleButtonTextSelected: {
    color: '#2E7D32',
  },
});