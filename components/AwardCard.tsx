import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, AwardProgress } from '../types/awards';
import { Ionicons } from '@expo/vector-icons';

interface AwardCardProps {
  award: Award;
  isEarned: boolean;
  progress?: AwardProgress;
  isNew?: boolean;
  compact?: boolean;
}

export default function AwardCard({ 
  award, 
  isEarned, 
  progress, 
  isNew, 
  compact = false 
}: AwardCardProps) {
  const getTierColors = (tier?: string) => {
    switch (tier) {
      case 'diamond':
        return ['#B9F2FF', '#60E1FF', '#00D4FF'];
      case 'platinum':
        return ['#E5E4E2', '#C0C0C0', '#A8A8A8'];
      case 'gold':
        return ['#FFE5B4', '#FFD700', '#FFC125'];
      case 'silver':
        return ['#F5F5F5', '#C0C0C0', '#A8A8A8'];
      case 'bronze':
        return ['#F4E4C1', '#CD7F32', '#B87333'];
      default:
        return ['#E8F5E9', '#A5D6A7', '#66BB6A'];
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return '#FF6B35';
      case 'epic':
        return '#9C27B0';
      case 'rare':
        return '#2196F3';
      case 'uncommon':
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  if (compact) {
    return (
      <View style={[
        styles.compactCard,
        !isEarned && styles.compactCardLocked,
        isNew && styles.compactCardNew
      ]}>
        <Text style={styles.compactIcon}>{isEarned ? award.icon : '🔒'}</Text>
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW!</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, isNew && styles.newContainer]}>
      <LinearGradient
        colors={isEarned ? getTierColors(award.tier) : ['#F5F5F5', '#E0E0E0', '#BDBDBD']}
        style={styles.card}
      >
        {isNew && (
          <View style={styles.newRibbon}>
            <Text style={styles.newRibbonText}>NEW!</Text>
          </View>
        )}

        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{isEarned ? award.icon : '🔒'}</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.name, !isEarned && styles.lockedText]}>
            {award.name}
          </Text>
          
          <Text style={[styles.description, !isEarned && styles.lockedText]}>
            {award.description}
          </Text>

          {!isEarned && progress && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { width: `${progress.percentage}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {progress.currentValue}/{progress.targetValue} {award.progressMessage || ''}
              </Text>
            </View>
          )}

          {isEarned && (
            <View style={styles.earnedContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.earnedText}>Earned!</Text>
            </View>
          )}

          <View style={styles.footer}>
            <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(award.rarity) }]}>
              <Text style={styles.rarityText}>
                {award.rarity.toUpperCase()}
              </Text>
            </View>
            
            {award.tier && (
              <View style={styles.tierBadge}>
                <Text style={styles.tierText}>
                  {award.tier.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  newContainer: {
    transform: [{ scale: 1.02 }],
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  newRibbon: {
    position: 'absolute',
    top: 12,
    right: -8,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    transform: [{ rotate: '12deg' }],
    zIndex: 1,
  },
  newRibbonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 48,
  },
  content: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#616161',
    textAlign: 'center',
    marginBottom: 12,
  },
  lockedText: {
    opacity: 0.6,
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 11,
    color: '#757575',
    textAlign: 'center',
    marginTop: 4,
  },
  earnedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  earnedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '700',
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  tierText: {
    fontSize: 10,
    color: '#424242',
    fontWeight: '600',
  },
  // Compact card styles
  compactCard: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    position: 'relative',
  },
  compactCardLocked: {
    backgroundColor: '#E0E0E0',
  },
  compactCardNew: {
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  compactIcon: {
    fontSize: 32,
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    fontSize: 8,
    color: '#FFF',
    fontWeight: '800',
  },
});