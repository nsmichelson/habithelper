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
import { QUIZ_QUESTIONS, getConditionalQuestions } from '../data/quizQuestions';
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
  const [availableQuestions, setAvailableQuestions] = useState<QuizQuestion[]>(QUIZ_QUESTIONS);
  
  const progress = useSharedValue(0);
  const questionOpacity = useSharedValue(1);
  
  // Update available questions when responses change (for conditional questions)
  useEffect(() => {
    const questions = getConditionalQuestions(responses);
    setAvailableQuestions(questions);
  }, [responses]);
  
  const currentQuestion = availableQuestions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / availableQuestions.length) * 100;

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
    if (currentQuestionIndex < availableQuestions.length - 1) {
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

    // Process each response based on new quiz structure
    allResponses.forEach(response => {
      const values = Array.isArray(response.value) ? response.value : [response.value];
      
      switch (response.questionId) {
        // Medical stuff
        case 'health_stuff':
          // Map to actual medical conditions
          if (values.includes('diabetes')) {
            profile.medical_conditions.push('t2_diabetes');
          }
          if (values.includes('heart')) {
            profile.medical_conditions.push('hypertension');
          }
          if (values.includes('digestive')) {
            profile.medical_conditions.push('ibs');
          }
          if (values.includes('pregnancy')) {
            profile.medical_conditions.push('pregnancy');
          }
          break;
          
        case 'which_allergies':
          // Map allergies to medical conditions
          values.forEach(allergy => {
            switch(allergy) {
              case 'nuts': profile.medical_conditions.push('nut_allergy'); break;
              case 'dairy': profile.medical_conditions.push('lactose_intolerance'); break;
              case 'gluten': profile.medical_conditions.push('celiac'); break;
              case 'eggs': profile.medical_conditions.push('egg_allergy'); break;
              case 'seafood': profile.medical_conditions.push('fish_allergy', 'shellfish_allergy'); break;
              case 'soy': profile.medical_conditions.push('soy_allergy'); break;
            }
          });
          break;
          
        case 'real_goals':
          // Map real goals to nutrition goals
          values.forEach(goal => {
            switch(goal) {
              case 'look_good':
              case 'clothes_fit': 
                profile.goals.push('weight_loss'); 
                break;
              case 'more_energy': 
                profile.goals.push('improve_energy'); 
                break;
              case 'health_scare':
                profile.goals.push('better_lipids', 'lower_blood_pressure');
                break;
              case 'less_bloated':
                profile.goals.push('improve_gut_health');
                break;
              case 'athletic':
                profile.goals.push('endurance_performance', 'strength_performance');
                break;
              case 'keep_up_kids':
              case 'just_healthier':
                profile.goals.push('improve_energy', 'increase_veggies');
                break;
            }
          });
          break;
          
        case 'kitchen_reality':
          // Map kitchen skills to cooking time
          switch(values[0]) {
            case 'microwave_master':
            case 'no_kitchen':
              profile.cooking_time_available = 'none';
              break;
            case 'basic':
              profile.cooking_time_available = 'minimal';
              break;
            case 'follow_recipe':
              profile.cooking_time_available = 'moderate';
              break;
            case 'confident':
            case 'chef':
              profile.cooking_time_available = 'plenty';
              profile.wants_to_learn_cooking = true;
              break;
          }
          break;
          
        case 'money_truth':
          // Budget consciousness
          profile.budget_conscious = ['tight', 'careful'].includes(values[0]);
          break;
          
        case 'real_talk':
          // Vegetable relationship affects goals
          if (['avoid', 'hide_them'].includes(values[0])) {
            profile.goals.push('increase_veggies');
          }
          profile.dietary_preferences = values;
          break;
          
        case 'non_negotiables':
          // Store food preferences
          profile.dietary_preferences = [...(profile.dietary_preferences || []), ...values];
          break;
          
        case 'eating_personality':
          // Store eating patterns
          profile.dietary_preferences = [...(profile.dietary_preferences || []), ...values];
          break;
          
        case 'life_chaos':
          // Store lifestyle info
          profile.life_stage = values;
          break;
          
        case 'experiment_style':
          // Store difficulty preference
          profile.difficulty_preference = values[0];
          break;
          
        case 'biggest_obstacle':
          // Store main challenge
          profile.biggest_obstacle = values[0];
          break;
          
        case 'home_situation':
          // Store home/family situation
          profile.home_situation = values;
          break;
          
        case 'diet_history':
          // Store diet attempt history
          profile.dietary_preferences = [...(profile.dietary_preferences || []), `history_${values[0]}`];
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
            {currentQuestionIndex + 1} of {availableQuestions.length}
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
              {currentQuestionIndex === availableQuestions.length - 1 ? "Let's do this!" : 'Next'}
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