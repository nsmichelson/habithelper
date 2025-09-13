#!/usr/bin/env python3
import json
import re

# Load available tags
with open('/Users/nataliemichelson/Projects/habithelper/newFiles/tags_with_descriptions.json', 'r') as f:
    all_tags = json.load(f)

# Create lookup dictionaries
context_tags = {tag['key']: tag['description'] for tag in all_tags if tag['bucket'] == 'context'}
technique_tags = {tag['key']: tag['description'] for tag in all_tags if tag['bucket'] == 'technique'}

# Define mappings for each tip based on careful review
# This is where I'll use my judgment to assign appropriate tags

tip_tag_mappings = {
    "e897e203-f6a3-4726-97cf-0be4bf6dade3": {  # Ginger chews for nausea
        "context_tags": ["pregnancy"],
        "technique_tags": ["environment_design", "planning_ahead"]
    },
    "70bc2cae-2895-4041-9ba3-9cdc8c38ac23": {  # Freeze ginger tea cubes
        "context_tags": ["pregnancy"],
        "technique_tags": ["batch_cooking", "planning_ahead", "meal_prep"]
    },
    "c45987a7-3866-4379-996b-d2e36fefe057": {  # Frozen lemon-ginger cubes
        "context_tags": ["pregnancy"],
        "technique_tags": ["batch_cooking", "planning_ahead", "meal_prep"]
    },
    "c55f0762-08a2-4cb4-91e8-c8d633db4ffa": {  # Peppermint gum for nausea
        "context_tags": ["pregnancy"],
        "technique_tags": ["distraction", "environment_design"]
    },
    "cf16c8b8-3424-49e4-8c81-b785a931e910": {  # Flavor water lightly
        "context_tags": ["pregnancy"],
        "technique_tags": ["healthy_swaps", "hydration_reminders"]
    },
    "84271016-fed4-4b53-a1e9-ad80725ee917": {  # Crackers by bed
        "context_tags": ["pregnancy"],
        "technique_tags": ["environment_design", "morning_routine", "planning_ahead"]
    },
    "b1fb0db1-90cd-4a87-a688-65510a7f134e": {  # Protein bedtime snack
        "context_tags": ["pregnancy"],
        "technique_tags": ["timing_meals", "planning_ahead", "protein_prioritization"]
    },
    "35f529a1-e92f-403c-ba16-de140af4aeab": {  # P fruits for constipation
        "context_tags": ["pregnancy"],
        "technique_tags": ["choose_healthy_snacks", "fiber_first"]
    },
    "7f7df02d-5354-40ef-b35e-22a445d56241": {  # Chia/flax for fiber
        "context_tags": ["pregnancy"],
        "technique_tags": ["stealth_health", "fiber_first", "habit_stacking"]
    },
    "4e4cc434-fa30-48a8-991f-afde0bb3eaad": {  # Daily kiwi
        "context_tags": ["pregnancy"],
        "technique_tags": ["choose_healthy_snacks", "fiber_first"]
    },
    # I'll continue with all tips...
}

# Read the tips file
with open('/Users/nataliemichelson/Projects/habithelper/data/tips.ts', 'r') as f:
    content = f.read()

# For each tip, add the new tags
for tip_id, tags in tip_tag_mappings.items():
    # Find the tip in the content
    tip_pattern = rf'("tip_id":\s*"{tip_id}".*?)("goal_tags":\s*\[[^\]]*\])'
    
    match = re.search(tip_pattern, content, re.DOTALL)
    if match:
        # Insert context_tags and technique_tags after goal_tags
        context_tags_str = json.dumps(tags['context_tags'], indent=6)
        technique_tags_str = json.dumps(tags['technique_tags'], indent=6)
        
        insertion = f'{match.group(2)},\n    "context_tags": {context_tags_str},\n    "technique_tags": {technique_tags_str}'
        
        content = content[:match.start(2)] + insertion + content[match.end(2):]

print(f"Processed {len(tip_tag_mappings)} tips")