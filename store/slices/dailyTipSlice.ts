import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DailyTip, Tip, TipAttempt } from '@/types/tip';
import { RootState } from '../store';

// Represents a complete tip record with all associated data
interface TipRecord {
  tip: Tip;                          // The full tip object from database
  dailyRecord: DailyTip;             // User's interaction record for this tip
  reasons: string[];                 // Why this tip was recommended
  personalizationData?: any;         // User's customization for this tip
}

interface DailyTipState {
  // Current tip being shown to user (with all related data in one place)
  currentTipRecord: TipRecord | null;
  
  // Historical tip records (previous tips shown to user)
  tipHistory: DailyTip[];
  
  // Tip attempts (tips user has interacted with)
  tipAttempts: TipAttempt[];
  
  // Temporary personalization data (while user is editing)
  pendingPersonalizationData: any | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

const initialState: DailyTipState = {
  currentTipRecord: null,
  tipHistory: [],
  tipAttempts: [],
  pendingPersonalizationData: null,
  isLoading: false,
  error: null,
};

const dailyTipSlice = createSlice({
  name: 'dailyTip',
  initialState,
  reducers: {
    // Set the complete current tip record (all data together)
    setCurrentTipRecord: (state, action: PayloadAction<TipRecord>) => {
      state.currentTipRecord = action.payload;
      // Clear any pending personalization when setting new tip
      state.pendingPersonalizationData = null;
    },
    
    // Update just the tip part of current record
    updateCurrentTip: (state, action: PayloadAction<Tip>) => {
      if (state.currentTipRecord) {
        state.currentTipRecord.tip = action.payload;
      }
    },
    
    // Update just the daily record part
    updateDailyRecord: (state, action: PayloadAction<Partial<DailyTip>>) => {
      if (state.currentTipRecord) {
        state.currentTipRecord.dailyRecord = {
          ...state.currentTipRecord.dailyRecord,
          ...action.payload,
        };
      }
    },
    
    // Update tip response
    updateTipResponse: (state, action: PayloadAction<{ 
      response: 'try_it' | 'not_interested' | 'maybe_later'; 
      respondedAt: Date 
    }>) => {
      if (state.currentTipRecord) {
        state.currentTipRecord.dailyRecord.user_response = action.payload.response;
        state.currentTipRecord.dailyRecord.responded_at = action.payload.respondedAt;
      }
    },
    
    // Update reasons for current tip
    updateTipReasons: (state, action: PayloadAction<string[]>) => {
      if (state.currentTipRecord) {
        state.currentTipRecord.reasons = action.payload;
      }
    },
    
    // Update pending personalization data (as user types)
    setPendingPersonalizationData: (state, action: PayloadAction<any>) => {
      state.pendingPersonalizationData = action.payload;
    },
    
    // Save personalization data to current tip record
    savePersonalizationData: (state, action: PayloadAction<any>) => {
      if (state.currentTipRecord) {
        state.currentTipRecord.personalizationData = action.payload;
        state.currentTipRecord.dailyRecord.personalization_data = action.payload;
      }
      state.pendingPersonalizationData = null;
    },
    
    // Clear pending personalization
    clearPendingPersonalizationData: (state) => {
      state.pendingPersonalizationData = null;
    },
    
    // Add completed tip to history
    addToTipHistory: (state, action: PayloadAction<DailyTip>) => {
      // Check if tip already exists in history (by tip_id and date)
      const exists = state.tipHistory.some(
        t => t.tip_id === action.payload.tip_id && 
        t.presented_date === action.payload.presented_date
      );
      
      if (!exists) {
        state.tipHistory.push(action.payload);
      } else {
        // Update existing record
        const index = state.tipHistory.findIndex(
          t => t.tip_id === action.payload.tip_id && 
          t.presented_date === action.payload.presented_date
        );
        if (index !== -1) {
          state.tipHistory[index] = action.payload;
        }
      }
    },
    
    // Set entire tip history (for loading from storage)
    setTipHistory: (state, action: PayloadAction<DailyTip[]>) => {
      state.tipHistory = action.payload;
    },
    
    // Add or update tip attempt
    addTipAttempt: (state, action: PayloadAction<TipAttempt>) => {
      const existingIndex = state.tipAttempts.findIndex(
        a => a.id === action.payload.id
      );
      
      if (existingIndex !== -1) {
        state.tipAttempts[existingIndex] = action.payload;
      } else {
        state.tipAttempts.push(action.payload);
      }
    },
    
    // Set all tip attempts (for loading from storage)
    setTipAttempts: (state, action: PayloadAction<TipAttempt[]>) => {
      state.tipAttempts = action.payload;
    },
    
    // Clear current tip record
    clearCurrentTipRecord: (state) => {
      state.currentTipRecord = null;
      state.pendingPersonalizationData = null;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Reset entire state
    resetDailyTip: () => initialState,
    
    // Legacy support - set current tip and daily tip separately
    // (for backward compatibility during migration)
    setCurrentTip: (state, action: PayloadAction<Tip>) => {
      if (!state.currentTipRecord) {
        // Create a new record if none exists
        state.currentTipRecord = {
          tip: action.payload,
          dailyRecord: {
            id: `temp-${Date.now()}`,
            user_id: 'current',
            tip_id: action.payload.tip_id,
            area: action.payload.area,
            presented_date: new Date(),
          } as DailyTip,
          reasons: [],
        };
      } else {
        state.currentTipRecord.tip = action.payload;
      }
    },
    
    setDailyTip: (state, action: PayloadAction<DailyTip>) => {
      if (!state.currentTipRecord) {
        // We need the full tip to create a complete record
        // This is a temporary state until the tip is loaded
        state.currentTipRecord = {
          tip: {} as Tip, // Will be filled when setCurrentTip is called
          dailyRecord: action.payload,
          reasons: [],
        };
      } else {
        state.currentTipRecord.dailyRecord = action.payload;
      }
      
      // Also save personalization data if present
      if (action.payload.personalization_data) {
        if (state.currentTipRecord) {
          state.currentTipRecord.personalizationData = action.payload.personalization_data;
        }
      }
    },
    
    setTipReasons: (state, action: PayloadAction<string[]>) => {
      if (state.currentTipRecord) {
        state.currentTipRecord.reasons = action.payload;
      }
    },
  },
});

// Export actions
export const {
  setCurrentTipRecord,
  updateCurrentTip,
  updateDailyRecord,
  updateTipResponse,
  updateTipReasons,
  setPendingPersonalizationData,
  savePersonalizationData,
  clearPendingPersonalizationData,
  addToTipHistory,
  setTipHistory,
  addTipAttempt,
  setTipAttempts,
  clearCurrentTipRecord,
  setLoading,
  setError,
  resetDailyTip,
  // Legacy support
  setCurrentTip,
  setDailyTip,
  setTipReasons,
} = dailyTipSlice.actions;

// Selectors - keeping all data access in one place
export const selectCurrentTipRecord = (state: RootState) => state.dailyTip.currentTipRecord;
export const selectCurrentTip = (state: RootState) => state.dailyTip.currentTipRecord?.tip || null;
export const selectDailyTip = (state: RootState) => state.dailyTip.currentTipRecord?.dailyRecord || null;
export const selectTipReasons = (state: RootState) => state.dailyTip.currentTipRecord?.reasons || [];
export const selectSavedPersonalizationData = (state: RootState) => 
  state.dailyTip.currentTipRecord?.personalizationData || null;

export const selectPendingPersonalizationData = (state: RootState) => 
  state.dailyTip.pendingPersonalizationData;

export const selectTipHistory = (state: RootState) => state.dailyTip.tipHistory;
export const selectPreviousTips = (state: RootState) => state.dailyTip.tipHistory; // Alias for compatibility
export const selectTipAttempts = (state: RootState) => state.dailyTip.tipAttempts;

export const selectIsLoading = (state: RootState) => state.dailyTip.isLoading;
export const selectError = (state: RootState) => state.dailyTip.error;

// Computed selectors
export const selectHasRespondedToday = (state: RootState) => {
  const dailyTip = state.dailyTip.currentTipRecord?.dailyRecord;
  if (!dailyTip) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tipDate = new Date(dailyTip.presented_date);
  tipDate.setHours(0, 0, 0, 0);
  
  return tipDate.getTime() === today.getTime() && !!dailyTip.user_response;
};

export const selectNeedsEveningCheckIn = (state: RootState) => {
  const dailyTip = state.dailyTip.currentTipRecord?.dailyRecord;
  if (!dailyTip) return false;
  
  return dailyTip.user_response === 'try_it' && !dailyTip.evening_check_in;
};

export const selectCompletedExperimentsCount = (state: RootState) => {
  return state.dailyTip.tipHistory.filter(
    tip => tip.user_response === 'try_it' && tip.evening_check_in
  ).length;
};

export const selectSuccessfulTipsCount = (state: RootState) => {
  return state.dailyTip.tipHistory.filter(
    tip => tip.evening_check_in === 'went_great' || 
    tip.evening_check_in === 'went_ok'
  ).length;
};

export default dailyTipSlice.reducer;