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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Tip } from '../types/tip';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  visible: boolean;
  tip: Tip;
  onClose: () => void;
  onFeedback: (reason: string, skipFutureQuestion?: boolean) => void;
}

// Define reason categories based on tip characteristics
const getReasonOptions = (tip: Tip): { label: string; value: string; icon: string }[] => {
  const options: { label: string; value: string; icon: string }[] = [];
  
  // Food-related reasons (if tip involves specific foods)
  if (tip.involves_foods && tip.involves_foods.length > 0) {
    options.push(
      { label: "Don't like the taste", value: 'dislike_taste', icon: 'close-circle-outline' },
      { label: "Don't like the texture", value: 'dislike_texture', icon: 'water-outline' },
      { label: "Don't have that food", value: 'no_access', icon: 'basket-outline' },
      { label: "Allergic/can't eat it", value: 'cant_eat', icon: 'warning-outline' },
    );
  }
  
  // Cooking-related reasons
  if (tip.cooking_skill_required && tip.cooking_skill_required !== 'none') {
    options.push(
      { label: 'Too much cooking', value: 'too_much_cooking', icon: 'restaurant-outline' },
      { label: "Don't have equipment", value: 'no_equipment', icon: 'construct-outline' },
    );
  }
  
  // Time-related reasons
  if (tip.time_cost_enum !== '0_5_min') {
    options.push(
      { label: 'Takes too long', value: 'too_long', icon: 'time-outline' },
      { label: 'Too complicated', value: 'too_complex', icon: 'layers-outline' },
    );
  }
  
  // Planning-related reasons
  if (tip.requires_planning || tip.requires_advance_prep) {
    options.push(
      { label: 'Too much planning', value: 'too_much_planning', icon: 'calendar-outline' },
    );
  }
  
  // Cost-related reasons
  if (tip.money_cost_enum !== '$') {
    options.push(
      { label: 'Too expensive', value: 'too_expensive', icon: 'cash-outline' },
    );
  }
  
  // Social reasons
  if (tip.social_mode === 'group' || tip.location_tags?.includes('social_event')) {
    options.push(
      { label: 'Too social/public', value: 'too_social', icon: 'people-outline' },
    );
  }
  
  // Universal reasons (always show these)
  options.push(
    { label: "Tried before, didn't work", value: 'tried_failed', icon: 'refresh-outline' },
    { label: "Not my style", value: 'not_my_style', icon: 'person-outline' },
    { label: "Just not interested", value: 'not_interested', icon: 'heart-dislike-outline' },
    { label: "Other reason", value: 'other', icon: 'ellipsis-horizontal-outline' },
  );
  
  return options;
};

export default function NotForMeFeedback({ visible, tip, onClose, onFeedback }: Props) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  
  const reasons = getReasonOptions(tip);
  
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
  
  const handleSelectReason = (reason: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedReason(reason);
    
    // Auto-submit after a brief delay for smooth UX
    setTimeout(() => {
      onFeedback(reason, dontAskAgain);
      setSelectedReason('');
      setDontAskAgain(false);
    }, 300);
  };
  
  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    setSelectedReason('');
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
              <View style={styles.iconContainer}>
                <Ionicons name="chatbubbles-outline" size={32} color="#4CAF50" />
              </View>
              <Text style={styles.title}>Mind sharing why?</Text>
              <Text style={styles.subtitle}>
                This helps me find better experiments for you! 
                {'\n'}No pressure though 😊
              </Text>
            </View>
            
            {/* Reason Options */}
            <ScrollView 
              style={styles.reasonsContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.reasonsContent}
            >
              {reasons.map((reason) => (
                <TouchableOpacity
                  key={reason.value}
                  style={[
                    styles.reasonButton,
                    selectedReason === reason.value && styles.reasonButtonSelected
                  ]}
                  onPress={() => handleSelectReason(reason.value)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={reason.icon as any} 
                    size={20} 
                    color={selectedReason === reason.value ? '#4CAF50' : '#666'} 
                  />
                  <Text style={[
                    styles.reasonText,
                    selectedReason === reason.value && styles.reasonTextSelected
                  ]}>
                    {reason.label}
                  </Text>
                  {selectedReason === reason.value && (
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Skip button */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip this question</Text>
            </TouchableOpacity>
            
            {/* Don't ask again option */}
            <TouchableOpacity
              style={styles.dontAskContainer}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setDontAskAgain(!dontAskAgain);
              }}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={dontAskAgain ? "checkbox" : "square-outline"} 
                size={20} 
                color="#999" 
              />
              <Text style={styles.dontAskText}>Don't ask me this again</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '75%',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 21,
  },
  reasonsContainer: {
    maxHeight: 300,
    paddingHorizontal: 24,
  },
  reasonsContent: {
    paddingBottom: 16,
  },
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
  reasonText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  reasonTextSelected: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  checkIcon: {
    marginLeft: 8,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  dontAskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  dontAskText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
});