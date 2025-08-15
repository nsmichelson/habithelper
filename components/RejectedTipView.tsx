import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Tip, TipAttempt } from '../types/tip';
import * as Haptics from 'expo-haptics';

interface Props {
  tip: Tip;
  rejection?: TipAttempt;
  onRequestFeedback: () => void;
  onFindNewTip: () => void;
}

const getRejectionReasonDisplay = (reason?: string): { icon: string; label: string; emoji: string } | null => {
  if (!reason) return null;
  
  // Handle custom "other:" reasons
  if (reason.startsWith('other:')) {
    return {
      icon: 'chatbubble-ellipses-outline',
      label: reason.substring(7).trim(),
      emoji: '💬'
    };
  }
  
  // Map predefined reasons to display values
  const reasonMap: Record<string, { icon: string; label: string; emoji: string }> = {
    'dislike_taste': { icon: 'close-circle-outline', label: "Not a fan of the taste", emoji: '😝' },
    'dislike_texture': { icon: 'water-outline', label: "Texture isn't for me", emoji: '🤔' },
    'no_access': { icon: 'basket-outline', label: "Don't have ingredients", emoji: '🛒' },
    'cant_eat': { icon: 'warning-outline', label: "Can't eat this", emoji: '⚠️' },
    'too_much_cooking': { icon: 'restaurant-outline', label: 'Too much cooking', emoji: '👨‍🍳' },
    'no_equipment': { icon: 'construct-outline', label: "Missing equipment", emoji: '🔧' },
    'too_long': { icon: 'time-outline', label: 'Takes too long', emoji: '⏰' },
    'too_complex': { icon: 'layers-outline', label: 'Too complicated', emoji: '🤯' },
    'too_much_planning': { icon: 'calendar-outline', label: 'Too much planning', emoji: '📅' },
    'too_expensive': { icon: 'cash-outline', label: 'Too expensive', emoji: '💰' },
    'too_social': { icon: 'people-outline', label: 'Too social for me', emoji: '👥' },
    'tried_failed': { icon: 'refresh-outline', label: "Tried it, didn't work", emoji: '🔄' },
    'not_my_style': { icon: 'person-outline', label: "Not my vibe", emoji: '✨' },
    'not_interested': { icon: 'heart-dislike-outline', label: "Just not feeling it", emoji: '💭' },
  };
  
  return reasonMap[reason] || null;
};

export default function RejectedTipView({ tip, rejection, onRequestFeedback, onFindNewTip }: Props) {
  const rejectionDisplay = getRejectionReasonDisplay(rejection?.rejection_reason);
  const hasReason = !!rejection?.rejection_reason;
  
  const handleRequestFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRequestFeedback();
  };
  
  const handleFindNewTip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFindNewTip();
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FBF8']}
        style={styles.card}
      >
        {/* Header - matching original tip card */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.label}>TODAY'S EXPERIMENT</Text>
            <View style={styles.statusBadge}>
              <Ionicons name="close-circle" size={16} color="#E57373" />
              <Text style={styles.statusText}>Not for you</Text>
            </View>
          </View>
          
          <Text style={styles.summary}>{tip.summary}</Text>
        </View>
        
        {/* Feedback Section */}
        {hasReason ? (
          <View style={styles.feedbackSection}>
            {/* Previous Feedback Display */}
            <View style={styles.previousFeedbackCard}>
              <Text style={styles.feedbackLabel}>You said:</Text>
              <View style={styles.reasonDisplay}>
                {rejectionDisplay && (
                  <>
                    <Text style={styles.reasonEmoji}>{rejectionDisplay.emoji}</Text>
                    <Text style={styles.reasonText}>{rejectionDisplay.label}</Text>
                  </>
                )}
              </View>
            </View>
            
            {/* Add More Feedback Prompt */}
            <TouchableOpacity
              style={styles.addMoreFeedbackButton}
              onPress={handleRequestFeedback}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={18} color="#4CAF50" />
              <Text style={styles.addMoreFeedbackText}>Add more feedback</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.feedbackSection}>
            {/* No Feedback Yet - Prompt */}
            <View style={styles.feedbackPromptCard}>
              <Text style={styles.feedbackPromptTitle}>
                <Ionicons name="help-circle" size={18} color="#4CAF50" /> Help us learn what works for you
              </Text>
              <Text style={styles.feedbackPromptText}>
                Mind sharing why this experiment wasn't a fit? It helps us find better matches!
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.shareFeedbackButton}
              onPress={handleRequestFeedback}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
              <Text style={styles.shareFeedbackButtonText}>Share Feedback</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Main Action Button */}
        <TouchableOpacity
          style={styles.newTipButton}
          onPress={handleFindNewTip}
          activeOpacity={0.7}
        >
          <Ionicons name="sparkles" size={20} color="#FFFFFF" />
          <Text style={styles.newTipButtonText}>Try Another Experiment</Text>
        </TouchableOpacity>
        
        {/* Secondary skip option */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleFindNewTip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Skip to next →</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
    letterSpacing: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E57373',
  },
  summary: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 28,
  },
  feedbackSection: {
    marginBottom: 20,
  },
  previousFeedbackCard: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  feedbackLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reasonEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  reasonText: {
    fontSize: 15,
    color: '#424242',
    flex: 1,
    fontWeight: '500',
  },
  addMoreFeedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  addMoreFeedbackText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  feedbackPromptCard: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  feedbackPromptTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 6,
  },
  feedbackPromptText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  shareFeedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  shareFeedbackButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  newTipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
  },
  newTipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
});