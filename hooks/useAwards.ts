import { useState, useEffect, useCallback } from 'react';
import { Award, UserAward, AwardProgress } from '../types/awards';
import AwardService from '../services/awardService';
import * as Haptics from 'expo-haptics';

export function useAwards() {
  const [earnedAwards, setEarnedAwards] = useState<Award[]>([]);
  const [newAwards, setNewAwards] = useState<Award[]>([]);
  const [awardProgress, setAwardProgress] = useState<AwardProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load earned awards
  const loadAwards = useCallback(async () => {
    try {
      const earned = await AwardService.getEarnedAwards();
      setEarnedAwards(earned);
      
      const progress = await AwardService.getAwardProgress();
      setAwardProgress(progress);
    } catch (error) {
      console.error('Error loading awards:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check for new awards (call after user actions)
  const checkForNewAwards = useCallback(async () => {
    try {
      const newly = await AwardService.checkForNewAwards();
      if (newly.length > 0) {
        // Get the full award details
        const awardIds = newly.map(ua => ua.awardId);
        const awards = earnedAwards.filter(a => awardIds.includes(a.id));
        
        setNewAwards(awards);
        
        // Haptic feedback for earning award
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Reload all awards
        await loadAwards();
        
        return awards;
      }
      return [];
    } catch (error) {
      console.error('Error checking for new awards:', error);
      return [];
    }
  }, [earnedAwards, loadAwards]);

  // Mark awards as seen/notified
  const markAwardsSeen = useCallback(async (awardIds: string[]) => {
    try {
      await AwardService.markAwardsNotified(awardIds);
      setNewAwards([]);
    } catch (error) {
      console.error('Error marking awards as seen:', error);
    }
  }, []);

  // Get specific award progress
  const getAwardProgress = useCallback((awardId: string) => {
    return awardProgress.find(p => p.awardId === awardId);
  }, [awardProgress]);

  // Initialize on mount
  useEffect(() => {
    loadAwards();
  }, [loadAwards]);

  return {
    earnedAwards,
    newAwards,
    awardProgress,
    isLoading,
    checkForNewAwards,
    markAwardsSeen,
    getAwardProgress,
    reloadAwards: loadAwards,
  };
}

// Hook for checking awards at specific trigger points
export function useAwardTrigger() {
  const { checkForNewAwards } = useAwards();

  // Check awards after daily tip response
  const checkAfterTipResponse = useCallback(async () => {
    await checkForNewAwards();
  }, [checkForNewAwards]);

  // Check awards after evening check-in
  const checkAfterCheckIn = useCallback(async () => {
    await checkForNewAwards();
  }, [checkForNewAwards]);

  // Check awards on app open
  const checkOnAppOpen = useCallback(async () => {
    await checkForNewAwards();
  }, [checkForNewAwards]);

  return {
    checkAfterTipResponse,
    checkAfterCheckIn,
    checkOnAppOpen,
  };
}