import { Tip } from '../types/tip';

export const TIPS_DATABASE: Tip[] = [
//pregnancy ones
  {
    "tip_id": "e897e203-f6a3-4726-97cf-0be4bf6dade3",
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
      "healthy_pregnancy"
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
  },
  {
    "tip_id": "70bc2cae-2895-4041-9ba3-9cdc8c38ac23",
    "summary": "Freeze strong ginger tea into cubes for instant nausea tea.",
    "personalization_prompt": "What fun shape or container will you use for your ginger ice cubes?",
    "personalization_type": "text" as const,
    "personalization_config": {
      "placeholder": "e.g., Star-shaped molds, mini dinosaurs, or heart shapes"
    },
    "details_md": "**The Experiment:** Brew a pot of strong ginger tea, freeze in an ice tray, and pop a cube into hot water when queasy.\n\n**Why it Works:** Batch-prepped ginger removes friction on rough days so you can self-soothe fast.\n\n**How to Try It:**\n• Steep sliced fresh ginger or tea bags 10–15 minutes.\n• Freeze in an ice cube tray and store in a zip bag.\n• Use 1–2 cubes in hot water or suck a cube if cold helps.",
    "contraindications": "Skip if ginger triggers reflux; mind dental sensitivity if sucking frozen cubes. Large amounts of ginger may interact with blood thinners or increase reflux; limit if advised by your clinician. Cool foods quickly, store safely, and reheat leftovers to 165°F; eat within 3–4 days once thawed.",
    "goal_tags": [
      "reduce_nausea",
      "increase_hydration",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "meal_prep",
      "symptom_management"
    ],
    "motivational_mechanism": [
      "convenience",
      "relief"
    ],
    "time_cost_enum": "15_30_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "morning",
      "any"
    ],
    "cue_context": [
      "feeling_nauseous",
      "meal_time"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "ginger",
      "water"
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
    "kitchen_equipment": [
      "kettle",
      "ice_cube_tray",
      "freezer"
    ],
    "cooking_skill_required": "none",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "nausea",
      "vomiting"
    ]
  },
  {
    "tip_id": "c45987a7-3866-4379-996b-d2e36fefe057",
    "summary": "Suck on frozen lemon-ginger cubes when liquids are hard to tolerate.",
    "details_md": "**The Experiment:** Freeze diluted lemonade with grated ginger into ice cubes to sip/suck during nausea.\n\n**Why it Works:** Cold, tart flavors are often easier to handle and keep hydration going in tiny sips.\n\n**How to Try It:**\n• Mix water + a splash of lemonade; add optional ginger.\n• Freeze in trays; keep a bag in the freezer.\n• Use during commutes or morning routines.",
    "contraindications": "Citrus may worsen reflux; rinse mouth after to protect enamel. Large amounts of ginger may interact with blood thinners or increase reflux; limit if advised by your clinician. Citrus can aggravate reflux or tooth enamel; rinse mouth after acidic drinks and avoid if symptoms worsen.",
    "goal_tags": [
      "reduce_nausea",
      "increase_hydration",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "symptom_management",
      "meal_prep"
    ],
    "motivational_mechanism": [
      "comfort",
      "relief"
    ],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [
      "feeling_nauseous",
      "commute"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "lemonade",
      "ginger",
      "water"
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
    "kitchen_equipment": [
      "ice_cube_tray",
      "freezer"
    ],
    "cooking_skill_required": "none",
    "satisfies_craving": "cold",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": [
      "nausea",
      "dehydration"
    ]
  },
  {
    "tip_id": "c55f0762-08a2-4cb4-91e8-c8d633db4ffa",
    "summary": "Chew peppermint gum or suck mints to mask odors and ease nausea.",
    "details_md": "**The Experiment:** Use peppermint gum or mints when smells trigger queasiness (kitchen, car, workplace).\n\n**Why it Works:** Peppermint aroma can distract from odor triggers and may soothe the stomach while saliva neutralizes acid.\n\n**How to Try It:**\n• Keep a pack in your bag and car.\n• Try sugar-free gum if managing blood sugar or dental health.\n• Use before entering strong-smell environments.",
    "contraindications": "Peppermint can worsen reflux; avoid if sensitive. Peppermint may relax the LES and worsen reflux; choose non‑mint flavors if GERD is an issue.",
    "goal_tags": [
      "reduce_nausea",
      "healthy_pregnancy"
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
      "any"
    ],
    "cue_context": [
      "odor_trigger",
      "commute",
      "meal_prep_time"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "peppermint_gum",
      "mints"
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
      "smell_aversion",
      "heartburn"
    ]
  },
  {
    "tip_id": "cf16c8b8-3424-49e4-8c81-b785a931e910",
    "summary": "If plain water tastes bad, flavor it lightly (citrus, mint, flat ginger ale).",
    "details_md": "**The Experiment:** Add lemon/lime, a splash of juice, or use flat ginger ale in small sips to meet hydration goals.\n\n**Why it Works:** Mild flavors reduce aversion and encourage steady sipping, preventing dehydration that worsens nausea.\n\n**How to Try It:**\n• Keep lemon wedges or mint in the fridge.\n• Try flavored ice cubes (juice + water).\n• Use a straw if that makes sipping easier.",
    "contraindications": "Limit sugary beverages; carbonation may bloat—adjust to comfort. Large amounts of ginger may interact with blood thinners or increase reflux; limit if advised by your clinician. Citrus can aggravate reflux or tooth enamel; rinse mouth after acidic drinks and avoid if symptoms worsen. If managing gestational diabetes, limit added sugars in mixers (use diluted juice). Avoid caffeinated sodas late in the day; prefer caffeine‑free options.",
    "goal_tags": [
      "increase_hydration",
      "reduce_nausea",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "behavioral_strategy",
      "habit_stacking"
    ],
    "motivational_mechanism": [
      "convenience",
      "taste"
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
      "any"
    ],
    "cue_context": [
      "water_bottle_sighting",
      "feeling_thirsty"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "water",
      "lemon",
      "ginger_ale"
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
      "dehydration",
      "nausea"
    ]
  },
  {
    "tip_id": "84271016-fed4-4b53-a1e9-ad80725ee917",
    "summary": "Keep crackers by the bed and nibble before sitting up.",
    "personalization_prompt": "What's your bedside 'morning rescue' snack and where will you keep it?",
    "personalization_type": "multi_text" as const,
    "personalization_config": {
      "items": [
        { "label": "Snack choice:", "placeholder": "e.g., Saltines, pretzels, dry cereal" },
        { "label": "Storage spot:", "placeholder": "e.g., Nightstand drawer, bedside basket" }
      ]
    },
    "details_md": "**The Experiment:** Eat a few plain crackers or dry cereal before getting out of bed.\n\n**Why it Works:** A little starch on board can blunt the acid surge and blood sugar dip that worsens morning nausea.\n\n**How to Try It:**\n• Pre-pack a zip bag of crackers at night.\n• Nibble slowly and wait 5–10 minutes before standing.\n• Keep a small water bottle nearby for sips.",
    "contraindications": "Choose gluten‑free options if you have celiac disease; pick lower‑sodium crackers if on a sodium‑restricted plan per your clinician.",
    "goal_tags": [
      "reduce_nausea",
      "morning_routine",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "symptom_management",
      "routine_design"
    ],
    "motivational_mechanism": [
      "relief",
      "convenience"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "morning"
    ],
    "cue_context": [
      "waking_up"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "crackers",
      "dry_cereal"
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
      "nausea"
    ]
  },
  {
    "tip_id": "b1fb0db1-90cd-4a87-a688-65510a7f134e",
    "summary": "Have a protein-rich bedtime snack to ease morning nausea.",
    "details_md": "**The Experiment:** Eat a small protein snack (Greek yogurt, cheese stick, peanut butter on crackers) before bed.\n\n**Why it Works:** Protein slows digestion and stabilizes blood sugar overnight, which may reduce morning queasiness.\n\n**How to Try It:**\n• Choose ~10–15g protein (yogurt, cheese, nut butter).\n• Keep portions small to prevent reflux.\n• Pair with a few crackers if needed.",
    "contraindications": "Avoid large/fatty meals close to bed if prone to reflux.",
    "goal_tags": [
      "reduce_nausea",
      "improve_energy",
      "stable_blood_sugar",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "symptom_management",
      "behavioral_strategy"
    ],
    "motivational_mechanism": [
      "comfort",
      "satiety"
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
      "evening",
      "pre_bed"
    ],
    "cue_context": [
      "bedtime"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "greek_yogurt",
      "cheese",
      "peanut_butter",
      "crackers"
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
      "overnight_hunger"
    ]
  },
  {
    "tip_id": "35f529a1-e92f-403c-ba16-de140af4aeab",
    "summary": "Use the 'P' fruits (prunes, pears, plums, pumpkin) for constipation.",
    "personalization_prompt": "Pick your 'P' fruit superhero for the day!",
    "personalization_type": "choice" as const,
    "personalization_config": {
      "choices": ["Prunes (The Classic)", "Pears (The Gentle Giant)", "Plums (The Sweet Solution)", "Pumpkin (The Smooth Operator)"],
      "multiple": false
    },
    "details_md": "**The Experiment:** Add one serving of a 'P' fruit daily until regular (e.g., 4–6 prunes or a ripe pear).\n\n**Why it Works:** Fiber and natural sorbitol draw water into the stool and promote movement.\n\n**How to Try It:**\n• Start with one serving and increase as needed.\n• Combine with water to boost effect.\n• Rotate fruits to keep it enjoyable.",
    "contraindications": "Reduce/stop if stools become too loose.",
    "goal_tags": [
      "constipation_relief",
      "fiber_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "symptom_management",
      "nutrition_upgrade"
    ],
    "motivational_mechanism": [
      "comfort",
      "routine"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [
      "snack_time"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "prunes",
      "pears",
      "plums",
      "pumpkin"
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
      "constipation"
    ]
  },
  {
    "tip_id": "7f7df02d-5354-40ef-b35e-22a445d56241",
    "summary": "Stir chia or ground flax into meals for invisible fiber.",
    "details_md": "**The Experiment:** Add 1 tablespoon of chia or ground flaxseed to oatmeal, yogurt, or smoothies daily.\n\n**Why it Works:** Soluble fiber absorbs water to soften stool and promote regularity; it also adds omega‑3s.\n\n**How to Try It:**\n• Start with 1 tsp and build up to 1 Tbsp to avoid gas.\n• Drink water with added fiber.\n• Store ground flax in the fridge.",
    "contraindications": "Increase gradually to minimize bloating; ensure adequate fluids.",
    "goal_tags": [
      "constipation_relief",
      "fiber_intake",
      "omega3_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "small_changes",
      "nutrition_upgrade"
    ],
    "motivational_mechanism": [
      "convenience",
      "habit"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [
      "breakfast",
      "snack_time"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "chia",
      "flaxseed",
      "oatmeal",
      "yogurt"
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
      "constipation",
      "satiety"
    ]
  },
  {
    "tip_id": "4e4cc434-fa30-48a8-991f-afde0bb3eaad",
    "summary": "Try a daily kiwi (or two) to stay regular.",
    "personalization_prompt": "When's your kiwi time today?",
    "personalization_type": "choice" as const,
    "personalization_config": {
      "choices": ["Morning wake-up", "Mid-morning snack", "Lunch dessert", "Afternoon pick-me-up", "Evening treat"],
      "multiple": false
    },
    "details_md": "**The Experiment:** Eat 1–2 ripe kiwis each day, scooped with a spoon or added to yogurt.\n\n**Why it Works:** Kiwifruit offers fiber and enzymes that can support gentle bowel movement.\n\n**How to Try It:**\n• Keep a few ripening on the counter, then refrigerate.\n• Pair with yogurt or cereal for a quick snack.\n• Choose golden kiwi if you prefer milder flavor.",
    "contraindications": "Stop if stools become loose; consider oral allergy syndrome if sensitive to kiwi.",
    "goal_tags": [
      "constipation_relief",
      "fiber_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "symptom_management",
      "snacks"
    ],
    "motivational_mechanism": [
      "taste",
      "routine"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [
      "snack_time"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "kiwi",
      "yogurt"
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
      "constipation"
    ]
  },
  {
    "tip_id": "29e9e140-16f4-44bf-b190-fe46cc911f51",
    "summary": "Sip warm water (or warm prune juice) first thing in the morning.",
    "details_md": "**The Experiment:** Drink a mug of warm water upon waking to gently nudge digestion.\n\n**Why it Works:** Warm fluids can stimulate gut motility and are soothing on sensitive mornings.\n\n**How to Try It:**\n• Add lemon if tolerated; avoid if it triggers reflux.\n• Try warm prune juice for extra effect.\n• Pair with light stretching.",
    "contraindications": null,
    "goal_tags": [
      "constipation_relief",
      "morning_routine",
      "hydration",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "symptom_management",
      "routine_design"
    ],
    "motivational_mechanism": [
      "comfort",
      "ritual"
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
      "morning"
    ],
    "cue_context": [
      "waking_up"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "water",
      "prune_juice",
      "lemon"
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
      "constipation",
      "nausea"
    ]
  },
  {
    "tip_id": "a2f0c824-31f2-4a88-b629-bc310a3d5431",
    "summary": "Take a 10‑minute walk after meals to aid digestion.",
    "details_md": "**The Experiment:** Set a 10‑minute timer and walk after lunch or dinner.\n\n**Why it Works:** Light movement leverages gravity and stimulates peristalsis, easing constipation and bloating.\n\n**How to Try It:**\n• Stroll indoors or around the block—keep it gentle.\n• Invite a partner/friend for accountability.\n• Skip right before bed if reflux is an issue—finish 2–3 hours before sleep.",
    "contraindications": "Skip walking if you’ve been advised pelvic rest or activity restrictions (e.g., bleeding, placenta previa, risk of preterm labor).",
    "goal_tags": [
      "constipation_relief",
      "heartburn_relief",
      "improve_energy",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "behavioral_strategy",
      "routine_design"
    ],
    "motivational_mechanism": [
      "movement",
      "accountability"
    ],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 2,
    "location_tags": [
      "home",
      "work",
      "outdoors"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [
      "post_meal"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
      "constipation",
      "bloating",
      "heartburn"
    ]
  },
  {
    "tip_id": "77f34008-5bb3-4a16-a5c8-d252fb74f85e",
    "summary": "Chew gum or munch a few almonds after meals for heartburn relief.",
    "details_md": "**The Experiment:** After eating, chew sugar‑free gum or eat 5–10 raw almonds.\n\n**Why it Works:** Chewing boosts saliva, which can neutralize acid; almonds may buffer stomach acid for some.\n\n**How to Try It:**\n• Keep gum or almonds in your bag or nightstand.\n• Chew 10–20 minutes after meals.\n• Pair with staying upright for at least an hour.",
    "contraindications": "Avoid nuts if allergic; mint gum can aggravate reflux for some—try fruit flavors.",
    "goal_tags": [
      "heartburn_relief",
      "comfort",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "symptom_management",
      "behavioral_strategy"
    ],
    "motivational_mechanism": [
      "relief",
      "convenience"
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
      "any"
    ],
    "cue_context": [
      "post_meal",
      "heartburn_flare"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "almonds",
      "gum"
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
      "heartburn",
      "reflux"
    ]
  },
  {
    "tip_id": "4a9675df-9669-4703-8022-77022718c89e",
    "summary": "Try a warm ACV + honey drink for reflux relief.",
    "details_md": "**The Experiment:** Mix 1 tsp apple cider vinegar + 1 tsp honey in warm water and sip slowly.\n\n**Why it Works:** Some find small amounts of ACV tone digestion and reduce symptoms; warmth is soothing.\n\n**How to Try It:**\n• Start with 1 tsp ACV; increase only if helpful.\n• Rinse mouth after to protect enamel.\n• Stop if it worsens symptoms.",
    "contraindications": "May aggravate reflux or damage enamel; avoid if advised by clinician or with esophagitis. Avoid undiluted ACV; may irritate esophagus or enamel. Not a replacement for medical GERD treatment; stop if pain or burning worsens.",
    "goal_tags": [
      "heartburn_relief",
      "hydration",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "symptom_management"
    ],
    "motivational_mechanism": [
      "comfort",
      "ritual"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "evening",
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "apple_cider_vinegar",
      "honey",
      "water"
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
      "heartburn"
    ]
  },
  {
    "tip_id": "106146f9-39fd-49c7-8c61-207bffd34b34",
    "summary": "Sip lemon water to test if it soothes your heartburn.",
    "details_md": "**The Experiment:** Add a squeeze of lemon to warm or room‑temp water and sip slowly.\n\n**Why it Works:** For some, mild acidity can support digestion and reduce reflux sensations.\n\n**How to Try It:**\n• Try small amounts first; stop if it burns.\n• Avoid near toothbrushing to protect enamel.\n• Prefer warm over cold if cold triggers cramps.",
    "contraindications": "Citrus can worsen reflux or dental sensitivity—use only if it helps you. Citrus can aggravate reflux or tooth enamel; rinse mouth after acidic drinks and avoid if symptoms worsen.",
    "goal_tags": [
      "heartburn_relief",
      "hydration",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "symptom_management"
    ],
    "motivational_mechanism": [
      "comfort",
      "experimentation"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "lemon",
      "water"
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
      "heartburn"
    ]
  },
  {
    "tip_id": "da73c592-f80c-4d8a-9254-718195c4ec0e",
    "summary": "Use chewable papaya enzymes as a natural antacid alternative.",
    "details_md": "**The Experiment:** Chew 1–3 papaya enzyme tablets after meals as needed.\n\n**Why it Works:** Papain (from papaya) can support digestion and ease mild indigestion.\n\n**How to Try It:**\n• Choose a brand without extra herbs you don’t need.\n• Use after meals that tend to trigger heartburn.\n• Discuss with your provider if unsure.",
    "contraindications": "Avoid if allergic to latex/papaya; check with clinician before regular use. Avoid if allergic to latex or papaya. Use packaged enzyme tablets; avoid unripe papaya in large amounts. Check with your clinician before regular use.",
    "goal_tags": [
      "heartburn_relief",
      "comfort",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "symptom_management"
    ],
    "motivational_mechanism": [
      "relief",
      "convenience"
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
      "any"
    ],
    "cue_context": [
      "post_meal",
      "heartburn_flare"
    ],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "papaya_enzyme"
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
      "heartburn",
      "indigestion"
    ]
  },
  {
    "tip_id": "7bfa5b1a-a16f-4634-a724-37526d3f8cad",
    "summary": "Craving sushi? Choose veggie or fully cooked rolls.",
    "details_md": "**The Experiment:** Order avocado, cucumber, or tempura shrimp rolls; skip raw fish.\n\n**Why it Works:** You can keep the flavors you love while avoiding the higher risk of raw fish during pregnancy.\n\n**How to Try It:**\n• Ask for cooked fish (eel, shrimp) or veggie rolls.\n• Make sushi bowls at home with nori strips and cooked fillings.\n• Use low‑sodium soy sauce and plenty of ginger/wasabi for the vibe.",
    "contraindications": "Avoid raw fish and high‑mercury species; confirm sauces/aioli use pasteurized eggs. Avoid raw fish/shellfish and high‑mercury species (shark, swordfish, king mackerel, tilefish, bigeye tuna). Ensure sauces use pasteurized eggs.",
    "goal_tags": [
      "food_safety",
      "craving_satisfaction",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "food_swap",
      "safety_strategy"
    ],
    "motivational_mechanism": [
      "craving_substitution",
      "safety"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "restaurant",
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "nori",
      "avocado",
      "shrimp_cooked",
      "eel_cooked",
      "rice"
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
    "kitchen_equipment": [
      "rice_cooker (optional)"
    ],
    "cooking_skill_required": "basic",
    "satisfies_craving": "umami",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": [
      "food_safety_anxiety",
      "cravings"
    ]
  },
  {
    "tip_id": "973ee1d3-d3e2-4754-9f11-f1936a5e867b",
    "summary": "Create a mocktail ritual in your fanciest glass.",
    "personalization_prompt": "Name your signature mocktail creation!",
    "personalization_type": "text" as const,
    "personalization_config": {
      "placeholder": "e.g., The Sparkling Sunset, Berry Bliss, Citrus Celebration"
    },
    "details_md": "**The Experiment:** Mix sparkling water with tart cherry or pomegranate juice and citrus; serve in stemware.\n\n**Why it Works:** Honors the social ritual of a drink while keeping pregnancy alcohol‑free.\n\n**How to Try It:**\n• Keep a few favorite juice mixers on hand.\n• Garnish (citrus, herbs) to make it feel special.\n• Use unsweetened juices if watching sugar.",
    "contraindications": null,
    "goal_tags": [
      "alcohol_free",
      "healthy_snacking",
      "reduce_sugar",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "food_swap",
      "ritual_design"
    ],
    "motivational_mechanism": [
      "novelty",
      "reward",
      "social_norms"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "restaurant",
      "social_event"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
    "satisfies_craving": "bubbly",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": [
      "social_pressure",
      "evening_cravings"
    ]
  },
  {
    "tip_id": "fa453cec-f876-446e-87ab-ce2ce540e5ea",
    "summary": "Heat deli meats until steaming before building your sandwich.",
    "details_md": "**The Experiment:** Microwave or pan‑heat lunch meats to 165°F, cool slightly, then assemble your sub.\n\n**Why it Works:** Heating reduces Listeria risk while letting you enjoy your favorite sandwich.\n\n**How to Try It:**\n• Ask shops to toast/steam your sandwich.\n• At home, microwave meat 30–60 seconds until steaming.\n• Use pasteurized cheeses and add veggies for crunch.",
    "contraindications": "Use food thermometer if unsure; avoid cross‑contamination on cutting boards. Heat meats to steaming (165°F) to reduce Listeria risk and avoid cross‑contamination on boards/knives.",
    "goal_tags": [
      "food_safety",
      "craving_satisfaction",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "safety_strategy",
      "food_swap"
    ],
    "motivational_mechanism": [
      "safety",
      "convenience"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "restaurant"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "turkey",
      "ham",
      "cheese_pasteurized",
      "bread"
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
    "kitchen_equipment": [
      "microwave",
      "skillet",
      "thermometer (optional)"
    ],
    "cooking_skill_required": "none",
    "satisfies_craving": "savory",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": [
      "food_safety_anxiety",
      "cravings"
    ]
  },
  {
    "tip_id": "f9f32fb5-f964-4098-9069-3a39e328afb9",
    "summary": "Use edible cookie dough (egg‑free, heat‑treated flour) to satisfy dough cravings.",
    "details_md": "**The Experiment:** Buy or make cookie dough designed to be eaten raw.\n\n**Why it Works:** You can enjoy the flavor/texture without risk from raw eggs or unheated flour.\n\n**How to Try It:**\n• Look for labels: pasteurized/egg‑free + heat‑treated flour.\n• DIY: bake flour 5–10 min at ~350°F; omit eggs.\n• Portion a spoonful into yogurt or freeze as bites.",
    "contraindications": "Only use doughs labeled safe‑to‑eat raw or homemade with heat‑treated flour and no raw egg; portion mindfully if managing blood sugar.",
    "goal_tags": [
      "food_safety",
      "craving_satisfaction",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "food_swap",
      "safety_strategy"
    ],
    "motivational_mechanism": [
      "craving_substitution",
      "novelty"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "edible_cookie_dough"
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
    "kitchen_equipment": [
      "oven (for DIY)"
    ],
    "cooking_skill_required": "basic",
    "satisfies_craving": "sweet",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": [
      "sweet_cravings",
      "food_safety_anxiety"
    ]
  },
  {
    "tip_id": "f27ba582-897d-43ee-8240-e43fcdd52ac1",
    "summary": "Switch to half‑caff or decaf (or roasted‑chicory 'coffee') to trim caffeine.",
    "details_md": "**The Experiment:** Mix half regular + half decaf grounds, or try a chicory/dandelion blend.\n\n**Why it Works:** Keeps the comforting ritual with less (or no) caffeine.\n\n**How to Try It:**\n• Transition gradually over a week.\n• Order half‑caff lattes or decaf at cafés.\n• Track total caffeine from tea/chocolate/cola.",
    "contraindications": "Decaf still contains small amounts of caffeine. Herbal 'coffee' blends vary—avoid unverified herbs (e.g., large amounts of licorice); choose simple roasted chicory/dandelion and confirm with your clinician if unsure.",
    "goal_tags": [
      "reduce_caffeine",
      "sleep_quality",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "food_swap",
      "behavioral_strategy"
    ],
    "motivational_mechanism": [
      "ritual",
      "comfort"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work",
      "restaurant"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "coffee",
      "decaf_coffee",
      "chicory_coffee"
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
    "satisfies_craving": "warm_drink",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": [
      "jitters",
      "sleep"
    ]
  },
  {
    "tip_id": "8753afeb-59d0-4d5c-9e0d-70b3fa0268c5",
    "summary": "If prenatals make you sick, ask about children’s vitamins as a short‑term bridge.",
    "details_md": "**The Experiment:** With clinician approval, use chewable kids’ multivitamins temporarily until nausea improves.\n\n**Why it Works:** Better than nothing when pills won’t stay down; easier on the stomach.\n\n**How to Try It:**\n• Confirm dose/brand with your provider.\n• Keep focusing on folate‑rich foods meanwhile.\n• Resume a full prenatal as soon as tolerated.",
    "contraindications": "Only with clinician guidance; gummies may lack iron/iodine/choline. Use only with clinician guidance; children’s gummies often lack iron/iodine/choline and are a temporary bridge, not a full replacement.",
    "goal_tags": [
      "consistency",
      "reduce_nausea",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "safety_strategy",
      "behavioral_strategy"
    ],
    "motivational_mechanism": [
      "relief",
      "self_efficacy"
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
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
      "adherence"
    ]
  },
  {
    "tip_id": "bd42db75-c10e-498c-bd8c-8cf85af0f51f",
    "summary": "If veggies are a no‑go, lean on fruits, beans, eggs, and dairy for nutrients.",
    "details_md": "**The Experiment:** Build meals from tolerated foods that still supply folate, iron, calcium, and protein.\n\n**Why it Works:** You can meet needs without forcing trigger foods; variety returns as nausea lifts.\n\n**How to Try It:**\n• Prioritize fruit smoothies, beans/lentils, eggs, and yogurt.\n• Add a prenatal and 'gap' foods like choline‑rich eggs when possible.\n• Re‑test veggies later in tiny portions.",
    "contraindications": "Use only pasteurized dairy. If lactose intolerant, choose lactose‑free or fortified non‑dairy alternatives.",
    "goal_tags": [
      "flexibility",
      "reduce_nausea",
      "nutrient_density",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "mindset_reframe",
      "nutrition_upgrade"
    ],
    "motivational_mechanism": [
      "self_compassion",
      "competence"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "restaurant",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
      "food_aversion",
      "nausea",
      "perfectionism"
    ]
  },
  {
    "tip_id": "ff2970ca-7637-48bc-84cf-3ecd5383205f",
    "summary": "Blend extra veggies (and white beans) into pasta sauces and soups.",
    "details_md": "**The Experiment:** Sauté mild veggies/beans, then purée into tomato sauce or soup.\n\n**Why it Works:** Increases fiber, folate, and iron without 'veggie' taste or smell.\n\n**How to Try It:**\n• Use carrots, zucchini, bell peppers, spinach, white beans.\n• Blend smooth; freeze portions for later.\n• Season boldly (garlic, herbs) to keep it craveable.",
    "contraindications": null,
    "goal_tags": [
      "fiber_intake",
      "folate_intake",
      "iron_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "meal_prep",
      "nutrition_upgrade"
    ],
    "motivational_mechanism": [
      "stealth",
      "convenience"
    ],
    "time_cost_enum": "15_30_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "tomato_sauce",
      "white_beans",
      "spinach",
      "zucchini",
      "carrot"
    ],
    "preserves_foods": [],
    "veggie_intensity": "medium",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [
      "blender",
      "saucepan",
      "freezer"
    ],
    "cooking_skill_required": "basic",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "aversion",
      "constipation",
      "micronutrient_gaps"
    ]
  },
  {
    "tip_id": "7280d3cf-4770-4ed8-baff-5fdeab61c9d6",
    "summary": "Add spinach or peeled zucchini to fruit smoothies (you won’t taste it).",
    "details_md": "**The Experiment:** Toss a handful of baby spinach or 1/2 cup peeled zucchini into your smoothie.\n\n**Why it Works:** Boosts folate and fiber invisibly while keeping the flavor you like.\n\n**How to Try It:**\n• Pair with banana/berries to mask color/flavor.\n• Add Greek yogurt or protein powder for staying power.\n• Prep freezer smoothie kits on weekends.",
    "contraindications": null,
    "goal_tags": [
      "folate_intake",
      "fiber_intake",
      "protein_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "simple_swap",
      "meal_prep"
    ],
    "motivational_mechanism": [
      "stealth",
      "taste"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "spinach",
      "zucchini",
      "banana",
      "berries",
      "yogurt"
    ],
    "preserves_foods": [],
    "veggie_intensity": "low",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [
      "blender",
      "freezer"
    ],
    "cooking_skill_required": "none",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "aversion",
      "constipation",
      "energy"
    ]
  },
  {
    "tip_id": "1a2a9268-c165-46e3-a411-4c4bbce49c27",
    "summary": "Blend cauliflower into mashed potatoes for a stealth veggie upgrade.",
    "details_md": "**The Experiment:** Boil cauliflower with potatoes and mash together (50/50 or 25/75).\n\n**Why it Works:** Adds fiber and vitamins with classic comfort‑food taste.\n\n**How to Try It:**\n• Steam/boil cauliflower until very soft.\n• Mash with potatoes, butter, and seasonings.\n• Try the same trick in mac‑and‑cheese sauces.",
    "contraindications": null,
    "goal_tags": [
      "fiber_intake",
      "veggie_exposure",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "simple_swap",
      "nutrition_upgrade"
    ],
    "motivational_mechanism": [
      "comfort",
      "stealth"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "cauliflower",
      "potatoes"
    ],
    "preserves_foods": [],
    "veggie_intensity": "medium",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [
      "pot",
      "masher"
    ],
    "cooking_skill_required": "none",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "aversion",
      "constipation"
    ]
  },
  {
    "tip_id": "bfc4d272-1da0-490f-8145-5e806ae4e5bb",
    "summary": "Stir an egg into hot oatmeal for extra protein and choline.",
    "details_md": "**The Experiment:** Whisk an egg into simmering oats on low heat, stirring until creamy and fully set.\n\n**Why it Works:** Turns oats into a higher‑protein, choline‑rich breakfast without tasting 'eggy'.\n\n**How to Try It:**\n• Temper egg with a little hot oats first to prevent curdling.\n• Cook until thick and no liquid egg remains.\n• Top with fruit/nut butter for balance.",
    "contraindications": "Ensure egg is fully cooked; avoid if egg‑allergic.",
    "goal_tags": [
      "protein_intake",
      "choline_intake",
      "satiety",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "nutrition_upgrade",
      "simple_swap"
    ],
    "motivational_mechanism": [
      "satiety",
      "stealth"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "oats",
      "egg",
      "fruit",
      "nut_butter"
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
    "kitchen_equipment": [
      "saucepan",
      "whisk"
    ],
    "cooking_skill_required": "basic",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "protein_gap",
      "choline_gap",
      "morning_energy"
    ]
  },
  {
    "tip_id": "f7b96ddc-e90d-4d21-aaff-ab77c31fd05f",
    "summary": "Make maple pots de crème for a choline‑rich dessert.",
    "details_md": "**The Experiment:** Bake a simple egg‑yolk custard sweetened with maple syrup until set.\n\n**Why it Works:** Egg yolks are choline‑dense; custard is an easy, craveable way to include them.\n\n**How to Try It:**\n• Use pasteurized dairy; bake until custard reaches ~160°F and sets.\n• Chill for a few hours before serving.\n• Top with berries for freshness.",
    "contraindications": "Fully cook custard; avoid if egg/dairy‑allergic.",
    "goal_tags": [
      "choline_intake",
      "healthy_snacking",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "nutrition_upgrade",
      "food_swap"
    ],
    "motivational_mechanism": [
      "indulgence",
      "stealth"
    ],
    "time_cost_enum": "30_60_min",
    "money_cost_enum": "$$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "eggs",
      "milk",
      "maple_syrup",
      "berries"
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
    "kitchen_equipment": [
      "oven",
      "ramekins",
      "thermometer (optional)"
    ],
    "cooking_skill_required": "basic",
    "satisfies_craving": "sweet",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": [
      "choline_gap",
      "sweet_cravings"
    ]
  },
  {
    "tip_id": "b0e72e31-0479-4961-b9a2-e59f0764aba9",
    "summary": "Double up on dairy: Greek yogurt, hard cheeses, high‑protein milk.",
    "details_md": "**The Experiment:** Swap sour cream for Greek yogurt; add cheese to snacks; choose ultrafiltered milk.\n\n**Why it Works:** Effortless way to boost protein and calcium when meat sounds unappealing.\n\n**How to Try It:**\n• Keep single‑serve Greek yogurt cups handy.\n• Pair cheese with fruit or whole‑grain crackers.\n• Use high‑protein milk in oats/smoothies.",
    "contraindications": "Use only pasteurized dairy. If lactose intolerant, choose lactose‑free or fortified non‑dairy alternatives.",
    "goal_tags": [
      "protein_intake",
      "calcium_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "simple_swap",
      "nutrition_upgrade"
    ],
    "motivational_mechanism": [
      "convenience",
      "taste"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "greek_yogurt",
      "cheese",
      "milk"
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
      "protein_gap",
      "calcium_gap",
      "nausea_aversion_to_meat"
    ]
  },
  {
    "tip_id": "c414a924-38c0-4385-b249-b13b3d9e39ec",
    "summary": "Use protein‑fortified pancake mix, pasta, or cereal to quietly raise protein.",
    "details_md": "**The Experiment:** Replace one staple with its higher‑protein version this week.\n\n**Why it Works:** Upgrades familiar foods without extra volume or effort.\n\n**How to Try It:**\n• Try chickpea/lentil pasta or protein pancake mix.\n• Pick cereals with ≥10g protein per serving.\n• Rotate options to prevent taste fatigue.",
    "contraindications": "If you have celiac disease, choose certified gluten‑free options. Check labels for added sugars or artificial sweeteners if they bother you.",
    "goal_tags": [
      "protein_intake",
      "satiety",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "simple_swap",
      "planning"
    ],
    "motivational_mechanism": [
      "stealth",
      "convenience"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "protein_pasta",
      "protein_pancake_mix",
      "high_protein_cereal"
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
      "protein_gap",
      "energy_crashes"
    ]
  },
  {
    "tip_id": "4023164b-2b78-4b5f-b7e1-4ec1cad05e92",
    "summary": "Add protein powder or nut butter to oatmeal/smoothies.",
    "personalization_prompt": "Create your protein power-up combo:",
    "personalization_type": "multi_text" as const,
    "personalization_config": {
      "items": [
        { "label": "Base (oatmeal/smoothie):", "placeholder": "e.g., Berry smoothie, cinnamon oatmeal" },
        { "label": "Protein boost:", "placeholder": "e.g., Vanilla protein powder, almond butter" }
      ]
    },
    "details_md": "**The Experiment:** Stir in one scoop of protein powder or a spoonful of nut butter.\n\n**Why it Works:** Small additions meaningfully increase protein and satiety.\n\n**How to Try It:**\n• Choose a pregnancy‑safe protein powder if using.\n• Blend into smoothies or stir into warm oats.\n• Adjust liquid for desired texture.",
    "contraindications": "Check ingredients if sensitive; some powders contain herbs/sweeteners. Select pregnancy‑appropriate powders without high‑dose herbs/stimulants; verify vitamin A forms/amounts; some sweeteners may cause GI upset.",
    "goal_tags": [
      "protein_intake",
      "satiety",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "nutrition_upgrade",
      "small_changes"
    ],
    "motivational_mechanism": [
      "convenience",
      "satiety"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "protein_powder",
      "nut_butter",
      "oats",
      "milk"
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
      "protein_gap",
      "hunger"
    ]
  },
  {
    "tip_id": "df05f966-4c0b-4829-91be-a5ddc0171668",
    "summary": "Snack on edamame for protein, iron, and folate in one bite.",
    "details_md": "**The Experiment:** Microwave frozen edamame and sprinkle with a little salt.\n\n**Why it Works:** A salty, satisfying snack that covers multiple prenatal nutrients.\n\n**How to Try It:**\n• Buy frozen in‑pod edamame for convenience.\n• Portion into small bowls to grab‑and‑go.\n• Add chili flakes or lemon if you like.",
    "contraindications": "Avoid if soy‑allergic. If on thyroid hormone (levothyroxine), separate soy intake and medication by at least 4 hours.",
    "goal_tags": [
      "protein_intake",
      "iron_intake",
      "folate_intake",
      "healthy_snacking",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "snacks",
      "simple_swap"
    ],
    "motivational_mechanism": [
      "taste",
      "convenience"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "edamame",
      "salt"
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
      "protein_gap",
      "anemia_risk",
      "snack_attacks"
    ]
  },
  {
    "tip_id": "ab2ef623-ad42-4162-abe4-2c1e08a1fc24",
    "summary": "Make white‑bean hummus for an iron‑rich dip.",
    "details_md": "**The Experiment:** Blend cannellini beans with olive oil, lemon, garlic, and salt.\n\n**Why it Works:** White beans provide notable iron; lemon adds vitamin C for absorption.\n\n**How to Try It:**\n• Serve with bell peppers and whole‑grain crackers.\n• Batch on Sunday; use all week.\n• Add tahini for creaminess if you like.",
    "contraindications": "Beans can worsen IBS symptoms for some; increase gradually and drink water.",
    "goal_tags": [
      "iron_intake",
      "fiber_intake",
      "healthy_snacking",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "meal_prep",
      "nutrition_upgrade"
    ],
    "motivational_mechanism": [
      "taste",
      "convenience"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "white_beans",
      "lemon",
      "olive_oil",
      "tahini"
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
    "kitchen_equipment": [
      "blender_or_processor"
    ],
    "cooking_skill_required": "none",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "anemia_risk",
      "constipation"
    ]
  },
  {
    "tip_id": "78d7ca48-0fcd-4189-a40c-4e3441557364",
    "summary": "Cook tomato‑based meals in cast iron for a tiny iron boost.",
    "details_md": "**The Experiment:** Use a cast‑iron skillet or Dutch oven for chili or marinara night.\n\n**Why it Works:** A small amount of iron leaches into acidic foods—an effortless micro‑boost.\n\n**How to Try It:**\n• Keep pans well seasoned to prevent sticking.\n• Avoid storing leftovers in cast iron.\n• Pair with vitamin C‑rich sides for better absorption.",
    "contraindications": "If you’ve been advised to limit iron (e.g., hemochromatosis), use standard cookware instead.",
    "goal_tags": [
      "iron_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "kitchen_hack",
      "nutrition_upgrade"
    ],
    "motivational_mechanism": [
      "convenience"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
    "kitchen_equipment": [
      "cast_iron_pan"
    ],
    "cooking_skill_required": "none",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "anemia_risk"
    ]
  },
  {
    "tip_id": "d67a23ae-4f49-416b-8e8d-fec79b5c916f",
    "summary": "Pair plant iron with vitamin C; separate iron from dairy/tea/coffee.",
    "details_md": "**The Experiment:** Add citrus, bell pepper, or berries when you eat beans/greens or take iron.\n\n**Why it Works:** Vitamin C increases non‑heme iron absorption; calcium/tannins inhibit it.\n\n**How to Try It:**\n• Squeeze lemon over lentils or spinach.\n• Have strawberries with fortified cereal.\n• Take iron 1–2 hours away from dairy/coffee/tea.",
    "contraindications": "Use only pasteurized dairy. If lactose intolerant, choose lactose‑free or fortified non‑dairy alternatives.",
    "goal_tags": [
      "iron_intake",
      "anemia_prevention",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "education",
      "behavioral_strategy"
    ],
    "motivational_mechanism": [
      "competence",
      "self_efficacy"
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
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
      "anemia_risk"
    ]
  },
  {
    "tip_id": "e0870a76-f08e-4907-97f7-926bd3c42487",
    "summary": "Munch roasted seaweed snacks for an iodine boost.",
    "details_md": "**The Experiment:** Keep seaweed snack packs as your salty, crunchy go‑to.\n\n**Why it Works:** Seaweed provides iodine to support thyroid and baby’s brain.\n\n**How to Try It:**\n• Rotate with other snacks to avoid overdoing iodine.\n• Check labels; avoid high‑dose kelp supplements.\n• Pair with cooked rice/avocado for a mini 'sushi' bite.",
    "contraindications": "Moderate intake; avoid concentrated kelp supplements without clinician guidance. Choose nori/laver snacks; avoid kelp/kombu due to excessive iodine. If you have thyroid disease or take levothyroxine, discuss consistent iodine intake with your clinician.",
    "goal_tags": [
      "iodine_intake",
      "healthy_snacking",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "snacks",
      "nutrition_upgrade"
    ],
    "motivational_mechanism": [
      "craving_substitution",
      "convenience"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "seaweed_snacks"
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
    "satisfies_craving": "salty_crunchy",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": [
      "iodine_gap",
      "chip_cravings"
    ]
  },
  {
    "tip_id": "09517674-539f-425f-9548-94ec13805eff",
    "summary": "Make mini nori hand‑rolls with cooked fillings at home.",
    "details_md": "**The Experiment:** Use seaweed sheets to wrap rice, avocado, and cooked tofu/shrimp/egg.\n\n**Why it Works:** A fun, fast way to combine iodine, healthy fats, and protein—sushi vibes, zero worry.\n\n**How to Try It:**\n• Prep a container of cooked rice for the week.\n• Lay out fillings and roll like a taco.\n• Serve with soy sauce and pickled ginger.",
    "contraindications": "Ensure fillings are fully cooked and use pasteurized mayo; avoid raw sprouts.",
    "goal_tags": [
      "iodine_intake",
      "DHA_intake",
      "protein_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "meal_prep",
      "food_swap"
    ],
    "motivational_mechanism": [
      "fun",
      "novelty"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "nori",
      "rice",
      "avocado",
      "tofu",
      "shrimp_cooked",
      "egg"
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
    "kitchen_equipment": [
      "rice_cooker (optional)"
    ],
    "cooking_skill_required": "basic",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "cravings",
      "nutrient_gaps"
    ]
  },
  {
    "tip_id": "ac1037c0-7e02-4b05-99a3-2b75021e6533",
    "summary": "Smash avocado on whole‑grain toast for a folate‑rich breakfast.",
    "details_md": "**The Experiment:** Top a slice of whole‑grain bread with 1/2 avocado, lemon, and salt.\n\n**Why it Works:** Combines natural folate from avocado with fortified folic acid in bread.\n\n**How to Try It:**\n• Add a cooked egg for protein/choline.\n• Sprinkle seeds for extra fiber.\n• Squeeze lemon if tolerated.",
    "contraindications": null,
    "goal_tags": [
      "folate_intake",
      "healthy_breakfast",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "simple_swap",
      "nutrition_upgrade"
    ],
    "motivational_mechanism": [
      "taste",
      "convenience"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "avocado",
      "whole_grain_bread",
      "egg"
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
      "folate_gap",
      "morning_energy"
    ]
  },
  {
    "tip_id": "693e8696-2938-430a-8de1-b80996742e0e",
    "summary": "Blend dates into a banana‑peanut butter smoothie (third‑trimester fave).",
    "details_md": "**The Experiment:** Blend milk, banana, 2–3 pitted dates, and peanut butter until creamy.\n\n**Why it Works:** Sneaks in dates for fiber/energy in a dessert‑like smoothie.\n\n**How to Try It:**\n• Use frozen banana for a milkshake vibe.\n• Add cocoa and ice for a 'chocolate shake'.\n• Adjust dates to taste if very sweet.",
    "contraindications": "Mind total sugars if managing blood sugar; pit dates carefully.",
    "goal_tags": [
      "healthy_snacking",
      "fiber_intake",
      "labor_prep_habit",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "snacks",
      "nutrition_upgrade"
    ],
    "motivational_mechanism": [
      "indulgence",
      "craving_substitution"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "dates",
      "banana",
      "peanut_butter",
      "milk"
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
    "kitchen_equipment": [
      "blender"
    ],
    "cooking_skill_required": "none",
    "satisfies_craving": "sweet",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": [
      "sweet_cravings",
      "constipation"
    ]
  },
  {
    "tip_id": "fb3c859b-e936-48d2-b9eb-db3751b6e5bd",
    "summary": "Try 6 dates/day in late pregnancy—make them fun so it sticks.",
    "details_md": "**The Experiment:** Stuff dates with nut butter/cream cheese, or chop into oats/yogurt to reach your daily count.\n\n**Why it Works:** Dates are fiber‑rich and may support a smoother labor; creative prep prevents date fatigue.\n\n**How to Try It:**\n• Freeze stuffed dates for a 'caramel' treat.\n• Add to oatmeal or blend into smoothies.\n• Spread intake across the day.",
    "contraindications": "High natural sugars; adjust if you have GD—discuss with your clinician. Dates are high in natural sugars—adjust portions if managing gestational diabetes and pair with protein/fat.",
    "goal_tags": [
      "fiber_intake",
      "labor_prep_habit",
      "healthy_snacking",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "behavioral_strategy",
      "snacks"
    ],
    "motivational_mechanism": [
      "reward",
      "habit"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "dates",
      "nut_butter",
      "yogurt",
      "oatmeal"
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
    "satisfies_craving": "sweet",
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "constipation",
      "sweet_cravings"
    ]
  },
  {
    "tip_id": "a01d8e4c-69ab-478b-a7bf-9af0628b0295",
    "summary": "Carry a mini snack kit to avoid emergency junk food.",
    "details_md": "**The Experiment:** Pack nuts, dried fruit, whole‑grain crackers, and a shelf‑stable protein (e.g., nut butter packet).\n\n**Why it Works:** Prevents hanger and stabilizes blood sugar between meals.\n\n**How to Try It:**\n• Restock your kit every Sunday.\n• Keep another kit in your car/desk.\n• Add a small water bottle to the kit.",
    "contraindications": "Customize for food allergies (nuts, dairy, gluten).",
    "goal_tags": [
      "healthy_snacking",
      "stable_blood_sugar",
      "reduce_ultra_processed",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "environmental_design",
      "planning"
    ],
    "motivational_mechanism": [
      "convenience",
      "self_efficacy"
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
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
    "preserves_foods": [],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": true,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "cooking_skill_required": "none",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "random_cravings",
      "energy_crashes",
      "nausea_from_empty_stomach"
    ]
  },
  {
    "tip_id": "d9013b80-59b4-485e-a829-4f6f8437983e",
    "summary": "Batch‑cook on good days, freeze portions for tired days.",
    "details_md": "**The Experiment:** Double a recipe (soup, chili, burritos) and freeze half in single servings.\n\n**Why it Works:** Removes decision fatigue and ensures nutritious meals when energy is low.\n\n**How to Try It:**\n• Label with date and contents.\n• Freeze flat in bags for quick thawing.\n• Keep a 'freezer menu' list on the fridge.",
    "contraindications": "Cool foods quickly, store safely, and reheat leftovers to 165°F; eat within 3–4 days once thawed.",
    "goal_tags": [
      "meal_prep",
      "consistency",
      "reduce_takeout",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "planning",
      "environmental_design"
    ],
    "motivational_mechanism": [
      "convenience",
      "future_self_reward"
    ],
    "time_cost_enum": "30_60_min",
    "money_cost_enum": "$$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
    "preserves_foods": [],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": true,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [
      "freezer",
      "labels",
      "storage_bags"
    ],
    "cooking_skill_required": "basic",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "fatigue",
      "decision_fatigue",
      "budget"
    ]
  },
  {
    "tip_id": "ffc2cd67-ff11-4a61-babc-5987b819452e",
    "summary": "Gamify nutrition: track daily servings (water, fruit/veg, protein).",
    "details_md": "**The Experiment:** Use a habit app or fridge chart to check off targets each day.\n\n**Why it Works:** Visible progress boosts motivation and consistency without calorie counting.\n\n**How to Try It:**\n• Pick 2–3 targets (e.g., 8 cups water, 5 servings produce).\n• Celebrate streaks; keep goals gentle.\n• Reset weekly if you miss—no guilt.",
    "contraindications": null,
    "goal_tags": [
      "increase_hydration",
      "produce_intake",
      "protein_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "tracking",
      "behavioral_strategy"
    ],
    "motivational_mechanism": [
      "gamification",
      "visual_cues"
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
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
      "consistency",
      "awareness"
    ]
  },
  {
    "tip_id": "bb116996-3631-47df-a068-d23bce5b0ca9",
    "summary": "Buy pre‑cut or frozen produce to remove prep barriers.",
    "details_md": "**The Experiment:** Stock baby carrots, bagged salad, and frozen veg/fruit for instant sides and smoothies.\n\n**Why it Works:** When the healthy choice is the easy choice, you’ll choose it more often.\n\n**How to Try It:**\n• Place ready‑to‑eat produce at eye level in the fridge.\n• Keep frozen veg for quick steam‑in‑bag sides.\n• Wash grapes/berries as soon as you get home.",
    "contraindications": null,
    "goal_tags": [
      "produce_intake",
      "fiber_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "environmental_design",
      "simple_swap"
    ],
    "motivational_mechanism": [
      "convenience",
      "visual_cues"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
    "kitchen_equipment": [
      "microwave (optional)"
    ],
    "cooking_skill_required": "none",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": [
      "constipation",
      "snacking",
      "time_pressure"
    ]
  },
  {
    "tip_id": "bb59679d-d891-4526-9a09-7e5d2077b3cf",
    "summary": "Team up with a friend or group to share meal pics and wins.",
    "details_md": "**The Experiment:** Start a group chat to post dinner photos and hydration check‑ins.\n\n**Why it Works:** Social accountability and ideas from peers make habits stick.\n\n**How to Try It:**\n• Pick a theme challenge (e.g., 'eat the rainbow').\n• Cheer small wins; no food policing.\n• Share 1 recipe each week.",
    "contraindications": null,
    "goal_tags": [
      "accountability",
      "consistency",
      "produce_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "social_support",
      "accountability"
    ],
    "motivational_mechanism": [
      "community",
      "encouragement"
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
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
      "motivation",
      "variety"
    ]
  },
  {
    "tip_id": "2540ea74-28a4-46da-a5c4-ca690b81d649",
    "summary": "Keep a 7‑day food + symptom journal to spot your triggers and wins.",
    "details_md": "**The Experiment:** Note what you ate and how you felt (nausea, heartburn, energy) 1–3 hours later.\n\n**Why it Works:** Patterns reveal which foods help or hinder so you can personalize your plan.\n\n**How to Try It:**\n• Keep entries short—bullets or photos are fine.\n• Mark heartburn nights and what you ate before.\n• Use findings to make simple swaps next week.",
    "contraindications": null,
    "goal_tags": [
      "self_awareness",
      "heartburn_relief",
      "reduce_nausea",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "mindfulness_practice",
      "tracking"
    ],
    "motivational_mechanism": [
      "self_awareness",
      "insight"
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
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
      "reflux_triggers",
      "nausea_triggers",
      "energy_management"
    ]
  },
  {
    "tip_id": "9f34f055-f5d0-434a-94c4-7127415321f6",
    "summary": "Find a healthier 'doppelganger' for your strongest craving.",
    "details_md": "**The Experiment:** Match the texture/temp/flavor (e.g., 'nice cream' for ice cream, popcorn for chips).\n\n**Why it Works:** Satisfies the sensory need while upgrading nutrition.\n\n**How to Try It:**\n• Identify the craving core (cold/sweet, salty/crunchy).\n• Test 2–3 alternatives and rate satisfaction.\n• Keep your favorite swap stocked.",
    "contraindications": "Limit sugar alcohols if they cause bloating/diarrhea; choose caffeine‑free swaps in the afternoon/evening.",
    "goal_tags": [
      "craving_management",
      "less_processed_food",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "food_swap",
      "behavioral_strategy"
    ],
    "motivational_mechanism": [
      "craving_substitution",
      "autonomy"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
    "satisfies_craving": "varies",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": [
      "sweet_cravings",
      "salty_cravings",
      "binges"
    ]
  },
  {
    "tip_id": "2a5cdbed-50a5-48ab-8ffe-253cb369d7bd",
    "summary": "Boost omega‑3s with ground flax/chia or omega‑3 eggs if you skip fish.",
    "details_md": "**The Experiment:** Add 1 Tbsp flax/chia to breakfast and choose omega‑3 eggs for scrambles.\n\n**Why it Works:** Covers omega‑3 needs via plants and fortified foods when fish isn’t appealing.\n\n**How to Try It:**\n• Grind flax for better absorption; store cold.\n• Use omega‑3 eggs in fully cooked dishes.\n• Ask your provider about algae‑based DHA if needed.",
    "contraindications": "If using supplements (e.g., algae‑based DHA), select third‑party tested brands and confirm dose with your clinician.",
    "goal_tags": [
      "DHA_intake",
      "omega3_intake",
      "choline_intake",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "nutrition_upgrade",
      "simple_swap"
    ],
    "motivational_mechanism": [
      "stealth",
      "convenience"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [
      "flaxseed",
      "chia",
      "omega3_eggs"
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
      "DHA_gap",
      "choline_gap"
    ]
  },
  {
    "tip_id": "c8e87457-4618-4149-945b-204d8a9cf126",
    "summary": "Find a healthy 'safe meal' you love—and repeat it.",
    "details_md": "**The Experiment:** Pick one balanced meal that always sounds good and put it on repeat this week.\n\n**Why it Works:** Consistency beats perfection; repeating a well‑tolerated meal ensures steady nutrients.\n\n**How to Try It:**\n• Example: veggie omelet + toast; or turkey‑cheese melt (heated) + salad.\n• Batch prep ingredients to reduce effort.\n• Rotate sides/sauces to prevent boredom.",
    "contraindications": "Ensure meats/eggs are fully cooked and cheeses are pasteurized; vary sides to cover micronutrients over the week.",
    "goal_tags": [
      "consistency",
      "reduce_nausea",
      "nutrient_density",
      "healthy_pregnancy"
    ],
    "tip_type": [
      "mindset_reframe",
      "planning"
    ],
    "motivational_mechanism": [
      "simplicity",
      "relief"
    ],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": [
      "home",
      "work"
    ],
    "social_mode": "either",
    "time_of_day": [
      "any"
    ],
    "cue_context": [],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
      "decision_fatigue",
      "aversion",
      "energy"
    ]
  },
  


  {
    "tip_id": "c3d4e5f6-f003-4003-b003-34567890abcd",
    "summary": "Eat with your non-dominant hand to slow down.",
    "personalization_prompt": "Which meal will you try eating like a beginner (with your non-dominant hand)?",
    "personalization_type": "choice" as const,
    "personalization_config": {
      "choices": ["Breakfast", "Lunch", "Dinner", "Snack time"],
      "multiple": false
    },
    "details_md": "**The Experiment:** At one meal today, try eating with your non-dominant hand.[4]\n\n**Why it Works:** This simple mechanical trick disrupts the automatic, mindless process of eating. The awkwardness forces you to slow down, pay more attention to each bite, and become more aware of your body's fullness cues.[4]\n\n**How to Try It:**\n• Simply switch your fork or spoon to the hand you don't normally use.\n• This works best with meals that require utensils.\n• Notice how it changes the pace and experience of your meal.",
    "contraindications": null,
    "goal_tags": ["portion_control", "mindful_eating"],
    "tip_type": ["behavioral_strategy", "mindfulness_practice"],
    "motivational_mechanism": ["self_awareness"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["home", "work", "restaurant"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
    "cognitive_load": 2,
    "helps_with": ["mindless_eating", "overeating"]
  },
  {
    "tip_id": "d4e5f6g7-f004-4004-b004-4567890abcde",
    "summary": "Make healthy food visible and junk food invisible.",
    "details_md": "**The Experiment:** Take 5 minutes to rearrange your kitchen counter. Place a bowl of fresh, ready-to-eat fruit in a prominent spot. Move any cookies, chips, or candy into an opaque container and put it on a high shelf or in the back of a cupboard.\n\n**Why it Works:** This is a classic choice architecture strategy. We are wired to eat what is most visible and convenient. By making the healthy choice the easy choice, you put good habits on autopilot.\n\n**How to Try It:**\n• Use a beautiful bowl for your fruit to make it more appealing.\n• The goal is \"out of sight, out of mind\" for less healthy options.[7, 8]\n• Apply the same logic to your fridge: put healthy snacks at eye level.",
    "contraindications": null,
    "goal_tags": ["weight_loss", "healthy_snacking", "less_processed_food"],
    "tip_type": ["environmental_design"],
    "motivational_mechanism": ["convenience", "visual_cues"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 2,
    "location_tags": ["home"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["at_home"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["junk_food", "fruit"],
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
    "helps_with": ["mindless_eating", "sugar_addiction", "junk_food_addiction"]
  },
  {
    "tip_id": "e5f6g7h8-f005-4005-b005-567890abcdef",
    "summary": "Use smaller plates to trick your brain into feeling full.",
    "details_md": "**The Experiment:** For your next meal, serve your food on a smaller plate (like a salad plate instead of a large dinner plate).[2]\n\n**Why it Works:** It's a powerful visual illusion. A standard portion of food looks more abundant on a smaller plate, which can increase feelings of psychological satisfaction and fullness.[2, 9] This can help you naturally reduce your portion sizes without feeling deprived.\n\n**How to Try It:**\n• Use a 9-inch plate instead of a 12-inch one.[2]\n• You can also try using smaller bowls and even smaller utensils, like appetizer forks, to further slow down your eating.[2, 3]",
    "contraindications": null,
    "goal_tags": ["weight_loss", "portion_control", "mindful_eating"],
    "tip_type": ["environmental_design", "behavioral_strategy"],
    "motivational_mechanism": ["visual_cues", "satiety"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
    "helps_with": ["overeating"]
  },
  {
    "tip_id": "f6g7h8i9-f006-4006-b006-67890abcdef0",
    "summary": "Link drinking water to checking your phone.",
    "personalization_prompt": "What kind of phone checking activity will you pair with water?",
    "personalization_type": "text" as const,
    "personalization_config": {
      "placeholder": "e.g., Checking social media, texts, email, or notifications"
    },
    "details_md": "**The Experiment:** For one day, make this your rule: **Every time you check your phone, take a sip of water.**[10]\n\n**Why it Works:** This is a perfect example of habit stacking. It links a new, desired behavior (drinking water) to an existing, frequent habit (checking your phone), making it almost automatic.[10, 11] It's an effortless way to stay hydrated, as thirst is often mistaken for hunger.[3]\n\n**How to Try It:**\n• Keep a water bottle on your desk, in your bag, or wherever you spend the most time with your phone.\n• The cue is the action of picking up or looking at your phone.[10]\n• Don't worry about big gulps; small, consistent sips add up.",
    "contraindications": null,
    "goal_tags": ["increase_hydration", "reduce_cravings", "improve_energy"],
    "tip_type": ["habit_stacking"],
    "motivational_mechanism": ["convenience", "repetition"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["using_phone"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
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
    "helps_with": ["mindless_eating", "fatigue", "dehydration"]
  },
  {
    "tip_id": "g7h8i9j0-f007-4007-b007-7890abcdef01",
    "summary": "Add one healthy ingredient to every meal.",
    "personalization_prompt": "Pick your 'power-up' ingredients for today's meals:",
    "personalization_type": "multi_text" as const,
    "personalization_config": {
      "items": [
        { "label": "Breakfast booster:", "placeholder": "e.g., Chia seeds, berries, spinach" },
        { "label": "Lunch upgrade:", "placeholder": "e.g., Avocado, nuts, extra veggies" },
        { "label": "Dinner enhancer:", "placeholder": "e.g., Hemp hearts, mushrooms, herbs" }
      ]
    },
    "details_md": "**The Experiment:** For every meal you plate today, add one extra nutrient-rich ingredient.[10]\n\n**Why it Works:** This is a low-friction way to boost the nutritional value of foods you already eat. It focuses on addition, not restriction, which feels positive and is easier to sustain. Over time, these small additions compound into significant health benefits.[10]\n\n**How to Try It:**\n• Toss a handful of spinach into scrambled eggs or pasta sauce.[10]\n• Mix a tablespoon of chia seeds or flax seeds into yogurt or oatmeal.[2, 6]\n• Add extra sliced veggies (peppers, cucumbers, tomatoes) to a sandwich or wrap.[10]",
    "contraindications": null,
    "goal_tags": ["increase_nutrients", "increase_fiber", "increase_vegetables"],
    "tip_type": ["habit_stacking", "healthy_swap"],
    "motivational_mechanism": ["gamification", "positive_reinforcement"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
    "preserves_foods": [],
    "veggie_intensity": "low",
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
    "helps_with": ["nutrient_deficiency"]
  },
  {
    "tip_id": "h8i9j0k1-f008-4008-b008-890abcdef012",
    "summary": "Use a spritz of water or vinegar to season popcorn.",
    "details_md": "**The Experiment:** Make a bowl of plain, air-popped popcorn. Instead of butter, lightly spritz it with water or plain vinegar before adding seasonings.[6]\n\n**Why it Works:** This clever hack allows salt-free seasonings (like garlic powder, chili powder, or cinnamon) to stick to the popcorn without adding the fat and calories of butter or oil. The vinegar spritz creates a salt-and-vinegar flavor without the high-sodium seasoning packet.[6]\n\n**How to Try It:**\n• Use a small, clean spray bottle for the water or vinegar.[6]\n• Spritz lightly, toss the popcorn, and then sprinkle on your seasoning.\n• This makes a high-fiber, whole-grain snack that satisfies a crunchy craving.[12, 13]",
    "contraindications": null,
    "goal_tags": ["reduce_fat", "reduce_sodium", "healthy_snacking"],
    "tip_type": ["food_hack", "healthy_swap"],
    "motivational_mechanism": ["sensory", "crave_buster"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home"],
    "social_mode": "either",
    "time_of_day": ["afternoon", "evening"],
    "cue_context": ["snack_time", "craving_event"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["popcorn"],
    "preserves_foods": [],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": ["air_popper", "microwave"],
    "cooking_skill_required": "none",
    "satisfies_craving": ["crunchy", "salty"],
    "substitution_quality": "different_but_good",
    "cognitive_load": 1,
    "helps_with": ["mindless_eating"]
  },
  {
    "tip_id": "i9j0k1l2-f009-4009-b009-90abcdef0123",
    "summary": "Make creamy 'ice cream' from frozen bananas.",
    "details_md": "**The Experiment:** When you crave ice cream, blend one or two frozen, sliced bananas in a blender or food processor until it reaches a smooth, soft-serve consistency.[12, 14]\n\n**Why it Works:** This swap delivers the cold, creamy texture of ice cream using a whole fruit base. It's naturally sweet and provides fiber and potassium without the high levels of added sugar and saturated fat found in traditional ice cream.[12, 14]\n\n**How to Try It:**\n• Peel and slice ripe bananas before freezing them on a baking sheet.[12]\n• You may need to add a splash of milk or stop and scrape down the sides of the blender a few times.\n• Get creative by adding a spoonful of cocoa powder for chocolate 'nice cream' or other frozen fruits like berries.[2]",
    "contraindications": null,
    "goal_tags": ["weight_loss", "reduce_sugar", "reduce_fat", "less_processed_food"],
    "tip_type": ["healthy_swap", "crave_buster"],
    "motivational_mechanism": ["sensory"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home"],
    "social_mode": "either",
    "time_of_day": ["evening", "late_night"],
    "cue_context": ["snack_time", "craving_event"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["ice_cream"],
    "preserves_foods": [],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": ["blender", "freezer"],
    "cooking_skill_required": "basic",
    "satisfies_craving": ["sweet", "creamy", "cold"],
    "substitution_quality": "different_but_good",
    "cognitive_load": 1,
    "helps_with": ["sugar_addiction"]
  },
  {
    "tip_id": "j0k1l2m3-f010-4010-b010-0abcdef01234",
    "summary": "Satisfy fast-food cravings with a smaller portion.",
    "personalization_prompt": "Which fast food item and what size will you get?",
    "personalization_type": "multi_text" as const,
    "personalization_config": {
      "items": [
        { "label": "Fast food item:", "placeholder": "e.g., Chicken nuggets" },
        { "label": "Size:", "placeholder": "e.g., 6-piece instead of 10-piece" }
      ]
    },
    "details_md": "**The Experiment:** The next time you have an undeniable craving for a specific fast-food meal, go get it—but order a smaller version. For example, get a 6-piece nugget and small fries instead of a large combo meal.[15]\n\n**Why it Works:** This strategy of mindful indulgence acknowledges that complete restriction often backfires, leading to binges.[15, 16] By satisfying the specific craving with a sensible portion, you avoid feelings of deprivation and the \"all-or-nothing\" cycle, making it a sustainable long-term approach.[15]\n\n**How to Try It:**\n• Plan the indulgence in advance to make it a conscious choice, not an impulse.\n• Skip the sugary soda to save a significant amount of calories and sugar.[17]\n• Savor the smaller portion mindfully, without distractions, to maximize enjoyment.[18]",
    "contraindications": null,
    "goal_tags": ["weight_loss", "portion_control", "mindful_eating", "harm_reduction"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["crave_buster", "psychological_relief"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["restaurant"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["craving_event", "eating_out"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["fast_food"],
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
    "satisfies_craving": ["salty", "savory", "fatty"],
    "substitution_quality": "same_but_less",
    "cognitive_load": 2,
    "helps_with": ["binge_eating", "diet_trauma"]
  },
  {
    "tip_id": "k1l2m3n4-f011-4011-b011-abcdef012345",
    "summary": "Get a quick pizza fix with this low-carb bowl.",
    "details_md": "**The Experiment:** For a super-fast, savory craving-buster, put some pepperoni, a spoonful of tomato sauce, and shredded mozzarella cheese in a microwave-safe bowl. Microwave until melty and gooey.[19]\n\n**Why it Works:** This hack isolates the most craved flavors of pizza (the savory meat, tangy sauce, and melted cheese) without the high-carb crust. It's a quick, portion-controlled way to satisfy a specific craving in under two minutes.[19]\n\n**How to Try It:**\n• Use a few slices of pepperoni, about a tablespoon of sauce, and a sprinkle of cheese.[19]\n• You can add other pizza toppings you have on hand, like sliced olives or mushrooms.\n• Eat with a fork to slow down and savor the flavors.",
    "contraindications": null,
    "goal_tags": ["reduce_carbs", "portion_control", "reduce_cravings"],
    "tip_type": ["food_hack", "crave_buster"],
    "motivational_mechanism": ["convenience", "sensory"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["craving_event", "snack_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["pizza"],
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
    "kitchen_equipment": ["microwave"],
    "cooking_skill_required": "none",
    "satisfies_craving": ["savory", "cheesy", "salty"],
    "substitution_quality": "different_but_good",
    "cognitive_load": 1,
    "helps_with": ["junk_food_addiction"]
  },
  {
    "tip_id": "l2m3n4o5-f012-4012-b012-bcdef0123456",
    "summary": "Turn a simple apple into a fun, decadent-tasting snack.",
    "details_md": "**The Experiment:** Slice an apple and arrange the slices on a plate. Drizzle with a spoonful of melted peanut or almond butter and sprinkle with a few dark chocolate chips.[20]\n\n**Why it Works:** This snack hits multiple craving points—sweet, salty, and crunchy—while being based on a whole fruit. It feels indulgent but provides fiber from the apple and healthy fats and protein from the nut butter, making it far more satisfying and nutritious than a candy bar.[20, 14]\n\n**How to Try It:**\n• Use an apple corer/slicer to make it even faster.[20, 21]\n• Warm the nut butter in the microwave for 10-15 seconds to make it easy to drizzle.\n• Get creative with toppings like a sprinkle of cinnamon, granola, or shredded coconut.[20]",
    "contraindications": null,
    "goal_tags": ["healthy_snacking", "increase_fiber", "reduce_sugar"],
    "tip_type": ["food_hack", "healthy_swap"],
    "motivational_mechanism": ["sensory", "gamification"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["afternoon", "evening"],
    "cue_context": ["snack_time", "craving_event"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["candy", "cookies"],
    "preserves_foods": [],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": ["microwave"],
    "cooking_skill_required": "none",
    "satisfies_craving": ["sweet", "crunchy", "salty"],
    "substitution_quality": "different_but_good",
    "cognitive_load": 1,
    "helps_with": ["sugar_addiction"]
  },
  {
    "tip_id": "m3n4o5p6-f013-4013-b013-cdef01234567",
    "summary": "Use a rotisserie chicken for fast, healthy protein all week.",
    "details_md": "**The Experiment:** Buy one rotisserie chicken during your weekly grocery shop. As soon as you get home, pull the meat from the bones and store it in the fridge.[22]\n\n**Why it Works:** This is a meal prep game-changer for busy people. It provides a ready-to-use, versatile source of lean protein, eliminating the time and effort of cooking chicken during the week. This makes assembling healthy meals incredibly fast.[23, 22]\n\n**How to Try It:**\n• Add the shredded chicken to bagged salads for a quick lunch.[5]\n• Use it as a filling for wraps or quesadillas with whole-wheat tortillas.[19, 23]\n• Mix it with Greek yogurt or avocado for a healthier chicken salad.[24, 25]",
    "contraindications": null,
    "goal_tags": ["increase_protein", "meal_prep", "time_saving"],
    "tip_type": ["food_hack", "meal_prep_strategy"],
    "motivational_mechanism": ["convenience", "efficiency"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$$",
    "mental_effort": 1,
    "physical_effort": 2,
    "location_tags": ["home"],
    "social_mode": "solo",
    "time_of_day": ["any"],
    "cue_context": ["meal_prep_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
    "preserves_foods": [],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "cooking_skill_required": "none",
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 1,
    "helps_with": ["decision_fatigue"]
  },


  


  {
    "tip_id": "b1c2d3e4-0011-4011-a011-234567890ab1",
    "summary": "Boost your breakfast with protein.",
    "details_md": "**The Experiment:** Start your day with a protein-rich breakfast, aiming for 15-25 grams.[1]\n\n**Why it Works:** Protein is the most satiating macronutrient. It digests slowly and suppresses hunger hormones, which helps you feel full longer and can reduce cravings later in the day.[1, 2] Your body also burns more calories digesting protein compared to carbs and fats.\n\n**How to Try It:**\n• Swap a bagel or cereal for two eggs with whole-wheat toast and avocado.[1]\n• Add a scoop of protein powder or a tablespoon of peanut butter to your oatmeal.[3]\n• Top high-protein frozen waffles with nuts and berries.[1]",
    "contraindications": [],
    "goal_tags": ["weight_loss", "increase_protein", "reduce_cravings", "improve_energy"],
    "tip_type": ["healthy_swap", "habit_stacking"],
    "motivational_mechanism": ["satiety", "energy_boost"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 2,
    "location_tags": ["home"],
    "social_mode": "either",
    "time_of_day": ["morning"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["cereal", "bagels", "toast"],
    "preserves_foods": [],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": ["stove_top", "microwave"],
    "cooking_skill_required": "basic",
    "satisfies_craving": null,
    "substitution_quality": "different_but_good",
    "cognitive_load": 2,
    "helps_with": ["mindless_eating", "sugar_addiction"]
  },
{
  "tip_id": "c2d3e4f5-0012-4012-a012-34567890ab12",
  "summary": "Swap mayonnaise for Greek yogurt or mashed avocado.",
  "details_md": "**The Experiment:** For one day, replace the mayonnaise in your sandwiches, salads (like tuna or chicken), or spreads with either plain nonfat Greek yogurt or mashed avocado.\n\n**Why it Works:** This swap significantly cuts saturated fat and calories. Greek yogurt provides a major protein boost, increasing satiety.[4] Mashed avocado adds healthy monounsaturated fats and fiber, which also help you feel full.[5]\n\n**How to Try It:**\n• Use a 1:1 ratio when swapping mayo for plain Greek yogurt in a recipe like tuna salad.[4]\n• For a sandwich, simply spread a quarter of a mashed avocado instead of mayo.\n• Add a squeeze of lemon or lime to the avocado to prevent browning.",
  "contraindications": [],
  "goal_tags": ["weight_loss", "reduce_fat", "increase_protein", "less_processed_food"],
  "tip_type": ["healthy_swap"],
  "motivational_mechanism": ["sensory"],
  "time_cost_enum": "0_5_min",
  "money_cost_enum": "$",
  "mental_effort": 1,
  "physical_effort": 1,
  "location_tags": ["home", "work"],
  "social_mode": "either",
  "time_of_day": ["morning", "afternoon"],
  "cue_context": ["meal_time", "snack_time"],
  "difficulty_tier": 1,
  "created_by": "dietitian_reviewed",
  "involves_foods": ["mayonnaise"],
  "preserves_foods": ["tuna_salad", "chicken_salad", "sandwiches"],
  "veggie_intensity": "none",
  "family_friendly": true,
  "kid_approved": false,
  "partner_resistant_ok": true,
  "chaos_level_max": 5,
  "requires_planning": false,
  "impulse_friendly": true,
  "diet_trauma_safe": true,
  "feels_like_diet": false,
  "kitchen_equipment": ["none"],
  "cooking_skill_required": "none",
  "satisfies_craving": ["creamy"],
  "substitution_quality": "close_enough",
  "cognitive_load": 1,
  "helps_with": []
},
{
  "tip_id": "d3e4f5g6-0013-4013-a013-4567890ab123",
  "summary": "Swap sour cream for plain Greek yogurt or blended cottage cheese.",
  "details_md": "**The Experiment:** Instead of using sour cream as a topping (on tacos, chili, or baked potatoes) or in a dip, use plain nonfat Greek yogurt or blended low-fat cottage cheese.\n\n**Why it Works:** This is a high-impact swap that dramatically increases protein while cutting fat and calories. Blended cottage cheese has a neutral, creamy flavor, while Greek yogurt offers a similar tangy taste to sour cream. Both options increase satiety.[4, 6]\n\n**How to Try It:**\n• Use a 1:1 ratio of plain Greek yogurt for sour cream.\n• To make a creamy base, blend low-fat cottage cheese in a food processor or blender until completely smooth. You can add ranch seasoning for a high-protein veggie dip.[6]",
  "contraindications": [],
  "goal_tags": ["weight_loss", "reduce_fat", "increase_protein"],
  "tip_type": ["healthy_swap", "crave_buster"],
  "motivational_mechanism": ["sensory"],
  "time_cost_enum": "0_5_min",
  "money_cost_enum": "$",
  "mental_effort": 1,
  "physical_effort": 1,
  "location_tags": ["home", "restaurant"],
  "social_mode": "either",
  "time_of_day": ["afternoon", "evening"],
  "cue_context": ["meal_time"],
  "difficulty_tier": 1,
  "created_by": "dietitian_reviewed",
  "involves_foods": ["sour_cream"],
  "preserves_foods": ["tacos", "chili", "baked_potato", "dips"],
  "veggie_intensity": "none",
  "family_friendly": true,
  "kid_approved": false,
  "partner_resistant_ok": true,
  "chaos_level_max": 5,
  "requires_planning": false,
  "impulse_friendly": true,
  "diet_trauma_safe": true,
  "feels_like_diet": false,
  "kitchen_equipment": ["blender"],
  "cooking_skill_required": "none",
  "satisfies_craving": ["creamy", "savory"],
  "substitution_quality": "close_enough",
  "cognitive_load": 1,
  "helps_with": []
},
{
  "tip_id": "e4f5g6h7-0014-4014-a014-567890ab1234",
  "summary": "Swap potato chips for air-popped popcorn.",
  "details_md": "**The Experiment:** When you're craving a crunchy, salty snack, reach for air-popped popcorn instead of potato chips.\n\n**Why it Works:** Popcorn is a whole grain, providing significantly more fiber and volume for far fewer calories than chips. This satisfies the desire for a crunchy snack while helping you feel full and avoiding the high fat content of fried chips.[7, 8]\n\n**How to Try It:**\n• Use an air popper or the paper bag method in the microwave to pop plain kernels.\n• Control the salt yourself and experiment with other seasonings like chili powder, garlic powder, or nutritional yeast for a cheesy flavor.[7]",
  "contraindications": [],
  "goal_tags": ["weight_loss", "reduce_fat", "increase_fiber", "less_processed_food"],
  "tip_type": ["healthy_swap", "crave_buster"],
  "motivational_mechanism": ["sensory"],
  "time_cost_enum": "0_5_min",
  "money_cost_enum": "$",
  "mental_effort": 1,
  "physical_effort": 1,
  "location_tags": ["home", "work"],
  "social_mode": "either",
  "time_of_day": ["afternoon", "evening", "late_night"],
  "cue_context": ["snack_time", "boredom", "craving_event"],
  "difficulty_tier": 1,
  "created_by": "dietitian_reviewed",
  "involves_foods": ["potato_chips"],
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
  "kitchen_equipment": ["microwave", "air_popper"],
  "cooking_skill_required": "none",
  "satisfies_craving": ["crunchy", "salty"],
  "substitution_quality": "close_enough",
  "cognitive_load": 1,
  "helps_with": ["mindless_eating"]
},
{
  "tip_id": "f5g6h7i8-0015-4015-a015-67890ab12345",
  "summary": "Swap ice cream for frozen grapes or 'nice cream'.",
  "details_md": "**The Experiment:** When a craving for a sweet, frozen dessert strikes, try eating a bowl of frozen grapes or making banana 'nice cream' instead of regular ice cream.\n\n**Why it Works:** These swaps provide the sweet, cold, and creamy sensations of ice cream using whole fruits, which contain natural sugars, fiber, and micronutrients without the high levels of added sugar and saturated fat found in most ice creams.[9] Frozen grapes develop a sorbet-like texture.[10]\n\n**How to Try It:**\n• For frozen grapes, simply wash, dry, and freeze a bunch of grapes in a single layer on a baking sheet. Store in a freezer-safe bag.\n• For 'nice cream', blend one or two frozen, sliced bananas in a blender or food processor until it reaches a smooth, soft-serve consistency.[11]",
  "contraindications": [],
  "goal_tags": ["weight_loss", "reduce_sugar", "reduce_fat", "less_processed_food"],
  "tip_type": ["healthy_swap", "crave_buster"],
  "motivational_mechanism": ["sensory"],
  "time_cost_enum": "0_5_min",
  "money_cost_enum": "$",
  "mental_effort": 1,
  "physical_effort": 1,
  "location_tags": ["home"],
  "social_mode": "either",
  "time_of_day": ["evening", "late_night"],
  "cue_context": ["snack_time", "craving_event"],
  "difficulty_tier": 2,
  "created_by": "dietitian_reviewed",
  "involves_foods": ["ice_cream"],
  "preserves_foods": [],
  "veggie_intensity": "none",
  "family_friendly": true,
  "kid_approved": true,
  "partner_resistant_ok": true,
  "chaos_level_max": 4,
  "requires_planning": true,
  "impulse_friendly": false,
  "diet_trauma_safe": true,
  "feels_like_diet": false,
  "kitchen_equipment": ["freezer", "blender"],
  "cooking_skill_required": "basic",
  "satisfies_craving": ["sweet", "creamy", "cold"],
  "substitution_quality": "different_but_good",
  "cognitive_load": 1,
  "helps_with": ["sugar_addiction"]
},
{
  "tip_id": "g6h7i8j9-0016-4016-a016-7890ab123456",
  "summary": "Swap ground beef for 99% lean ground turkey.",
  "details_md": "**The Experiment:** In a recipe that calls for ground beef, such as pasta sauce, tacos, or burgers, use 99% lean ground turkey or chicken instead.\n\n**Why it Works:** This simple swap dramatically reduces the total and saturated fat content of your meal without sacrificing the satisfying texture of ground meat. This is an easy way to make favorite comfort foods healthier.[4, 6]\n\n**How to Try It:**\n• Substitute it 1:1 in any recipe.\n• Since lean turkey is lower in fat, you may need to add a small amount of oil to the pan to prevent sticking.\n• Be sure to season it well, as it has a milder flavor than beef.",
  "contraindications": [],
  "goal_tags": ["weight_loss", "reduce_fat", "heart_health"],
  "tip_type": ["healthy_swap"],
  "motivational_mechanism": ["mastery"],
  "time_cost_enum": "0_5_min",
  "money_cost_enum": "$",
  "mental_effort": 1,
  "physical_effort": 1,
  "location_tags": ["home"],
  "social_mode": "either",
  "time_of_day": ["evening"],
  "cue_context": ["meal_time"],
  "difficulty_tier": 1,
  "created_by": "dietitian_reviewed",
  "involves_foods": ["ground_beef"],
  "preserves_foods": ["tacos", "pasta_sauce", "burgers", "chili"],
  "veggie_intensity": "none",
  "family_friendly": true,
  "kid_approved": true,
  "partner_resistant_ok": false,
  "chaos_level_max": 4,
  "requires_planning": false,
  "impulse_friendly": true,
  "diet_trauma_safe": true,
  "feels_like_diet": false,
  "kitchen_equipment": ["stove_top"],
  "cooking_skill_required": "basic",
  "satisfies_craving": ["savory"],
  "substitution_quality": "close_enough",
  "cognitive_load": 1,
  "helps_with": []
},
{
  "tip_id": "h7i8j9k0-0017-4017-a017-890ab1234567",
  "summary": "Reorganize your plate: ½ veggies, ¼ protein, ¼ whole grains.",
  "details_md": "**The Experiment:** For one meal, visually divide your plate and fill half of it with non-starchy vegetables, one quarter with lean protein, and one quarter with whole grains.[3, 12]\n\n**Why it Works:** This simple visual guide, promoted by Harvard's Healthy Eating Plate, naturally increases your intake of fiber, vitamins, and minerals while managing portions of more calorie-dense starches and proteins. It promotes fullness and nutrient density without needing to count calories.[3, 12]\n\n**How to Try It:**\n• Start by filling the largest section (half your plate) with colorful veggies like broccoli, spinach, bell peppers, or a large salad.\n• Add a palm-sized portion of lean protein like grilled chicken, fish, or beans.[12]\n• Fill the final quarter with a fist-sized portion of whole grains like quinoa, brown rice, or whole-wheat pasta.[12]\n• Note: Starchy veggies like potatoes, corn, and peas count as grains in this model.[3]",
  "contraindications": [],
  "goal_tags": ["weight_loss", "increase_veggies", "portion_control", "improve_gut_health"],
  "tip_type": ["mindset_shift", "environment_design"],
  "motivational_mechanism": ["mastery", "decision_ease"],
  "time_cost_enum": "0_5_min",
  "money_cost_enum": "$",
  "mental_effort": 2,
  "physical_effort": 1,
  "location_tags": ["home", "restaurant"],
  "social_mode": "either",
  "time_of_day": ["afternoon", "evening"],
  "cue_context": ["meal_time"],
  "difficulty_tier": 2,
  "created_by": "dietitian_reviewed",
  "involves_foods": [],
  "preserves_foods": ["chicken", "fish", "rice", "pasta"],
  "veggie_intensity": "heavy",
  "family_friendly": true,
  "kid_approved": false,
  "partner_resistant_ok": true,
  "chaos_level_max": 4,
  "requires_planning": false,
  "impulse_friendly": true,
  "diet_trauma_safe": true,
  "feels_like_diet": true,
  "kitchen_equipment": ["none"],
  "cooking_skill_required": "none",
  "cognitive_load": 2,
  "helps_with": ["mindless_eating"]
},
{
  "tip_id": "i8j9k0l1-0018-4018-a018-90ab12345678",
  "summary": "Brush your teeth right after dinner to prevent evening snacking.",
  "details_md": "**The Experiment:** Tonight, make it a point to brush and floss your teeth immediately after you finish eating dinner.\n\n**Why it Works:** This simple habit creates a powerful psychological cue that eating is finished for the day. The clean, minty feeling makes other foods and drinks (besides water) less appealing, which can effectively curb mindless late-night snacking or dessert cravings.[13]\n\n**How to Try It:**\n• As soon as you've cleared your plate, head to the bathroom and complete your dental routine.\n• Make it a non-negotiable part of your dinner cleanup process.\n• If a craving hits later, the thought of having to brush again can be a deterrent.",
  "contraindications": [],
  "goal_tags": ["weight_loss", "reduce_sugar", "reduce_cravings"],
  "tip_type": ["habit_stacking", "time_ritual", "crave_buster"],
  "motivational_mechanism": ["decision_ease", "sensory"],
  "time_cost_enum": "0_5_min",
  "money_cost_enum": "$",
  "mental_effort": 2,
  "physical_effort": 1,
  "location_tags": ["home"],
  "social_mode": "solo",
  "time_of_day": ["evening"],
  "cue_context": ["meal_time", "boredom", "craving_event"],
  "difficulty_tier": 1,
  "created_by": "dietitian_reviewed",
  "involves_foods": ["dessert", "snacks"],
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
  "kitchen_equipment": ["none"],
  "cooking_skill_required": "none",
  "satisfies_craving": null,
  "substitution_quality": "not_applicable",
  "cognitive_load": 2,
  "helps_with": ["mindless_eating", "late_night_eating"]
},





  {
    tip_id: 'a1b2c3d4-0001-4001-a001-1234567890ab',
    summary: 'Swap one sugary drink for water or sparkling water.',
    details_md: `**The Experiment:** For one day, whenever you would normally reach for a soda, sweetened juice, or other sugary beverage, substitute it with plain or naturally flavored sparkling water.

**Why it Works:** Sugary drinks are a major source of "empty" calories and added sugars, which can contribute to weight gain and blood sugar fluctuations. Water or sparkling water provides hydration and can offer the satisfying carbonation of soda without the sugar or calories, helping to break the sugar habit.

**How to Try It:**
• Keep a pitcher of cold water or a few cans of sparkling water in the fridge
• If you enjoy flavor, add a squeeze of fresh lemon, lime, or a few muddled berries yourself
• When at a restaurant, ask for water or sparkling water with lemon instead of soda`,
    contraindications: ['phenylketonuria'],
    goal_tags: ['weight_loss', 'reduce_sugar', 'improve_hydration', 'less_processed_food'],
    tip_type: ['healthy_swap', 'crave_buster'],
    motivational_mechanism: ['sensory', 'decision_ease'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work', 'restaurant', 'social_event', 'commute'],
    social_mode: 'either',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['craving_event', 'meal_time', 'snack_time'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    involves_foods: ['soda'],
    preserves_foods: [], // Doesn't preserve soda, which could be a conflict
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 5, // Works even in total chaos
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false, // Just a swap, not restrictive
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    satisfies_craving: ['sweet', 'soda'],
    substitution_quality: 'close_enough',
    cognitive_load: 1,
    helps_with: ['mindless_eating', 'sugar_addiction']
  },
  {
    tip_id: 'a1b2c3d4-0002-4002-a002-1234567890ac',
    summary: 'Add one serving of vegetables to your dinner.',
    details_md: `**The Experiment:** Intentionally add one extra serving of vegetables to your dinner plate tonight. A serving is about the size of your fist or one cup.

**Why it Works:** Most people don't eat enough vegetables. They are packed with vitamins, minerals, fiber, and antioxidants that are crucial for health and can lower the risk of chronic diseases. Adding volume with low-calorie, high-fiber vegetables can also help you feel fuller, aiding in portion control and weight management.

**How to Try It:**
• Add a handful of spinach to a pasta sauce or soup
• Steam or roast a side of broccoli or green beans
• Start your meal with a simple side salad
• Frozen vegetables are a quick and easy option; just microwave and serve`,
    contraindications: [],
    goal_tags: ['increase_veggies', 'weight_loss', 'improve_gut_health', 'less_processed_food', 'plant_based'],
    tip_type: ['healthy_swap', 'habit_stacking'],
    motivational_mechanism: ['mastery', 'sensory'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'either',
    time_of_day: ['evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    veggie_intensity: 'light', // Just one serving
    veggie_strategy: 'mixed_in', // Can be mixed into existing food
    family_friendly: true,
    kid_approved: false, // Depends on the kid!
    partner_resistant_ok: true, // Just add to your own plate
    chaos_level_max: 4, // Pretty easy even when busy
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['microwave_only'], // Can use frozen + microwave
    cooking_skill_required: 'basic',
    cognitive_load: 2,
    helps_with: ['mindless_eating'],
    preserves_foods: ['pasta', 'meat', 'cheese'], // Still eating your normal dinner
    texture_profile: ['soft', 'crispy'] // Depends on cooking method
  },
  {
    tip_id: 'f4a5b6c7-d8e9-0123-fabc-456789012345',
    summary: 'Eat one meal without distractions.',
    details_md: `**The Experiment:** Choose one meal today—breakfast, lunch, or dinner—and eat it without any distractions. This means no phone, no TV, no computer, no reading. Just you and your food.

**Why it Works:** Mindful eating helps you reconnect with your body's natural hunger and fullness signals. Eating without distraction allows you to slow down, savor flavors and textures, and better recognize when you are satisfied, which can prevent overeating.

**How to Try It:**
• Sit at a table
• Put your phone in another room
• Pay attention to the colors, smells, sounds, and textures of your food
• Try putting your fork down between bites to pace yourself`,
    contraindications: [],
    goal_tags: ['weight_loss', 'improve_gut_health'],
    tip_type: ['mindset_shift', 'environment_design'],
    motivational_mechanism: ['sensory', 'comfort'],
    time_cost_enum: '15_60_min',
    money_cost_enum: '$',
    mental_effort: 3,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 3,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    veggie_intensity: 'not_applicable',
    family_friendly: false, // Hard with kids around
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 2, // Needs quiet focus
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 4, // High mental effort
    helps_with: ['speed_eating', 'mindless_eating', 'emotional_eating'],
    preserves_foods: ['chocolate', 'cheese', 'bread', 'pasta', 'meat'], // All foods still allowed
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0006-4006-a006-1234567890b0',
    summary: 'Habit Stack: Drink a glass of water before your morning coffee.',
    details_md: `**The Experiment:** Before you have your first cup of coffee or tea in the morning, drink a full 8 oz (240 ml) glass of water.

**Why it Works:** This is a classic "habit stacking" technique, attaching a new desired habit (drinking water) to a strong existing habit (morning coffee). It starts your day with hydration, as you're often dehydrated after sleeping, and can help you reach your daily fluid goals.

**How to Try It:**
• The night before, place a glass and a pitcher of water right next to your coffee maker
• Make it a non-negotiable rule: water first, then coffee`,
    contraindications: [],
    goal_tags: ['improve_hydration', 'improve_energy'],
    tip_type: ['habit_stacking', 'time_ritual'],
    motivational_mechanism: ['decision_ease', 'energy_boost'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['morning'],
    cue_context: ['craving_event'],
    difficulty_tier: 1,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['coffee'], // Still get your coffee!
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 5, // Works even in morning chaos
    requires_planning: true, // Need to set up night before
    prep_timing: 'night_before',
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 1,
    helps_with: [],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0010-4010-a010-1234567890b4',
    summary: "The Kitchen Makeover: Hide one 'red light' food.",
    details_md: `**The Experiment:** Identify one food or snack in your kitchen that you tend to overeat or know isn't helping your goals (a "red light" food). Move it out of sight.

**Why it Works:** This is a small-scale version of the "kitchen makeover". You are changing your food environment to make the less-healthy choice harder to access. Out of sight is often out of mind. This reduces the number of times you have to exercise willpower during the day.

**How to Try It:**
• Move the cookies from the counter to a high shelf in the pantry
• Put the bag of chips in an opaque container instead of its original crinkly bag
• Ask a family member to store a tempting item where you won't easily find it`,
    contraindications: [],
    goal_tags: ['weight_loss', 'reduce_sugar', 'less_processed_food'],
    tip_type: ['environment_design'],
    motivational_mechanism: ['decision_ease'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon', 'evening', 'late_night'],
    cue_context: ['boredom', 'stress'],
    difficulty_tier: 1,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    involves_foods: [], // Works with any problem food
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread'], // Still have access, just hidden
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: false, // Kids might protest!
    partner_resistant_ok: false, // Partner needs to be on board
    chaos_level_max: 5,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 1,
    helps_with: ['mindless_eating', 'boredom_eating', 'stress_eating'],
    common_failure_points: ['family_resistance', 'forgetting_location'],
    sustainability: 'daily_habit',
    // Personalization
    personalization_prompt: "Plan your kitchen makeover:",
    personalization_type: 'multi_text' as const,
    personalization_config: {
      items: [
        {
          label: "What 'red light' food will you hide?",
          placeholder: "e.g., Chips, cookies, candy"
        },
        {
          label: "Where will you hide it?",
          placeholder: "e.g., Top shelf, basement, behind other items"
        }
      ]
    }
  },
  {
    tip_id: 'a1b2c3d4-0019-4019-a019-1234567890bd',
    summary: 'Go for a 10-minute walk after a meal.',
    personalization_prompt: "I will try a 10-minute walk after:",
    personalization_type: "choice" as const,
    personalization_config: {
      choices: ["Breakfast", "Lunch", "Dinner"],
      multiple: false,
      style: "buttons" // or "dropdown"
    },
    details_md: `**The Experiment:** After one of your main meals today, go for a brisk 10-minute walk.

**Why it Works:** Walking after a meal can aid digestion and help stabilize blood sugar levels. It's a gentle way to incorporate more physical activity into your day, which contributes to overall energy expenditure and health. It also serves as a positive post-meal ritual instead of immediately sitting on the couch.

**How to Try It:**
• Right after you finish eating, put on your shoes and head out the door
• Walk around your neighborhood, a nearby park, or even just around your office building
• Listen to a podcast or music to make it more enjoyable`,
    contraindications: ['elderly_frailty'],
    goal_tags: ['weight_loss', 'improve_gut_health', 'reduce_sugar', 'improve_energy'],
    tip_type: ['habit_stacking', 'time_ritual'],
    motivational_mechanism: ['energy_boost', 'comfort'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 2,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta'], // All foods ok
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true, // Kids can join!
    partner_resistant_ok: true,
    works_with: ['picky_eaters', 'teenagers'],
    chaos_level_max: 3, // Need some time/weather cooperation
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 2,
    helps_with: ['emotional_eating', 'stress_eating'],
    common_failure_points: ['bad_weather', 'time_constraints'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0030-4030-a030-1234567890c8',
    summary: 'Drink a glass of water when you feel a snack craving.',
    details_md: `**The Experiment:** The next time you feel a craving for a snack, especially when you know you're not truly hungry (e.g., out of boredom or stress), drink a full glass of water first.

**Why it Works:** Thirst is often mistaken for hunger. Pausing to drink water gives you a moment to check in with your body's cues. It may satisfy the craving, or at least give you time to make a more mindful choice about whether you really need to eat.

**How to Try It:**
• When a craving hits, go to the kitchen or water cooler and drink an 8 oz (240 ml) glass of water
• Wait 10-15 minutes
• Re-evaluate if you are still hungry. If you are, choose a healthy snack. If not, you've successfully hydrated and avoided unnecessary calories`,
    contraindications: [],
    goal_tags: ['improve_hydration', 'weight_loss', 'mindset_shift', 'reduce_sugar'],
    tip_type: ['crave_buster', 'mindset_shift'],
    motivational_mechanism: ['decision_ease', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['afternoon', 'evening', 'late_night'],
    cue_context: ['craving_event', 'boredom', 'stress'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'bread'], // Can still have snack after if truly hungry
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 5,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    satisfies_craving: [], // Might delay but not satisfy specific cravings
    cognitive_load: 2,
    helps_with: ['mindless_eating', 'boredom_eating', 'stress_eating', 'grazing'],
    common_failure_points: ['easy_to_forget', 'requires_willpower'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0004-4004-a004-1234567890ae',
    summary: "Prep a 'Salad in a Jar' for tomorrow's lunch.",
    personalization_prompt: "Plan your salad jar layers. What ingredients will you use?",
    personalization_type: "list" as const,
    personalization_config: {
      items: [
        {
          label: "Bottom Layer - Dressing",
          placeholder: "e.g., Balsamic vinaigrette",
          description: "Keeps other ingredients from getting soggy",
          customizable: "description" as const
        },
        {
          label: "Layer 2 - Hearty Veggies",
          placeholder: "e.g., Cucumbers, tomatoes, peppers",
          description: "Won't wilt from dressing",
          customizable: "description" as const
        },
        {
          label: "Layer 3 - Protein",
          placeholder: "e.g., Grilled chicken, chickpeas, eggs",
          description: "Your main protein source",
          customizable: "description" as const
        },
        {
          label: "Layer 4 - Soft Items",
          placeholder: "e.g., Cheese, avocado, berries",
          description: "Protected from dressing",
          customizable: "description" as const
        },
        {
          label: "Top Layer - Greens",
          placeholder: "e.g., Spinach, lettuce, arugula",
          description: "Stays crisp on top",
          customizable: "description" as const
        }
      ]
    },
    details_md: `**The Experiment:** Prepare a "salad in a jar" tonight for a ready-to-go, healthy lunch tomorrow.

**Why it Works:** This is a classic meal prep technique that makes a healthy choice incredibly convenient, overcoming the common barrier of not having time to make a healthy lunch during a busy day. It's a form of environmental design for your future self.

**How to Try It:**
• Get a large mason jar
• Layer ingredients from wettest to driest: Pour dressing in the bottom. Add hard vegetables (carrots, cucumbers, peppers). Add grains/proteins (quinoa, chickpeas, grilled chicken). Add softer items (cheese, seeds, nuts). Top with leafy greens
• Seal and store in the fridge. To eat, just shake and pour into a bowl`,
    contraindications: [],
    goal_tags: ['weight_loss', 'increase_veggies', 'less_processed_food', 'plant_based', 'improve_gut_health'],
    tip_type: ['planning_ahead', 'environment_design', 'skill_building'],
    motivational_mechanism: ['decision_ease', 'mastery'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    veggie_intensity: 'heavy',
    veggie_strategy: 'front_and_center',
    family_friendly: true,
    kid_approved: false, // Kids might not love salad
    partner_resistant_ok: true,
    chaos_level_max: 3, // Need evening prep time
    requires_planning: true,
    requires_advance_prep: true,
    prep_timing: 'night_before',
    shelf_life: 'lasts_2_3_days',
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'], // Just need a jar
    cooking_skill_required: 'basic',
    cognitive_load: 3,
    helps_with: [],
    preserves_foods: ['cheese'], // Can include cheese
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0005-4005-a005-1234567890af',
    summary: 'Eat to 80% full at one meal.',
    personalization_prompt: "What sensations in your body will you pay attention to know you are at 80% full?",
    personalization_type: 'text' as const,
    personalization_config: {
      placeholder: "e.g., Slight pressure in stomach, no longer feeling hungry, clothes feeling comfortable"
    },
    details_md: `**The Experiment:** At one of your main meals today, practice eating slowly and stop when you feel about 80% full—satisfied, but not stuffed.

**Why it Works:** It takes about 15-20 minutes for your stomach to signal to your brain that it's full. Eating slowly and stopping at 80% full gives your body time to register satiety, helping you naturally reduce calorie intake without feeling deprived. This is a core habit for long-term weight management.

**How to Try It:**
• Serve yourself a slightly smaller portion than usual to start
• Eat slowly and mindfully, paying attention to how your stomach feels
• Pause halfway through your meal for a minute and assess your hunger level
• Aim for a feeling of "no longer hungry" rather than "full"`,
    contraindications: [],
    goal_tags: ['weight_loss', 'improve_gut_health'],
    tip_type: ['mindset_shift', 'self_monitoring'],
    motivational_mechanism: ['mastery', 'comfort'],
    time_cost_enum: '15_60_min',
    money_cost_enum: '$',
    mental_effort: 4,
    physical_effort: 1,
    location_tags: ['home', 'work', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 3,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'bread', 'pasta', 'meat'], // All foods ok
    veggie_intensity: 'not_applicable',
    family_friendly: false, // Hard with family distractions
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 2, // Needs calm eating environment
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: false, // Can feel restrictive
    feels_like_diet: true,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 4,
    helps_with: ['speed_eating', 'mindless_eating'],
    common_failure_points: ['requires_willpower', 'socially_awkward'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a7b8c9d0-e1f2-3456-abcd-789012345678',
    summary: 'Add 20-30g of protein to your breakfast.',
    personalization_prompt: "Design your protein-packed breakfast:",
    personalization_type: "text" as const,
    personalization_config: {
      placeholder: "e.g., 2 eggs + Greek yogurt + berries = 25g protein"
    },
    details_md: `**The Experiment:** Include a significant source of protein—like eggs, Greek yogurt, or protein powder—in your breakfast today. Aim for 20-30 grams.

**Why it Works:** Protein is the most satiating macronutrient. Including it in your first meal helps you feel full longer, reducing cravings and the likelihood of snacking on less healthy options before lunch. After an overnight fast, it also helps stabilize blood sugar and provides sustained energy.

**How to Try It:**
• Scramble 2-3 eggs instead of having just toast or cereal
• Stir a scoop of protein powder into your oatmeal or yogurt
• A cup of Greek yogurt or cottage cheese can provide over 20g of protein`,
    contraindications: ['egg_allergy', 'lactose_intolerance', 'phenylketonuria', 'kidney_disease'],
    goal_tags: ['weight_loss', 'muscle_gain', 'reduce_sugar', 'improve_energy'],
    tip_type: ['healthy_swap', 'planning_ahead'],
    motivational_mechanism: ['energy_boost', 'mastery'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'either',
    time_of_day: ['morning'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    involves_foods: ['dairy', 'meat'],
    preserves_foods: ['coffee', 'bread'], // Can still have these
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 3, // Need some morning cooking time
    requires_planning: false,
    impulse_friendly: false, // Need ingredients on hand
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['basic_stove', 'microwave_only'],
    cooking_skill_required: 'basic',
    cognitive_load: 2,
    helps_with: ['grazing'],
    texture_profile: ['creamy', 'soft'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0008-4008-a008-1234567890b2',
    summary: 'Swap a processed snack for a piece of whole fruit.',
    personalization_prompt: "What's your fruit swap mission today?",
    personalization_type: "multi_text" as const,
    personalization_config: {
      items: [
        { label: "Swap OUT:", placeholder: "e.g., Afternoon cookies, chips" },
        { label: "Swap IN:", placeholder: "e.g., Crispy apple, juicy orange" }
      ]
    },
    details_md: `**The Experiment:** Today, when you feel like having a snack, replace your usual choice (like chips, cookies, or a granola bar) with a piece of whole fruit.

**Why it Works:** Whole fruit provides fiber, vitamins, and water, making it a more nutrient-dense and filling choice than most processed snacks. This simple swap reduces your intake of added sugars, refined grains, and unhealthy fats while increasing your intake of beneficial nutrients.

**How to Try It:**
• Keep a bowl of fruit like apples, bananas, or oranges visible on your counter
• Pack a portable fruit with you for work or errands
• To make it more satisfying, pair it with a small handful of nuts or a spoonful of peanut butter`,
    contraindications: [],
    goal_tags: ['increase_veggies', 'weight_loss', 'reduce_sugar', 'less_processed_food', 'improve_gut_health'],
    tip_type: ['healthy_swap', 'crave_buster'],
    motivational_mechanism: ['sensory', 'decision_ease'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work', 'commute'],
    social_mode: 'solo',
    time_of_day: ['afternoon', 'morning'],
    cue_context: ['snack_time', 'craving_event'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    preserves_foods: [], // Not preserving junk food
    veggie_intensity: 'light', // Fruit counts!
    veggie_strategy: 'gradual',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 5,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    satisfies_craving: ['sweet', 'crunchy'],
    substitution_quality: 'different_but_good',
    cognitive_load: 1,
    helps_with: ['mindless_eating', 'boredom_eating'],
    texture_profile: ['crunchy', 'crispy', 'soft'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'b4c5d6e7-f8a9-0123-bcde-456789012345',
    summary: 'Try the "Colorful Plate" Challenge.',
    personalization_prompt: "Build your rainbow! Pick 3+ colors for your plate:",
    personalization_type: "choice" as const,
    personalization_config: {
      choices: ["Red (tomatoes, peppers)", "Orange (carrots, squash)", "Yellow (corn, bell peppers)", "Green (broccoli, spinach)", "Blue/Purple (eggplant, cabbage)", "White (cauliflower, onions)"],
      multiple: true
    },
    details_md: `**The Experiment:** For one meal today, try to include foods of at least three different colors on your plate.

**Why it Works:** Different colors in fruits and vegetables signify the presence of different vitamins, minerals, and antioxidant compounds (phytonutrients). "Eating the rainbow" is a simple heuristic to ensure you're getting a wide variety of nutrients that support overall health, from your immune system to your cardiovascular system.

**How to Try It:**
• Make a salad with green lettuce, red tomatoes, and yellow bell peppers
• Create a stir-fry with purple cabbage, orange carrots, and green broccoli
• Roast a mix of red onions, green zucchini, and white cauliflower`,
    contraindications: [],
    goal_tags: ['increase_veggies', 'improve_gut_health', 'less_processed_food', 'plant_based'],
    tip_type: ['skill_building', 'mindset_shift'],
    motivational_mechanism: ['sensory', 'novelty', 'mastery'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'either',
    time_of_day: ['evening', 'afternoon'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    veggie_intensity: 'heavy',
    veggie_strategy: 'front_and_center',
    family_friendly: true,
    kid_approved: true, // Kids love colorful food
    partner_resistant_ok: false, // Need buy-in for veggie-heavy meal
    chaos_level_max: 3,
    requires_planning: true, // Need variety of produce
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['basic_stove', 'full_kitchen'],
    cooking_skill_required: 'basic',
    cognitive_load: 2,
    helps_with: [],
    texture_profile: ['crunchy', 'soft'],
    sustainability: 'occasionally'
  },
  {
    tip_id: 'a1b2c3d4-e5f6-7890-abcd-123456789012',
    summary: 'Choose whole grains over refined for one meal.',
    details_md: `**The Experiment:** For one meal today, deliberately choose a whole-grain carbohydrate source instead of a refined one.

**Why it Works:** Whole grains like brown rice, quinoa, and whole-wheat bread contain more fiber, vitamins, and minerals than their refined counterparts (white rice, white bread). The higher fiber content helps you feel full for longer, aids in digestion, and supports more stable blood sugar levels.

**How to Try It:**
• Swap white pasta for whole-wheat pasta
• Choose brown rice instead of white rice with your stir-fry or curry
• Make a sandwich using 100% whole-wheat bread. Look for "100% whole grain" as the first ingredient`,
    contraindications: ['celiac'],
    goal_tags: ['weight_loss', 'improve_gut_health', 'less_processed_food', 'better_lipids', 'reduce_sugar', 'improve_energy'],
    tip_type: ['healthy_swap', 'skill_building'],
    motivational_mechanism: ['mastery', 'sensory'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time', 'grocery_shopping'],
    difficulty_tier: 2,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    involves_foods: ['bread', 'pasta', 'carbs'],
    preserves_foods: ['meat', 'cheese'], // Still eating normal meals
    veggie_intensity: 'none',
    family_friendly: false, // Family might resist whole grains
    kid_approved: false,
    partner_resistant_ok: true, // Can make just for yourself
    chaos_level_max: 4,
    requires_planning: false,
    impulse_friendly: false, // Need right products on hand
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['basic_stove'],
    cooking_skill_required: 'basic',
    texture_profile: ['chewy'],
    cognitive_load: 2,
    helps_with: [],
    substitution_quality: 'close_enough',
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0012-4012-a012-1234567890b6',
    summary: 'Have a healthy fat snack like nuts or avocado.',
    personalization_prompt: "Pick your healthy fat superhero snack for today:",
    personalization_type: "choice" as const,
    personalization_config: {
      choices: ["The Nutty Professor (mixed nuts)", "Avocado Assassin (half avocado + salt)", "Apple & Almond Butter Alliance", "Walnut Warrior Mix", "Pistchio Power Pack"],
      multiple: false
    },
    details_md: `**The Experiment:** For one of your snacks today, choose a source of healthy fats, such as a small handful of nuts (about 1/4 cup) or half an avocado.

**Why it Works:** Healthy fats are essential for hormone production and overall health. They are also very satiating, helping to keep you full between meals. Nuts and avocados also provide fiber and other important nutrients. Contrary to old beliefs, dietary fat is not to be feared and is a key part of a balanced diet.

**How to Try It:**
• A small handful of almonds, walnuts, or mixed nuts
• Half an avocado sprinkled with salt and pepper
• Apple slices with a tablespoon of natural almond or peanut butter`,
    contraindications: ['nut_allergy'],
    goal_tags: ['weight_loss', 'better_lipids', 'improve_energy', 'reduce_sugar'],
    tip_type: ['healthy_swap', 'crave_buster'],
    motivational_mechanism: ['sensory', 'energy_boost'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work', 'commute'],
    social_mode: 'solo',
    time_of_day: ['afternoon'],
    cue_context: ['snack_time'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    preserves_foods: [],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 5,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    satisfies_craving: ['salty', 'creamy'],
    texture_profile: ['crunchy', 'creamy'],
    cognitive_load: 1,
    helps_with: ['grazing'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'e9f0a1b2-c3d4-5678-efab-901234567890',
    summary: 'Pre-portion snacks into daily servings.',
    personalization_prompt: "What snacks will you portion out and how many 'snack packs' will you make?",
    personalization_type: "multi_text" as const,
    personalization_config: {
      items: [
        { label: "Snack to portion:", placeholder: "e.g., Trail mix, crackers, nuts" },
        { label: "Number of packs:", placeholder: "e.g., 5 for the week" }
      ]
    },
    details_md: `**The Experiment:** If you plan to have snacks today, take five minutes in the morning to portion them out into small bags or containers.

**Why it Works:** This simple act of planning prevents mindless overeating directly from a large bag or box. It's a form of portion control that requires a decision only once, making it easier to stick to your goals when you're hungry or distracted later in the day. It's a key strategy for managing calorie intake without obsessive counting.

**How to Try It:**
• Get out a box of crackers or a bag of nuts
• Use a measuring cup or just count out a reasonable serving size (e.g., 1 ounce of nuts)
• Put each portion into a separate small container or zip-top bag`,
    contraindications: ['nut_allergy'],
    goal_tags: ['weight_loss', 'reduce_sugar', 'less_processed_food', 'better_lipids'],
    tip_type: ['planning_ahead', 'environment_design', 'self_monitoring'],
    motivational_mechanism: ['decision_ease', 'mastery'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['morning'],
    cue_context: ['snack_time', 'grocery_shopping'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese'], // Can portion these too
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 3, // Need morning prep time
    requires_planning: true,
    requires_advance_prep: true,
    prep_timing: 'night_before',
    shelf_life: 'lasts_week',
    impulse_friendly: false,
    diet_trauma_safe: false, // Can feel like diet restriction
    feels_like_diet: true,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 2,
    helps_with: ['mindless_eating', 'grazing', 'boredom_eating'],
    common_failure_points: ['easy_to_forget'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0014-4014-a014-1234567890b8',
    summary: 'Make your own simple salad dressing.',
    details_md: `**The Experiment:** Instead of using a store-bought bottled dressing, make your own simple vinaigrette for your salad today.

**Why it Works:** Many commercial salad dressings are high in added sugar, unhealthy fats, and sodium. Making your own is surprisingly easy and gives you complete control over the ingredients. A simple olive oil and vinegar dressing provides heart-healthy monounsaturated fats.

**How to Try It:**
• The classic ratio is 3 parts oil to 1 part vinegar
• In a small jar, combine 3 tablespoons of extra virgin olive oil with 1 tablespoon of balsamic or red wine vinegar
• Add a pinch of salt, pepper, and maybe a little Dijon mustard. Shake well and serve`,
    contraindications: [],
    goal_tags: ['less_processed_food', 'better_lipids', 'reduce_sugar', 'increase_veggies'],
    tip_type: ['skill_building', 'healthy_swap'],
    motivational_mechanism: ['mastery', 'sensory'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    veggie_intensity: 'moderate',
    veggie_strategy: 'front_and_center',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 4,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'basic',
    cognitive_load: 2,
    helps_with: [],
    preserves_foods: ['cheese', 'meat'],
    texture_profile: ['smooth'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'f8a9b0c1-d2e3-4567-fabc-890123456789',
    summary: 'Eat Slowly: Take 20+ Minutes for Main Meals.',
    details_md: `**The Experiment:** For one meal, set a timer for 20 minutes and aim to make the meal last the entire time.

**Why it Works:** This is a structured way to practice eating slowly. It forces you to pace yourself, which gives your brain the time it needs to register fullness cues from your stomach, helping to prevent overeating. This practice builds body awareness and is a powerful tool for mindful eating.

**How to Try It:**
• Set a timer on your phone or kitchen timer for 20 minutes when you sit down to eat
• Take smaller bites and chew each bite thoroughly
• Put your utensils down between bites
• Try to be the last person at the table to finish`,
    contraindications: [],
    goal_tags: ['weight_loss', 'improve_gut_health'],
    tip_type: ['time_ritual', 'self_monitoring', 'skill_building'],
    motivational_mechanism: ['mastery', 'comfort'],
    time_cost_enum: '15_60_min',
    money_cost_enum: '$',
    mental_effort: 3,
    physical_effort: 1,
    location_tags: ['home', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['evening', 'afternoon'],
    cue_context: ['meal_time'],
    difficulty_tier: 3,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'bread', 'pasta', 'meat', 'coffee'],
    veggie_intensity: 'not_applicable',
    family_friendly: false,
    kid_approved: false,
    partner_resistant_ok: false,
    chaos_level_max: 2,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: false,
    feels_like_diet: true,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 4,
    helps_with: ['speed_eating', 'mindless_eating'],
    common_failure_points: ['socially_awkward', 'requires_willpower'],
    sustainability: 'occasionally',
    // Personalization
    personalization_prompt: "What's your strategy for timing 20 minutes?",
    personalization_type: 'text' as const,
    personalization_config: {
      placeholders: ["e.g., Set a timer, put on a 20-minute playlist, watch a sitcom episode"]
    }
  },
  {
    tip_id: 'a1b2c3d4-0016-4016-a016-1234567890ba',
    summary: 'Eat your water: snack on cucumber or watermelon.',
    personalization_prompt: "Choose your 'water you can eat' adventure:",
    personalization_type: "choice" as const,
    personalization_config: {
      choices: ["Cucumber Spa Day", "Watermelon Wave", "Celery Crunch Time", "Melon Medley", "Tomato Tango"],
      multiple: false
    },
    details_md: `**The Experiment:** Have a snack that consists of a high-water-content food, like cucumber slices, celery sticks, or watermelon chunks.

**Why it Works:** Hydration doesn't only come from beverages. Many fruits and vegetables have very high water content, contributing to your daily fluid needs. These snacks are also typically low in calories and high in nutrients, making them a refreshing and healthy choice.

**How to Try It:**
• Slice up a cucumber and enjoy it plain or with a little hummus
• Cut a watermelon into cubes for a sweet, hydrating treat
• Pack some celery sticks for a crunchy snack on the go`,
    contraindications: [],
    goal_tags: ['improve_hydration', 'increase_veggies', 'weight_loss'],
    tip_type: ['healthy_swap'],
    motivational_mechanism: ['sensory', 'energy_boost'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['afternoon'],
    cue_context: ['snack_time'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    veggie_intensity: 'light',
    veggie_strategy: 'front_and_center',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 5,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    satisfies_craving: ['crunchy', 'sweet'],
    texture_profile: ['crunchy', 'crispy'],
    cognitive_load: 1,
    helps_with: ['mindless_eating'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0017-4017-a017-1234567890bb',
    summary: 'Add a "flavor boost" to water instead of juice.',
    personalization_prompt: "Create your signature water infusion recipe:",
    personalization_type: "text" as const,
    personalization_config: {
      placeholder: "e.g., Lemon + cucumber + mint = Spa Water"
    },
    details_md: `**The Experiment:** Instead of reaching for a fruit juice or other sweet drink, flavor a glass of water with fresh ingredients.

**Why it Works:** This provides flavor and novelty without the high sugar content of juice. Even 100% fruit juice is a concentrated source of sugar without the fiber of whole fruit. Infusing water is a great way to make hydration more appealing and reduce overall sugar intake.

**How to Try It:**
• Add slices of citrus (lemon, orange) and some fresh mint leaves to a pitcher of water
• Muddle a few raspberries or strawberries at the bottom of your glass before adding water
• Try cucumber slices and a sprig of rosemary for a more savory, spa-like flavor`,
    contraindications: [],
    goal_tags: ['improve_hydration', 'reduce_sugar', 'less_processed_food'],
    tip_type: ['healthy_swap', 'crave_buster'],
    motivational_mechanism: ['sensory', 'novelty'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'either',
    time_of_day: ['afternoon', 'morning'],
    cue_context: ['craving_event', 'snack_time'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    preserves_foods: [],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 4,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    satisfies_craving: ['sweet'],
    substitution_quality: 'different_but_good',
    cognitive_load: 1,
    helps_with: ['sugar_addiction'],
    texture_profile: ['smooth'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0018-4018-a018-1234567890bc',
    summary: 'Try Greek yogurt instead of sour cream or mayo.',
    details_md: `**The Experiment:** If you have a meal or snack that typically uses sour cream or mayonnaise, try substituting plain Greek yogurt instead.

**Why it Works:** Plain Greek yogurt has a similar tangy flavor and creamy texture to sour cream and mayo but is significantly higher in protein and lower in fat and calories. This swap boosts the nutritional value of your meal, helping you feel fuller and supporting muscle maintenance or growth.

**How to Try It:**
• Top a baked potato or chili with a dollop of Greek yogurt
• Make a creamy dip for vegetables using Greek yogurt as the base
• Use it in place of mayonnaise when making tuna or chicken salad`,
    contraindications: ['lactose_intolerance'],
    goal_tags: ['weight_loss', 'muscle_gain', 'less_processed_food', 'better_lipids'],
    tip_type: ['healthy_swap'],
    motivational_mechanism: ['mastery', 'sensory'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['afternoon', 'evening'],
    cue_context: ['meal_time', 'snack_time'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    involves_foods: ['dairy'],
    preserves_foods: ['bread', 'meat'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 5,
    requires_planning: false,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    texture_profile: ['creamy'],
    satisfies_craving: ['creamy'],
    substitution_quality: 'close_enough',
    cognitive_load: 1,
    helps_with: [],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0020-4020-a020-1234567890be',
    summary: "Create 'overnight oats' for tomorrow's breakfast.",
    details_md: `**The Experiment:** Tonight, take 5 minutes to prepare overnight oats for a grab-and-go breakfast tomorrow morning.

**Why it Works:** This is a powerful meal prep strategy that eliminates morning decision-making and ensures you start the day with a high-fiber, protein-rich meal. It's convenient, customizable, and helps prevent skipping breakfast or grabbing a less healthy option on the way out the door.

**How to Try It:**
• In a jar or container, combine equal parts rolled oats and milk (or a milk alternative). A common starting point is 1/2 cup of each
• Add a scoop of protein powder, a tablespoon of chia seeds, and some fruit like berries
• Stir, cover, and refrigerate overnight. Eat it cold in the morning`,
    contraindications: ['celiac'],
    goal_tags: ['weight_loss', 'muscle_gain', 'improve_hydration', 'improve_gut_health', 'reduce_sugar'],
    tip_type: ['planning_ahead', 'environment_design'],
    motivational_mechanism: ['decision_ease', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    involves_foods: ['dairy', 'carbs'],
    preserves_foods: ['coffee'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: true,
    requires_advance_prep: true,
    prep_timing: 'night_before',
    shelf_life: 'lasts_2_3_days',
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    texture_profile: ['creamy', 'soft'],
    cognitive_load: 2,
    helps_with: ['grazing'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0021-4021-a021-1234567890bf',
    summary: 'Have a hard-boiled egg for a snack.',
    details_md: `**The Experiment:** For a quick and easy snack, have one or two hard-boiled eggs.

**Why it Works:** Eggs are a powerhouse of nutrition, providing high-quality protein and essential vitamins and minerals in a convenient, low-calorie package. The protein helps keep you full and satisfied, making it an excellent choice for curbing hunger between meals and preventing overeating later.

**How to Try It:**
• Boil a batch of eggs at the beginning of the week so they are ready to grab
• A perfectly hard-boiled egg with a just-cooked yolk takes about 7-8 minutes in boiling water
• Peel and eat with a sprinkle of salt and pepper`,
    contraindications: ['egg_allergy'],
    goal_tags: ['weight_loss', 'muscle_gain', 'reduce_sugar'],
    tip_type: ['healthy_swap', 'planning_ahead'],
    motivational_mechanism: ['decision_ease', 'energy_boost'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon'],
    cue_context: ['snack_time'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    involves_foods: ['meat'],
    preserves_foods: [],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 4,
    requires_planning: true,
    requires_advance_prep: true,
    prep_timing: 'weekend_required',
    shelf_life: 'lasts_week',
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['basic_stove'],
    cooking_skill_required: 'basic',
    texture_profile: ['soft'],
    cognitive_load: 1,
    helps_with: ['grazing'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'd0e1f2a3-b4c5-6789-defa-012345678901',
    summary: 'Use Palm-Size Protein Portions.',
    details_md: `**The Experiment:** Include one palm-sized portion of protein (e.g., chicken, fish, tofu) at every meal today.

**Why it Works:** Consistent protein intake helps maintain muscle mass and promotes satiety. Using your palm as a guide is a simple, portable way to estimate a 20-30g protein portion without measuring or weighing, making it easy to apply anywhere.

**How to Try It:**
• At each meal, look at the protein source on your plate
• A serving that is roughly the size and thickness of your palm (excluding fingers) is one portion
• Adjust based on your hand size and activity level`,
    contraindications: [],
    goal_tags: ['muscle_gain', 'weight_loss', 'improve_energy'],
    tip_type: ['skill_building', 'self_monitoring'],
    motivational_mechanism: ['decision_ease', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 1,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    involves_foods: ['meat'],
    preserves_foods: ['bread', 'pasta', 'cheese'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 5,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 1,
    helps_with: [],
    sustainability: 'daily_habit',
    // Personalization
    personalization_prompt: "When will you try using palm-sized protein portions?",
    personalization_type: 'choice' as const,
    personalization_config: {
      choices: ["Breakfast", "Lunch", "Dinner", "Afternoon snack", "Evening snack"],
      multiple: true,
      style: "buttons"
    }
  },
  {
    tip_id: 'e1f2a3b4-c5d6-7890-efab-123456789012',
    summary: 'Fill Half Your Plate with Vegetables First.',
    personalization_prompt: "Which veggie all-star will fill your plate's starting lineup?",
    personalization_type: "text" as const,
    personalization_config: {
      placeholder: "e.g., Roasted rainbow carrots, Caesar salad, steamed broccoli brigade"
    },
    details_md: `**The Experiment:** At one meal today, physically fill half of your plate with vegetables before adding any protein or carbohydrates.

**Why it Works:** This "higher-order habit" is highly effective. This sequential plating strategy naturally controls portions of more calorie-dense foods while ensuring you meet your fiber and micronutrient needs. It makes a healthy choice the default.

**How to Try It:**
• Grab your plate. Before adding anything else, load up half of it with a large salad, steamed broccoli, or roasted mixed vegetables
• Then, use the remaining half of the plate for your protein and carb sources`,
    contraindications: [],
    goal_tags: ['increase_veggies', 'weight_loss', 'improve_gut_health', 'plant_based'],
    tip_type: ['habit_stacking', 'skill_building'],
    motivational_mechanism: ['decision_ease', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    veggie_intensity: 'heavy',
    veggie_strategy: 'front_and_center',
    family_friendly: false,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 1,
    helps_with: ['mindless_eating'],
    preserves_foods: ['meat', 'cheese', 'bread', 'pasta'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0024-4024-a024-1234567890c2',
    summary: "Plan tomorrow's meals before you go to bed.",
    personalization_prompt: "Create tomorrow's meal lineup (like planning your dream team!):",
    personalization_type: "multi_text" as const,
    personalization_config: {
      items: [
        { label: "Breakfast MVP:", placeholder: "e.g., Overnight oats with berries" },
        { label: "Lunch Champion:", placeholder: "e.g., Leftover soup + salad" },
        { label: "Dinner Finale:", placeholder: "e.g., Grilled chicken + veggies" }
      ]
    },
    details_md: `**The Experiment:** Tonight, take 5-10 minutes to think about and write down what you plan to eat for your main meals tomorrow.

**Why it Works:** Planning ahead significantly reduces in-the-moment decision making when you're hungry, stressed, or rushed—times when you're most likely to make less-healthy choices. This simple act of forethought makes you more likely to stick to your goals.

**How to Try It:**
• Use a notebook or a notes app on your phone
• Jot down a simple plan: Breakfast (e.g., oatmeal), Lunch (e.g., leftovers from dinner), Dinner (e.g., chicken and veggies)
• This can also help you identify if you need to do any small prep tasks, like taking something out of the freezer`,
    contraindications: [],
    goal_tags: ['weight_loss', 'reduce_sugar', 'less_processed_food'],
    tip_type: ['planning_ahead', 'mindset_shift'],
    motivational_mechanism: ['decision_ease', 'mastery'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['evening'],
    cue_context: ['boredom', 'stress'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat'],
    veggie_intensity: 'not_applicable',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 3,
    helps_with: ['stress_eating', 'mindless_eating'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0025-4025-a025-1234567890c3',
    summary: "Try a 'Meat-Free Monday' (or any day) meal.",
    details_md: `**The Experiment:** For one day this week, or just for one meal, replace the meat with a plant-based protein source.

**Why it Works:** Incorporating more plant-based meals can increase your intake of fiber and beneficial plant compounds, while potentially reducing intake of saturated fat. Beans, peas, and lentils are excellent sources of fiber and protein and are very budget-friendly.

**How to Try It:**
• Make tacos or chili using black beans or lentils instead of ground beef
• Try a veggie burger instead of a beef burger
• Add chickpeas or tofu to a salad or stir-fry for your protein source`,
    contraindications: [],
    goal_tags: ['plant_based', 'increase_veggies', 'improve_gut_health', 'better_lipids', 'less_processed_food'],
    tip_type: ['healthy_swap', 'novelty'],
    motivational_mechanism: ['novelty', 'sensory'],
    time_cost_enum: '15_60_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 2,
    location_tags: ['home', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    involves_foods: [],
    preserves_foods: ['cheese', 'bread', 'pasta'],
    veggie_intensity: 'moderate',
    veggie_strategy: 'mixed_in',
    family_friendly: false,
    kid_approved: false,
    partner_resistant_ok: false,
    chaos_level_max: 3,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['basic_stove'],
    cooking_skill_required: 'basic',
    texture_profile: ['soft', 'chewy'],
    cognitive_load: 2,
    helps_with: [],
    substitution_quality: 'different_but_good',
    sustainability: 'occasionally'
  },
  {
    tip_id: 'b2c3d4e5-f6a7-8901-bcde-234567890123',
    summary: 'Eat one serving of oily fish this week.',
    details_md: `**The Experiment:** Plan to have at least one meal this week that includes a serving of oily fish like salmon, mackerel, or sardines.

**Why it Works:** Oily fish are rich in omega-3 fatty acids (EPA/DHA), which are crucial for heart and brain health and have anti-inflammatory properties. Most people don't get enough of these beneficial fats. Aim for 2-3 servings weekly.

**How to Try It:**
• Grill or bake a salmon fillet for dinner
• Add canned sardines or mackerel to a salad for a quick and easy lunch
• Choose from fresh, frozen, or canned options to fit your budget and convenience needs`,
    contraindications: ['fish_allergy', 'shellfish_allergy'],
    goal_tags: ['better_lipids', 'healthy_pregnancy', 'improve_energy'],
    tip_type: ['planning_ahead', 'healthy_swap'],
    motivational_mechanism: ['mastery'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['evening', 'afternoon'],
    cue_context: ['meal_time'],
    difficulty_tier: 3,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    involves_foods: ['meat'],
    preserves_foods: ['bread', 'pasta', 'cheese'],
    veggie_intensity: 'none',
    family_friendly: false,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['basic_stove', 'full_kitchen'],
    cooking_skill_required: 'intermediate',
    texture_profile: ['soft'],
    cognitive_load: 2,
    helps_with: [],
    sustainability: 'occasionally'
  },
  {
    tip_id: 'a1b2c3d4-0031-4031-a031-1234567890c9',
    summary: 'Batch cook a versatile grain for the week.',
    details_md: `**The Experiment:** Cook a large batch of a whole grain like quinoa, brown rice, or farro to use in meals throughout the week.

**Why it Works:** Having a pre-cooked, healthy carbohydrate source ready in the fridge makes assembling quick meals effortless. It's a foundational meal prep task that saves time and makes it easy to build balanced bowls, salads, and side dishes without starting from scratch each time.

**How to Try It:**
• Cook 2-3 cups of your chosen grain according to package directions
• Let it cool completely, then store it in an airtight container in the refrigerator for up to 4 days
• Add a scoop to salads, use as a base for a "rice bowl," or serve as a side with protein and veggies`,
    contraindications: ['celiac'],
    goal_tags: ['weight_loss', 'less_processed_food', 'improve_gut_health', 'plant_based'],
    tip_type: ['planning_ahead', 'environment_design'],
    motivational_mechanism: ['decision_ease', 'mastery'],
    time_cost_enum: '15_60_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 3,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    involves_foods: ['carbs'],
    preserves_foods: ['meat', 'cheese'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 2,
    requires_planning: true,
    requires_advance_prep: true,
    prep_timing: 'weekend_required',
    shelf_life: 'lasts_week',
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['basic_stove'],
    cooking_skill_required: 'basic',
    texture_profile: ['chewy'],
    cognitive_load: 2,
    helps_with: [],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a5b6c7d8-e9f0-1234-abcd-567890123456',
    summary: "Use the 'Hunger Scale' before you eat.",
    personalization_prompt: "Give your hunger levels fun, memorable names! Like Lion (1), Kitty (5), and Sloth (10). What would you call yours?",
    personalization_type: "scale" as const,
    personalization_config: {
      scale_customization: "names" as const,
      scale_labels: ["Extremely hungry - stomach growling", "Satisfied - comfortable and content", "Overly full - uncomfortably stuffed"],
      placeholders: ["e.g., Lion", "e.g., Kitty", "e.g., Sloth"]
    },
    details_md: `**The Experiment:** Before you eat a meal or snack, take a moment to rate your physical hunger on a scale of 1 to 10.

**Why it Works:** This mindful eating exercise helps you distinguish between true, physical hunger and emotional or environmental triggers for eating (like stress or seeing food). Practicing this helps you become more attuned to your body's signals, leading to more intentional eating choices.

**How to Try It:**
• Use a simple scale: 1 = ravenous, 5 = neutral, 10 = uncomfortably stuffed
• Pause before eating and ask, "What number am I right now?"
• Ideally, you want to start eating around a 3 or 4 ("getting hungry") and stop around a 6 or 7 ("pleasantly satisfied")`,
    contraindications: [],
    goal_tags: ['weight_loss', 'improve_energy'],
    tip_type: ['self_monitoring', 'skill_building', 'mindset_shift'],
    motivational_mechanism: ['mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 3,
    physical_effort: 1,
    location_tags: ['home', 'work', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['morning', 'afternoon', 'evening', 'late_night'],
    cue_context: ['meal_time', 'snack_time', 'craving_event'],
    difficulty_tier: 2,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat'],
    veggie_intensity: 'not_applicable',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: false,
    feels_like_diet: true,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 3,
    helps_with: ['emotional_eating', 'stress_eating', 'boredom_eating', 'mindless_eating'],
    common_failure_points: ['easy_to_forget', 'requires_willpower'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0033-4033-a033-1234567890cb',
    summary: 'Add beans or lentils to a soup or salad.',
    details_md: `**The Experiment:** Boost the fiber and protein content of a soup or salad by adding a half-cup of canned beans or lentils.

**Why it Works:** Beans and lentils are nutritional powerhouses—high in plant-based protein, dietary fiber, and various micronutrients. Adding them to a meal makes it more filling and satisfying, helping with appetite control. They are also an inexpensive way to add bulk and nutrition.

**How to Try It:**
• Drain and rinse a can of chickpeas, black beans, or kidney beans
• Toss them into your favorite green salad
• Stir them into a canned or homemade soup to make it heartier`,
    contraindications: [],
    goal_tags: ['plant_based', 'increase_veggies', 'improve_gut_health', 'weight_loss', 'muscle_gain'],
    tip_type: ['healthy_swap'],
    motivational_mechanism: ['decision_ease', 'sensory'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    veggie_intensity: 'light',
    veggie_strategy: 'mixed_in',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 5,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    texture_profile: ['soft', 'creamy'],
    cognitive_load: 1,
    helps_with: [],
    preserves_foods: ['cheese', 'bread', 'meat'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0034-4034-a034-1234567890cc',
    summary: "Pack an 'emergency' healthy snack in your bag.",
    details_md: `**The Experiment:** Place a non-perishable, healthy snack in your work bag, car, or purse to have on hand for unexpected hunger.

**Why it Works:** This is an environmental design strategy to combat "hanger" and prevent you from grabbing a convenient but unhealthy option when you're out and about. Having a planned, healthy option available removes the decision-making process when you're low on energy and willpower.

**How to Try It:**
• Good options include a small bag of almonds, a protein bar, or a packet of nut butter
• Choose something you genuinely like so you'll be happy to eat it
• Replace it as soon as you use it so you're always prepared`,
    contraindications: ['nut_allergy'],
    goal_tags: ['weight_loss', 'reduce_sugar', 'less_processed_food'],
    tip_type: ['planning_ahead', 'environment_design'],
    motivational_mechanism: ['decision_ease', 'comfort'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['work', 'commute', 'travel'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon'],
    cue_context: ['craving_event', 'stress'],
    difficulty_tier: 1,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: [],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 5,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 1,
    helps_with: ['mindless_eating', 'stress_eating'],
    common_failure_points: ['easy_to_forget'],
    sustainability: 'daily_habit',
    // Personalization
    personalization_prompt: "What healthy snack will you pack?",
    personalization_type: 'text' as const,
    personalization_config: {
      placeholders: ["e.g., almonds, protein bar, apple slices"]
    }
  },
  {
    tip_id: 'a1b2c3d4-0035-4035-a035-1234567890cd',
    summary: 'Replace cooking oil with a spray for one meal.',
    details_md: `**The Experiment:** When pan-frying or sautéing a meal, use an oil spray instead of pouring oil from a bottle.

**Why it Works:** Cooking oils are very calorie-dense (a tablespoon of olive oil has about 120 calories). While healthy fats are important, it's easy to pour far more than you need, adding hundreds of hidden calories to a meal. Using a spray provides a much lighter coating, significantly reducing the overall calorie count without sacrificing the non-stick benefit.

**How to Try It:**
• Use a commercial oil spray (like avocado or olive oil spray)
• Lightly coat the surface of your pan just until it shimmers
• This is a great trick for sautéing vegetables or cooking eggs or lean proteins`,
    contraindications: [],
    goal_tags: ['weight_loss', 'better_lipids'],
    tip_type: ['healthy_swap', 'skill_building'],
    motivational_mechanism: ['decision_ease'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['meat', 'cheese', 'bread', 'pasta'],
    veggie_intensity: 'not_applicable',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 4,
    requires_planning: false,
    impulse_friendly: false,
    diet_trauma_safe: false,
    feels_like_diet: true,
    kitchen_equipment: ['basic_stove'],
    cooking_skill_required: 'basic',
    cognitive_load: 2,
    helps_with: [],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'c5d6e7f8-a9b0-1234-cdef-567890123456',
    summary: "Try a vegetable-based 'noodle' instead of pasta.",
    details_md: `**The Experiment:** For a pasta-style dish, try substituting traditional pasta with a vegetable alternative like spaghetti squash or zucchini noodles ("zoodles").

**Why it Works:** This swap dramatically increases the vegetable and fiber content of your meal while significantly reducing the carbohydrate and calorie load. It's a great way to enjoy the comfort of a pasta dish while working towards goals like weight loss or increased vegetable intake.

**How to Try It:**
• You can buy pre-spiralized zucchini noodles or make your own with a spiralizer. Sauté them for a few minutes until tender
• For spaghetti squash, cut it in half, roast it, and then scrape out the noodle-like strands with a fork
• Top with your favorite sauce and protein`,
    contraindications: [],
    goal_tags: ['increase_veggies', 'weight_loss', 'reduce_sugar', 'plant_based', 'less_processed_food'],
    tip_type: ['healthy_swap', 'novelty', 'skill_building'],
    motivational_mechanism: ['novelty', 'sensory', 'mastery'],
    time_cost_enum: '15_60_min',
    money_cost_enum: '$$',
    mental_effort: 3,
    physical_effort: 3,
    location_tags: ['home'],
    social_mode: 'either',
    time_of_day: ['afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 3,
    created_by: 'community_submitted',
    // NEW DIMENSIONS
    involves_foods: [],
    preserves_foods: ['cheese', 'meat'],
    veggie_intensity: 'heavy',
    veggie_strategy: 'front_and_center',
    family_friendly: false,
    kid_approved: false,
    partner_resistant_ok: false,
    chaos_level_max: 2,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: false,
    feels_like_diet: true,
    kitchen_equipment: ['full_kitchen'],
    cooking_skill_required: 'intermediate',
    texture_profile: ['soft'],
    satisfies_craving: ['carbs'],
    substitution_quality: 'different_but_good',
    cognitive_load: 3,
    helps_with: [],
    sustainability: 'occasionally'
  },
  {
    tip_id: 'a1b2c3d4-0037-4037-a037-1234567890cf',
    summary: 'Deconstruct your craving: What do you really want?',
    details_md: `**The Experiment:** When a strong craving hits, pause for a moment and try to identify the sensory properties you're seeking. Is it crunchy, creamy, sweet, salty, or warm?

**Why it Works:** Cravings are often for a specific texture or sensation, not necessarily a specific unhealthy food. By deconstructing the craving, you can find a healthier alternative that satisfies the sensory need. This is a mindful approach to managing cravings rather than just suppressing them.

**How to Try It:**
• Craving crunchy and salty chips? Try roasted chickpeas or celery sticks with salt
• Craving creamy ice cream? Try a bowl of rich Greek yogurt with berries
• Craving something sweet? Try a piece of fruit or a date`,
    contraindications: [],
    goal_tags: ['reduce_sugar', 'weight_loss'],
    tip_type: ['crave_buster', 'mindset_shift'],
    motivational_mechanism: ['mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 3,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['afternoon', 'evening', 'late_night'],
    cue_context: ['craving_event', 'boredom', 'stress'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: [],
    veggie_intensity: 'not_applicable',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 4,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 3,
    helps_with: ['emotional_eating', 'stress_eating', 'boredom_eating'],
    sustainability: 'daily_habit',
    // Personalization
    personalization_prompt: "Predict what you think you'll crave (compare later to what it actually is):",
    personalization_type: 'choice' as const,
    personalization_config: {
      choices: ["Salty", "Sweet", "Savory", "Crunchy", "Chewy", "Creamy"],
      multiple: true,
      style: "buttons"
    }
  },
  {
    tip_id: 'f6a7b8c9-d0e1-2345-fabc-678901234567',
    summary: 'Eat your protein and veggies first.',
    details_md: `**The Experiment:** At one meal today, eat the protein and vegetables on your plate before you eat the carbohydrates.

**Why it Works:** Starting with high-fiber vegetables and satiating protein can help you feel fuller sooner. By the time you get to the more calorie-dense carbs, you may be satisfied with a smaller portion. This meal sequencing can trigger satiety hormones and improve post-meal energy levels.

**How to Try It:**
• If you have a side salad, eat it first
• If you have roasted broccoli and chicken, finish all the broccoli and chicken before starting the rice or potatoes
• This works especially well at restaurants when bread is served—ask for a side salad to eat while you wait`,
    contraindications: [],
    goal_tags: ['weight_loss', 'increase_veggies', 'improve_gut_health', 'improve_energy', 'better_lipids'],
    tip_type: ['mindset_shift', 'habit_stacking', 'skill_building'],
    motivational_mechanism: ['decision_ease', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'community_submitted',
    // NEW DIMENSIONS
    preserves_foods: ['bread', 'pasta', 'cheese'],
    veggie_intensity: 'moderate',
    veggie_strategy: 'front_and_center',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 2,
    helps_with: ['speed_eating', 'mindless_eating'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0039-4039-a039-1234567890d1',
    summary: 'Keep a water bottle on your desk or in sight all day.',
    details_md: `**The Experiment:** For the entire day, keep a filled water bottle within your arm's reach and line of sight.

**Why it Works:** This is a classic and highly effective environmental design tactic. The visual cue of the water bottle constantly reminds you to drink, and its accessibility makes it effortless to do so. This simple change can dramatically increase your daily water intake.

**How to Try It:**
• Choose a reusable water bottle you enjoy using
• Fill it up first thing in the morning and place it on your desk, in your car's cup holder, or on the counter where you spend the most time
• Refill it as soon as it's empty`,
    contraindications: [],
    goal_tags: ['improve_hydration'],
    tip_type: ['environment_design'],
    motivational_mechanism: ['decision_ease'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work', 'commute', 'travel'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: [],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat', 'soda'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 5,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 1,
    helps_with: [],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0040-4040-a040-1234567890d2',
    summary: 'Create a "protein pudding" for a sweet treat.',
    details_md: `**The Experiment:** Make a healthy, high-protein dessert by creating a "pudding" from protein powder.

**Why it Works:** This satisfies a craving for a sweet, creamy dessert while providing a significant dose of protein, which is much more satiating and beneficial for body composition than a typical sugar-laden pudding. It's a smart swap that aligns with fitness goals.

**How to Try It:**
• In a small bowl, mix one scoop of casein or a whey/casein blend protein powder (vanilla or chocolate work well) with a very small amount of milk or water
• Stir vigorously, adding liquid a tiny bit at a time, until it reaches a thick, pudding-like consistency
• For best results, chill in the freezer for 10-15 minutes`,
    contraindications: ['lactose_intolerance', 'soy_allergy'],
    goal_tags: ['reduce_sugar', 'muscle_gain', 'weight_loss'],
    tip_type: ['healthy_swap', 'crave_buster'],
    motivational_mechanism: ['sensory', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['evening', 'late_night'],
    cue_context: ['craving_event'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    involves_foods: ['dairy'],
    preserves_foods: ['chocolate'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 4,
    requires_planning: false,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    texture_profile: ['creamy'],
    satisfies_craving: ['sweet', 'chocolate', 'creamy'],
    substitution_quality: 'close_enough',
    cognitive_load: 2,
    helps_with: ['sugar_addiction', 'night_eating'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0041-4041-a041-1234567890d3',
    summary: "Make a 'no-tuna' chickpea salad sandwich.",
    details_md: `**The Experiment:** For a plant-based lunch, try making a "tuna-style" salad using mashed chickpeas instead of tuna.

**Why it Works:** This is a creative, plant-based swap that mimics a familiar comfort food. Chickpeas provide plant-based protein and a high amount of fiber, making it a filling and gut-healthy option. It's a great way to reduce meat consumption and increase plant food variety.

**How to Try It:**
• Drain a can of chickpeas and mash them with a fork
• Mix with a small amount of Greek yogurt or vegan mayo, chopped celery, red onion, and seasonings like dill, salt, and pepper
• Serve on whole-wheat bread or with crackers`,
    contraindications: ['lactose_intolerance'],
    goal_tags: ['plant_based', 'increase_veggies', 'improve_gut_health', 'better_lipids'],
    tip_type: ['healthy_swap', 'novelty'],
    motivational_mechanism: ['sensory', 'novelty'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['afternoon'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['bread', 'cheese'],
    veggie_intensity: 'light',
    veggie_strategy: 'mixed_in',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'basic',
    texture_profile: ['soft', 'creamy'],
    substitution_quality: 'different_but_good',
    cognitive_load: 2,
    helps_with: [],
    sustainability: 'occasionally'
  },
  {
    tip_id: 'e7f8a9b0-c1d2-3456-efab-789012345678',
    summary: 'Stop eating 2-3 hours before bedtime.',
    details_md: `**The Experiment:** Tonight, try to finish your last meal or snack at least 2-3 hours before you go to sleep.

**Why it Works:** This creates a mini-fasting window overnight. For some people, this can improve sleep quality and digestion. It also helps to prevent late-night, often mindless, snacking which can contribute significant calories. Chronobiology research shows late-night eating can disrupt circadian rhythms.

**How to Try It:**
• If you normally go to bed at 11 PM, aim to have your dinner or last snack finished by 8 PM
• If you feel hungry after this time, try having a glass of water or a cup of herbal tea`,
    contraindications: ['t1_diabetes', 't2_diabetes', 'pregnancy', 'breastfeeding'],
    goal_tags: ['weight_loss', 'improve_gut_health', 'improve_energy'],
    tip_type: ['time_ritual', 'crave_buster'],
    motivational_mechanism: ['mastery', 'comfort'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 3,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['evening', 'late_night'],
    cue_context: ['meal_time', 'snack_time'],
    difficulty_tier: 3,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat'],
    veggie_intensity: 'not_applicable',
    family_friendly: false,
    kid_approved: false,
    partner_resistant_ok: false,
    chaos_level_max: 2,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: false,
    feels_like_diet: true,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 3,
    helps_with: ['night_eating', 'mindless_eating'],
    common_failure_points: ['requires_willpower', 'socially_awkward'],
    sustainability: 'occasionally'
  },
  {
    tip_id: 'a1b2c3d4-0043-4043-a043-1234567890d5',
    summary: 'Roast a big batch of mixed vegetables.',
    personalization_prompt: "Design your veggie roasting squad (pick 3-5 players!):",
    personalization_type: "choice" as const,
    personalization_config: {
      choices: ["Broccoli Boss", "Cauliflower Captain", "Sweet Potato Star", "Bell Pepper Hero", "Zucchini Warrior", "Brussels Sprout Brigade", "Carrot Champion", "Red Onion Ranger"],
      multiple: true
    },
    details_md: `**The Experiment:** Roast a large sheet pan of mixed vegetables to have on hand for the next few days.

**Why it Works:** Roasting brings out the natural sweetness of vegetables, making them delicious and appealing. Having a batch ready in the fridge makes it incredibly easy to add a serving of vegetables to any meal—breakfast, lunch, or dinner—with zero prep time.

**How to Try It:**
• Chop up hearty vegetables like broccoli, cauliflower, bell peppers, onions, and sweet potatoes
• Toss with a little olive oil, salt, and pepper
• Roast on a sheet pan at 400°F (200°C) for 20-30 minutes, until tender and slightly browned
• Add them to eggs, salads, grain bowls, or eat as a side`,
    contraindications: [],
    goal_tags: ['increase_veggies', 'less_processed_food', 'plant_based', 'improve_gut_health'],
    tip_type: ['planning_ahead', 'environment_design'],
    motivational_mechanism: ['decision_ease', 'sensory'],
    time_cost_enum: '15_60_min',
    money_cost_enum: '$$',
    mental_effort: 2,
    physical_effort: 2,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 3,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    veggie_intensity: 'heavy',
    veggie_strategy: 'front_and_center',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 2,
    requires_planning: true,
    requires_advance_prep: true,
    prep_timing: 'weekend_required',
    shelf_life: 'lasts_week',
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['full_kitchen'],
    cooking_skill_required: 'basic',
    texture_profile: ['soft', 'crispy'],
    cognitive_load: 2,
    helps_with: [],
    preserves_foods: ['meat', 'cheese', 'bread', 'pasta'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
    summary: 'Track your food for one day without judgment.',
    details_md: `**The Experiment:** For just one day, keep a log of everything you eat and drink. Approach it with curiosity, not judgment.

**Why it Works:** People often underestimate their total food intake by a significant margin. A single day of tracking can provide powerful awareness about "mindless" nibbles, portion sizes, and hidden calories from drinks and sauces. It's a data-gathering exercise to inform future choices, not a tool for restriction.

**How to Try It:**
• Use a simple notebook or a free app
• Be honest and record everything, including the cream in your coffee and the handful of fries you stole from a friend
• At the end of the day, simply review the log and notice any patterns or surprises`,
    contraindications: [],
    goal_tags: ['weight_loss', 'reduce_sugar', 'improve_energy'],
    tip_type: ['self_monitoring', 'skill_building'],
    motivational_mechanism: ['mastery'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$',
    mental_effort: 4,
    physical_effort: 1,
    location_tags: ['home', 'work', 'restaurant'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon', 'evening', 'late_night'],
    cue_context: [],
    difficulty_tier: 4,
    created_by: 'community_submitted',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat', 'soda'],
    veggie_intensity: 'not_applicable',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 2,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: false,
    feels_like_diet: true,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 4,
    helps_with: ['mindless_eating', 'grazing', 'emotional_eating'],
    common_failure_points: ['easy_to_forget', 'requires_willpower'],
    sustainability: 'one_time'
  },
  {
    tip_id: 'a1b2c3d4-0045-4045-a045-1234567890d7',
    summary: 'Have a savory, protein-rich breakfast.',
    details_md: `**The Experiment:** Instead of a sweet breakfast (like sweetened cereal, pastries, or sugary yogurt), opt for a savory one centered around protein.

**Why it Works:** Starting the day with a savory, high-protein meal can help regulate appetite and reduce sugar cravings throughout the day. It sets a different metabolic and psychological tone for the day compared to a breakfast that resembles a dessert.

**How to Try It:**
• A simple egg scramble with spinach and a side of avocado
• A whole-wheat tortilla with black beans, salsa, and a fried egg
• Leftover chicken and roasted vegetables from last night's dinner`,
    contraindications: ['egg_allergy'],
    goal_tags: ['reduce_sugar', 'weight_loss', 'muscle_gain', 'improve_energy'],
    tip_type: ['healthy_swap', 'mindset_shift'],
    motivational_mechanism: ['energy_boost', 'sensory'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['morning'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    involves_foods: ['meat', 'dairy'],
    preserves_foods: ['coffee'],
    veggie_intensity: 'light',
    veggie_strategy: 'mixed_in',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: false,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['basic_stove'],
    cooking_skill_required: 'basic',
    texture_profile: ['soft', 'creamy'],
    cognitive_load: 2,
    helps_with: ['sugar_addiction', 'grazing'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0046-4046-a046-1234567890d8',
    summary: 'Social Swap: Suggest a walk instead of a coffee/drink meeting.',
    details_md: `**The Experiment:** For your next casual social catch-up, suggest going for a walk together instead of meeting for coffee, drinks, or a meal.

**Why it Works:** This reframes social time to include physical activity, helping you reach step goals and reduce sedentary time. It decouples socializing from consuming calories, which can be a major source of unplanned intake. It's a great way to connect with friends while supporting your health goals.

**How to Try It:**
• "Hey, instead of grabbing coffee, would you be up for a walk around the park on Saturday?"
• Take phone calls while walking around your neighborhood
• This works well for one-on-one meetings or casual friend dates`,
    contraindications: ['elderly_frailty'],
    goal_tags: ['weight_loss', 'improve_energy'],
    tip_type: ['healthy_swap', 'environment_design'],
    motivational_mechanism: ['social', 'energy_boost'],
    time_cost_enum: '15_60_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 2,
    location_tags: ['work', 'social_event'],
    social_mode: 'group',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['social_event'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat', 'soda'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: false,
    chaos_level_max: 3,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 2,
    helps_with: ['social_eating'],
    common_failure_points: ['bad_weather', 'socially_awkward'],
    sustainability: 'occasionally',
    // Personalization
    personalization_prompt: "Where will you suggest walking?",
    personalization_type: 'text' as const,
    personalization_config: {
      placeholders: ["e.g., The park, downtown, nature trail, neighborhood loop"]
    }
  },
  {
    tip_id: 'a1b2c3d4-0047-4047-a047-1234567890d9',
    summary: 'Try a "dessert" of frozen fruit.',
    personalization_prompt: "What frozen fruit will you try as dessert tonight?",
    personalization_type: "text" as const,
    personalization_config: {
      placeholders: ["e.g., Frozen grapes, mango chunks, or mixed berries"]
    },
    details_md: `**The Experiment:** For a healthy dessert, try eating a bowl of frozen fruit.

**Why it Works:** Frozen fruit like mango chunks, berries, or banana slices have a surprisingly creamy, sorbet-like texture when eaten partially thawed. This satisfies a craving for a cold, sweet treat with all the benefits of whole fruit (fiber, vitamins) and none of the added sugar of ice cream or sorbet.

**How to Try It:**
• Frozen mango or pineapple chunks are particularly creamy
• Frozen grapes taste like little bites of sorbet
• For a "nice cream," blend frozen bananas with a splash of milk until smooth`,
    contraindications: [],
    goal_tags: ['reduce_sugar', 'weight_loss', 'increase_veggies'],
    tip_type: ['healthy_swap', 'crave_buster'],
    motivational_mechanism: ['sensory', 'comfort'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['evening', 'late_night'],
    cue_context: ['craving_event'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    preserves_foods: [],
    veggie_intensity: 'light',
    veggie_strategy: 'not_applicable',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 5,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    texture_profile: ['creamy', 'soft'],
    satisfies_craving: ['sweet', 'creamy'],
    substitution_quality: 'different_but_good',
    cognitive_load: 1,
    helps_with: ['sugar_addiction', 'night_eating'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0048-4048-a048-1234567890da',
    summary: 'Put your fork down between every few bites.',
    details_md: `**The Experiment:** During one meal today, consciously place your fork or spoon down on the table after every two or three bites.

**Why it Works:** This is a simple, powerful mechanical trick to slow down your eating pace. It forces a pause, allowing you to breathe, check in with your fullness level, and engage more with your meal and dining companions. It's a key practice for developing mindful eating habits.

**How to Try It:**
• Take a bite. Chew it thoroughly. Swallow. Then, place your utensil completely down on the plate or table
• Take a sip of water or a deep breath before picking it up again
• It will feel awkward at first, but it's highly effective`,
    contraindications: [],
    goal_tags: ['weight_loss', 'improve_gut_health'],
    tip_type: ['mindset_shift', 'time_ritual'],
    motivational_mechanism: ['mastery'],
    time_cost_enum: '15_60_min',
    money_cost_enum: '$',
    mental_effort: 3,
    physical_effort: 1,
    location_tags: ['home', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat'],
    veggie_intensity: 'not_applicable',
    family_friendly: false,
    kid_approved: false,
    partner_resistant_ok: false,
    chaos_level_max: 2,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: false,
    feels_like_diet: true,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 3,
    helps_with: ['speed_eating', 'mindless_eating'],
    common_failure_points: ['socially_awkward', 'easy_to_forget'],
    sustainability: 'occasionally'
  },
  {
    tip_id: 'a1b2c3d4-0049-4049-a049-1234567890db',
    summary: 'Add a healthy "topper" to your meal.',
    details_md: `**The Experiment:** Enhance the nutritional value and flavor of one meal by adding a healthy "topper."

**Why it Works:** Toppers like seeds, nuts, or nutritional yeast are a simple way to add a boost of healthy fats, protein, fiber, or vitamins without fundamentally changing the meal. It's an easy "add-in" strategy that improves nutrient density.

**How to Try It:**
• Sprinkle a tablespoon of hemp seeds or chopped walnuts on a salad or yogurt bowl
• Add a spoonful of nutritional yeast to scrambled eggs or popcorn for a cheesy, B-vitamin-rich flavor
• Top a soup or chili with fresh chopped herbs like cilantro or parsley`,
    contraindications: ['nut_allergy'],
    goal_tags: ['increase_veggies', 'better_lipids', 'improve_gut_health', 'muscle_gain'],
    tip_type: ['healthy_swap', 'skill_building'],
    motivational_mechanism: ['sensory', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 1,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat'],
    veggie_intensity: 'light',
    veggie_strategy: 'gradual',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 5,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 1,
    helps_with: [],
    texture_profile: ['crunchy'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a1b2c3d4-0050-4050-a050-1234567890dc',
    summary: 'Review your day and plan one small improvement for tomorrow.',
    details_md: `**The Experiment:** Before bed, take two minutes to reflect on your eating today. Identify one small, positive change you could make tomorrow.

**Why it Works:** This practice of reflection and gentle course-correction fosters a growth mindset and prevents the all-or-nothing trap. It's about continuous, incremental improvement rather than perfection. Planning one small change makes the goal feel achievable and builds momentum over time.

**How to Try It:**
• Ask yourself: "What went well today? What was one challenge?"
• Based on that, decide on one tiny improvement. Examples: "Tomorrow, I'll pack an apple for my afternoon snack," or "I'll try to have a glass of water with lunch."
• Write it down to increase your commitment`,
    contraindications: [],
    goal_tags: ['weight_loss'],
    tip_type: ['self_monitoring', 'mindset_shift', 'planning_ahead'],
    motivational_mechanism: ['mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 3,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['late_night'],
    cue_context: ['stress'],
    difficulty_tier: 4,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat', 'soda'],
    veggie_intensity: 'not_applicable',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 3,
    helps_with: ['mindless_eating', 'emotional_eating'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    summary: 'Drink 16-20oz Water 2-3 Hours Pre-Workout.',
    details_md: `**The Experiment:** Consume 16-20oz (about 500ml) of water 2-3 hours before training, plus another 8oz (240ml) 30 minutes prior.

**Why it Works:** Pre-hydration ensures optimal blood volume for nutrient delivery and thermoregulation. This timing allows for absorption while preventing GI discomfort during exercise. Monitor urine color - pale yellow is ideal.

**How to Try It:**
• Set a reminder on your phone for 2-3 hours before your planned workout
• Drink a large glass of water
• Have another glass as you're getting ready to go`,
    contraindications: [],
    goal_tags: ['improve_hydration', 'endurance_performance', 'strength_performance', 'improve_energy'],
    tip_type: ['planning_ahead', 'time_ritual'],
    motivational_mechanism: ['energy_boost', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 2,
    helps_with: [],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    summary: 'Practice Pre-Meal Water: 8-16oz Before Eating.',
    details_md: `**The Experiment:** Consume 8-16 oz (1-2 glasses) of water 20-30 minutes before each main meal.

**Why it Works:** Research shows pre-meal water consumption aids digestion, helps with portion control by increasing satiety signals, and contributes to daily hydration needs.

**How to Try It:**
• Set a timer for 30 minutes before you typically eat lunch and dinner
• Drink a glass of water when the timer goes off
• This simple habit can naturally reduce caloric intake`,
    contraindications: [],
    goal_tags: ['improve_hydration', 'weight_loss', 'improve_gut_health'],
    tip_type: ['habit_stacking', 'time_ritual'],
    motivational_mechanism: ['decision_ease', 'comfort'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 1,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 4,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 1,
    helps_with: ['speed_eating', 'mindless_eating'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'e5f6a7b8-c9d0-1234-efab-567890123456',
    summary: 'Add Pinch of Salt to Water During 60+ Minute Workouts.',
    details_md: `**The Experiment:** Add 1/4 tsp of salt to every 16-20oz (500ml) of water you drink during extended, sweaty exercise sessions (60+ minutes).

**Why it Works:** Sodium enhances fluid absorption and replaces key electrolytes lost through sweat. This improves hydration efficiency compared to plain water during long workouts, especially in hot weather or for heavy sweaters.

**How to Try It:**
• Pre-mix your workout water bottle with a small pinch of salt
• This is not necessary for casual, short-duration exercise`,
    contraindications: ['hypertension', 'kidney_disease'],
    goal_tags: ['improve_hydration', 'endurance_performance'],
    tip_type: ['healthy_swap', 'skill_building'],
    motivational_mechanism: ['energy_boost', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 4,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 1,
    helps_with: [],
    sustainability: 'occasionally'
  },
  {
    tip_id: 'b8c9d0e1-f2a3-4567-bcde-890123456789',
    summary: 'Practice Protein Distribution: 25-30g Per Meal.',
    personalization_prompt: "Map out your protein game plan for the day (aim for 25-30g each meal):",
    personalization_type: "multi_text" as const,
    personalization_config: {
      items: [
        { label: "Breakfast protein:", placeholder: "e.g., 3 eggs + Greek yogurt = 27g" },
        { label: "Lunch protein:", placeholder: "e.g., Grilled chicken salad = 30g" },
        { label: "Dinner protein:", placeholder: "e.g., Salmon fillet = 28g" }
      ]
    },
    details_md: `**The Experiment:** Aim for 25-30g of protein at breakfast, lunch, and dinner today.

**Why it Works:** Sports nutrition research shows distributed protein intake increases muscle protein synthesis by 25% compared to concentrating it in one meal. This supports muscle maintenance, satiety, and metabolic health throughout the day.

**How to Try It:**
• Use the "palm-size" portion guide for a rough estimate
• Include a protein source at each meal (e.g., eggs for breakfast, chicken for lunch, fish for dinner)`,
    contraindications: ['kidney_disease'],
    goal_tags: ['muscle_gain', 'weight_loss', 'improve_energy', 'strength_performance'],
    tip_type: ['planning_ahead', 'skill_building'],
    motivational_mechanism: ['mastery', 'energy_boost'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$$',
    mental_effort: 3,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 3,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    involves_foods: ['meat', 'dairy'],
    preserves_foods: ['chocolate', 'coffee', 'bread', 'pasta'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 2,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['basic_stove'],
    cooking_skill_required: 'basic',
    cognitive_load: 3,
    helps_with: ['grazing'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'c9d0e1f2-a3b4-5678-cdef-901234567890',
    summary: 'Try Pre-Sleep Protein: 20-40g Before Bed.',
    details_md: `**The Experiment:** Consume a source of slow-digesting protein 30-90 minutes before you go to sleep.

**Why it Works:** Overnight muscle protein synthesis occurs during sleep. Casein protein, found in dairy, provides a sustained release of amino acids for 7+ hours, supporting muscle recovery and growth.

**How to Try It:**
• Have a bowl of Greek yogurt or cottage cheese
• Mix a scoop of casein protein powder with a small amount of water or milk to make a pudding`,
    contraindications: ['lactose_intolerance', 'ibs'],
    goal_tags: ['muscle_gain', 'strength_performance', 'improve_energy'],
    tip_type: ['time_ritual', 'skill_building'],
    motivational_mechanism: ['comfort', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['late_night'],
    cue_context: ['snack_time'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    involves_foods: ['dairy'],
    preserves_foods: ['chocolate'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 4,
    requires_planning: false,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    texture_profile: ['creamy'],
    cognitive_load: 1,
    helps_with: ['night_eating'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'f2a3b4c5-d6e7-8901-fabc-234567890123',
    summary: 'Add One Extra Serving of Vegetables to Lunch.',
    details_md: `**The Experiment:** Include one additional cup of vegetables in your lunch today.

**Why it Works:** Increasing vegetable intake is linked to reduced risk of chronic diseases. Adding raw veggies, a side salad, or steamed vegetables boosts fiber and micronutrients, helping you feel fuller and more energized.

**How to Try It:**
• Add a handful of baby carrots or cherry tomatoes to your lunch bag
• Mix leftover roasted vegetables into your salad or grain bowl
• Add a layer of spinach or sprouts to your sandwich`,
    contraindications: [],
    goal_tags: ['increase_veggies', 'improve_gut_health', 'better_lipids', 'weight_loss'],
    tip_type: ['healthy_swap', 'planning_ahead'],
    motivational_mechanism: ['sensory', 'comfort'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['afternoon'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    veggie_intensity: 'moderate',
    veggie_strategy: 'gradual',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    texture_profile: ['crunchy', 'soft'],
    cognitive_load: 2,
    helps_with: [],
    preserves_foods: ['bread', 'meat', 'cheese'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a3b4c5d6-e7f8-9012-abcd-345678901234',
    summary: 'Start Dinner with a Salad.',
    details_md: `**The Experiment:** Begin your evening meal with a side salad or raw vegetables before eating the main course.

**Why it Works:** Meal sequencing research shows starting with low-calorie, high-fiber foods increases overall vegetable consumption and enhances satiety. This can naturally reduce intake of higher-calorie foods later in the meal.

**How to Try It:**
• Prepare a simple salad with greens and a light vinaigrette
• Eat the entire salad before your main dish is served
• At a restaurant, order a side salad as an appetizer`,
    contraindications: [],
    goal_tags: ['increase_veggies', 'weight_loss', 'improve_gut_health'],
    tip_type: ['time_ritual', 'habit_stacking'],
    motivational_mechanism: ['sensory', 'comfort'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$',
    mental_effort: 1,
    physical_effort: 1,
    location_tags: ['home', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    veggie_intensity: 'heavy',
    veggie_strategy: 'front_and_center',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: false,
    impulse_friendly: true,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    texture_profile: ['crunchy', 'soft'],
    cognitive_load: 1,
    helps_with: ['speed_eating', 'mindless_eating'],
    preserves_foods: ['meat', 'cheese', 'bread', 'pasta'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'd6e7f8a9-b0c1-2345-defa-678901234567',
    summary: 'Eat Breakfast Within 1 Hour of Waking.',
    details_md: `**The Experiment:** Consume a balanced breakfast within 60 minutes of waking up.

**Why it Works:** Circadian rhythm research suggests eating within an hour of waking aligns with natural metabolic patterns, which can improve glucose control and optimize insulin sensitivity for the day ahead.

**How to Try It:**
• Have a simple, pre-planned breakfast ready to go (like overnight oats)
• Even a protein shake or a piece of fruit with nut butter counts`,
    contraindications: [],
    goal_tags: ['improve_energy', 'weight_loss', 'improve_gut_health'],
    tip_type: ['time_ritual', 'planning_ahead'],
    motivational_mechanism: ['energy_boost', 'comfort'],
    time_cost_enum: '5_15_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home'],
    social_mode: 'solo',
    time_of_day: ['morning'],
    cue_context: ['meal_time'],
    difficulty_tier: 2,
    created_by: 'dietitian_reviewed',
    // NEW DIMENSIONS
    preserves_foods: ['coffee', 'chocolate'],
    veggie_intensity: 'none',
    family_friendly: true,
    kid_approved: true,
    partner_resistant_ok: true,
    chaos_level_max: 3,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 2,
    helps_with: ['grazing'],
    sustainability: 'daily_habit'
  },
  {
    tip_id: 'a9b0c1d2-e3f4-5678-abcd-901234567890',
    summary: 'Front-Load Carbs: Consume Most Before Evening.',
    details_md: `**The Experiment:** Try to consume the majority (e.g., 60-70%) of your daily carbohydrates before 6 PM.

**Why it Works:** This strategy aligns carb intake with the time of day your body is typically more active and insulin-sensitive. It can support training energy while potentially improving sleep quality by reducing late-night blood sugar fluctuations.

**How to Try It:**
• Focus on including healthy carbs with your breakfast and lunch
• Have a lighter-carb dinner, focusing more on protein and vegetables`,
    contraindications: ['t1_diabetes', 't2_diabetes'],
    goal_tags: ['improve_energy', 'weight_loss', 'endurance_performance'],
    tip_type: ['time_ritual', 'planning_ahead'],
    motivational_mechanism: ['energy_boost', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 3,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['morning', 'afternoon'],
    cue_context: ['meal_time'],
    difficulty_tier: 3,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    involves_foods: ['bread', 'pasta', 'carbs'],
    preserves_foods: ['meat', 'cheese', 'chocolate'],
    veggie_intensity: 'moderate',
    veggie_strategy: 'gradual',
    family_friendly: false,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 2,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: false,
    feels_like_diet: true,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 3,
    helps_with: [],
    sustainability: 'occasionally'
  },
  {
    tip_id: 'c1d2e3f4-a5b6-7890-cdef-123456789012',
    summary: 'Create an "If-Then" Food Plan.',
    details_md: `**The Experiment:** Create a specific plan for a potential food challenge, such as: "If I feel hungry at 3pm, then I'll eat the apple I have at my desk."

**Why it Works:** These "implementation intentions" are scientifically proven to be effective. They create an automatic response to environmental cues, reducing decision fatigue and impulsive choices when you're tired or stressed.

**How to Try It:**
• Identify a common trigger (e.g., mid-afternoon slump)
• Decide on a specific, healthy response
• Write it down: "If [situation], then I will [action]"`,
    contraindications: [],
    goal_tags: ['weight_loss', 'reduce_sugar'],
    tip_type: ['planning_ahead', 'mindset_shift'],
    motivational_mechanism: ['decision_ease', 'mastery'],
    time_cost_enum: '0_5_min',
    money_cost_enum: '$',
    mental_effort: 2,
    physical_effort: 1,
    location_tags: ['home', 'work'],
    social_mode: 'solo',
    time_of_day: ['morning'],
    cue_context: ['stress', 'boredom', 'craving_event'],
    difficulty_tier: 2,
    created_by: 'coach_curated',
    // NEW DIMENSIONS
    preserves_foods: ['chocolate', 'cheese', 'coffee', 'bread', 'pasta', 'meat'],
    veggie_intensity: 'not_applicable',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 4,
    requires_planning: true,
    impulse_friendly: false,
    diet_trauma_safe: true,
    feels_like_diet: false,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 2,
    helps_with: ['stress_eating', 'boredom_eating', 'emotional_eating'],
    sustainability: 'daily_habit'
  },


  //stress eating

  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000001",
    "summary": "Give your craving a goofy name (“Sir Crunch‑a‑Lot”).",
    "details_md": "**The Experiment:** When an urge hits, name it out loud (“Hi, Sir Crunch‑a‑Lot—what’s up?”).\n\n**Why it Works:** Emotion labeling reduces amygdala reactivity and restores choice, loosening the stress→eat loop.\n\n**How to Try It:**\n• Say the name and rate the urge 0–10\n• Take one slow breath\n• Decide: cope now or set a 10‑min check‑in timer",
    "contraindications": [],
    "goal_tags": ["stress_eating", "emotional_eating", "mindful_eating"],
    "tip_type": ["mindset_shift"],
    "motivational_mechanism": ["fun", "novelty", "mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "solo",
    "time_of_day": ["any"],
    "cue_context": ["stress", "craving_event", "boredom"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": [],
    "preserves_foods": [],
    "veggie_intensity": "not_applicable",
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
    "helps_with": ["stress_eating", "mindless_eating", "rumination"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000002",
    "summary": "Threat→Challenge: 7‑word stress script.",
    "details_md": "**The Experiment:** Before a stressor, say: “This is hard *and* I can handle it.”\n\n**Why it Works:** Reframing stress shifts physiology toward challenge (less cortisol‑driven appetite).\n\n**How to Try It:**\n• Write it on a sticky note\n• Say it before meetings or emails\n• Pair with one deep exhale",
    "contraindications": [],
    "goal_tags": ["stress_eating", "emotional_eating", "improve_mood"],
    "tip_type": ["mindset_shift", "habit_stacking"],
    "motivational_mechanism": ["mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["work", "home", "any"],
    "social_mode": "solo",
    "time_of_day": ["any"],
    "cue_context": ["stress", "work_break", "conflict"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
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
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "anxiety"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000003",
    "summary": "HALT check on your fridge (Hungry, Angry, Lonely, Tired).",
    "details_md": "**The Experiment:** Put a small “HALT?” sticker on the fridge and touch it before snacking.\n\n**Why it Works:** Snaps you into interoception so emotions aren’t misread as hunger.\n\n**How to Try It:**\n• Say which letter fits\n• If not true hunger, pick a matching non‑food action\n• Re‑rate urge after 5 minutes",
    "contraindications": [],
    "goal_tags": ["mindful_eating", "stress_eating"],
    "tip_type": ["mindset_shift", "habit_stacking"],
    "motivational_mechanism": ["decision_ease"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["craving_event", "evening_grazing"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "cognitive_load": 1,
    "helps_with": ["mindless_eating", "stress_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000004",
    "summary": "“Broccoli Gatekeeper” test for true hunger.",
    "details_md": "**The Experiment:** Ask: “Would plain broccoli or chickpeas satisfy me right now?”\n\n**Why it Works:** Physical hunger is flexible; emotional hunger craves something specific.\n\n**How to Try It:**\n• If no, pick a non‑food coping action\n• If yes, choose a balanced snack\n• Recheck hunger after eating",
    "contraindications": [],
    "goal_tags": ["mindful_eating", "stress_eating"],
    "tip_type": ["mindset_shift"],
    "motivational_mechanism": ["decision_ease", "mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "solo",
    "time_of_day": ["any"],
    "cue_context": ["craving_event", "boredom"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "cognitive_load": 1,
    "helps_with": ["mindless_eating", "portion_control"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000005",
    "summary": "20‑second stoplight body scan (Green/Yellow/Red).",
    "details_md": "**The Experiment:** Close eyes and check body tension: green (calm), yellow (tight), red (very tight).\n\n**Why it Works:** Links sensations to emotions so food isn’t used to numb.\n\n**How to Try It:**\n• Scan jaw/chest/stomach\n• Name the color, then pick a fitting tool (breath, text a friend)\n• Recheck color after",
    "contraindications": [],
    "goal_tags": ["mindful_eating", "stress_eating"],
    "tip_type": ["mindset_shift"],
    "motivational_mechanism": ["relief", "mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "solo",
    "time_of_day": ["any"],
    "cue_context": ["stress", "anxiety", "craving_event"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "anxiety", "mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000006",
    "summary": "Hunger thermometer (1–10) before/during/after meals.",
    "personalization_prompt": "Create your hunger scale metaphor (1=starving, 10=stuffed). What's your 5-6?",
    "personalization_type": "text" as const,
    "personalization_config": {
      "placeholder": "e.g., 1=Empty tank, 5=Cruising speed, 10=Overflow"
    },
    "details_md": "**The Experiment:** Rate hunger pre‑meal, halfway, and after; aim to stop around 6–7.\n\n**Why it Works:** Trains satiety detection and reduces overshooting fullness.\n\n**How to Try It:**\n• Set a halfway alert\n• Pause utensils, rate hunger\n• Decide to continue or stop",
    "contraindications": [],
    "goal_tags": ["mindful_eating", "portion_control"],
    "tip_type": ["mindset_shift", "habit_stacking"],
    "motivational_mechanism": ["mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["home", "restaurant", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": ["timer"],
    "cooking_skill_required": "none",
    "cognitive_load": 2,
    "helps_with": ["portion_control", "mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000007",
    "summary": "90‑second urge surf (watch the wave rise/fall).",
    "personalization_prompt": "What will you visualize during your 90-second craving surf?",
    "personalization_type": "choice" as const,
    "personalization_config": {
      "choices": ["Ocean wave rising and falling", "Storm cloud passing by", "Hot air balloon floating away", "Train passing through a station", "Campfire slowly dying down"],
      "multiple": false
    },
    "details_md": "**The Experiment:** When a craving spikes, set a 90‑sec timer and breathe slowly.\n\n**Why it Works:** Urges crest and fall; brief delay re‑engages the prefrontal cortex.\n\n**How to Try It:**\n• Inhale 4, exhale 6\n• Narrate “rising…peaking…falling”\n• Decide after the chime",
    "contraindications": [],
    "goal_tags": ["reduce_cravings", "stress_eating"],
    "tip_type": ["behavioral_strategy", "mindset_shift"],
    "motivational_mechanism": ["relief", "mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "solo",
    "time_of_day": ["any"],
    "cue_context": ["craving_event", "evening_grazing"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": ["timer"],
    "cognitive_load": 2,
    "helps_with": ["stress_eating", "boredom_eating", "mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000008",
    "summary": "Swap self‑criticism for curiosity (“What do I need?”).",
    "details_md": "**The Experiment:** Replace “no willpower” with “What do I actually need right now?”\n\n**Why it Works:** Self‑compassion lowers cortisol and opens problem‑solving.\n\n**How to Try It:**\n• Ask need: soothe, connect, rest, fuel?\n• Pick 1 matching action\n• Note outcome 0–10",
    "contraindications": [],
    "goal_tags": ["stress_eating", "emotional_eating"],
    "tip_type": ["mindset_shift"],
    "motivational_mechanism": ["relief", "mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["stress", "anxiety", "craving_event"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "rumination"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000009",
    "summary": "Weather‑map your mood before meals.",
    "details_md": "**The Experiment:** Draw a sun/clouds/storm next to your meal note.\n\n**Why it Works:** Fast emotion ID prevents mislabeling feelings as hunger.\n\n**How to Try It:**\n• Mark the icon\n• Pick one matching coping tool if needed\n• Proceed to eat mindfully",
    "contraindications": [],
    "goal_tags": ["mindful_eating", "stress_eating"],
    "tip_type": ["mindset_shift", "habit_stacking"],
    "motivational_mechanism": ["fun", "decision_ease"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work", "restaurant"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "cognitive_load": 1,
    "helps_with": ["mindless_eating", "stress_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000010",
    "summary": "Carry 3 If‑Then pocket plans.",
    "details_md": "**The Experiment:** Write: “If I feel __, then I’ll __ (non‑food).”\n\n**Why it Works:** Implementation intentions automate wise choices under stress.\n\n**How to Try It:**\n• Make 3 common If‑Then cards\n• Keep in wallet/phone\n• Use at first trigger",
    "contraindications": [],
    "goal_tags": ["better_habits", "stress_eating"],
    "tip_type": ["planning_ahead", "mindset_shift"],
    "motivational_mechanism": ["decision_ease", "mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "solo",
    "time_of_day": ["morning", "any"],
    "cue_context": ["stress", "boredom", "craving_event"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": false,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": ["none"],
    "cognitive_load": 2,
    "helps_with": ["stress_eating", "boredom_eating", "emotional_eating"],
    "sustainability": "daily_habit"
  },

  // --- Behavioral Swaps (11–20) ---

  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000011",
    "summary": "One‑song dance break.",
    "details_md": "**The Experiment:** Play one upbeat song and move however you like.\n\n**Why it Works:** Brief activity metabolizes stress hormones and boosts endorphins.\n\n**How to Try It:**\n• Hit play when a craving hits\n• Move until song ends\n• Re‑rate the urge",
    "contraindications": "Modify if you have pain or mobility limitations; choose gentle movements.",
    "goal_tags": ["improve_mood", "stress_eating"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["energy_boost", "fun"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 2,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["stress", "boredom", "craving_event"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "anxiety"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000012",
    "summary": "5‑minute reset walk (spot 5 colors/5 sounds).",
    "details_md": "**The Experiment:** Walk outside for 5–10 minutes, noticing colors and sounds.\n\n**Why it Works:** Movement + sensory focus interrupts the craving loop.\n\n**How to Try It:**\n• Step outside or hallway\n• Name 5 colors, 5 sounds\n• Re‑assess the urge",
    "contraindications": "Adjust for weather and mobility; indoor laps work.",
    "goal_tags": ["improve_mood", "stress_eating"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["relief", "energy_boost"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 2,
    "location_tags": ["outdoors", "work", "home"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["stress", "work_break", "boredom"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "rumination"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000013",
    "summary": "Text‑a‑Buddy SOS (prewritten message).",
    "details_md": "**The Experiment:** Send: “Craving + stressed—2‑min chat?” to a support person.\n\n**Why it Works:** Connection activates reward without calories.\n\n**How to Try It:**\n• Save the template in Notes\n• Ask one friend to be on call\n• Keep it to 2–3 minutes",
    "contraindications": [],
    "goal_tags": ["emotional_eating", "stress_eating"],
    "tip_type": ["behavioral_strategy", "planning_ahead"],
    "motivational_mechanism": ["accountability", "comfort"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "social",
    "time_of_day": ["any"],
    "cue_context": ["loneliness", "stress", "boredom"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": false,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": true,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": ["phone"],
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "boredom_eating", "loneliness"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000014",
    "summary": "Hands‑Busy kit (stress ball, fidget, mini‑puzzle).",
    "details_md": "**The Experiment:** Keep 2–3 tactile items near snack zones.\n\n**Why it Works:** Redirects motor habits and buys time for urges to fade.\n\n**How to Try It:**\n• Place the kit by TV/desk\n• Use for 3–5 minutes when triggered\n• Then decide on food",
    "contraindications": [],
    "goal_tags": ["stress_eating", "better_habits"],
    "tip_type": ["behavioral_strategy", "planning_ahead"],
    "motivational_mechanism": ["convenience", "relief"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["evening", "any"],
    "cue_context": ["screen_time", "work_break", "evening_grazing"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": true,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "cognitive_load": 1,
    "helps_with": ["mindless_eating", "evening_grazing"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000015",
    "summary": "Flavor‑bomb sugar‑free gum.",
    "details_md": "**The Experiment:** Chew a strong mint for 5 minutes when cravings pop.\n\n**Why it Works:** Oral stimulation + palate reset blunts hedonic pull.\n\n**How to Try It:**\n• Keep a pack in bag/desk\n• Chew during TV ads or post‑meal urges\n• Re‑assess after 5 min",
    "contraindications": "Sugar alcohols may cause GI upset; avoid if jaw/TMJ issues.",
    "goal_tags": ["reduce_cravings", "stress_eating"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["sensory", "convenience"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["any", "commute"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["craving_event", "evening_grazing", "screen_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["sugar_free_gum"],
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
    "satisfies_craving": "minty",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000016",
    "summary": "Box breathing 4‑4‑6.",
    "details_md": "**The Experiment:** Inhale 4, hold 4, exhale 6 for 10 breaths.\n\n**Why it Works:** Longer exhale activates the vagus nerve (calms HPA axis).\n\n**How to Try It:**\n• Sit tall, one hand on belly\n• Count silently\n• Re‑rate stress after",
    "contraindications": "Stop if dizzy; breathe comfortably if pregnant or with respiratory issues.",
    "goal_tags": ["stress_eating", "improve_mood"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["relief"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "solo",
    "time_of_day": ["any"],
    "cue_context": ["anxiety", "stress", "craving_event"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": [],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["anxiety", "stress_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000017",
    "summary": "Ice‑cube grounding.",
    "details_md": "**The Experiment:** Hold an ice cube for ~30–45 seconds and notice sensations.\n\n**Why it Works:** Strong but safe sensory cue interrupts rumination/cravings.\n\n**How to Try It:**\n• Grab an ice cube\n• Track the sensation changing\n• Re‑assess your urge",
    "contraindications": "Skip if you have Raynaud’s or cold sensitivity.",
    "goal_tags": ["reduce_cravings", "stress_eating"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["sensory", "novelty"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "solo",
    "time_of_day": ["any"],
    "cue_context": ["craving_event", "anxiety"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": ["freezer"],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": false,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "rumination"],
    "sustainability": "occasionally"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000018",
    "summary": "Warm‑hands reset (2 minutes).",
    "details_md": "**The Experiment:** Rinse hands in warm water for ~2 minutes.\n\n**Why it Works:** Warmth cues parasympathetic calm and comfort.\n\n**How to Try It:**\n• Breathe slowly while warming hands\n• Feel shoulders drop\n• Re‑check urge",
    "contraindications": [],
    "goal_tags": ["improve_mood", "stress_eating"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["comfort", "relief"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "solo",
    "time_of_day": ["evening", "any"],
    "cue_context": ["evening_grazing", "stress"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": ["sink"],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "evening_grazing"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000019",
    "summary": "Two minutes with a pet.",
    "details_md": "**The Experiment:** Pet, play, or cuddle with an animal for ~2 minutes.\n\n**Why it Works:** Lowers cortisol and raises oxytocin—natural comfort.\n\n**How to Try It:**\n• Put phone down\n• Focus on touch/connection\n• Re‑assess craving",
    "contraindications": "Skip if allergic or animal is not receptive.",
    "goal_tags": ["emotional_eating", "improve_mood"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["comfort"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "outdoors"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["loneliness", "stress", "boredom"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "loneliness"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000020",
    "summary": "90‑second tidy sprint.",
    "details_md": "**The Experiment:** Set a timer and clear a small surface or drawer.\n\n**Why it Works:** Creating order restores control that stress eating mimics.\n\n**How to Try It:**\n• 90 seconds only\n• Count items to donate/trash\n• Re‑assess the urge",
    "contraindications": [],
    "goal_tags": ["better_habits", "stress_eating"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["mastery", "relief"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 2,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["stress", "boredom", "screen_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": ["timer"],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "rumination"],
    "sustainability": "daily_habit"
  },

  // --- Environment & Planning (21–30) ---

  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000021",
    "summary": "Snack speed‑bump (rubber band + note on lid).",
    "personalization_prompt": "What message will you write on your snack container to make you pause?",
    "personalization_type": "text" as const,
    "personalization_config": {
      "placeholder": "e.g., 'Are you hungry or just bored?', 'HALT: Hungry? Angry? Lonely? Tired?'"
    },
    "details_md": "**The Experiment:** Place a rubber band and a tiny “HALT?” note on tempting containers.\n\n**Why it Works:** Adds friction and a mindful pause.\n\n**How to Try It:**\n• Band the lid\n• Read note aloud\n• Choose: portion or pause",
    "contraindications": [],
    "goal_tags": ["portion_control", "stress_eating"],
    "tip_type": ["planning_ahead", "habit_stacking"],
    "motivational_mechanism": ["decision_ease"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["evening", "any"],
    "cue_context": ["evening_grazing", "screen_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": [],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": true,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["mindless_eating", "portion_control"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000022",
    "summary": "Snack‑tray rule (plate it, sit at a table).",
    "personalization_prompt": "Where's your official 'snack zone' going to be?",
    "personalization_type": "choice" as const,
    "personalization_config": {
      "choices": ["Kitchen table", "Dining room", "Breakfast nook", "Outdoor patio", "Office desk (but no work!)"],
      "multiple": false
    },
    "details_md": "**The Experiment:** Put all snacks on a small plate and eat at a table.\n\n**Why it Works:** Visibility + context reduce mindless grazing.\n\n**How to Try It:**\n• Portion once\n• Sit down without screens\n• Pause halfway to check fullness",
    "contraindications": [],
    "goal_tags": ["portion_control", "mindful_eating"],
    "tip_type": ["time_ritual", "habit_stacking"],
    "motivational_mechanism": ["decision_ease"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["snack_time", "evening_grazing"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": ["plate"],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["mindless_eating", "portion_control"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000023",
    "summary": "Hydration‑only desk rule.",
    "details_md": "**The Experiment:** Only water/tea at your desk; all eating happens elsewhere.\n\n**Why it Works:** Breaks the work‑stress→snack association.\n\n**How to Try It:**\n• Put a water bottle at desk\n• Move snacks to kitchen\n• Add a desk “No food” note",
    "contraindications": [],
    "goal_tags": ["better_habits", "stress_eating"],
    "tip_type": ["time_ritual", "planning_ahead"],
    "motivational_mechanism": ["mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["work", "home"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["work_break", "stress"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["water", "tea"],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": false,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": [],
    "satisfies_craving": null,
    "substitution_quality": null,
    "cognitive_load": 2,
    "helps_with": ["work_snacking", "mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000024",
    "summary": "Pantry shuffle (produce front & center).",
    "details_md": "**The Experiment:** Move fruit/veg to eye level; stash treats high/opaque.\n\n**Why it Works:** What’s visible is what’s eaten; cue management beats willpower.\n\n**How to Try It:**\n• Clear bowls for fruit\n• Opaque bins for treats\n• Label swaps: “See me, eat me”",
    "contraindications": [],
    "goal_tags": ["increase_veggies", "better_habits"],
    "tip_type": ["planning_ahead"],
    "motivational_mechanism": ["convenience"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["snack_time", "evening_grazing"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": [],
    "veggie_intensity": "moderate",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["mindless_eating", "reduce_cravings"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000025",
    "summary": "“Kitchen Closed” evening ritual + brush teeth.",
    "details_md": "**The Experiment:** After dinner, lights off, counters wiped, tent card: “Kitchen Closed.” Brush teeth.\n\n**Why it Works:** Ritual creates a clear off‑switch and minty palate reset.\n\n**How to Try It:**\n• Set a nightly alarm\n• Do the 3‑step close\n• Keep mouthwash/toothbrush handy",
    "contraindications": "Alcohol mouthwash can irritate; choose alcohol‑free if sensitive.",
    "goal_tags": ["evening_grazing", "stress_eating"],
    "tip_type": ["time_ritual", "habit_stacking"],
    "motivational_mechanism": ["closure", "comfort"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home"],
    "social_mode": "either",
    "time_of_day": ["evening", "night"],
    "cue_context": ["post_dinner", "screen_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": ["toothbrush"],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "satisfies_craving": "minty",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": ["evening_grazing", "mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000026",
    "summary": "Produce‑first cart (fill ⅓ before anything else).",
    "details_md": "**The Experiment:** At the store, fill the first third of your cart with produce.\n\n**Why it Works:** Anchoring bias nudges later choices healthier.\n\n**How to Try It:**\n• Shop perimeter first\n• Add grab‑ready veg/fruit\n• Then choose proteins/grains",
    "contraindications": [],
    "goal_tags": ["increase_veggies", "better_habits"],
    "tip_type": ["planning_ahead"],
    "motivational_mechanism": ["decision_ease"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "grocery"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["shopping"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "heavy",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["reduce_cravings"],
    "sustainability": "weekly_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000027",
    "summary": "Opaque decanting for treats; clear bowls for fruit.",
    "details_md": "**The Experiment:** Move treats to opaque bins; put fruit in clear bowls.\n\n**Why it Works:** Sight drives desire; manage cues to manage choices.\n\n**How to Try It:**\n• Label bins\n• Keep fruit washed/visible\n• Rotate weekly",
    "contraindications": [],
    "goal_tags": ["reduce_cravings", "better_habits"],
    "tip_type": ["planning_ahead"],
    "motivational_mechanism": ["convenience"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["snack_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "moderate",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["mindless_eating", "portion_control"],
    "sustainability": "weekly_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000028",
    "summary": "Sunday bento‑style snack prep (single portions).",
    "details_md": "**The Experiment:** Pre‑portion snacks into small containers for the week.\n\n**Why it Works:** Built‑in stop signals fight mindless seconds.\n\n**How to Try It:**\n• Prep 5–10 portions\n• Include protein/fiber options\n• Stack at eye level",
    "contraindications": [],
    "goal_tags": ["portion_control", "mindful_eating"],
    "tip_type": ["meal_prep", "planning_ahead"],
    "motivational_mechanism": ["convenience", "mastery"],
    "time_cost_enum": "15_30_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["home"],
    "social_mode": "either",
    "time_of_day": ["morning", "afternoon"],
    "cue_context": ["meal_prep"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["fruit", "yogurt", "nuts", "crackers"],
    "veggie_intensity": "moderate",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "kitchen_equipment": ["containers"],
    "cooking_skill_required": "none",
    "cognitive_load": 2,
    "helps_with": ["portion_control", "stress_eating"],
    "sustainability": "weekly_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000029",
    "summary": "App hibernation week (offload food delivery apps).",
    "details_md": "**The Experiment:** Offload/hide delivery apps for 7 days.\n\n**Why it Works:** Extra clicks add just enough friction to interrupt impulses.\n\n**How to Try It:**\n• Move apps into a folder or offload\n• Keep a simple meal plan handy\n• Re‑install after the week if desired",
    "contraindications": [],
    "goal_tags": ["stress_eating", "better_habits"],
    "tip_type": ["planning_ahead"],
    "motivational_mechanism": ["decision_ease", "mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "solo",
    "time_of_day": ["evening", "any"],
    "cue_context": ["evening_grazing", "boredom", "craving_event"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": false,
    "kid_approved": false,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 2,
    "helps_with": ["impulse_orders", "evening_grazing"],
    "sustainability": "occasionally"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000030",
    "summary": "Post‑meal shopping rule.",
    "details_md": "**The Experiment:** Only grocery shop after eating.\n\n**Why it Works:** Lowers hunger‑driven hedonic purchases.\n\n**How to Try It:**\n• Add to calendar notes\n• Keep a standing list\n• Eat a small snack before unexpected runs",
    "contraindications": [],
    "goal_tags": ["better_habits", "reduce_cravings"],
    "tip_type": ["time_ritual", "planning_ahead"],
    "motivational_mechanism": ["decision_ease"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["grocery"],
    "social_mode": "either",
    "time_of_day": ["afternoon", "any"],
    "cue_context": ["shopping"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["reduce_cravings"],
    "sustainability": "weekly_habit"
  },

  // --- Mindful Eating & Sensory (31–40) ---

  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000031",
    "summary": "Chopsticks challenge (or tiny fork).",
    "details_md": "**The Experiment:** Eat a meal/snack with chopsticks or a tiny fork.\n\n**Why it Works:** Disrupts autopilot and slows bites so satiety can register.\n\n**How to Try It:**\n• Use for the whole portion\n• Put down between bites\n• Notice flavor changes",
    "contraindications": [],
    "goal_tags": ["mindful_eating", "portion_control"],
    "tip_type": ["time_ritual"],
    "motivational_mechanism": ["novelty", "fun"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["home", "work", "restaurant"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": ["chopsticks"],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 2,
    "helps_with": ["mindless_eating", "portion_control"],
    "sustainability": "occasionally"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000032",
    "summary": "Silent first minute of every meal.",
    "details_md": "**The Experiment:** Eat the first 60 seconds without talking or screens.\n\n**Why it Works:** Heightens sensory cues and early satisfaction.\n\n**How to Try It:**\n• Start in silence\n• Notice aroma/texture\n• Decide pace after 1 minute",
    "contraindications": [],
    "goal_tags": ["mindful_eating"],
    "tip_type": ["time_ritual", "habit_stacking"],
    "motivational_mechanism": ["mastery", "sensory"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work", "restaurant"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": [],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000033",
    "summary": "Photo‑pause halfway through the meal.",
    "details_md": "**The Experiment:** Snap a quick plate photo at the halfway point.\n\n**Why it Works:** Visual pause interrupts momentum eating and rechecks hunger.\n\n**How to Try It:**\n• Set a halfway timer\n• Take one photo\n• Ask: do I need more?",
    "contraindications": [],
    "goal_tags": ["portion_control", "mindful_eating"],
    "tip_type": ["habit_stacking"],
    "motivational_mechanism": ["accountability", "mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work", "restaurant"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": ["phone_camera", "timer"],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": false,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["portion_control", "mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000034",
    "summary": "Eat with your non‑dominant hand.",
    "details_md": "**The Experiment:** Use your non‑dominant hand for a full snack/meal.\n\n**Why it Works:** Disrupts conditioned motor patterns, slowing intake.\n\n**How to Try It:**\n• Commit for the entire portion\n• Put utensil down between bites\n• Notice speed shift",
    "contraindications": [],
    "goal_tags": ["mindful_eating"],
    "tip_type": ["time_ritual"],
    "motivational_mechanism": ["novelty", "fun"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 2,
    "helps_with": ["mindless_eating"],
    "sustainability": "occasionally"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000035",
    "summary": "First‑bite spotlight.",
    "details_md": "**The Experiment:** Give the first bite total attention and rate it 1–10.\n\n**Why it Works:** Reward is front‑loaded; savoring increases satisfaction with less.\n\n**How to Try It:**\n• Close eyes for first bite\n• Name 3 flavor notes\n• Decide slow pace",
    "contraindications": [],
    "goal_tags": ["mindful_eating"],
    "tip_type": ["time_ritual"],
    "motivational_mechanism": ["sensory", "mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "cognitive_load": 1,
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "helps_with": ["mindless_eating", "portion_control"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000036",
    "summary": "Crunch‑swap board (post 6 crunchy alternatives).",
    "personalization_prompt": "Build your 'Crunch Squad' - pick your top 6 crunchy alternatives:",
    "personalization_type": "choice" as const,
    "personalization_config": {
      "choices": ["Baby carrots", "Cucumber slices", "Jicama sticks", "Air-popped popcorn", "Snap peas", "Bell pepper strips", "Apple slices", "Celery sticks", "Radishes", "Rice cakes"],
      "multiple": true
    },
    "details_md": "**The Experiment:** List crunchy swaps (carrots, cukes, jicama, popcorn) on a visible card.\n\n**Why it Works:** Meets sensory need with lower caloric load.\n\n**How to Try It:**\n• Post near snack zone\n• Pick one when ‘crunch’ hits\n• Plate and sit to eat",
    "contraindications": [],
    "goal_tags": ["reduce_cravings", "increase_veggies"],
    "tip_type": ["planning_ahead", "behavioral_strategy"],
    "motivational_mechanism": ["sensory", "convenience"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["craving_event", "snack_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["carrots", "cucumbers", "popcorn"],
    "veggie_intensity": "moderate",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": true,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "satisfies_craving": "crunchy",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000037",
    "summary": "Aroma anchor (3 slow breaths over food).",
    "personalization_prompt": "What mantra will you think during your 3 pre-meal breaths?",
    "personalization_type": "text" as const,
    "personalization_config": {
      "placeholder": "e.g., 'I am grateful for this food', 'This nourishes my body', 'I eat with intention'"
    },
    "details_md": "**The Experiment:** Smell your food for 3 breaths before first bite.\n\n**Why it Works:** Olfactory priming enhances satisfaction and slows pace.\n\n**How to Try It:**\n• Lift plate or bowl\n• Inhale, pause, exhale slowly\n• Take a small first bite",
    "contraindications": [],
    "goal_tags": ["mindful_eating"],
    "tip_type": ["time_ritual"],
    "motivational_mechanism": ["sensory"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "cognitive_load": 1,
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "helps_with": ["mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000038",
    "summary": "Two‑minute fork‑down timer.",
    "details_md": "**The Experiment:** Every 2 minutes, utensils down until the chime.\n\n**Why it Works:** Built‑in pauses let fullness signals catch up.\n\n**How to Try It:**\n• Set a soft timer\n• Utensils down on each chime\n• Re‑rate hunger mid‑meal",
    "contraindications": [],
    "goal_tags": ["portion_control", "mindful_eating"],
    "tip_type": ["habit_stacking"],
    "motivational_mechanism": ["mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": ["timer"],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 2,
    "helps_with": ["portion_control", "mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000039",
    "summary": "Taste talk in your head.",
    "details_md": "**The Experiment:** Silently name flavors/textures during the meal.\n\n**Why it Works:** Keeps attention on eating vs. scrolling; boosts satisfaction.\n\n**How to Try It:**\n• Name 3 sensations per bite\n• Pause if distracted\n• Re‑rate fullness at 70%",
    "contraindications": [],
    "goal_tags": ["mindful_eating"],
    "tip_type": ["time_ritual"],
    "motivational_mechanism": ["sensory", "mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "cognitive_load": 2,
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "helps_with": ["mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000040",
    "summary": "Minty full‑stop after planned last bite.",
    "details_md": "**The Experiment:** Brush, floss, or swish mouthwash right after you finish.\n\n**Why it Works:** Mint signals “eating is done” and reduces dessert grazing.\n\n**How to Try It:**\n• Keep kit near table\n• Do it immediately\n• Close kitchen",
    "contraindications": "Choose alcohol‑free mouthwash if sensitive; wait 30 minutes before brushing after acidic foods.",
    "goal_tags": ["evening_grazing", "portion_control"],
    "tip_type": ["time_ritual", "habit_stacking"],
    "motivational_mechanism": ["closure", "sensory"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["evening", "night", "any"],
    "cue_context": ["post_dinner", "craving_event"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "kitchen_equipment": ["toothbrush"],
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "satisfies_craving": "minty",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": ["evening_grazing", "mindless_eating"],
    "sustainability": "daily_habit"
  },

  // --- Nutritional & Physiological (41–50) ---

  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000041",
    "summary": "Big glass first (12–16 oz water).",
    "details_md": "**The Experiment:** Drink a full glass of water before any unplanned snack.\n\n**Why it Works:** Thirst is often misread as hunger; volume supports fullness.\n\n**How to Try It:**\n• Keep a filled bottle nearby\n• Sip steadily, wait 10 minutes\n• Re‑assess urge",
    "contraindications": "Adjust if you are on a fluid‑restricted plan.",
    "goal_tags": ["increase_hydration", "reduce_cravings"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["convenience"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["any"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["craving_event", "snack_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["water"],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["reduce_cravings", "mindless_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000042",
    "summary": "Protein‑first bite.",
    "details_md": "**The Experiment:** Take your first bite from a protein source.\n\n**Why it Works:** Protein blunts glucose swings that drive cravings.\n\n**How to Try It:**\n• Lead with eggs, yogurt, beans, fish or tofu\n• Then mix the rest\n• Pause halfway to re‑rate hunger",
    "contraindications": [],
    "goal_tags": ["reduce_cravings", "mindful_eating"],
    "tip_type": ["time_ritual"],
    "motivational_mechanism": ["mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work", "restaurant"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["eggs", "yogurt", "beans", "fish", "tofu"],
    "veggie_intensity": "moderate",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["portion_control", "reduce_cravings"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000043",
    "summary": "Veggie starter (cup of crunchy veg/soup first).",
    "details_md": "**The Experiment:** Begin meals with a cup of veg or broth‑based soup.\n\n**Why it Works:** Fiber/volume increase satiety and slow pace.\n\n**How to Try It:**\n• Keep pre‑cut veg ready\n• Plate starter first\n• Eat mindfully before mains",
    "contraindications": [],
    "goal_tags": ["increase_veggies", "portion_control", "gut_health"],
    "tip_type": ["time_ritual", "habit_stacking"],
    "motivational_mechanism": ["sensory", "comfort"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "restaurant"],
    "social_mode": "either",
    "time_of_day": ["lunch", "evening", "any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["vegetables", "soup"],
    "veggie_intensity": "heavy",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "texture_profile": ["crunchy", "warm"],
    "cognitive_load": 1,
    "helps_with": ["mindless_eating", "portion_control"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000044",
    "summary": "Omega‑3 boost today.",
    "details_md": "**The Experiment:** Add one omega‑3 source (salmon, sardines, chia, walnuts).\n\n**Why it Works:** Omega‑3s support mood regulation and may reduce anxiety‑driven urges.\n\n**How to Try It:**\n• Swap in salmon or sprinkle chia\n• Log mood/urge 0–10 after meals\n• Repeat 2–3×/week",
    "contraindications": "Fish/shellfish allergy; consult your clinician if on blood thinners.",
    "goal_tags": ["improve_mood", "reduce_cravings", "gut_health"],
    "tip_type": ["planning_ahead"],
    "motivational_mechanism": ["mastery", "energy_boost"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["home", "restaurant", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["salmon", "sardines", "chia", "walnuts"],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": false,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 2,
    "helps_with": ["stress_eating", "anxiety"],
    "sustainability": "weekly_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000045",
    "summary": "Ferment‑a‑day (yogurt, kefir, kimchi, sauerkraut).",
    "details_md": "**The Experiment:** Include one fermented food today.\n\n**Why it Works:** A healthy microbiome supports mood and cravings via the gut–brain axis.\n\n**How to Try It:**\n• Add plain yogurt to breakfast\n• Top bowls with kimchi\n• Note mood/urge changes",
    "contraindications": "Consider histamine intolerance, active reflux, or GI sensitivities.",
    "goal_tags": ["gut_health", "improve_mood"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["convenience", "comfort"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work", "restaurant"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["meal_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["yogurt", "kefir", "kimchi", "sauerkraut"],
    "veggie_intensity": "moderate",
    "family_friendly": true,
    "kid_approved": false,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["stress_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000046",
    "summary": "Warm mug ritual at night (herbal).",
    "details_md": "**The Experiment:** Replace dessert grazing with a warm herbal drink.\n\n**Why it Works:** Warmth soothes the nervous system and provides comfort without a sugar spike.\n\n**How to Try It:**\n• Pick chamomile/peppermint/rooibos\n• Sit while you sip\n• Start 30–60 min before bed",
    "contraindications": "Choose caffeine‑free varieties at night; consider reflux triggers.",
    "goal_tags": ["evening_grazing", "improve_sleep"],
    "tip_type": ["time_ritual", "behavioral_strategy"],
    "motivational_mechanism": ["comfort", "sensory"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home"],
    "social_mode": "either",
    "time_of_day": ["evening", "night"],
    "cue_context": ["post_dinner", "craving_event"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["herbal_tea"],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "satisfies_craving": "warm",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": ["evening_grazing", "stress_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000047",
    "summary": "Sleep guardrails (reverse alarm + dim lights).",
    "details_md": "**The Experiment:** Set an alarm 45 minutes before bed to start wind‑down.\n\n**Why it Works:** Better sleep improves ghrelin/leptin balance and trims next‑day cravings.\n\n**How to Try It:**\n• Dim lights\n• Screens off\n• Light stretch or reading",
    "contraindications": [],
    "goal_tags": ["improve_sleep", "reduce_cravings"],
    "tip_type": ["time_ritual", "planning_ahead"],
    "motivational_mechanism": ["comfort", "mastery"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 2,
    "physical_effort": 1,
    "location_tags": ["home"],
    "social_mode": "either",
    "time_of_day": ["night"],
    "cue_context": ["evening_grazing", "tired"],
    "difficulty_tier": 2,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 3,
    "requires_planning": true,
    "impulse_friendly": false,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 2,
    "helps_with": ["reduce_cravings", "evening_grazing"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000048",
    "summary": "Shell‑game snack (pistachios in shell or edamame in pod).",
    "details_md": "**The Experiment:** Choose an effortful snack with built‑in pauses.\n\n**Why it Works:** Slows pace and makes amounts visible, aiding satiety.\n\n**How to Try It:**\n• Portion into a small bowl\n• Keep shells/pods visible\n• Pair with water",
    "contraindications": "Allergy to nuts/soy; mind choking risk for small children.",
    "goal_tags": ["portion_control", "mindful_eating"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["sensory", "convenience"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home", "work"],
    "social_mode": "either",
    "time_of_day": ["any"],
    "cue_context": ["snack_time", "evening_grazing"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["pistachios", "edamame"],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": false,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "satisfies_craving": "salty",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": ["mindless_eating", "portion_control"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000049",
    "summary": "Mocktail hour (sparkling water + citrus) in a fancy glass.",
    "details_md": "**The Experiment:** Make a zero‑alcohol, bubbly drink for evening ritual.\n\n**Why it Works:** Satisfies hand‑to‑mouth and ‘treat’ cues without sugar/fat.\n\n**How to Try It:**\n• Sparkling water + citrus/herbs\n• Sit to sip\n• Pair with kitchen‑closed card",
    "contraindications": "Citrus may aggravate reflux; use gentler flavors if needed.",
    "goal_tags": ["evening_grazing", "reduce_cravings"],
    "tip_type": ["time_ritual", "behavioral_strategy"],
    "motivational_mechanism": ["sensory", "comfort"],
    "time_cost_enum": "5_15_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["home"],
    "social_mode": "either",
    "time_of_day": ["evening"],
    "cue_context": ["post_dinner", "screen_time"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "involves_foods": ["sparkling_water", "citrus"],
    "veggie_intensity": "none",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 4,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "satisfies_craving": "bubbly",
    "substitution_quality": "high",
    "cognitive_load": 1,
    "helps_with": ["evening_grazing", "stress_eating"],
    "sustainability": "daily_habit"
  },
  {
    "tip_id": "9f8a7b6c-1234-4abc-9def-000000000050",
    "summary": "Sunshine microdose (3–5 minutes midday).",
    "details_md": "**The Experiment:** Get outside for a few minutes of daylight.\n\n**Why it Works:** Supports circadian rhythm and mood, lowering stress‑driven appetite.\n\n**How to Try It:**\n• Step out after lunch\n• Look at the horizon (not the sun)\n• Take 5 slow breaths",
    "contraindications": "Use sun protection as appropriate.",
    "goal_tags": ["improve_mood", "improve_sleep", "stress_eating"],
    "tip_type": ["behavioral_strategy"],
    "motivational_mechanism": ["energy_boost", "relief"],
    "time_cost_enum": "0_5_min",
    "money_cost_enum": "$",
    "mental_effort": 1,
    "physical_effort": 1,
    "location_tags": ["outdoors", "work", "home"],
    "social_mode": "either",
    "time_of_day": ["afternoon", "any"],
    "cue_context": ["work_break", "stress"],
    "difficulty_tier": 1,
    "created_by": "dietitian_reviewed",
    "veggie_intensity": "not_applicable",
    "family_friendly": true,
    "kid_approved": true,
    "partner_resistant_ok": true,
    "chaos_level_max": 5,
    "requires_planning": false,
    "impulse_friendly": true,
    "diet_trauma_safe": true,
    "feels_like_diet": false,
    "cognitive_load": 1,
    "helps_with": ["stress_eating", "anxiety"],
    "sustainability": "daily_habit"
  },
  {
    tip_id: 'eat-slowly-20-minutes',
    summary: 'Eat slowly: Take 20+ minutes for main meals',
    personalization_prompt: "What's your strategy for timing 20 minutes?",
    personalization_type: 'text' as const,
    personalization_config: {
      placeholder: "e.g., Set a timer, put on a 20-minute playlist, watch a sitcom episode"
    },
    details_md: `**The Experiment:** Take at least 20 minutes to eat your main meals today.

**Why it Works:** Eating slowly gives your brain time to receive fullness signals from your stomach, which takes about 20 minutes. This helps prevent overeating and improves digestion. You'll likely feel more satisfied with less food.

**How to Try It:**
• Set a timer for 20 minutes when you start eating
• Put your fork down between bites
• Chew each bite thoroughly (aim for 20-30 chews)
• Take sips of water throughout the meal
• Engage in conversation if eating with others`,
    contraindications: [],
    goal_tags: ['weight_loss', 'improve_gut_health', 'improve_energy'],
    tip_type: ['mindset_shift', 'time_ritual'],
    motivational_mechanism: ['mastery', 'comfort'],
    time_cost_enum: '15_60_min',
    money_cost_enum: '$',
    mental_effort: 3,
    physical_effort: 1,
    location_tags: ['home', 'work', 'restaurant'],
    social_mode: 'either',
    time_of_day: ['morning', 'afternoon', 'evening'],
    cue_context: ['meal_time'],
    difficulty_tier: 3,
    created_by: 'dietitian_reviewed',
    preserves_foods: ['chocolate', 'cheese', 'bread', 'pasta', 'meat'],
    veggie_intensity: 'not_applicable',
    family_friendly: true,
    kid_approved: false,
    partner_resistant_ok: true,
    chaos_level_max: 2,
    requires_planning: false,
    impulse_friendly: false,
    diet_trauma_safe: false,
    feels_like_diet: true,
    kitchen_equipment: ['none'],
    cooking_skill_required: 'none',
    cognitive_load: 3,
    helps_with: ['speed_eating', 'mindless_eating', 'portion_control'],
    sustainability: 'daily_habit'
  }
];

// Helper function to get tips that are safe for a user's medical conditions
export function getSafeTips(medicalConditions: string[] = []): Tip[] {
  return TIPS_DATABASE.filter(tip => {
    // Handle various contraindication formats (string, array, or null)
    if (!tip.contraindications) {
      return true; // No contraindications means safe
    }
    
    // Convert to array if it's a string
    const contraindications = Array.isArray(tip.contraindications) 
      ? tip.contraindications 
      : typeof tip.contraindications === 'string' 
        ? [tip.contraindications]
        : [];
    
    // If no contraindications after conversion, tip is safe
    if (contraindications.length === 0) {
      return true;
    }
    
    // Check if any contraindications match user's medical conditions
    return !contraindications.some(contra => 
      medicalConditions.includes(contra as string)
    );
  });
}

// Helper function to get tips matching user goals
export function getTipsForGoals(goals: string[]): Tip[] {
  return TIPS_DATABASE.filter(tip =>
    tip.goal_tags && tip.goal_tags.length > 0 && 
    tip.goal_tags.some(tag => goals.includes(tag))
  );
}

// Helper function to get tips by difficulty
export function getTipsByDifficulty(maxDifficulty: number): Tip[] {
  return TIPS_DATABASE.filter(tip => tip.difficulty_tier <= maxDifficulty);
}

// Helper function to get a specific tip by ID
export function getTipById(tipId: string): Tip | undefined {
  return TIPS_DATABASE.find(tip => tip.tip_id === tipId);
}