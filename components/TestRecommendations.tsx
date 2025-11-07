import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { getTipGoalsForQuizGoals } from '../data/goalMappings';
import { useFocusEffect } from '@react-navigation/native';
import StorageService from '@/services/storage';
import { TestProfileDefinition } from '@/types/testProfile';

/**
 * Test UI Component to visualize how recommendations work
 * Add this to your app to see recommendations for different user profiles
 */

// Built-in test profiles always available
const BUILT_IN_TEST_PROFILES: TestProfileDefinition[] = [
  {
    id: 'sarah',
    name: 'Sarah',
    description: 'Restaurant lover who hates veggies',
    createdAt: 'built-in',
    source: 'built-in',
    profile: {
      primary_focus: 'eating',
      quiz_goals: ['eat_more_veggies', 'reduce_sugar', 'healthier_restaurant_choices'],
      goals: getTipGoalsForQuizGoals(['eat_more_veggies', 'reduce_sugar', 'healthier_restaurant_choices']),
      preferences: ['restaurant_friends', 'coffee_shops', 'walking', 'podcasts_audiobooks'],
      specific_challenges: {
        eating: ['hate_veggies', 'love_sweets', 'social_events', 'no_time_cook'],
      },
      avoid_approaches: ['meal_prep', 'counting', 'complex_recipes'],
      lifestyle: {
        chaos_level: 'flexible',
        life_role: 'professional',
      },
      success_vision: 'I want to enjoy eating healthier without feeling restricted',
    } as UserProfile,
  },
  {
    id: 'mike',
    name: 'Mike',
    description: 'Busy parent who wants to exercise',
    createdAt: 'built-in',
    source: 'built-in',
    profile: {
      primary_focus: 'exercise',
      quiz_goals: ['start_exercising', 'exercise_for_energy', 'consistent_workouts'],
      goals: getTipGoalsForQuizGoals(['start_exercising', 'exercise_for_energy', 'consistent_workouts']),
      preferences: ['playing_kids_pets', 'nature_outdoors', 'music_listening', 'spontaneous_adventures'],
      specific_challenges: {
        exercise: ['no_time', 'too_tired', 'hate_gym', 'no_childcare'],
      },
      avoid_approaches: ['gym', 'long_workouts', 'morning_routine'],
      lifestyle: {
        chaos_level: 'total_chaos',
        life_role: 'parent_young',
      },
      success_vision: 'Feel energized and set a good example for my kids',
    } as UserProfile,
  },
  {
    id: 'alex',
    name: 'Alex',
    description: 'Night owl with sleep issues',
    createdAt: 'built-in',
    source: 'built-in',
    profile: {
      primary_focus: 'sleeping',
      quiz_goals: ['fall_asleep_easier', 'consistent_sleep_schedule', 'wake_up_refreshed'],
      goals: getTipGoalsForQuizGoals(['fall_asleep_easier', 'consistent_sleep_schedule', 'wake_up_refreshed']),
      preferences: ['reading', 'podcasts_audiobooks', 'games_video', 'cozy_comfort', 'solo_time'],
      specific_challenges: {
        sleeping: ['racing_mind', 'phone_addiction', 'revenge_bedtime', 'netflix_binge'],
      },
      avoid_approaches: ['meditation', 'morning_routine', 'rigid_rules'],
      lifestyle: {
        chaos_level: 'mostly_routine',
        life_role: 'remote_worker',
      },
      success_vision: 'Actually feel rested and stop being exhausted all day',
    } as UserProfile,
  },
  {
    id: 'jamie',
    name: 'Jamie',
    description: 'Creative person with productivity issues',
    createdAt: 'built-in',
    source: 'built-in',
    profile: {
      primary_focus: 'productivity',
      quiz_goals: ['stop_procrastinating', 'finish_what_start', 'reduce_overwhelm'],
      goals: getTipGoalsForQuizGoals(['stop_procrastinating', 'finish_what_start', 'reduce_overwhelm']),
      preferences: ['creative_projects', 'music_listening', 'coffee_shops', 'spontaneous_adventures'],
      specific_challenges: {
        productivity: ['procrastination', 'perfectionism', 'distractions', 'overwhelming_tasks'],
      },
      avoid_approaches: ['rigid_rules', 'detailed_tracking', 'morning_routine'],
      lifestyle: {
        chaos_level: 'unpredictable',
        life_role: 'entrepreneur',
      },
      success_vision: 'Actually finish my creative projects without the stress',
    } as UserProfile,
  },
];

export default function TestRecommendations() {
  const [customProfiles, setCustomProfiles] = useState<TestProfileDefinition[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    BUILT_IN_TEST_PROFILES[0]?.id ?? ''
  );
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState<number | null>(null);

  const allProfiles = useMemo(
    () => [...BUILT_IN_TEST_PROFILES, ...customProfiles],
    [customProfiles]
  );

  useEffect(() => {
    if (!selectedProfileId && allProfiles.length > 0) {
      setSelectedProfileId(allProfiles[0].id);
    }
  }, [allProfiles, selectedProfileId]);

  useEffect(() => {
    if (allProfiles.length === 0) {
      return;
    }
    const exists = allProfiles.some(profile => profile.id === selectedProfileId);
    if (!exists) {
      setSelectedProfileId(allProfiles[0].id);
    }
  }, [allProfiles, selectedProfileId]);

  const selectedProfile = useMemo(
    () => allProfiles.find(profile => profile.id === selectedProfileId) ?? allProfiles[0],
    [allProfiles, selectedProfileId]
  );

  const loadRecommendations = useCallback(async (profileEntry?: TestProfileDefinition) => {
    if (!profileEntry) {
      setRecommendations([]);
      return;
    }

    setLoading(true);
    try {
      const service = new TipRecommendationService();
      const recs = await service.recommendTips(
        profileEntry.profile,
        [],
        [],
        new Date(),
        false
      );

      console.log(`=== Loaded ${recs.length} recommendations for ${profileEntry.name} (${profileEntry.id}) ===`);
      console.log('Top 5 recommendations:');
      recs.slice(0, 5).forEach((rec, i) => {
        console.log(`${i + 1}. "${rec.tip.summary}"`);
        console.log(`   Score: ${rec.score}, Goals: ${rec.tip.goals?.slice(0, 2).join(', ')}...`);
        if (rec._debugInfo) {
          const hasMatches =
            rec._debugInfo.matchedGoals.length > 0 ||
            rec._debugInfo.matchedPreferences.length > 0 ||
            rec._debugInfo.addressedBlockers.length > 0;
          if (hasMatches) {
            console.log(
              `   Matched: goals=${rec._debugInfo.matchedGoals.length}, prefs=${rec._debugInfo.matchedPreferences.length}, blockers=${rec._debugInfo.addressedBlockers.length}`
            );
          }
        }
      });

      setRecommendations(recs.slice(0, 10));
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRecommendations(selectedProfile);
  }, [selectedProfile, loadRecommendations]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadCustomProfiles = async () => {
        try {
          const storedProfiles = await StorageService.getTestProfiles();
          if (isMounted) {
            setCustomProfiles(storedProfiles);
          }
        } catch (error) {
          console.error('Error loading stored test profiles:', error);
        }
      };

      loadCustomProfiles();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const currentTestProfile = selectedProfile;

  if (!currentTestProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#4A90E2', '#7B68EE']} style={styles.gradient}>
          <View style={styles.header}>
            <Text style={styles.title}>Test Recommendation Algorithm</Text>
            <Text style={styles.subtitle}>
              Create a test profile to see personalized recommendations.
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

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
              {allProfiles.map(profile => (
                <TouchableOpacity
                  key={profile.id}
                  style={[
                    styles.profileCard,
                    selectedProfileId === profile.id && styles.profileCardActive,
                  ]}
                  onPress={() => setSelectedProfileId(profile.id)}
                >
                  <View style={styles.profileCardHeader}>
                    <Text
                      style={[
                        styles.profileName,
                        selectedProfileId === profile.id && styles.profileNameActive,
                      ]}
                    >
                      {profile.name}
                    </Text>
                    {profile.source === 'custom' && (
                      <View style={styles.customBadge}>
                        <Text style={styles.customBadgeText}>Custom</Text>
                      </View>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.profileDesc,
                      selectedProfileId === profile.id && styles.profileDescActive,
                    ]}
                  >
                    {profile.description}
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
                          style={[styles.scoreFill, { width: `${Math.min(100, rec.score || 0)}%` }]}
                        />
                      </View>
                      <Text style={styles.scoreText}>{rec.score ? rec.score.toFixed(1) : '0'}</Text>
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
                    {/* Debug Info Section - Shows exact coded values */}
                    {rec._debugInfo && (
                      <View style={styles.debugSection}>
                        <Text style={styles.debugTitle}>🔍 Debug: How this tip scored {rec.score ? rec.score.toFixed(1) : '0'} points</Text>

                        {/* Matched Preferences */}
                        {rec._debugInfo.matchedPreferences.length > 0 && (
                          <View style={styles.debugRow}>
                            <Text style={styles.debugLabel}>✅ Matched Preferences ({rec._debugInfo.scoreBreakdown.preferences.score.toFixed(1)} pts):</Text>
                            <View style={styles.codeChipContainer}>
                              {rec._debugInfo.matchedPreferences.map((pref: string, i: number) => (
                                <View key={i} style={styles.codeChip}>
                                  <Text style={styles.codeChipText}>{pref}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* Addressed Blockers */}
                        {rec._debugInfo.addressedBlockers.length > 0 && (
                          <View style={styles.debugRow}>
                            <Text style={styles.debugLabel}>🎯 Addressed Blockers ({rec._debugInfo.scoreBreakdown.blockers.score.toFixed(1)} pts):</Text>
                            <View style={styles.codeChipContainer}>
                              {rec._debugInfo.addressedBlockers.map((blocker: string, i: number) => (
                                <View key={i} style={[styles.codeChip, styles.blockerChip]}>
                                  <Text style={styles.codeChipText}>{blocker}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* Matched Goals */}
                        {rec._debugInfo.matchedGoals.length > 0 && (
                          <View style={styles.debugRow}>
                            <Text style={styles.debugLabel}>🎯 Matched Goals ({rec._debugInfo.scoreBreakdown.goals.score.toFixed(1)} pts):</Text>
                            <View style={styles.codeChipContainer}>
                              {rec._debugInfo.matchedGoals.map((goal: string, i: number) => (
                                <View key={i} style={[styles.codeChip, styles.goalChip]}>
                                  <Text style={styles.codeChipText}>{goal}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* Avoided Items (Penalties) */}
                        {rec._debugInfo.avoidedItems.length > 0 && (
                          <View style={styles.debugRow}>
                            <Text style={[styles.debugLabel, styles.penaltyLabel]}>
                              ⚠️ Violated Avoidances ({rec._debugInfo.scoreBreakdown.avoidance.score.toFixed(1)} pts):
                            </Text>
                            <View style={styles.codeChipContainer}>
                              {rec._debugInfo.avoidedItems.map((avoid: string, i: number) => (
                                <View key={i} style={[styles.codeChip, styles.avoidChip]}>
                                  <Text style={styles.codeChipText}>{avoid}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* Other Score Components */}
                        <View style={styles.debugRow}>
                          <Text style={styles.debugLabel}>📊 Other Factors:</Text>
                          <View style={styles.otherScores}>
                            {Object.entries(rec._debugInfo.scoreBreakdown.other).map(([key, value]: [string, any]) => {
                              if (value > 0.1) {
                                return (
                                  <Text key={key} style={styles.otherScoreText}>
                                    • {key}: +{value.toFixed(1)}
                                  </Text>
                                );
                              }
                              return null;
                            })}
                          </View>
                        </View>

                        {/* Tip Goals - What this tip is designed to achieve */}
                        <View style={styles.debugRow}>
                          <Text style={styles.debugLabel}>🎯 Tip's Target Goals:</Text>
                          <View style={styles.codeChipContainer}>
                            {rec.tip.goals && rec.tip.goals.map((goal: string, i: number) => {
                              const isMatched = rec._debugInfo.matchedGoals.includes(goal);
                              return (
                                <View key={i} style={[
                                  styles.codeChip,
                                  isMatched ? styles.goalMatchedChip : styles.goalUnmatchedChip
                                ]}>
                                  <Text style={styles.codeChipText}>
                                    {isMatched && '✓ '}{goal}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        </View>

                        {/* Tip Features/Involves (for reference) */}
                        <View style={styles.debugRow}>
                          <Text style={styles.debugLabel}>📌 Other Properties:</Text>
                          <View style={styles.tipPropsContainer}>
                            {rec.tip.features && rec.tip.features.length > 0 && (
                              <Text style={styles.tipPropText}>
                                Features: {rec.tip.features.join(', ')}
                              </Text>
                            )}
                            {rec.tip.involves && rec.tip.involves.length > 0 && (
                              <Text style={styles.tipPropText}>
                                Involves: {rec.tip.involves.join(', ')}
                              </Text>
                            )}
                            {rec.tip.mechanisms && rec.tip.mechanisms.length > 0 && (
                              <Text style={styles.tipPropText}>
                                Mechanisms: {rec.tip.mechanisms.join(', ')}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    )}

                    {/* Original reasons section */}
                    <View style={styles.reasonsSection}>
                      <Text style={styles.recReasonsTitle}>Summary:</Text>
                      {rec.reasons.map((reason: string, i: number) => (
                        <View key={i} style={styles.reasonRow}>
                          <Text style={styles.reasonBullet}>•</Text>
                          <Text style={styles.reasonText}>{reason}</Text>
                        </View>
                      ))}
                    </View>
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
  profileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  customBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  customBadgeText: {
    color: '#B2F5B4',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
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
  // Debug info styles
  debugSection: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  debugRow: {
    marginBottom: 12,
  },
  debugLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontWeight: '600',
  },
  penaltyLabel: {
    color: '#ff9999',
  },
  codeChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  codeChip: {
    backgroundColor: 'rgba(100,200,100,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100,200,100,0.5)',
  },
  codeChipText: {
    fontSize: 11,
    color: '#FFF',
    fontFamily: 'monospace',
  },
  blockerChip: {
    backgroundColor: 'rgba(255,165,0,0.3)',
    borderColor: 'rgba(255,165,0,0.5)',
  },
  goalChip: {
    backgroundColor: 'rgba(100,150,255,0.3)',
    borderColor: 'rgba(100,150,255,0.5)',
  },
  goalMatchedChip: {
    backgroundColor: 'rgba(76,175,80,0.4)',
    borderColor: 'rgba(76,175,80,0.6)',
  },
  goalUnmatchedChip: {
    backgroundColor: 'rgba(150,150,150,0.2)',
    borderColor: 'rgba(150,150,150,0.3)',
  },
  avoidChip: {
    backgroundColor: 'rgba(255,100,100,0.3)',
    borderColor: 'rgba(255,100,100,0.5)',
  },
  otherScores: {
    marginTop: 5,
  },
  otherScoreText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 10,
    lineHeight: 18,
  },
  tipPropsContainer: {
    marginTop: 5,
  },
  tipPropText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  reasonsSection: {
    marginTop: 10,
  },
});