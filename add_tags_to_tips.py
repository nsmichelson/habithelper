#!/usr/bin/env python3
import json
import re

# Define tag mappings for each tip based on content analysis
tip_tags = {
    # Tips 1-10: Pregnancy nausea and digestive issues
    1: {"context_tags": ["pregnancy"], "technique_tags": ["environment_design", "planning_ahead", "choose_healthy_snacks"]},
    2: {"context_tags": ["pregnancy"], "technique_tags": ["batch_cooking", "planning_ahead", "meal_prep"]},
    3: {"context_tags": ["pregnancy"], "technique_tags": ["batch_cooking", "hydration_first", "meal_prep"]},
    4: {"context_tags": ["pregnancy"], "technique_tags": ["distraction", "environment_design"]},
    5: {"context_tags": ["pregnancy"], "technique_tags": ["healthy_swaps", "hydration_first"]},
    6: {"context_tags": ["pregnancy"], "technique_tags": ["environment_design", "planning_ahead", "habit_stacking"]},
    7: {"context_tags": ["pregnancy"], "technique_tags": ["timing_meals", "planning_ahead", "protein_first"]},
    8: {"context_tags": ["pregnancy"], "technique_tags": ["choose_healthy_snacks", "fiber_first", "increase_fiber"]},
    9: {"context_tags": ["pregnancy"], "technique_tags": ["stealth_health", "fiber_first", "habit_stacking", "increase_fiber"]},
    10: {"context_tags": ["pregnancy"], "technique_tags": ["choose_healthy_snacks", "fiber_first", "increase_fiber"]},
    
    # Tips 11-20: More pregnancy digestive and food safety
    11: {"context_tags": ["pregnancy"], "technique_tags": ["hydration_first", "morning_routine"]},
    12: {"context_tags": ["pregnancy"], "technique_tags": ["walk_after_meals", "movement_breaks"]},
    13: {"context_tags": ["pregnancy"], "technique_tags": ["distraction", "choose_healthy_snacks"]},
    14: {"context_tags": ["pregnancy"], "technique_tags": ["healthy_swaps", "hydration_first"]},
    15: {"context_tags": ["pregnancy"], "technique_tags": ["hydration_first"]},
    16: {"context_tags": ["pregnancy"], "technique_tags": ["healthy_swaps"]},
    17: {"context_tags": ["pregnancy", "food_allergies"], "technique_tags": ["healthy_swaps", "coping_plans"]},
    18: {"context_tags": ["pregnancy"], "technique_tags": ["healthy_swaps", "environment_design"]},
    19: {"context_tags": ["pregnancy", "food_allergies"], "technique_tags": ["coping_plans", "planning_ahead"]},
    20: {"context_tags": ["pregnancy"], "technique_tags": ["healthy_swaps", "pre_commitment"]},
    
    # Tips 21-30: Pregnancy nutrition management
    21: {"context_tags": ["pregnancy"], "technique_tags": ["healthy_swaps", "caffeine_cutoff"]},
    22: {"context_tags": ["pregnancy"], "technique_tags": ["coping_plans", "healthy_swaps"]},
    23: {"context_tags": ["pregnancy"], "technique_tags": ["intuitive_eating", "coping_plans"]},
    24: {"context_tags": ["pregnancy"], "technique_tags": ["stealth_health", "increase_vegetables", "increase_fiber"]},
    25: {"context_tags": ["pregnancy"], "technique_tags": ["stealth_health", "increase_vegetables", "increase_fiber"]},
    26: {"context_tags": ["pregnancy"], "technique_tags": ["stealth_health", "increase_vegetables", "increase_fiber"]},
    27: {"context_tags": ["pregnancy"], "technique_tags": ["stealth_health", "increase_protein", "protein_first"]},
    28: {"context_tags": ["pregnancy"], "technique_tags": ["meal_prep", "planning_ahead"]},
    29: {"context_tags": ["pregnancy", "lactose_intolerance"], "technique_tags": ["healthy_swaps", "increase_protein"]},
    30: {"context_tags": ["pregnancy"], "technique_tags": ["healthy_swaps", "increase_protein"]},
    
    # Tips 31-40: More pregnancy nutrition
    31: {"context_tags": ["pregnancy"], "technique_tags": ["increase_protein", "protein_first", "habit_stacking"]},
    32: {"context_tags": ["pregnancy"], "technique_tags": ["choose_healthy_snacks", "increase_protein"]},
    33: {"context_tags": ["pregnancy"], "technique_tags": ["meal_prep", "batch_cooking", "increase_fiber"]},
    34: {"context_tags": ["pregnancy"], "technique_tags": ["environment_design"]},
    35: {"context_tags": ["pregnancy"], "technique_tags": ["timing_meals", "planning_ahead"]},
    36: {"context_tags": ["pregnancy"], "technique_tags": ["choose_healthy_snacks"]},
    37: {"context_tags": ["pregnancy"], "technique_tags": ["meal_prep", "planning_ahead"]},
    38: {"context_tags": ["pregnancy"], "technique_tags": ["choose_healthy_breakfasts", "increase_vegetables"]},
    39: {"context_tags": ["pregnancy"], "technique_tags": ["healthy_swaps", "increase_fiber"]},
    40: {"context_tags": ["pregnancy"], "technique_tags": ["planning_ahead", "habit_stacking", "increase_fiber"]},
    
    # Tips 41-49: Pregnancy planning and preparation
    41: {"context_tags": ["pregnancy"], "technique_tags": ["planning_ahead", "environment_design", "choose_healthy_snacks"]},
    42: {"context_tags": ["pregnancy"], "technique_tags": ["batch_cooking", "meal_prep", "planning_ahead"]},
    43: {"context_tags": ["pregnancy"], "technique_tags": ["gamification", "self_monitoring", "visual_habit_tracker"]},
    44: {"context_tags": ["pregnancy"], "technique_tags": ["environment_design", "planning_ahead"]},
    45: {"context_tags": ["pregnancy"], "technique_tags": ["accountability_partner", "body_doubling"]},
    46: {"context_tags": ["pregnancy"], "technique_tags": ["self_monitoring", "habit_reflection"]},
    47: {"context_tags": ["pregnancy"], "technique_tags": ["healthy_swaps", "coping_plans"]},
    48: {"context_tags": ["pregnancy", "food_allergies"], "technique_tags": ["healthy_swaps", "planning_ahead"]},
    49: {"context_tags": ["pregnancy"], "technique_tags": ["habit_menu", "planning_ahead"]},
    
    # Tips 50-60: General nutrition and mindful eating
    50: {"context_tags": [], "technique_tags": ["slow_eating", "mindful_eating"]},
    51: {"context_tags": [], "technique_tags": ["environment_design", "cue_removal"]},
    52: {"context_tags": [], "technique_tags": ["portion_control", "environment_design"]},
    53: {"context_tags": [], "technique_tags": ["habit_stacking", "hydration_first", "reminder_cues"]},
    54: {"context_tags": [], "technique_tags": ["habit_stacking", "increase_vegetables", "increase_fiber"]},
    55: {"context_tags": [], "technique_tags": ["healthy_swaps", "portion_control"]},
    56: {"context_tags": [], "technique_tags": ["healthy_swaps"]},
    57: {"context_tags": [], "technique_tags": ["portion_control", "coping_plans", "pre_commitment"]},
    58: {"context_tags": [], "technique_tags": ["healthy_swaps", "portion_control"]},
    59: {"context_tags": [], "technique_tags": ["healthy_swaps", "choose_healthy_snacks"]},
    60: {"context_tags": [], "technique_tags": ["meal_prep", "batch_cooking", "increase_protein"]},
    
    # Tips 61-70: Protein and healthy swaps
    61: {"context_tags": [], "technique_tags": ["protein_at_breakfast", "protein_first", "increase_protein"]},
    62: {"context_tags": [], "technique_tags": ["healthy_swaps", "increase_protein"]},
    63: {"context_tags": [], "technique_tags": ["healthy_swaps", "increase_protein"]},
    64: {"context_tags": [], "technique_tags": ["healthy_swaps", "increase_fiber", "choose_healthy_snacks"]},
    65: {"context_tags": [], "technique_tags": ["healthy_swaps", "choose_healthy_snacks"]},
    66: {"context_tags": [], "technique_tags": ["healthy_swaps"]},
    67: {"context_tags": [], "technique_tags": ["plate_method", "increase_vegetables", "portion_control"]},
    68: {"context_tags": [], "technique_tags": ["environment_design", "habit_stacking", "evening_light_dim"]},
    69: {"context_tags": [], "technique_tags": ["cognitive_reframing", "mindfulness_meditation", "distraction"]},
    70: {"context_tags": [], "technique_tags": ["cognitive_reframing", "breathwork"]},
    
    # Tips 71-80: Stress eating and emotional eating management
    71: {"context_tags": [], "technique_tags": ["reminder_cues", "mindful_eating", "self_monitoring"]},
    72: {"context_tags": [], "technique_tags": ["mindful_eating", "intuitive_eating"]},
    73: {"context_tags": [], "technique_tags": ["body_scan", "mindfulness_meditation"]},
    74: {"context_tags": [], "technique_tags": ["mindful_eating", "slow_eating", "self_monitoring"]},
    75: {"context_tags": [], "technique_tags": ["urge_surfing", "breathwork", "delay_tactics"]},
    76: {"context_tags": [], "technique_tags": ["cognitive_reframing", "self_compassion_break"]},
    77: {"context_tags": [], "technique_tags": ["self_monitoring", "habit_reflection"]},
    78: {"context_tags": [], "technique_tags": ["implementation_intentions", "coping_plans", "pre_commitment"]},
    79: {"context_tags": [], "technique_tags": ["movement_breaks", "distraction"]},
    80: {"context_tags": [], "technique_tags": ["movement_breaks", "nature_time", "distraction"]},
    
    # Tips 81-90: More coping strategies
    81: {"context_tags": [], "technique_tags": ["accountability_partner", "body_doubling"]},
    82: {"context_tags": [], "technique_tags": ["distraction", "environment_design"]},
    83: {"context_tags": [], "technique_tags": ["distraction", "delay_tactics"]},
    84: {"context_tags": [], "technique_tags": ["breathwork", "box_breathing", "progressive_muscle_relaxation"]},
    85: {"context_tags": [], "technique_tags": ["distraction", "body_scan"]},
    86: {"context_tags": [], "technique_tags": ["self_compassion_break", "breathwork"]},
    87: {"context_tags": [], "technique_tags": ["distraction", "self_compassion_break"]},
    88: {"context_tags": [], "technique_tags": ["daily_reset", "two_minute_pickup", "distraction"]},
    89: {"context_tags": [], "technique_tags": ["reminder_cues", "environment_design", "cue_removal"]},
    90: {"context_tags": [], "technique_tags": ["portion_control", "mindful_eating", "environment_design"]},
    
    # Tips 91-100: Environment design and habit building
    91: {"context_tags": ["work_from_home"], "technique_tags": ["environment_design", "cue_removal"]},
    92: {"context_tags": [], "technique_tags": ["environment_design", "cue_removal"]},
    93: {"context_tags": [], "technique_tags": ["evening_light_dim", "habit_stacking", "wind_down_routine"]},
    94: {"context_tags": [], "technique_tags": ["environment_design", "pre_commitment"]},
    95: {"context_tags": [], "technique_tags": ["environment_design", "cue_removal"]},
    96: {"context_tags": [], "technique_tags": ["meal_prep", "portion_control", "batch_cooking"]},
    97: {"context_tags": [], "technique_tags": ["digital_cleanse", "cue_removal"]},
    98: {"context_tags": [], "technique_tags": ["pre_commitment", "planning_ahead"]},
    99: {"context_tags": [], "technique_tags": ["slow_eating", "mindful_eating"]},
    100: {"context_tags": [], "technique_tags": ["mindful_eating", "slow_eating"]},
    
    # Tips 101-110: More mindful eating
    101: {"context_tags": [], "technique_tags": ["mindful_eating", "self_monitoring", "portion_control"]},
    102: {"context_tags": [], "technique_tags": ["slow_eating", "mindful_eating"]},
    103: {"context_tags": [], "technique_tags": ["mindful_eating", "slow_eating"]},
    104: {"context_tags": [], "technique_tags": ["healthy_swaps", "environment_design", "choose_healthy_snacks"]},
    105: {"context_tags": [], "technique_tags": ["mindful_eating", "slow_eating", "breathwork"]},
    106: {"context_tags": [], "technique_tags": ["slow_eating", "mindful_eating", "portion_control"]},
    107: {"context_tags": [], "technique_tags": ["mindful_eating", "slow_eating"]},
    108: {"context_tags": [], "technique_tags": ["evening_light_dim", "habit_stacking", "cue_removal"]},
    109: {"context_tags": [], "technique_tags": ["hydration_first", "delay_tactics"]},
    110: {"context_tags": [], "technique_tags": ["protein_first", "mindful_eating"]},
    
    # Tips 111-118: Nutrition optimization and mood
    111: {"context_tags": [], "technique_tags": ["veggie_first", "increase_vegetables", "fiber_first"]},
    112: {"context_tags": [], "technique_tags": ["choose_healthy_snacks", "planning_ahead"]},
    113: {"context_tags": [], "technique_tags": ["choose_healthy_snacks", "habit_stacking"]},
    114: {"context_tags": [], "technique_tags": ["wind_down_routine", "evening_light_dim"]},
    115: {"context_tags": [], "technique_tags": ["sleep_hygiene", "evening_light_dim", "wind_down_routine", "consistent_wake_time"]},
    116: {"context_tags": [], "technique_tags": ["portion_control", "slow_eating", "mindful_eating"]},
    117: {"context_tags": [], "technique_tags": ["healthy_swaps", "evening_light_dim", "wind_down_routine"]},
    118: {"context_tags": [], "technique_tags": ["nature_time", "light_management", "breathwork"]}
}

# Read the TIPS_COMPREHENSIVE.md file
with open('/Users/nataliemichelson/Projects/habithelper/TIPS_COMPREHENSIVE.md', 'r') as f:
    content = f.read()

# Add tags to each tip section
lines = content.split('\n')
output_lines = []
current_tip = 0

for i, line in enumerate(lines):
    output_lines.append(line)
    
    # Check if this is a tip header
    if line.startswith('## Tip '):
        try:
            current_tip = int(line.split('## Tip ')[1].strip())
        except:
            continue
    
    # Add tags after "Helps With:" line
    if line.startswith('**Helps With:**') and current_tip in tip_tags:
        # Add context tags if they exist
        if tip_tags[current_tip]["context_tags"]:
            output_lines.append("")
            output_lines.append(f"**Context Tags:** {', '.join(tip_tags[current_tip]['context_tags'])}")
        
        # Add technique tags
        output_lines.append("")
        output_lines.append(f"**Technique Tags:** {', '.join(tip_tags[current_tip]['technique_tags'])}")

# Write the updated content
updated_content = '\n'.join(output_lines)

with open('/Users/nataliemichelson/Projects/habithelper/TIPS_WITH_TAGS.md', 'w') as f:
    f.write(updated_content)

print(f"Successfully added tags to {len(tip_tags)} tips")
print(f"Output saved to TIPS_WITH_TAGS.md")

# Create a summary of tag usage
context_count = {}
technique_count = {}

for tip_data in tip_tags.values():
    for tag in tip_data["context_tags"]:
        context_count[tag] = context_count.get(tag, 0) + 1
    for tag in tip_data["technique_tags"]:
        technique_count[tag] = technique_count.get(tag, 0) + 1

print("\n=== Context Tag Usage ===")
for tag, count in sorted(context_count.items(), key=lambda x: -x[1]):
    print(f"{tag}: {count} tips")

print("\n=== Top Technique Tags ===")
for tag, count in sorted(technique_count.items(), key=lambda x: -x[1])[:20]:
    print(f"{tag}: {count} tips")