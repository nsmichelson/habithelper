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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  visible: boolean;
  tip: Tip;
  onClose: () => void;
  onFeedback: (reason: string, skipFutureQuestion?: boolean) => void;
  existingFeedback?: string; // To show follow-ups for existing feedback
}

// Follow-up questions for deeper insights
const getFollowUpQuestions = (primaryReason: string): { label: string; value: string; emoji: string }[] => {
  switch (primaryReason) {
    case 'dislike_taste':
      return [
        { label: "I prefer sweeter flavors", value: 'prefer_sweet', emoji: '🍬' },
        { label: "I prefer savory flavors", value: 'prefer_savory', emoji: '🧂' },
        { label: "Too spicy for me", value: 'too_spicy', emoji: '🌶️' },
        { label: "Not spicy enough", value: 'not_spicy_enough', emoji: '🫑' },
        { label: "Too bland", value: 'too_bland', emoji: '😐' },
        { label: "Too rich/heavy", value: 'too_rich', emoji: '🧈' },
        { label: "Prefer lighter flavors", value: 'prefer_light', emoji: '🌱' },
        { label: "Don't like that specific ingredient", value: 'specific_ingredient', emoji: '🚫' },
      ];
    
    case 'dislike_texture':
      return [
        { label: "Too mushy/soft", value: 'too_soft', emoji: '🥣' },
        { label: "Too crunchy/hard", value: 'too_hard', emoji: '🥜' },
        { label: "Too chewy", value: 'too_chewy', emoji: '🍬' },
        { label: "Too slimy", value: 'too_slimy', emoji: '🫘' },
        { label: "Prefer smoother textures", value: 'prefer_smooth', emoji: '🥤' },
        { label: "Prefer more texture variety", value: 'prefer_varied', emoji: '🎲' },
      ];
    
    case 'too_long':
    case 'too_complex':
      return [
        { label: "Would try if under 5 minutes", value: 'if_under_5min', emoji: '⚡' },
        { label: "Would try if under 15 minutes", value: 'if_under_15min', emoji: '⏱️' },
        { label: "Too many steps involved", value: 'too_many_steps', emoji: '📝' },
        { label: "Need simpler instructions", value: 'need_simpler', emoji: '🎯' },
        { label: "Would try on weekends", value: 'weekend_only', emoji: '📅' },
        { label: "Prefer one-step solutions", value: 'one_step_only', emoji: '1️⃣' },
      ];
    
    case 'too_much_cooking':
      return [
        { label: "Prefer no-cook options", value: 'no_cook_only', emoji: '🥗' },
        { label: "Microwave only", value: 'microwave_only', emoji: '📻' },
        { label: "Would try simpler cooking", value: 'simple_cooking_ok', emoji: '🍳' },
        { label: "Don't know how to cook this", value: 'dont_know_how', emoji: '❓' },
        { label: "Afraid of messing it up", value: 'afraid_to_fail', emoji: '😰' },
        { label: "Would try with guidance", value: 'need_guidance', emoji: '👨‍🏫' },
      ];
    
    case 'too_expensive':
      return [
        { label: "Would try cheaper version", value: 'if_cheaper', emoji: '💵' },
        { label: "Can't afford ingredients", value: 'cant_afford', emoji: '💸' },
        { label: "Not worth the cost", value: 'not_worth_cost', emoji: '⚖️' },
        { label: "Would try if on sale", value: 'if_on_sale', emoji: '🏷️' },
        { label: "Prefer budget options only", value: 'budget_only', emoji: '🪙' },
      ];
    
    case 'no_access':
      return [
        { label: "Not available near me", value: 'not_available_locally', emoji: '📍' },
        { label: "Would need to shop first", value: 'need_shopping', emoji: '🛒' },
        { label: "Don't know where to find it", value: 'dont_know_where', emoji: '🗺️' },
        { label: "Would try with substitutions", value: 'ok_with_substitutes', emoji: '🔄' },
        { label: "Need delivery option", value: 'need_delivery', emoji: '🚚' },
      ];
    
    case 'tried_failed':
      return [
        { label: "Didn't see results", value: 'no_results', emoji: '📊' },
        { label: "Made me feel worse", value: 'felt_worse', emoji: '📉' },
        { label: "Too hard to maintain", value: 'hard_to_maintain', emoji: '🎢' },
        { label: "Didn't fit my schedule", value: 'schedule_conflict', emoji: '📆' },
        { label: "Would try modified version", value: 'try_modified', emoji: '🔧' },
        { label: "Need more time to see effects", value: 'need_more_time', emoji: '⏳' },
      ];
    
    default:
      return [];
  }
};

// Define reason categories based on tip characteristics
const getReasonOptions = (tip: Tip): { label: string; value: string; icon: string; emoji: string }[] => {
  const options: { label: string; value: string; icon: string; emoji: string }[] = [];
  
  // Food-related reasons (if tip involves specific foods)
  if (tip.involves_foods && tip.involves_foods.length > 0) {
    options.push(
      { label: "Not a fan of the taste", value: 'dislike_taste', icon: 'close-circle-outline', emoji: '😝' },
      { label: "Texture isn't for me", value: 'dislike_texture', icon: 'water-outline', emoji: '🤔' },
      { label: "Don't have ingredients", value: 'no_access', icon: 'basket-outline', emoji: '🛒' },
      { label: "Can't eat this", value: 'cant_eat', icon: 'warning-outline', emoji: '⚠️' },
    );
  }
  
  // Cooking-related reasons
  if (tip.cooking_skill_required && tip.cooking_skill_required !== 'none') {
    options.push(
      { label: 'Too much cooking', value: 'too_much_cooking', icon: 'restaurant-outline', emoji: '👨‍🍳' },
      { label: "Missing equipment", value: 'no_equipment', icon: 'construct-outline', emoji: '🔧' },
    );
  }
  
  // Time-related reasons
  if (tip.time_cost_enum !== '0_5_min') {
    options.push(
      { label: 'Takes too long', value: 'too_long', icon: 'time-outline', emoji: '⏰' },
      { label: 'Too complicated', value: 'too_complex', icon: 'layers-outline', emoji: '🤯' },
    );
  }
  
  // Planning-related reasons
  if (tip.requires_planning || tip.requires_advance_prep) {
    options.push(
      { label: 'Too much planning', value: 'too_much_planning', icon: 'calendar-outline', emoji: '📅' },
    );
  }
  
  // Cost-related reasons
  if (tip.money_cost_enum !== '$') {
    options.push(
      { label: 'Too expensive', value: 'too_expensive', icon: 'cash-outline', emoji: '💰' },
    );
  }
  
  // Social reasons
  if (tip.social_mode === 'group' || tip.location_tags?.includes('social_event')) {
    options.push(
      { label: 'Too social for me', value: 'too_social', icon: 'people-outline', emoji: '👥' },
    );
  }
  
  // Universal reasons (always show these)
  options.push(
    { label: "Tried it, didn't work", value: 'tried_failed', icon: 'refresh-outline', emoji: '🔄' },
    { label: "Not my vibe", value: 'not_my_style', icon: 'person-outline', emoji: '✨' },
    { label: "Just not feeling it", value: 'not_interested', icon: 'heart-dislike-outline', emoji: '💭' },
    { label: "Something else", value: 'other', icon: 'ellipsis-horizontal-outline', emoji: '💬' },
  );
  
  return options;
};

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
  const reasons = existingFeedback ? [] : getReasonOptions(tip);
  const followUpQuestions = existingFeedback ? getFollowUpQuestions(primaryReason) : [];
  
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
      const followUps = getFollowUpQuestions(reason);
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
                      {(existingFeedback ? followUpQuestions : getFollowUpQuestions(selectedReason)).map((followUp) => (
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