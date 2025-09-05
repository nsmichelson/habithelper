import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  SafeAreaView,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { 
  PanGestureHandler, 
  State, 
  GestureHandlerRootView 
} from 'react-native-gesture-handler';
import { 
  EducationSet, 
  EducationCard as CardType,
  OrganizationEducationContent 
} from '@/data/eduation_collection/organization';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.75;

interface Props {
  content: OrganizationEducationContent;
  visible: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const EducationCards: React.FC<Props> = ({ 
  content, 
  visible, 
  onClose,
  onComplete 
}) => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  
  const currentSet = content.sets[currentSetIndex];
  const currentCard = currentSet?.cards[currentCardIndex];
  const totalCards = content.sets.reduce((sum, set) => sum + set.cards.length, 0);
  const currentAbsoluteIndex = content.sets
    .slice(0, currentSetIndex)
    .reduce((sum, set) => sum + set.cards.length, 0) + currentCardIndex;

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    // Update progress bar
    Animated.timing(progressAnim, {
      toValue: (currentAbsoluteIndex + 1) / totalCards,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentAbsoluteIndex, totalCards]);

  const handleNext = () => {
    if (isAnimating) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsAnimating(true);
    
    // Slide out animation
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: -SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (currentCardIndex < currentSet.cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else if (currentSetIndex < content.sets.length - 1) {
        setCurrentSetIndex(currentSetIndex + 1);
        setCurrentCardIndex(0);
      } else {
        // Completed all cards
        handleComplete();
      }
      setIsAnimating(false);
    });
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsAnimating(true);
    
    // Slide in animation
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
      } else if (currentSetIndex > 0) {
        setCurrentSetIndex(currentSetIndex - 1);
        setCurrentCardIndex(content.sets[currentSetIndex - 1].cards.length - 1);
      }
      setIsAnimating(false);
    });
  };

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (onComplete) onComplete();
    handleClose();
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      // Reset state
      setCurrentSetIndex(0);
      setCurrentCardIndex(0);
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.END) {
      const { translationX, velocityX } = nativeEvent;
      
      if (translationX < -50 || velocityX < -500) {
        handleNext();
      } else if (translationX > 50 || velocityX > 500) {
        handlePrevious();
      } else {
        // Snap back
        Animated.spring(translateX, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  if (!visible || !currentCard) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Background blur */}
        <Animated.View 
          style={[
            styles.background,
            { opacity: fadeAnim }
          ]}
        >
          <BlurView intensity={90} style={StyleSheet.absoluteFillObject} tint="dark" />
        </Animated.View>

        <SafeAreaView style={styles.safeArea}>
          {/* Progress bars */}
          <View style={styles.progressContainer}>
            {content.sets.map((set, setIndex) => (
              <View key={set.set_id} style={styles.setProgress}>
                {set.cards.map((_, cardIndex) => {
                  const isActive = setIndex === currentSetIndex && cardIndex === currentCardIndex;
                  const isPast = setIndex < currentSetIndex || 
                    (setIndex === currentSetIndex && cardIndex < currentCardIndex);
                  
                  return (
                    <View key={cardIndex} style={styles.progressBarWrapper}>
                      <View style={styles.progressBarBackground} />
                      {(isActive || isPast) && (
                        <Animated.View 
                          style={[
                            styles.progressBarFill,
                            isActive && {
                              width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                              }),
                            },
                            isPast && { width: '100%' }
                          ]} 
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Close button */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleClose}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>

          {/* Card content */}
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View 
              style={[
                styles.cardContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    { scale: scaleAnim },
                    { translateX },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={['#FFF5F3', '#FFE8E3', '#FFDDD5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                {/* Set title badge */}
                {currentCardIndex === 0 && (
                  <View style={styles.setBadge}>
                    <Text style={styles.setBadgeText}>{currentSet.set_title}</Text>
                  </View>
                )}

                {/* Card image */}
                {currentCard.image && (
                  <View style={styles.imageContainer}>
                    <Image 
                      source={currentCard.image} 
                      style={styles.cardImage}
                      resizeMode="contain"
                    />
                  </View>
                )}

                {/* Card content */}
                <ScrollView 
                  style={styles.contentContainer}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.contentContainerStyle}
                >
                  <Text style={styles.cardTitle}>{currentCard.card_title}</Text>
                  <Text style={styles.cardCopy}>{currentCard.copy}</Text>
                </ScrollView>

                {/* Navigation hint */}
                <View style={styles.navigationHint}>
                  <Text style={styles.hintText}>
                    {currentAbsoluteIndex === 0 ? 'Swipe left to continue' : 'Swipe to navigate'}
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
          </PanGestureHandler>

          {/* Tap zones for navigation */}
          <View style={styles.tapZones}>
            <TouchableOpacity 
              style={styles.leftTapZone} 
              onPress={handlePrevious}
              disabled={currentAbsoluteIndex === 0}
            />
            <TouchableOpacity 
              style={styles.rightTapZone} 
              onPress={handleNext}
            />
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 16,
    right: 16,
    flexDirection: 'column',
    gap: 8,
    zIndex: 100,
  },
  setProgress: {
    flexDirection: 'row',
    gap: 4,
  },
  progressBarWrapper: {
    flex: 1,
    height: 3,
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressBarFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 16,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    padding: 24,
  },
  setBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  setBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E85D75',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  imageContainer: {
    height: CARD_HEIGHT * 0.35,
    marginHorizontal: -24,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '90%',
    height: '90%',
  },
  contentContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: 60,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3142',
    marginBottom: 16,
    lineHeight: 34,
  },
  cardCopy: {
    fontSize: 16,
    lineHeight: 26,
    color: '#4A5568',
    fontWeight: '400',
  },
  navigationHint: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  tapZones: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  leftTapZone: {
    flex: 1,
  },
  rightTapZone: {
    flex: 2,
  },
});

export default EducationCards;