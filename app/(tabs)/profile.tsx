import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import StorageService from '@/services/storage';
import { UserProfile } from '@/types/tip';
import * as Haptics from 'expo-haptics';
import OnboardingQuiz from '@/components/OnboardingQuiz';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCircumstanceModal, setShowCircumstanceModal] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [stats, setStats] = useState({
    totalExperiments: 0,
    totalTried: 0,
    totalLoved: 0,
  });
  
  // Animation values for modal
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  useEffect(() => {
    if (showCircumstanceModal) {
      // Fade in overlay and slide up content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out overlay and slide down content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showCircumstanceModal]);

  const loadProfile = async () => {
    try {
      const profile = await StorageService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (updatedProfile: UserProfile) => {
    try {
      // Save the updated profile
      await StorageService.saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
      setShowQuiz(false);
      
      // Show success message
      Alert.alert(
        'Quiz Updated!',
        'Your preferences have been updated successfully.',
        [{ text: 'OK' }]
      );
      
      // Reload stats in case they changed
      loadStats();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update your preferences. Please try again.');
    }
  };

  const loadStats = async () => {
    try {
      const tips = await StorageService.getDailyTips();
      const totalExperiments = tips.length;
      const totalTried = tips.filter(tip => tip.user_response === 'try_it').length;
      const totalLoved = tips.filter(tip => 
        tip.quick_completions?.some(c => c.quick_note === 'worked_great') ||
        tip.evening_check_in === 'went_great'
      ).length;
      
      setStats({ totalExperiments, totalTried, totalLoved });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleUpdateCircumstance = async (type: 'medical' | 'life', value: string) => {
    if (!userProfile) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    let updatedProfile = { ...userProfile };
    
    if (type === 'medical') {
      if (updatedProfile.medical_conditions.includes(value as any)) {
        updatedProfile.medical_conditions = updatedProfile.medical_conditions.filter(c => c !== value);
      } else {
        updatedProfile.medical_conditions = [...updatedProfile.medical_conditions, value as any];
      }
    }
    
    await StorageService.saveUserProfile(updatedProfile);
    setUserProfile(updatedProfile);
    
    Alert.alert(
      'Updated',
      'Your circumstances have been updated. Tomorrow\'s experiment will reflect these changes.',
      [{ text: 'OK' }]
    );
    
    setShowCircumstanceModal(false);
  };

  const formatGoal = (goals: string[]) => {
    if (goals.length === 0) return 'improve my health';
    
    const goalLabels: Record<string, string> = {
      weight_loss: 'lose weight',
      muscle_gain: 'build muscle',
      reduce_sugar: 'reduce sugar intake',
      improve_hydration: 'stay hydrated',
      better_lipids: 'improve heart health',
      less_processed_food: 'eat less processed food',
      increase_veggies: 'eat more vegetables',
      plant_based: 'eat more plant-based',
      endurance_performance: 'improve endurance',
      strength_performance: 'get stronger',
      healthy_pregnancy: 'support a healthy pregnancy',
      improve_energy: 'have more energy',
      lower_blood_pressure: 'lower blood pressure',
      improve_gut_health: 'improve digestion',
    };
    
    const primary = goalLabels[goals[0]] || goals[0].replace(/_/g, ' ');
    return primary;
  };

  const CircumstanceModal = () => {
    if (!showCircumstanceModal) return null;
    
    return (
      <Modal
        visible={showCircumstanceModal}
        animationType="none"
        transparent={true}
        onRequestClose={() => setShowCircumstanceModal(false)}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <TouchableWithoutFeedback onPress={() => setShowCircumstanceModal(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          
          <Animated.View 
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Circumstances</Text>
            <TouchableOpacity onPress={() => setShowCircumstanceModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll}>
            <Text style={styles.modalSectionTitle}>Medical Conditions</Text>
            {[
              { id: 'pregnancy', label: 'Pregnant', icon: 'heart' },
              { id: 'breastfeeding', label: 'Breastfeeding', icon: 'heart-outline' },
              { id: 't1_diabetes', label: 'Type 1 Diabetes', icon: 'medical' },
              { id: 't2_diabetes', label: 'Type 2 Diabetes', icon: 'medical-outline' },
              { id: 'hypertension', label: 'High Blood Pressure', icon: 'pulse' },
              { id: 'celiac', label: 'Celiac Disease', icon: 'alert-circle' },
              { id: 'ibs', label: 'IBS (Irritable Bowel)', icon: 'body' },
              { id: 'kidney_disease', label: 'Kidney Disease', icon: 'water' },
            ].map(condition => (
              <TouchableOpacity
                key={condition.id}
                style={[
                  styles.conditionItem,
                  userProfile?.medical_conditions.includes(condition.id as any) && styles.conditionItemActive
                ]}
                onPress={() => handleUpdateCircumstance('medical', condition.id)}
              >
                <Ionicons 
                  name={condition.icon as any} 
                  size={20} 
                  color={userProfile?.medical_conditions.includes(condition.id as any) ? '#4CAF50' : '#666'} 
                />
                <Text style={[
                  styles.conditionText,
                  userProfile?.medical_conditions.includes(condition.id as any) && styles.conditionTextActive
                ]}>
                  {condition.label}
                </Text>
                {userProfile?.medical_conditions.includes(condition.id as any) && (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
            
            <Text style={[styles.modalSectionTitle, { marginTop: 20 }]}>Allergies & Intolerances</Text>
            {[
              { id: 'lactose_intolerance', label: 'Lactose Intolerant', icon: 'nutrition' },
              { id: 'nut_allergy', label: 'Nut Allergy', icon: 'warning' },
              { id: 'shellfish_allergy', label: 'Shellfish Allergy', icon: 'fish' },
              { id: 'egg_allergy', label: 'Egg Allergy', icon: 'egg' },
              { id: 'fish_allergy', label: 'Fish Allergy', icon: 'fish-outline' },
              { id: 'soy_allergy', label: 'Soy Allergy', icon: 'leaf' },
            ].map(condition => (
              <TouchableOpacity
                key={condition.id}
                style={[
                  styles.conditionItem,
                  userProfile?.medical_conditions.includes(condition.id as any) && styles.conditionItemActive
                ]}
                onPress={() => handleUpdateCircumstance('medical', condition.id)}
              >
                <Ionicons 
                  name={condition.icon as any} 
                  size={20} 
                  color={userProfile?.medical_conditions.includes(condition.id as any) ? '#4CAF50' : '#666'} 
                />
                <Text style={[
                  styles.conditionText,
                  userProfile?.medical_conditions.includes(condition.id as any) && styles.conditionTextActive
                ]}>
                  {condition.label}
                </Text>
                {userProfile?.medical_conditions.includes(condition.id as any) && (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                )}
              </TouchableOpacity>
            ))}
            
            <Text style={styles.modalNote}>
              These help us filter out experiments that might not be safe or appropriate for you.
            </Text>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
    );
  };

  if (loading || !userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show quiz if user wants to retake it
  if (showQuiz) {
    return (
      <OnboardingQuiz 
        onComplete={handleQuizComplete}
        existingProfile={userProfile}
        isRetake={true}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8F5E9', '#FFFFFF']}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Why</Text>
          </View>

          {/* Main Goal Card */}
          <View style={styles.goalCard}>
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              style={styles.goalGradient}
            >
              <Text style={styles.goalLabel}>I'm discovering what works for me to...</Text>
              <Text style={styles.goalText}>{formatGoal(userProfile.goals)}</Text>
              
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.totalExperiments}</Text>
                  <Text style={styles.statLabel}>experiments</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.totalLoved}</Text>
                  <Text style={styles.statLabel}>loved</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{stats.totalTried}</Text>
                  <Text style={styles.statLabel}>tried</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Current Situation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Current Situation</Text>
            
            <View style={styles.situationGrid}>
              {userProfile.budget_conscious && (
                <View style={styles.situationChip}>
                  <Ionicons name="cash-outline" size={16} color="#4CAF50" />
                  <Text style={styles.situationText}>Budget Conscious</Text>
                </View>
              )}
              
              {userProfile.cooking_time_available === 'none' && (
                <View style={styles.situationChip}>
                  <Ionicons name="time-outline" size={16} color="#4CAF50" />
                  <Text style={styles.situationText}>No Cooking Time</Text>
                </View>
              )}
              
              {userProfile.cooking_time_available === 'minimal' && (
                <View style={styles.situationChip}>
                  <Ionicons name="time-outline" size={16} color="#4CAF50" />
                  <Text style={styles.situationText}>Minimal Cook Time</Text>
                </View>
              )}
              
              {userProfile.medical_conditions.length > 0 && 
                userProfile.medical_conditions.map(condition => (
                  <View key={condition} style={styles.situationChip}>
                    <Ionicons name="medical-outline" size={16} color="#FF9800" />
                    <Text style={styles.situationText}>
                      {condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </View>
                ))
              }
              
              <TouchableOpacity 
                style={styles.addChip}
                onPress={() => setShowCircumstanceModal(true)}
              >
                <Ionicons name="add-circle-outline" size={16} color="#666" />
                <Text style={styles.addChipText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* What's Working */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Working For Me</Text>
            
            {stats.totalLoved > 0 ? (
              <View style={styles.workingCard}>
                <View style={styles.workingItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.workingText}>
                    You've found {stats.totalLoved} experiment{stats.totalLoved !== 1 ? 's' : ''} that work great!
                  </Text>
                </View>
                <Text style={styles.workingSubtext}>
                  Keep experimenting to discover more patterns
                </Text>
              </View>
            ) : (
              <View style={styles.workingCard}>
                <Text style={styles.workingText}>
                  Keep experimenting! You'll discover what works best for you.
                </Text>
              </View>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowQuiz(true)}
            >
              <LinearGradient
                colors={['#F5F5F5', '#FAFAFA']}
                style={styles.actionGradient}
              >
                <Ionicons name="refresh-outline" size={20} color="#4CAF50" />
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Retake Quiz</Text>
                  <Text style={styles.actionSubtext}>Update your goals and preferences</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowCircumstanceModal(true)}
            >
              <LinearGradient
                colors={['#F5F5F5', '#FAFAFA']}
                style={styles.actionGradient}
              >
                <Ionicons name="medical-outline" size={20} color="#4CAF50" />
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Health Updates</Text>
                  <Text style={styles.actionSubtext}>Add or remove medical conditions</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#F5F5F5', '#FAFAFA']}
                style={styles.actionGradient}
              >
                <Ionicons name="restaurant-outline" size={20} color="#4CAF50" />
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Food Preferences</Text>
                  <Text style={styles.actionSubtext}>Update dietary restrictions</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Motivational Quote */}
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "Every experiment brings you closer to discovering what truly works for you."
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
      
      <CircumstanceModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
  },
  goalCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  goalGradient: {
    padding: 24,
  },
  goalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 12,
  },
  situationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  situationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  situationText: {
    fontSize: 13,
    color: '#424242',
    fontWeight: '500',
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  addChipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  workingCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  workingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  workingText: {
    fontSize: 14,
    color: '#424242',
    flex: 1,
    lineHeight: 20,
  },
  workingSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#424242',
  },
  actionSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quoteCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 20,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#2E7D32',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
  },
  modalScroll: {
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  conditionItemActive: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  conditionText: {
    flex: 1,
    fontSize: 15,
    color: '#424242',
  },
  conditionTextActive: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  modalNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 12,
    lineHeight: 18,
  },
});