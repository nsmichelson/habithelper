import json
from pathlib import Path
from uuid import uuid5, NAMESPACE_URL
import re

RAW_PATH = Path('habithelper/data/exercise_tips_raw.txt')
OUTPUT_PATH = Path('habithelper/data/fitnessSimplifiedTips.ts')

SECTION_DEFAULTS = {
    'Section 1 — Reluctant Starters & Exercise Habit (Contextual stability, microdosing, habit stacking)': {
        'goals': ['maintain_consistency', 'build_healthy_habits', 'improve_energy'],
        'helps_with': ['low_motivation', 'time_constraints', 'low_energy'],
        'mechanisms': ['habit_stacking', 'routine_design', 'behavioral_strategy', 'positive_reinforcement'],
        'effort': 'minimal',
        'time': '0-5min',
        'features': ['solo_friendly', 'no_planning', 'impulse_friendly', 'chaos_proof'],
        'difficulty': 1,
        'sustainability': 'daily',
    },
    'Section 2 — Consistency & Routine (SDT: autonomy, competence, relatedness; affective tracking; flexibility)': {
        'goals': ['maintain_consistency', 'build_healthy_habits', 'improve_mood'],
        'helps_with': ['habit_tracking', 'low_motivation', 'overwhelm'],
        'mechanisms': ['autonomy', 'tracking', 'positive_reinforcement', 'routine_design'],
        'effort': 'minimal',
        'time': '0-5min',
        'features': ['solo_friendly', 'no_planning', 'impulse_friendly', 'chaos_proof'],
        'difficulty': 1,
        'sustainability': 'daily',
    },
    'Section 3 — Constraints: No Time, No Childcare, Home Fitness (Micro-workouts, NEAT, kid-inclusive)': {
        'goals': ['maintain_consistency', 'improve_energy', 'endurance_performance'],
        'helps_with': ['time_constraints', 'low_energy', 'low_motivation'],
        'mechanisms': ['movement', 'small_changes', 'routine_design', 'behavioral_strategy'],
        'effort': 'low',
        'time': '0-5min',
        'features': ['solo_friendly', 'no_planning', 'chaos_proof'],
        'difficulty': 2,
        'sustainability': 'daily',
    },
    'Section 4 — Aversion: Hate Gym, Boring, Hate Sweating (Enjoyment, low-thermic, play)': {
        'goals': ['build_healthy_habits', 'improve_mood', 'maintain_consistency'],
        'helps_with': ['low_motivation', 'anxiety', 'overwhelm'],
        'mechanisms': ['fun', 'novelty', 'movement', 'positive_reinforcement'],
        'effort': 'minimal',
        'time': '5-15min',
        'features': ['solo_friendly', 'no_planning', 'chaos_proof'],
        'difficulty': 1,
        'sustainability': 'weekly',
    },
    'Section 5 — Safe Modification, Mobility, Energy & Mood (hurts, flexibility/mobility, improve_energy)': {
        'goals': ['maintain_consistency', 'build_healthy_habits', 'improve_energy'],
        'helps_with': ['low_energy', 'anxiety', 'low_motivation'],
        'mechanisms': ['safety', 'movement', 'self_compassion', 'relief'],
        'effort': 'minimal',
        'time': '0-5min',
        'features': ['solo_friendly', 'no_planning', 'chaos_proof'],
        'difficulty': 1,
        'sustainability': 'daily',
    },
    'Section 6 — Strength & Performance, Endurance (progressive overload, logging, ladders, low-impact options)': {
        'goals': ['strength_performance', 'endurance_performance', 'maintain_consistency'],
        'helps_with': ['low_motivation', 'habit_tracking', 'energy_management'],
        'mechanisms': ['tracking', 'mastery', 'competence', 'movement'],
        'effort': 'low',
        'time': '0-5min',
        'features': ['solo_friendly', 'no_planning', 'chaos_proof'],
        'difficulty': 2,
        'sustainability': 'daily',
    },
    'Section 7 — More Habit Stacks & Micro-Progressions (frequency first, then duration)': {
        'goals': ['maintain_consistency', 'build_healthy_habits', 'improve_energy'],
        'helps_with': ['low_motivation', 'habit_tracking', 'time_constraints'],
        'mechanisms': ['habit_stacking', 'routine_design', 'tracking', 'positive_reinforcement'],
        'effort': 'minimal',
        'time': '0-5min',
        'features': ['solo_friendly', 'no_planning', 'impulse_friendly', 'chaos_proof'],
        'difficulty': 1,
        'sustainability': 'daily',
    },
}

COMMON_CONTRA = "Modify or skip if a healthcare provider has advised against this movement or if it causes pain."

TIP_OVERRIDES = {
    # Section 1
    'Coffee Calf Raises': {
        'when': ['morning', 'breakfast'],
        'where': ['home'],
        'involves': ['calf_raises'],
        'requires': ['countertop', 'timer'],
    },
    'Kettle Boil Squats': {
        'when': ['meal_prep', 'any'],
        'where': ['home'],
        'involves': ['squats'],
        'requires': ['chair', 'timer'],
    },
    'Toothbrush Heel-Toe Balance': {
        'when': ['morning', 'night'],
        'where': ['home'],
        'involves': ['balance'],
        'requires': ['toothbrush'],
    },
    'Microwave Mini-Plank': {
        'when': ['meal_prep', 'any'],
        'where': ['home'],
        'involves': ['plank'],
        'requires': ['countertop'],
    },
    'Shoe-Off Stretch Sequence': {
        'when': ['evening', 'post_meal'],
        'where': ['home'],
        'involves': ['stretching'],
    },
    'Post-Email Posture Reset': {
        'when': ['morning', 'work_break'],
        'where': ['work', 'home'],
        'involves': ['mobility'],
        'requires': ['wall'],
    },
    'Commercial Break Plank': {
        'when': ['evening', 'screen_time'],
        'where': ['home'],
        'involves': ['plank'],
        'requires': ['mat'],
    },
    'Calendar Alert Chair Squats': {
        'when': ['work_break', 'any'],
        'where': ['work', 'home'],
        'involves': ['squats'],
        'requires': ['chair'],
    },
    'Water Refill Walkabout': {
        'when': ['any'],
        'where': ['work', 'home'],
        'involves': ['walking'],
        'requires': ['timer'],
    },
    'Doorway Stretch Rule': {
        'when': ['any'],
        'where': ['home', 'work'],
        'involves': ['stretching'],
        'requires': ['doorframe'],
    },
    'Loud-Noise Lunge': {
        'when': ['any'],
        'where': ['home', 'work'],
        'involves': ['lunges'],
    },
    'Inbox Zero Walk': {
        'when': ['work_break', 'afternoon'],
        'where': ['work', 'outdoors'],
        'involves': ['walking'],
        'time': '5-15min',
    },
    'Pre-Call Power Pose': {
        'when': ['work_break', 'morning'],
        'where': ['work', 'home'],
        'involves': ['mobility'],
        'requires': ['wall'],
    },
    'Grocery Line Calf Pulses': {
        'when': ['any'],
        'where': ['grocery'],
        'involves': ['calf_raises'],
    },
    'Toothpaste Cap Mobility': {
        'when': ['morning', 'night'],
        'where': ['home'],
        'involves': ['mobility'],
        'requires': ['toothpaste'],
    },
    'Lunch Break Hip Hinge': {
        'when': ['meal_time', 'any'],
        'where': ['work', 'home'],
        'involves': ['hip_hinge'],
    },
    'Sock-On Single-Leg Stand': {
        'when': ['morning', 'any'],
        'where': ['home'],
        'involves': ['balance'],
        'requires': ['chair'],
    },
    'Parking Lot Posture Walk': {
        'when': ['any'],
        'where': ['outdoors', 'work'],
        'involves': ['walking'],
    },
    # Section 2
    'Mood-First Log': {
        'when': ['any'],
        'where': ['any'],
        'involves': ['logging'],
        'requires': ['journal', 'app'],
        'mechanisms': ['tracking', 'positive_reinforcement', 'self_awareness', 'autonomy'],
    },
    'Choice Trio Workout': {
        'when': ['any'],
        'where': ['home', 'outdoors'],
        'involves': ['walking', 'dancing', 'mobility'],
        'requires': ['timer', 'music'],
        'mechanisms': ['autonomy', 'fun', 'movement', 'positive_reinforcement'],
    },
    'Flex Day Swap': {
        'when': ['any'],
        'where': ['home', 'outdoors'],
        'involves': ['walking', 'mobility'],
        'requires': ['timer'],
        'mechanisms': ['autonomy', 'planning', 'movement', 'positive_reinforcement'],
    },
    'Affective Forecast Prompt': {
        'when': ['any'],
        'where': ['any'],
        'involves': ['visualization'],
        'mechanisms': ['autonomy', 'mindfulness_practice', 'positive_reinforcement', 'self_awareness'],
    },
    'Playlist Ownership': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['dancing'],
        'requires': ['music'],
        'mechanisms': ['autonomy', 'fun', 'movement', 'positive_reinforcement'],
        'time': '5-15min',
    },
    'Location Choice Rule': {
        'when': ['any'],
        'where': ['home', 'outdoors'],
        'involves': ['mobility'],
        'mechanisms': ['autonomy', 'environment_design', 'movement', 'positive_reinforcement'],
    },
    'Timer, Not Targets': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['mobility'],
        'requires': ['timer'],
        'mechanisms': ['autonomy', 'tracking', 'movement', 'positive_reinforcement'],
    },
    'Social Ping Mini-Flow': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['mobility'],
        'requires': ['phone'],
        'features': ['no_planning', 'chaos_proof', 'group_activity'],
        'features_replace': True,
        'mechanisms': ['community', 'accountability', 'movement', 'positive_reinforcement'],
    },
    'Enjoyment-First Warmup': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['mobility'],
        'mechanisms': ['autonomy', 'movement', 'positive_reinforcement', 'fun'],
    },
    'Autonomy Menu Card': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['planning'],
        'requires': ['card'],
        'mechanisms': ['autonomy', 'environment_design', 'tracking', 'positive_reinforcement'],
    },
    'Win-The-Day Minimum': {
        'when': ['any'],
        'where': ['any'],
        'involves': ['movement'],
        'mechanisms': ['autonomy', 'routine_design', 'positive_reinforcement', 'self_efficacy'],
    },
    'Two-Block Rule': {
        'when': ['any'],
        'where': ['outdoors'],
        'involves': ['walking'],
        'time': '5-15min',
        'mechanisms': ['autonomy', 'movement', 'positive_reinforcement', 'small_changes'],
    },
    'Buddy “OK” Reaction': {
        'when': ['any'],
        'where': ['any'],
        'involves': ['messaging'],
        'requires': ['phone'],
        'features': ['no_planning', 'chaos_proof', 'group_activity'],
        'features_replace': True,
        'mechanisms': ['community', 'accountability', 'positive_reinforcement', 'tracking'],
    },
    'End-on-a-High Rule': {
        'when': ['any'],
        'where': ['any'],
        'involves': ['movement'],
        'mechanisms': ['autonomy', 'positive_reinforcement', 'movement', 'self_awareness'],
    },
    # Section 3
    '3×40s Squat Bursts': {
        'when': ['morning', 'afternoon', 'evening'],
        'where': ['home'],
        'involves': ['squats'],
        'requires': ['timer'],
    },
    'Camera-Off Circuit': {
        'when': ['work_break'],
        'where': ['work', 'home'],
        'involves': ['mobility'],
        'requires': ['desk'],
    },
    'Stairs-Only Commitment': {
        'when': ['any'],
        'where': ['home', 'work', 'commute'],
        'involves': ['stairs'],
    },
    'One-Song Dance Reset': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['dancing'],
        'requires': ['music'],
        'features': ['solo_friendly', 'no_planning', 'chaos_proof', 'impulse_friendly'],
    },
    'Couch-to-Floor Flow': {
        'when': ['screen_time', 'evening'],
        'where': ['home'],
        'involves': ['mobility'],
        'requires': ['mat'],
    },
    'Kid “Animal Walk” Game': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['animal_walks'],
        'features': ['no_planning', 'chaos_proof', 'family_friendly', 'kid_approved', 'group_activity'],
        'features_replace': True,
    },
    'Balloon Volleyball': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['balloon_volleyball'],
        'requires': ['balloon'],
        'time': '5-15min',
        'features': ['no_planning', 'chaos_proof', 'family_friendly', 'kid_approved', 'group_activity'],
        'features_replace': True,
    },
    'Laundry Lunge Ladder': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['lunges'],
    },
    'Doorframe Row': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['rows'],
        'requires': ['doorframe'],
    },
    '5-Minute EMOM': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['squats'],
        'requires': ['timer'],
        'time': '5-15min',
    },
    'Kitchen Counter Push-Offs': {
        'when': ['meal_prep', 'meal_time'],
        'where': ['home'],
        'involves': ['push_ups'],
        'requires': ['countertop'],
    },
    'SUV Deadlift Drill': {
        'when': ['grocery_shopping'],
        'where': ['grocery', 'outdoors'],
        'involves': ['hip_hinge'],
        'requires': ['grocery_bags'],
    },
    'Desk-Side Band Flow': {
        'when': ['work_break'],
        'where': ['work', 'home'],
        'involves': ['resistance_band'],
        'requires': ['resistance_band'],
        'time': '5-15min',
    },
    'Two-Minute Yard Tidy': {
        'when': ['any'],
        'where': ['home', 'outdoors'],
        'involves': ['yard_work'],
        'requires': ['timer'],
    },
    'Hallway Shuttle': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['walking'],
    },
    'Naptime Mobility': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['mobility'],
        'requires': ['mat'],
        'time': '5-15min',
    },
    'Simmer-and-Stretch': {
        'when': ['meal_prep'],
        'where': ['home'],
        'involves': ['stretching'],
        'requires': ['timer'],
    },
    'Phone-Charging Walk': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['walking'],
        'requires': ['timer'],
    },
    'Car-Wash Calf Raise Sets': {
        'when': ['any'],
        'where': ['travel'],
        'involves': ['calf_raises'],
        'requires': ['timer'],
    },
    '60-Second Luggage Carry': {
        'when': ['any'],
        'where': ['home', 'travel'],
        'involves': ['loaded_carry'],
        'requires': ['bag'],
    },
    'Three-Chore Circuit': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['chores'],
        'requires': ['timer'],
        'time': '5-15min',
    },
    # Section 4
    'Tai Chi Taster': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['tai_chi'],
        'requires': ['video'],
    },
    'Water Walk Session': {
        'when': ['any'],
        'where': ['outdoors'],
        'involves': ['water_walking'],
        'requires': ['pool_access'],
        'contraindications': ['Skip if you lack safe pool access or if your clinician has restricted water exercise.'],
    },
    '“Private Practice” Yoga': {
        'when': ['evening', 'any'],
        'where': ['home'],
        'involves': ['yoga'],
        'requires': ['mat'],
    },
    'Movement-as-Play Scavenger': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['scavenger_hunt'],
        'requires': ['list'],
        'features': ['solo_friendly', 'no_planning', 'chaos_proof', 'impulse_friendly'],
    },
    'Groove While You Cook': {
        'when': ['meal_prep'],
        'where': ['home'],
        'involves': ['dancing'],
        'requires': ['music'],
        'features': ['solo_friendly', 'no_planning', 'chaos_proof', 'impulse_friendly'],
    },
    'Forest Micro-Walk': {
        'when': ['any'],
        'where': ['outdoors'],
        'involves': ['walking'],
    },
    'No-Sweat Pilates Set': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['pilates'],
        'requires': ['mat'],
    },
    'Quiet Balance Box': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['balance'],
        'requires': ['folded_towel', 'chair'],
    },
    '“Boredom Breaker” Playlist': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['dancing'],
        'requires': ['music'],
        'features': ['solo_friendly', 'no_planning', 'chaos_proof', 'impulse_friendly'],
    },
    # Section 5
    'Chair Yoga Spinal Flow': {
        'when': ['any'],
        'where': ['home', 'work'],
        'involves': ['chair_yoga'],
        'requires': ['chair'],
    },
    'Seated Marches': {
        'when': ['any'],
        'where': ['home', 'work'],
        'involves': ['marching'],
        'requires': ['chair'],
    },
    'Wall Sit Lite': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['wall_sit'],
        'requires': ['wall'],
        'effort': 'low',
    },
    'Ankle ABCs': {
        'when': ['any'],
        'where': ['home', 'work'],
        'involves': ['ankle_mobility'],
        'requires': ['chair'],
    },
    'Shoulder Wall Slides': {
        'when': ['any'],
        'where': ['home', 'work'],
        'involves': ['shoulder_mobility'],
        'requires': ['wall'],
    },
    'Gentle Hip Opener': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['stretching'],
        'requires': ['chair'],
    },
    '3-Minute Power March': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['marching'],
        'requires': ['timer'],
    },
    'Outdoor Micro-Dose': {
        'when': ['any'],
        'where': ['outdoors'],
        'involves': ['walking'],
        'requires': ['timer'],
    },
    'Box Breathing & Stretch': {
        'when': ['stress'],
        'where': ['home', 'work'],
        'involves': ['breathing', 'stretching'],
    },
    'Supported Sit-to-Stand': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['sit_to_stand'],
        'requires': ['chair'],
    },
    'Gentle Rowing/Erg Try': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['rowing'],
        'requires': ['rower'],
        'time': '5-15min',
    },
    'Stationary Cycle Smile': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['cycling'],
        'requires': ['bike'],
        'time': '5-15min',
    },
    'Pain Stop Rule Card': {
        'when': ['any'],
        'where': ['any'],
        'involves': ['planning'],
        'requires': ['card'],
        'mechanisms': ['safety', 'self_compassion', 'positive_reinforcement', 'tracking'],
    },
    # Section 6
    'Lift Log Start': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['logging'],
        'requires': ['journal', 'app'],
        'mechanisms': ['tracking', 'self_monitoring', 'competence', 'mastery'],
    },
    'Single-Set Strength': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['strength_training'],
    },
    '60% Day': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['strength_training'],
        'requires': ['weights'],
    },
    '80% Test': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['strength_training'],
        'requires': ['weights'],
        'effort': 'moderate',
    },
    'Tempo Reps': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['strength_training'],
        'requires': ['timer'],
    },
    'Rest-Day Rule': {
        'when': ['any'],
        'where': ['any'],
        'involves': ['recovery_planning'],
        'mechanisms': ['planning', 'self_compassion', 'positive_reinforcement', 'tracking'],
        'effort': 'minimal',
    },
    'Push-Pull-Squat Sampler': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['strength_training'],
        'requires': ['countertop', 'doorframe', 'chair'],
        'time': '5-15min',
    },
    'Ladder Walk-Run': {
        'when': ['any'],
        'where': ['outdoors'],
        'involves': ['walk_run'],
        'time': '5-15min',
    },
    'Bike Ladder': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['cycling'],
        'requires': ['bike'],
        'time': '5-15min',
    },
    'Rower Pyramid': {
        'when': ['any'],
        'where': ['home'],
        'involves': ['rowing'],
        'requires': ['rower'],
        'time': '5-15min',
    },
    'Walk Hills Only': {
        'when': ['any'],
        'where': ['outdoors'],
        'involves': ['walking'],
        'time': '5-15min',
    },
    'Low-Impact Cardio Mix': {
        'when': ['any'],
        'where': ['home', 'outdoors'],
        'involves': ['walking', 'cycling', 'rowing'],
        'time': '5-15min',
    },
    'Step Count Bump': {
        'when': ['any'],
        'where': ['outdoors', 'home'],
        'involves': ['walking'],
        'requires': ['timer'],
        'time': '5-15min',
    },
    'Stride Cadence Drill': {
        'when': ['any'],
        'where': ['outdoors', 'home'],
        'involves': ['walking'],
        'requires': ['timer'],
    },
    'Recovery Walk & Log': {
        'when': ['any'],
        'where': ['outdoors'],
        'involves': ['walking', 'logging'],
        'requires': ['journal'],
        'time': '5-15min',
    },
    # Section 7
    'After-Dinner Stroll': {
        'when': ['post_meal', 'evening'],
        'where': ['outdoors'],
        'involves': ['walking'],
    },
    'Wake-Up Window Stretch': {
        'when': ['morning'],
        'where': ['home'],
        'involves': ['stretching'],
        'requires': ['timer'],
    },
    'Commute Grip Trainer': {
        'when': ['commute'],
        'where': ['commute'],
        'involves': ['grip_training'],
        'requires': ['towel'],
    },
    'Printer Plank': {
        'when': ['work_break'],
        'where': ['work'],
        'involves': ['plank'],
        'requires': ['mat', 'timer'],
    },
    'Bathroom Break Squats': {
        'when': ['any'],
        'where': ['home', 'work'],
        'involves': ['squats'],
    },
    'Email Send Stretch': {
        'when': ['work_break'],
        'where': ['work'],
        'involves': ['stretching'],
    },
    'Unpack & Lunge': {
        'when': ['evening'],
        'where': ['home'],
        'involves': ['lunges'],
    },
    'Playlist Bookends': {
        'when': ['morning', 'night'],
        'where': ['home'],
        'involves': ['dancing', 'stretching'],
        'requires': ['music'],
        'time': '5-15min',
    },
    'Incremental Dose Add': {
        'when': ['any'],
        'where': ['any'],
        'involves': ['movement'],
        'mechanisms': ['habit_stacking', 'tracking', 'positive_reinforcement', 'self_monitoring'],
    },
    'Two-Minute “Celebrate & Save”': {
        'when': ['any'],
        'where': ['any'],
        'involves': ['tracking'],
        'requires': ['journal', 'app'],
        'mechanisms': ['tracking', 'positive_reinforcement', 'reward', 'self_monitoring'],
    },
}


def parse_raw():
    raw = RAW_PATH.read_text()
    entries = []
    current_section = None
    block_lines = []
    for line in raw.splitlines():
        if line.startswith('Section '):
            current_section = line.strip()
            continue
        if re.match(r'\d+\)', line.strip()):
            if block_lines:
                entries.append((current_section, block_lines))
                block_lines = []
            block_lines.append(line)
        else:
            block_lines.append(line)
    if block_lines:
        entries.append((current_section, block_lines))
    parsed = []
    for section, lines in entries:
        header = lines[0].strip()
        m = re.match(r'(\d+)\)\s*(.*)', header)
        if not m:
            raise ValueError(f'Bad header {header!r}')
        idx = int(m.group(1))
        title = m.group(2).strip()
        summary_line = next((ln for ln in lines if ln.strip().startswith('summary:')), None)
        if summary_line is None:
            raise ValueError(f'Missing summary for {title}')
        summary = summary_line.split('summary:', 1)[1].strip()
        try:
            details_idx = lines.index('details_md:')
        except ValueError:
            raise ValueError(f'Missing details for {title}')
        detail_lines = lines[details_idx + 1 :]
        while detail_lines and not detail_lines[0].strip():
            detail_lines = detail_lines[1:]
        experiment_line = next((ln for ln in detail_lines if ln.startswith('The Experiment:')), None)
        why_line = next((ln for ln in detail_lines if ln.startswith('Why it Works:')), None)
        how_idx = None
        for i, ln in enumerate(detail_lines):
            if ln.startswith('How to Try It:'):
                how_idx = i
                break
        if experiment_line is None or why_line is None or how_idx is None:
            raise ValueError(f'Missing detail sections for {title}')
        experiment = experiment_line.split('The Experiment:', 1)[1].strip()
        why = why_line.split('Why it Works:', 1)[1].strip()
        bullet_lines = [ln.strip() for ln in detail_lines[how_idx + 1 :] if ln.strip()]
        parsed.append({
            'section': section,
            'index': idx,
            'title': title,
            'summary': summary,
            'experiment': experiment,
            'why': why,
            'how': bullet_lines,
        })
    return parsed


def build_details(tip):
    bullets = '\n'.join(f"• {item}" for item in tip['how'])
    return (
        f"**The Experiment:** {tip['experiment']}\n\n"
        f"**Why it Works:** {tip['why']}\n\n"
        f"**How to Try It:**\n{bullets}"
    )


def merge_lists(base, extra, replace=False):
    if extra is None:
        return list(base)
    if replace:
        return list(dict.fromkeys(extra))
    base_set = list(dict.fromkeys(base))
    for item in extra:
        if item not in base_set:
            base_set.append(item)
    return base_set


def generate():
    tips = []
    for tip in parse_raw():
        defaults = SECTION_DEFAULTS[tip['section']]
        overrides = TIP_OVERRIDES.get(tip['title'], {})
        goals = overrides.get('goals', defaults['goals'])
        helps_with = overrides.get('helps_with', defaults.get('helps_with'))
        mechanisms = merge_lists(defaults['mechanisms'], overrides.get('mechanisms'))
        features = merge_lists(
            defaults['features'],
            overrides.get('features'),
            overrides.get('features_replace', False),
        )
        tip_entry = {
            'tip_id': str(uuid5(NAMESPACE_URL, f"fitness:{tip['title']}")),
            'summary': tip['summary'],
            'details_md': build_details(tip),
            'area': 'fitness',
            'goals': goals,
            'helps_with': helps_with,
            'contraindications': overrides.get('contraindications', [COMMON_CONTRA]),
            'mechanisms': mechanisms,
            'effort': overrides.get('effort', defaults['effort']),
            'time': overrides.get('time', defaults['time']),
            'cost': '$',
            'when': overrides.get('when', ['any']),
            'where': overrides.get('where', ['home']),
            'involves': overrides.get('involves'),
            'requires': overrides.get('requires'),
            'features': features,
            'difficulty': overrides.get('difficulty', defaults['difficulty']),
            'source': overrides.get('source', 'coach_curated'),
            'sustainability': overrides.get('sustainability', defaults['sustainability']),
        }
        # remove None lists
        if tip_entry['helps_with'] is None:
            tip_entry.pop('helps_with')
        if tip_entry['involves'] is None:
            tip_entry.pop('involves')
        if tip_entry['requires'] is None:
            tip_entry.pop('requires')
        tips.append(tip_entry)
    return tips


def format_ts(tips):
    import json
    formatted_items = []
    for tip in tips:
        obj = json.dumps(tip, ensure_ascii=False, indent=4)
        formatted_items.append(obj)
    joined = ',\n  '.join(formatted_items)
    return (
        "import { SimplifiedTip } from '../types/simplifiedTip';\n\n"
        "export const FITNESS_SIMPLIFIED_TIPS: SimplifiedTip[] = [\n  "
        + joined
        + '\n];\n'
    )


def main():
    tips = generate()
    OUTPUT_PATH.write_text(format_ts(tips), encoding='utf-8')
    print(f'Wrote {len(tips)} tips to {OUTPUT_PATH}')


if __name__ == '__main__':
    main()
