import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DailyTip, Tip } from '@/types/tip';

interface DailyTipState {
  currentTip: Tip | null;
  dailyTip: DailyTip | null;
  pendingPersonalizationData: any | null;
  savedPersonalizationData: any | null;
  tipReasons: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DailyTipState = {
  currentTip: null,
  dailyTip: null,
  pendingPersonalizationData: null,
  savedPersonalizationData: null,
  tipReasons: [],
  isLoading: false,
  error: null,
};

const dailyTipSlice = createSlice({
  name: 'dailyTip',
  initialState,
  reducers: {
    // Set the current tip
    setCurrentTip: (state, action: PayloadAction<Tip>) => {
      state.currentTip = action.payload;
    },
    
    // Set the daily tip record
    setDailyTip: (state, action: PayloadAction<DailyTip>) => {
      state.dailyTip = action.payload;
      // If daily tip has personalization data, set it as saved
      if (action.payload.personalization_data) {
        state.savedPersonalizationData = action.payload.personalization_data;
      }
    },
    
    // Update pending personalization data (as user types)
    setPendingPersonalizationData: (state, action: PayloadAction<any>) => {
      state.pendingPersonalizationData = action.payload;
    },
    
    // Save personalization data (when user clicks save or "I'll try it")
    savePersonalizationData: (state, action: PayloadAction<any>) => {
      state.savedPersonalizationData = action.payload;
      state.pendingPersonalizationData = null; // Clear pending once saved
      
      // Also update the dailyTip if it exists
      if (state.dailyTip) {
        state.dailyTip.personalization_data = action.payload;
      }
    },
    
    // Clear pending data
    clearPendingPersonalizationData: (state) => {
      state.pendingPersonalizationData = null;
    },
    
    // Update tip response
    updateTipResponse: (state, action: PayloadAction<{ response: string; respondedAt: Date }>) => {
      if (state.dailyTip) {
        state.dailyTip.user_response = action.payload.response as any;
        state.dailyTip.responded_at = action.payload.respondedAt;
      }
    },
    
    // Set tip reasons
    setTipReasons: (state, action: PayloadAction<string[]>) => {
      state.tipReasons = action.payload;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Reset all state
    resetDailyTip: (state) => {
      return initialState;
    },
  },
});

export const {
  setCurrentTip,
  setDailyTip,
  setPendingPersonalizationData,
  savePersonalizationData,
  clearPendingPersonalizationData,
  updateTipResponse,
  setTipReasons,
  setLoading,
  setError,
  resetDailyTip,
} = dailyTipSlice.actions;

export default dailyTipSlice.reducer;