import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TipRecommendationService } from '../services/tipRecommendation';
import { UserProfile } from '../types/tip';

/**
 * Test UI Component to visualize how recommendations work
 * Add this to your app to see recommendations for different user profiles
 */

// Test profiles
const TEST_PROFILES = {
  sarah: {
    name: 'Sarah',
    description: 'Restaurant lover who hates veggies',
    profile: {
      primary_focus: 'eating',
      goals: ['more_veggies', 'less_sugar'],
      preferences: ['restaurant_friends', 'coffee_shops', 'walking', 'podcasts_audiobooks'],
      specific_challenges: {
        eating: ['hate_veggies', 'love_sweets', 'social_events', 'no_time_cook']
      },
      avoid_approaches: ['meal_prep', 'counting', 'complex_recipes'],
      lifestyle: {
        chaos_level: 'flexible',
        life_role: 'professional'
      },
      success_vision: 'I want to enjoy eating healthier without feeling restricted',
    } as UserProfile,
  },
  mike: {
    name: 'Mike',
    description: 'Busy parent who wants to exercise',
    profile: {
      primary_focus: 'exercise',
      goals: ['start_moving', 'energy', 'consistency'],
      preferences: ['playing_kids_pets', 'nature_outdoors', 'music_listening', 'spontaneous_adventures'],
      specific_challenges: {
        exercise: ['no_time', 'too_tired', 'hate_gym', 'no_childcare']
      },
      avoid_approaches: ['gym', 'long_workouts', 'morning_routine'],
      lifestyle: {
        chaos_level: 'total_chaos',
        life_role: 'parent_young'
      },
      success_vision: 'Feel energized and set a good example for my kids',
    } as UserProfile,
  },
  alex: {
    name: 'Alex',
    description: 'Night owl with sleep issues',
    profile: {
      primary_focus: 'sleeping',
      goals: ['fall_asleep', 'consistent_schedule', 'wake_refreshed'],
      preferences: ['reading', 'podcasts_audiobooks', 'games_video', 'cozy_comfort', 'solo_time'],
      specific_challenges: {
        sleeping: ['racing_mind', 'phone_addiction', 'revenge_bedtime', 'netflix_binge']
      },
      avoid_approaches: ['meditation', 'morning_routine', 'rigid_rules'],
      lifestyle: {
        chaos_level: 'mostly_routine',
        life_role: 'remote_worker'
      },
      success_vision: 'Actually feel rested and stop being exhausted all day',
    } as UserProfile,
  },
  jamie: {
    name: 'Jamie',
    description: 'Creative person with productivity issues',
    profile: {
      primary_focus: 'productivity',
      goals: ['procrastination', 'finish_tasks', 'less_overwhelm'],
      preferences: ['creative_projects', 'music_listening', 'coffee_shops', 'spontaneous_adventures'],
      specific_challenges: {
        productivity: ['procrastination', 'perfectionism', 'distractions', 'overwhelming_tasks']
      },
      avoid_approaches: ['rigid_rules', 'detailed_tracking', 'morning_routine'],
      lifestyle: {
        chaos_level: 'unpredictable',
        life_role: 'entrepreneur'
      },
      success_vision: 'Actually finish my creative projects without the stress',
    } as UserProfile,
  },
};

export default function TestRecommendations() {
  const [selectedProfile, setSelectedProfile] = useState('sarah');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [selectedProfile]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const service = new TipRecommendationService();
      const profile = TEST_PROFILES[selectedProfile as keyof typeof TEST_PROFILES].profile;

      const recs = await service.recommendTips(
        profile,
        [], // No previous tips
        [], // No attempts
        new Date(),
        false // Not relaxed mode
      );

      setRecommendations(recs.slice(0, 10)); // Top 10 recommendations
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
    setLoading(false);
  };

  const currentTestProfile = TEST_PROFILES[selectedProfile as keyof typeof TEST_PROFILES];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4A90E2', '#7B68EE']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Test Recommendation Algorithm</Text>
            <Text style={styles.subtitle}>
              See how different user profiles get personalized tips
            </Text>
          </View>

          {/* Profile Selector */}
          <View style={styles.profileSelector}>
            <Text style={styles.sectionTitle}>Select Test Profile:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Object.entries(TEST_PROFILES).map(([key, data]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.profileCard,
                    selectedProfile === key && styles.profileCardActive
                  ]}
                  onPress={() => setSelectedProfile(key)}
                >
                  <Text style={[
                    styles.profileName,
                    selectedProfile === key && styles.profileNameActive
                  ]}>
                    {data.name}
                  </Text>
                  <Text style={[
                    styles.profileDesc,
                    selectedProfile === key && styles.profileDescActive
                  ]}>
                    {data.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Profile Details */}
          <View style={styles.profileDetails}>
            <Text style={styles.sectionTitle}>Profile Details:</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Focus:</Text>
              <Text style={styles.detailValue}>{currentTestProfile.profile.primary_focus}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Loves:</Text>
              <View style={styles.chipContainer}>
                {currentTestProfile.profile.preferences?.slice(0, 3).map((pref, i) => (
                  <View key={i} style={styles.chip}>
                    <Text style={styles.chipText}>{pref.replace(/_/g, ' ')}</Text>
                  </View>
                ))}
                {(currentTestProfile.profile.preferences?.length || 0) > 3 && (
                  <Text style={styles.moreText}>+{currentTestProfile.profile.preferences!.length - 3} more</Text>
                )}
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Challenges:</Text>
              <View style={styles.chipContainer}>
                {currentTestProfile.profile.specific_challenges?.[currentTestProfile.profile.primary_focus]?.slice(0, 3).map((challenge, i) => (
                  <View key={i} style={[styles.chip, styles.challengeChip]}>
                    <Text style={styles.chipText}>{challenge.replace(/_/g, ' ')}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Avoids:</Text>
              <View style={styles.chipContainer}>
                {currentTestProfile.profile.avoid_approaches?.slice(0, 3).map((avoid, i) => (
                  <View key={i} style={[styles.chip, styles.avoidChip]}>
                    <Text style={styles.chipText}>{avoid.replace(/_/g, ' ')}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Recommendations */}
          <View style={styles.recommendations}>
            <Text style={styles.sectionTitle}>
              Top Recommendations {loading && '(Loading...)'}
            </Text>

            {recommendations.map((rec, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recommendationCard}
                onPress={() => setShowDetails(showDetails === index ? null : index)}
              >
                <View style={styles.recHeader}>
                  <View style={styles.recNumber}>
                    <Text style={styles.recNumberText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.recContent}>
                    <Text style={styles.recTitle}>{rec.tip.summary}</Text>
                    <View style={styles.scoreContainer}>
                      <View style={styles.scoreBar}>
                        <View
                          style={[styles.scoreFill, { width: `${Math.min(100, rec.score)}%` }]}
                        />
                      </View>
                      <Text style={styles.scoreText}>{rec.score.toFixed(1)}</Text>
                    </View>
                  </View>
                  <Ionicons
                    name={showDetails === index ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="rgba(255,255,255,0.7)"
                  />
                </View>

                {showDetails === index && (
                  <View style={styles.recDetails}>
                    <Text style={styles.recReasonsTitle}>Why this was recommended:</Text>
                    {rec.reasons.map((reason: string, i: number) => (
                      <View key={i} style={styles.reasonRow}>
                        <Text style={styles.reasonBullet}>•</Text>
                        <Text style={styles.reasonText}>{reason}</Text>
                      </View>
                    ))}

                    {rec.tip.features && rec.tip.features.length > 0 && (
                      <View style={styles.featuresContainer}>
                        <Text style={styles.featuresTitle}>Features:</Text>
                        <View style={styles.chipContainer}>
                          {rec.tip.features.slice(0, 5).map((feature: string, i: number) => (
                            <View key={i} style={styles.featureChip}>
                              <Text style={styles.featureChipText}>{feature}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>How Scoring Works:</Text>
            <Text style={styles.legendText}>
              • <Text style={styles.bold}>30%</Text> - Uses activities they love
            </Text>
            <Text style={styles.legendText}>
              • <Text style={styles.bold}>20%</Text> - Addresses their blockers
            </Text>
            <Text style={styles.legendText}>
              • <Text style={styles.bold}>20%</Text> - Matches their goals
            </Text>
            <Text style={styles.legendText}>
              • <Text style={styles.bold}>30%</Text> - Other factors (time, effort, novelty)
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  profileSelector: {
    padding: 20,
    paddingTop: 10,
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    minWidth: 150,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  profileCardActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderColor: '#FFF',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  profileNameActive: {
    color: '#FFF',
  },
  profileDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  profileDescActive: {
    color: 'rgba(255,255,255,0.9)',
  },
  profileDetails: {
    padding: 20,
    paddingTop: 0,
  },
  detailRow: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  challengeChip: {
    backgroundColor: 'rgba(255,165,0,0.3)',
  },
  avoidChip: {
    backgroundColor: 'rgba(255,0,0,0.2)',
  },
  chipText: {
    fontSize: 12,
    color: '#FFF',
  },
  moreText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
    marginLeft: 5,
  },
  recommendations: {
    padding: 20,
    paddingTop: 0,
  },
  recommendationCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recNumber: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recNumberText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 10,
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#4ADE80',
    borderRadius: 2,
  },
  scoreText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    minWidth: 35,
  },
  recDetails: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  recReasonsTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  reasonRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  reasonBullet: {
    color: 'rgba(255,255,255,0.5)',
    marginRight: 8,
  },
  reasonText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },
  featuresContainer: {
    marginTop: 10,
  },
  featuresTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  featureChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featureChipText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  legend: {
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  legendText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
    lineHeight: 18,
  },
  bold: {
    fontWeight: 'bold',
    color: '#FFF',
  },
});