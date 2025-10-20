import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SIMPLIFIED_TIPS } from '@/data/simplifiedTips';
import { SimplifiedTip } from '@/types/simplifiedTip';
import { DailyTip, TipAttempt } from '@/types/tip';

// Re-export basic selectors from slice
export {
  selectCurrentTip,
  selectDailyTip,
  selectPreviousTips,
  selectTipAttempts,
  selectIsLoading,
  selectError,
  selectTipReasons,
  selectPendingPersonalizationData,
  selectSavedPersonalizationData,
  selectHasRespondedToday,
  selectNeedsEveningCheckIn,
  selectCompletedExperimentsCount,
  selectSuccessfulTipsCount,
} from '../slices/dailyTipSlice';

// Complex computed selectors using createSelector for memoization

// Get liked tips (successful experiments)
export const selectLikedTips = createSelector(
  [(state: RootState) => state.dailyTip.previousTips],
  (previousTips: DailyTip[]) => {
    const likedTipIds = new Set<string>();
    
    previousTips.forEach(tip => {
      if (tip.evening_check_in === 'went_great' || 
          tip.evening_check_in === 'went_ok' ||
          tip.quick_completions?.some(qc => qc.feedback === 'went_great' || qc.feedback === 'went_ok')) {
        likedTipIds.add(tip.tip_id);
      }
    });

    const allTips = SIMPLIFIED_TIPS;
    return Array.from(likedTipIds).map(id =>
      allTips.find(t => t.tip_id === id)
    ).filter(Boolean) as SimplifiedTip[];
  }
);

// Get tips grouped by goal tag
export const selectTipsByGoal = createSelector(
  [(state: RootState) => state.dailyTip.previousTips],
  (previousTips: DailyTip[]) => {
    const tipsByGoal: Record<string, { tried: number; successful: number }> = {};
    const allTips = SIMPLIFIED_TIPS;

    previousTips.forEach(dailyTip => {
      const tip = allTips.find(t => t.tip_id === dailyTip.tip_id);
      if (!tip) return;

      tip.goals?.forEach(tag => {
        if (!tipsByGoal[tag]) {
          tipsByGoal[tag] = { tried: 0, successful: 0 };
        }

        if (dailyTip.user_response === 'try_it') {
          tipsByGoal[tag].tried += 1;

          if (dailyTip.evening_check_in === 'went_great' ||
              dailyTip.quick_completions?.some(qc => qc.feedback === 'went_great')) {
            tipsByGoal[tag].successful += 1;
          }
        }
      });
    });

    return tipsByGoal;
  }
);

// Get current streak
export const selectCurrentStreak = createSelector(
  [(state: RootState) => state.dailyTip.previousTips],
  (previousTips: DailyTip[]) => {
    if (previousTips.length === 0) return 0;

    // Sort by date descending
    const sortedTips = [...previousTips].sort((a, b) => 
      new Date(b.presented_date).getTime() - new Date(a.presented_date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const tip of sortedTips) {
      const tipDate = new Date(tip.presented_date);
      tipDate.setHours(0, 0, 0, 0);

      // Check if this tip was tried and completed
      const wasCompleted = tip.user_response === 'try_it' && 
        (tip.evening_check_in || tip.quick_completions?.length);

      if (!wasCompleted) {
        // If today's tip isn't completed yet, check yesterday
        if (tipDate.getTime() === currentDate.getTime()) {
          currentDate.setDate(currentDate.getDate() - 1);
          continue;
        }
        break;
      }

      // Check if it's consecutive
      const dayDiff = Math.floor((currentDate.getTime() - tipDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (dayDiff === 1) {
        // Yesterday's tip, but we already moved the date
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
);

// Get tips that haven't been tried yet
export const selectUntriedTipIds = createSelector(
  [(state: RootState) => state.dailyTip.previousTips,
   (state: RootState) => state.dailyTip.attempts],
  (previousTips: DailyTip[], attempts: TipAttempt[]) => {
    const triedTipIds = new Set<string>();
    
    previousTips.forEach(tip => {
      triedTipIds.add(tip.tip_id);
    });
    
    attempts.forEach(attempt => {
      triedTipIds.add(attempt.tip_id);
    });

    const allTips = SIMPLIFIED_TIPS;
    return allTips
      .filter(tip => !triedTipIds.has(tip.tip_id))
      .map(tip => tip.tip_id);
  }
);

// Get personalization for a specific tip
export const selectTipPersonalization = createSelector(
  [(state: RootState) => state.dailyTip.dailyTip,
   (state: RootState) => state.dailyTip.pendingPersonalizationData,
   (state: RootState) => state.dailyTip.savedPersonalizationData],
  (dailyTip, pending, saved) => {
    // Priority: pending > saved > dailyTip's saved data
    return pending || saved || dailyTip?.personalization_data || null;
  }
);

// Get tip success rate
export const selectTipSuccessRate = createSelector(
  [(state: RootState) => state.dailyTip.previousTips],
  (previousTips: DailyTip[]) => {
    const tried = previousTips.filter(t => t.user_response === 'try_it');
    if (tried.length === 0) return 0;

    const successful = tried.filter(t => 
      t.evening_check_in === 'went_great' ||
      t.quick_completions?.some(qc => qc.feedback === 'went_great')
    );

    return Math.round((successful.length / tried.length) * 100);
  }
);

// Get recent activity (last 7 days)
export const selectRecentActivity = createSelector(
  [(state: RootState) => state.dailyTip.previousTips],
  (previousTips: DailyTip[]) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return previousTips.filter(tip => 
      new Date(tip.presented_date) >= sevenDaysAgo
    );
  }
);

// Get tips by response type
export const selectTipResponseStats = createSelector(
  [(state: RootState) => state.dailyTip.previousTips],
  (previousTips: DailyTip[]) => {
    const stats = {
      try_it: 0,
      not_interested: 0,
      maybe_later: 0,
      no_response: 0,
    };

    previousTips.forEach(tip => {
      if (!tip.user_response) {
        stats.no_response++;
      } else {
        stats[tip.user_response]++;
      }
    });

    return stats;
  }
);