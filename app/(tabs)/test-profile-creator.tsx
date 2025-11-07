import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

import OnboardingQuizNew from '@/components/OnboardingQuizNew';
import StorageService from '@/services/storage';
import { TestProfileDefinition } from '@/types/testProfile';
import { UserProfile } from '@/types/tip';

const formatList = (values?: string[]) => {
  if (!values || values.length === 0) {
    return '—';
  }
  return values
    .map(value => value.replace(/_/g, ' '))
    .map(value => value.charAt(0).toUpperCase() + value.slice(1))
    .join(', ');
};

export default function TestProfileCreatorScreen() {
  const router = useRouter();
  const [quizProfile, setQuizProfile] = useState<UserProfile | null>(null);
  const [profileName, setProfileName] = useState('');
  const [profileDescription, setProfileDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedProfileId, setSavedProfileId] = useState<string | null>(null);

  const focusAreaLabel = useMemo(() => {
    if (!quizProfile?.primary_focus) {
      return '—';
    }
    const label = quizProfile.primary_focus.replace(/_/g, ' ');
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, [quizProfile?.primary_focus]);

  const handleQuizComplete = (profile: UserProfile) => {
    setQuizProfile(profile);
    setError(null);
  };

  const resetCreator = () => {
    setQuizProfile(null);
    setProfileName('');
    setProfileDescription('');
    setSaving(false);
    setError(null);
    setSavedProfileId(null);
  };

  const handleSaveProfile = async () => {
    if (!quizProfile) {
      return;
    }

    const trimmedName = profileName.trim();
    const trimmedDescription = profileDescription.trim();

    if (!trimmedName || !trimmedDescription) {
      setError('Please add both a name and a short description.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const timestamp = new Date().toISOString();
      const profileId = quizProfile.id || `test-user-${Date.now()}`;
      const enhancedProfile: UserProfile = {
        onboarding_completed: true,
        ...quizProfile,
        id: profileId,
        created_at: (quizProfile as any).created_at || timestamp,
        updated_at: timestamp,
      };

      const testProfile: TestProfileDefinition = {
        id: `custom-${Date.now()}`,
        name: trimmedName,
        description: trimmedDescription,
        profile: enhancedProfile,
        createdAt: timestamp,
        source: 'custom',
      };

      await StorageService.addTestProfile(testProfile);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSavedProfileId(testProfile.id);
    } catch (err) {
      console.error('Error saving test profile', err);
      setError('Something went wrong while saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!quizProfile) {
    return (
      <OnboardingQuizNew
        onComplete={handleQuizComplete}
        shouldPersistProfile={false}
      />
    );
  }

  if (savedProfileId) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#4A90E2', '#7B68EE']} style={styles.gradient}>
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#FFF" style={styles.successIcon} />
            <Text style={styles.successTitle}>Test profile saved!</Text>
            <Text style={styles.successSubtitle}>
              “{profileName.trim()}” will now appear in the Test tab alongside the built-in profiles.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(tabs)/test')}>
              <Text style={styles.primaryButtonText}>Go to Test Tab</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={resetCreator}>
              <Text style={styles.secondaryButtonText}>Create Another Profile</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient colors={['#4A90E2', '#7B68EE']} style={styles.gradient}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={resetCreator}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Name This Test Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quiz Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Focus Area</Text>
                <Text style={styles.summaryValue}>{focusAreaLabel}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Goals</Text>
                <Text style={styles.summaryValue}>{formatList((quizProfile as any).quiz_goals || quizProfile.goals)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Loves</Text>
                <Text style={styles.summaryValue}>{formatList(quizProfile.preferences)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Avoid</Text>
                <Text style={styles.summaryValue}>{formatList((quizProfile as any).avoid_approaches)}</Text>
              </View>

              {quizProfile.success_vision && (
                <View style={styles.summaryRowColumn}>
                  <Text style={styles.summaryLabel}>Success Vision</Text>
                  <Text style={styles.summaryValue}>{Array.isArray(quizProfile.success_vision) ? quizProfile.success_vision.join(' ') : quizProfile.success_vision}</Text>
                </View>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Add Test Profile Details</Text>
              <Text style={styles.cardDescription}>
                Give this profile a memorable name and quick summary so you can find it easily when testing recommendations.
              </Text>

              <Text style={styles.inputLabel}>Profile Name</Text>
              <TextInput
                style={styles.input}
                value={profileName}
                onChangeText={setProfileName}
                placeholder="e.g. Jules, Chaos Parent, Night Owl"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />

              <Text style={styles.inputLabel}>Short Description</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={profileDescription}
                onChangeText={setProfileDescription}
                placeholder="Briefly describe their vibe so you remember why you created them..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.primaryButton, saving && styles.disabledButton]}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                <Text style={styles.primaryButtonText}>{saving ? 'Saving…' : 'Save Test Profile'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryRowColumn: {
    marginBottom: 12,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  summaryValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
  },
  inputLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 12,
    padding: 14,
    color: '#FFF',
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 90,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorText: {
    color: '#FFD7D7',
    marginTop: 12,
    fontSize: 14,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
});
