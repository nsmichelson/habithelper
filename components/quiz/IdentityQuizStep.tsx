import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface Props {
  userGoals: string[];
  onComplete: (adjectives: string[], role: string) => void;
  onBack: () => void;
}

type StepType = 'feeling' | 'trait' | 'role';

// FEELINGS - How you want to feel (mapped to goals)
const goalFeelings: Record<string, string[]> = {
  weight_loss: ['light', 'confident', 'comfortable', 'proud', 'free', 'attractive', 'empowered', 'joyful'],
  muscle_gain: ['powerful', 'capable', 'strong', 'unstoppable', 'confident', 'mighty', 'impressive', 'solid'],
  reduce_sugar: ['balanced', 'stable', 'clear-headed', 'in-control', 'liberated', 'steady', 'calm', 'satisfied'],
  improve_hydration: ['refreshed', 'energized', 'vital', 'glowing', 'replenished', 'alive', 'radiant', 'renewed'],
  better_lipids: ['healthy', 'protected', 'vital', 'secure', 'optimized', 'thriving', 'resilient', 'strong'],
  less_processed_food: ['clean', 'pure', 'nourished', 'authentic', 'wholesome', 'natural', 'satisfied', 'grounded'],
  increase_veggies: ['vibrant', 'nourished', 'colorful', 'fresh', 'alive', 'glowing', 'energetic', 'light'],
  plant_based: ['compassionate', 'aligned', 'peaceful', 'light', 'ethical', 'connected', 'pure', 'conscious'],
  endurance_performance: ['unstoppable', 'energized', 'tireless', 'flowing', 'powerful', 'infinite', 'dynamic', 'electric'],
  strength_performance: ['explosive', 'dominant', 'fierce', 'unbreakable', 'mighty', 'forceful', 'commanding', 'bold'],
  healthy_pregnancy: ['nurturing', 'glowing', 'peaceful', 'connected', 'protective', 'radiant', 'serene', 'blessed'],
  improve_energy: ['energized', 'vibrant', 'alive', 'electric', 'buzzing', 'charged', 'animated', 'dynamic'],
  lower_blood_pressure: ['calm', 'relaxed', 'peaceful', 'centered', 'serene', 'tranquil', 'grounded', 'zen'],
  improve_gut_health: ['comfortable', 'balanced', 'harmonious', 'settled', 'happy', 'peaceful', 'light', 'easy'],
};

// TRAITS - What kind of person you want to be (mapped to goals)
const goalTraits: Record<string, string[]> = {
  weight_loss: ['disciplined', 'determined', 'focused', 'consistent', 'mindful', 'intentional', 'committed', 'dedicated'],
  muscle_gain: ['dedicated', 'persistent', 'hardworking', 'relentless', 'disciplined', 'focused', 'driven', 'committed'],
  reduce_sugar: ['mindful', 'conscious', 'aware', 'intentional', 'disciplined', 'wise', 'thoughtful', 'controlled'],
  improve_hydration: ['conscious', 'mindful', 'consistent', 'aware', 'intentional', 'caring', 'attentive', 'thoughtful'],
  better_lipids: ['proactive', 'responsible', 'informed', 'smart', 'preventive', 'wise', 'careful', 'thoughtful'],
  less_processed_food: ['conscious', 'selective', 'informed', 'intentional', 'mindful', 'discerning', 'aware', 'smart'],
  increase_veggies: ['adventurous', 'open-minded', 'creative', 'experimental', 'flexible', 'curious', 'explorative', 'willing'],
  plant_based: ['compassionate', 'conscious', 'ethical', 'mindful', 'principled', 'thoughtful', 'caring', 'aware'],
  endurance_performance: ['persistent', 'dedicated', 'relentless', 'determined', 'disciplined', 'focused', 'committed', 'driven'],
  strength_performance: ['disciplined', 'dedicated', 'consistent', 'focused', 'determined', 'committed', 'persistent', 'driven'],
  healthy_pregnancy: ['nurturing', 'careful', 'mindful', 'protective', 'wise', 'informed', 'conscious', 'prepared'],
  improve_energy: ['active', 'dynamic', 'motivated', 'driven', 'enthusiastic', 'passionate', 'spirited', 'engaged'],
  lower_blood_pressure: ['mindful', 'balanced', 'wise', 'measured', 'thoughtful', 'conscious', 'aware', 'careful'],
  improve_gut_health: ['mindful', 'attentive', 'conscious', 'aware', 'careful', 'thoughtful', 'selective', 'wise'],
};

const roleOptions = [
  { value: 'mom', label: 'Mom', icon: 'heart' },
  { value: 'dad', label: 'Dad', icon: 'heart' },
  { value: 'parent', label: 'Parent', icon: 'heart' },
  { value: 'student', label: 'Student', icon: 'school' },
  { value: 'professional', label: 'Professional', icon: 'briefcase' },
  { value: 'entrepreneur', label: 'Entrepreneur', icon: 'rocket' },
  { value: 'athlete', label: 'Athlete', icon: 'fitness' },
  { value: 'creator', label: 'Creator', icon: 'brush' },
  { value: 'leader', label: 'Leader', icon: 'trending-up' },
  { value: 'explorer', label: 'Explorer', icon: 'compass' },
  { value: 'human', label: 'Human', icon: 'person' },
  { value: 'warrior', label: 'Warrior', icon: 'shield' },
];

export default function IdentityQuizStep({ userGoals, onComplete, onBack }: Props) {
  const [selectedFeeling, setSelectedFeeling] = useState<string>('');
  const [selectedTrait, setSelectedTrait] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<StepType>('feeling');

  // Default options if no goals match
  const defaultFeelings = ['energized', 'balanced', 'confident', 'peaceful', 'vibrant', 'strong', 'comfortable', 'alive'];
  const defaultTraits = ['mindful', 'disciplined', 'dedicated', 'conscious', 'intentional', 'focused', 'committed', 'wise'];

  // Get unique feelings from user's goals
  let availableFeelings = Array.from(new Set(
    userGoals.flatMap(goal => goalFeelings[goal] || [])
  )).sort();
  
  if (availableFeelings.length === 0) {
    availableFeelings = defaultFeelings;
  }

  // Get unique traits from user's goals
  let availableTraits = Array.from(new Set(
    userGoals.flatMap(goal => goalTraits[goal] || [])
  )).sort();
  
  if (availableTraits.length === 0) {
    availableTraits = defaultTraits;
  }

  const handleFeelingSelect = (feeling: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFeeling(feeling);
  };

  const handleTraitSelect = (trait: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTrait(trait);
  };

  const handleRoleSelect = (role: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (currentStep === 'feeling' && selectedFeeling) {
      setCurrentStep('trait');
    } else if (currentStep === 'trait' && selectedTrait) {
      setCurrentStep('role');
    } else if (currentStep === 'role' && selectedRole) {
      onComplete([selectedFeeling, selectedTrait], selectedRole);
    }
  };

  const handleBack = () => {
    if (currentStep === 'trait') {
      setCurrentStep('feeling');
    } else if (currentStep === 'role') {
      setCurrentStep('trait');
    } else {
      onBack();
    }
  };

  const getProgress = () => {
    switch (currentStep) {
      case 'feeling': return '33%';
      case 'trait': return '66%';
      case 'role': return '100%';
    }
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case 'feeling': return 1;
      case 'trait': return 2;
      case 'role': return 3;
    }
  };

  const canContinue = 
    (currentStep === 'feeling' && selectedFeeling) ||
    (currentStep === 'trait' && selectedTrait) ||
    (currentStep === 'role' && selectedRole);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: getProgress() }]} />
            </View>
            <Text style={styles.stepIndicator}>
              Step {getStepNumber()} of 3
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content} contentContainerStyle={styles.scrollContent}>
        {currentStep === 'feeling' ? (
          <>
            <Text style={styles.title}>How do you want to feel?</Text>
            <Text style={styles.subtitle}>
              Choose the feeling that resonates most with your goals
            </Text>
            
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Your identity will start with:</Text>
              <Text style={styles.previewText}>
                <Text style={styles.previewHighlight}>
                  {selectedFeeling || '...'}
                </Text>
                {' ... ...'}
              </Text>
            </View>

            <View style={styles.optionsGrid}>
              {availableFeelings.map(feeling => (
                <TouchableOpacity
                  key={feeling}
                  onPress={() => handleFeelingSelect(feeling)}
                  style={[
                    styles.optionButton,
                    selectedFeeling === feeling && styles.optionButtonSelected
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.optionText,
                    selectedFeeling === feeling && styles.optionTextSelected
                  ]}>
                    {feeling}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : currentStep === 'trait' ? (
          <>
            <Text style={styles.title}>What kind of person do you want to be?</Text>
            <Text style={styles.subtitle}>
              Choose the trait that best describes your aspirational self
            </Text>
            
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Your identity so far:</Text>
              <Text style={styles.previewText}>
                <Text style={styles.previewHighlight}>
                  {selectedFeeling}
                </Text>
                {' '}
                <Text style={styles.previewHighlight}>
                  {selectedTrait || '...'}
                </Text>
                {' ...'}
              </Text>
            </View>

            <View style={styles.optionsGrid}>
              {availableTraits.map(trait => (
                <TouchableOpacity
                  key={trait}
                  onPress={() => handleTraitSelect(trait)}
                  style={[
                    styles.optionButton,
                    selectedTrait === trait && styles.optionButtonSelected
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.optionText,
                    selectedTrait === trait && styles.optionTextSelected
                  ]}>
                    {trait}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>What's your role?</Text>
            <Text style={styles.subtitle}>
              Complete your identity with who you are
            </Text>
            
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>You'll be:</Text>
              <Text style={styles.previewText}>
                <Text style={styles.previewFeelingTrait}>
                  {selectedFeeling} {selectedTrait}
                </Text>
                {' '}
                <Text style={styles.previewRole}>
                  {selectedRole || '...'}
                </Text>
              </Text>
            </View>

            <View style={styles.roleGrid}>
              {roleOptions.map(role => (
                <TouchableOpacity
                  key={role.value}
                  onPress={() => handleRoleSelect(role.value)}
                  style={[
                    styles.roleButton,
                    selectedRole === role.value && styles.roleButtonSelected
                  ]}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={role.icon as any} 
                    size={24} 
                    color={selectedRole === role.value ? '#FFF' : '#4CAF50'} 
                  />
                  <Text style={[
                    styles.roleText,
                    selectedRole === role.value && styles.roleTextSelected
                  ]}>
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {!canContinue && (
          <Text style={styles.footerHint}>
            {currentStep === 'feeling' && 'Select a feeling to continue'}
            {currentStep === 'trait' && 'Select a trait to continue'}
            {currentStep === 'role' && 'Select your role to complete'}
          </Text>
        )}
        <TouchableOpacity
          onPress={handleContinue}
          style={[
            styles.continueButton,
            !canContinue && styles.continueButtonDisabled
          ]}
          disabled={!canContinue}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.continueButtonText,
            !canContinue && styles.continueButtonTextDisabled
          ]}>
            {currentStep === 'role' ? 'Complete Identity' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 4,
  },
  progressContainer: {
    flex: 1,
    marginLeft: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  stepIndicator: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  previewContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  previewText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  previewHighlight: {
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  previewFeelingTrait: {
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  previewRole: {
    color: '#2E7D32',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  optionTextSelected: {
    color: '#4CAF50',
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  roleButton: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  roleTextSelected: {
    color: '#FFF',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  continueButtonTextDisabled: {
    color: '#999',
  },
  footerHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
});