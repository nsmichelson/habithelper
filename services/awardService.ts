import AsyncStorage from '@react-native-async-storage/async-storage';
import { Award, UserAward, AwardProgress } from '../types/awards';
import { AWARDS_DATABASE } from '../data/awards';
import { DailyTip, TipAttempt } from '../types/tip';
import StorageService from './storage';

const STORAGE_KEY = '@HabitHelper:userAwards';

class AwardService {
  private userAwards: UserAward[] = [];
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.userAwards = JSON.parse(stored);
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing awards:', error);
      this.userAwards = [];
      this.isInitialized = true;
    }
  }

  async getUserAwards(): Promise<UserAward[]> {
    await this.initialize();
    return this.userAwards;
  }

  async getEarnedAwards(): Promise<Award[]> {
    const userAwards = await this.getUserAwards();
    const awardIds = userAwards.map(ua => ua.awardId);
    return AWARDS_DATABASE.filter(award => awardIds.includes(award.id));
  }

  async getUnearnedAwards(): Promise<Award[]> {
    const userAwards = await this.getUserAwards();
    const awardIds = userAwards.map(ua => ua.awardId);
    return AWARDS_DATABASE.filter(award => 
      !awardIds.includes(award.id) && !award.isSecret
    );
  }

  private async saveUserAwards(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.userAwards));
    } catch (error) {
      console.error('Error saving user awards:', error);
    }
  }

  async awardEarned(awardId: string): Promise<UserAward | null> {
    await this.initialize();
    
    // Check if already earned
    if (this.userAwards.find(ua => ua.awardId === awardId)) {
      return null;
    }

    const award = AWARDS_DATABASE.find(a => a.id === awardId);
    if (!award) return null;

    const userAward: UserAward = {
      awardId,
      earnedAt: new Date(),
      notified: false
    };

    this.userAwards.push(userAward);
    await this.saveUserAwards();
    
    return userAward;
  }

  // Check for newly earned awards based on user actions
  async checkForNewAwards(): Promise<UserAward[]> {
    await this.initialize();
    const newAwards: UserAward[] = [];
    
    const dailyTips = await StorageService.getDailyTips();
    const tipAttempts = await StorageService.getTipAttempts();
    
    // Check each award
    for (const award of AWARDS_DATABASE) {
      // Skip if already earned
      if (this.userAwards.find(ua => ua.awardId === award.id)) {
        continue;
      }

      const isEarned = await this.checkAwardCriteria(award, dailyTips, tipAttempts);
      if (isEarned) {
        const userAward = await this.awardEarned(award.id);
        if (userAward) {
          newAwards.push(userAward);
        }
      }
    }

    return newAwards;
  }

  private async checkAwardCriteria(
    award: Award, 
    dailyTips: DailyTip[], 
    tipAttempts: TipAttempt[]
  ): Promise<boolean> {
    switch (award.criteria.type) {
      case 'streak':
        return this.checkStreakCriteria(award, dailyTips);
      
      case 'count':
        return this.checkCountCriteria(award, dailyTips, tipAttempts);
      
      case 'time':
        return this.checkTimeCriteria(award, tipAttempts);
      
      case 'pattern':
        return await this.checkPatternCriteria(award, dailyTips, tipAttempts);
      
      case 'special':
        return this.checkSpecialCriteria(award, dailyTips, tipAttempts);
      
      default:
        return false;
    }
  }

  private checkStreakCriteria(award: Award, dailyTips: DailyTip[]): boolean {
    const streak = this.calculateCurrentStreak(dailyTips);
    return streak >= award.criteria.value;
  }

  private calculateCurrentStreak(dailyTips: DailyTip[]): number {
    // Get tips that have been responded to
    const respondedTips = dailyTips.filter(t => t.user_response === 'try_it');
    if (respondedTips.length === 0) return 0;

    // Sort by date
    const sortedTips = respondedTips.sort((a, b) => 
      new Date(b.presented_date).getTime() - new Date(a.presented_date).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Start from today and work backwards
    let checkDate = new Date(today);
    
    for (let i = 0; i < 365; i++) { // Max check 1 year
      const dateStr = checkDate.toDateString();
      const hasActivity = sortedTips.some(tip => 
        new Date(tip.presented_date).toDateString() === dateStr
      );
      
      if (hasActivity) {
        streak++;
      } else if (i > 0) { // Don't break on first day (today) if no activity yet
        break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    return streak;
  }

  private checkCountCriteria(
    award: Award, 
    dailyTips: DailyTip[], 
    tipAttempts: TipAttempt[]
  ): boolean {
    const condition = award.criteria.condition;
    
    switch (condition) {
      case 'tried_maybe_later':
        // Count tips that were "maybe later" and then tried
        const maybeLaterTried = dailyTips.filter(tip => {
          const wasMarkedMaybeLater = tipAttempts.some(a => 
            a.tip_id === tip.tip_id && a.feedback === 'maybe_later'
          );
          const wasTried = tip.user_response === 'try_it';
          return wasMarkedMaybeLater && wasTried;
        });
        return maybeLaterTried.length >= award.criteria.value;
      
      case 'loved_experiments':
        // Count experiments marked as "loved it"
        const lovedCount = dailyTips.filter(t => 
          t.evening_check_in === 'went_great'
        ).length;
        return lovedCount >= award.criteria.value;
      
      case 'difficult_experiments':
        // Would need difficulty data on tips - skip for now
        return false;
      
      case 'unique':
        // Count unique experiments tried
        const uniqueTips = new Set(
          dailyTips.filter(t => t.user_response === 'try_it').map(t => t.tip_id)
        );
        return uniqueTips.size >= award.criteria.value;
      
      default:
        // Default count (e.g., total experiments)
        const triedCount = dailyTips.filter(t => t.user_response === 'try_it').length;
        return triedCount >= award.criteria.value;
    }
  }

  private checkTimeCriteria(award: Award, tipAttempts: TipAttempt[]): boolean {
    // Check if user responded quickly to any tip
    const quickResponses = tipAttempts.filter(attempt => {
      if (!attempt.attempted_at || !attempt.created_at) return false;
      
      const presentedTime = new Date(attempt.created_at).getTime();
      const respondedTime = new Date(attempt.attempted_at).getTime();
      const minutesDiff = (respondedTime - presentedTime) / (1000 * 60);
      
      return minutesDiff <= award.criteria.value;
    });
    
    return quickResponses.length > 0;
  }

  private async checkPatternCriteria(
    award: Award, 
    dailyTips: DailyTip[], 
    tipAttempts: TipAttempt[]
  ): Promise<boolean> {
    const condition = award.criteria.condition;
    
    switch (condition) {
      case 'different_categories':
        // Would need category data on tips
        return false;
      
      case 'all_areas':
        // Check if tried tips from all 4 areas
        const areas = new Set(
          dailyTips
            .filter(t => t.user_response === 'try_it')
            .map(t => t.area || 'nutrition')
        );
        return areas.size >= 4;
      
      case 'weekend_checkins':
        // Check weekend activity
        const weekendCheckins = dailyTips.filter(tip => {
          const date = new Date(tip.presented_date);
          const dayOfWeek = date.getDay();
          return (dayOfWeek === 0 || dayOfWeek === 6) && tip.user_response === 'try_it';
        });
        return weekendCheckins.length >= award.criteria.value;
      
      case 'morning_completion':
        // Would need time-of-day data
        return false;
      
      case 'evening_checkin':
        // Count evening check-ins
        const eveningCheckins = dailyTips.filter(t => t.evening_check_in).length;
        return eveningCheckins >= award.criteria.value;
      
      case 'all_completed_week':
        // Check for a perfect week
        return this.checkPerfectWeek(dailyTips);
      
      case 'loved_in_14_days':
        // Check if got 5 "loved it" in first 14 days
        const profile = await StorageService.getUserProfile();
        if (!profile) return false;
        
        const twoWeeksAfterStart = new Date(profile.created_at);
        twoWeeksAfterStart.setDate(twoWeeksAfterStart.getDate() + 14);
        
        const earlyLoves = dailyTips.filter(t => 
          new Date(t.presented_date) <= twoWeeksAfterStart &&
          t.evening_check_in === 'went_great'
        );
        return earlyLoves.length >= award.criteria.value;
      
      default:
        return false;
    }
  }

  private checkSpecialCriteria(
    award: Award, 
    dailyTips: DailyTip[], 
    tipAttempts: TipAttempt[]
  ): boolean {
    const condition = award.criteria.condition;
    
    switch (condition) {
      case 'returned_after_break':
        // Check if user returned after 3+ day break
        return this.checkReturnAfterBreak(dailyTips);
      
      case 'tried_maybe_later':
        // Check if tried any "maybe later" tip
        const maybeLaterTips = tipAttempts.filter(a => a.feedback === 'maybe_later');
        const triedMaybeLater = maybeLaterTips.some(ml => 
          dailyTips.some(t => t.tip_id === ml.tip_id && t.user_response === 'try_it')
        );
        return triedMaybeLater;
      
      default:
        return false;
    }
  }

  private checkPerfectWeek(dailyTips: DailyTip[]): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check last 7 days
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      const dayActivity = dailyTips.find(t => 
        new Date(t.presented_date).toDateString() === dateStr &&
        t.user_response === 'try_it'
      );
      
      if (!dayActivity) return false;
    }
    
    return true;
  }

  private checkReturnAfterBreak(dailyTips: DailyTip[]): boolean {
    const sortedTips = dailyTips
      .filter(t => t.user_response === 'try_it')
      .sort((a, b) => 
        new Date(a.presented_date).getTime() - new Date(b.presented_date).getTime()
      );
    
    if (sortedTips.length < 2) return false;
    
    // Check for any 3+ day gap
    for (let i = 1; i < sortedTips.length; i++) {
      const prevDate = new Date(sortedTips[i - 1].presented_date);
      const currDate = new Date(sortedTips[i].presented_date);
      const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 3) {
        return true;
      }
    }
    
    return false;
  }

  // Get progress toward unearned awards
  async getAwardProgress(): Promise<AwardProgress[]> {
    await this.initialize();
    const progress: AwardProgress[] = [];
    
    const dailyTips = await StorageService.getDailyTips();
    const tipAttempts = await StorageService.getTipAttempts();
    
    for (const award of AWARDS_DATABASE) {
      // Skip if already earned or secret
      if (this.userAwards.find(ua => ua.awardId === award.id) || award.isSecret) {
        continue;
      }

      const currentProgress = await this.calculateProgress(award, dailyTips, tipAttempts);
      if (currentProgress !== null) {
        progress.push({
          awardId: award.id,
          currentValue: currentProgress.current,
          targetValue: currentProgress.target,
          percentage: Math.min(100, (currentProgress.current / currentProgress.target) * 100),
          lastUpdated: new Date()
        });
      }
    }

    return progress;
  }

  private async calculateProgress(
    award: Award, 
    dailyTips: DailyTip[], 
    tipAttempts: TipAttempt[]
  ): Promise<{ current: number; target: number } | null> {
    const target = award.criteria.value;
    
    switch (award.criteria.type) {
      case 'streak':
        const streak = this.calculateCurrentStreak(dailyTips);
        return { current: streak, target };
      
      case 'count':
        let count = 0;
        const condition = award.criteria.condition;
        
        if (condition === 'loved_experiments') {
          count = dailyTips.filter(t => t.evening_check_in === 'went_great').length;
        } else if (condition === 'unique') {
          count = new Set(
            dailyTips.filter(t => t.user_response === 'try_it').map(t => t.tip_id)
          ).size;
        } else {
          count = dailyTips.filter(t => t.user_response === 'try_it').length;
        }
        
        return { current: count, target };
      
      default:
        return null;
    }
  }

  // Mark awards as notified
  async markAwardsNotified(awardIds: string[]): Promise<void> {
    await this.initialize();
    
    let updated = false;
    for (const awardId of awardIds) {
      const userAward = this.userAwards.find(ua => ua.awardId === awardId);
      if (userAward && !userAward.notified) {
        userAward.notified = true;
        updated = true;
      }
    }
    
    if (updated) {
      await this.saveUserAwards();
    }
  }

  // Get unnotified awards
  async getUnnotifiedAwards(): Promise<Award[]> {
    const userAwards = await this.getUserAwards();
    const unnotifiedIds = userAwards
      .filter(ua => !ua.notified)
      .map(ua => ua.awardId);
    
    return AWARDS_DATABASE.filter(a => unnotifiedIds.includes(a.id));
  }

  // Clear all awards (for testing/reset)
  async clearAllAwards(): Promise<void> {
    this.userAwards = [];
    await AsyncStorage.removeItem(STORAGE_KEY);
    this.isInitialized = false;
  }
}

export default new AwardService();