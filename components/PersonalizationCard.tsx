import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Tip } from '@/types/tip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  tip: Tip;
  savedData?: any;
  onSave?: (data: any) => void;
  onDataChange?: (data: any) => void;
  showHeader?: boolean;
  style?: any;
}

export default function PersonalizationCard({ 
  tip, 
  savedData, 
  onSave, 
  onDataChange,
  showHeader = true,
  style 
}: Props) {
  // Initialize state based on saved data
  const [scaleNames, setScaleNames] = useState({
    level1: '',
    level5: '',
    level10: ''
  });
  const [savedScaleNames, setSavedScaleNames] = useState<typeof scaleNames | null>(
    savedData?.type === 'scale' ? savedData.data : null
  );
  
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [savedChoice, setSavedChoice] = useState<string | null>(
    savedData?.type === 'choice' && !savedData.multiple ? savedData.data : null
  );
  
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [savedChoices, setSavedChoices] = useState<string[] | null>(
    savedData?.type === 'choice' && savedData.multiple ? savedData.data : null
  );
  
  const [textInput, setTextInput] = useState<string>('');
  const [savedTextInput, setSavedTextInput] = useState<string | null>(
    savedData?.type === 'text' ? savedData.data : null
  );
  
  const [multiTextInputs, setMultiTextInputs] = useState<Record<number, string>>({});
  const [savedMultiTextInputs, setSavedMultiTextInputs] = useState<Record<number, string> | null>(
    savedData?.type === 'multi_text' ? savedData.data : null
  );
  
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);

  // Animation for save button
  const saveButtonScale = useSharedValue(1);
  const saveButtonOpacity = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveButtonScale.value }],
    opacity: saveButtonOpacity.value,
  }));

  const handleSaveScale = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    saveButtonScale.value = withSequence(
      withSpring(0.9),
      withSpring(1.1),
      withSpring(1)
    );
    
    setShowSaveAnimation(true);
    setSavedScaleNames({ ...scaleNames });
    onSave?.({ type: 'scale', data: { ...scaleNames } });
    
    setTimeout(() => {
      setShowSaveAnimation(false);
    }, 2000);
  };

  // Handle text type personalization
  if (tip.personalization_type === 'text') {
    const placeholder = tip.personalization_config?.placeholders?.[0] || "Enter your answer";
    
    return (
      <View style={[styles.container, style]}>
        {showHeader && <Text style={styles.sectionTitle}>Make It Your Own</Text>}
        
        {savedTextInput ? (
          <View style={styles.savedContainer}>
            <View style={styles.savedHeader}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={styles.savedTitle}>Your Plan</Text>
            </View>
            
            <View style={styles.savedBox}>
              <Text style={styles.savedPrompt}>{tip.personalization_prompt}</Text>
              <Text style={styles.savedText}>{savedTextInput}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setSavedTextInput(null);
                setTextInput(savedTextInput || '');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={16} color="#4CAF50" />
              <Text style={styles.editButtonText}>Change My Answer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inputWrapper}>
            <Text style={styles.prompt}>
              {tip.personalization_prompt}
            </Text>
            
            <TextInput
              style={styles.textInput}
              placeholder={placeholder}
              value={textInput}
              onChangeText={(text) => {
                setTextInput(text);
                if (text.trim()) {
                  console.log('PersonalizationCard - text input changed, calling onDataChange with:', text.trim());
                  onDataChange?.({ type: 'text', data: text.trim() });
                }
              }}
              placeholderTextColor="#999"
              multiline={false}
              returnKeyType="done"
              onSubmitEditing={() => {
                if (textInput.trim()) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setSavedTextInput(textInput.trim());
                  onSave?.({ type: 'text', data: textInput.trim() });
                  setShowSaveAnimation(true);
                  setTimeout(() => setShowSaveAnimation(false), 2000);
                }
              }}
            />
            
            <TouchableOpacity
              style={[
                styles.saveButtonWrapper,
                !textInput.trim() && styles.saveButtonDisabled
              ]}
              onPress={() => {
                if (textInput.trim()) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setSavedTextInput(textInput.trim());
                  onSave?.({ type: 'text', data: textInput.trim() });
                  setShowSaveAnimation(true);
                  setTimeout(() => setShowSaveAnimation(false), 2000);
                }
              }}
              disabled={!textInput.trim()}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={textInput.trim() ? ['#4CAF50', '#45A049'] : ['#CCCCCC', '#BBBBBB']}
                style={styles.saveButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.saveButtonText}>Save</Text>
                <Ionicons name="checkmark" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
        
        {showSaveAnimation && (
          <View style={styles.celebrationOverlay}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
            <Text style={styles.celebrationText}>Saved!</Text>
          </View>
        )}
      </View>
    );
  }

  // Handle choice type personalization
  if (tip.personalization_type === 'choice') {
    const choices = tip.personalization_config?.choices || [];
    const isMultiple = tip.personalization_config?.multiple === true;
    
    // Define colors for each choice type
    const getChoiceColor = (choice: string) => {
      const lowerChoice = choice.toLowerCase();
      // Meal times
      if (lowerChoice.includes('breakfast')) return '#FFE0B2';
      if (lowerChoice.includes('lunch')) return '#C8E6C9';
      if (lowerChoice.includes('dinner')) return '#E1BEE7';
      if (lowerChoice.includes('snack')) return '#FBBF24';
      if (lowerChoice.includes('afternoon')) return '#FFE5CC';
      if (lowerChoice.includes('evening')) return '#D1C4E9';
      // Craving types
      if (lowerChoice === 'salty' || lowerChoice.includes('salty')) return '#B3E5FC';
      if (lowerChoice === 'sweet' || lowerChoice.includes('sweet')) return '#FCE4EC';
      if (lowerChoice === 'savory' || lowerChoice.includes('savory')) return '#FFCCBC';
      if (lowerChoice === 'crunchy' || lowerChoice.includes('crunchy')) return '#FFF9C4';
      if (lowerChoice === 'chewy' || lowerChoice.includes('chewy')) return '#F3E5F5';
      if (lowerChoice === 'creamy' || lowerChoice.includes('creamy')) return '#E0F2F1';
      // Default
      return '#E3F2FD';
    };

    const getChoiceDescription = (choice: string) => {
      const lowerChoice = choice.toLowerCase();
      // Meal times
      if (lowerChoice.includes('breakfast')) return 'Start your day with protein';
      if (lowerChoice.includes('lunch')) return 'Midday protein boost';
      if (lowerChoice.includes('dinner')) return 'Evening protein portion';
      if (lowerChoice.includes('afternoon') && lowerChoice.includes('snack')) return 'Afternoon protein snack';
      if (lowerChoice.includes('evening') && lowerChoice.includes('snack')) return 'Evening protein treat';
      // Craving types
      if (lowerChoice === 'salty') return 'Like chips or pretzels';
      if (lowerChoice === 'sweet') return 'Like candy or desserts';
      if (lowerChoice === 'savory') return 'Like cheese or meat';
      if (lowerChoice === 'crunchy') return 'Like crackers or nuts';
      if (lowerChoice === 'chewy') return 'Like gummies or bread';
      if (lowerChoice === 'creamy') return 'Like ice cream or yogurt';
      return '';
    };
    
    return (
      <View style={[styles.container, style]}>
        {showHeader && <Text style={styles.sectionTitle}>Make It Your Own</Text>}
        
        {(savedChoice || savedChoices) ? (
          <View style={styles.savedContainer}>
            <View style={styles.savedHeader}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={styles.savedTitle}>Your Plan</Text>
            </View>
            
            <View style={styles.savedBox}>
              <Text style={styles.savedPrompt}>{tip.personalization_prompt}</Text>
              <Text style={styles.savedText}>
                {isMultiple && savedChoices 
                  ? savedChoices.join(', ')
                  : savedChoice}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                if (isMultiple) {
                  setSavedChoices(null);
                  setSelectedChoices([]);
                } else {
                  setSavedChoice(null);
                  setSelectedChoice(null);
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={16} color="#4CAF50" />
              <Text style={styles.editButtonText}>Change My Selection</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.prompt}>
              {tip.personalization_prompt}
            </Text>
            
            <View style={styles.choiceContainer}>
              {choices.map((choice, index) => {
                const isSelected = isMultiple 
                  ? selectedChoices.includes(choice)
                  : selectedChoice === choice;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.choiceItem,
                      isSelected && styles.choiceItemSelected
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      
                      if (isMultiple) {
                        let newChoices: string[];
                        if (selectedChoices.includes(choice)) {
                          newChoices = selectedChoices.filter(c => c !== choice);
                        } else {
                          newChoices = [...selectedChoices, choice];
                        }
                        setSelectedChoices(newChoices);
                        if (newChoices.length > 0) {
                          onDataChange?.({ type: 'choice', data: newChoices, multiple: true });
                        }
                      } else {
                        setSelectedChoice(choice);
                        console.log('PersonalizationCard - single choice selected, calling onDataChange with:', choice);
                        onDataChange?.({ type: 'choice', data: choice, multiple: false });
                        setTimeout(() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          setSavedChoice(choice);
                          console.log('PersonalizationCard - single choice auto-saving, calling onSave with:', choice);
                          onSave?.({ type: 'choice', data: choice, multiple: false });
                          setShowSaveAnimation(true);
                          setTimeout(() => setShowSaveAnimation(false), 2000);
                        }, 500);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.choiceContent}>
                      <View style={styles.choiceItemHeader}>
                        <View style={[
                          styles.choiceCircle, 
                          { backgroundColor: getChoiceColor(choice) },
                          isSelected && styles.choiceCircleSelected
                        ]}>
                          {isSelected && (
                            <Ionicons name="checkmark" size={18} color="#424242" />
                          )}
                        </View>
                        <Text style={[
                          styles.choiceText,
                          isSelected && styles.choiceTextSelected
                        ]}>
                          {choice}
                        </Text>
                      </View>
                      {getChoiceDescription(choice) && (
                        <Text style={styles.choiceDescription}>
                          {getChoiceDescription(choice)}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {isMultiple && selectedChoices.length > 0 && (
              <TouchableOpacity
                style={styles.saveButtonWrapper}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setSavedChoices(selectedChoices);
                  onSave?.({ type: 'choice', data: selectedChoices, multiple: true });
                  setShowSaveAnimation(true);
                  setTimeout(() => setShowSaveAnimation(false), 2000);
                }}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45A049']}
                  style={styles.saveButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.saveButtonText}>
                    Save {selectedChoices.length} Selection{selectedChoices.length > 1 ? 's' : ''}
                  </Text>
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </>
        )}
        
        {showSaveAnimation && (
          <View style={styles.celebrationOverlay}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
            <Text style={styles.celebrationText}>Locked in!</Text>
          </View>
        )}
      </View>
    );
  }

  // Handle multi_text type personalization
  if (tip.personalization_type === 'multi_text') {
    const items = tip.personalization_config?.items || [];
    
    return (
      <View style={[styles.container, style]}>
        {showHeader && <Text style={styles.sectionTitle}>Make It Your Own</Text>}
        
        {savedMultiTextInputs ? (
          <View style={styles.savedContainer}>
            <View style={styles.savedHeader}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={styles.savedTitle}>Your Plan</Text>
            </View>
            
            <View style={styles.savedMultiBox}>
              {items.map((item, index) => (
                <View key={index} style={styles.savedMultiItem}>
                  <Text style={styles.savedMultiLabel}>{item.label}</Text>
                  <Text style={styles.savedMultiValue}>{savedMultiTextInputs[index]}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setSavedMultiTextInputs(null);
                setMultiTextInputs(savedMultiTextInputs || {});
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={16} color="#4CAF50" />
              <Text style={styles.editButtonText}>Change My Plan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.multiTextWrapper}>
            <Text style={styles.prompt}>
              {tip.personalization_prompt}
            </Text>
            
            {items.map((item, index) => (
              <View key={index} style={styles.multiTextSection}>
                <Text style={styles.multiTextLabel}>{item.label}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={item.placeholder}
                  value={multiTextInputs[index] || ''}
                  onChangeText={(text) => {
                    const newInputs = { ...multiTextInputs, [index]: text };
                    setMultiTextInputs(newInputs);
                    // Only call onDataChange if all required fields have some text
                    const hasAllInputs = items.every((_, idx) => newInputs[idx]?.trim());
                    if (hasAllInputs) {
                      onDataChange?.({ type: 'multi_text', data: newInputs });
                    }
                  }}
                  placeholderTextColor="#999"
                  multiline={false}
                  returnKeyType="next"
                />
              </View>
            ))}
            
            <TouchableOpacity
              style={[
                styles.saveButtonWrapper,
                !items.every((_, index) => multiTextInputs[index]?.trim()) && styles.saveButtonDisabled
              ]}
              onPress={() => {
                if (items.every((_, index) => multiTextInputs[index]?.trim())) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setSavedMultiTextInputs(multiTextInputs);
                  onSave?.({ type: 'multi_text', data: multiTextInputs });
                  setShowSaveAnimation(true);
                  setTimeout(() => setShowSaveAnimation(false), 2000);
                }
              }}
              disabled={!items.every((_, index) => multiTextInputs[index]?.trim())}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={items.every((_, index) => multiTextInputs[index]?.trim()) ? ['#4CAF50', '#45A049'] : ['#CCCCCC', '#BBBBBB']}
                style={styles.saveButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.saveButtonText}>Save Plan</Text>
                <Ionicons name="checkmark" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
        
        {showSaveAnimation && (
          <View style={styles.celebrationOverlay}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
            <Text style={styles.celebrationText}>Saved!</Text>
          </View>
        )}
      </View>
    );
  }

  // Handle scale type (hunger scale)
  if (tip.personalization_type === 'scale') {
    return (
      <View style={[styles.container, style]}>
        {showHeader && <Text style={styles.sectionTitle}>Your Hunger Scale</Text>}
        
        {savedScaleNames ? (
          <View style={styles.savedContainer}>
            <View style={styles.savedHeader}>
              <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
              <Text style={styles.savedTitle}>Your Personalized Scale</Text>
            </View>
            
            <View style={styles.savedScaleBox}>
              {savedScaleNames.level1 && (
                <View style={styles.savedScaleItem}>
                  <View style={[styles.scaleNumber, styles.scaleNumberLow]}>
                    <Text style={styles.scaleNumberText}>1</Text>
                  </View>
                  <View style={styles.scaleTextWrapper}>
                    <Text style={styles.savedScaleName}>{savedScaleNames.level1}</Text>
                    <Text style={styles.savedScaleDesc}>Extremely hungry</Text>
                  </View>
                </View>
              )}
              
              {savedScaleNames.level5 && (
                <View style={styles.savedScaleItem}>
                  <View style={[styles.scaleNumber, styles.scaleNumberMid]}>
                    <Text style={styles.scaleNumberText}>5</Text>
                  </View>
                  <View style={styles.scaleTextWrapper}>
                    <Text style={styles.savedScaleName}>{savedScaleNames.level5}</Text>
                    <Text style={styles.savedScaleDesc}>Satisfied</Text>
                  </View>
                </View>
              )}
              
              {savedScaleNames.level10 && (
                <View style={styles.savedScaleItem}>
                  <View style={[styles.scaleNumber, styles.scaleNumberFull]}>
                    <Text style={styles.scaleNumberText}>10</Text>
                  </View>
                  <View style={styles.scaleTextWrapper}>
                    <Text style={styles.savedScaleName}>{savedScaleNames.level10}</Text>
                    <Text style={styles.savedScaleDesc}>Overly full</Text>
                  </View>
                </View>
              )}
            </View>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setSavedScaleNames(null);
                setScaleNames(savedScaleNames || { level1: '', level5: '', level10: '' });
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={16} color="#4CAF50" />
              <Text style={styles.editButtonText}>Edit My Scale</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.scaleInputWrapper}>
            <Text style={styles.prompt}>
              {tip.personalization_prompt || "Give your hunger levels fun, memorable names! What would you call each level?"}
            </Text>
            
            <View style={styles.scaleInputSection}>
              <View style={styles.scaleInputItem}>
                <View style={[styles.scaleNumber, styles.scaleNumberLow]}>
                  <Text style={styles.scaleNumberText}>1</Text>
                </View>
                <View style={styles.scaleInputTextWrapper}>
                  <Text style={styles.scaleInputLabel}>Extremely hungry</Text>
                  <TextInput
                    style={styles.scaleInput}
                    placeholder="e.g., Hangry Monster"
                    value={scaleNames.level1}
                    onChangeText={(text) => {
                      const newNames = { ...scaleNames, level1: text };
                      setScaleNames(newNames);
                      if (newNames.level1.trim() && newNames.level5.trim() && newNames.level10.trim()) {
                        onDataChange?.({ type: 'scale', data: newNames });
                      }
                    }}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              
              <View style={styles.scaleInputItem}>
                <View style={[styles.scaleNumber, styles.scaleNumberMid]}>
                  <Text style={styles.scaleNumberText}>5</Text>
                </View>
                <View style={styles.scaleInputTextWrapper}>
                  <Text style={styles.scaleInputLabel}>Satisfied</Text>
                  <TextInput
                    style={styles.scaleInput}
                    placeholder="e.g., Happy Tummy"
                    value={scaleNames.level5}
                    onChangeText={(text) => {
                      const newNames = { ...scaleNames, level5: text };
                      setScaleNames(newNames);
                      if (newNames.level1.trim() && newNames.level5.trim() && newNames.level10.trim()) {
                        onDataChange?.({ type: 'scale', data: newNames });
                      }
                    }}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
              
              <View style={styles.scaleInputItem}>
                <View style={[styles.scaleNumber, styles.scaleNumberFull]}>
                  <Text style={styles.scaleNumberText}>10</Text>
                </View>
                <View style={styles.scaleInputTextWrapper}>
                  <Text style={styles.scaleInputLabel}>Overly full</Text>
                  <TextInput
                    style={styles.scaleInput}
                    placeholder="e.g., Food Coma"
                    value={scaleNames.level10}
                    onChangeText={(text) => {
                      const newNames = { ...scaleNames, level10: text };
                      setScaleNames(newNames);
                      if (newNames.level1.trim() && newNames.level5.trim() && newNames.level10.trim()) {
                        onDataChange?.({ type: 'scale', data: newNames });
                      }
                    }}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </View>
            
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity
                style={[
                  styles.saveButtonWrapper,
                  (!scaleNames.level1.trim() || !scaleNames.level5.trim() || !scaleNames.level10.trim()) && styles.saveButtonDisabled
                ]}
                onPress={handleSaveScale}
                disabled={!scaleNames.level1.trim() || !scaleNames.level5.trim() || !scaleNames.level10.trim()}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={(scaleNames.level1.trim() && scaleNames.level5.trim() && scaleNames.level10.trim()) ? ['#4CAF50', '#45A049'] : ['#CCCCCC', '#BBBBBB']}
                  style={styles.saveButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.saveButtonText}>Save My Scale</Text>
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
        
        {showSaveAnimation && (
          <View style={styles.celebrationOverlay}>
            <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
            <Text style={styles.celebrationText}>Personalized!</Text>
          </View>
        )}
      </View>
    );
  }

  // Default - no personalization
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 20,
  },
  prompt: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
    marginBottom: 24,
  },
  savedContainer: {
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  savedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  savedBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  savedPrompt: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  savedText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  inputWrapper: {
    marginTop: 4,
    gap: 8,
  },
  textInput: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    minHeight: 52,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  saveButtonWrapper: {
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  saveButtonDisabled: {
    shadowColor: '#999',
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -60 }],
    width: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 2,
    borderColor: '#E8F5E9',
  },
  celebrationText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2E7D32',
    marginTop: 12,
  },
  choiceContainer: {
    gap: 12,
    marginTop: 20,
  },
  choiceItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  choiceItemSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 2.5,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  choiceContent: {
    flex: 1,
  },
  choiceItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 6,
  },
  choiceCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: 'rgba(0,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceCircleSelected: {
    borderColor: '#424242',
    borderWidth: 3,
  },
  choiceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#424242',
    flex: 1,
  },
  choiceTextSelected: {
    color: '#2E7D32',
    fontWeight: '800',
  },
  choiceDescription: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 50,
    fontStyle: 'italic',
  },
  multiTextWrapper: {
    marginTop: 4,
  },
  multiTextSection: {
    marginTop: 16,
  },
  multiTextLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  savedMultiBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  savedMultiItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  savedMultiLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  savedMultiValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  scaleInputWrapper: {
    marginTop: 4,
  },
  scaleInputSection: {
    gap: 20,
    marginTop: 20,
  },
  scaleInputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scaleNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scaleNumberLow: {
    backgroundColor: '#FFE5EA',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  scaleNumberMid: {
    backgroundColor: '#E3F2E6',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  scaleNumberFull: {
    backgroundColor: '#FFF8E1',
    borderWidth: 2,
    borderColor: '#FFB74D',
  },
  scaleNumberText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
  },
  scaleInputTextWrapper: {
    flex: 1,
  },
  scaleInputLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  scaleInput: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  savedScaleBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  savedScaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scaleTextWrapper: {
    flex: 1,
  },
  savedScaleName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  savedScaleDesc: {
    fontSize: 13,
    color: '#666',
  },
});