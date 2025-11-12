import json
import uuid
import re
from pathlib import Path
from textwrap import dedent

RAW_PATH = Path('habithelper/data/nutrition_raw_tips.txt')
OUTPUT_PATH = Path('habithelper/data/nutritionSimplifiedTips.ts')

BASE_FEATURES = {
    'default': ['solo_friendly', 'diet_trauma_safe', 'not_diety'],
    'with_no_planning': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'no_planning'],
}

CATEGORY_DEFAULTS = {
    'environment_home': {
        'goals': ['reduce_sugar', 'reduce_ultra_processed', 'treat_environment_design'],
        'helps_with': ['cravings', 'mindless_eating', 'junk_food_addiction'],
        'mechanisms': ['environment_design', 'stimulus_control', 'habit_cues'],
        'effort': 'low',
        'time': '15-30min',
        'cost': '$',
        'when': ['any'],
        'where': ['home'],
        'features': ['solo_friendly', 'no_planning', 'impulse_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'environment_work': {
        'goals': ['reduce_sugar', 'treat_environment_design'],
        'helps_with': ['cravings', 'mindless_eating', 'social_pressure'],
        'mechanisms': ['environment_design', 'stimulus_control'],
        'effort': 'low',
        'time': '5-15min',
        'cost': '$',
        'when': ['any'],
        'where': ['work'],
        'features': ['solo_friendly', 'no_planning', 'impulse_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'precommit_restaurant': {
        'goals': ['portion_control', 'reduce_sugar', 'reduce_ultra_processed'],
        'helps_with': ['overeating', 'decision_fatigue', 'cravings'],
        'mechanisms': ['pre_commitment', 'environment_design', 'decision_ease'],
        'effort': 'low',
        'time': '5-15min',
        'cost': '$',
        'when': ['eating_out'],
        'where': ['home', 'restaurant'],
        'features': ['solo_friendly', 'no_planning', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'as_needed',
    },
    'premeal_satiety': {
        'goals': ['protein_intake', 'increase_fiber', 'stable_blood_sugar'],
        'helps_with': ['cravings', 'energy_crashes', 'overeating'],
        'mechanisms': ['satiety', 'blood_sugar_stability', 'habit_stacking'],
        'effort': 'low',
        'time': '5-15min',
        'cost': '$',
        'when': ['meal_time'],
        'where': ['home', 'travel'],
        'features': ['solo_friendly', 'no_planning', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'as_needed',
    },
    'restaurant_portion': {
        'goals': ['portion_control', 'reduce_ultra_processed', 'craving_management'],
        'helps_with': ['overeating', 'cravings', 'social_pressure'],
        'mechanisms': ['portion_control', 'environment_design', 'mindful_eating'],
        'effort': 'low',
        'time': '0-5min',
        'cost': '$',
        'when': ['eating_out'],
        'where': ['restaurant'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'as_needed',
    },
    'hydration_pause': {
        'goals': ['increase_hydration', 'craving_management'],
        'helps_with': ['cravings', 'dehydration', 'boredom_eating'],
        'mechanisms': ['hydration', 'pause', 'interoception'],
        'effort': 'minimal',
        'time': '0-5min',
        'cost': '$',
        'when': ['snack_time', 'craving_event'],
        'where': ['home', 'work'],
        'features': ['solo_friendly', 'no_planning', 'impulse_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 1,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'balanced_pairing': {
        'goals': ['stable_blood_sugar', 'protein_intake', 'reduce_cravings'],
        'helps_with': ['energy_crashes', 'cravings'],
        'mechanisms': ['balanced_plate', 'satiety', 'habit_stacking'],
        'effort': 'low',
        'time': '0-5min',
        'cost': '$',
        'when': ['snack_time', 'meal_time'],
        'where': ['home', 'work', 'travel'],
        'features': ['solo_friendly', 'impulse_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 1,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'gut_support': {
        'goals': ['improve_gut_health', 'increase_fiber', 'nutrient_density'],
        'helps_with': ['cravings', 'nutrient_gaps', 'gut_health'],
        'mechanisms': ['gut_brain_axis', 'nutrient_density', 'habit_stacking'],
        'effort': 'low',
        'time': '5-15min',
        'cost': '$',
        'when': ['meal_time'],
        'where': ['home'],
        'features': ['solo_friendly', 'no_planning', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'daily',
    },
    'fruit_swap': {
        'goals': ['reduce_sugar', 'craving_satisfaction', 'produce_priority'],
        'helps_with': ['cravings', 'evening_cravings', 'overeating'],
        'mechanisms': ['healthy_swap', 'satiety', 'sensory'],
        'effort': 'low',
        'time': '5-15min',
        'cost': '$',
        'when': ['evening', 'post_dinner'],
        'where': ['home'],
        'features': ['solo_friendly', 'impulse_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 1,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'healthy_sweet': {
        'goals': ['craving_satisfaction', 'reduce_sugar', 'healthy_snacking'],
        'helps_with': ['cravings', 'evening_cravings'],
        'mechanisms': ['healthy_swap', 'satiety', 'sensory'],
        'effort': 'low',
        'time': '15-30min',
        'cost': '$',
        'when': ['snack_time', 'post_dinner'],
        'where': ['home'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'travel_prepared': {
        'goals': ['maintain_consistency', 'healthy_snacking', 'reduce_ultra_processed'],
        'helps_with': ['grazing', 'impulse_orders', 'cravings'],
        'mechanisms': ['advance_planning', 'environment_design', 'satiety'],
        'effort': 'medium',
        'time': '15-30min',
        'cost': '$$',
        'when': ['meal_prep_time'],
        'where': ['travel'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 3,
        'source': 'coach_curated',
        'sustainability': 'as_needed',
    },
    'routine_anchor': {
        'goals': ['maintain_consistency', 'stable_blood_sugar', 'reduce_cravings'],
        'helps_with': ['decision_fatigue', 'grazing', 'late_night_eating'],
        'mechanisms': ['habit_stacking', 'routine_design', 'chrononutrition'],
        'effort': 'low',
        'time': 'planning',
        'cost': '$',
        'when': ['meal_time'],
        'where': ['home', 'travel'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'social_focus': {
        'goals': ['maintain_consistency', 'stress_coping_plan'],
        'helps_with': ['social_pressure', 'boredom_eating', 'cravings'],
        'mechanisms': ['attention_shift', 'social_support', 'mindset'],
        'effort': 'low',
        'time': '0-5min',
        'cost': '$',
        'when': ['social_event'],
        'where': ['social_event'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'as_needed',
    },
    'alcohol_boundaries': {
        'goals': ['alcohol_free', 'beverage_boundaries', 'portion_control'],
        'helps_with': ['cravings', 'social_pressure'],
        'mechanisms': ['pre_commitment', 'environment_design', 'pacing'],
        'effort': 'low',
        'time': '0-5min',
        'cost': '$',
        'when': ['evening', 'social_event'],
        'where': ['home', 'social_event', 'restaurant'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
        'contraindications': ['Avoid alcohol entirely if pregnant, on interacting medications, or advised by your clinician.'],
    },
    'expectation_setting': {
        'goals': ['build_healthy_habits', 'mindset_shift', 'maintain_consistency'],
        'helps_with': ['motivation', 'maintenance_failure', 'stress_eating'],
        'mechanisms': ['mindset', 'implementation_intentions', 'self_efficacy'],
        'effort': 'low',
        'time': 'planning',
        'cost': '$',
        'when': ['any'],
        'where': ['home'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'implementation_plan': {
        'goals': ['stress_coping_plan', 'reduce_cravings', 'stress_distraction_tool'],
        'helps_with': ['boredom_eating', 'stress_eating', 'cravings'],
        'mechanisms': ['implementation_intentions', 'habit_stacking', 'attention_shift'],
        'effort': 'low',
        'time': 'planning',
        'cost': '$',
        'when': ['boredom', 'evening'],
        'where': ['home', 'work'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'meal_prep': {
        'goals': ['meal_prep', 'maintain_consistency', 'healthy_snacking'],
        'helps_with': ['decision_fatigue', 'grazing', 'impulse_orders'],
        'mechanisms': ['advance_planning', 'meal_prep', 'environment_design'],
        'effort': 'medium',
        'time': '30-60min',
        'cost': '$$',
        'when': ['meal_prep_time'],
        'where': ['home'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 3,
        'source': 'coach_curated',
        'sustainability': 'weekly',
    },
    'meal_planning': {
        'goals': ['maintain_consistency', 'meal_prep', 'healthy_snacking'],
        'helps_with': ['decision_fatigue', 'impulse_orders', 'grazing'],
        'mechanisms': ['advance_planning', 'decision_ease', 'implementation_intentions'],
        'effort': 'low',
        'time': '15-30min',
        'cost': '$',
        'when': ['meal_prep_time'],
        'where': ['home'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'weekly',
    },
    'skill_building': {
        'goals': ['build_healthy_habits', 'meal_prep', 'produce_priority'],
        'helps_with': ['confidence', 'decision_fatigue'],
        'mechanisms': ['skill_building', 'self_efficacy'],
        'effort': 'low',
        'time': '15-30min',
        'cost': '$',
        'when': ['any'],
        'where': ['home'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'weekly',
    },
    'mindful_pause': {
        'goals': ['mindful_eating', 'reduce_cravings', 'stress_coping_plan'],
        'helps_with': ['mindless_eating', 'boredom_eating', 'overeating'],
        'mechanisms': ['mindfulness', 'interoception', 'urge_surfing'],
        'effort': 'minimal',
        'time': '0-5min',
        'cost': '$',
        'when': ['snack_time', 'evening'],
        'where': ['home', 'work'],
        'features': ['solo_friendly', 'impulse_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 1,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'tea_swap': {
        'goals': ['craving_satisfaction', 'reduce_sugar', 'stress_coping_plan'],
        'helps_with': ['boredom_eating', 'evening_cravings'],
        'mechanisms': ['sensory', 'mindfulness', 'hydration'],
        'effort': 'minimal',
        'time': '0-5min',
        'cost': '$',
        'when': ['afternoon', 'evening'],
        'where': ['home', 'work'],
        'features': ['solo_friendly', 'impulse_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 1,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'chrono_eating': {
        'goals': ['stable_blood_sugar', 'better_sleep', 'maintain_consistency'],
        'helps_with': ['late_night_eating', 'energy_crashes'],
        'mechanisms': ['chrononutrition', 'habit_stacking'],
        'effort': 'low',
        'time': 'planning',
        'cost': '$',
        'when': ['any'],
        'where': ['home'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
    'shopping_strategy': {
        'goals': ['reduce_ultra_processed', 'produce_priority', 'maintain_consistency'],
        'helps_with': ['grocery_budget', 'impulse_orders', 'cravings'],
        'mechanisms': ['environment_design', 'advance_planning'],
        'effort': 'low',
        'time': '5-15min',
        'cost': '$',
        'when': ['grocery_shopping'],
        'where': ['grocery'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'weekly',
    },
    'convenience_upgrade': {
        'goals': ['healthy_snacking', 'meal_prep', 'reduce_ultra_processed'],
        'helps_with': ['impulse_orders', 'cravings', 'grazing'],
        'mechanisms': ['environment_design', 'advance_planning', 'meal_prep'],
        'effort': 'low',
        'time': '15-30min',
        'cost': '$$',
        'when': ['shopping'],
        'where': ['home', 'grocery'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'weekly',
    },
    'balanced_plate': {
        'goals': ['stable_blood_sugar', 'portion_control', 'produce_priority'],
        'helps_with': ['overeating', 'energy_crashes'],
        'mechanisms': ['balanced_plate', 'satiety'],
        'effort': 'low',
        'time': '15-30min',
        'cost': '$',
        'when': ['meal_time'],
        'where': ['home', 'restaurant'],
        'features': ['solo_friendly', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'ongoing',
    },
}


def md_text(experiment: str, why: str, how_steps: list[str]) -> str:
    how_block = '\n'.join(f'• {step}' for step in how_steps)
    return dedent(f"""**The Experiment:** {experiment}\n\n**Why it Works:** {why}\n\n**How to Try It:**\n{how_block}""").strip()



def parse_raw() -> list[dict]:
    text = RAW_PATH.read_text()
    pattern = re.compile(
        r"(\d+)\) (.*?)\nsummary: (.*?)\ndetails_md:\n\n### The Experiment\n(.*?)\n\n### Why it Works\n(.*?)\n\n### How to Try It\n(.*?)(?=\n\n\d+\) |\Z)",
        re.S,
    )
    tips = []
    for match in pattern.finditer(text):
        number = int(match.group(1))
        title = match.group(2).strip()
        summary = match.group(3).strip()
        experiment = ' '.join(match.group(4).strip().split())
        why = ' '.join(match.group(5).strip().split())
        how_block = match.group(6).strip()
        how_steps = [step.strip() for step in how_block.split('\n') if step.strip().startswith('-')]
        how_steps = [step[1:].strip() if step.startswith('-') else step for step in how_steps]
        tips.append({
            'number': number,
            'title': title,
            'summary': summary,
            'experiment': experiment,
            'why': why,
            'how': how_steps,
        })
    return tips


def load_existing_ids() -> dict[str, str]:
    if not OUTPUT_PATH.exists():
        return {}
    mapping: dict[str, str] = {}
    current_id: str | None = None
    for line in OUTPUT_PATH.read_text().splitlines():
        stripped = line.strip()
        if stripped.startswith('"tip_id"'):
            match = re.search(r'"tip_id":\s*"([^\"]+)"', stripped)
            if match:
                current_id = match.group(1)
        elif stripped.startswith('"summary"') and current_id:
            raw_value = stripped.split(':', 1)[1].rstrip(',').strip()
            try:
                summary_value = json.loads(raw_value)
            except json.JSONDecodeError:
                summary_value = raw_value.strip('"')
            mapping[summary_value] = current_id
            current_id = None
    return mapping


TIP_CONFIGS: dict[int, dict] = {
    1: {
        'category': 'environment_home',
        'overrides': {
            'involves': ['fruit', 'nuts', 'treats_bin'],
        },
    },
    2: {
        'category': 'precommit_restaurant',
        'overrides': {
            'requires': ['menu_review'],
        },
    },
    3: {
        'category': 'premeal_satiety',
        'overrides': {
            'involves': ['yogurt', 'eggs', 'fruit', 'nuts'],
            'requires': ['advance_planning'],
        },
    },
    4: {
        'category': 'restaurant_portion',
        'overrides': {
            'requires': ['to_go_box'],
        },
    },
    5: {
        'category': 'restaurant_portion',
        'overrides': {
            'involves': ['dessert', 'fruit'],
        },
    },
    6: {
        'category': 'hydration_pause',
        'overrides': {
            'involves': ['water', 'lemon'],
        },
    },
    7: {
        'category': 'balanced_pairing',
        'overrides': {
            'involves': ['fruit', 'nuts', 'yogurt', 'bread'],
        },
    },
    8: {
        'category': 'gut_support',
        'overrides': {
            'involves': ['kimchi', 'sauerkraut', 'kefir', 'kombucha'],
        },
    },
    9: {
        'category': 'fruit_swap',
        'overrides': {
            'involves': ['frozen_fruit', 'cinnamon'],
        },
    },
    10: {
        'category': 'healthy_sweet',
        'overrides': {
            'involves': ['banana', 'cocoa', 'almonds'],
        },
    },
    11: {
        'category': 'travel_prepared',
        'overrides': {
            'involves': ['nuts', 'jerky', 'fruit', 'water'],
        },
    },
    12: {
        'category': 'routine_anchor',
        'overrides': {
            'where': ['travel'],
        },
    },
    13: {
        'category': 'restaurant_portion',
        'overrides': {
            'where': ['restaurant', 'social_event'],
            'when': ['eating_out', 'social_event'],
        },
    },
    14: {
        'category': 'social_focus',
        'overrides': {
            'goals': ['maintain_consistency', 'produce_priority', 'stress_coping_plan'],
            'helps_with': ['social_pressure', 'cravings', 'mindless_eating'],
            'mechanisms': ['environment_design', 'social_support', 'attention_shift'],
        },
    },
    15: {
        'category': 'social_focus',
    },
    16: {
        'category': 'alcohol_boundaries',
        'overrides': {
            'involves': ['sparkling_water', 'lime'],
        },
    },
    17: {
        'category': 'alcohol_boundaries',
        'overrides': {
            'involves': ['wine_glass'],
        },
    },
    18: {
        'category': 'alcohol_boundaries',
        'overrides': {
            'where': ['home'],
        },
    },
    19: {
        'category': 'alcohol_boundaries',
        'overrides': {
            'when': ['meal_time', 'evening'],
        },
    },
    20: {
        'category': 'expectation_setting',
    },
    21: {
        'category': 'implementation_plan',
    },
    22: {
        'category': 'hydration_pause',
        'overrides': {
            'when': ['meal_time'],
            'where': ['home'],
        },
    },
    23: {
        'category': 'routine_anchor',
        'overrides': {
            'where': ['home', 'work'],
        },
    },
    24: {
        'category': 'precommit_restaurant',
        'overrides': {
            'where': ['restaurant'],
        },
    },
    25: {
        'category': 'chrono_eating',
        'overrides': {
            'when': ['morning', 'evening'],
        },
    },
    26: {
        'category': 'chrono_eating',
        'overrides': {
            'when': ['evening', 'pre_bed'],
        },
    },
    27: {
        'category': 'implementation_plan',
        'overrides': {
            'helps_with': ['boredom_eating', 'cravings', 'stress_eating'],
            'mechanisms': ['attention_shift', 'environment_design', 'implementation_intentions'],
            'involves': ['gum', 'tea', 'stress_ball'],
        },
    },
    28: {
        'category': 'healthy_sweet',
        'overrides': {
            'involves': ['almond_flour', 'oats', 'nuts'],
        },
    },
    29: {
        'category': 'fruit_swap',
        'overrides': {
            'involves': ['yogurt', 'berries', 'cinnamon'],
        },
    },
    30: {
        'category': 'restaurant_portion',
        'overrides': {
            'when': ['eating_out', 'post_dinner'],
        },
    },
    31: {
        'category': 'meal_prep',
        'overrides': {
            'involves': ['grain', 'protein', 'vegetables'],
            'requires': ['basic_cooking', 'full_kitchen', 'oven', 'containers'],
        },
    },
    32: {
        'category': 'meal_prep',
        'overrides': {
            'time': '30-45min',
            'involves': ['vegetables', 'containers'],
            'requires': ['basic_cooking', 'containers'],
        },
    },
    33: {
        'category': 'meal_prep',
        'overrides': {
            'time': '30-45min',
            'involves': ['oats', 'eggs', 'berries'],
            'requires': ['basic_cooking', 'full_kitchen', 'containers'],
        },
    },
    34: {
        'category': 'meal_planning',
        'overrides': {
            'time': '5-15min',
        },
    },
    35: {
        'category': 'convenience_upgrade',
        'overrides': {
            'involves': ['rotisserie_chicken', 'bagged_salad', 'frozen_vegetables'],
        },
    },
    36: {
        'category': 'shopping_strategy',
        'overrides': {
            'involves': ['nutrition_labels'],
        },
    },
    37: {
        'category': 'meal_prep',
        'overrides': {
            'time': '30-45min',
            'involves': ['protein', 'containers'],
            'requires': ['basic_cooking', 'full_kitchen', 'containers'],
        },
    },
    38: {
        'category': 'meal_planning',
        'overrides': {
            'time': 'planning',
        },
    },
    39: {
        'category': 'skill_building',
        'overrides': {
            'involves': ['knife', 'cutting_board'],
            'requires': ['basic_cooking'],
        },
    },
    40: {
        'category': 'environment_home',
        'overrides': {
            'involves': ['fridge', 'fruit', 'yogurt', 'vegetables'],
        },
    },
    41: {
        'category': 'implementation_plan',
        'overrides': {
            'goals': ['increase_hydration', 'maintain_consistency', 'stress_reset_routine'],
            'helps_with': ['cravings', 'low_energy', 'boredom_eating'],
            'mechanisms': ['habit_stacking', 'micro_workouts', 'hydration'],
            'when': ['meal_time', 'snack_time'],
            'where': ['home', 'work'],
            'requires': ['microwave'],
        },
    },
    42: {
        'category': 'mindful_pause',
    },
    43: {
        'category': 'expectation_setting',
        'overrides': {
            'mechanisms': ['self_efficacy', 'visual_cues', 'habit_tracking'],
        },
    },
    44: {
        'category': 'mindful_pause',
        'overrides': {
            'mechanisms': ['portion_control', 'environment_design', 'mindfulness'],
            'involves': ['snack_bowl'],
        },
    },
    45: {
        'category': 'tea_swap',
        'overrides': {
            'involves': ['herbal_tea'],
            'requires': ['kettle'],
        },
    },
    46: {
        'category': 'chrono_eating',
        'overrides': {
            'when': ['afternoon'],
        },
    },
    47: {
        'category': 'restaurant_portion',
        'overrides': {
            'involves': ['water', 'salad'],
        },
    },
    48: {
        'category': 'mindful_pause',
        'overrides': {
            'goals': ['stress_coping_plan', 'mindful_eating', 'reduce_cravings'],
            'helps_with': ['stress_eating', 'emotional_eating', 'cravings'],
            'mechanisms': ['urge_surfing', 'cognitive_reframing', 'behavioral_activation'],
            'when': ['stress', 'evening'],
            'where': ['home', 'work'],
        },
    },
    49: {
        'category': 'mindful_pause',
        'overrides': {
            'when': ['snack_time', 'post_dinner'],
        },
    },
    50: {
        'category': 'skill_building',
        'overrides': {
            'goals': ['increase_vegetables', 'reduce_cravings', 'mindset_shift'],
            'helps_with': ['food_aversion', 'boredom_eating'],
            'mechanisms': ['exposure', 'skill_building', 'self_efficacy'],
            'features': ['family_friendly', 'kid_approved', 'diet_trauma_safe', 'not_diety', 'chaos_proof'],
            'requires': ['basic_cooking'],
        },
    },
    51: {
        'category': 'restaurant_portion',
    },
    52: {
        'category': 'fruit_swap',
        'overrides': {
            'involves': ['fruit', 'cinnamon'],
        },
    },
    53: {
        'category': 'precommit_restaurant',
        'overrides': {
            'where': ['restaurant'],
        },
    },
    54: {
        'category': 'tea_swap',
        'overrides': {
            'goals': ['reduce_sugar', 'reduce_cravings', 'beverage_boundaries'],
            'helps_with': ['cravings', 'energy_crashes'],
            'mechanisms': ['gradual_reduction', 'habit_stacking', 'sensory'],
            'when': ['morning', 'afternoon'],
            'where': ['home', 'work'],
        },
    },
    55: {
        'category': 'tea_swap',
        'overrides': {
            'involves': ['coffee', 'cinnamon'],
        },
    },
    56: {
        'category': 'restaurant_portion',
        'overrides': {
            'where': ['home', 'social_event'],
        },
    },
    57: {
        'category': 'environment_home',
        'overrides': {
            'involves': ['plates', 'bowls'],
            'mechanisms': ['environment_design', 'portion_control', 'visual_cues'],
        },
    },
    58: {
        'category': 'environment_home',
    },
    59: {
        'category': 'mindful_pause',
        'overrides': {
            'involves': ['reminder_card'],
        },
    },
    60: {
        'category': 'precommit_restaurant',
        'overrides': {
            'goals': ['portion_control', 'reduce_ultra_processed', 'social_pressure'],
            'helps_with': ['social_pressure', 'overeating', 'decision_fatigue'],
            'mechanisms': ['pre_commitment', 'social_accountability', 'decision_ease'],
            'where': ['home', 'restaurant', 'social_event'],
            'requires': ['phone'],
        },
    },
    61: {
        'category': 'restaurant_portion',
    },
    62: {
        'category': 'restaurant_portion',
        'overrides': {
            'involves': ['soup', 'salad'],
        },
    },
    63: {
        'category': 'balanced_plate',
    },
    64: {
        'category': 'balanced_plate',
        'overrides': {
            'involves': ['vegetables'],
        },
    },
    65: {
        'category': 'balanced_pairing',
        'overrides': {
            'when': ['morning'],
            'where': ['home', 'restaurant'],
        },
    },
    66: {
        'category': 'travel_prepared',
        'overrides': {
            'when': ['meal_time'],
            'involves': ['salad', 'protein', 'nuts'],
        },
    },
    67: {
        'category': 'mindful_pause',
        'overrides': {
            'when': ['meal_time'],
        },
    },
    68: {
        'category': 'travel_prepared',
        'overrides': {
            'involves': ['yogurt', 'fruit', 'water', 'nuts'],
        },
    },
    69: {
        'category': 'environment_work',
        'overrides': {
            'involves': ['nuts', 'tuna', 'fruit'],
        },
    },
    70: {
        'category': 'shopping_strategy',
    },
    71: {
        'category': 'convenience_upgrade',
        'overrides': {
            'involves': ['frozen_vegetables', 'berries'],
            'requires': ['freezer', 'storage_bags'],
        },
    },
    72: {
        'category': 'environment_home',
        'overrides': {
            'involves': ['pantry', 'snacks'],
        },
    },
    73: {
        'category': 'environment_work',
        'overrides': {
            'involves': ['candy', 'opaque_container'],
            'requires': ['containers'],
        },
    },
    74: {
        'category': 'implementation_plan',
        'overrides': {
            'helps_with': ['boredom_eating', 'cravings'],
            'mechanisms': ['attention_shift', 'boundary_setting', 'implementation_intentions'],
            'involves': ['app_timer', 'tea'],
            'requires': ['phone'],
        },
    },
    75: {
        'category': 'convenience_upgrade',
        'overrides': {
            'involves': ['rotisserie_chicken', 'bagged_salad', 'beans'],
        },
    },
    76: {
        'category': 'convenience_upgrade',
        'overrides': {
            'time': '5-15min',
            'involves': ['lentils'],
        },
    },
    77: {
        'category': 'fruit_swap',
        'overrides': {
            'involves': ['plain_yogurt', 'berries', 'nuts'],
        },
    },
    78: {
        'category': 'balanced_pairing',
        'overrides': {
            'when': ['morning'],
            'involves': ['oats', 'chia', 'berries'],
            'requires': ['basic_cooking', 'microwave'],
        },
    },
    79: {
        'category': 'environment_home',
        'overrides': {
            'involves': ['beans'],
        },
    },
    80: {
        'category': 'skill_building',
        'overrides': {
            'involves': ['knife', 'nutrition_labels'],
            'requires': ['basic_cooking', 'labels'],
        },
    },
    81: {
        'category': 'meal_prep',
        'overrides': {
            'involves': ['beans', 'greens', 'whole_grains'],
            'requires': ['basic_cooking', 'full_kitchen', 'stove_top'],
        },
    },
    82: {
        'category': 'meal_prep',
        'overrides': {
            'features': ['diet_trauma_safe', 'not_diety', 'chaos_proof', 'family_friendly', 'partner_resistant_ok'],
            'involves': ['grain', 'protein', 'vegetables'],
            'requires': ['basic_cooking', 'full_kitchen'],
        },
    },
    83: {
        'category': 'meal_prep',
        'overrides': {
            'involves': ['protein', 'herbs', 'lemon'],
            'requires': ['basic_cooking', 'full_kitchen', 'containers'],
        },
    },
    84: {
        'category': 'meal_planning',
        'overrides': {
            'time': '5-15min',
        },
    },
    85: {
        'category': 'shopping_strategy',
        'overrides': {
            'involves': ['shopping_list'],
        },
    },
    86: {
        'category': 'meal_prep',
        'overrides': {
            'time': '15-30min',
            'involves': ['spinach', 'berries', 'flax'],
            'requires': ['blender', 'freezer', 'storage_bags'],
        },
    },
    87: {
        'category': 'meal_prep',
        'overrides': {
            'time': '15-30min',
            'involves': ['salad_jars', 'beans', 'greens'],
            'requires': ['containers'],
        },
    },
    88: {
        'category': 'implementation_plan',
        'overrides': {
            'helps_with': ['boredom_eating', 'cravings', 'low_energy'],
            'mechanisms': ['habit_stacking', 'movement_break', 'hydration'],
            'when': ['evening'],
            'where': ['home'],
            'involves': ['bodyweight_moves', 'water'],
        },
    },
    89: {
        'category': 'chrono_eating',
        'overrides': {
            'when': ['evening', 'post_dinner'],
            'mechanisms': ['chrononutrition', 'environment_design', 'ritual'],
            'involves': ['tea', 'lighting'],
        },
    },
    90: {
        'category': 'chrono_eating',
        'overrides': {
            'when': ['post_dinner'],
            'helps_with': ['late_night_eating', 'cravings'],
            'mechanisms': ['habit_stacking', 'cue_control'],
            'involves': ['toothbrush', 'tea'],
            'requires': ['toothbrush'],
        },
    },
    91: {
        'category': 'environment_home',
        'overrides': {
            'involves': ['remote_control'],
        },
    },
    92: {
        'category': 'alcohol_boundaries',
        'overrides': {
            'mechanisms': ['pre_commitment', 'self_monitoring', 'pacing'],
            'involves': ['limit_card'],
            'requires': ['phone'],
        },
    },
    93: {
        'category': 'alcohol_boundaries',
        'overrides': {
            'involves': ['soda_water', 'citrus'],
        },
    },
    94: {
        'category': 'alcohol_boundaries',
        'overrides': {
            'mechanisms': ['portion_control', 'self_monitoring', 'environment_design'],
            'involves': ['measuring_cup'],
        },
    },
    95: {
        'category': 'alcohol_boundaries',
        'overrides': {
            'mechanisms': ['pacing', 'hydration', 'environment_design'],
            'involves': ['water'],
        },
    },
    96: {
        'category': 'social_focus',
        'overrides': {
            'goals': ['maintain_consistency', 'stress_coping_plan', 'alcohol_free'],
            'helps_with': ['social_pressure', 'cravings'],
            'mechanisms': ['attention_shift', 'social_support', 'mindset'],
        },
    },
    97: {
        'category': 'gut_support',
        'overrides': {
            'involves': ['onions', 'garlic', 'beans'],
            'requires': ['basic_cooking'],
        },
    },
    98: {
        'category': 'balanced_pairing',
        'overrides': {
            'when': ['snack_time'],
            'involves': ['banana', 'nuts'],
        },
    },
    99: {
        'category': 'balanced_plate',
        'overrides': {
            'involves': ['protein', 'vegetables', 'whole_grains'],
            'requires': ['basic_cooking', 'full_kitchen', 'stove_top'],
        },
    },
    100: {
        'category': 'environment_home',
        'overrides': {
            'goals': ['treat_environment_design', 'reduce_sugar', 'reduce_ultra_processed'],
            'helps_with': ['cravings', 'junk_food_addiction', 'impulse_orders'],
            'mechanisms': ['environment_design', 'stimulus_control', 'pre_commitment'],
            'time': '5-15min',
            'where': ['travel'],
        },
    },
}


def merge_tip(base: dict, overrides: dict | None) -> dict:
    data = {k: (list(v) if isinstance(v, list) else v) for k, v in base.items()}
    if overrides:
        for key, value in overrides.items():
            data[key] = value
    if 'contraindications' not in data:
        data['contraindications'] = []
    return data


def build_tips() -> list[dict]:
    parsed = {tip['number']: tip for tip in parse_raw()}
    existing_ids = load_existing_ids()
    simplified = []
    for number in sorted(parsed):
        if number not in TIP_CONFIGS:
            raise ValueError(f'Missing config for tip {number}')
        config = TIP_CONFIGS[number]
        base = CATEGORY_DEFAULTS[config['category']].copy()
        overrides = config.get('overrides', {})
        merged = merge_tip(base, overrides)
        tip = parsed[number]
        summary = tip['summary']
        merged['summary'] = summary
        merged['tip_id'] = existing_ids.get(summary, str(uuid.uuid4()))
        merged['details_md'] = md_text(tip['experiment'], tip['why'], tip['how'])
        merged['area'] = 'nutrition'
        merged['difficulty'] = merged.get('difficulty', 2)
        merged['source'] = merged.get('source', 'coach_curated')
        merged['sustainability'] = merged.get('sustainability', 'ongoing')
        simplified.append(merged)
    return simplified


def write_ts(tips: list[dict]) -> None:
    lines = ["import { SimplifiedTip } from '../types/simplifiedTip';", '', 'export const NUTRITION_SIMPLIFIED_TIPS: SimplifiedTip[] = [']
    for tip in tips:
        lines.append('  {')
        for key in ['tip_id', 'summary', 'details_md', 'area', 'goals', 'helps_with', 'contraindications', 'mechanisms', 'effort', 'time', 'cost', 'when', 'where', 'involves', 'preserves', 'satisfies', 'requires', 'features', 'difficulty', 'source', 'sustainability']:
            if key not in tip or tip[key] in (None, [], ''):
                continue
            value = tip[key]
            if isinstance(value, list):
                lines.append(f"    \"{key}\": [{', '.join(json.dumps(v) for v in value)}],")
            elif isinstance(value, str):
                lines.append(f"    \"{key}\": {json.dumps(value)},")
            else:
                lines.append(f"    \"{key}\": {json.dumps(value)},")
        lines.append('  },')
    lines.append('];')
    lines.append('')
    lines.append('export default NUTRITION_SIMPLIFIED_TIPS;')
    OUTPUT_PATH.write_text('\n'.join(lines))


if __name__ == '__main__':
    tips = build_tips()
    write_ts(tips)
