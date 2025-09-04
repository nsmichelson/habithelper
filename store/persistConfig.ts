import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { PersistConfig } from 'redux-persist/lib/types';

// Base persist config
export const rootPersistConfig: PersistConfig<any> = {
  key: 'root',
  storage: AsyncStorage,
  // We'll whitelist specific slices we want to persist
  whitelist: ['dailyTip', 'user', 'awards', 'history'],
  // Blacklist slices that shouldn't be persisted (like UI state)
  blacklist: ['ui'],
};

// Slice-specific persist configs if needed
export const dailyTipPersistConfig: PersistConfig<any> = {
  key: 'dailyTip',
  storage: AsyncStorage,
  // Can add specific fields to persist/ignore
  whitelist: ['currentTip', 'dailyTip', 'previousTips', 'savedPersonalizationData'],
  blacklist: ['isLoading', 'error'],
};

export const userPersistConfig: PersistConfig<any> = {
  key: 'user',
  storage: AsyncStorage,
  whitelist: ['profile', 'onboardingCompleted', 'quizResponses', 'identityPhrase'],
  blacklist: ['isLoading'],
};

export const awardsPersistConfig: PersistConfig<any> = {
  key: 'awards',
  storage: AsyncStorage,
  whitelist: ['earnedAwards', 'awardProgress'],
  blacklist: ['newAwardQueue', 'currentNotification', 'isChecking'],
};