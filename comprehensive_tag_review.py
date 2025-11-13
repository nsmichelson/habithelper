#!/usr/bin/env python3
import json
import re

# Load the available tags
with open('/Users/nataliemichelson/Projects/habithelper/newFiles/tags_with_descriptions.json', 'r') as f:
    all_tags = json.load(f)

# Create lookup dictionaries
context_tags = {tag['key']: tag['description'] for tag in all_tags if tag['bucket'] == 'context'}
technique_tags = {tag['key']: tag['description'] for tag in all_tags if tag['bucket'] == 'technique'}
goal_tags = {tag['key']: tag['description'] for tag in all_tags if tag['bucket'] == 'goal'}
helps_with_tags = {tag['key']: tag['description'] for tag in all_tags if tag['bucket'] == 'helps_with'}

# Comprehensive tag updates after careful review
tip_comprehensive_tags = {
    # Tips 1-10: Pregnancy nausea and morning sickness management
    1: {
        "context_tags": ["pregnancy", "breastfeeding"],  # Also useful for breastfeeding nausea
        "technique_tags": ["environment_design", "pre_commitment", "choose_healthy_snacks", "pre_commitment"],
        "goal_tags": ["nutrient_density", "stay_hydrated"],
        "helps_with": ["nausea", "vomiting", "odor_triggers", "smell_aversion", "nausea_triggers"]
    },
    2: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["batch_cooking", "pre_commitment", "meal_prep", "pre_commitment"],
        "goal_tags": ["nutrient_density", "stay_hydrated"],
        "helps_with": ["nausea", "vomiting", "dehydration", "decision_fatigue"]
    },
    3: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["batch_cooking", "hydration_first", "meal_prep", "pre_commitment"],
        "goal_tags": ["nutrient_density", "stay_hydrated"],
        "helps_with": ["nausea", "dehydration", "vomiting"]
    },
    4: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["distraction", "environment_design", "cue_removal"],
        "goal_tags": ["nutrient_density"],
        "helps_with": ["nausea", "smell_aversion", "odor_triggers", "heartburn", "nausea_triggers"]
    },
    5: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["healthy_swaps", "hydration_first", "reminder_cues"],
        "goal_tags": ["nutrient_density", "stay_hydrated"],
        "helps_with": ["dehydration", "nausea", "smell_aversion"]
    },
    6: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["environment_design", "pre_commitment", "habit_stacking", , "pre_commitment"],
        "goal_tags": ["nutrient_density", "consistent_routines"],
        "helps_with": ["nausea", "nausea_from_empty_stomach", "low_morning_energy"]
    },
    7: {
        "context_tags": ["pregnancy"],
        "technique_tags": [, "pre_commitment", "protein_first", , "late_meal_timing_adjustment"],
        "goal_tags": ["nutrient_density", "stable_blood_sugar", "maintain_stable_blood_sugar", "adequate_protein"],
        "helps_with": ["nausea", "overnight_hunger", "nausea_from_empty_stomach", "blood_sugar_spikes", "energy_crashes"]
    },
    8: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["choose_healthy_snacks", "fiber_first", "increase_fiber"],
        "goal_tags": ["nutrient_density", "adequate_fiber", "improve_gut_health"],
        "helps_with": ["constipation", "bloating"]
    },
    9: {
        "context_tags": ["pregnancy"],
        "technique_tags": [, "fiber_first", "habit_stacking", "increase_fiber"],
        "goal_tags": ["nutrient_density", "adequate_fiber", "adequate_omega_3", "improve_gut_health"],
        "helps_with": ["constipation", "low_satiety", "bloating"]
    },
    10: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["choose_healthy_snacks", "fiber_first", "increase_fiber"],
        "goal_tags": ["nutrient_density", "adequate_fiber", "improve_gut_health"],
        "helps_with": ["constipation"]
    },

    # Tips 11-20: Digestive health and food safety during pregnancy
    11: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["hydration_first", , "consistent_wake_time"],
        "goal_tags": ["nutrient_density", "stay_hydrated", "improve_gut_health", "consistent_routines"],
        "helps_with": ["constipation", "nausea", "dehydration", "low_morning_energy"]
    },
    12: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["walk_after_meals", "movement_breaks", "neat_boosting"],
        "goal_tags": ["nutrient_density", "improve_gut_health", "stable_blood_sugar", "increase_steps"],
        "helps_with": ["constipation", "bloating", "heartburn", "indigestion", "reflux"]
    },
    13: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["distraction", "choose_healthy_snacks", "identify_reflux_triggers"],
        "goal_tags": ["nutrient_density"],
        "helps_with": ["heartburn", "reflux", "indigestion"]
    },
    14: {
        "context_tags": ["pregnancy", "gerd"],
        "technique_tags": ["healthy_swaps", "hydration_first"],
        "goal_tags": ["nutrient_density", "stay_hydrated"],
        "helps_with": ["heartburn", "reflux", "indigestion"]
    },
    15: {
        "context_tags": ["pregnancy", "gerd"],
        "technique_tags": ["hydration_first", "identify_reflux_triggers"],
        "goal_tags": ["nutrient_density", "stay_hydrated"],
        "helps_with": ["heartburn", "reflux"]
    },
    16: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["healthy_swaps"],
        "goal_tags": ["nutrient_density"],
        "helps_with": ["heartburn", "indigestion", "reflux"]
    },
    17: {
        "context_tags": ["pregnancy", "food_allergies"],
        "technique_tags": ["healthy_swaps", "coping_plans", "pre_commitment"],
        "goal_tags": ["nutrient_density", "ensure_food_safety", "manage_cravings"],
        "helps_with": ["cravings", "food_safety_anxiety"]
    },
    18: {
        "context_tags": ["pregnancy", "breastfeeding"],
        "technique_tags": ["healthy_swaps", "environment_design", "temptation_bundling"],
        "goal_tags": ["nutrient_density", "alcohol_free", "reduce_added_sugar"],
        "helps_with": ["social_pressure", "evening_cravings", "sweet_cravings"]
    },
    19: {
        "context_tags": ["pregnancy", "food_allergies"],
        "technique_tags": ["coping_plans", "pre_commitment", "pre_commitment"],
        "goal_tags": ["nutrient_density", "ensure_food_safety", "manage_cravings"],
        "helps_with": ["food_safety_anxiety", "cravings"]
    },
    20: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["healthy_swaps", "pre_commitment", "pre_commitment"],
        "goal_tags": ["nutrient_density", "ensure_food_safety", "manage_cravings"],
        "helps_with": ["sweet_cravings", "food_safety_anxiety", "cravings"]
    },

    # Tips 21-30: Pregnancy nutrition optimization
    21: {
        "context_tags": ["pregnancy", "breastfeeding"],
        "technique_tags": ["healthy_swaps", "caffeine_cutoff", "reduce_caffeine"],
        "goal_tags": ["nutrient_density", "reduce_caffeine", "improve_sleep"],
        "helps_with": ["jitters", "poor_sleep", "caffeine_dependence", "insomnia"]
    },
    22: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["coping_plans", "healthy_swaps"],
        "goal_tags": ["nutrient_density", "adequate_vitamins"],
        "helps_with": ["nausea", "vomiting"]
    },
    23: {
        "context_tags": ["pregnancy", "food_intolerances"],
        "technique_tags": ["intuitive_eating", "coping_plans", "cognitive_reframing"],
        "goal_tags": ["nutrient_density", "increase_nutrient_density", "healthy_relationship_with_food"],
        "helps_with": ["nausea", "smell_aversion", "perfectionism", "food_anxiety", "all_or_nothing_thinking"]
    },
    24: {
        "context_tags": ["pregnancy"],
        "technique_tags": [, "increase_vegetables", "increase_fiber", "batch_cooking"],
        "goal_tags": ["nutrient_density", "adequate_fiber", "adequate_folate", "adequate_iron"],
        "helps_with": ["constipation", "anemia_risk"]
    },
    25: {
        "context_tags": ["pregnancy"],
        "technique_tags": [, "increase_vegetables", "increase_fiber", "habit_stacking"],
        "goal_tags": ["nutrient_density", "adequate_folate", "adequate_fiber", "adequate_protein"],
        "helps_with": ["constipation", "low_energy", "smell_aversion"]
    },
    26: {
        "context_tags": ["pregnancy"],
        "technique_tags": [, "increase_vegetables", "increase_fiber"],
        "goal_tags": ["nutrient_density", "adequate_fiber", "increase_nutrient_density"],
        "helps_with": ["constipation", "smell_aversion"]
    },
    27: {
        "context_tags": ["pregnancy"],
        "technique_tags": [, "increase_protein", "protein_first", "protein_at_breakfast"],
        "goal_tags": ["nutrient_density", "adequate_protein", "adequate_choline", "increase_satiety"],
        "helps_with": ["low_satiety", "low_morning_energy", "hunger"]
    },
    28: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["meal_prep", "pre_commitment"],
        "goal_tags": ["nutrient_density", "adequate_choline"],
        "helps_with": ["sweet_cravings"]
    },
    29: {
        "context_tags": ["pregnancy", "lactose_intolerance"],
        "technique_tags": ["healthy_swaps", "increase_protein", ],
        "goal_tags": ["nutrient_density", "adequate_protein", "adequate_calcium"],
        "helps_with": ["nausea_aversion_to_meat"]
    },
    30: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["healthy_swaps", "increase_protein", ],
        "goal_tags": ["nutrient_density", "adequate_protein", "increase_satiety"],
        "helps_with": ["energy_crashes", "hunger", "low_satiety"]
    },

    # Tips 31-40: More pregnancy nutrition strategies
    31: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["increase_protein", "protein_first", "habit_stacking"],
        "goal_tags": ["nutrient_density", "adequate_protein", "increase_satiety"],
        "helps_with": ["hunger", "low_satiety"]
    },
    32: {
        "context_tags": ["pregnancy", "vegetarian"],
        "technique_tags": ["choose_healthy_snacks", "increase_protein"],
        "goal_tags": ["nutrient_density", "adequate_protein", "adequate_iron", "adequate_folate"],
        "helps_with": ["anemia_risk", "snack_attacks", "hunger"]
    },
    33: {
        "context_tags": ["pregnancy", "vegetarian", "vegan"],
        "technique_tags": ["meal_prep", "batch_cooking", "increase_fiber"],
        "goal_tags": ["nutrient_density", "adequate_iron", "adequate_fiber"],
        "helps_with": ["anemia_risk", "constipation"]
    },
    34: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["environment_design"],
        "goal_tags": ["nutrient_density", "adequate_iron"],
        "helps_with": ["anemia_risk"]
    },
    35: {
        "context_tags": ["pregnancy", "vegetarian", "vegan"],
        "technique_tags": [, "pre_commitment", "low_glycemic_pairing"],
        "goal_tags": ["nutrient_density", "adequate_iron"],
        "helps_with": ["anemia_risk"]
    },
    36: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["choose_healthy_snacks"],
        "goal_tags": ["nutrient_density", "adequate_iodine"],
        "helps_with": ["chip_cravings", "salty_cravings"]
    },
    37: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["meal_prep", "pre_commitment", "batch_cooking"],
        "goal_tags": ["nutrient_density", "adequate_iodine", "adequate_omega_3", "adequate_protein"],
        "helps_with": ["cravings"]
    },
    38: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["choose_healthy_breakfasts", "increase_vegetables", "habit_stacking"],
        "goal_tags": ["nutrient_density", "adequate_folate"],
        "helps_with": ["low_morning_energy"]
    },
    39: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["healthy_swaps", "increase_fiber"],
        "goal_tags": ["nutrient_density", "adequate_fiber"],
        "helps_with": ["sweet_cravings", "constipation"]
    },
    40: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["pre_commitment", "habit_stacking", "increase_fiber", "meal_prep"],
        "goal_tags": ["nutrient_density", "adequate_fiber"],
        "helps_with": ["constipation", "sweet_cravings"]
    },

    # Tips 41-49: Pregnancy meal planning and preparation
    41: {
        "context_tags": ["pregnancy", "travel"],
        "technique_tags": ["pre_commitment", "environment_design", "choose_healthy_snacks", "pre_commitment"],
        "goal_tags": ["nutrient_density", "maintain_stable_blood_sugar", "reduce_ultra_processed_foods"],
        "helps_with": ["random_cravings", "energy_crashes", "nausea_from_empty_stomach", "hunger", "impulse_orders"]
    },
    42: {
        "context_tags": ["pregnancy", "postpartum", "new_parent"],
        "technique_tags": ["batch_cooking", "meal_prep", "pre_commitment", "pre_commitment"],
        "goal_tags": ["nutrient_density", "consistent_routines", "budget_friendly_eating"],
        "helps_with": ["decision_fatigue", "low_energy", "budget_constraints", "overwhelm"]
    },
    43: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["gamification", "self_monitoring", "visual_habit_tracker"],
        "goal_tags": ["nutrient_density", "stay_hydrated", "increase_nutrient_density", "adequate_protein"],
        "helps_with": ["inconsistency", "forgetfulness", "low_motivation"]
    },
    44: {
        "context_tags": ["pregnancy", "heavy_workload"],
        "technique_tags": ["environment_design", "pre_commitment", "pre_commitment"],
        "goal_tags": ["nutrient_density", "increase_nutrient_density", "adequate_fiber"],
        "helps_with": ["constipation", "snacking", "time_pressure", "decision_fatigue"]
    },
    45: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["accountability_partner", "body_doubling", ],
        "goal_tags": ["nutrient_density", "consistent_routines", "increase_nutrient_density"],
        "helps_with": ["low_motivation", "lack_of_support", "inconsistency"]
    },
    46: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["self_monitoring", "habit_reflection", "identify_reflux_triggers"],
        "goal_tags": ["nutrient_density"],
        "helps_with": ["nausea_triggers", "reflux", "heartburn", "odor_triggers"]
    },
    47: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["healthy_swaps", "coping_plans", "cognitive_reframing"],
        "goal_tags": ["nutrient_density", "manage_cravings", "reduce_ultra_processed_foods"],
        "helps_with": ["sweet_cravings", "salty_cravings", "binge_eating", "cravings", "chip_cravings"]
    },
    48: {
        "context_tags": ["pregnancy", "vegetarian", "vegan", "food_allergies"],
        "technique_tags": ["healthy_swaps", "pre_commitment", ],
        "goal_tags": ["nutrient_density", "adequate_omega_3", "adequate_choline"],
        "helps_with": []
    },
    49: {
        "context_tags": ["pregnancy"],
        "technique_tags": ["habit_menu", "pre_commitment", "pre_commitment"],
        "goal_tags": ["nutrient_density", "consistent_routines", "increase_nutrient_density"],
        "helps_with": ["decision_fatigue", "smell_aversion", "low_energy", "perfectionism"]
    },

    # Tips 50-60: General mindful eating and environment design
    50: {
        "context_tags": [],
        "technique_tags": ["slow_eating", "mindful_eating"],
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "overeating", "portion_size_issues"]
    },
    51: {
        "context_tags": [],
        "technique_tags": ["environment_design", "cue_removal", "stimulus_control"],
        "goal_tags": ["lose_weight", "reduce_ultra_processed_foods", "manage_cravings"],
        "helps_with": ["mindless_eating", "sugar_addiction", "snacking", "impulse_orders"]
    },
    52: {
        "context_tags": [],
        "technique_tags": ["portion_control", "environment_design"],
        "goal_tags": ["lose_weight", "increase_satiety"],
        "helps_with": ["overeating", "portion_size_issues"]
    },
    53: {
        "context_tags": [],
        "technique_tags": ["habit_stacking", "hydration_first", "reminder_cues", "reminder_cues"],
        "goal_tags": ["stay_hydrated", "manage_cravings", "stable_blood_sugar"],
        "helps_with": ["mindless_eating", "low_energy", "dehydration", "cravings", "hunger"]
    },
    54: {
        "context_tags": [],
        "technique_tags": ["habit_stacking", "increase_vegetables", "increase_fiber", ],
        "goal_tags": ["increase_nutrient_density", "adequate_fiber"],
        "helps_with": ["low_satiety"]
    },
    55: {
        "context_tags": [],
        "technique_tags": ["healthy_swaps", "portion_control"],
        "goal_tags": ["reduce_saturated_fat", "reduce_sodium"],
        "helps_with": ["mindless_eating", "snacking"]
    },
    56: {
        "context_tags": [],
        "technique_tags": ["healthy_swaps", "batch_cooking"],
        "goal_tags": ["lose_weight", "reduce_added_sugar", "reduce_saturated_fat", "reduce_ultra_processed_foods"],
        "helps_with": ["sugar_addiction", "sweet_cravings"]
    },
    57: {
        "context_tags": [],
        "technique_tags": ["portion_control", "coping_plans", "pre_commitment", "cognitive_reframing"],
        "goal_tags": ["lose_weight", "healthy_relationship_with_food"],
        "helps_with": ["binge_eating", "all_or_nothing_thinking", "cravings", "perfectionism"]
    },
    58: {
        "context_tags": [],
        "technique_tags": ["healthy_swaps", "portion_control"],
        "goal_tags": ["reduce_refined_carbs", "manage_cravings"],
        "helps_with": ["cravings"]
    },
    59: {
        "context_tags": [],
        "technique_tags": ["healthy_swaps", "choose_healthy_snacks", "temptation_bundling"],
        "goal_tags": ["reduce_added_sugar", "adequate_fiber"],
        "helps_with": ["sugar_addiction", "sweet_cravings"]
    },
    60: {
        "context_tags": ["heavy_workload", "caregiver_role"],
        "technique_tags": ["meal_prep", "batch_cooking", "increase_protein", "pre_commitment"],
        "goal_tags": ["adequate_protein", "budget_friendly_eating"],
        "helps_with": ["decision_fatigue", "time_pressure", "meal_planning_overwhelm"]
    },

    # Tips 61-70: Protein focus and healthy swaps
    61: {
        "context_tags": [],
        "technique_tags": ["protein_at_breakfast", "protein_first", "increase_protein", ],
        "goal_tags": ["lose_weight", "adequate_protein", "manage_cravings", "stable_blood_sugar"],
        "helps_with": ["mindless_eating", "sugar_addiction", "hunger", "energy_crashes", "afternoon_slump"]
    },
    62: {
        "context_tags": [],
        "technique_tags": ["healthy_swaps", "increase_protein"],
        "goal_tags": ["lose_weight", "reduce_saturated_fat", "adequate_protein", "reduce_ultra_processed_foods"],
        "helps_with": ["low_satiety"]
    },
    63: {
        "context_tags": [],
        "technique_tags": ["healthy_swaps", "increase_protein"],
        "goal_tags": ["lose_weight", "reduce_saturated_fat", "adequate_protein"],
        "helps_with": ["low_satiety"]
    },
    64: {
        "context_tags": [],
        "technique_tags": ["healthy_swaps", "increase_fiber", "choose_healthy_snacks"],
        "goal_tags": ["lose_weight", "reduce_saturated_fat", "adequate_fiber", "reduce_ultra_processed_foods"],
        "helps_with": ["mindless_eating", "snacking", "chip_cravings"]
    },
    65: {
        "context_tags": [],
        "technique_tags": ["healthy_swaps", "choose_healthy_snacks"],
        "goal_tags": ["lose_weight", "reduce_added_sugar", "reduce_saturated_fat", "reduce_ultra_processed_foods"],
        "helps_with": ["sugar_addiction", "sweet_cravings"]
    },
    66: {
        "context_tags": [],
        "technique_tags": ["healthy_swaps"],
        "goal_tags": ["lose_weight", "reduce_saturated_fat", "support_heart_health"],
        "helps_with": []
    },
    67: {
        "context_tags": [],
        "technique_tags": ["plate_method", "increase_vegetables", "portion_control", "veggie_first"],
        "goal_tags": ["lose_weight", "increase_nutrient_density", "improve_gut_health"],
        "helps_with": ["mindless_eating", "overeating", "portion_size_issues"]
    },
    68: {
        "context_tags": [],
        "technique_tags": ["environment_design", "habit_stacking", "evening_light_dim", "stimulus_control"],
        "goal_tags": ["lose_weight", "reduce_added_sugar", "manage_cravings"],
        "helps_with": ["mindless_eating", "late_night_eating", "evening_cravings", "sweet_cravings"]
    },
    69: {
        "context_tags": [],
        "technique_tags": ["cognitive_reframing", "mindfulness_meditation", "distraction"],
        "goal_tags": ["manage_cravings", "reduce_stress", "healthy_relationship_with_food"],
        "helps_with": ["stress_eating", "mindless_eating", "rumination", "emotional_eating"]
    },
    70: {
        "context_tags": [],
        "technique_tags": ["cognitive_reframing", "breathwork"],
        "goal_tags": ["reduce_stress", "improve_mood", "healthy_relationship_with_food"],
        "helps_with": ["stress_eating", "anxiety", "emotional_eating"]
    },

    # Tips 71-80: Emotional eating management
    71: {
        "context_tags": [],
        "technique_tags": ["reminder_cues", "mindful_eating", "self_monitoring", "stimulus_control"],
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "stress_eating", "emotional_eating", "boredom_eating"]
    },
    72: {
        "context_tags": [],
        "technique_tags": ["mindful_eating", "intuitive_eating"],
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "emotional_eating", "stress_eating"]
    },
    73: {
        "context_tags": ["anxiety_disorder"],
        "technique_tags": ["body_scan", "mindfulness_meditation"],
        "goal_tags": ["reduce_stress", "healthy_relationship_with_food", "reduce_anxiety"],
        "helps_with": ["stress_eating", "anxiety", "mindless_eating", "emotional_eating"]
    },
    74: {
        "context_tags": [],
        "technique_tags": ["mindful_eating", "slow_eating", "self_monitoring"],
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["portion_size_issues", "mindless_eating", "overeating"]
    },
    75: {
        "context_tags": [],
        "technique_tags": ["urge_surfing", "breathwork", "delay_tactics"],
        "goal_tags": ["manage_cravings", "reduce_stress"],
        "helps_with": ["stress_eating", "boredom_eating", "mindless_eating", "cravings", "impulse_orders"]
    },
    76: {
        "context_tags": [],
        "technique_tags": ["cognitive_reframing", "self_compassion_break"],
        "goal_tags": ["healthy_relationship_with_food", "reduce_stress"],
        "helps_with": ["stress_eating", "rumination", "emotional_eating", "perfectionism"]
    },
    77: {
        "context_tags": [],
        "technique_tags": ["self_monitoring", "habit_reflection"],
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "stress_eating", "emotional_eating"]
    },
    78: {
        "context_tags": [],
        "technique_tags": ["implementation_intentions", "coping_plans", "pre_commitment"],
        "goal_tags": ["consistent_routines", "reduce_stress"],
        "helps_with": ["stress_eating", "boredom_eating", "emotional_eating"]
    },
    79: {
        "context_tags": [],
        "technique_tags": ["movement_breaks", "distraction", "neat_boosting"],
        "goal_tags": ["improve_mood", "reduce_stress"],
        "helps_with": ["stress_eating", "anxiety", "emotional_eating", "boredom_eating"]
    },
    80: {
        "context_tags": [],
        "technique_tags": ["movement_breaks", "nature_time", "distraction", "mindfulness_meditation"],
        "goal_tags": ["improve_mood", "reduce_stress", "increase_steps"],
        "helps_with": ["stress_eating", "rumination", "emotional_eating", "anxiety"]
    },

    # Tips 81-90: Support systems and coping strategies
    81: {
        "context_tags": [],
        "technique_tags": ["accountability_partner", "body_doubling"],
        "goal_tags": ["healthy_relationship_with_food", "reduce_stress"],
        "helps_with": ["stress_eating", "boredom_eating", "emotional_eating", "lack_of_support"]
    },
    82: {
        "context_tags": [],
        "technique_tags": ["distraction", "environment_design"],
        "goal_tags": ["reduce_stress", "consistent_routines"],
        "helps_with": ["mindless_eating", "stress_eating", "boredom", "boredom_eating"]
    },
    83: {
        "context_tags": [],
        "technique_tags": ["distraction", "delay_tactics"],
        "goal_tags": ["manage_cravings", "reduce_stress"],
        "helps_with": ["stress_eating", "mindless_eating", "cravings", "sweet_cravings"]
    },
    84: {
        "context_tags": ["anxiety_disorder"],
        "technique_tags": ["breathwork", "progressive_muscle_relaxation"],
        "goal_tags": ["reduce_stress", "reduce_anxiety", "increase_calm"],
        "helps_with": ["anxiety", "stress_eating", "stress", "racing_mind"]
    },
    85: {
        "context_tags": [],
        "technique_tags": ["distraction", "body_scan"],
        "goal_tags": ["manage_cravings", "reduce_stress"],
        "helps_with": ["stress_eating", "rumination", "cravings", "anxiety"]
    },
    86: {
        "context_tags": [],
        "technique_tags": ["self_compassion_break", "breathwork"],
        "goal_tags": ["improve_mood", "reduce_stress", "increase_calm"],
        "helps_with": ["stress_eating", "stress", "anxiety", "emotional_eating"]
    },
    87: {
        "context_tags": [],
        "technique_tags": ["distraction", "self_compassion_break"],
        "goal_tags": ["improve_mood", "reduce_stress"],
        "helps_with": ["stress_eating", "emotional_eating", "boredom"]
    },
    88: {
        "context_tags": [],
        "technique_tags": ["daily_reset", "two_minute_pickup", "distraction", "declutter"],
        "goal_tags": ["organized_home", "reduce_stress"],
        "helps_with": ["stress_eating", "rumination", "clutter_overwhelm", "overwhelm"]
    },
    89: {
        "context_tags": [],
        "technique_tags": ["reminder_cues", "environment_design", "cue_removal", "stimulus_control"],
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "portion_size_issues", "snacking"]
    },
    90: {
        "context_tags": [],
        "technique_tags": ["portion_control", "mindful_eating", "environment_design"],
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "portion_size_issues", "overeating"]
    },

    # Tips 91-100: Environment and habit design
    91: {
        "context_tags": ["work_from_home"],
        "technique_tags": ["environment_design", "cue_removal", "stimulus_control"],
        "goal_tags": ["consistent_routines", "reduce_stress"],
        "helps_with": ["work_snacking", "mindless_eating", "stress_eating", "distractions"]
    },
    92: {
        "context_tags": [],
        "technique_tags": ["environment_design", "cue_removal"],
        "goal_tags": ["increase_nutrient_density", "consistent_routines"],
        "helps_with": ["mindless_eating", "cravings", "snacking"]
    },
    93: {
        "context_tags": [],
        "technique_tags": ["evening_light_dim", "habit_stacking", "wind_down_routine", "stimulus_control"],
        "goal_tags": ["manage_cravings", "reduce_stress", "improve_sleep"],
        "helps_with": ["evening_cravings", "mindless_eating", "late_night_eating"]
    },
    94: {
        "context_tags": [],
        "technique_tags": ["environment_design", "pre_commitment"],
        "goal_tags": ["increase_nutrient_density", "consistent_routines"],
        "helps_with": ["cravings", "impulse_orders", "random_cravings"]
    },
    95: {
        "context_tags": [],
        "technique_tags": ["environment_design", "cue_removal"],
        "goal_tags": ["manage_cravings", "consistent_routines"],
        "helps_with": ["mindless_eating", "portion_size_issues", "cravings", "snacking"]
    },
    96: {
        "context_tags": [],
        "technique_tags": ["meal_prep", "portion_control", "batch_cooking", "pre_commitment"],
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["portion_size_issues", "stress_eating", "mindless_eating", "snack_attacks"]
    },
    97: {
        "context_tags": [],
        "technique_tags": ["digital_cleanse", "cue_removal", "stimulus_control"],
        "goal_tags": ["reduce_stress", "consistent_routines", "budget_friendly_eating"],
        "helps_with": ["impulse_orders", "evening_cravings", "stress_eating", "budget_constraints"]
    },
    98: {
        "context_tags": [],
        "technique_tags": ["pre_commitment", "pre_commitment"],
        "goal_tags": ["consistent_routines", "manage_cravings"],
        "helps_with": ["cravings", "impulse_orders", "hunger"]
    },
    99: {
        "context_tags": [],
        "technique_tags": ["slow_eating", "mindful_eating"],
        "goal_tags": ["healthy_relationship_with_food", "increase_satiety"],
        "helps_with": ["mindless_eating", "portion_size_issues", "overeating"]
    },
    100: {
        "context_tags": [],
        "technique_tags": ["mindful_eating", "slow_eating"],
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating"]
    },

    # Tips 101-110: Advanced mindful eating techniques
    101: {
        "context_tags": [],
        "technique_tags": ["mindful_eating", "self_monitoring", "portion_control"],
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["portion_size_issues", "mindless_eating", "overeating"]
    },
    102: {
        "context_tags": [],
        "technique_tags": ["slow_eating", "mindful_eating"],
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "overeating"]
    },
    103: {
        "context_tags": [],
        "technique_tags": ["mindful_eating", "slow_eating"],
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "portion_size_issues"]
    },
    104: {
        "context_tags": [],
        "technique_tags": ["healthy_swaps", "environment_design", "choose_healthy_snacks"],
        "goal_tags": ["manage_cravings", "increase_nutrient_density"],
        "helps_with": ["stress_eating", "mindless_eating", "chip_cravings", "salty_cravings"]
    },
    105: {
        "context_tags": [],
        "technique_tags": ["mindful_eating", "slow_eating", "breathwork"],
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating"]
    },
    106: {
        "context_tags": [],
        "technique_tags": ["slow_eating", "mindful_eating", "portion_control"],
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["portion_size_issues", "mindless_eating", "overeating"]
    },
    107: {
        "context_tags": [],
        "technique_tags": ["mindful_eating", "slow_eating"],
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating"]
    },
    108: {
        "context_tags": [],
        "technique_tags": ["evening_light_dim", "habit_stacking", "cue_removal", "stimulus_control"],
        "goal_tags": ["manage_cravings", "increase_satiety"],
        "helps_with": ["evening_cravings", "mindless_eating", "late_night_eating", "sweet_cravings"]
    },
    109: {
        "context_tags": [],
        "technique_tags": ["hydration_first", "delay_tactics", "reminder_cues"],
        "goal_tags": ["stay_hydrated", "manage_cravings"],
        "helps_with": ["cravings", "mindless_eating", "dehydration", "hunger"]
    },
    110: {
        "context_tags": [],
        "technique_tags": ["protein_first", "mindful_eating", "low_glycemic_pairing"],
        "goal_tags": ["manage_cravings", "healthy_relationship_with_food", "maintain_stable_blood_sugar"],
        "helps_with": ["portion_size_issues", "cravings", "blood_sugar_spikes"]
    },

    # Tips 111-118: Gut health and mood optimization
    111: {
        "context_tags": [],
        "technique_tags": ["veggie_first", "increase_vegetables", "fiber_first"],
        "goal_tags": ["increase_nutrient_density", "improve_gut_health", "increase_satiety"],
        "helps_with": ["mindless_eating", "portion_size_issues", "overeating", "low_satiety"]
    },
    112: {
        "context_tags": [],
        "technique_tags": ["choose_healthy_snacks", "pre_commitment"],
        "goal_tags": ["improve_mood", "manage_cravings", "improve_gut_health", "adequate_omega_3"],
        "helps_with": ["stress_eating", "anxiety", "emotional_eating", "depression"]
    },
    113: {
        "context_tags": [],
        "technique_tags": ["choose_healthy_snacks", "habit_stacking"],
        "goal_tags": ["improve_gut_health", "improve_mood"],
        "helps_with": ["stress_eating", "emotional_eating", "bloating"]
    },
    114: {
        "context_tags": [],
        "technique_tags": ["wind_down_routine", "evening_light_dim", "relaxing_audio"],
        "goal_tags": ["manage_cravings", "improve_sleep", "increase_calm"],
        "helps_with": ["evening_cravings", "stress_eating", "late_night_eating", "insomnia"]
    },
    115: {
        "context_tags": ["shift_work"],
        "technique_tags": ["sleep_hygiene", "evening_light_dim", "wind_down_routine", "consistent_wake_time", "light_management"],
        "goal_tags": ["improve_sleep", "manage_cravings", "consistent_sleep_schedule"],
        "helps_with": ["cravings", "evening_cravings", "poor_sleep", "insomnia", "delayed_sleep_phase"]
    },
    116: {
        "context_tags": [],
        "technique_tags": ["portion_control", "slow_eating", "mindful_eating"],
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "portion_size_issues", "overeating", "snack_attacks"]
    },
    117: {
        "context_tags": [],
        "technique_tags": ["healthy_swaps", "evening_light_dim", "wind_down_routine"],
        "goal_tags": ["manage_cravings", "reduce_stress", "increase_calm"],
        "helps_with": ["evening_cravings", "stress_eating", "late_night_eating"]
    },
    118: {
        "context_tags": ["depression", "anxiety_disorder"],
        "technique_tags": ["nature_time", "light_management", "breathwork"],
        "goal_tags": ["improve_mood", "improve_sleep", "reduce_stress"],
        "helps_with": ["stress_eating", "anxiety", "emotional_eating", "poor_sleep", "low_energy", "depression"]
    }
}

# Read the file
with open('/Users/nataliemichelson/Projects/habithelper/TIPS_FULLY_UPDATED.md', 'r') as f:
    content = f.read()

# Process and update all tags
lines = content.split('\n')
output_lines = []
current_tip = 0
i = 0

while i < len(lines):
    line = lines[i]
    
    # Check if this is a tip header
    if line.startswith('## Tip '):
        try:
            current_tip = int(line.split('## Tip ')[1].strip())
        except:
            pass
    
    # Replace Goal Tags line
    if line.startswith('**Goal Tags:**') and current_tip in tip_comprehensive_tags:
        output_lines.append(f"**Goal Tags:** {', '.join(tip_comprehensive_tags[current_tip]['goal_tags'])}")
        i += 1
        continue
    
    # Replace Helps With line
    if line.startswith('**Helps With:**') and current_tip in tip_comprehensive_tags:
        if tip_comprehensive_tags[current_tip]['helps_with']:
            output_lines.append(f"**Helps With:** {', '.join(tip_comprehensive_tags[current_tip]['helps_with'])}")
        else:
            output_lines.append("**Helps With:** ")
        i += 1
        continue
    
    # Replace Context Tags line
    if line.startswith('**Context Tags:**') and current_tip in tip_comprehensive_tags:
        if tip_comprehensive_tags[current_tip]['context_tags']:
            output_lines.append(f"**Context Tags:** {', '.join(tip_comprehensive_tags[current_tip]['context_tags'])}")
        i += 1
        continue
    
    # Replace Technique Tags line
    if line.startswith('**Technique Tags:**') and current_tip in tip_comprehensive_tags:
        output_lines.append(f"**Technique Tags:** {', '.join(tip_comprehensive_tags[current_tip]['technique_tags'])}")
        i += 1
        continue
    
    # Add missing Context Tags after Helps With if not present
    if line.startswith('**Helps With:**') and current_tip in tip_comprehensive_tags:
        output_lines.append(line)
        # Check if next line is Context Tags
        if i + 1 < len(lines) and not lines[i + 1].startswith('**Context Tags:**'):
            output_lines.append("")
            if tip_comprehensive_tags[current_tip]['context_tags']:
                output_lines.append(f"**Context Tags:** {', '.join(tip_comprehensive_tags[current_tip]['context_tags'])}")
        i += 1
        continue
    
    output_lines.append(line)
    i += 1

# Write the final comprehensive update
updated_content = '\n'.join(output_lines)

with open('/Users/nataliemichelson/Projects/habithelper/TIPS_FINAL_COMPREHENSIVE.md', 'w') as f:
    f.write(updated_content)

print(f"Successfully created comprehensive tag review for {len(tip_comprehensive_tags)} tips")
print(f"Output saved to TIPS_FINAL_COMPREHENSIVE.md")

# Analyze comprehensive tag usage
context_count = {}
technique_count = {}
goal_count = {}
helps_count = {}

for tip_data in tip_comprehensive_tags.values():
    for tag in tip_data["context_tags"]:
        context_count[tag] = context_count.get(tag, 0) + 1
    for tag in tip_data["technique_tags"]:
        technique_count[tag] = technique_count.get(tag, 0) + 1
    for tag in tip_data["goal_tags"]:
        goal_count[tag] = goal_count.get(tag, 0) + 1
    for tag in tip_data["helps_with"]:
        helps_count[tag] = helps_count.get(tag, 0) + 1

print("\n=== Top Context Tags ===")
for tag, count in sorted(context_count.items(), key=lambda x: -x[1])[:10]:
    print(f"{tag}: {count} tips")

print("\n=== Top Technique Tags ===")
for tag, count in sorted(technique_count.items(), key=lambda x: -x[1])[:15]:
    print(f"{tag}: {count} tips")

print("\n=== Top Goal Tags ===")
for tag, count in sorted(goal_count.items(), key=lambda x: -x[1])[:10]:
    print(f"{tag}: {count} tips")

print("\n=== Top Helps With Tags ===")
for tag, count in sorted(helps_count.items(), key=lambda x: -x[1])[:10]:
    print(f"{tag}: {count} tips")

# Validation check
print("\n=== Validation Check ===")
invalid_context = []
invalid_technique = []
invalid_goals = []
invalid_helps = []

for tip_num, tip_data in tip_comprehensive_tags.items():
    for tag in tip_data["context_tags"]:
        if tag not in context_tags:
            invalid_context.append(f"Tip {tip_num}: '{tag}'")
    for tag in tip_data["technique_tags"]:
        if tag not in technique_tags:
            invalid_technique.append(f"Tip {tip_num}: '{tag}'")
    for tag in tip_data["goal_tags"]:
        if tag not in goal_tags:
            invalid_goals.append(f"Tip {tip_num}: '{tag}'")
    for tag in tip_data["helps_with"]:
        if tag not in helps_with_tags:
            invalid_helps.append(f"Tip {tip_num}: '{tag}'")

if invalid_context:
    print("Invalid context tags found:")
    for item in invalid_context[:5]:
        print(f"  {item}")
else:
    print("✓ All context tags are valid")

if invalid_technique:
    print("Invalid technique tags found:")
    for item in invalid_technique[:5]:
        print(f"  {item}")
else:
    print("✓ All technique tags are valid")

if invalid_goals:
    print("Invalid goal tags found:")
    for item in invalid_goals[:5]:
        print(f"  {item}")
else:
    print("✓ All goal tags are valid")

if invalid_helps:
    print("Invalid helps_with tags found:")
    for item in invalid_helps[:5]:
        print(f"  {item}")
else:
    print("✓ All helps_with tags are valid")