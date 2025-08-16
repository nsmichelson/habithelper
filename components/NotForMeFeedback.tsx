import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tip } from '../types/tip';
import { getRelevantRejectionReasons, getFollowUpQuestions as getFollowUps } from '../data/rejectionReasons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  visible: boolean;
  tip: Tip;
  onClose: () => void;
  onFeedback: (reason: string, skipFutureQuestion?: boolean) => void;
  existingFeedback?: string; // To show follow-ups for existing feedback
}

// Now using centralized data from rejectionReasons.ts

export default function NotForMeFeedback({ visible, tip, onClose, onFeedback, existingFeedback }: Props) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<string>('');
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  
  const insets = useSafeAreaInsets();
  
  // If we have existing feedback, show follow-up questions instead
  const primaryReason = existingFeedback?.split(':')[0] || '';
  const reasons = existingFeedback ? [] : getRelevantRejectionReasons(tip);
  const followUpQuestions = existingFeedback ? getFollowUps(primaryReason) : [];
  
  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);
  
  // Removed keyboard animation - modal stays fixed in place
  
  const handleSelectReason = (reason: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedReason(reason);
    
    if (reason === 'other') {
      // Show custom input for 'other' reason
      setShowCustomInput(true);
    } else {
      // Check if this reason has follow-up questions
      const followUps = getFollowUps(reason);
      if (followUps.length > 0 && !existingFeedback) {
        // Show follow-up questions
        setShowFollowUp(true);
      } else {
        // Auto-submit after a brief delay for smooth UX
        setTimeout(() => {
          onFeedback(reason, dontAskAgain);
          setSelectedReason('');
          setDontAskAgain(false);
        }, 300);
      }
    }
  };
  
  const handleSelectFollowUp = (followUp: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFollowUp(followUp);
    
    // Submit both primary and follow-up reason
    setTimeout(() => {
      const fullFeedback = existingFeedback 
        ? `${existingFeedback}:${followUp}`
        : `${selectedReason}:${followUp}`;
      onFeedback(fullFeedback, dontAskAgain);
      setSelectedReason('');
      setSelectedFollowUp('');
      setShowFollowUp(false);
      setDontAskAgain(false);
    }, 300);
  };
  
  const handleSkipFollowUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Submit just the primary reason
    const feedback = existingFeedback || selectedReason;
    onFeedback(feedback, dontAskAgain);
    setSelectedReason('');
    setSelectedFollowUp('');
    setShowFollowUp(false);
    setDontAskAgain(false);
  };
  
  const handleSubmitCustomReason = () => {
    if (customReason.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Keyboard.dismiss(); // Dismiss keyboard on submit
      onFeedback(`other: ${customReason.trim()}`, dontAskAgain);
      setSelectedReason('');
      setCustomReason('');
      setShowCustomInput(false);
      setDontAskAgain(false);
    }
  };
  
  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    setSelectedReason('');
    setCustomReason('');
    setShowCustomInput(false);
    setDontAskAgain(false);
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleSkip}
    >
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFillObject} 
          onPress={handleSkip}
          activeOpacity={1}
        />
        <Animated.View 
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F8FBF8']}
            style={styles.content}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.pullIndicator} />
              <Text style={styles.title}>
                {existingFeedback ? 'Tell me more' : 
                 showFollowUp ? 'Can you be more specific?' : 
                 'What didn\'t click?'}
              </Text>
              <Text style={styles.subtitle}>
                {existingFeedback ? 'Deeper insights help find better matches' :
                 showFollowUp ? 'This helps me understand your preferences better' :
                 'Your feedback helps me learn what works for you'}
              </Text>
            </View>
            
            {/* Reason Options, Follow-ups, or Custom Input */}
            {showFollowUp ? (
              <View style={{ flex: 1 }}>
                <ScrollView 
                  style={styles.reasonsContainer}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.reasonsContent,
                    { paddingBottom: (insets.bottom || 0) + 12 }
                  ]}
                >
                  <View style={styles.followUpSection}>
                    <Text style={styles.followUpPrompt}>
                      {existingFeedback ? 
                        `You mentioned this before. Any specific details?` :
                        `Got it! What specifically about that?`}
                    </Text>
                    <View style={styles.reasonsGrid}>
                      {(existingFeedback ? followUpQuestions : getFollowUps(selectedReason)).map((followUp) => (
                        <TouchableOpacity
                          key={followUp.value}
                          style={[
                            styles.reasonCard,
                            selectedFollowUp === followUp.value && styles.reasonCardSelected
                          ]}
                          onPress={() => handleSelectFollowUp(followUp.value)}
                          activeOpacity={0.7}
                        >
                          <View style={[
                            styles.emojiContainer,
                            selectedFollowUp === followUp.value && styles.emojiContainerSelected
                          ]}
                          >
                            <Text style={styles.emoji}>{followUp.emoji}</Text>
                          </View>
                          <Text style={[
                            styles.reasonText,
                            selectedFollowUp === followUp.value && styles.reasonTextSelected
                          ]}>
                            {followUp.label}
                          </Text>
                          {selectedFollowUp === followUp.value && (
                            <View style={styles.selectedIndicator}>
                              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>
                
                {/* Skip follow-up button */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleSkipFollowUp}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.skipText}>That's all for now</Text>
                    <Ionicons name="arrow-forward" size={16} color="#666" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : showCustomInput ? (
              <View style={{ flex: 1 }}>
                <ScrollView 
                  style={styles.customInputContainer}
                  contentContainerStyle={[
                    styles.customInputContent,
                    { flexGrow: 1, paddingBottom: (insets.bottom || 0) + 24 }
                  ]}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                <View style={styles.customInputHeader}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowCustomInput(false);
                      setSelectedReason('');
                      setCustomReason('');
                    }}
                    style={styles.backButton}
                  >
                    <Ionicons name="arrow-back" size={24} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.customInputTitle}>Tell me more</Text>
                  <View style={{ width: 24 }} />
                </View>
                
                <Text style={styles.customInputPrompt}>
                  What specifically didn't work about this experiment?
                </Text>
                
                <TextInput
                  style={styles.customInput}
                  placeholder="Type your reason here..."
                  placeholderTextColor="#999"
                  value={customReason}
                  onChangeText={setCustomReason}
                  multiline
                  autoFocus
                  maxLength={200}
                  scrollEnabled={false}
                  blurOnSubmit={false}
                  returnKeyType="done"
                />
                
                <Text style={styles.characterCount}>
                  {customReason.length}/200
                </Text>
                
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    !customReason.trim() && styles.submitButtonDisabled
                  ]}
                  onPress={handleSubmitCustomReason}
                  disabled={!customReason.trim()}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.submitButtonText,
                    !customReason.trim() && styles.submitButtonTextDisabled
                  ]}>
                    Submit Feedback
                  </Text>
                </TouchableOpacity>
                
                  {/* Extra padding for keyboard */}
                  <View style={{ height: 20 }} />
                </ScrollView>
              </View>
            ) : existingFeedback && followUpQuestions.length > 0 ? (
              // Show follow-up questions for existing feedback
              <View style={{ flex: 1 }}>
                <ScrollView 
                  style={styles.reasonsContainer}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.reasonsContent,
                    { paddingBottom: (insets.bottom || 0) + 12 }
                  ]}
                >
                  <View style={styles.followUpSection}>
                    <Text style={styles.followUpPrompt}>
                      You said this didn't work before. Any specific details to add?
                    </Text>
                    <View style={styles.reasonsGrid}>
                      {followUpQuestions.map((followUp) => (
                        <TouchableOpacity
                          key={followUp.value}
                          style={[
                            styles.reasonCard,
                            selectedFollowUp === followUp.value && styles.reasonCardSelected
                          ]}
                          onPress={() => handleSelectFollowUp(followUp.value)}
                          activeOpacity={0.7}
                        >
                          <View style={[
                            styles.emojiContainer,
                            selectedFollowUp === followUp.value && styles.emojiContainerSelected
                          ]}
                          >
                            <Text style={styles.emoji}>{followUp.emoji}</Text>
                          </View>
                          <Text style={[
                            styles.reasonText,
                            selectedFollowUp === followUp.value && styles.reasonTextSelected
                          ]}>
                            {followUp.label}
                          </Text>
                          {selectedFollowUp === followUp.value && (
                            <View style={styles.selectedIndicator}>
                              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <ScrollView 
                  style={styles.reasonsContainer}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.reasonsContent,
                    { paddingBottom: (insets.bottom || 0) + 12 }
                  ]}
                >
                <View style={styles.reasonsGrid}>
                  {reasons.map((reason) => (
                    <TouchableOpacity
                      key={reason.value}
                      style={[
                        styles.reasonCard,
                        selectedReason === reason.value && styles.reasonCardSelected
                      ]}
                      onPress={() => handleSelectReason(reason.value)}
                      activeOpacity={0.7}
                    >
                      <View style={[
                        styles.emojiContainer,
                        selectedReason === reason.value && styles.emojiContainerSelected
                      ]}>
                        <Text style={styles.emoji}>{reason.emoji}</Text>
                      </View>
                      <Text style={[
                        styles.reasonText,
                        selectedReason === reason.value && styles.reasonTextSelected
                      ]}>
                        {reason.label}
                      </Text>
                      {selectedReason === reason.value && reason.value !== 'other' && (
                        <View style={styles.selectedIndicator}>
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                </ScrollView>
              </View>
            )}
            
            {/* Footer Actions - only show when not in custom input mode or follow-up mode */}
            {!showCustomInput && !showFollowUp && !existingFeedback && (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkip}
                  activeOpacity={0.7}
                >
                  <Text style={styles.skipText}>I'll skip the feedback</Text>
                  <Ionicons name="arrow-forward" size={16} color="#666" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.dontAskContainer}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setDontAskAgain(!dontAskAgain);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkbox,
                    dontAskAgain && styles.checkboxChecked
                  ]}>
                    {dontAskAgain && (
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.dontAskText}>Don't ask me again</Text>
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center', // Center vertically instead of bottom
    paddingBottom: 40, // Shift up slightly from true center to leave room for keyboard
  },
  container: {
    height: '75%', // Increased from 60% to show more content
    width: '90%', // Not full width for floating card effect
    alignSelf: 'center',
    maxHeight: 600, // Add max height to prevent it from being too tall on large screens
  },
  content: {
    flex: 1, // Fill the container
    borderRadius: 32, // All corners rounded since modal is centered
    paddingTop: 12,
    paddingBottom: 34,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 }, // Shadow all around
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  pullIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },
  reasonsContainer: {
    flex: 1, // Let it flex and scroll
    marginBottom: 16,
  },
  reasonsContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reasonCard: {
    width: '48%', // Use percentage for 2 columns with gap
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  reasonCardSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    transform: [{ scale: 0.98 }],
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emojiContainerSelected: {
    backgroundColor: '#4CAF50',
  },
  emoji: {
    fontSize: 20,
  },
  reasonText: {
    fontSize: 12,
    color: '#424242',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  reasonTextSelected: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 8,
  },
  skipButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 28,
  },
  skipText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  dontAskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D0D0D0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  dontAskText: {
    fontSize: 14,
    color: '#757575',
  },
  customInputContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  customInputContent: {
    paddingBottom: 20,
  },
  customInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  customInputTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  customInputPrompt: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
    lineHeight: 21,
  },
  customInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
    minHeight: 100,
    maxHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  submitButtonTextDisabled: {
    color: '#999',
  },
  followUpSection: {
    flex: 1,
  },
  followUpPrompt: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  // Legacy styles (kept for compatibility if needed)
  reasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reasonButtonSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  checkIcon: {
    marginLeft: 8,
  },
});