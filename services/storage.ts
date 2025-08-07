import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DailyTip, TipAttempt } from '../types/tip';
import { QuizResponse } from '../types/quiz';

const STORAGE_KEYS = {
  USER_PROFILE: '@HabitHelper:userProfile',
  DAILY_TIPS: '@HabitHelper:dailyTips',
  TIP_ATTEMPTS: '@HabitHelper:tipAttempts',
  QUIZ_RESPONSES: '@HabitHelper:quizResponses',
  ONBOARDING_COMPLETED: '@HabitHelper:onboardingCompleted',
  LIKED_TIPS: '@HabitHelper:likedTips',
} as const;

class StorageService {
  // User Profile
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
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
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting daily tips:', error);
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
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting tip attempts:', error);
      return [];
    }
  }

  async saveTipAttempt(attempt: TipAttempt): Promise<void> {
    try {
      const attempts = await this.getTipAttempts();
      attempts.push(attempt);
      await AsyncStorage.setItem(STORAGE_KEYS.TIP_ATTEMPTS, JSON.stringify(attempts));
    } catch (error) {
      console.error('Error saving tip attempt:', error);
      throw error;
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
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}

export default new StorageService();