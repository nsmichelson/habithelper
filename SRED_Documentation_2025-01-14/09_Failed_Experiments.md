# Documentation of Failed Experiments

**Project: Habit Helper SR&ED Activities**
**Date: January 14, 2025**

## Overview

This document details the failed experiments and unsuccessful approaches attempted during the development of the Habit Helper recommendation system. These failures demonstrate the genuine technological uncertainty faced and the systematic investigation required to find solutions.

## Failed Experiment 1: Simple Weighted Scoring

### Hypothesis
A simple weighted sum of feature matches would provide good recommendations.

### Implementation Attempt
```typescript
private calculateScore(tip: Tip, userProfile: UserProfile): number {
  const goalMatch = this.matchGoals(tip, profile) * 0.3;
  const timeMatch = this.matchTime(tip, profile) * 0.2;
  const difficultyMatch = this.matchDifficulty(tip, profile) * 0.2;
  // Missing weights caused NaN!
  return goalMatch + timeMatch + difficultyMatch;
}
```

### Why It Failed
1. **NaN Propagation**: Missing DIFFICULTY_MATCH weight caused NaN values
2. **No Safety Gates**: Showed cooking tips to non-cooks
3. **Poor Goal Alignment**: Treated all goals equally
4. **No Learning**: Couldn't improve from user feedback

### Actual Error in Production
```
ERROR Error initializing app: [ReferenceError: Property 'DIFFICULTY_MATCH' doesn't exist]
NaN score for tip: "replace cooking oil with spray"
```

### Lessons Learned
- Need defensive programming for undefined values
- Require hierarchical constraints (safety first)
- Must distinguish between hard and soft constraints

## Failed Experiment 2: Neural Network Scoring

### Hypothesis
A small neural network could learn optimal scoring from user feedback.

### Implementation Attempt
```typescript
// Attempted TensorFlow.js implementation
const model = tf.sequential({
  layers: [
    tf.layers.dense({ units: 16, activation: 'relu', inputShape: [12] }),
    tf.layers.dense({ units: 8, activation: 'relu' }),
    tf.layers.dense({ units: 1, activation: 'sigmoid' })
  ]
});

// Convert tip features to tensor
const features = tensorFromTip(tip, profile);
const score = model.predict(features);
```

### Why It Failed
1. **Insufficient Training Data**: New app had <100 user interactions
2. **Cold Start Problem**: Couldn't make recommendations without training
3. **Black Box**: Couldn't explain why tips were recommended
4. **Performance**: 800ms+ inference time on mobile devices
5. **Debugging Nightmare**: Impossible to trace why bad recommendations occurred

### Specific Failure Case
```
User: "Why am I getting alcohol tips while pregnant?"
System: [Neural network output: 0.73]
Debug: Unable to determine reason for score
```

### Lessons Learned
- Need explainable algorithms for safety-critical decisions
- Can't rely on ML without substantial training data
- Mobile performance constraints eliminate complex models

## Failed Experiment 3: Collaborative Filtering

### Hypothesis
Could use collaborative filtering to recommend tips that similar users liked.

### Implementation Attempt
```typescript
// User-Item matrix approach
const userItemMatrix = buildMatrix(users, tips, interactions);
const similarities = cosineSimilarity(currentUser, allUsers);
const recommendations = weightedAverage(similarities, userRatings);
```

### Why It Failed
1. **Sparse Matrix**: 98% empty cells (few users, many tips)
2. **No Similar Users**: Each user unique in goals/conditions
3. **Medical Incompatibility**: "Similar" users had different allergies
4. **New User Problem**: Couldn't recommend to users without history

### Actual Failure
```
User A: [diabetes, vegetarian, nut_allergy]
"Similar" User B: [diabetes, vegetarian] // No nut allergy!
Result: Recommended almond-based tip to User A (DANGEROUS)
```

### Lessons Learned
- Medical conditions make users fundamentally dissimilar
- Need content-based filtering for safety
- Collaborative methods require large user base

## Failed Experiment 4: Rule-Based System

### Hypothesis
Could encode all recommendation logic as explicit rules.

### Implementation Attempt
```typescript
const rules = [
  { if: 'user.has("diabetes")', then: 'exclude("high_sugar")' },
  { if: 'user.kitchen === "microwave"', then: 'exclude("cooking")' },
  { if: 'user.goals.includes("weight_loss")', then: 'boost("low_calorie")' },
  // ... 200+ rules
];

function applyRules(tip, profile, rules) {
  for (const rule of rules) {
    if (evaluate(rule.if, profile)) {
      execute(rule.then, tip);
    }
  }
}
```

### Why It Failed
1. **Rule Explosion**: Needed 200+ rules, still incomplete
2. **Conflicts**: Rules contradicted each other
3. **Maintenance Nightmare**: Every edge case needed new rule
4. **No Adaptation**: Couldn't learn from feedback
5. **Brittle**: Single typo broke entire categories

### Specific Failure
```
Rule 47: if user.has("pregnancy") then exclude("caffeine")
Rule 103: if user.goals.includes("energy") then boost("coffee")
Result: Conflicting rules, system crash
```

### Lessons Learned
- Explicit rules don't scale to complex domains
- Need unified scoring system, not independent rules
- Must handle rule conflicts gracefully

## Failed Experiment 5: Direct State Persistence

### Hypothesis
Could persist all state changes directly to AsyncStorage.

### Implementation Attempt
```typescript
const handleResponse = async (response: string) => {
  // Persist everything immediately
  await AsyncStorage.setItem('currentResponse', response);
  await AsyncStorage.setItem('uiState', JSON.stringify({
    isLoading: true,
    response: response,
    timestamp: Date.now()
  }));
  
  // Then process...
  if (response === 'not_for_me') {
    await findNewTip();
  }
};
```

### Why It Failed
1. **Phantom States**: UI states persisted across app restarts
2. **Race Conditions**: Concurrent writes corrupted state
3. **Infinite Loops**: Reload → Read "loading" → Show spinner forever
4. **Storage Bloat**: UI states accumulated indefinitely

### Actual Production Bug
```
User: "App stuck on spinner after force quit"
Debug log:
- AsyncStorage['uiState']: {isLoading: true, response: 'not_for_me'}
- No active process to clear loading state
- Spinner shown forever
```

### Lessons Learned
- UI state must be transient (React state only)
- Domain state must be persistent (AsyncStorage)
- Never persist intermediate states

## Failed Experiment 6: Optimistic State Updates

### Hypothesis
Could improve UX by optimistically updating state before async operations.

### Implementation Attempt
```typescript
const handleNotForMe = async () => {
  // Optimistic update
  setDailyTip({ ...dailyTip, status: 'replacing' });
  
  try {
    const newTip = await fetchNewTip();
    setDailyTip(newTip);
  } catch (error) {
    // Rollback
    setDailyTip({ ...dailyTip, status: 'error' });
  }
};
```

### Why It Failed
1. **Rollback Complexity**: Hard to restore exact previous state
2. **Partial Updates**: Network failure left inconsistent state
3. **User Confusion**: UI showed success before actual completion
4. **Duplicate Actions**: Users clicked multiple times during "fake" success

### Specific Failure
```
1. User clicks "Not for me"
2. Optimistic: UI shows "Finding new tip..."
3. Network fails at 80% complete
4. Rollback attempts to restore
5. State corrupted: Half old tip, half new tip
6. App crash
```

### Lessons Learned
- Prefer pessimistic updates for critical operations
- Clear loading states better than fake success
- Rollback is harder than it seems

## Failed Experiment 7: Global Event Bus

### Hypothesis
Could coordinate state changes through a global event system.

### Implementation Attempt
```typescript
class EventBus {
  emit(event: string, data: any) {
    listeners[event]?.forEach(fn => fn(data));
  }
}

// Usage throughout app
EventBus.emit('tip.rejected', { tipId, reason });
EventBus.emit('state.update', { dailyTip });
EventBus.emit('ui.loading', true);
```

### Why It Failed
1. **Race Conditions**: Events arrived out of order
2. **Memory Leaks**: Listeners not properly cleaned up
3. **Debugging Hell**: Couldn't trace event flow
4. **Coupling**: Everything depended on everything
5. **Testing Nightmare**: Needed to mock entire event system

### Actual Bug
```
Event sequence that caused crash:
1. 'tip.rejected' → starts replacement
2. 'ui.loading' → shows spinner
3. 'tip.rejected' → starts ANOTHER replacement (duplicate!)
4. 'state.update' → corrupted with two parallel updates
5. App state undefined, crash
```

### Lessons Learned
- Direct function calls better than event indirection
- Explicit data flow easier to debug
- React's built-in state management sufficient

## Failed Experiment 8: Fuzzy String Matching for Allergens

### Hypothesis
Could use Levenshtein distance to match allergen variations.

### Implementation Attempt
```typescript
function matchAllergen(userInput: string, medicalCode: string): boolean {
  const distance = levenshteinDistance(userInput, medicalCode);
  return distance <= 3; // Allow 3 character differences
}

// Example:
matchAllergen("penuts", "peanuts") // true (typo)
matchAllergen("nuts", "nut_allergy") // false (distance > 3)
```

### Why It Failed
1. **False Positives**: "dairy" matched "diary" 
2. **False Negatives**: "nuts" didn't match "nut_allergy"
3. **Language Variations**: "lactose" vs "dairy" vs "milk"
4. **Compound Terms**: "tree nuts" treated as two words
5. **Medical Codes**: Underscores broke matching

### Dangerous Failure Case
```
User input: "shell fish" (with space)
Medical code: "shellfish_allergy"
Levenshtein distance: 9 (FAILED TO MATCH)
Result: Showed shrimp tip to allergic user!
```

### Lessons Learned
- Fuzzy matching too dangerous for medical safety
- Need explicit mapping dictionary
- Conservative approach required (exact matches only)

## Summary of Failed Approaches

| Experiment | Hours Wasted | Why It Failed | Key Learning |
|------------|--------------|---------------|--------------|
| Simple Weighted Scoring | 40 | NaN values, no safety | Need defensive programming |
| Neural Network | 30 | No training data | Need explainable algorithms |
| Collaborative Filtering | 25 | Sparse matrix | Medical uniqueness matters |
| Rule-Based System | 35 | Rule explosion | Unified scoring better |
| Direct State Persistence | 20 | Phantom states | Separate UI/domain state |
| Optimistic Updates | 15 | Rollback complexity | Pessimistic safer |
| Global Event Bus | 20 | Race conditions | Direct calls better |
| Fuzzy String Matching | 15 | False positives | Explicit mapping required |

**Total Time on Failed Experiments**: 200 hours

## Conclusion

These failed experiments were essential to understanding the problem space and discovering what wouldn't work. Each failure provided critical insights that led to the eventual successful solutions:

1. **F1 Scoring**: Emerged from weighted scoring failure
2. **Transient State Pattern**: Discovered through persistence failures
3. **Explicit Allergen Mapping**: Result of fuzzy matching dangers
4. **Hierarchical Constraints**: Learned from rule system chaos

The systematic documentation and analysis of these failures demonstrates the genuine technological uncertainty faced and the scientific approach taken to resolve it.