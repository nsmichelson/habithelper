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
import { TipAttempt } from '../types/tip';
import { SimplifiedTip } from '../types/simplifiedTip';
import * as Haptics from 'expo-haptics';
import { getRejectionReasonDisplay } from '../data/rejectionReasons';

interface Props {
  tip: SimplifiedTip;
  rejection?: TipAttempt;
  onRequestFeedback: () => void;
  onFindNewTip: () => void;
  savedCount?: number;
  onUseSavedTip?: () => void;
}

// Now using centralized getRejectionReasonDisplay from rejectionReasons.ts

export default function RejectedTipView({ 
  tip, 
  rejection, 
  onRequestFeedback, 
  onFindNewTip,
  savedCount = 0,
  onUseSavedTip,
}: Props) {
  const displayInfo = getRejectionReasonDisplay(rejection?.rejection_reason);
  const hasReason = !!rejection?.rejection_reason;
  
  const handleRequestFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRequestFeedback();
  };
  
  const handleFindNewTip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFindNewTip();
  };
  
  const handleUseSavedTip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUseSavedTip?.();
  };
  
  const hasSaved = savedCount > 0;
  
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
                {displayInfo && (
                  <>
                    <Text style={styles.reasonEmoji}>{displayInfo.primary.emoji}</Text>
                    <View style={styles.reasonTextContainer}>
                      <Text style={styles.reasonText}>{displayInfo.primary.label}</Text>
                      {displayInfo.followUp && (
                        <Text style={styles.reasonDetail}>• {displayInfo.followUp.label}</Text>
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
        
        {/* Main Action Button - changes based on saved tips */}
        {hasSaved ? (
          <TouchableOpacity
            style={styles.newTipButton}
            onPress={handleUseSavedTip}
            activeOpacity={0.7}
          >
            <Ionicons name="bookmarks-outline" size={20} color="#FFFFFF" />
            <Text style={styles.newTipButtonText}>Try a tip saved from earlier</Text>
            {savedCount > 1 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{savedCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          // No saved tips - show message to wait until tomorrow
          <View style={styles.noMoreTipsContainer}>
            <View style={styles.waitMessage}>
              <Ionicons name="time-outline" size={24} color="#757575" />
              <Text style={styles.waitTitle}>That's it for today!</Text>
              <Text style={styles.waitText}>
                Come back tomorrow for your next experiment. Taking it one day at a time helps build lasting habits.
              </Text>
            </View>
            
            {/* Optional: Add a tip to save experiments for later */}
            <View style={styles.tipBox}>
              <Ionicons name="bulb-outline" size={16} color="#FF9800" />
              <Text style={styles.tipText}>
                Tip: Choose "Maybe later" on experiments you'd like to try in the future
              </Text>
            </View>
          </View>
        )}
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
  badge: {
    marginLeft: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  noMoreTipsContainer: {
    marginTop: 16,
  },
  waitMessage: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  waitTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#424242',
    marginTop: 8,
    marginBottom: 8,
  },
  waitText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    lineHeight: 18,
  },
});