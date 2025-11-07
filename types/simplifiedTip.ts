// Simplified tip structure for all areas (nutrition, fitness, organization, relationships)

export interface SimplifiedTip {
  // ============ CORE IDENTITY ============

  tip_id: string;                 // Unique identifier
  summary: string;                // 120-char human-readable title shown on card
  details_md: string;             // Full markdown description with "how-to" content

  // ============ CATEGORIZATION ============

  area: 'nutrition' | 'fitness' | 'organization' | 'relationships';
  // Primary category this tip belongs to (for backward compatibility)

  areas?: ('nutrition' | 'fitness' | 'organization' | 'relationships')[];
  // All applicable areas (e.g., meal prep is both 'nutrition' and 'organization')
  // If not provided, defaults to [area]

  goals: string[];
  // Specific objectives within the area
  // Nutrition: ['weight_loss', 'reduce_sugar', 'increase_veggies']
  // Fitness: ['build_strength', 'improve_flexibility', 'run_5k']
  // Organization: ['declutter', 'morning_routine', 'meal_planning']
  // Relationships: ['better_communication', 'date_nights', 'boundaries']

  helps_with?: string[];
  // Specific problems/symptoms this addresses (cross-cutting)
  // Examples: ['stress', 'low_energy', 'binge_eating', 'procrastination', 'loneliness']
  // Can search "all tips that help with stress" across any area

  // ============ SAFETY & ELIGIBILITY ============

  contraindications: string[];
  // Medical conditions or situations where tip isn't suitable
  // Nutrition: ['pregnancy', 'diabetes', 'nut_allergy']
  // Fitness: ['back_injury', 'heart_condition', 'pregnancy']
  // All areas: Can include non-medical like ['requires_partner', 'not_for_kids']

  // ============ HOW IT WORKS ============

  mechanisms: string[];
  // Behavior change techniques & psychological drivers combined
  // Examples: ['habit_stacking', 'environment_design', 'social_accountability',
  //            'sensory_satisfaction', 'convenience', 'identity_shift']

  // ============ EFFORT & INVESTMENT ============

  effort: 'minimal' | 'low' | 'medium' | 'moderate' | 'high';
  // Overall effort combining mental, physical, and willpower required
  // minimal = autopilot, high = requires significant discipline

  time:
    | '0-5min'
    | '5-15min'
    | '10-15min'
    | '15-30min'
    | '30-45min'
    | '30-60min'
    | '30min+'
    | '0-60min'
    | '1 week'
    | '1-2hrs'
    | '2-3hrs'
    | '2-4hrs'
    | '3-4hrs'
    | 'full_day'
    | 'overnight'
    | 'varies'
    | 'ongoing'
    | 'planning'
    | 'planning_plus_date'
    | 'research';
  // Time investment per instance of doing the tip

  cost: '$' | '$$' | '$$$';
  // $ = free or <$5, $$ = $5-20, $$$ = $20+

  // ============ CONTEXT & TIMING ============

  when: string[];
  // Time of day + situational triggers combined
  // Examples: ['morning', 'before_bed', 'when_stressed', 'meal_time', 'commute']

  where: string[];
  // Locations where tip can be done
  // Examples: ['home', 'work', 'gym', 'restaurant', 'anywhere']

  // ============ WHAT'S INVOLVED (Area-Contextual) ============

  involves?: string[];
  // What's actively part of this tip (meaning depends on area)
  // Nutrition: foods used ['vegetables', 'protein_powder']
  // Fitness: activities done ['walking', 'stretching']
  // Organization: tools used ['calendar', 'timer']
  // Relationships: interactions ['texting', 'date_night']

  preserves?: string[];
  // What you DON'T have to give up with this tip
  // Nutrition: foods you keep ['chocolate', 'wine', 'pizza']
  // Fitness: habits you keep ['sleeping_in', 'netflix_nights']
  // Organization: freedoms kept ['spontaneity', 'flexible_schedule']
  // Relationships: boundaries kept ['alone_time', 'independence']

  satisfies?: string[];
  // What cravings/needs this fulfills
  // Nutrition: ['sweet_tooth', 'crunchy', 'chocolate_fix']
  // Fitness: ['endorphin_rush', 'competition', 'meditation']
  // Organization: ['sense_of_control', 'accomplishment']
  // Relationships: ['intimacy', 'validation', 'fun']

  requires?: string[];
  // Prerequisites, equipment, or cooperation needed
  // Nutrition: ['blender', 'basic_cooking', 'meal_prep_time']
  // Fitness: ['gym_access', 'yoga_mat', 'running_shoes']
  // Organization: ['smartphone', 'planner', 'weekly_review']
  // Relationships: ['partner_willing', 'vulnerability', 'childcare']

  // ============ COMPATIBILITY FEATURES ============

  features: string[];
  // Flat list of all other characteristics for filtering
  // Examples: ['family_friendly', 'kid_approved', 'solo_friendly',
  //           'chaos_proof', 'travel_friendly', 'veggie_hidden',
  //           'no_planning', 'impulse_friendly', 'diet_trauma_safe']

  // ============ PERSONALIZATION ============

  personalization_prompt?: string;
  // Question that makes the tip interactive and personal
  // "Name your three emergency snack stations:"
  // "What victory dance will you do after completing this?"

  personalization_type?: 'text' | 'scale' | 'choice' | 'multi_text' | 'list';
  // Type of user input for personalization

  personalization_config?: {
  // Configuration for the personalization interaction

    // For 'scale' type
    scale_customization?: 'names' | 'descriptions';
    scale_labels?: string[];

    // For 'multi_text' or 'list' type
    items?: Array<{
      label: string;
      placeholder?: string;
      description?: string;
      customizable?: 'label' | 'description';
    }>;

    // For 'choice' type
    choices?: string[];
    multiple?: boolean;
    style?: 'buttons' | 'dropdown';

    // General settings
    placeholders?: string[];
    min_items?: number;
    max_items?: number;
  };

  // ============ QUALITY & METADATA ============

  difficulty: 1 | 2 | 3 | 4 | 5;
  // 1 = tiny habit, 5 = major lifestyle change

  source: 'dietitian_reviewed' | 'coach_curated' | 'community_submitted' | 'ai_generated';
  // Provenance and credibility indicator

  // ============ LONGEVITY ============

  sustainability?:
    | 'daily'
    | 'nightly'
    | 'weekly'
    | 'monthly'
    | 'quarterly'
    | 'yearly'
    | 'once'
    | 'occasional'
    | 'temporary'
    | 'as_needed'
    | 'rarely'
    | 'ongoing';
  // How often/long this tip is meant to be used
  // daily = can become permanent daily habit
  // weekly = good for weekly routine
  // occasional = use as needed/special situations
  // temporary = short-term intervention or bridge strategy
}