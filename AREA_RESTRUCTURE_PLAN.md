# Area Restructuring Plan for HabitHelper

## Current vs Proposed Structure

### CURRENT Areas (Broken)
```
Database Reality:
- nutrition (176 tips)
- stress (192 tips - actually mindset content)
- organization (80 tips)
- relationships (10 tips)
- fitness (0 tips - missing!)

Quiz Options (from memory):
- Improve nutrition
- Look and feel better
- Improve energy levels
- Improve fitness
- Improve relationships
- [No mindset option]
- [Sleep somewhere?]
- Productivity/effectiveness
```

### PROPOSED Areas (Clean & Clear)
```
1. eating          → "Eating habits"
2. exercise        → "Exercise and movement" (display as "Exercise and fitness")
3. relationships   → "Relationships and social life"
4. mindset         → "Mindset and mood"
5. sleep           → "Sleeping better"
6. productivity    → "Productivity & organization"
```

## Migration Requirements

### 1. Tip Database Updates

**Current Distribution:**
- 176 nutrition tips → `eating`
- 192 stress tips → `mindset`
- 80 organization tips → `productivity`
- 10 relationships tips → `relationships`
- 0 fitness tips → need to add or find exercise tips

**Files to Update:**
- `/data/simplifiedTips.ts` - Update area field for base tips
- `/data/mindsetSimplifiedTips.ts` - Change line 145 from `area: 'stress'` to `area: 'mindset'`
- `/data/productivitySimplifiedTips.ts` - Change from `organization` to `productivity`
- `/data/relationshipsSimplifiedTips.ts` - Keep as `relationships`

### 2. Service Updates

**tipRecommendation.ts (lines 127-140):**
```typescript
// OLD mapping
const areaMap: Record<string, string> = {
  'eating': 'nutrition',
  'exercise': 'fitness',
  'sleeping': 'nutrition',     // Wrong!
  'productivity': 'organization',
  'mindset': 'relationships',  // Wrong!
  // etc...
};

// NEW mapping (simplified!)
const areaMap: Record<string, string> = {
  'eating': 'eating',
  'exercise': 'exercise',
  'sleep': 'sleep',
  'sleeping': 'sleep',
  'productivity': 'productivity',
  'mindset': 'mindset',
  'relationships': 'relationships',
  // Remove energy, look_feel, health mappings
};
```

### 3. Quiz Updates Needed

**OnboardingQuizNew.tsx - Update primary_focus options:**
```typescript
// Find the question about primary focus
// Update options to:
const focusOptions = [
  { value: 'eating', label: 'Eating habits' },
  { value: 'exercise', label: 'Exercise and fitness' },
  { value: 'relationships', label: 'Relationships and social life' },
  { value: 'mindset', label: 'Mindset and mood' },
  { value: 'sleep', label: 'Sleeping better' },
  { value: 'productivity', label: 'Productivity & organization' }
];
```

### 4. Goal Mappings Impact

**goalMappings.ts categories need updating:**
```typescript
// Current categories:
'eating' | 'sleep' | 'productivity' | 'exercise' | 'mindset' | 'relationships'

// These actually align well with your new structure!
// Just need to ensure quiz values match
```

### 5. UI Display Names

Create a display name mapping:
```typescript
export const AREA_DISPLAY_NAMES = {
  'eating': 'Eating Habits',
  'exercise': 'Exercise & Fitness',
  'relationships': 'Relationships & Social Life',
  'mindset': 'Mindset & Mood',
  'sleep': 'Sleep',
  'productivity': 'Productivity & Organization'
};
```

## Migration Steps

### Phase 1: Update Tip Areas (Backend)
1. Update mindsetSimplifiedTips.ts → area: 'mindset'
2. Update all organization tips → area: 'productivity'
3. Update all nutrition tips → area: 'eating'
4. Verify relationships tips stay as 'relationships'

### Phase 2: Update Service Layer
1. Simplify areaMap in tipRecommendation.ts
2. Remove complex mappings for health/energy/look_feel
3. Test that each profile type gets appropriate tips

### Phase 3: Update Quiz (Frontend)
1. Update OnboardingQuizNew.tsx with new options
2. Remove "Look and feel better" option
3. Remove "Improve energy levels" option
4. Add "Mindset and mood" option
5. Ensure "Sleeping better" is its own option

### Phase 4: Add Missing Content
1. **CRITICAL**: Add exercise/fitness tips (currently 0!)
2. Consider adding sleep-specific tips
3. Ensure mindset tips are properly tagged

## Benefits of This Restructure

1. **Clear Categories**: No more confusion about what "look and feel better" means
2. **Direct Mapping**: area names match primary_focus values (no translation needed)
3. **Complete Coverage**: Every major behavior change category is represented
4. **No Overlap**: Energy and appearance goals become part of specific areas
5. **Fixes Current Bugs**:
   - Mike will get exercise tips (once added)
   - Alex will get sleep tips (once added/mapped)
   - Mindset users get mindset tips (not relationship tips)

## Testing After Migration

Test each profile type:
- Eating → Should get eating tips ✓
- Exercise → Should get exercise tips (need to add!)
- Sleep → Should get sleep tips (or mindset/stress tips for now)
- Mindset → Should get mindset tips ✓
- Productivity → Should get productivity tips ✓
- Relationships → Should get relationship tips ✓

## Immediate Win

Just fixing the mindset area (`stress` → `mindset`) and the areaMap will immediately improve recommendations for most users!