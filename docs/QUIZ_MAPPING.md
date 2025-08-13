# Quiz Question ID Mapping Documentation

## Quiz Question IDs
These are the actual question IDs used in the quiz system:

### Main Questions
- `real_talk` - Vegetable relationship
- `non_negotiables` - Foods user won't give up  
- `diet_history` - Past diet attempts
- `life_chaos` - Life stage/chaos level
- `health_stuff` - Medical conditions
- `which_allergies` - Food allergies (conditional)
- `real_goals` - Health goals
- `kitchen_reality` - Kitchen skills (NOT 'kitchen_skills')
- `cooking_interest` - Interest in learning to cook (conditional)
- `meal_time_truth` - Meal prep reality
- `eating_personality` - Eating patterns/challenges
- `money_truth` - Budget consciousness
- `experiment_style` - Difficulty preference
- `home_situation` - Family/living situation
- `biggest_obstacle` - Main challenge
- `reminder_style` - Notification preferences

## Important Notes

### Kitchen Skills
- The question ID is `kitchen_reality` NOT `kitchen_skills`
- Values: `microwave_master`, `basic`, `follow_recipe`, `confident`, `chef`, `no_kitchen`
- Maps to `profile.cooking_time_available`: `none`, `minimal`, `moderate`, `plenty`

### Conditional Questions
- `cooking_interest` only shows when `kitchen_reality` is `microwave_master`, `basic`, or `no_kitchen`
- `which_allergies` only shows when `health_stuff` includes `allergies`

## Profile Mapping

### Medical Conditions Mapping
- Quiz `health_stuff` values map to `profile.medical_conditions`:
  - `diabetes` → `t2_diabetes`
  - `heart` → `hypertension`
  - `digestive` → `ibs`
  - `pregnancy` → `pregnancy`
  - `breastfeeding` → `breastfeeding`

### Allergy Mapping
- Quiz `which_allergies` values map to `profile.medical_conditions`:
  - `nuts` → `nut_allergy`
  - `dairy` → `lactose_intolerance`
  - `gluten` → `celiac`
  - `eggs` → `egg_allergy`
  - `seafood` → `fish_allergy`, `shellfish_allergy`
  - `soy` → `soy_allergy`

### Goals Mapping
- Quiz `real_goals` values map to `profile.goals`:
  - `look_good`, `clothes_fit` → `weight_loss`
  - `more_energy` → `improve_energy`
  - `health_scare` → `better_lipids`, `lower_blood_pressure`
  - `less_bloated` → `improve_gut_health`
  - `athletic` → `endurance_performance`, `strength_performance`
  - `keep_up_kids`, `just_healthier` → `improve_energy`, `increase_veggies`

## Usage in Tip Recommendation

When accessing quiz responses in the tip recommendation service:
```typescript
// Correct way to access kitchen skills:
const kitchenSkills = userProfile.quiz_responses?.find(r => r.questionId === 'kitchen_reality')?.value;

// NOT this (wrong):
// const kitchenSkills = userProfile.quiz_responses?.find(r => r.questionId === 'kitchen_skills')?.value;
```

## Key Checks for Non-Cooks

For users who indicate minimal cooking skills (`microwave_master` or `no_kitchen`):
1. Check `cooking_interest` for their willingness to learn
2. Apply heavy penalties for tips requiring:
   - `cooking_skill_required` that's not `none` or `microwave`
   - `kitchen_equipment` including `basic_stove` or `full_kitchen`
   - High `physical_effort` or `time_cost_enum` in kitchen

## Debugging Tips

If cooking tips are still showing for non-cooks:
1. Verify `quiz_responses` are loaded in the user profile
2. Check that `kitchen_reality` (not `kitchen_skills`) is being accessed
3. Ensure the cooking_interest conditional question was answered
4. Check tip penalties are being applied for cooking requirements