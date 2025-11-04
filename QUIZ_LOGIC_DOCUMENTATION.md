# Quiz Conditional Logic Documentation

## Overview
The quiz uses a dynamic conditional system where questions appear based on previous answers. This ensures users only see relevant questions for their specific journey.

## How The System Works

### 1. Core Components

#### Question Structure
Every question has:
- **id**: Unique identifier
- **conditionalOn**: Optional rule for when to show it
  - `questionId`: Which previous question to check
  - `values`: What answers trigger this question

#### The Filtering Function
`getConditionalQuestions()` runs after each answer to:
1. Take all user responses so far
2. Check each question's conditions
3. Return only questions that should be visible

### 2. Question Flow Paths

## PATH 1: ENERGY
```
primary_motivation = "energy"
    ↓
energy_specifics (10 options like sleep, hydration, stress)
    ↓
Branches into specific "why" questions:
    - sleep_why (if chose sleep goals)
    - hydration_why (if chose water)
    - energy_nutrition_why (if chose food-related)
    - stress_energy_why (if chose stress)
    ↓
what_worked_energy
    ↓
what_to_avoid_energy
    ↓
barriers_energy
    ↓
things_you_love
    ↓
additional_context
```

## PATH 2: RELATIONSHIPS
```
primary_motivation = "relationships"
    ↓
relationship_specifics (11 options)
    ↓
relationship_why (general - always shows)
    +
Specific "why" questions based on selection:
    - communication_why (if chose communication)
    - quality_time_why (if chose time together)
    - boundaries_why (if chose boundaries)
    - social_connections_why (if chose friendships)
    - conflict_resolution_why (if chose conflicts)
    - listening_skills_why (if chose listening)
    - work_life_balance_why (if chose balance)
    - dating_confidence_why (if chose dating)
    ↓
what_worked_romantic OR what_worked_friendships (based on specifics)
    ↓
what_to_avoid_romantic OR what_to_avoid_friendships
    ↓
barriers_relationships
    ↓
things_you_love
    ↓
additional_context
```

## PATH 3: EFFECTIVENESS/PRODUCTIVITY
```
primary_motivation = "effectiveness"
    ↓
effectiveness_specifics (11 options)
    ↓
productivity_why (general - always shows)
    +
Specific "why" questions:
    - procrastination_why
    - focus_improvement_why
    - organization_why
    - time_management_why
    - completion_why
    - routine_building_why
    - overwhelm_why
    - prioritization_why
    - mindset_stress_why
    ↓
what_worked_productivity
    ↓
what_to_avoid_productivity
    ↓
barriers_productivity
    ↓
things_you_love
    ↓
additional_context
```

## PATH 4: FITNESS
```
primary_motivation = "fitness"
    ↓
fitness_specifics (11 options)
    ↓
exercise_why (general - always shows)
    +
Specific "why" questions:
    - cardio_endurance_why
    - flexibility_why
    - start_exercise_why
    - home_workout_why
    - active_lifestyle_why
    - workout_consistency_why
    ↓
what_worked_fitness
    ↓
what_to_avoid_fitness
    ↓
barriers_fitness
    ↓
things_you_love
    ↓
additional_context
```

## PATH 5: HEALTH
```
primary_motivation = "health"
    ↓
health_specifics (11 options)
    ↓
Specific "why" questions based on selection:
    - blood_sugar_why
    - blood_pressure_why
    - gut_health_why
    - inflammation_why
    - cholesterol_why
    - quit_alcohol_why
    - (uses stress/sleep questions for those goals)
    ↓
what_worked_nutrition (shared with nutrition path)
    ↓
what_to_avoid_nutrition
    ↓
barriers_health
    ↓
things_you_love
    ↓
additional_context
```

## PATH 6: NUTRITION
```
primary_motivation = "nutrition"
    ↓
nutrition_specifics (15 options)
    ↓
Multiple specific "why" questions:
    - nutrition_hydration_why (if chose water)
    - veggies_why (if chose vegetables/fiber)
    - mindful_eating_why (if chose portions/mindful/binge)
    - cooking_why (if chose cooking/planning)
    - nutrition_why (fallback for other nutrition goals)
    ↓
what_worked_nutrition
    ↓
what_to_avoid_nutrition
    ↓
barriers_nutrition
    ↓
things_you_love
    ↓
additional_context
```

## PATH 7: LOOK & FEEL BETTER
```
primary_motivation = "look_feel"
    ↓
look_feel_specifics (12 options)
    ↓
Specific "why" questions:
    - weight_loss_why
    - muscle_strength_why
    - bloating_why
    - skin_appearance_why
    - confidence_why
    - (uses fitness questions for exercise goals)
    - (uses sleep questions for sleep goals)
    ↓
what_worked (nutrition or fitness based on goals)
    ↓
what_to_avoid (nutrition or fitness based)
    ↓
barriers_look_feel
    ↓
things_you_love
    ↓
additional_context
```

## 3. Question Coverage Analysis

### Total Questions by Category:
- **Primary Motivation**: 1 question (always shows)
- **Specific Goals**: 7 variants (one per motivation)
- **Why Questions**:
  - 3 general (exercise, productivity, relationships)
  - 49 specific conditional variants
- **What Worked**: 8 variants
- **What to Avoid**: 8 variants
- **Current Barriers**: 8 variants
- **Things You Love**: 1 question (always shows)
- **Additional Context**: 1 question (always shows)

### Conditional Logic Rules:

1. **Always Show** (no conditions):
   - primary_motivation
   - things_you_love
   - additional_context

2. **First-Level Conditional** (based on primary_motivation):
   - All _specifics questions
   - All what_worked variants
   - All what_to_avoid variants
   - All barriers variants
   - General why questions (exercise_why, productivity_why, relationship_why)

3. **Second-Level Conditional** (based on specific goals selected):
   - All specific "why" questions (49 variants)

## 4. How Questions Are Selected

The `getConditionalQuestions()` function:

```javascript
function getConditionalQuestions(responses) {
  // Create a map of all user responses
  responseMap = {
    "primary_motivation": ["relationships"],
    "relationship_specifics": ["improve_communication"]
  }

  // Filter all questions
  return QUIZ_QUESTIONS.filter(question => {
    // Always show if no condition
    if (!question.conditionalOn) return true;

    // Check if condition is met
    userAnswer = responseMap.get(question.conditionalOn.questionId)
    requiredValues = question.conditionalOn.values

    // Show if user's answer matches any required value
    return requiredValues.includes(userAnswer)
  })
}
```

## 5. Potential Gaps & Edge Cases

### Currently Handled Well:
✅ Each primary motivation has specific follow-ups
✅ Multiple "why" questions can show if user selects multiple goals
✅ Questions adapt to combinations (e.g., selecting both "sleep" and "stress")
✅ Friendship vs romantic relationship paths are separate

### Potential Improvements:
1. **Missing "why" questions** for some health goals (regular_checkups has no specific why)
2. **Overlap handling**: If someone picks overlapping goals (e.g., "manage_stress" appears in multiple paths), they might see similar questions
3. **Order optimization**: Questions appear in file order, not necessarily the most logical flow

## 6. How The UI Handles This

1. **After each answer**:
   - Save the response
   - Recalculate all available questions
   - Find the next unanswered question
   - Navigate to it

2. **Progress tracking**:
   - Shows "Question X of Y"
   - Y changes dynamically as questions are added/removed

3. **Navigation**:
   - Back button maintains state
   - Can revisit and change answers
   - Conditional questions update accordingly

## 7. Testing Recommendations

To ensure full coverage:

1. **Test each primary path** (7 total)
2. **Test multi-select combinations** within each path
3. **Test edge cases**:
   - Selecting all options
   - Selecting minimal options
   - Going back and changing primary motivation
4. **Verify no orphaned questions** (questions that can never be reached)

## Summary

The system is quite robust with:
- **7 primary paths**
- **52+ conditional "why" questions**
- **Dynamic adaptation** based on multi-select choices
- **Proper separation** of concerns (fitness vs nutrition, etc.)

The main strength is that users only see relevant questions. The main complexity is ensuring all combinations are properly covered with appropriate follow-up questions.