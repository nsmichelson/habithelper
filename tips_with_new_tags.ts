import { Tip } from './types/tip';

export const TIPS_DATABASE: Tip[] = [
//pregnancy ones
  {
    "tip_id": "e897e203-f6a3-4726-97cf-0be4bf6dade3",
    "area": "nutrition" as const,
    "summary": "Keep ginger chews or candies on hand for nausea relief.",
    "personalization_prompt": "Name your three 'nausea emergency stations' where you'll stash ginger chews:",
    "personalization_type": "multi_text" as const,
    "personalization_config": {
      "items": [
        { "label": "Station 1:", "placeholder": "e.g., Bedside table drawer" },
        { "label": "Station 2:", "placeholder": "e.g., Car glove compartment" },
        { "label": "Station 3:", "placeholder": "e.g., Work desk drawer" }
      ]
    },
    "details_md": "**The Experiment:** Carry ginger chews in your bag and keep a few by your bed. When nausea hits, slowly suck or chew one.\n\n**Why it Works:** Ginger compounds can calm the stomach and reduce nausea; having them pre-positioned makes relief immediate.\n\n**How to Try It:**\n• Stock a few in your purse, desk, and nightstand.\n• If strong ginger is too spicy, try milder ginger drops.\n• Start with small amounts and see what your stomach tolerates.",
    "contraindications": "Avoid if ginger worsens heartburn or if your clinician advised limiting ginger (e.g., on certain blood thinners). Large amounts of ginger may interact with blood thinners or increase reflux; limit if advised by your clinician.",
    "goal_tags": [
      "reduce_nausea",
      "increase_hydration",
      "nutrient_density"
    ],
    "context_tags": [
      "pregnancy"
    ],
    "technique_tags": [
      "environment_design",
      "planning_ahead",
      "symptom_relief"
    ],
    "tip_type": [
      "symptom_management",
      "behavioral_strategy"
    ],
    "motivational_mechanism": [
      "convenience",
      "relief"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "any"
    ],
    "social_mode": "either",
    "time_of_day": [
      "morning",
      "any"
    ],
    "cue_context": [
      "feeling_nauseous",
      "waking_up"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "ginger_candy"
    ],
    "preserves_foods": [],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "cooking_skill_required": "none",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "nausea",
      "vomiting",
      "odor_triggers"
    ]
  }
];