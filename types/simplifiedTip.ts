// Simplified tip structure for all areas (nutrition, fitness, organization, relationships)

// Tool that users can try in-the-moment while doing a tip
export interface AssociatedTool {
  tool_id: string;                    // Unique identifier
  name: string;                       // Display name (e.g., "The Apple Test")
  description: string;                // Brief explanation of what it does
  instructions?: string[];            // Step-by-step instructions
  duration: string;                   // How long it takes (e.g., "10 sec", "2 min")
  difficulty: 'easy' | 'moderate';    // How much effort/focus needed
  bestFor: string[];                  // What situations it helps with (e.g., ['cravings', 'stress'])
  requiresPrivacy?: boolean;          // Can they do it in public?
  requiresEquipment?: boolean;        // Needs any equipment?
  timerSeconds?: number;              // If it's a timed activity
  icon?: string;                      // Ionicon name
  iconBg?: string;                    // Background color for icon
  iconColor?: string;                 // Icon color
}

// Educational/science content that pairs with a tip
export interface AssociatedScience {
  card_id: string;                    // Unique identifier
  title: string;                      // Display title
  content: string;                    // The educational content
  science_depth: 'light' | 'moderate' | 'deep';  // How detailed/technical
  source?: string;                    // Citation or source
  icon?: string;                      // Ionicon name
  iconBg?: string;                    // Background color
  iconColor?: string;                 // Icon color
}

export interface TipHook {
  hook: string;           // The attention-grabbing headline (e.g., "When thirst disguises itself as hunger")
  subtitle: string;       // The intriguing lead-in that builds curiosity
  detail: string;         // The evidence/teaching - what they learn even if they swipe away
  action: string;         // The specific thing to try today
}

export interface SimplifiedTip {
  // ============ CORE IDENTITY ============

  tip_id: string;                 // Unique identifier
  summary: string;                // 120-char human-readable title shown on card
  details_md: string;             // Full markdown description with "how-to" content
  short_description?: string;     // 7-12 word teaser shown alongside the summary

  // ============ MEDIA & VISUALS ============

  media?: {
    // Hero/cover image for the tip (shown on summary page)
    cover?: {
      url: string;                    // Path to image (local or remote)
      alt_text: string;               // Accessibility description
      focus_point?: 'center' | 'top' | 'bottom' | 'face'; // For smart cropping
      credits?: string;               // Photo credits if needed
    };

    // Page-specific images (matching your card pages)
    pages?: {
      summary?: {
        url: string;
        alt_text: string;
        placement?: 'hero' | 'background' | 'inline'; // How it's displayed
      };

      goals?: {
        url: string;
        alt_text: string;
        type?: 'photo' | 'icon' | 'illustration';
      };

      benefits?: {                    // The "Why It Works" page
        url: string;
        alt_text: string;
        type?: 'photo' | 'diagram' | 'infographic';
      };

      howto?: {                       // Step-by-step instructions
        url: string;
        alt_text: string;
        type?: 'photo' | 'diagram' | 'gif' | 'video_thumbnail';
        steps?: {                     // Optional: Multiple images for different steps
          step_number: number;
          url: string;
          alt_text: string;
          caption?: string;
        }[];
      };

      personalization?: {             // The "Your Plan" page
        url: string;
        alt_text: string;
        type?: 'illustration' | 'photo';
      };
    };

    // Additional visual elements
    thumbnail?: {                     // For lists/history views
      url: string;
      alt_text: string;
    };

    success?: {                       // "After" or completion celebration image
      url: string;
      alt_text: string;
    };

    // Style hints for consistent rendering
    style?: {
      aspect_ratio?: '16:9' | '4:3' | '1:1' | '9:16';  // Preferred aspect ratio
      overlay_text?: boolean;         // Whether text should overlay the image
      blur_background?: boolean;      // If image should be blurred as background
    };
  };

  // ============ CATEGORIZATION ============

  area: 'nutrition' | 'fitness' | 'organization' | 'relationships' | 'stress' | 'sleep';
  // Primary category this tip belongs to (for backward compatibility)

  areas?: ('nutrition' | 'fitness' | 'organization' | 'relationships' | 'stress' | 'sleep')[];
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

  // ============ HOOKS & ENGAGEMENT ============

  hooks?: TipHook[];
  // Array of hook options for engaging users before showing the full tip
  // Each hook is a complete package: headline, subtitle, evidence detail, and action

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

  // ============ TROUBLESHOOTING ============

  // For "I don't have what I needed"
  substitutions?: {
    item: string;
    swaps: string[];
  }[];

  // For "I don't have equipment"
  low_tech_version?: string; // Description of how to do it without gear

  // For "I have zero time"
  micro_version?: string; // The 1-minute or 30-second version of the tip

  // For "Make it easier or different"
  variants?: {
    id: string;
    summary: string;
    difficulty?: number;
  }[];

  // ============ ASSOCIATED CARDS & TOOLS ============

  // Tools users can try in-the-moment while doing this tip
  // Multiple tools allow users to discover what works for them
  associated_tools?: AssociatedTool[];

  // Educational/science content that pairs with this tip
  associated_science?: AssociatedScience[];

  // ============ COMPLETION FEEDBACK ============

  // Custom follow-up questions when user completes the tip
  // If not provided, default questions are used
  completion_feedback_questions?: {
    worked_great?: Array<{
      id: string;
      question: string;
      options: Array<{
        id: string;
        label: string;
        emoji?: string;
      }>;
      multiSelect?: boolean;
    }>;
    went_ok?: Array<{
      id: string;
      question: string;
      options: Array<{
        id: string;
        label: string;
        emoji?: string;
      }>;
      multiSelect?: boolean;
    }>;
    not_sure?: Array<{
      id: string;
      question: string;
      options: Array<{
        id: string;
        label: string;
        emoji?: string;
      }>;
      multiSelect?: boolean;
    }>;
    not_for_me?: Array<{
      id: string;
      question: string;
      options: Array<{
        id: string;
        label: string;
        emoji?: string;
      }>;
      multiSelect?: boolean;
    }>;
  };
}
