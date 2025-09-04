import { configureStore } from '@reduxjs/toolkit';
import dailyTipReducer from './slices/dailyTipSlice';

export const store = configureStore({
  reducer: {
    dailyTip: dailyTipReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'dailyTip/setDailyTip', 
          'dailyTip/updateTipResponse',
          'dailyTip/setCurrentTipRecord',
          'dailyTip/updateDailyRecord',
          'dailyTip/addToTipHistory',
          'dailyTip/setTipHistory',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'payload.presented_date', 
          'payload.responded_at', 
          'payload.respondedAt',
          'payload.dailyRecord.presented_date',
          'payload.dailyRecord.responded_at',
          'payload.dailyRecord.check_in_at',
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'dailyTip.currentTipRecord.dailyRecord.presented_date',
          'dailyTip.currentTipRecord.dailyRecord.responded_at',
          'dailyTip.currentTipRecord.dailyRecord.check_in_at',
          'dailyTip.tipHistory',
          'dailyTip.tipAttempts',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;