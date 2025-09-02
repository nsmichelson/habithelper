import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Award, AwardProgress } from '../types/awards';
import AwardCard from './AwardCard';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AwardsModalProps {
  visible: boolean;
  onClose: () => void;
  allAwards: Award[];
  earnedAwards: Award[];
  awardProgress: AwardProgress[];
  newAwardIds?: string[];
}

type TabType = 'all' | 'earned' | 'progress';

export default function AwardsModal({
  visible,
  onClose,
  allAwards,
  earnedAwards,
  awardProgress,
  newAwardIds = [],
}: AwardsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const getFilteredAwards = () => {
    const earnedIds = earnedAwards.map(a => a.id);
    
    switch (activeTab) {
      case 'earned':
        return earnedAwards;
      
      case 'progress':
        const progressIds = awardProgress.map(p => p.awardId);
        return allAwards.filter(a => 
          progressIds.includes(a.id) && !earnedIds.includes(a.id)
        );
      
      case 'all':
      default:
        // Show all non-secret awards, earned first
        const visibleAwards = allAwards.filter(a => !a.isSecret);
        const earned = visibleAwards.filter(a => earnedIds.includes(a.id));
        const unearned = visibleAwards.filter(a => !earnedIds.includes(a.id));
        return [...earned, ...unearned];
    }
  };

  const filteredAwards = getFilteredAwards();
  const earnedCount = earnedAwards.length;
  const totalCount = allAwards.filter(a => !a.isSecret).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak': return '🔥';
      case 'speed': return '⚡';
      case 'comeback': return '🔄';
      case 'goal_progress': return '🎯';
      case 'exploration': return '🗺️';
      case 'consistency': return '📅';
      case 'milestone': return '🏆';
      case 'special': return '⭐';
      default: return '🏅';
    }
  };

  // Group awards by category
  const groupedAwards = filteredAwards.reduce((acc, award) => {
    if (!acc[award.category]) {
      acc[award.category] = [];
    }
    acc[award.category].push(award);
    return acc;
  }, {} as Record<string, Award[]>);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#424242" />
          </TouchableOpacity>
          
          <Text style={styles.title}>Awards & Achievements</Text>
          
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {earnedCount}/{totalCount} Earned
            </Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All Awards
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'earned' && styles.activeTab]}
            onPress={() => setActiveTab('earned')}
          >
            <Text style={[styles.tabText, activeTab === 'earned' && styles.activeTabText]}>
              Earned ({earnedCount})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
            onPress={() => setActiveTab('progress')}
          >
            <Text style={[styles.tabText, activeTab === 'progress' && styles.activeTabText]}>
              In Progress
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(groupedAwards).map(([category, awards]) => (
            <View key={category} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>
                  {getCategoryIcon(category)}
                </Text>
                <Text style={styles.categoryTitle}>
                  {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
                <Text style={styles.categoryCount}>
                  ({awards.filter(a => earnedAwards.some(e => e.id === a.id)).length}/{awards.length})
                </Text>
              </View>
              
              {awards.map(award => {
                const isEarned = earnedAwards.some(e => e.id === award.id);
                const progress = awardProgress.find(p => p.awardId === award.id);
                const isNew = newAwardIds.includes(award.id);
                
                return (
                  <AwardCard
                    key={award.id}
                    award={award}
                    isEarned={isEarned}
                    progress={progress}
                    isNew={isNew}
                  />
                );
              })}
            </View>
          ))}
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  statsContainer: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    marginTop: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#424242',
    flex: 1,
  },
  categoryCount: {
    fontSize: 12,
    color: '#757575',
  },
  bottomPadding: {
    height: 40,
  },
});