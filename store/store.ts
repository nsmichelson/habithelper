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
        ignoredActions: ['dailyTip/setDailyTip', 'dailyTip/updateTipResponse'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.presented_date', 'payload.responded_at', 'payload.respondedAt'],
        // Ignore these paths in the state
        ignoredPaths: ['dailyTip.dailyTip.presented_date', 'dailyTip.dailyTip.responded_at'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;