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
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { QuizQuestion, QuizResponse, QuizOption } from '../types/quiz';
import { QUIZ_QUESTIONS, getConditionalQuestions } from '../data/quizQuestions';
import StorageService from '../services/storage';
import { UserProfile } from '../types/tip';
import { Ionicons } from '@expo/vector-icons';
import IdentityQuizStep from './quiz/IdentityQuizStep';
import { getTipGoalsForQuizGoals, GOAL_MAPPINGS } from '../data/goalMappings';
import { getDynamicOptions } from '../data/dynamicOptionMappings';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  onComplete: (profile: UserProfile) => void;
  existingProfile?: UserProfile;  // Optional: for retaking the quiz
  isRetake?: boolean;  // Optional: to show different title
}

// Helper to normalize response values to always be an array
const toArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export default function OnboardingQuiz({ onComplete, existingProfile, isRetake = false }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [textInputValue, setTextInputValue] = useState<string>('');
  const [availableQuestions, setAvailableQuestions] = useState<QuizQuestion[]>(QUIZ_QUESTIONS);
  const [showIdentityStep, setShowIdentityStep] = useState(false);
  const [identityData, setIdentityData] = useState<{ adjectives: string[], role: string } | null>(null);

  const scrollViewRef = React.useRef<ScrollView>(null);
  const progress = useSharedValue(0);
  const questionOpacity = useSharedValue(1);

  // Initialize with existing profile data if retaking
  useEffect(() => {
    const loadExistingResponses = async () => {
      if (existingProfile && responses.length === 0) {
        // First try to load previously saved quiz responses
        const savedResponses = await StorageService.getQuizResponses();
        if (savedResponses && savedResponses.length > 0) {
          // Normalize saved responses to ensure they all have 'values' as array
          const normalizedResponses = savedResponses.map(r => ({
            questionId: r.questionId,
            values: r.values || toArray((r as any).value)
          }));
          setResponses(normalizedResponses);
          console.log('Loaded saved quiz responses:', normalizedResponses);
          return;
        }
        
        // Otherwise, map from profile
        const initialResponses: QuizResponse[] = [];
      
      // Map profile data back to quiz responses using correct question IDs
      // Medical conditions are stored as 'health_stuff' and 'which_allergies'
      const healthConditions: string[] = [];
      const allergies: string[] = [];
      
      existingProfile.medical_conditions?.forEach(condition => {
        switch(condition) {
          case 't2_diabetes': healthConditions.push('diabetes'); break;
          case 'hypertension': healthConditions.push('heart'); break;
          case 'ibs': healthConditions.push('digestive'); break;
          case 'pregnancy': healthConditions.push('pregnancy'); break;
          case 'nut_allergy': allergies.push('nuts'); break;
          case 'lactose_intolerance': allergies.push('dairy'); break;
          case 'celiac': allergies.push('gluten'); break;
          case 'egg_allergy': allergies.push('eggs'); break;
          case 'fish_allergy':
          case 'shellfish_allergy': allergies.push('seafood'); break;
          case 'soy_allergy': allergies.push('soy'); break;
        }
      });
      
      if (healthConditions.length > 0) {
        initialResponses.push({ questionId: 'health_stuff', values: healthConditions });
      }
      if (allergies.length > 0) {
        initialResponses.push({ questionId: 'which_allergies', values: allergies });
      }
      
      // Map goals to 'real_goals' question
      if (existingProfile.goals?.length > 0) {
        const realGoals: string[] = [];
        existingProfile.goals.forEach(goal => {
          switch(goal) {
            case 'weight_loss': 
              if (!realGoals.includes('look_good')) realGoals.push('look_good');
              break;
            case 'improve_energy': 
              if (!realGoals.includes('more_energy')) realGoals.push('more_energy');
              break;
            case 'better_lipids':
            case 'lower_blood_pressure':
              if (!realGoals.includes('health_scare')) realGoals.push('health_scare');
              break;
            case 'improve_gut_health':
              if (!realGoals.includes('less_bloated')) realGoals.push('less_bloated');
              break;
            case 'endurance_performance':
            case 'strength_performance':
              if (!realGoals.includes('athletic')) realGoals.push('athletic');
              break;
            case 'increase_veggies':
              if (!realGoals.includes('just_healthier')) realGoals.push('just_healthier');
              break;
          }
        });
        if (realGoals.length > 0) {
          initialResponses.push({ questionId: 'real_goals', values: realGoals });
        }
      }
      
      // Map kitchen/cooking to 'kitchen_reality'
      if (existingProfile.cooking_time_available) {
        let kitchenSkill = 'basic';
        switch(existingProfile.cooking_time_available) {
          case 'none': kitchenSkill = 'microwave_master'; break;
          case 'minimal': kitchenSkill = 'basic'; break;
          case 'moderate': kitchenSkill = 'follow_recipe'; break;
          case 'plenty': kitchenSkill = existingProfile.wants_to_learn_cooking ? 'confident' : 'follow_recipe'; break;
        }
        initialResponses.push({ questionId: 'kitchen_reality', values: [kitchenSkill] });
      }
      
      // Map budget to 'money_truth'
      if (existingProfile.budget_conscious !== undefined) {
        initialResponses.push({ 
          questionId: 'money_truth', 
          values: [existingProfile.budget_conscious ? 'careful' : 'comfortable'] 
        });
      }
      
      // Store other mapped values for potential use
      if (existingProfile.dietary_preferences && existingProfile.dietary_preferences.length > 0) {
        // These might map to 'real_talk', 'non_negotiables', or 'eating_personality'
        // Need to analyze the actual values to map correctly
      }
      
      console.log('Initialized responses for retake:', initialResponses);
      setResponses(initialResponses);
    }
  };
  
  loadExistingResponses();
}, [existingProfile]);
  
  // Update available questions when responses change (for conditional questions)
  useEffect(() => {
    const questions = getConditionalQuestions(responses);
    setAvailableQuestions(questions);

    // Find the first unanswered question
    const answeredQuestionIds = new Set(responses.map(r => r.questionId));
    const nextUnansweredIndex = questions.findIndex(q => !answeredQuestionIds.has(q.id));

    if (nextUnansweredIndex !== -1) {
      setCurrentQuestionIndex(nextUnansweredIndex);
    }
  }, [responses]);
  
  const currentQuestion = availableQuestions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / availableQuestions.length) * 100;

  // Get options for current question (dynamic or static)
  const getCurrentQuestionOptions = (): QuizOption[] => {
    if (!currentQuestion) return [];

    // Check if this question uses dynamic options
    if (currentQuestion.dynamicOptions) {
      const dynamicOpts = getDynamicOptions(currentQuestion.id, responses);
      if (dynamicOpts) {
        return dynamicOpts;
      }
    }

    // Fall back to static options
    return currentQuestion.options || [];
  };

  useEffect(() => {
    progress.value = withSpring(progressPercentage);
  }, [currentQuestionIndex]);

  // Pre-select existing values when showing a question
  useEffect(() => {
    if (currentQuestion) {
      const existingResponse = responses.find(r => r.questionId === currentQuestion.id);
      if (existingResponse) {
        // Use toArray helper to normalize both .value and .values
        const values = existingResponse.values || toArray((existingResponse as any).value);
        setSelectedValues(values);
      } else {
        setSelectedValues([]);
      }
    }
  }, [currentQuestionIndex, currentQuestion?.id, responses]);

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
        // Check if this is a _specifics question with a limit of 2
        const isSpecificsQuestion = currentQuestion.id.includes('_specifics');
        const maxSelections = isSpecificsQuestion ? 2 : 999; // 2 for specifics, unlimited otherwise

        if (newValues.length >= maxSelections) {
          // Replace the oldest selection with the new one
          setSelectedValues([...newValues.slice(1), value]);
        } else {
          setSelectedValues([...newValues, value]);
        }
      }
    }
  };

  const handleNext = async () => {
    // Check if answer is provided based on question type
    if (currentQuestion.type === 'text') {
      if (!textInputValue.trim() && currentQuestion.required) {
        Alert.alert('Required', 'Please provide an answer');
        return;
      }
    } else {
      if (selectedValues.length === 0 && currentQuestion.required) {
        Alert.alert('Required', 'Please select at least one option');
        return;
      }
    }

    // Create response with consistent structure (always use 'values' as array)
    const response: QuizResponse = {
      questionId: currentQuestion.id,
      values: currentQuestion.type === 'text' ? [textInputValue.trim()] : selectedValues,
    };
    
    // Upsert response by questionId instead of appending
    const existingIndex = responses.findIndex(r => r.questionId === currentQuestion.id);
    let newResponses: QuizResponse[];
    if (existingIndex >= 0) {
      // Update existing response
      newResponses = [...responses];
      newResponses[existingIndex] = response;
    } else {
      // Add new response
      newResponses = [...responses, response];
    }
    setResponses(newResponses);

    // Debug logging for retake issues
    console.log(`Quiz progress: Question ${currentQuestionIndex + 1} of ${availableQuestions.length}`);
    console.log('Current question ID:', currentQuestion.id);
    console.log('Is last question?', currentQuestionIndex === availableQuestions.length - 1);
    console.log('Is retake?', isRetake);

    // Animate transition
    questionOpacity.value = withTiming(0, { duration: 200 }, () => {
      questionOpacity.value = withTiming(1, { duration: 200 });
    });

    // Check if there are more questions after response processing
    // The useEffect will automatically move to the next unanswered question
    setTimeout(() => {
      const questions = getConditionalQuestions(newResponses);
      const answeredIds = new Set(newResponses.map(r => r.questionId));
      const hasMoreQuestions = questions.some(q => !answeredIds.has(q.id));

      if (!hasMoreQuestions) {
        console.log('Moving to identity step');
        // Show identity step instead of completing immediately
        setShowIdentityStep(true);
      } else {
        // Reset form fields for next question
        setSelectedValues([]);
        setTextInputValue('');
        // Scroll to top for new question
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
      }
    }, 200);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      questionOpacity.value = withTiming(0, { duration: 200 }, () => {
        questionOpacity.value = withTiming(1, { duration: 200 });
      });

      setTimeout(() => {
        const prevIndex = currentQuestionIndex - 1;
        setCurrentQuestionIndex(prevIndex);
        
        // Find response by questionId, not by index
        const prevQuestion = availableQuestions[prevIndex];
        if (prevQuestion) {
          const prevResponse = responses.find(r => r.questionId === prevQuestion.id);
          if (prevResponse) {
            // Use toArray helper to normalize both .value and .values
            const values = prevResponse.values || toArray((prevResponse as any).value);
            if (prevQuestion.type === 'text') {
              setTextInputValue(values[0] || '');
              setSelectedValues([]);
            } else {
              setSelectedValues(values);
              setTextInputValue('');
            }
          } else {
            setSelectedValues([]);
            setTextInputValue('');
          }
        }
        
        // Scroll to top for previous question
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
      }, 200);
    }
  };

  const handleIdentityComplete = async (adjectives: string[], role: string) => {
    setIdentityData({ adjectives, role });
    await completeOnboarding(responses, adjectives, role);
  };

  const completeOnboarding = async (allResponses: QuizResponse[], adjectives?: string[], role?: string) => {
    console.log('🚀 completeOnboarding called with', allResponses.length, 'responses');

    // For retakes, start with existing profile; otherwise create new
    const profile: UserProfile = existingProfile ? {
      ...existingProfile,
      medical_conditions: [],  // Reset these as we'll rebuild from quiz
      goals: [],  // Reset these as we'll rebuild from quiz
    } : {
      id: Date.now().toString(),
      created_at: new Date(),
      onboarding_completed: true,
      medical_conditions: [],
      goals: [],
    };

    // Helper function to add unique goals
    const addGoal = (goal: any) => {
      if (!profile.goals.includes(goal)) {
        profile.goals.push(goal);
      }
    };

    // Process each response based on new quiz structure
    allResponses.forEach(response => {
      // Use toArray helper to normalize both .value and .values
      const values = response.values || toArray((response as any).value);
      
      switch (response.questionId) {
        // Primary motivation - determines primary_focus
        case 'primary_motivation':
          // Set the primary_focus field that tipRecommendationService expects
          profile.primary_focus = values[0];
          break;

        // Areas of interest
        case 'areas_of_interest':
          profile.areas_of_interest = values as any[];
          break;
          
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
            // Automatically add healthy pregnancy as a goal
            addGoal('healthy_pregnancy');
          }
          break;
          
        case 'which_allergies':
          // Map allergies to BOTH medical conditions AND allergies field
          // The allergies field is used by the allergen filter in recommendations
          if (!profile.allergies) {
            profile.allergies = [];
          }

          values.forEach(allergy => {
            // Add to allergies array for allergen filtering
            profile.allergies.push(allergy);

            // Also add to medical_conditions for backward compatibility
            switch(allergy) {
              case 'nuts': profile.medical_conditions.push('nut_allergy'); break;
              case 'dairy': profile.medical_conditions.push('lactose_intolerance'); break;
              case 'gluten': profile.medical_conditions.push('celiac'); break;
              case 'eggs': profile.medical_conditions.push('egg_allergy'); break;
              case 'seafood':
                profile.medical_conditions.push('fish_allergy', 'shellfish_allergy');
                // Split seafood into fish and shellfish for allergies
                profile.allergies.push('fish', 'shellfish');
                break;
              case 'soy': profile.medical_conditions.push('soy_allergy'); break;
            }
          });
          break;
          
        // Legacy question IDs - no longer used in current quiz
        // Keeping empty cases to document they're deprecated
        case 'real_goals':
        case 'organization_goals':
          console.warn(`Legacy question ID detected: ${response.questionId} - this should not appear in current quiz`);
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
          // Store vegetable preference directly - this affects HOW we approach tips, not goals
          profile.veggie_preference = values[0];
          // Don't assume they want to increase veggies - that's a separate choice
          // This preference will be used to select appropriate tip strategies
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
          
        case 'what_worked':
          // Store successful strategies
          profile.successful_strategies = values;
          break;
          
        case 'what_failed':
          // Store failed approaches to avoid
          profile.failed_approaches = values;
          break;
          
        case 'daily_life':
          // Store daily life persona
          profile.daily_life_persona = values[0];
          break;
          
        case 'motivation_style':
          // Store what motivates them
          profile.motivation_types = values;
          break;
          
        case 'stress_triggers':
          // Store stress eating triggers
          profile.stress_eating_triggers = values;
          break;

        case 'things_you_love':
          // Map to preferences for the recommendation engine (30% weight!)
          if (!profile.preferences) {
            profile.preferences = [];
          }
          profile.preferences.push(...values);
          console.log(`Added ${values.length} preferences from things_you_love:`, values);
          break;

        default:
          // Handle all _specifics questions (e.g., fitness_specifics, health_specifics, etc.)
          if (response.questionId.includes('_specifics')) {
            console.log(`Processing specifics question: ${response.questionId} with values:`, values);

            // These are the specific goals selected by the user
            // Map them to tip database goals and add them
            const mappedSpecificGoals = getTipGoalsForQuizGoals(values);
            console.log(`Mapped ${values.length} quiz goals to ${mappedSpecificGoals.length} tip goals:`, mappedSpecificGoals);

            mappedSpecificGoals.forEach(goal => addGoal(goal));

            // Also store the original quiz goals if not already stored
            if (!profile.quiz_goals) {
              profile.quiz_goals = [];
            }
            profile.quiz_goals.push(...values);
          }

          // Handle _why questions - they also map to goals
          if (response.questionId.includes('_why')) {
            console.log(`Processing why question: ${response.questionId} with values:`, values);

            // Map why reasons to tip database goals
            const mappedWhyGoals = getTipGoalsForQuizGoals(values);
            console.log(`Mapped ${values.length} why reasons to ${mappedWhyGoals.length} tip goals:`, mappedWhyGoals);

            mappedWhyGoals.forEach(goal => addGoal(goal));
          }

          // Handle barrier questions - map to specific_challenges (20% weight in recommendations!)
          if (response.questionId.includes('barriers_')) {
            if (!profile.specific_challenges) {
              profile.specific_challenges = {};
            }

            // Extract the area from the question ID (e.g., barriers_nutrition -> nutrition)
            let area = response.questionId.replace('barriers_', '');

            // CRITICAL FIX: Map barrier areas to match primary_focus values
            // The scorer reads specific_challenges[primary_focus], so we need to align keys
            const barrierAreaMapping: Record<string, string[]> = {
              'nutrition': ['nutrition', 'health', 'look_feel'], // nutrition barriers apply to all these
              'fitness': ['fitness', 'exercise'],
              'productivity': ['productivity', 'effectiveness'], // productivity barriers for effectiveness
              'energy': ['energy', 'sleeping'],
              'relationships': ['relationships', 'mindset'],
              'general': ['general'] // Keep general as-is
            };

            // Store under the correct primary_focus key(s)
            const targetAreas = barrierAreaMapping[area] || [area];

            targetAreas.forEach(targetArea => {
              if (!profile.specific_challenges[targetArea]) {
                profile.specific_challenges[targetArea] = [];
              }
              profile.specific_challenges[targetArea].push(...values);
            });

            // Also store under the original area for backward compatibility
            if (!profile.specific_challenges[area]) {
              profile.specific_challenges[area] = [];
            }
            profile.specific_challenges[area].push(...values);

            console.log(`Added ${values.length} barriers for ${area}, mapped to: ${targetAreas.join(', ')}`);
          }

          // Handle what_to_avoid questions - map to avoid_approaches (used for penalties in scoring!)
          if (response.questionId.includes('what_to_avoid_')) {
            if (!profile.avoid_approaches) {
              profile.avoid_approaches = [];
            }

            // Add all values to the avoid list
            profile.avoid_approaches.push(...values);
            console.log(`Added ${values.length} things to avoid:`, values);
          }
          break;
      }
    });

    // Add quiz responses to profile for conditional logic
    profile.quiz_responses = allResponses.map(r => ({
      questionId: r.questionId,
      value: r.values?.[0] || r.values || ''
    }));
    
    // Add identity data if provided
    if (adjectives && role) {
      profile.identityAdjectives = adjectives;
      profile.identityRole = role;
      profile.identityPhrase = `${adjectives.join(' ')} ${role}`;
    }

    // Log final profile for debugging
    console.log('=== FINAL PROFILE DATA ===');
    console.log('Primary Focus:', profile.primary_focus);
    console.log('Quiz Goals (original):', profile.quiz_goals || []);
    console.log('Tip Database Goals (mapped):', profile.goals || []);
    console.log('Total goals count:', profile.goals?.length || 0);

    // Log recommendation-critical fields
    console.log('\n📊 RECOMMENDATION ENGINE FIELDS:');
    console.log('Allergies:', profile.allergies || []);
    console.log('Preferences (30% weight):', profile.preferences || []);
    console.log('Specific Challenges (20% weight):', profile.specific_challenges || {});
    console.log('Avoid Approaches (penalties):', profile.avoid_approaches || []);

    // Validate critical fields and add defaults if needed
    const warnings = [];
    if (!profile.goals || profile.goals.length === 0) {
      warnings.push('No goals - tips won\'t be filtered properly');
    }

    // CRITICAL: Handle missing preferences (30% of scoring weight!)
    if (!profile.preferences || profile.preferences.length === 0) {
      warnings.push('No preferences - 30% of scoring weight unused');

      // Add default preferences based on primary focus to avoid losing 30% weight
      const defaultPreferencesByFocus: Record<string, string[]> = {
        'nutrition': ['cooking_experimenting', 'planning_organizing'],
        'health': ['planning_organizing', 'nature_outdoors'],
        'fitness': ['nature_outdoors', 'walking', 'podcasts_audiobooks'],
        'exercise': ['nature_outdoors', 'walking', 'podcasts_audiobooks'],
        'effectiveness': ['planning_organizing', 'podcasts_audiobooks'],
        'productivity': ['planning_organizing', 'coffee_shops'],
        'relationships': ['coffee_shops', 'restaurant_friends'],
        'mindset': ['nature_outdoors', 'walking'],
        'look_feel': ['planning_organizing', 'nature_outdoors'],
        'energy': ['nature_outdoors', 'walking'],
        'sleeping': ['nature_outdoors', 'podcasts_audiobooks']
      };

      if (profile.primary_focus && defaultPreferencesByFocus[profile.primary_focus]) {
        profile.preferences = defaultPreferencesByFocus[profile.primary_focus];
        console.log(`📝 Added default preferences for ${profile.primary_focus}:`, profile.preferences);
        console.log('ℹ️ User skipped "things you love" question - using defaults to maintain recommendation quality');
      }
    }

    if (!profile.specific_challenges || Object.keys(profile.specific_challenges).length === 0) {
      warnings.push('No barriers/challenges - 20% of scoring weight unused');
    }
    if (!profile.avoid_approaches || profile.avoid_approaches.length === 0) {
      warnings.push('No avoidance preferences - no penalties will apply');
    }

    if (warnings.length > 0) {
      console.warn('⚠️ Profile missing data for optimal recommendations:');
      warnings.forEach(w => console.warn(`  - ${w}`));
    } else {
      console.log('✅ Profile has all data needed for optimal recommendations!');
    }
    
    try {
      // Save to storage
      await StorageService.saveUserProfile(profile);
      await StorageService.saveQuizResponses(allResponses);
      await StorageService.setOnboardingCompleted(true);

      // Log all collected meta tags for analysis
      console.warn('\n========================================');
      console.warn('📊 QUIZ COMPLETED - COMPREHENSIVE META TAGS LOG');
      console.warn('========================================\n');
      console.log('\n========================================');
      console.log('📊 QUIZ COMPLETED - COMPREHENSIVE META TAGS LOG');
      console.log('========================================\n');

      // LOG EVERY SINGLE RESPONSE WITH ALL TAGS
      console.log('📋 ALL QUIZ RESPONSES AND TAGS:');
      console.log('--------------------------------');

      allResponses.forEach((response, index) => {
        console.log(`\n${index + 1}. QUESTION ID: ${response.questionId}`);
        console.log(`   VALUES/TAGS: ${response.values.join(', ')}`);
        console.log(`   TAG COUNT: ${response.values.length}`);
      });

      // Create a comprehensive tag collection
      const allTags: { [key: string]: string[] } = {};

      allResponses.forEach(response => {
        allTags[response.questionId] = response.values;
      });

      console.log('\n\n🏷️ ORGANIZED BY CATEGORY:');
      console.log('---------------------------');

      // Primary motivation
      if (allTags.primary_motivation) {
        console.log('\n🎯 PRIMARY MOTIVATION:', allTags.primary_motivation.join(', '));
      }

      // All specifics questions
      const specificsKeys = Object.keys(allTags).filter(k => k.includes('_specifics'));
      if (specificsKeys.length > 0) {
        console.log('\n📌 SPECIFIC GOALS:');
        specificsKeys.forEach(key => {
          console.log(`  ${key}: ${allTags[key].join(', ')}`);
        });
      }

      // All why questions
      const whyKeys = Object.keys(allTags).filter(k => k.includes('_why'));
      if (whyKeys.length > 0) {
        console.log('\n💭 ALL WHY/MOTIVATION RESPONSES:');
        whyKeys.forEach(key => {
          console.log(`  ${key}: ${allTags[key].join(', ')}`);
        });
      }

      // What worked questions
      const whatWorkedKeys = Object.keys(allTags).filter(k => k.includes('what_worked'));
      if (whatWorkedKeys.length > 0) {
        console.log('\n✅ WHAT WORKED RESPONSES:');
        whatWorkedKeys.forEach(key => {
          console.log(`  ${key}: ${allTags[key].join(', ')}`);
        });
      }

      // Barriers/challenges
      const barrierKeys = Object.keys(allTags).filter(k => k.includes('barrier') || k.includes('challenge'));
      if (barrierKeys.length > 0) {
        console.log('\n🚧 BARRIERS/CHALLENGES:');
        barrierKeys.forEach(key => {
          console.log(`  ${key}: ${allTags[key].join(', ')}`);
        });
      }

      // What to avoid
      const avoidKeys = Object.keys(allTags).filter(k => k.includes('avoid'));
      if (avoidKeys.length > 0) {
        console.log('\n⛔ WHAT TO AVOID:');
        avoidKeys.forEach(key => {
          console.log(`  ${key}: ${allTags[key].join(', ')}`);
        });
      }

      // All other questions not categorized above
      const categorizedKeys = new Set([
        ...specificsKeys,
        ...whyKeys,
        ...whatWorkedKeys,
        ...barrierKeys,
        ...avoidKeys,
        'primary_motivation'
      ]);

      const otherKeys = Object.keys(allTags).filter(k => !categorizedKeys.has(k));
      if (otherKeys.length > 0) {
        console.log('\n📝 OTHER RESPONSES:');
        otherKeys.forEach(key => {
          console.log(`  ${key}: ${allTags[key].join(', ')}`);
        });
      }

      // Profile-level processed data
      console.log('\n\n🔄 PROCESSED PROFILE DATA:');
      console.log('---------------------------');

      if (profile.medical_conditions && profile.medical_conditions.length > 0) {
        console.log('🏥 Medical Conditions:', profile.medical_conditions.join(', '));
      }

      if (profile.dietary_preferences && profile.dietary_preferences.length > 0) {
        console.log('🍽️ Dietary Preferences:', profile.dietary_preferences.join(', '));
      }

      if (profile.goals && profile.goals.length > 0) {
        console.log('🎯 Processed Goals:', profile.goals.join(', '));
      }

      // Identity data
      if (adjectives && role) {
        console.log('\n🎭 IDENTITY DATA:');
        console.log(`  Adjectives: ${adjectives.join(', ')}`);
        console.log(`  Role: ${role}`);
        console.log(`  Full phrase: "${profile.identityPhrase}"`);
      }

      // Statistics
      console.log('\n\n📊 STATISTICS:');
      console.log('--------------');
      console.log(`Total questions answered: ${allResponses.length}`);
      console.log(`Total tags collected: ${allResponses.reduce((acc, r) => acc + r.values.length, 0)}`);

      // Count tags by category
      const tagCounts: { [key: string]: number } = {};
      tagCounts['Specifics'] = specificsKeys.reduce((acc, k) => acc + allTags[k].length, 0);
      tagCounts['Why/Motivation'] = whyKeys.reduce((acc, k) => acc + allTags[k].length, 0);
      tagCounts['What Worked'] = whatWorkedKeys.reduce((acc, k) => acc + allTags[k].length, 0);
      tagCounts['Barriers'] = barrierKeys.reduce((acc, k) => acc + allTags[k].length, 0);
      tagCounts['Avoid'] = avoidKeys.reduce((acc, k) => acc + allTags[k].length, 0);
      tagCounts['Other'] = otherKeys.reduce((acc, k) => acc + allTags[k].length, 0);

      console.log('\nTags by category:');
      Object.entries(tagCounts).forEach(([category, count]) => {
        if (count > 0) {
          console.log(`  ${category}: ${count} tags`);
        }
      });

      // Complete JSON dump for analysis
      console.log('\n\n📄 COMPLETE JSON DATA:');
      console.log('----------------------');
      console.log(JSON.stringify({
        responses: allResponses,
        profile: {
          medical_conditions: profile.medical_conditions,
          dietary_preferences: profile.dietary_preferences,
          goals: profile.goals,
          identity: profile.identityPhrase
        },
        statistics: {
          total_questions: allResponses.length,
          total_tags: allResponses.reduce((acc, r) => acc + r.values.length, 0),
          tags_by_category: tagCounts
        }
      }, null, 2));

      console.log('\n========================================\n');
      console.log('Quiz completed successfully, calling onComplete callback');

      // Call completion callback
      onComplete(profile);
    } catch (error) {
      console.error('Error saving quiz data:', error);
      Alert.alert('Error', 'Failed to save your preferences. Please try again.');
    }
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

  const renderTextInput = () => {
    return (
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          value={textInputValue}
          onChangeText={setTextInputValue}
          placeholder={currentQuestion.placeholder || 'Type your answer here...'}
          placeholderTextColor="#999"
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    );
  };

  // Show identity step if we've finished all questions
  if (showIdentityStep) {
    // Extract goals from primary motivation and specific goals
    const primaryMotivation = responses.find(r => r.questionId === 'primary_motivation');
    const specificGoals = responses.filter(r => r.questionId.includes('_specifics'));

    // Combine all goals
    const quizGoals: string[] = [];

    // Add primary motivation as a goal
    if (primaryMotivation?.values) {
      quizGoals.push(...primaryMotivation.values);
    }

    // Add all specific goals
    specificGoals.forEach(goal => {
      if (goal.values) {
        quizGoals.push(...goal.values);
      }
    });

    // Use the comprehensive goal mapping system
    const mappedGoals = getTipGoalsForQuizGoals(quizGoals);

    // Log the mapping for debugging
    console.log('Primary motivation:', primaryMotivation?.values);
    console.log('Specific goals:', specificGoals.map(g => g.values).flat());
    console.log('Combined quiz goals:', quizGoals);
    console.log('Mapped to tip goals:', mappedGoals);

    console.log('Goals for identity step:', mappedGoals);
    
    return (
      <IdentityQuizStep
        userGoals={mappedGoals}
        onComplete={handleIdentityComplete}
        onBack={() => setShowIdentityStep(false)}
      />
    );
  }

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
        <ScrollView 
          ref={scrollViewRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}>
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
                : currentQuestion.type === 'text'
                ? renderTextInput()
                : getCurrentQuestionOptions().map(renderOption)}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={[
          styles.navigationContainer,
          currentQuestionIndex > 0 && styles.navigationContainerWithBack
        ]}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#666" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.nextButton,
              (selectedValues.length === 0 && currentQuestion.required) && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === availableQuestions.length - 1 
                ? (isRetake ? "Update Preferences" : "Let's do this!") 
                : (selectedValues.length === 0 && !currentQuestion.required) 
                  ? 'Skip' 
                  : 'Next'}
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
    paddingBottom: 20, // Add padding to ensure buttons aren't cut off
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
    justifyContent: 'flex-end', // Align to the right when only Next button
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 40, // Extra padding to lift buttons higher from bottom
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFF', // Ensure background so buttons are visible
  },
  navigationContainerWithBack: {
    justifyContent: 'space-between', // Space between when both buttons shown
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  backButtonSpacer: {
    width: 80, // Approximate width of back button to keep Next button aligned
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
  textInputContainer: {
    marginTop: 20,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: '#F8F9FA',
    color: '#333',
    textAlignVertical: 'top',
  },
});