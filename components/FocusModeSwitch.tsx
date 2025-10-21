import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import StorageService from '@/services/storage';
import { DailyTip } from '@/types/tip';
import { getTipById } from '@/data/simplifiedTips';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  onActivate: () => void;
  lovedTips: DailyTip[];
  currentStreak: number;
  totalExperiments: number;
}

export default function FocusModeSwitch({ 
  visible, 
  onClose, 
  onActivate, 
  lovedTips,
  currentStreak,
  totalExperiments 
}: Props) {
  const [stage, setStage] = useState<'intro' | 'benefits' | 'preview' | 'confirm'>('intro');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 15,
          useNativeDriver: true,
        }),
      ]).start();

      // Floating animation for icons
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -10,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  useEffect(() => {
    // Animate progress bar based on stage
    const targetValue = stage === 'intro' ? 0.25 : 
                       stage === 'benefits' ? 0.5 : 
                       stage === 'preview' ? 0.75 : 1;
    
    Animated.timing(progressAnim, {
      toValue: targetValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [stage]);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (stage === 'intro') setStage('benefits');
    else if (stage === 'benefits') setStage('preview');
    else if (stage === 'preview') setStage('confirm');
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (stage === 'benefits') setStage('intro');
    else if (stage === 'preview') setStage('benefits');
    else if (stage === 'confirm') setStage('preview');
  };

  const handleActivateFocusMode = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Save focus mode preference
    const profile = await StorageService.getUserProfile();
    if (profile) {
      await StorageService.saveUserProfile({
        ...profile,
        focusMode: {
          enabled: true,
          activatedDate: new Date().toISOString(),
          lovedTipIds: lovedTips.map(t => t.tip_id),
        }
      });
    }
    
    onActivate();
  };

  const renderIntro = () => (
    <View style={styles.stageContainer}>
      <Animated.View style={[styles.iconContainer, { transform: [{ translateY: floatAnim }] }]}>
        <LinearGradient
          colors={['#4CAF50', '#66BB6A']}
          style={styles.iconGradient}
        >
          <Ionicons name="sparkles" size={40} color="#FFFFFF" />
        </LinearGradient>
      </Animated.View>
      
      <Text style={styles.title}>Ready for Focus Mode?</Text>
      <Text style={styles.subtitle}>
        You've discovered {lovedTips.length} habits that work for you!
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{lovedTips.length}</Text>
          <Text style={styles.statLabel}>Loved Habits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalExperiments}</Text>
          <Text style={styles.statLabel}>Experiments</Text>
        </View>
      </View>
      
      <Text style={styles.description}>
        Focus Mode helps you master the habits you've already discovered, 
        rather than constantly exploring new ones.
      </Text>
    </View>
  );

  const renderBenefits = () => (
    <View style={styles.stageContainer}>
      <Text style={styles.title}>What You'll Get</Text>
      
      <ScrollView style={styles.benefitsList} showsVerticalScrollIndicator={false}>
        <View style={styles.benefitCard}>
          <View style={styles.benefitIcon}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Daily Habit Checklist</Text>
            <Text style={styles.benefitText}>
              Track your loved habits every day with a simple, focused checklist
            </Text>
          </View>
        </View>
        
        <View style={styles.benefitCard}>
          <View style={styles.benefitIcon}>
            <Ionicons name="trending-up" size={24} color="#2196F3" />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Habit Advancement</Text>
            <Text style={styles.benefitText}>
              Level up your habits gradually (e.g., 5 min walk → 10 min → 30 min)
            </Text>
          </View>
        </View>
        
        <View style={styles.benefitCard}>
          <View style={styles.benefitIcon}>
            <Ionicons name="layers" size={24} color="#9C27B0" />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Habit Stacking</Text>
            <Text style={styles.benefitText}>
              Combine successful habits into powerful morning or evening routines
            </Text>
          </View>
        </View>
        
        <View style={styles.benefitCard}>
          <View style={styles.benefitIcon}>
            <Ionicons name="analytics" size={24} color="#FF6B6B" />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Mastery Tracking</Text>
            <Text style={styles.benefitText}>
              See your consistency and progress for each habit over time
            </Text>
          </View>
        </View>
        
        <View style={styles.benefitCard}>
          <View style={styles.benefitIcon}>
            <Ionicons name="time" size={24} color="#FFC107" />
          </View>
          <View style={styles.benefitContent}>
            <Text style={styles.benefitTitle}>Reduced Discovery</Text>
            <Text style={styles.benefitText}>
              Get just 1 new tip per week instead of daily experiments
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderPreview = () => (
    <View style={styles.stageContainer}>
      <Text style={styles.title}>Your Focus Habits</Text>
      <Text style={styles.subtitle}>These will be your daily focus:</Text>
      
      <ScrollView style={styles.lovedTipsList} showsVerticalScrollIndicator={false}>
        {lovedTips.slice(0, 5).map((tip, index) => {
          const tipData = getTipById(tip.tip_id);
          return (
            <Animated.View 
              key={tip.id}
              style={[
                styles.lovedTipCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    { 
                      translateX: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, index % 2 === 0 ? 50 : -50]
                      })
                    }
                  ]
                }
              ]}
            >
              <View style={styles.tipCheckbox}>
                <Ionicons name="heart" size={20} color="#FF6B6B" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tipData?.summary || 'Habit'}</Text>
                <View style={styles.tipMeta}>
                  <Text style={styles.tipMetaText}>
                    {tipData?.time?.replace('-', ' to ').replace('min', ' min') || '5 min'}
                  </Text>
                  <Text style={styles.tipDot}>•</Text>
                  <Text style={styles.tipMetaText}>
                    Level 1
                  </Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#CCC" />
            </Animated.View>
          );
        })}
        
        {lovedTips.length > 5 && (
          <Text style={styles.moreText}>
            +{lovedTips.length - 5} more habits
          </Text>
        )}
      </ScrollView>
      
      <View style={styles.noteCard}>
        <Ionicons name="information-circle" size={20} color="#2196F3" />
        <Text style={styles.noteText}>
          You can always switch back to Discovery Mode later
        </Text>
      </View>
    </View>
  );

  const renderConfirm = () => (
    <View style={styles.stageContainer}>
      <Animated.View style={[styles.iconContainer, { transform: [{ translateY: floatAnim }] }]}>
        <LinearGradient
          colors={['#FFD700', '#FFC107']}
          style={styles.iconGradient}
        >
          <Ionicons name="trophy" size={40} color="#FFFFFF" />
        </LinearGradient>
      </Animated.View>
      
      <Text style={styles.title}>Activate Focus Mode?</Text>
      <Text style={styles.subtitle}>
        Transform your experience to focus on mastery
      </Text>
      
      <View style={styles.confirmList}>
        <View style={styles.confirmItem}>
          <Ionicons name="checkmark" size={20} color="#4CAF50" />
          <Text style={styles.confirmText}>Daily checklist of your {lovedTips.length} loved habits</Text>
        </View>
        <View style={styles.confirmItem}>
          <Ionicons name="checkmark" size={20} color="#4CAF50" />
          <Text style={styles.confirmText}>Advance and level up each habit</Text>
        </View>
        <View style={styles.confirmItem}>
          <Ionicons name="checkmark" size={20} color="#4CAF50" />
          <Text style={styles.confirmText}>Only 1 new discovery per week</Text>
        </View>
        <View style={styles.confirmItem}>
          <Ionicons name="checkmark" size={20} color="#4CAF50" />
          <Text style={styles.confirmText}>Switch back anytime</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.activateButton}
        onPress={handleActivateFocusMode}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#4CAF50', '#66BB6A']}
          style={styles.activateGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.activateText}>Activate Focus Mode</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.maybeLaterButton}
        onPress={onClose}
      >
        <Text style={styles.maybeLaterText}>Maybe Later</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <BlurView intensity={20} style={StyleSheet.absoluteFillObject}>
        <View style={styles.overlay}>
          <Animated.View 
            style={[
              styles.container,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
            </View>
            
            {/* Content */}
            {stage === 'intro' && renderIntro()}
            {stage === 'benefits' && renderBenefits()}
            {stage === 'preview' && renderPreview()}
            {stage === 'confirm' && renderConfirm()}
            
            {/* Navigation */}
            {stage !== 'confirm' && (
              <View style={styles.navigation}>
                {stage !== 'intro' && (
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBack}
                  >
                    <Ionicons name="arrow-back" size={24} color="#666" />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={onClose}
                >
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNext}
                >
                  <LinearGradient
                    colors={['#4CAF50', '#66BB6A']}
                    style={styles.nextGradient}
                  >
                    <Text style={styles.nextText}>
                      {stage === 'preview' ? 'Ready!' : 'Next'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: SCREEN_HEIGHT * 0.8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  stageContainer: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  benefitsList: {
    maxHeight: 300,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
  },
  benefitIcon: {
    marginRight: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  lovedTipsList: {
    maxHeight: 250,
    width: '100%',
  },
  lovedTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  tipCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tipMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipMetaText: {
    fontSize: 12,
    color: '#999',
  },
  tipDot: {
    marginHorizontal: 6,
    color: '#CCC',
  },
  moreText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#1976D2',
    lineHeight: 16,
  },
  confirmList: {
    width: '100%',
    marginVertical: 24,
  },
  confirmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  confirmText: {
    flex: 1,
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  activateButton: {
    width: '100%',
    marginBottom: 12,
  },
  activateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  activateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  maybeLaterButton: {
    paddingVertical: 12,
  },
  maybeLaterText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  backButton: {
    padding: 8,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    color: '#999',
  },
  nextButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 4,
  },
  nextText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});