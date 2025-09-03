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
  withDelay,
  runOnJS,
  withSequence,
} from 'react-native-reanimated';
import { Award } from '../types/awards';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AwardBannerProps {
  award: Award | null;
  visible: boolean;
  onClose: () => void;
  onTap?: () => void;
}

export default function AwardBanner({
  award,
  visible,
  onClose,
  onTap,
}: AwardBannerProps) {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const autoCloseTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    console.log('AwardBanner useEffect - visible:', visible, 'award:', award?.name);
    
    if (visible && award) {
      console.log('AwardBanner - Showing banner for award:', award.name);
      
      // Clear any existing timer
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }

      // Animate in
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
      opacity.value = withSpring(1);

      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Auto close after 4 seconds
      autoCloseTimer.current = setTimeout(() => {
        console.log('AwardBanner - Auto closing after timeout');
        handleClose();
      }, 4000);
    } else {
      console.log('AwardBanner - Hiding banner');
      // Animate out
      translateY.value = withSpring(100);
      opacity.value = withSpring(0);
    }

    return () => {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
    };
  }, [visible, award]);

  const handleClose = () => {
    console.log('AwardBanner - handleClose called');
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
    }
    
    translateY.value = withSpring(100);
    opacity.value = withSpring(0, {}, () => {
      runOnJS(onClose)();
    });
  };

  const handleTap = () => {
    console.log('AwardBanner - Banner tapped');
    handleClose();
    if (onTap) {
      setTimeout(onTap, 300);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!award) {
    console.log('AwardBanner - No award, returning null');
    return null;
  }

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'diamond': return '#00D4FF';
      case 'platinum': return '#A8A8A8';
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return '#4CAF50';
    }
  };

  return (
    <Animated.View 
      style={[styles.container, animatedStyle]} 
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableOpacity
        style={[styles.banner, { borderLeftColor: getTierColor(award.tier) }]}
        onPress={handleTap}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{award.icon}</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.label}>NEW ACHIEVEMENT!</Text>
          <Text style={styles.title}>{award.name}</Text>
          <Text style={styles.message}>{award.earnedMessage}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 999,
  },
  banner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4CAF50',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    color: '#616161',
    fontStyle: 'italic',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '600',
  },
});