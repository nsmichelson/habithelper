# Habit Helper Tip Dimensions Documentation

This document describes all the dimensions used to categorize and personalize nutrition experiment tips in the Habit Helper app.

## Core Dimensions (Original)

### Medical & Safety
- **contraindications**: Medical conditions that make this tip unsafe (e.g., 'pregnancy', 'diabetes', 'allergies')
- **goal_tags**: Health goals this tip supports (e.g., 'weight_loss', 'improve_energy', 'reduce_sugar')

### Tip Characteristics
- **tip_type**: The behavior change mechanism (e.g., 'healthy_swap', 'habit_stacking', 'mindset_shift')
- **motivational_mechanism**: What makes this tip psychologically rewarding (e.g., 'sensory', 'mastery', 'comfort')
- **difficulty_tier**: 1-5 scale of how challenging this tip is to implement

### Time & Cost
- **time_cost_enum**: Time required ('0_5_min', '5_15_min', '15_60_min', '>60_min')
- **money_cost_enum**: Cost level ('$' = free/cheap, '$$' = moderate, '$$$' = expensive)
- **mental_effort**: 1-5 scale of mental energy/focus needed
- **physical_effort**: 1-5 scale of physical exertion required

### Context
- **location_tags**: Where this tip can be done (e.g., 'home', 'work', 'restaurant')
- **social_mode**: 'solo', 'group', or 'either'
- **time_of_day**: When tip is most relevant ('morning', 'afternoon', 'evening', 'late_night')
- **cue_context**: Situational triggers (e.g., 'meal_time', 'craving_event', 'stress')

## New Personality-Aware Dimensions

### Food Relationship
- **involves_foods**: Foods that are part of this tip (e.g., ['dairy', 'meat'])
- **preserves_foods**: Non-negotiable foods you can still enjoy with this tip (e.g., ['chocolate', 'coffee'])
  - Important for protecting users' food "kryptonites" they won't give up

### Vegetable Approach
- **veggie_intensity**: How veggie-heavy this tip is
  - 'none': No vegetables involved
  - 'hidden': Vegetables are disguised/invisible
  - 'light': Small amount of vegetables
  - 'moderate': Noticeable but not dominant vegetables
  - 'heavy': Vegetables are the main focus
  - 'not_applicable': Tip doesn't involve food

- **veggie_strategy**: How vegetables are incorporated
  - 'not_applicable': No vegetables
  - 'disguised': Hidden in other foods
  - 'gradual': Building up slowly
  - 'mixed_in': Combined with other foods
  - 'front_and_center': Vegetables are the star

### Family & Social Compatibility
- **family_friendly**: boolean - Works well in family settings
- **kid_approved**: boolean - Kids typically like this
- **partner_resistant_ok**: boolean - Works even if partner isn't on board
- **works_with**: array - Compatible with specific eaters (e.g., ['picky_eaters', 'teenagers'])

### Life Chaos Tolerance
- **chaos_level_max**: 1-5 scale - Maximum life chaos where this still works
  - 1: Needs total calm/control
  - 2: Needs relatively stable environment
  - 3: Works with moderate chaos
  - 4: Works in busy life
  - 5: Works even in complete chaos/crisis mode

### Planning & Preparation
- **requires_planning**: boolean - Needs advance thought
- **impulse_friendly**: boolean - Can do spontaneously without prep
- **requires_advance_prep**: boolean - Needs physical prep ahead of time
- **prep_timing**: When prep needs to happen
  - 'immediate': Can do right now
  - 'night_before': Prep evening before
  - 'weekend_required': Need weekend batch prep
  - 'none_needed': No prep required
- **shelf_life**: How long prepped items last
  - 'use_immediately': Must use right away
  - 'lasts_2_3_days': Good for a few days
  - 'lasts_week': Stays good all week
  - 'freezer_friendly': Can freeze for later

### Diet Trauma Sensitivity
- **diet_trauma_safe**: boolean - Won't trigger diet culture trauma
- **feels_like_diet**: boolean - Might feel restrictive/diety
- **sustainability**: Long-term viability
  - 'one_time': Just try once
  - 'occasionally': Do sometimes
  - 'daily_habit': Can do forever

### Kitchen Reality
- **kitchen_equipment**: What's needed in kitchen
  - 'none': No equipment needed
  - 'microwave_only': Just need microwave
  - 'basic_stove': Need stovetop
  - 'full_kitchen': Need oven + stove
  - 'blender': Need blender/processor
  - 'instant_pot': Need pressure cooker

- **cooking_skill_required**: Cooking ability needed
  - 'none': No cooking
  - 'microwave': Can heat things
  - 'basic': Can boil/scramble
  - 'intermediate': Can follow recipes
  - 'advanced': Comfortable improvising

### Eating Challenges
- **helps_with**: Specific eating patterns this addresses
  - 'grazing': Constant snacking
  - 'speed_eating': Eating too fast
  - 'emotional_eating': Eating for feelings
  - 'night_eating': Late night snacking
  - 'boredom_eating': Eating when bored
  - 'stress_eating': Stress-triggered eating
  - 'social_eating': Peer pressure eating
  - 'mindless_eating': Unconscious eating
  - 'sugar_addiction': Sugar cravings

### Sensory & Satisfaction
- **texture_profile**: Food textures involved (e.g., ['crunchy', 'creamy', 'chewy'])
- **satisfies_craving**: What cravings this helps with (e.g., ['sweet', 'salty', 'chocolate'])
- **substitution_quality**: How good the substitute is
  - 'exact_match': Just as good
  - 'close_enough': Pretty similar
  - 'different_but_good': Different but satisfying
  - 'not_substitute': Not really a replacement

### Success Predictors
- **cognitive_load**: 1-5 scale - Mental bandwidth needed
  - 1: Automatic/no thought
  - 2: Minimal attention
  - 3: Some focus needed
  - 4: Requires concentration
  - 5: Mentally demanding

- **common_failure_points**: Where people typically struggle
  - 'requires_willpower': Needs self-control
  - 'easy_to_forget': Often forgotten
  - 'socially_awkward': Weird in social settings
  - 'family_resistance': Family pushback
  - 'bad_weather': Weather dependent
  - 'time_constraints': Often not enough time

## How These Dimensions Work Together

The recommendation algorithm uses these dimensions to:

1. **Filter out unsafe tips** based on contraindications
2. **Match goals** to what the user wants to achieve
3. **Protect non-negotiables** - avoiding tips that conflict with foods they won't give up
4. **Match life reality** - chaos level, family situation, kitchen setup
5. **Respect past trauma** - avoiding "diety" tips for those with diet history
6. **Consider current state** - cognitive load for overwhelmed users
7. **Predict success** - matching to eating challenges and avoiding known failure points

## Example Usage

A user who:
- Has young kids (chaos_level_max needs to be 4+)
- Won't give up chocolate (preserves_foods should include 'chocolate')
- Hates vegetables (veggie_intensity should be 'none' or 'hidden')
- Has diet trauma (diet_trauma_safe should be true, feels_like_diet should be false)

Would get tips that work in chaos, let them keep chocolate, hide/skip veggies, and feel gentle/sustainable rather than restrictive.