// Firebase configuration
// You'll need to replace these with your actual Firebase project config
// Get these from Firebase Console > Project Settings > Your apps > SDK setup and configuration

// export const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
//   measurementId: "YOUR_MEASUREMENT_ID"
// };

export const firebaseConfig = {
  apiKey: "AIzaSyCmnzZJ4TT-eAIlwkZLC9xZaPme0RuVFsQ",
  authDomain: "habit-helper-89a63.firebaseapp.com",
  projectId: "habit-helper-89a63",
  storageBucket: "habit-helper-89a63.firebasestorage.app",
  messagingSenderId: "632641030043",
  appId: "1:632641030043:web:ff270acafca72acc96433e",
  measurementId: "G-L499SKR9YP"
};

// Instructions for setting up Firebase:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project or select existing
// 3. Add a web app to your project
// 4. Copy the configuration object and replace the values above
// 5. Enable Analytics in your Firebase project
// 6. Enable Firestore in your Firebase project

export const COLLECTION_NAMES = {
  USER_PROFILES: 'user_profiles',
  TIP_INTERACTIONS: 'tip_interactions',
  TIP_OUTCOMES: 'tip_outcomes',
  AGGREGATED_TIP_STATS: 'aggregated_tip_stats',
  USER_SESSIONS: 'user_sessions',
  CARD_ENGAGEMENTS: 'card_engagements'
} as const;