import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DailyTip, TipAttempt } from '../types/tip';
import { QuizResponse } from '../types/quiz';
import AwardService from './awardService';

const STORAGE_KEYS = {
  USER_PROFILE: '@HabitHelper:userProfile',
  DAILY_TIPS: '@HabitHelper:dailyTips',
  TIP_ATTEMPTS: '@HabitHelper:tipAttempts',
  QUIZ_RESPONSES: '@HabitHelper:quizResponses',
  ONBOARDING_COMPLETED: '@HabitHelper:onboardingCompleted',
  LIKED_TIPS: '@HabitHelper:likedTips',
  HABIT_COMPLETIONS: '@HabitHelper:habitCompletions:', // Prefix for daily completion counts
} as const;

class StorageService {
  // User Profile
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!data) return null;
      
      // Parse and convert date strings back to Date objects
      const profile = JSON.parse(data);
      
      // If profile doesn't have quiz_responses, try to load them separately
      if (!profile.quiz_responses) {
        const quizResponses = await this.getQuizResponses();
        if (quizResponses.length > 0) {
          profile.quiz_responses = quizResponses.map(r => ({
            questionId: r.questionId,
            value: r.response?.value || r.response?.values?.[0] || r.response
          }));
        }
      }
      
      return {
        ...profile,
        created_at: new Date(profile.created_at),
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  // Daily Tips
  async getDailyTips(): Promise<DailyTip[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_TIPS);
      if (!data) return [];
      
      // Parse and convert date strings back to Date objects
      const tips = JSON.parse(data);
      const parsedTips = tips.map((tip: any) => ({
        ...tip,
        presented_date: new Date(tip.presented_date),
        responded_at: tip.responded_at ? new Date(tip.responded_at) : undefined,
        check_in_at: tip.check_in_at ? new Date(tip.check_in_at) : undefined,
      }));
      
      // Remove duplicates by keeping only the latest entry for each tip_id on each day
      const uniqueTips = parsedTips.reduce((acc: DailyTip[], tip: DailyTip) => {
        const tipDate = new Date(tip.presented_date).toDateString();
        const existingIndex = acc.findIndex(t => 
          t.tip_id === tip.tip_id && 
          new Date(t.presented_date).toDateString() === tipDate
        );
        
        if (existingIndex >= 0) {
          // Keep the one with more data (e.g., has evening_check_in)
          if ((tip.evening_check_in && !acc[existingIndex].evening_check_in) ||
              (tip.user_response && !acc[existingIndex].user_response)) {
            acc[existingIndex] = tip;
          }
        } else {
          acc.push(tip);
        }
        
        return acc;
      }, []);
      
      // If we removed duplicates, save the cleaned data
      if (uniqueTips.length < parsedTips.length) {
        await AsyncStorage.setItem(STORAGE_KEYS.DAILY_TIPS, JSON.stringify(uniqueTips));
        console.log(`Cleaned up ${parsedTips.length - uniqueTips.length} duplicate daily tips`);
      }
      
      console.log('💾 STORAGE: getDailyTips - Returning', uniqueTips.length, 'unique tips');
      return uniqueTips;
    } catch (error) {
      console.error('💾 STORAGE: Error getting daily tips:', error);
      return [];
    }
  }

  async saveDailyTip(tip: DailyTip): Promise<void> {
    try {
      const tips = await this.getDailyTips();
      tips.push(tip);
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_TIPS, JSON.stringify(tips));
    } catch (error) {
      console.error('Error saving daily tip:', error);
      throw error;
    }
  }

  async updateDailyTip(tipId: string, updates: Partial<DailyTip>): Promise<void> {
    try {
      const tips = await this.getDailyTips();
      const index = tips.findIndex(t => t.id === tipId);
      if (index !== -1) {
        tips[index] = { ...tips[index], ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.DAILY_TIPS, JSON.stringify(tips));
      }
    } catch (error) {
      console.error('Error updating daily tip:', error);
      throw error;
    }
  }

  // Tip Attempts
  async getTipAttempts(): Promise<TipAttempt[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TIP_ATTEMPTS);
      if (!data) return [];
      
      // Parse and convert date strings back to Date objects
      const attempts = JSON.parse(data);
      return attempts.map((attempt: any) => ({
        ...attempt,
        attempted_at: new Date(attempt.attempted_at),
      }));
    } catch (error) {
      console.error('Error getting tip attempts:', error);
      return [];
    }
  }

  async saveTipAttempt(attempt: TipAttempt): Promise<void> {
    try {
      const attempts = await this.getTipAttempts();
      
      // If this is a maybe_later feedback, set snooze_until
      if (attempt.feedback === 'maybe_later' && !attempt.snooze_until) {
        const snoozeDate = new Date();
        snoozeDate.setDate(snoozeDate.getDate() + 7); // Default 7 days
        attempt.snooze_until = snoozeDate.toISOString();
      }
      
      // Check if an attempt for this tip already exists (by tip_id and date)
      const existingIndex = attempts.findIndex(a => {
        if (a.tip_id !== attempt.tip_id) return false;
        
        // If the attempt has an ID and it matches, update it
        if (attempt.id && a.id === attempt.id) return true;
        
        // Check if it's the same day (to prevent duplicate daily attempts)
        const existingDate = new Date(a.attempted_at);
        const newDate = new Date(attempt.attempted_at);
        return existingDate.toDateString() === newDate.toDateString();
      });
      
      if (existingIndex !== -1) {
        // Update existing attempt instead of creating duplicate
        attempts[existingIndex] = {
          ...attempts[existingIndex],
          ...attempt,
          updated_at: new Date().toISOString()
        };
      } else {
        // Add new attempt
        attempts.push(attempt);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.TIP_ATTEMPTS, JSON.stringify(attempts));
    } catch (error) {
      console.error('Error saving tip attempt:', error);
      throw error;
    }
  }

  async getTipAttemptsBefore(before: Date): Promise<TipAttempt[]> {
    try {
      const attempts = await this.getTipAttempts();
      return attempts.filter(a => {
        const attemptDate = a.created_at ? new Date(a.created_at) : new Date(a.attempted_at);
        return attemptDate < before;
      });
    } catch (error) {
      console.error('Error getting tip attempts before date:', error);
      return [];
    }
  }

  // Quiz Responses
  async getQuizResponses(): Promise<QuizResponse[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.QUIZ_RESPONSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting quiz responses:', error);
      return [];
    }
  }

  async saveQuizResponses(responses: QuizResponse[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.QUIZ_RESPONSES, JSON.stringify(responses));
    } catch (error) {
      console.error('Error saving quiz responses:', error);
      throw error;
    }
  }

  // Onboarding
  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed.toString());
    } catch (error) {
      console.error('Error setting onboarding status:', error);
      throw error;
    }
  }

  // Liked Tips
  async getLikedTips(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LIKED_TIPS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting liked tips:', error);
      return [];
    }
  }

  async toggleLikedTip(tipId: string): Promise<boolean> {
    try {
      const likedTips = await this.getLikedTips();
      const index = likedTips.indexOf(tipId);
      
      if (index === -1) {
        likedTips.push(tipId);
      } else {
        likedTips.splice(index, 1);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.LIKED_TIPS, JSON.stringify(likedTips));
      return index === -1; // returns true if tip was added (liked)
    } catch (error) {
      console.error('Error toggling liked tip:', error);
      throw error;
    }
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    try {
      // Get all keys to find habit completion keys
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('🗑️ CLEAR ALL DATA - All AsyncStorage keys:', allKeys);

      // Find all habit completion keys (both new and old format)
      const habitCompletionKeys = allKeys.filter(key =>
        key.startsWith(STORAGE_KEYS.HABIT_COMPLETIONS) || // New format: @HabitHelper:habitCompletions:
        key.startsWith('habit_completions_') // Old format: habit_completions_
      );

      console.log('🗑️ CLEAR ALL DATA - Habit completion keys to clear:', habitCompletionKeys);

      // Remove standard keys
      console.log('🗑️ CLEAR ALL DATA - Removing standard keys:', Object.values(STORAGE_KEYS));
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));

      // Remove all habit completion keys
      if (habitCompletionKeys.length > 0) {
        console.log('🗑️ CLEAR ALL DATA - Removing habit completion keys...');
        await AsyncStorage.multiRemove(habitCompletionKeys);
        console.log('🗑️ CLEAR ALL DATA - Habit completion keys removed');
      } else {
        console.log('🗑️ CLEAR ALL DATA - No habit completion keys found');
      }

      // Also clear awards
      await AwardService.clearAllAwards();

      // Verify everything was cleared
      const remainingKeys = await AsyncStorage.getAllKeys();
      console.log('🗑️ CLEAR ALL DATA - Remaining keys after clear:', remainingKeys);

    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Clear only tip-related data (keeps user profile and quiz)
  async clearTipData(): Promise<void> {
    try {
      // Get all keys to find habit completion keys (both formats)
      const allKeys = await AsyncStorage.getAllKeys();
      const habitCompletionKeys = allKeys.filter(key =>
        key.startsWith(STORAGE_KEYS.HABIT_COMPLETIONS) || // New format
        key.startsWith('habit_completions_') // Old format
      );

      // Remove tip-related keys
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.DAILY_TIPS,
        STORAGE_KEYS.TIP_ATTEMPTS,
        STORAGE_KEYS.LIKED_TIPS,
      ]);

      // Remove all habit completion keys
      if (habitCompletionKeys.length > 0) {
        await AsyncStorage.multiRemove(habitCompletionKeys);
      }
    } catch (error) {
      console.error('Error clearing tip data:', error);
      throw error;
    }
  }

  // Habit Completion Tracking - Single source of truth
  async getHabitCompletions(date?: Date): Promise<Map<string, number>> {
    const dateKey = (date || new Date()).toDateString();
    const key = `${STORAGE_KEYS.HABIT_COMPLETIONS}${dateKey}`;
    console.log('📊 Getting habit completions with key:', key);
    try {
      const data = await AsyncStorage.getItem(key);
      console.log('📊 Raw data retrieved:', data);
      if (!data) return new Map();
      const parsed = JSON.parse(data);
      const map = new Map(Object.entries(parsed).map(([k, v]) => [k, Number(v)]));
      console.log('📊 Parsed completion map:', Array.from(map.entries()));
      return map;
    } catch (error) {
      console.error('Error getting habit completions:', error);
      return new Map();
    }
  }

  async setHabitCompletion(tipId: string, count: number, date?: Date): Promise<void> {
    const dateKey = (date || new Date()).toDateString();
    const key = `${STORAGE_KEYS.HABIT_COMPLETIONS}${dateKey}`;
    console.log(`📝 Setting habit completion - key: ${key}, tipId: ${tipId}, count: ${count}`);
    try {
      const completions = await this.getHabitCompletions(date);
      if (count > 0) {
        completions.set(tipId, count);
      } else {
        completions.delete(tipId);
      }
      const data = Object.fromEntries(completions);
      console.log('📝 Saving completion data:', data);
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting habit completion:', error);
      throw error;
    }
  }

  async incrementHabitCompletion(tipId: string, date?: Date): Promise<number> {
    const completions = await this.getHabitCompletions(date);
    const current = completions.get(tipId) || 0;
    const newCount = current + 1;
    await this.setHabitCompletion(tipId, newCount, date);
    return newCount;
  }

  // Generic storage helpers for custom keys
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }
}

export default new StorageService();