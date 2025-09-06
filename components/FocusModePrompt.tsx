import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { Tip } from '@/types/tip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FocusModePromptProps {
  visible: boolean;
  tip: Tip;
  onClose: () => void;
  onFocusMode: (days: number) => void;
  onNewTipTomorrow: () => void;
}

const FocusModePrompt: React.FC<FocusModePromptProps> = ({
  visible,
  tip,
  onClose,
  onFocusMode,
  onNewTipTomorrow,
}) => {
  console.log('=== FocusModePrompt Component MOUNTED ===');
  console.log('Visible prop:', visible);
  console.log('Tip prop:', tip?.summary);
  console.log('Component will render modal:', visible);
  
  const [step, setStep] = useState<'choice' | 'duration'>('choice');
  const [focusDays, setFocusDays] = useState('7');
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log('FocusModePrompt useEffect - visible changed to:', visible);
    if (visible) {
      console.log('Starting animations for FocusModePrompt');
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation for focus option
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  const handleFocusChoice = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep('duration');
  };

  const handleNewTipChoice = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNewTipTomorrow();
    resetAndClose();
  };

  const handleConfirmFocus = () => {
    const days = parseInt(focusDays, 10);
    if (days > 0 && days <= 30) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onFocusMode(days);
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep('choice');
      setFocusDays('7');
      setIsCustomizing(false);
      onClose();
    });
  };

  const quickDayOptions = [3, 7, 14, 21];

  console.log('FocusModePrompt rendering, modal visible:', visible);
  
  // Test with a simple alert first in dev mode
  useEffect(() => {
    if (visible && __DEV__) {
      console.log('SHOWING TEST ALERT FOR FOCUS MODE');
      Alert.alert(
        'Focus Mode Debug',
        `Modal should be visible now. Tip: ${tip?.summary}`,
        [{ text: 'OK', onPress: () => console.log('Alert dismissed') }]
      );
    }
  }, [visible, tip]);
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={resetAndClose}
      onShow={() => console.log('Modal onShow fired!')}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.View 
          style={[
            styles.backdrop,
            { opacity: fadeAnim }
          ]}
        >
          <BlurView intensity={80} style={StyleSheet.absoluteFillObject} tint="dark" />
        </Animated.View>

        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['#FFFFFF', '#FFF9F5']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={resetAndClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>

            {step === 'choice' ? (
              <>
                {/* Success celebration */}
                <View style={styles.celebrationContainer}>
                  <Text style={styles.celebrationEmoji}>🎉</Text>
                  <Text style={styles.celebrationText}>You loved this tip!</Text>
                </View>

                {/* Current tip reminder */}
                <View style={styles.tipReminderCard}>
                  <Text style={styles.tipReminderLabel}>Your successful experiment:</Text>
                  <Text style={styles.tipReminderText}>{tip.summary}</Text>
                </View>

                {/* Question */}
                <Text style={styles.questionText}>
                  Would you like to focus on mastering this tip, or explore a new one tomorrow?
                </Text>

                {/* Choice buttons */}
                <View style={styles.choiceContainer}>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <TouchableOpacity 
                      style={styles.focusButton}
                      onPress={handleFocusChoice}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#4CAF50', '#45A049']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Ionicons name="fitness" size={24} color="#FFF" />
                        <Text style={styles.focusButtonText}>Focus & Master This</Text>
                        <Text style={styles.focusButtonSubtext}>Build a strong habit</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  <TouchableOpacity 
                    style={styles.newTipButton}
                    onPress={handleNewTipChoice}
                    activeOpacity={0.8}
                  >
                    <View style={styles.newTipButtonContent}>
                      <Ionicons name="sparkles" size={24} color="#666" />
                      <Text style={styles.newTipButtonText}>New Tip Tomorrow</Text>
                      <Text style={styles.newTipButtonSubtext}>Keep exploring</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Duration selection */}
                <View style={styles.durationHeader}>
                  <Ionicons name="calendar" size={32} color="#4CAF50" />
                  <Text style={styles.durationTitle}>How long would you like to focus?</Text>
                </View>

                {/* Quick options */}
                <View style={styles.quickOptionsContainer}>
                  {quickDayOptions.map((days) => (
                    <TouchableOpacity
                      key={days}
                      style={[
                        styles.quickOption,
                        focusDays === days.toString() && !isCustomizing && styles.quickOptionSelected,
                      ]}
                      onPress={() => {
                        setFocusDays(days.toString());
                        setIsCustomizing(false);
                        Haptics.selectionAsync();
                      }}
                    >
                      <Text style={[
                        styles.quickOptionText,
                        focusDays === days.toString() && !isCustomizing && styles.quickOptionTextSelected,
                      ]}>
                        {days} days
                      </Text>
                      {days === 7 && (
                        <Text style={styles.recommendedBadge}>Recommended</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Custom input */}
                <View style={styles.customInputContainer}>
                  <Text style={styles.customInputLabel}>Or choose custom:</Text>
                  <View style={styles.customInputWrapper}>
                    <TextInput
                      style={[
                        styles.customInput,
                        isCustomizing && styles.customInputActive,
                      ]}
                      value={focusDays}
                      onChangeText={(text) => {
                        const num = text.replace(/[^0-9]/g, '');
                        if (num === '' || (parseInt(num, 10) <= 30)) {
                          setFocusDays(num);
                        }
                      }}
                      onFocus={() => setIsCustomizing(true)}
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="7"
                      placeholderTextColor="#CCC"
                    />
                    <Text style={styles.daysLabel}>days</Text>
                  </View>
                  <Text style={styles.customHint}>Choose 1-30 days</Text>
                </View>

                {/* Confirm button */}
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    (!focusDays || parseInt(focusDays, 10) < 1) && styles.confirmButtonDisabled,
                  ]}
                  onPress={handleConfirmFocus}
                  disabled={!focusDays || parseInt(focusDays, 10) < 1}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={
                      !focusDays || parseInt(focusDays, 10) < 1
                        ? ['#E0E0E0', '#D0D0D0']
                        : ['#4CAF50', '#45A049']
                    }
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.confirmButtonText}>
                      Start {focusDays || '0'} Day Focus
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Back button */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setStep('choice')}
                >
                  <Ionicons name="arrow-back" size={20} color="#666" />
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </>
            )}
          </LinearGradient>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    width: SCREEN_WIDTH - 40,
    maxWidth: 400,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  celebrationText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3142',
  },
  tipReminderCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  tipReminderLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipReminderText: {
    fontSize: 16,
    color: '#2D3142',
    fontWeight: '500',
  },
  questionText: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  choiceContainer: {
    gap: 12,
  },
  focusButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 16,
  },
  focusButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 8,
  },
  focusButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  newTipButton: {
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  newTipButtonContent: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  newTipButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 8,
  },
  newTipButtonSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  durationHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  durationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3142',
    marginTop: 12,
    textAlign: 'center',
  },
  quickOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  quickOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickOptionSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#F0FFF4',
  },
  quickOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  quickOptionTextSelected: {
    color: '#4CAF50',
  },
  recommendedBadge: {
    fontSize: 11,
    color: '#4CAF50',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  customInputContainer: {
    marginBottom: 24,
  },
  customInputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  customInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customInput: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3142',
    borderWidth: 2,
    borderColor: 'transparent',
    textAlign: 'center',
  },
  customInputActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#FFF',
  },
  daysLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  customHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    textAlign: 'center',
  },
  confirmButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default FocusModePrompt;