export type MedicalContraindication = 
  | 'pregnancy'
  | 'breastfeeding'
  | 't1_diabetes'
  | 't2_diabetes'
  | 'hypertension'
  | 'celiac'
  | 'nut_allergy'
  | 'shellfish_allergy'
  | 'egg_allergy'
  | 'fish_allergy'
  | 'soy_allergy'
  | 'lactose_intolerance'
  | 'ibs'
  | 'phenylketonuria'
  | 'kidney_disease'
  | 'elderly_frailty'
  | 'disabled_swallowing';

export type GoalTag = 
  | 'weight_loss'
  | 'muscle_gain'
  | 'reduce_sugar'
  | 'improve_hydration'
  | 'better_lipids'
  | 'less_processed_food'
  | 'increase_veggies'
  | 'plant_based'
  | 'endurance_performance'
  | 'strength_performance'
  | 'healthy_pregnancy'
  | 'improve_energy'
  | 'lower_blood_pressure'
  | 'improve_gut_health';

export type TipType = 
  | 'healthy_swap'
  | 'crave_buster'
  | 'planning_ahead'
  | 'environment_design'
  | 'skill_building'
  | 'mindset_shift'
  | 'habit_stacking'
  | 'time_ritual'
  | 'mood_regulation'
  | 'self_monitoring';

export type MotivationalMechanism = 
  | 'sensory'
  | 'social'
  | 'novelty'
  | 'mastery'
  | 'decision_ease'
  | 'comfort'
  | 'energy_boost';

export type TimeCost = '0_5_min' | '5_15_min' | '15_60_min' | '>60_min';
export type MoneyCost = '$' | '$$' | '$$$';

export type LocationTag = 
  | 'home'
  | 'work'
  | 'commute'
  | 'travel'
  | 'restaurant'
  | 'social_event';

export type SocialMode = 'solo' | 'group' | 'either';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'late_night';

export type CueContext = 
  | 'meal_time'
  | 'snack_time'
  | 'craving_event'
  | 'grocery_shopping'
  | 'boredom'
  | 'stress';

export type ContentSource = 
  | 'dietitian_reviewed'
  | 'coach_curated'
  | 'community_submitted'
  | 'ai_generated';

export type FoodItem = 
  | 'chocolate'
  | 'cheese'
  | 'coffee'
  | 'bread'
  | 'pasta'
  | 'sugar'
  | 'soda'
  | 'alcohol'
  | 'dairy'
  | 'meat'
  | 'carbs';

export type VeggieIntensity = 'none' | 'hidden' | 'light' | 'moderate' | 'heavy';
export type VeggieStrategy = 'not_applicable' | 'disguised' | 'gradual' | 'mixed_in' | 'front_and_center';

export type PrepTiming = 'immediate' | 'night_before' | 'weekend_required' | 'none_needed';
export type ShelfLife = 'use_immediately' | 'lasts_2_3_days' | 'lasts_week' | 'freezer_friendly';

export type EatingChallenge = 
  | 'grazing'
  | 'speed_eating'
  | 'emotional_eating'
  | 'night_eating'
  | 'boredom_eating'
  | 'stress_eating'
  | 'social_eating'
  | 'mindless_eating';

export type TextureProfile = 'crunchy' | 'creamy' | 'chewy' | 'smooth' | 'crispy' | 'soft';

export type KitchenEquipment = 
  | 'none'
  | 'microwave_only'
  | 'basic_stove'
  | 'full_kitchen'
  | 'blender'
  | 'instant_pot';

export type CookingSkill = 'none' | 'microwave' | 'basic' | 'intermediate' | 'advanced';

export type CravingType = 'sweet' | 'salty' | 'crunchy' | 'creamy' | 'chocolate' | 'cheese' | 'carbs';
export type SubstitutionQuality = 'exact_match' | 'close_enough' | 'different_but_good' | 'not_substitute';

export interface Tip {
  tip_id: string;
  summary: string;
  details_md: string;
  contraindications: MedicalContraindication[];
  goal_tags: GoalTag[];
  tip_type: TipType[];
  motivational_mechanism: MotivationalMechanism[];
  time_cost_enum: TimeCost;
  money_cost_enum: MoneyCost;
  mental_effort: number; // 1-5
  physical_effort: number; // 1-5
  location_tags: LocationTag[];
  social_mode: SocialMode;
  time_of_day: TimeOfDay[];
  cue_context?: CueContext[];
  difficulty_tier: number; // 1-5
  created_by: ContentSource;
  
  // NEW: Food relationship dimensions
  involves_foods?: FoodItem[]; // Foods that are part of this tip
  preserves_foods?: FoodItem[]; // Foods you can still enjoy with this tip
  
  // NEW: Vegetable approach
  veggie_intensity?: VeggieIntensity;
  veggie_strategy?: VeggieStrategy;
  
  // NEW: Family/social compatibility
  family_friendly?: boolean;
  kid_approved?: boolean;
  partner_resistant_ok?: boolean; // Works even if partner isn't on board
  works_with?: string[]; // ['picky_eaters', 'teenagers', 'traditional_eaters']
  
  // NEW: Prep and timing reality
  requires_advance_prep?: boolean;
  prep_timing?: PrepTiming;
  shelf_life?: ShelfLife;
  
  // NEW: Eating personality specific
  helps_with?: EatingChallenge[];
  texture_profile?: TextureProfile[];
  
  // NEW: Life chaos compatibility
  chaos_level_max?: number; // 1-5, max chaos level where this still works
  requires_planning?: boolean;
  impulse_friendly?: boolean; // Can do this spontaneously
  
  // NEW: Diet history sensitive
  diet_trauma_safe?: boolean; // Not extreme or restrictive
  sustainability?: 'one_time' | 'occasionally' | 'daily_habit';
  feels_like_diet?: boolean; // Does this feel restrictive/diety?
  
  // NEW: Kitchen reality
  kitchen_equipment?: KitchenEquipment[];
  cooking_skill_required?: CookingSkill;
  
  // NEW: Craving and substitution
  satisfies_craving?: CravingType[];
  substitution_quality?: SubstitutionQuality;
  
  // NEW: Success predictors
  common_failure_points?: string[]; // ['requires_willpower', 'easy_to_forget', 'socially_awkward']
  cognitive_load?: number; // 1-5, mental energy needed
  
  // NEW: Personalization/Planning
  personalization_prompt?: string; // Question/prompt for the "Make It Your Own" card
  personalization_type?: 'text' | 'scale' | 'choice' | 'multi_text'; // Type of input needed
  personalization_placeholder?: string | string[]; // Placeholder text for inputs
}

export type TipFeedback = 
  | 'went_great' 
  | 'went_ok' 
  | 'not_for_me'  // permanent opt-out (replaces 'not_great')
  | 'maybe_later'  // snooze for later
  | 'skipped';     // saw it but didn't act (replaces 'didnt_try')

export interface TipAttempt {
  id: string;
  tip_id: string;
  attempted_at: Date;
  created_at?: Date | string; // hydrate to Date on read
  updated_at?: Date | string; // Track when feedback was updated
  feedback?: TipFeedback | 'maybe_later' | 'not_for_me';
  notes?: string;
  // For maybe_later
  snooze_until?: Date | string;
  // For not_for_me - why they didn't want it (can include follow-up details separated by colon)
  rejection_reason?: string;
}

export interface UserProfile {
  id: string;
  created_at: Date;
  onboarding_completed: boolean;
  
  // Medical conditions
  medical_conditions: MedicalContraindication[];
  
  // Goals
  goals: GoalTag[];
  goal_weights?: Record<string, number>; // Priority weights for goals (e.g., {reduce_sugar: 2, improve_energy: 1})
  
  // Lifestyle preferences
  cooking_time_available?: 'none' | 'minimal' | 'moderate' | 'plenty';
  eating_locations?: string[];
  budget_conscious?: boolean;
  
  // Food preferences
  dietary_preferences?: string[];
  veggie_preference?: 'avoid' | 'hide_them' | 'neutral' | 'love_them'; // Explicit veggie preference
  likes_variety?: boolean;
  cultural_preferences?: string[];
  
  // Dietary restrictions
  allergies?: string[]; // Simple food allergens (e.g., 'nuts', 'dairy', 'gluten', 'eggs', 'soy', 'seafood')
  dietary_rules?: Array<'vegetarian' | 'vegan' | 'halal' | 'kosher' | 'pescatarian' | 'gluten_free' | 'lactose_free'>;
  
  // Demographics
  age_range?: string;
  life_stage?: string[];
  
  // Learning preferences
  wants_to_learn_cooking?: boolean;
  interested_in_nutrition_facts?: boolean;
  
  // New fields from fun quiz
  difficulty_preference?: string;
  non_negotiables?: string[]; // Foods they won't give up
  eating_personality?: string[];
  biggest_obstacle?: string;
  home_situation?: string[];
  
  // New comprehensive quiz fields
  successful_strategies?: string[]; // What worked for them before
  failed_approaches?: string[]; // What didn't work (to avoid)
  daily_life_persona?: string; // parent_young_kids, busy_professional, etc.
  motivation_types?: string[]; // data, social, achievements, etc.
  stress_eating_triggers?: string[]; // work_stress, loneliness, etc.
  
  // Context awareness
  current_context?: 'home' | 'travel' | 'hotel' | 'work' | 'busy_period' | 'wfh';
  meal_windows?: {
    breakfast?: [number, number]; // [start_hour, end_hour] in 24h format
    lunch?: [number, number];
    dinner?: [number, number];
  };
  
  // Store quiz responses for conditional logic
  quiz_responses?: Array<{ questionId: string; value: any }>;
  
  // User preferences
  skip_feedback_questions?: boolean; // If true, don't ask why they rejected tips
  
  // Focus Mode
  focusMode?: {
    enabled: boolean;
    activatedDate: string;
    lovedTipIds: string[];
    weeklyDiscoveryDay?: number; // 0-6 (Sunday-Saturday)
    habitProgress?: Record<string, {
      level: number;
      completedToday: boolean;
      lastCompleted: string;
      totalCompletions: number;
      currentStreak: number;
    }>;
  };
}

export interface QuickComplete {
  completed_at: Date;
  quick_note?: 'worked_great' | 'went_ok' | 'not_sure' | 'not_for_me';
}

export interface DailyTip {
  id: string;
  user_id: string;
  tip_id: string;
  presented_date: Date;
  user_response?: 'try_it' | 'not_interested' | 'maybe_later';
  responded_at?: Date;
  quick_completions?: QuickComplete[]; // Track immediate completions
  evening_check_in?: TipFeedback;
  check_in_at?: Date;
  evening_reflection?: string; // Additional thoughts from evening
}