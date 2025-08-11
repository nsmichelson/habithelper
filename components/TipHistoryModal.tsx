import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DailyTip, Tip } from '../types/tip';
import { format } from 'date-fns';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  tips: Array<{
    dailyTip: DailyTip;
    tip: Tip;
  }>;
  emptyMessage?: string;
}

export default function TipHistoryModal({ 
  visible, 
  onClose, 
  title, 
  tips,
  emptyMessage = "No experiments yet"
}: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
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
  }, [visible]);
  const getFeedbackIcon = (dailyTip: DailyTip) => {
    if (dailyTip.evening_check_in === 'went_great' || 
        dailyTip.quick_completions?.some(c => c.quick_note === 'worked_great')) {
      return { name: 'heart', color: '#E91E63' };
    }
    if (dailyTip.evening_check_in === 'went_ok' || 
        dailyTip.quick_completions?.some(c => c.quick_note === 'went_ok')) {
      return { name: 'thumbs-up', color: '#FF9800' };
    }
    if (dailyTip.evening_check_in === 'not_great' || 
        dailyTip.quick_completions?.some(c => c.quick_note === 'not_for_me')) {
      return { name: 'thumbs-down', color: '#9E9E9E' };
    }
    if (dailyTip.user_response === 'try_it') {
      return { name: 'checkmark-circle', color: '#4CAF50' };
    }
    return { name: 'flask-outline', color: '#2196F3' };
  };

  const getStatusText = (dailyTip: DailyTip) => {
    if (dailyTip.evening_check_in === 'went_great') return 'Went great!';
    if (dailyTip.evening_check_in === 'went_ok') return 'Went okay';
    if (dailyTip.evening_check_in === 'not_great') return 'Not great';
    if (dailyTip.quick_completions?.length) {
      const lastNote = dailyTip.quick_completions[dailyTip.quick_completions.length - 1].quick_note;
      if (lastNote === 'worked_great') return 'Worked great!';
      if (lastNote === 'went_ok') return 'Went okay';
      if (lastNote === 'not_sure') return 'Not sure';
      if (lastNote === 'not_for_me') return 'Not for me';
    }
    if (dailyTip.user_response === 'try_it') return 'Tried';
    if (dailyTip.user_response === 'maybe_later') return 'Saved for later';
    if (dailyTip.user_response === 'not_interested') return 'Skipped';
    return 'Presented';
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[
          styles.modalOverlay,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableWithoutFeedback onPress={onClose}>
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
          {/* Header */}
          <LinearGradient
            colors={['#4CAF50', '#45B255']}
            style={styles.header}
          >
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </LinearGradient>

          {/* Content */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {tips.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="flask-outline" size={48} color="#CCC" />
                <Text style={styles.emptyText}>{emptyMessage}</Text>
              </View>
            ) : (
              tips.map(({ dailyTip, tip }, index) => {
                const icon = getFeedbackIcon(dailyTip);
                return (
                  <View key={dailyTip.id} style={styles.tipCard}>
                    <View style={styles.tipHeader}>
                      <View style={styles.tipDate}>
                        <Text style={styles.dateText}>
                          {format(new Date(dailyTip.presented_date), 'MMM d')}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: `${icon.color}15` }]}>
                        <Ionicons name={icon.name as any} size={16} color={icon.color} />
                        <Text style={[styles.statusText, { color: icon.color }]}>
                          {getStatusText(dailyTip)}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.tipTitle}>{tip.summary}</Text>
                    
                    {/* Show completion count if multiple times */}
                    {dailyTip.quick_completions && dailyTip.quick_completions.length > 1 && (
                      <View style={styles.completionCount}>
                        <Ionicons name="repeat" size={14} color="#666" />
                        <Text style={styles.completionText}>
                          Completed {dailyTip.quick_completions.length} times
                        </Text>
                      </View>
                    )}
                    
                    {/* Show reflection if exists */}
                    {dailyTip.evening_reflection && (
                      <View style={styles.reflection}>
                        <Text style={styles.reflectionLabel}>Reflection:</Text>
                        <Text style={styles.reflectionText}>{dailyTip.evening_reflection}</Text>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Footer Stats */}
          {tips.length > 0 && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Total: {tips.length} experiment{tips.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.8,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  tipCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipDate: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    lineHeight: 22,
  },
  completionCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  completionText: {
    fontSize: 12,
    color: '#666',
  },
  reflection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  reflectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  reflectionText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});