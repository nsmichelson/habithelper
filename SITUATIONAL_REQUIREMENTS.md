# Situational Requirements for Tips

## Analysis of Tips That Require Specific Situations

After reviewing the tips database, here are the key situational requirements that could make a tip impossible on a given day:

### 1. **Social Situations Required**
- Tips that require meeting with friends/colleagues (e.g., "Suggest a walk instead of coffee")
- Tips requiring dining companions
- Tips needing social events or gatherings
- **Rejection reason needed**: "No social plans today"

### 2. **Location-Specific Requirements**
- **Restaurant tips**: Tips that only work when eating out
  - "Ask for dressing on the side"
  - "Order appetizer as main course"
  - **Rejection reason needed**: "Not eating out today"
  
- **Home-only tips**: Tips requiring home kitchen access
  - Meal prep tips
  - Cooking experiments
  - **Rejection reason needed**: "Not home today" / "Traveling"

- **Work/office tips**: Tips for workplace settings
  - "Pack lunch the night before"
  - "Keep healthy snacks in desk drawer"
  - **Rejection reason needed**: "Not at office today" / "Working from home"

### 3. **Shopping/Grocery Requirements**
- Tips requiring grocery shopping that day
  - "Buy rotisserie chicken during weekly shop"
  - "Read labels while shopping"
  - **Rejection reason needed**: "Not shopping today"

### 4. **Equipment/Kitchen Tool Requirements**
- Tips needing specific equipment
  - Blender (for smoothies, nice cream)
  - Air popper (for popcorn)
  - Food processor
  - **Rejection reason needed**: "Don't have the equipment"

### 5. **Ingredient Requirements**
- Tips requiring specific ingredients not commonly on hand
  - Greek yogurt swaps
  - Specific vegetables
  - Specialty items
  - **Rejection reason needed**: "Don't have ingredients"

### 6. **Time-of-Day Specific**
- Morning-only tips (breakfast related)
- Evening-only tips (dinner prep, teeth brushing after dinner)
- **Rejection reason needed**: "Wrong time of day"

### 7. **Advance Planning Required**
- Tips requiring prep the night before
  - Overnight oats
  - Meal prep
  - Pre-cutting vegetables
  - **Rejection reason needed**: "Didn't prepare ahead"

### 8. **Weather/Season Dependent**
- Outdoor walking tips
- Seasonal produce tips
- **Rejection reason needed**: "Weather doesn't permit"

### 9. **Family/Household Coordination**
- Tips requiring family participation
- Tips that affect shared spaces (hiding snacks)
- **Rejection reason needed**: "Family/roommates not on board"

### 10. **Health/Physical Ability**
- Tips requiring physical activity
- Tips not suitable during illness
- **Rejection reason needed**: "Not feeling well" / "Physical limitations today"

## Recommended New Rejection Reasons to Add

Based on this analysis, we should add these situational blockers to the rejection reasons:

### Immediate Circumstances (NEW CATEGORY)
```javascript
{
  value: 'wrong_situation',
  label: "Not in the right situation today",
  icon: 'calendar-outline',
  emoji: '📅',
  followUps: [
    { label: "No social plans today", value: 'no_social_plans', emoji: '👤' },
    { label: "Not eating out today", value: 'not_eating_out', emoji: '🏠' },
    { label: "Not at home today", value: 'not_home', emoji: '✈️' },
    { label: "Not at the office today", value: 'not_at_office', emoji: '🏠' },
    { label: "Not grocery shopping today", value: 'no_shopping', emoji: '🛒' },
    { label: "Wrong time of day for this", value: 'wrong_time', emoji: '⏰' },
    { label: "Weather doesn't permit", value: 'bad_weather', emoji: '🌧️' },
    { label: "Didn't prepare ahead for this", value: 'not_prepared', emoji: '📝' },
    { label: "Not feeling well today", value: 'feeling_sick', emoji: '🤒' },
    { label: "Traveling/on the go", value: 'traveling', emoji: '✈️' },
  ]
}
```

### Equipment/Ingredients (UPDATE EXISTING)
Update the existing "no_access" and "no_equipment" categories to include:
- "Don't have these specific ingredients today"
- "Kitchen not available right now"
- "Equipment is broken/unavailable"

## Tips That Need Special Handling

These tips have very specific requirements that should trigger contextual rejection reasons:

1. **"Suggest a walk instead of coffee"** → Needs "No social plans today"
2. **"Buy rotisserie chicken during shop"** → Needs "Not shopping today"  
3. **"Brush teeth after dinner"** → Needs "Wrong time of day" if shown in morning
4. **"Pack lunch night before"** → Needs "Didn't prepare ahead"
5. **Restaurant-specific tips** → Need "Not eating out today"
6. **Outdoor activity tips** → Need "Weather doesn't permit"

## Implementation Notes

- These situational blockers should appear FIRST in the rejection list when relevant
- They're different from other rejections because they're temporary (today only)
- The tip might be perfect for the user, just not possible TODAY
- Consider tracking these separately - if user selects "not eating out today", that tip could be perfect for tomorrow if they ARE eating out