import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  onQuickComplete: (note?: 'easy' | 'challenging' | 'just_right') => void;
}

export default function QuickComplete({ visible, onClose, onQuickComplete }: Props) {
  const [selectedNote, setSelectedNote] = useState<'easy' | 'challenging' | 'just_right' | null>(null);
  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const buttonsOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Trigger haptic
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Animate in
      backdropOpacity.value = withTiming(1, { duration: 300 });
      cardScale.value = withSpring(1, { damping: 15, stiffness: 200 });
      
      checkScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.2, { damping: 8, stiffness: 200 }),
          withSpring(1, { damping: 12, stiffness: 150 })
        )
      );
      
      buttonsOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));
    } else {
      // Reset
      backdropOpacity.value = 0;
      cardScale.value = 0;
      checkScale.value = 0;
      buttonsOpacity.value = 0;
      setSelectedNote(null);
    }
  }, [visible]);

  const handleComplete = () => {
    // Animate out
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    cardScale.value = withSequence(
      withSpring(1.05, { damping: 10, stiffness: 200 }),
      withTiming(0, { duration: 200 }, () => {
        runOnJS(onQuickComplete)(selectedNote || undefined);
        runOnJS(onClose)();
      })
    );
    
    backdropOpacity.value = withTiming(0, { duration: 300 });
  };

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
  }));

  const noteOptions = [
    { value: 'easy', label: 'Easy!', emoji: '😎', color: '#4CAF50' },
    { value: 'just_right', label: 'Just Right', emoji: '👍', color: '#2196F3' },
    { value: 'challenging', label: 'Challenging', emoji: '💪', color: '#FF9800' },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.backdropTouch} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
          <LinearGradient
            colors={['#E8F5E9', '#FFFFFF']}
            style={styles.gradient}
          >
            {/* Success Check */}
            <Animated.View style={[styles.checkContainer, checkAnimatedStyle]}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={48} color="#FFF" />
              </View>
            </Animated.View>

            <Text style={styles.title}>You Did It! 🎉</Text>
            <Text style={styles.subtitle}>Great job completing the experiment!</Text>

            {/* Quick Note Options */}
            <Animated.View style={[styles.noteSection, buttonsAnimatedStyle]}>
              <Text style={styles.noteLabel}>How was it?</Text>
              <View style={styles.noteOptions}>
                {noteOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.noteButton,
                      selectedNote === option.value && [
                        styles.noteButtonSelected,
                        { borderColor: option.color }
                      ]
                    ]}
                    onPress={() => setSelectedNote(option.value as any)}
                  >
                    <Text style={styles.noteEmoji}>{option.emoji}</Text>
                    <Text style={[
                      styles.noteText,
                      selectedNote === option.value && { color: option.color }
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View style={[styles.actions, buttonsAnimatedStyle]}>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45B255']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.completeButtonText}>Mark Complete</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.skipButton} onPress={onClose}>
                <Text style={styles.skipButtonText}>Not yet</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Info Text */}
            <Text style={styles.infoText}>
              We'll still check in this evening for any additional reflections
            </Text>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropTouch: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  card: {
    width: SCREEN_WIDTH - 32,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  gradient: {
    padding: 24,
    alignItems: 'center',
  },
  checkContainer: {
    marginBottom: 16,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  noteSection: {
    width: '100%',
    marginBottom: 24,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
    textAlign: 'center',
  },
  noteOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  noteButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  noteButtonSelected: {
    backgroundColor: '#F8FFF8',
  },
  noteEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#666',
  },
  infoText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});