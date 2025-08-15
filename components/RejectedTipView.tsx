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
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8FBF8']}
        style={styles.card}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.statusBadge}>
            <Ionicons name="close-circle" size={20} color="#E57373" />
            <Text style={styles.statusText}>Not for you</Text>
          </View>
        </View>
        
        {/* Tip Summary */}
        <View style={styles.tipSummaryContainer}>
          <Text style={styles.tipLabel}>TODAY'S EXPERIMENT</Text>
          <Text style={styles.tipSummary}>{tip.summary}</Text>
        </View>
        
        {/* Rejection Reason or Prompt */}
        {hasReason ? (
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonLabel}>Why it didn't work:</Text>
            <View style={styles.reasonCard}>
              {rejectionDisplay && (
                <>
                  <Text style={styles.reasonEmoji}>{rejectionDisplay.emoji}</Text>
                  <Text style={styles.reasonText}>{rejectionDisplay.label}</Text>
                </>
              )}
            </View>
            
            {/* Reflection prompt */}
            <View style={styles.reflectionContainer}>
              <Text style={styles.reflectionTitle}>Reflection</Text>
              <Text style={styles.reflectionText}>
                That's totally okay! Not every experiment works for everyone. 
                {rejection?.rejection_reason?.includes('taste') && " Your taste preferences are unique and valid."}
                {rejection?.rejection_reason?.includes('time') && " Time constraints are real and important to respect."}
                {rejection?.rejection_reason?.includes('expensive') && " Budget considerations matter."}
                {rejection?.rejection_reason?.includes('cooking') && " Cooking skills can be built over time when you're ready."}
                {!rejection?.rejection_reason?.includes('taste') && 
                 !rejection?.rejection_reason?.includes('time') && 
                 !rejection?.rejection_reason?.includes('expensive') && 
                 !rejection?.rejection_reason?.includes('cooking') && 
                 " Every bit of feedback helps us find better experiments for you."}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noReasonContainer}>
            <View style={styles.promptCard}>
              <Ionicons name="help-circle-outline" size={32} color="#4CAF50" />
              <Text style={styles.promptTitle}>Help us understand</Text>
              <Text style={styles.promptText}>
                What made this experiment not right for you? Your feedback helps us find better matches.
              </Text>
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={handleRequestFeedback}
                activeOpacity={0.7}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
                <Text style={styles.feedbackButtonText}>Share Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Action Button */}
        <TouchableOpacity
          style={styles.newTipButton}
          onPress={handleFindNewTip}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh-outline" size={20} color="#4CAF50" />
          <Text style={styles.newTipButtonText}>Find Another Experiment</Text>
        </TouchableOpacity>
        
        {/* Encouragement */}
        <View style={styles.encouragementContainer}>
          <Text style={styles.encouragementText}>
            Remember: Finding what works is a journey of discovery. Each "not for me" brings you closer to what will work! 🌟
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E57373',
    marginLeft: 6,
  },
  tipSummaryContainer: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tipLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  tipSummary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    lineHeight: 26,
  },
  reasonContainer: {
    marginBottom: 24,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 12,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  reasonEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  reasonText: {
    fontSize: 16,
    color: '#424242',
    flex: 1,
    fontWeight: '500',
  },
  reflectionContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 16,
  },
  reflectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#616161',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reflectionText: {
    fontSize: 14,
    color: '#616161',
    lineHeight: 20,
  },
  noReasonContainer: {
    marginBottom: 24,
  },
  promptCard: {
    backgroundColor: '#E8F5E9',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 12,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 14,
    color: '#424242',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  feedbackButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  newTipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 28,
    marginBottom: 20,
  },
  newTipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    marginLeft: 8,
  },
  encouragementContainer: {
    backgroundColor: '#FFF9C4',
    padding: 16,
    borderRadius: 16,
  },
  encouragementText: {
    fontSize: 13,
    color: '#795548',
    textAlign: 'center',
    lineHeight: 19,
    fontStyle: 'italic',
  },
});