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
}

export type TipFeedback = 'went_great' | 'went_ok' | 'not_great' | 'didnt_try';

export interface TipAttempt {
  id: string;
  tip_id: string;
  attempted_at: Date;
  feedback?: TipFeedback;
  notes?: string;
}

export interface UserProfile {
  id: string;
  created_at: Date;
  onboarding_completed: boolean;
  
  // Medical conditions
  medical_conditions: MedicalContraindication[];
  
  // Goals
  goals: GoalTag[];
  
  // Lifestyle preferences
  cooking_time_available?: 'none' | 'minimal' | 'moderate' | 'plenty';
  eating_locations?: string[];
  budget_conscious?: boolean;
  
  // Food preferences
  dietary_preferences?: string[];
  likes_variety?: boolean;
  cultural_preferences?: string[];
  
  // Demographics
  age_range?: string;
  life_stage?: string[];
  
  // Learning preferences
  wants_to_learn_cooking?: boolean;
  interested_in_nutrition_facts?: boolean;
}

export interface DailyTip {
  id: string;
  user_id: string;
  tip_id: string;
  presented_date: Date;
  user_response?: 'try_it' | 'not_interested' | 'maybe_later';
  responded_at?: Date;
  evening_check_in?: TipFeedback;
  check_in_at?: Date;
}