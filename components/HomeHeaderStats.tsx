import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DailyTip } from '@/types/tip';
import { Award } from '@/types/awards';

interface Props {
  previousTips: DailyTip[];
  dailyTip: DailyTip | null;
  earnedAwards: Award[];
  newAwards: Award[];
  onShowAllExperiments: () => void;
  onShowTriedExperiments: () => void;
  onShowLovedExperiments: () => void;
  onShowAwards: () => void;
}

export default function HomeHeaderStats({
  previousTips,
  dailyTip,
  earnedAwards,
  newAwards,
  onShowAllExperiments,
  onShowTriedExperiments,
  onShowLovedExperiments,
  onShowAwards,
}: Props) {

  // Helper function to get unique tip count
  const getUniqueTipCount = (tips: DailyTip[]) => {
    const uniqueTipIds = new Set(tips.map(t => t.tip_id));
    return uniqueTipIds.size;
  };

  return (
    <View style={styles.statsContainer}>
      <TouchableOpacity
        style={styles.statCard}
        onPress={onShowAllExperiments}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>
          {getUniqueTipCount(previousTips) + (dailyTip && !previousTips.some(t => t.tip_id === dailyTip.tip_id) ? 1 : 0)}
        </Text>
        <Text style={styles.statLabel}>Experiments</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statCard}
        onPress={onShowTriedExperiments}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>
          {getUniqueTipCount(previousTips.filter(tip => tip.user_response === 'try_it')) +
           (dailyTip?.user_response === 'try_it' && !previousTips.some(t => t.tip_id === dailyTip.tip_id && t.user_response === 'try_it') ? 1 : 0)}
        </Text>
        <Text style={styles.statLabel}>Tried</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.statCard}
        onPress={onShowLovedExperiments}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>
          {getUniqueTipCount(previousTips.filter(tip =>
            tip.quick_completions?.some(c => c.quick_note === 'worked_great') ||
            tip.evening_check_in === 'went_great'
          )) +
          ((dailyTip?.quick_completions?.some(c => c.quick_note === 'worked_great') ||
            dailyTip?.evening_check_in === 'went_great') &&
           !previousTips.some(t => t.tip_id === dailyTip.tip_id &&
             (t.quick_completions?.some(c => c.quick_note === 'worked_great') || t.evening_check_in === 'went_great')) ? 1 : 0)}
        </Text>
        <Text style={styles.statLabel}>Loved</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.statCard, styles.awardsCard]}
        onPress={onShowAwards}
        activeOpacity={0.7}
      >
        <Text style={styles.statNumber}>🏆</Text>
        <Text style={styles.statLabel}>{earnedAwards.length}</Text>
        {newAwards.length > 0 && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>{newAwards.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  awardsCard: {
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});
