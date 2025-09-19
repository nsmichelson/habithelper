# Firebase Setup Guide for HabitHelper

## Overview
Firebase is integrated into HabitHelper to collect anonymous data about which tips work best for different types of users. This data will help improve the tip recommendation algorithm over time.

## Data Collection Strategy

### What We Track
1. **Tip Presentations**: When tips are shown to users, with context like time of day and user goals
2. **User Responses**: Whether users choose to try, skip, or save tips for later
3. **Tip Outcomes**: Evening check-in results and quick completions
4. **Habit Formation**: When tips become loved habits
5. **Focus Mode**: Engagement with focus mode for building habits

### Privacy-First Approach
- No personally identifiable information (PII) is stored
- Medical conditions are stored as counts only, not specifics
- Age is bucketed into groups (18-24, 25-34, etc.)
- All data is used solely for improving recommendations

## Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it (e.g., "habithelper-analytics")
4. Enable Google Analytics when prompted
5. Select or create a Google Analytics account

### 2. Add Web App to Project
1. In Firebase Console, click the gear icon → Project Settings
2. Under "Your apps", click the web icon (</>)
3. Register your app with a nickname (e.g., "HabitHelper Web")
4. Copy the configuration object

### 3. Update Configuration
1. Open `/config/firebase.ts`
2. Replace the placeholder values with your Firebase config:
```typescript
export const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### 4. Enable Firestore Database
1. In Firebase Console, go to Firestore Database
2. Click "Create database"
3. Choose production mode
4. Select your preferred location
5. Set up security rules (see below)

### 5. Configure Firestore Security Rules
In Firestore, go to Rules and add:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow write access to analytics collections
    match /user_profiles/{document=**} {
      allow write: if true;
      allow read: if false;
    }
    match /tip_interactions/{document=**} {
      allow write: if true;
      allow read: if false;
    }
    match /tip_outcomes/{document=**} {
      allow write: if true;
      allow read: if false;
    }
    match /aggregated_tip_stats/{document=**} {
      allow write: if true;
      allow read: if request.auth != null; // Only for admin dashboard
    }
  }
}
```

### 6. Install Dependencies
The Firebase SDK should already be installed. If not:
```bash
npm install firebase
```

## Analytics Events Reference

### Core Events Tracked

#### `tip_presented`
Fired when a tip is shown to the user
- `tip_id`: Unique tip identifier
- `tip_type`: Type categories (healthy_swap, planning_ahead, etc.)
- `difficulty_tier`: 1-5 difficulty scale
- `goal_alignment`: User's goals that match this tip
- `is_saved_tip`: Whether from saved list
- `is_focus_mode`: Whether in focus mode
- `hour_of_day`: When presented
- `day_of_week`: Day presented

#### `tip_response`
Fired when user responds to a tip
- `tip_id`: Unique tip identifier
- `response`: try_it | maybe_later | not_for_me
- `rejection_reason`: Optional reason for not_for_me

#### `tip_checkin`
Fired during evening check-in or quick completion
- `tip_id`: Unique tip identifier
- `result`: went_great | went_ok | not_great | didnt_try
- `used_personalization`: Whether user customized the tip
- `success`: 1 if went_great, 0 otherwise

#### `habit_loved`
Fired when a tip becomes a loved habit
- `tip_id`: Unique tip identifier
- `days_to_love`: Days from first try to becoming loved

#### `focus_mode`
Fired for focus mode interactions
- `tip_id`: Unique tip identifier
- `action`: started | completed | abandoned
- `days_completed`: Number of days completed

## Firestore Collections

### `user_profiles`
Anonymized user profile data
- User goals, preferences, constraints
- Age group (not specific age)
- Medical condition count (not specifics)
- Quiz responses

### `tip_interactions`
Detailed tip presentation data
- User context at time of presentation
- Tip metadata (type, difficulty, etc.)
- Presentation context (time, day, etc.)

### `tip_outcomes`
Tip response and check-in data
- Initial responses (try_it, maybe_later, not_for_me)
- Evening check-in results
- Reflection notes
- Rejection reasons

### `aggregated_tip_stats`
Aggregated statistics per tip
- Response counts by type
- Check-in outcome counts
- Times marked as loved
- Success rates

## Testing Your Setup

1. Open the app and complete onboarding
2. Interact with a few tips (try, skip, save for later)
3. Check Firebase Console:
   - Analytics → Events: Should show tip events
   - Firestore: Should show documents in collections

## Monitoring & Analysis

### Firebase Console
- **Analytics**: View real-time events, user engagement
- **Firestore**: Browse collected data
- **Performance**: Monitor app performance

### Key Metrics to Track
1. **Tip Success Rate**: % of tips marked as "went_great"
2. **Goal Alignment Score**: How well tips match user goals
3. **Habit Formation Rate**: Tips that become loved habits
4. **User Retention**: Daily/weekly active users
5. **Focus Mode Success**: Completion rate of focus periods

## Privacy & Compliance

### User Consent
Consider adding a privacy consent screen during onboarding:
```typescript
// Example consent component
<PrivacyConsent
  onAccept={() => AnalyticsService.enableCollection()}
  onDecline={() => AnalyticsService.disableCollection()}
/>
```

### Data Retention
Configure data retention in Firebase Console:
1. Go to Analytics → Settings
2. Set appropriate retention period (e.g., 14 months)
3. Enable auto-delete for old data

### GDPR/CCPA Compliance
- Provide data export functionality
- Allow users to request data deletion
- Include privacy policy in app

## Troubleshooting

### Analytics not showing up?
- Check Firebase configuration is correct
- Ensure `isInitialized` is true in AnalyticsService
- Events may take 24 hours to appear in Analytics dashboard
- Use DebugView for real-time testing

### Firestore write errors?
- Check security rules allow writes
- Verify collection names match exactly
- Check Firebase quota limits

### App crashes on startup?
- Ensure Firebase config is valid
- Check network connectivity
- Verify all Firebase services are enabled

## Next Steps

1. **Set up admin dashboard**: Create a web dashboard to view aggregated analytics
2. **Implement ML model**: Use collected data to train recommendation model
3. **A/B testing**: Set up Firebase Remote Config for tip experiments
4. **Push notifications**: Use Firebase Cloud Messaging for reminders
5. **Crashlytics**: Add crash reporting for better debugging

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

For HabitHelper integration questions:
- Check `/services/analytics.ts` for implementation details
- Review tip tracking in `/app/(tabs)/index.tsx`