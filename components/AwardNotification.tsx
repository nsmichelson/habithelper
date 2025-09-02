import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Award } from '../types/awards';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AwardNotificationProps {
  award: Award | null;
  visible: boolean;
  onClose: () => void;
  onViewAwards?: () => void;
}

export default function AwardNotification({
  award,
  visible,
  onClose,
  onViewAwards,
}: AwardNotificationProps) {
  const translateY = useSharedValue(-200);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const autoCloseTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (visible && award) {
      // Clear any existing timer
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }

      // Animate in
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
      scale.value = withSpring(1);
      opacity.value = withSpring(1);
      
      // Animate icon with delay
      iconScale.value = withDelay(
        300,
        withSequence(
          withSpring(1.2),
          withSpring(1)
        )
      );

      // Auto close after 5 seconds
      autoCloseTimer.current = setTimeout(() => {
        handleClose();
      }, 5000);

      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Animate out
      translateY.value = withSpring(-200);
      scale.value = withSpring(0.8);
      opacity.value = withSpring(0);
      iconScale.value = withSpring(0);
    }

    return () => {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
    };
  }, [visible, award]);

  const handleClose = () => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
    }
    
    translateY.value = withSpring(-200, {}, () => {
      runOnJS(onClose)();
    });
    scale.value = withSpring(0.8);
    opacity.value = withSpring(0);
    iconScale.value = withSpring(0);
  };

  const handleViewAwards = () => {
    handleClose();
    if (onViewAwards) {
      setTimeout(onViewAwards, 300);
    }
  };

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const getTierColors = (tier?: string) => {
    switch (tier) {
      case 'diamond':
        return ['#B9F2FF', '#60E1FF', '#00D4FF'];
      case 'platinum':
        return ['#E5E4E2', '#C0C0C0', '#A8A8A8'];
      case 'gold':
        return ['#FFE5B4', '#FFD700', '#FFC125'];
      case 'silver':
        return ['#F5F5F5', '#C0C0C0', '#A8A8A8'];
      case 'bronze':
        return ['#F4E4C1', '#CD7F32', '#B87333'];
      default:
        return ['#E8F5E9', '#A5D6A7', '#66BB6A'];
    }
  };

  if (!award) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents={visible ? 'auto' : 'none'}>
      <LinearGradient
        colors={getTierColors(award.tier)}
        style={styles.gradient}
      >
        <TouchableOpacity
          style={styles.content}
          onPress={handleViewAwards}
          activeOpacity={0.9}
        >
          <View style={styles.header}>
            <Text style={styles.congratsText}>🎉 ACHIEVEMENT UNLOCKED! 🎉</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.iconContainer, iconStyle]}>
            <Text style={styles.icon}>{award.icon}</Text>
          </Animated.View>

          <Text style={styles.awardName}>{award.name}</Text>
          <Text style={styles.awardDescription}>{award.description}</Text>
          
          {award.earnedMessage && (
            <Text style={styles.earnedMessage}>{award.earnedMessage}</Text>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={handleViewAwards}
            >
              <Text style={styles.viewButtonText}>View All Awards</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
    elevation: 999,
  },
  gradient: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  congratsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#212121',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#424242',
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  icon: {
    fontSize: 64,
  },
  awardName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 8,
  },
  awardDescription: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    marginBottom: 12,
  },
  earnedMessage: {
    fontSize: 14,
    color: '#616161',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  viewButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
  },
});