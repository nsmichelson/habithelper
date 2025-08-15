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

const getRejectionReasonDisplay = (reason?: string): { icon: string; label: string; emoji: string; detail?: string } | null => {
  if (!reason) return null;
  
  // Parse primary reason and follow-up detail if they exist
  const [primaryReason, followUpDetail] = reason.split(':').map(s => s.trim());
  
  // Handle custom "other:" reasons
  if (primaryReason === 'other') {
    return {
      icon: 'chatbubble-ellipses-outline',
      label: followUpDetail || 'Personal reason',
      emoji: '💬',
      detail: undefined
    };
  }
  
  // Map follow-up details to friendly labels
  const followUpLabels: Record<string, string> = {
    // Taste follow-ups
    'prefer_sweet': 'Prefers sweeter flavors',
    'prefer_savory': 'Prefers savory flavors',
    'too_spicy': 'Too spicy',
    'not_spicy_enough': 'Not spicy enough',
    'too_bland': 'Too bland',
    'too_rich': 'Too rich or heavy',
    'prefer_light': 'Prefers lighter flavors',
    'specific_ingredient': 'Specific ingredient issue',
    // Texture follow-ups
    'too_soft': 'Too mushy or soft',
    'too_hard': 'Too crunchy or hard',
    'too_chewy': 'Too chewy',
    'too_slimy': 'Texture issue',
    'prefer_smooth': 'Prefers smoother textures',
    'prefer_varied': 'Needs more texture variety',
    // Time follow-ups
    'if_under_5min': 'Would try if under 5 minutes',
    'if_under_15min': 'Would try if under 15 minutes',
    'too_many_steps': 'Too many steps',
    'need_simpler': 'Needs simpler instructions',
    'weekend_only': 'Weekend only option',
    'one_step_only': 'Prefers one-step solutions',
    // Cooking follow-ups
    'no_cook_only': 'Prefers no-cook options',
    'microwave_only': 'Microwave only',
    'simple_cooking_ok': 'Would try simpler cooking',
    'dont_know_how': "Doesn't know how",
    'afraid_to_fail': 'Worried about messing up',
    'need_guidance': 'Needs more guidance',
    // Cost follow-ups
    'if_cheaper': 'Would try cheaper version',
    'cant_afford': "Can't afford ingredients",
    'not_worth_cost': 'Not worth the cost',
    'if_on_sale': 'Would try if on sale',
    'budget_only': 'Budget options only',
    // Access follow-ups
    'not_available_locally': 'Not available nearby',
    'need_shopping': 'Would need to shop first',
    'dont_know_where': "Doesn't know where to find",
    'ok_with_substitutes': 'Would try with substitutions',
    'need_delivery': 'Needs delivery option',
    // Tried/failed follow-ups
    'no_results': "Didn't see results",
    'felt_worse': 'Made them feel worse',
    'hard_to_maintain': 'Too hard to maintain',
    'schedule_conflict': "Doesn't fit schedule",
    'try_modified': 'Would try modified version',
    'need_more_time': 'Needs more time to see effects',
  };
  
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
  
  const baseDisplay = reasonMap[primaryReason];
  if (!baseDisplay) return null;
  
  // Add follow-up detail if it exists
  if (followUpDetail && followUpLabels[followUpDetail]) {
    return {
      ...baseDisplay,
      detail: followUpLabels[followUpDetail]
    };
  }
  
  return baseDisplay;
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
                    <View style={styles.reasonTextContainer}>
                      <Text style={styles.reasonText}>{rejectionDisplay.label}</Text>
                      {rejectionDisplay.detail && (
                        <Text style={styles.reasonDetail}>• {rejectionDisplay.detail}</Text>
                      )}
                    </View>
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
  reasonTextContainer: {
    flex: 1,
  },
  reasonText: {
    fontSize: 15,
    color: '#424242',
    fontWeight: '500',
  },
  reasonDetail: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
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