#!/usr/bin/env python3
import json
import re

# Load the available tags
with open('/Users/nataliemichelson/Projects/habithelper/newFiles/tags_with_descriptions.json', 'r') as f:
    all_tags = json.load(f)

# Create lookup dictionaries
goal_tags = {tag['key']: tag['description'] for tag in all_tags if tag['bucket'] == 'goal'}
helps_with_tags = {tag['key']: tag['description'] for tag in all_tags if tag['bucket'] == 'helps_with'}

# Define updated tags for each tip based on careful content review
tip_updates = {
    1: {
        "goal_tags": ["healthy_pregnancy", "reduce_anxiety", "stay_hydrated"],
        "helps_with": ["nausea", "vomiting", "odor_triggers", "smell_aversion"]
    },
    2: {
        "goal_tags": ["healthy_pregnancy", "reduce_anxiety", "stay_hydrated"],
        "helps_with": ["nausea", "vomiting", "dehydration"]
    },
    3: {
        "goal_tags": ["healthy_pregnancy", "reduce_anxiety", "stay_hydrated"],
        "helps_with": ["nausea", "dehydration", "vomiting"]
    },
    4: {
        "goal_tags": ["healthy_pregnancy", "reduce_anxiety"],
        "helps_with": ["nausea", "smell_aversion", "odor_triggers", "heartburn"]
    },
    5: {
        "goal_tags": ["healthy_pregnancy", "stay_hydrated", "reduce_anxiety"],
        "helps_with": ["dehydration", "nausea"]
    },
    6: {
        "goal_tags": ["healthy_pregnancy", "reduce_anxiety", "consistent_routines"],
        "helps_with": ["nausea", "nausea_from_empty_stomach", "low_morning_energy"]
    },
    7: {
        "goal_tags": ["healthy_pregnancy", "reduce_anxiety", "improve_energy", "maintain_stable_blood_sugar"],
        "helps_with": ["nausea", "overnight_hunger", "nausea_from_empty_stomach", "blood_sugar_spikes"]
    },
    8: {
        "goal_tags": ["healthy_pregnancy", "adequate_fiber", "improve_gut_health"],
        "helps_with": ["constipation", "bloating"]
    },
    9: {
        "goal_tags": ["healthy_pregnancy", "adequate_fiber", "adequate_omega_3", "improve_gut_health"],
        "helps_with": ["constipation", "low_satiety", "bloating"]
    },
    10: {
        "goal_tags": ["healthy_pregnancy", "adequate_fiber", "improve_gut_health"],
        "helps_with": ["constipation"]
    },
    11: {
        "goal_tags": ["healthy_pregnancy", "stay_hydrated", "improve_gut_health", "consistent_routines"],
        "helps_with": ["constipation", "nausea", "dehydration"]
    },
    12: {
        "goal_tags": ["healthy_pregnancy", "improve_gut_health", "improve_energy", "increase_steps"],
        "helps_with": ["constipation", "bloating", "heartburn", "indigestion"]
    },
    13: {
        "goal_tags": ["healthy_pregnancy"],
        "helps_with": ["heartburn", "reflux", "indigestion"]
    },
    14: {
        "goal_tags": ["healthy_pregnancy", "stay_hydrated"],
        "helps_with": ["heartburn", "reflux"]
    },
    15: {
        "goal_tags": ["healthy_pregnancy", "stay_hydrated"],
        "helps_with": ["heartburn", "reflux"]
    },
    16: {
        "goal_tags": ["healthy_pregnancy"],
        "helps_with": ["heartburn", "indigestion", "reflux"]
    },
    17: {
        "goal_tags": ["healthy_pregnancy", "ensure_food_safety", "manage_cravings"],
        "helps_with": ["cravings", "food_safety_anxiety"]
    },
    18: {
        "goal_tags": ["healthy_pregnancy", "alcohol_free", "reduce_added_sugar"],
        "helps_with": ["social_pressure", "evening_cravings", "sweet_cravings"]
    },
    19: {
        "goal_tags": ["healthy_pregnancy", "ensure_food_safety", "manage_cravings"],
        "helps_with": ["food_safety_anxiety", "cravings"]
    },
    20: {
        "goal_tags": ["healthy_pregnancy", "ensure_food_safety", "manage_cravings"],
        "helps_with": ["sweet_cravings", "food_safety_anxiety", "cravings"]
    },
    21: {
        "goal_tags": ["healthy_pregnancy", "reduce_caffeine", "improve_sleep"],
        "helps_with": ["jitters", "poor_sleep", "caffeine_dependence"]
    },
    22: {
        "goal_tags": ["healthy_pregnancy", "reduce_anxiety", "adequate_vitamins"],
        "helps_with": ["nausea", "vomiting"]
    },
    23: {
        "goal_tags": ["healthy_pregnancy", "reduce_anxiety", "increase_nutrient_density", "healthy_relationship_with_food"],
        "helps_with": ["nausea", "smell_aversion", "perfectionism", "food_anxiety"]
    },
    24: {
        "goal_tags": ["healthy_pregnancy", "adequate_fiber", "adequate_folate", "adequate_iron"],
        "helps_with": ["constipation", "anemia_risk"]
    },
    25: {
        "goal_tags": ["healthy_pregnancy", "adequate_folate", "adequate_fiber", "adequate_protein"],
        "helps_with": ["constipation", "low_energy"]
    },
    26: {
        "goal_tags": ["healthy_pregnancy", "adequate_fiber", "increase_nutrient_density"],
        "helps_with": ["constipation"]
    },
    27: {
        "goal_tags": ["healthy_pregnancy", "adequate_protein", "adequate_choline", "increase_satiety"],
        "helps_with": ["low_satiety", "low_morning_energy", "hunger"]
    },
    28: {
        "goal_tags": ["healthy_pregnancy", "adequate_choline"],
        "helps_with": ["sweet_cravings"]
    },
    29: {
        "goal_tags": ["healthy_pregnancy", "adequate_protein", "adequate_calcium"],
        "helps_with": ["nausea_aversion_to_meat"]
    },
    30: {
        "goal_tags": ["healthy_pregnancy", "adequate_protein", "increase_satiety"],
        "helps_with": ["energy_crashes", "hunger"]
    },
    31: {
        "goal_tags": ["healthy_pregnancy", "adequate_protein", "increase_satiety"],
        "helps_with": ["hunger", "low_satiety"]
    },
    32: {
        "goal_tags": ["healthy_pregnancy", "adequate_protein", "adequate_iron", "adequate_folate"],
        "helps_with": ["anemia_risk", "snack_attacks"]
    },
    33: {
        "goal_tags": ["healthy_pregnancy", "adequate_iron", "adequate_fiber"],
        "helps_with": ["anemia_risk", "constipation"]
    },
    34: {
        "goal_tags": ["healthy_pregnancy", "adequate_iron"],
        "helps_with": ["anemia_risk"]
    },
    35: {
        "goal_tags": ["healthy_pregnancy", "adequate_iron"],
        "helps_with": ["anemia_risk"]
    },
    36: {
        "goal_tags": ["healthy_pregnancy", "adequate_iodine"],
        "helps_with": ["chip_cravings", "salty_cravings"]
    },
    37: {
        "goal_tags": ["healthy_pregnancy", "adequate_iodine", "adequate_omega_3", "adequate_protein"],
        "helps_with": ["cravings"]
    },
    38: {
        "goal_tags": ["healthy_pregnancy", "adequate_folate"],
        "helps_with": ["low_morning_energy"]
    },
    39: {
        "goal_tags": ["healthy_pregnancy", "adequate_fiber"],
        "helps_with": ["sweet_cravings", "constipation"]
    },
    40: {
        "goal_tags": ["healthy_pregnancy", "adequate_fiber"],
        "helps_with": ["constipation", "sweet_cravings"]
    },
    41: {
        "goal_tags": ["healthy_pregnancy", "maintain_stable_blood_sugar", "reduce_ultra_processed_foods"],
        "helps_with": ["random_cravings", "energy_crashes", "nausea_from_empty_stomach", "hunger"]
    },
    42: {
        "goal_tags": ["healthy_pregnancy", "consistent_routines", "budget_friendly_eating"],
        "helps_with": ["decision_fatigue", "low_energy", "budget_constraints"]
    },
    43: {
        "goal_tags": ["healthy_pregnancy", "stay_hydrated", "increase_nutrient_density", "adequate_protein"],
        "helps_with": ["inconsistency", "forgetfulness"]
    },
    44: {
        "goal_tags": ["healthy_pregnancy", "increase_nutrient_density", "adequate_fiber"],
        "helps_with": ["constipation", "snacking", "time_pressure"]
    },
    45: {
        "goal_tags": ["healthy_pregnancy", "consistent_routines", "increase_nutrient_density"],
        "helps_with": ["low_motivation", "lack_of_support", "inconsistency"]
    },
    46: {
        "goal_tags": ["healthy_pregnancy", "reduce_anxiety"],
        "helps_with": ["nausea_triggers", "reflux", "heartburn"]
    },
    47: {
        "goal_tags": ["healthy_pregnancy", "manage_cravings", "reduce_ultra_processed_foods"],
        "helps_with": ["sweet_cravings", "salty_cravings", "binge_eating", "cravings"]
    },
    48: {
        "goal_tags": ["healthy_pregnancy", "adequate_omega_3", "adequate_choline"],
        "helps_with": []
    },
    49: {
        "goal_tags": ["healthy_pregnancy", "consistent_routines", "increase_nutrient_density"],
        "helps_with": ["decision_fatigue", "smell_aversion", "low_energy"]
    },
    50: {
        "goal_tags": ["lose_weight", "increase_satiety"],
        "helps_with": ["mindless_eating", "overeating", "portion_size_issues"]
    },
    51: {
        "goal_tags": ["lose_weight", "reduce_ultra_processed_foods"],
        "helps_with": ["mindless_eating", "sugar_addiction", "snacking"]
    },
    52: {
        "goal_tags": ["lose_weight", "increase_satiety"],
        "helps_with": ["overeating", "portion_size_issues"]
    },
    53: {
        "goal_tags": ["stay_hydrated", "manage_cravings", "improve_energy"],
        "helps_with": ["mindless_eating", "low_energy", "dehydration", "cravings"]
    },
    54: {
        "goal_tags": ["increase_nutrient_density", "adequate_fiber"],
        "helps_with": []
    },
    55: {
        "goal_tags": ["reduce_saturated_fat", "reduce_sodium"],
        "helps_with": ["mindless_eating", "snacking"]
    },
    56: {
        "goal_tags": ["lose_weight", "reduce_added_sugar", "reduce_saturated_fat", "reduce_ultra_processed_foods"],
        "helps_with": ["sugar_addiction", "sweet_cravings"]
    },
    57: {
        "goal_tags": ["lose_weight", "healthy_relationship_with_food"],
        "helps_with": ["binge_eating", "all_or_nothing_thinking", "cravings"]
    },
    58: {
        "goal_tags": ["reduce_refined_carbs", "manage_cravings"],
        "helps_with": ["cravings"]
    },
    59: {
        "goal_tags": ["reduce_added_sugar", "adequate_fiber"],
        "helps_with": ["sugar_addiction", "sweet_cravings"]
    },
    60: {
        "goal_tags": ["adequate_protein", "budget_friendly_eating"],
        "helps_with": ["decision_fatigue", "time_pressure", "meal_planning_overwhelm"]
    },
    61: {
        "goal_tags": ["lose_weight", "adequate_protein", "manage_cravings", "improve_energy"],
        "helps_with": ["mindless_eating", "sugar_addiction", "hunger", "energy_crashes"]
    },
    62: {
        "goal_tags": ["lose_weight", "reduce_saturated_fat", "adequate_protein", "reduce_ultra_processed_foods"],
        "helps_with": []
    },
    63: {
        "goal_tags": ["lose_weight", "reduce_saturated_fat", "adequate_protein"],
        "helps_with": []
    },
    64: {
        "goal_tags": ["lose_weight", "reduce_saturated_fat", "adequate_fiber", "reduce_ultra_processed_foods"],
        "helps_with": ["mindless_eating", "snacking"]
    },
    65: {
        "goal_tags": ["lose_weight", "reduce_added_sugar", "reduce_saturated_fat", "reduce_ultra_processed_foods"],
        "helps_with": ["sugar_addiction", "sweet_cravings"]
    },
    66: {
        "goal_tags": ["lose_weight", "reduce_saturated_fat", "support_heart_health"],
        "helps_with": []
    },
    67: {
        "goal_tags": ["lose_weight", "increase_nutrient_density", "improve_gut_health"],
        "helps_with": ["mindless_eating", "overeating", "portion_size_issues"]
    },
    68: {
        "goal_tags": ["lose_weight", "reduce_added_sugar", "manage_cravings"],
        "helps_with": ["mindless_eating", "late_night_eating", "evening_cravings"]
    },
    69: {
        "goal_tags": ["manage_cravings", "reduce_stress", "healthy_relationship_with_food"],
        "helps_with": ["stress_eating", "mindless_eating", "rumination", "emotional_eating"]
    },
    70: {
        "goal_tags": ["reduce_stress", "improve_mood", "healthy_relationship_with_food"],
        "helps_with": ["stress_eating", "anxiety", "emotional_eating"]
    },
    71: {
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "stress_eating", "emotional_eating"]
    },
    72: {
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "emotional_eating"]
    },
    73: {
        "goal_tags": ["reduce_stress", "healthy_relationship_with_food"],
        "helps_with": ["stress_eating", "anxiety", "mindless_eating", "emotional_eating"]
    },
    74: {
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["portion_size_issues", "mindless_eating", "overeating"]
    },
    75: {
        "goal_tags": ["manage_cravings", "reduce_stress"],
        "helps_with": ["stress_eating", "boredom_eating", "mindless_eating", "cravings"]
    },
    76: {
        "goal_tags": ["healthy_relationship_with_food", "reduce_stress"],
        "helps_with": ["stress_eating", "rumination", "emotional_eating"]
    },
    77: {
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "stress_eating", "emotional_eating"]
    },
    78: {
        "goal_tags": ["consistent_routines", "reduce_stress"],
        "helps_with": ["stress_eating", "boredom_eating", "emotional_eating"]
    },
    79: {
        "goal_tags": ["improve_mood", "reduce_stress"],
        "helps_with": ["stress_eating", "anxiety", "emotional_eating"]
    },
    80: {
        "goal_tags": ["improve_mood", "reduce_stress", "increase_steps"],
        "helps_with": ["stress_eating", "rumination", "emotional_eating"]
    },
    81: {
        "goal_tags": ["healthy_relationship_with_food", "reduce_stress"],
        "helps_with": ["stress_eating", "boredom_eating", "emotional_eating"]
    },
    82: {
        "goal_tags": ["reduce_stress", "consistent_routines"],
        "helps_with": ["mindless_eating", "stress_eating", "boredom"]
    },
    83: {
        "goal_tags": ["manage_cravings", "reduce_stress"],
        "helps_with": ["stress_eating", "mindless_eating", "cravings"]
    },
    84: {
        "goal_tags": ["reduce_stress", "reduce_anxiety", "increase_calm"],
        "helps_with": ["anxiety", "stress_eating", "stress"]
    },
    85: {
        "goal_tags": ["manage_cravings", "reduce_stress"],
        "helps_with": ["stress_eating", "rumination", "cravings"]
    },
    86: {
        "goal_tags": ["improve_mood", "reduce_stress", "increase_calm"],
        "helps_with": ["stress_eating", "stress", "anxiety"]
    },
    87: {
        "goal_tags": ["improve_mood", "reduce_stress"],
        "helps_with": ["stress_eating", "emotional_eating"]
    },
    88: {
        "goal_tags": ["organized_home", "reduce_stress"],
        "helps_with": ["stress_eating", "rumination", "clutter_overwhelm"]
    },
    89: {
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "portion_size_issues"]
    },
    90: {
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "portion_size_issues", "overeating"]
    },
    91: {
        "goal_tags": ["consistent_routines", "reduce_stress"],
        "helps_with": ["work_snacking", "mindless_eating", "stress_eating"]
    },
    92: {
        "goal_tags": ["increase_nutrient_density", "consistent_routines"],
        "helps_with": ["mindless_eating", "cravings"]
    },
    93: {
        "goal_tags": ["manage_cravings", "reduce_stress"],
        "helps_with": ["evening_cravings", "mindless_eating", "late_night_eating"]
    },
    94: {
        "goal_tags": ["increase_nutrient_density", "consistent_routines"],
        "helps_with": ["cravings", "impulse_orders"]
    },
    95: {
        "goal_tags": ["manage_cravings", "consistent_routines"],
        "helps_with": ["mindless_eating", "portion_size_issues", "cravings"]
    },
    96: {
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["portion_size_issues", "stress_eating", "mindless_eating"]
    },
    97: {
        "goal_tags": ["reduce_stress", "consistent_routines", "budget_friendly_eating"],
        "helps_with": ["impulse_orders", "evening_cravings", "stress_eating"]
    },
    98: {
        "goal_tags": ["consistent_routines", "manage_cravings"],
        "helps_with": ["cravings", "impulse_orders"]
    },
    99: {
        "goal_tags": ["healthy_relationship_with_food", "increase_satiety"],
        "helps_with": ["mindless_eating", "portion_size_issues", "overeating"]
    },
    100: {
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating"]
    },
    101: {
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["portion_size_issues", "mindless_eating", "overeating"]
    },
    102: {
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "overeating"]
    },
    103: {
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "portion_size_issues"]
    },
    104: {
        "goal_tags": ["manage_cravings", "increase_nutrient_density"],
        "helps_with": ["stress_eating", "mindless_eating", "chip_cravings", "salty_cravings"]
    },
    105: {
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating"]
    },
    106: {
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["portion_size_issues", "mindless_eating", "overeating"]
    },
    107: {
        "goal_tags": ["healthy_relationship_with_food"],
        "helps_with": ["mindless_eating"]
    },
    108: {
        "goal_tags": ["manage_cravings", "increase_satiety"],
        "helps_with": ["evening_cravings", "mindless_eating", "late_night_eating"]
    },
    109: {
        "goal_tags": ["stay_hydrated", "manage_cravings"],
        "helps_with": ["cravings", "mindless_eating", "dehydration"]
    },
    110: {
        "goal_tags": ["manage_cravings", "healthy_relationship_with_food", "maintain_stable_blood_sugar"],
        "helps_with": ["portion_size_issues", "cravings", "blood_sugar_spikes"]
    },
    111: {
        "goal_tags": ["increase_nutrient_density", "improve_gut_health", "increase_satiety"],
        "helps_with": ["mindless_eating", "portion_size_issues", "overeating"]
    },
    112: {
        "goal_tags": ["improve_mood", "manage_cravings", "improve_gut_health", "adequate_omega_3"],
        "helps_with": ["stress_eating", "anxiety", "emotional_eating"]
    },
    113: {
        "goal_tags": ["improve_gut_health", "improve_mood"],
        "helps_with": ["stress_eating", "emotional_eating"]
    },
    114: {
        "goal_tags": ["manage_cravings", "improve_sleep", "increase_calm"],
        "helps_with": ["evening_cravings", "stress_eating", "late_night_eating"]
    },
    115: {
        "goal_tags": ["improve_sleep", "manage_cravings", "consistent_sleep_schedule"],
        "helps_with": ["cravings", "evening_cravings", "poor_sleep"]
    },
    116: {
        "goal_tags": ["increase_satiety", "healthy_relationship_with_food"],
        "helps_with": ["mindless_eating", "portion_size_issues", "overeating"]
    },
    117: {
        "goal_tags": ["manage_cravings", "reduce_stress", "increase_calm"],
        "helps_with": ["evening_cravings", "stress_eating", "late_night_eating"]
    },
    118: {
        "goal_tags": ["improve_mood", "improve_sleep", "reduce_stress"],
        "helps_with": ["stress_eating", "anxiety", "emotional_eating", "poor_sleep"]
    }
}

# Read the TIPS_WITH_TAGS.md file
with open('/Users/nataliemichelson/Projects/habithelper/TIPS_WITH_TAGS.md', 'r') as f:
    content = f.read()

# Process each tip
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
    if line.startswith('**Goal Tags:**') and current_tip in tip_updates:
        output_lines.append(f"**Goal Tags:** {', '.join(tip_updates[current_tip]['goal_tags'])}")
        i += 1
        continue
    
    # Replace Helps With line
    if line.startswith('**Helps With:**') and current_tip in tip_updates:
        if tip_updates[current_tip]['helps_with']:
            output_lines.append(f"**Helps With:** {', '.join(tip_updates[current_tip]['helps_with'])}")
        else:
            output_lines.append("**Helps With:** ")
        i += 1
        continue
    
    output_lines.append(line)
    i += 1

# Write the updated content
updated_content = '\n'.join(output_lines)

with open('/Users/nataliemichelson/Projects/habithelper/TIPS_FULLY_UPDATED.md', 'w') as f:
    f.write(updated_content)

print(f"Successfully updated helps_with and goal tags for {len(tip_updates)} tips")
print(f"Output saved to TIPS_FULLY_UPDATED.md")

# Analyze tag usage
goal_count = {}
helps_count = {}

for tip_data in tip_updates.values():
    for tag in tip_data["goal_tags"]:
        goal_count[tag] = goal_count.get(tag, 0) + 1
    for tag in tip_data["helps_with"]:
        helps_count[tag] = helps_count.get(tag, 0) + 1

print("\n=== Top Goal Tags Used ===")
for tag, count in sorted(goal_count.items(), key=lambda x: -x[1])[:15]:
    print(f"{tag}: {count} tips")

print("\n=== Top Helps With Tags Used ===")
for tag, count in sorted(helps_count.items(), key=lambda x: -x[1])[:15]:
    print(f"{tag}: {count} tips")

# Check for any invalid tags
print("\n=== Validation Check ===")
invalid_goals = []
invalid_helps = []

for tip_num, tip_data in tip_updates.items():
    for tag in tip_data["goal_tags"]:
        if tag not in goal_tags:
            invalid_goals.append(f"Tip {tip_num}: '{tag}'")
    for tag in tip_data["helps_with"]:
        if tag not in helps_with_tags:
            invalid_helps.append(f"Tip {tip_num}: '{tag}'")

if invalid_goals:
    print("Invalid goal tags found:")
    for item in invalid_goals:
        print(f"  {item}")
else:
    print("✓ All goal tags are valid")

if invalid_helps:
    print("Invalid helps_with tags found:")
    for item in invalid_helps:
        print(f"  {item}")
else:
    print("✓ All helps_with tags are valid")