import re
import uuid
from pathlib import Path

RAW_PATH = Path('data/raw_relationship_tips.txt')
OUTPUT_PATH = Path('data/relationshipTips_persona_playbook.ts')

raw_text = RAW_PATH.read_text()
filtered_lines = []
for line in raw_text.splitlines():
    if re.match(r'^P\d+\s+—', line.strip()):
        continue
    filtered_lines.append(line)
cleaned = '\n'.join(filtered_lines)

pattern = re.compile(r'Tip (\d+) [\u2013-] (.*?)\nsummary: (.*?)\ndetails_md:\n(.*?)(?=(?:\nTip \d+)|\Z)', re.S)
parsed = {}
for match in pattern.finditer(cleaned):
    number = int(match.group(1))
    title = match.group(2).strip()
    summary = match.group(3).strip()
    block = match.group(4).strip()
    exp_match = re.search(r'The Experiment:(.*?)Why it Works:', block, re.S)
    why_match = re.search(r'Why it Works:(.*?)How to Try It:', block, re.S)
    how_match = re.search(r'How to Try It:(.*)', block, re.S)
    if not (exp_match and why_match and how_match):
        raise ValueError(f'Missing sections for tip {number}')
    experiment = exp_match.group(1).strip()
    why = why_match.group(1).strip()
    how_raw = how_match.group(1).strip()
    how_lines = [line.strip() for line in how_raw.splitlines() if line.strip()]
    how_lines = [line for line in how_lines if not re.match(r'^P\d+\s+—', line)]
    details_lines = [f"**The Experiment:** {experiment}", '', f"**Why it Works:** {why}", '', "**How to Try It:**"]
    for line in how_lines:
        details_lines.append(f"• {line}")
    details_md = '\\n'.join(details_lines)
    parsed[number] = {
        'title': title,
        'summary': summary,
        'details_md': details_md,
    }

RELATIONSHIP_FILES = [
    path for path in Path('data').glob('relationshipTips_*.ts')
    if path.name != OUTPUT_PATH.name
]

def collect_values(field_name: str) -> set[str]:
    values: set[str] = set()
    pattern = re.compile(rf'"{field_name}"\s*:\s*\[(.*?)\]', re.S)
    for file_path in RELATIONSHIP_FILES:
        text = file_path.read_text()
        for match in pattern.finditer(text):
            for value in re.findall(r'"([^\"]+)"', match.group(1)):
                values.add(value)
    return values

ALLOWED_VALUES = {
    'goals': collect_values('goals'),
    'helps_with': collect_values('helps_with'),
    'mechanisms': collect_values('mechanisms'),
    'features': collect_values('features'),
    'involves': collect_values('involves'),
}

PERSONA_DEFAULTS = {
    'p1': {
        'area': 'relationships',
        'goals': ['better_communication', 'conflict_resolution', 'emotional_intimacy'],
        'helps_with': ['defensiveness', 'misunderstandings', 'emotional_distance'],
        'contraindications': [],
        'mechanisms': ['communication_technique', 'emotional_regulation', 'ritual_building'],
        'cost': '$',
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'daily',
    },
    'p2': {
        'area': 'relationships',
        'goals': ['conflict_resolution', 'repair', 'emotional_regulation'],
        'helps_with': ['emotional_flooding', 'escalation', 'anger'],
        'contraindications': [],
        'mechanisms': ['nervous_system_regulation', 'time_boundary', 'safety_signaling'],
        'cost': '$',
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'as_needed',
    },
    'p3': {
        'area': 'relationships',
        'goals': ['boundaries', 'assertiveness', 'self_trust'],
        'helps_with': ['people_pleasing', 'resentment', 'anxiety'],
        'contraindications': [],
        'mechanisms': ['boundary_setting', 'assertiveness', 'self_trust_building'],
        'cost': '$',
        'difficulty': 3,
        'source': 'coach_curated',
        'sustainability': 'weekly',
    },
    'p4': {
        'area': 'relationships',
        'goals': ['quality_time', 'prioritization', 'daily_connection'],
        'helps_with': ['busy_schedules', 'disconnection', 'overwhelm'],
        'contraindications': [],
        'mechanisms': ['ritual_building', 'time_protection', 'shared_planning'],
        'cost': '$',
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'weekly',
    },
    'p5': {
        'area': 'relationships',
        'goals': ['friendship', 'confidence', 'individual_friendships'],
        'helps_with': ['social_isolation', 'avoidance', 'anxiety'],
        'contraindications': [],
        'mechanisms': ['confidence_building', 'anxiety_tolerance', 'connection'],
        'cost': '$',
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'weekly',
    },
    'p6': {
        'area': 'relationships',
        'goals': ['dating', 'self_trust', 'safety_building'],
        'helps_with': ['anxiety', 'uncertainty', 'overwhelm'],
        'contraindications': [],
        'mechanisms': ['self_reflection', 'self_trust_building', 'safety_signaling'],
        'cost': '$',
        'difficulty': 2,
        'source': 'coach_curated',
        'sustainability': 'weekly',
    },
}

INTERACTION_PRESETS = {
    'soft_start': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any', 'during_conflict'],
        'where': ['any'],
        'involves': ['conversation', 'language_tool'],
        'features': ['communication_tool', 'no_planning', 'chaos_proof'],
    },
    'reflective_listening': {
        'effort': 'minimal',
        'time': '5-15min',
        'when': ['any', 'during_conversation'],
        'where': ['any'],
        'involves': ['conversation', 'listening'],
        'features': ['conversation_deepener', 'presence_enforcer'],
        'mechanisms': ['active_listening', 'curiosity_practice', 'validation'],
    },
    'repair_signal': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any', 'during_conflict'],
        'where': ['any'],
        'involves': ['conversation', 'signals', 'repair'],
        'features': ['repair_tool', 'chaos_proof', 'no_planning'],
        'mechanisms': ['pattern_interrupt', 'safety_signaling', 'targeted_repair'],
    },
    'bedtime_appreciation': {
        'effort': 'minimal',
        'time': '5-15min',
        'when': ['evening', 'before_bed'],
        'where': ['home'],
        'involves': ['ritual', 'gratitude', 'conversation'],
        'features': ['bedtime_ritual', 'appreciation_ritual', 'positive_focus'],
        'mechanisms': ['gratitude', 'ritual_building', 'daily_appreciation'],
        'sustainability': 'daily',
    },
    'morning_sync': {
        'effort': 'low',
        'time': '5-15min',
        'when': ['morning'],
        'where': ['home'],
        'involves': ['planning', 'conversation', 'check_in'],
        'features': ['day_starter', 'time_bounded', 'couples_activity'],
        'mechanisms': ['shared_planning', 'daily_alignment', 'mutual_support'],
    },
    'async_ping': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['mid_day', 'any'],
        'where': ['any'],
        'involves': ['texting', 'appreciation'],
        'features': ['async_tool', 'connection_builder', 'remote_friendly'],
        'mechanisms': ['async_sharing', 'daily_alignment', 'appreciation'],
    },
    'landing_ritual': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['after_work', 'transition'],
        'where': ['home'],
        'involves': ['ritual', 'transition', 'breathing'],
        'features': ['boundary_ritual', 'daily_practice', 'calming'],
        'mechanisms': ['ritual_creation', 'nervous_system_regulation', 'boundary_setting'],
    },
    'plan_dream': {
        'effort': 'low',
        'time': '15-30min',
        'when': ['weekly', 'planning'],
        'where': ['home'],
        'involves': ['planning', 'calendar', 'conversation'],
        'features': ['calendar_integration', 'commitment_tool', 'anticipation_builder'],
        'mechanisms': ['shared_planning', 'time_protection', 'dream_sharing'],
    },
    'pause_signal': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any', 'during_conflict'],
        'where': ['any'],
        'involves': ['signals', 'repair'],
        'features': ['repair_tool', 'communication_tool', 'chaos_proof'],
    },
    'phone_free_walk': {
        'effort': 'low',
        'time': '15-30min',
        'when': ['evening'],
        'where': ['outdoors'],
        'involves': ['walking', 'device_management', 'togetherness'],
        'features': ['device_boundary', 'movement_based', 'connection_builder'],
        'mechanisms': ['movement', 'presence', 'dedicated_time'],
    },
    'script_build': {
        'effort': 'low',
        'time': '5-15min',
        'when': ['planning'],
        'where': ['home', 'any'],
        'involves': ['writing', 'notes'],
        'features': ['clarity_builder', 'confidence_builder', 'communication_tool'],
        'mechanisms': ['advance_planning', 'clarity', 'confidence_building'],
    },
    'listening_drill': {
        'effort': 'low',
        'time': '5-15min',
        'when': ['any'],
        'where': ['home', 'any'],
        'involves': ['timer', 'conversation', 'listening'],
        'features': ['time_bounded', 'conversation_deepener', 'skill_builder'],
        'mechanisms': ['turn_taking', 'validation', 'curiosity'],
    },
    'mapping_exercise': {
        'effort': 'low',
        'time': '15-30min',
        'when': ['planning'],
        'where': ['home'],
        'involves': ['writing', 'reflection'],
        'features': ['clarity_tool', 'clarity_builder', 'collaboration_tool'],
        'mechanisms': ['pattern_recognition', 'assumption_disclosure', 'shared_planning'],
    },
    'chore_sync': {
        'effort': 'low',
        'time': '10-15min',
        'when': ['evening'],
        'where': ['home'],
        'involves': ['chores', 'teamwork'],
        'features': ['bonding_activity', 'practical', 'daily_ritual'],
        'mechanisms': ['burden_sharing', 'teamwork', 'ritual_building'],
    },
    'breath_reset': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['breathing', 'mindfulness'],
        'features': ['calming_tool', 'chaos_proof', 'no_planning'],
        'mechanisms': ['breathing_technique', 'nervous_system_regulation', 'pause_technique'],
    },
    'repair_menu': {
        'effort': 'low',
        'time': '10-15min',
        'when': ['planning'],
        'where': ['home'],
        'involves': ['writing', 'repair', 'sharing'],
        'features': ['repair_tool', 'clarity_builder', 'confidence_builder'],
        'mechanisms': ['shared_planning', 'clarity', 'targeted_repair'],
    },
    'evening_debrief': {
        'effort': 'low',
        'time': '5-15min',
        'when': ['evening'],
        'where': ['home'],
        'involves': ['conversation', 'reflection'],
        'features': ['bedtime_ritual', 'positive_focus', 'connection_builder'],
        'mechanisms': ['daily_alignment', 'gratitude', 'emotional_sharing'],
    },
    'stress_conversation': {
        'effort': 'low',
        'time': '15-30min',
        'when': ['evening', 'any'],
        'where': ['home'],
        'involves': ['conversation', 'listening'],
        'features': ['time_bounded', 'clarity_builder', 'empathy_builder'],
        'mechanisms': ['joint_processing', 'validation', 'emotional_sharing'],
    },
    'turn_toward': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['gestures', 'conversation'],
        'features': ['connection_builder', 'daily_practice', 'chaos_proof'],
        'mechanisms': ['undivided_attention', 'connection', 'positive_reinforcement'],
    },
    'give_reply': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['conversation'],
        'features': ['communication_tool', 'no_planning', 'chaos_proof'],
        'mechanisms': ['self_awareness', 'validation', 'communication_technique'],
    },
    'reminisce': {
        'effort': 'low',
        'time': '5-15min',
        'when': ['evening', 'any'],
        'where': ['home'],
        'involves': ['memory', 'photos', 'conversation'],
        'features': ['positive_focus', 'connection_builder', 'memory_sharing'],
        'mechanisms': ['memory_activation', 'shared_experience', 'gratitude'],
    },
    'agenda_statement': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['before_conversation'],
        'where': ['any'],
        'involves': ['planning', 'conversation'],
        'features': ['clarity_tool', 'chaos_proof', 'communication_tool'],
        'mechanisms': ['clarity', 'intention_setting', 'conflict_prevention'],
    },
    'collab_reply': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['conversation'],
        'features': ['collaboration_tool', 'communication_tool', 'no_planning'],
        'mechanisms': ['collaboration', 'validation', 'practical_solution'],
    },
    'timeout_protocol': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['during_conflict'],
        'where': ['any'],
        'involves': ['repair', 'signals', 'timer'],
        'features': ['calming_tool', 'repair_tool', 'structured'],
        'mechanisms': ['time_boundary', 'safety_signaling', 'nervous_system_regulation'],
    },
    'cold_reset': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['home'],
        'involves': ['breathing'],
        'features': ['calming_tool', 'stress_relief', 'self_care'],
        'mechanisms': ['nervous_system_regulation', 'pattern_interrupt', 'physical_grounding'],
    },
    'vagal_tone': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['breathing'],
        'features': ['calming_tool', 'no_planning', 'self_care'],
        'mechanisms': ['nervous_system_regulation', 'breathing_technique', 'pattern_interrupt'],
    },
    'flag_signal': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['planning'],
        'where': ['home'],
        'involves': ['signals', 'agreement'],
        'features': ['structured', 'clarity_builder', 'repair_tool'],
        'mechanisms': ['agreement', 'safety_signaling', 'pattern_recognition'],
    },
    'reentry_script': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['after_conflict'],
        'where': ['any'],
        'involves': ['writing', 'repair'],
        'features': ['repair_tool', 'communication_tool', 'clarity_builder'],
        'mechanisms': ['clarity', 'targeted_repair', 'self_awareness'],
    },
    'self_monitor': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['self_reflection', 'reflection'],
        'features': ['self_awareness_builder', 'self_care', 'stress_tool'],
        'mechanisms': ['self_awareness', 'self_correction', 'nervous_system_regulation'],
    },
    'pattern_label': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['during_conflict'],
        'where': ['any'],
        'involves': ['conversation', 'reflection'],
        'features': ['clarity_tool', 'repair_tool', 'communication_tool'],
        'mechanisms': ['pattern_recognition', 'assumption_disclosure', 'safety_signaling'],
    },
    'soft_reveal': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['after_conflict'],
        'where': ['any'],
        'involves': ['vulnerability', 'conversation'],
        'features': ['communication_tool', 'empathy_builder', 'no_planning'],
        'mechanisms': ['vulnerability', 'emotion_recognition', 'targeted_repair'],
    },
    'micro_journal': {
        'effort': 'low',
        'time': '0-5min',
        'when': ['any'],
        'where': ['home', 'any'],
        'involves': ['writing', 'reflection'],
        'features': ['self_awareness_builder', 'clarity_builder', 'self_care'],
        'mechanisms': ['self_awareness', 'pattern_recognition', 'regular_reflection'],
    },
    'environment_shift': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['during_conflict'],
        'where': ['home'],
        'involves': ['movement'],
        'features': ['calming_tool', 'stress_relief', 'stress_tool'],
        'mechanisms': ['pattern_interrupt', 'nervous_system_regulation', 'transition_support'],
    },
    'repair_acceptance': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['during_conflict'],
        'where': ['any'],
        'involves': ['conversation', 'repair'],
        'features': ['repair_tool', 'empathy_builder', 'chaos_proof'],
        'mechanisms': ['validation', 'targeted_repair', 'positive_reinforcement'],
    },
    'calm_voice': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['during_conflict'],
        'where': ['any'],
        'involves': ['conversation', 'mindfulness'],
        'features': ['chaos_proof', 'communication_tool', 'no_planning'],
        'mechanisms': ['communication_technique', 'self_awareness', 'nervous_system_regulation'],
    },
    'conversation_scope': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['during_conflict'],
        'where': ['any'],
        'involves': ['planning', 'conversation'],
        'features': ['structured', 'clarity_tool', 'communication_tool'],
        'mechanisms': ['containment', 'clarity', 'time_boundary'],
    },
    'personal_soothing': {
        'effort': 'minimal',
        'time': '5-15min',
        'when': ['any'],
        'where': ['home'],
        'involves': ['music'],
        'features': ['calming_tool', 'self_care', 'stress_relief'],
        'mechanisms': ['sensory_engagement', 'nervous_system_regulation', 'ritual_creation'],
    },
    'co_regulation': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['after_conflict'],
        'where': ['home'],
        'involves': ['breathing', 'physical_connection'],
        'features': ['calming_tool', 'repair_tool', 'intimacy_builder'],
        'mechanisms': ['co_regulation', 'breathing_technique', 'safety_signaling'],
    },
    'conversation_cap': {
        'effort': 'minimal',
        'time': '15-30min',
        'when': ['during_conflict'],
        'where': ['home', 'any'],
        'involves': ['timer', 'conversation'],
        'features': ['structured', 'time_bounded', 'clarity_builder'],
        'mechanisms': ['time_boundary', 'self_awareness', 'clarity'],
    },
    'reassurance': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['during_conflict'],
        'where': ['any'],
        'involves': ['conversation', 'touch'],
        'features': ['connection_builder', 'communication_tool', 'calming'],
        'mechanisms': ['safety_signaling', 'validation', 'trust_building'],
    },
    'follow_up': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['after_conflict'],
        'where': ['any'],
        'involves': ['planning', 'texting'],
        'features': ['accountability', 'clarity_builder', 'commitment_tool'],
        'mechanisms': ['advance_planning', 'accountability', 'targeted_repair'],
    },
    'assertive_request': {
        'effort': 'low',
        'time': '5-15min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['writing', 'conversation', 'boundaries'],
        'features': ['assertiveness_practice', 'communication_tool', 'clarity_builder'],
    },
    'assertive_no': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['as_needed'],
        'where': ['any'],
        'involves': ['boundaries', 'conversation'],
        'features': ['assertiveness_practice', 'boundary_tool', 'no_planning'],
    },
    'boundary_reinforcement': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['as_needed'],
        'where': ['any'],
        'involves': ['boundaries', 'conversation'],
        'features': ['boundary_skill', 'assertiveness_practice', 'clarity_tool'],
        'mechanisms': ['boundary_practice', 'assertiveness', 'consistency'],
    },
    'language_swap': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['language', 'conversation'],
        'features': ['communication_tool', 'no_planning', 'confidence_builder'],
        'mechanisms': ['language_shift', 'self_awareness', 'confidence_building'],
    },
    'values_action': {
        'effort': 'low',
        'time': '10-15min',
        'when': ['any'],
        'where': ['home', 'any'],
        'involves': ['writing', 'reflection'],
        'features': ['clarity_builder', 'confidence_builder', 'identity_tool'],
        'mechanisms': ['value_acknowledgment', 'self_awareness', 'actionable_requests'],
    },
    'confidence_rehearsal': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['planning'],
        'where': ['home'],
        'involves': ['verbalization', 'conversation'],
        'features': ['confidence_builder', 'clarity_builder', 'self_care'],
        'mechanisms': ['confidence_building', 'self_awareness', 'communication_technique'],
    },
    'goal_focus': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['during_conversation'],
        'where': ['any'],
        'involves': ['notes', 'conversation'],
        'features': ['clarity_tool', 'no_planning', 'communication_tool'],
        'mechanisms': ['self_awareness', 'clarity', 'shared_focus'],
    },
    'consent_check': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['before_conversation'],
        'where': ['any'],
        'involves': ['conversation', 'boundaries'],
        'features': ['clarity_builder', 'communication_tool', 'respect_practice'],
        'mechanisms': ['boundary_setting', 'safety_signaling', 'clarity'],
    },
    'money_boundary': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['planning'],
        'where': ['home', 'any'],
        'involves': ['budgeting', 'boundaries'],
        'features': ['clarity_builder', 'boundary_tool', 'stress_relief'],
        'mechanisms': ['boundary_setting', 'clarity', 'transparency'],
    },
    'space_request': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['texting', 'boundaries'],
        'features': ['clarity_builder', 'communication_tool', 'respect_practice'],
        'mechanisms': ['boundary_setting', 'safety_signaling', 'clarity'],
    },
    'response_delay': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['as_needed'],
        'where': ['any'],
        'involves': ['planning', 'boundaries'],
        'features': ['boundary_tool', 'calming_tool', 'anxiety_reducer'],
        'mechanisms': ['delayed_discussion', 'self_awareness', 'boundary_setting'],
    },
    'written_boundary': {
        'effort': 'low',
        'time': '5-15min',
        'when': ['planning'],
        'where': ['home', 'work'],
        'involves': ['writing', 'texting'],
        'features': ['clarity_builder', 'assertiveness_practice', 'confidence_builder'],
        'mechanisms': ['clarity', 'assertiveness', 'boundary_setting'],
    },
    'positive_request': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['conversation', 'language_tool'],
        'features': ['communication_tool', 'no_planning', 'clarity_builder'],
        'mechanisms': ['direct_language', 'clarity', 'collaboration'],
    },
    'focus_block': {
        'effort': 'low',
        'time': '30-45min',
        'when': ['any'],
        'where': ['home'],
        'involves': ['device_management', 'ritual', 'conversation'],
        'features': ['device_boundary', 'time_bounded', 'connection_builder'],
        'mechanisms': ['time_protection', 'ritual_building', 'presence'],
    },
    'shared_planner': {
        'effort': 'low',
        'time': '15-30min',
        'when': ['planning'],
        'where': ['home'],
        'involves': ['calendar', 'planning'],
        'features': ['calendar_integration', 'commitment_tool', 'clarity_builder'],
        'mechanisms': ['shared_planning', 'time_protection', 'accountability'],
    },
    'family_huddle': {
        'effort': 'low',
        'time': '10-15min',
        'when': ['evening'],
        'where': ['home'],
        'involves': ['family', 'meeting', 'planning'],
        'features': ['family_builder', 'structured', 'time_bounded'],
        'mechanisms': ['shared_planning', 'teamwork', 'clarity'],
    },
    'landing_with_kids': {
        'effort': 'low',
        'time': '15-30min',
        'when': ['after_work'],
        'where': ['home'],
        'involves': ['parenting', 'ritual', 'attention'],
        'features': ['family_ritual', 'work_transition', 'connection_builder'],
        'mechanisms': ['ritual_building', 'playful_connection', 'presence'],
    },
    'device_boundary_ritual': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['mealtime'],
        'where': ['home'],
        'involves': ['device_management', 'ritual'],
        'features': ['device_boundary', 'family_ritual', 'clarity_tool'],
        'mechanisms': ['environmental_design', 'ritual_building', 'presence'],
    },
    'async_voice': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['mid_day'],
        'where': ['any'],
        'involves': ['voice_message', 'appreciation'],
        'features': ['async_tool', 'connection_builder', 'remote_friendly'],
        'mechanisms': ['voice_connection', 'daily_alignment', 'gratitude'],
    },
    'micro_date': {
        'effort': 'low',
        'time': '15-30min',
        'when': ['weekly'],
        'where': ['home'],
        'involves': ['date', 'coffee'],
        'features': ['home_date', 'commitment_tool', 'anticipation_builder'],
        'mechanisms': ['time_protection', 'romantic_gesture', 'presence'],
    },
    'dream_jar': {
        'effort': 'low',
        'time': '5-15min',
        'when': ['evening'],
        'where': ['home'],
        'involves': ['jar', 'questions', 'ritual'],
        'features': ['creative', 'positive_focus', 'ritual_based'],
        'mechanisms': ['dream_sharing', 'curiosity', 'shared_purpose'],
    },
    'weekend_block': {
        'effort': 'low',
        'time': '30-60min',
        'when': ['weekend'],
        'where': ['home', 'outdoors'],
        'involves': ['calendar', 'quality_time'],
        'features': ['time_bounded', 'commitment_tool', 'anticipation_builder'],
        'mechanisms': ['shared_planning', 'time_protection', 'prioritization'],
    },
    'micro_exposure': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['public'],
        'involves': ['socializing', 'conversation'],
        'features': ['confidence_builder', 'courage_practice', 'chaos_proof'],
        'mechanisms': ['anxiety_tolerance', 'confidence_building', 'presence_practice'],
    },
    'planning_action': {
        'effort': 'low',
        'time': '5-15min',
        'when': ['planning'],
        'where': ['home'],
        'involves': ['calendar', 'planning'],
        'features': ['confidence_builder', 'calendar_integration', 'anticipation_builder'],
        'mechanisms': ['shared_planning', 'commitment', 'anticipation_building'],
    },
    'micro_invite': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['texting', 'asking_out'],
        'features': ['confidence_builder', 'courage_practice', 'clarity_builder'],
        'mechanisms': ['assertiveness', 'confidence_building', 'connection'],
    },
    'volunteer': {
        'effort': 'low',
        'time': '15-30min',
        'when': ['planning'],
        'where': ['online'],
        'involves': ['planning', 'commitment'],
        'features': ['value_focused', 'confidence_builder', 'connection_builder'],
        'mechanisms': ['value_sharing', 'commitment', 'connection'],
    },
    'reflection_log': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['after_event'],
        'where': ['any'],
        'involves': ['writing', 'reflection'],
        'features': ['self_awareness_builder', 'clarity_builder', 'self_care'],
        'mechanisms': ['regular_reflection', 'self_awareness', 'growth_mindset'],
    },
    'energy_buffer': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['planning'],
        'where': ['any'],
        'involves': ['calendar', 'self_care'],
        'features': ['self_care', 'stress_relief', 'calendar_integration'],
        'mechanisms': ['energy_attunement', 'self_awareness', 'time_protection'],
    },
    'drop_safety': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['during_conversation'],
        'where': ['any'],
        'involves': ['presence', 'courage'],
        'features': ['confidence_builder', 'courage_practice', 'no_planning'],
        'mechanisms': ['anxiety_tolerance', 'presence', 'confidence_building'],
    },
    'micro_host': {
        'effort': 'low',
        'time': '30-45min',
        'when': ['weekly'],
        'where': ['home'],
        'involves': ['socializing', 'planning'],
        'features': ['confidence_builder', 'structured', 'anticipation_builder'],
        'mechanisms': ['shared_planning', 'confidence_building', 'connection'],
    },
    'pacing_rules': {
        'effort': 'low',
        'time': '10-15min',
        'when': ['planning'],
        'where': ['home'],
        'involves': ['writing', 'reflection'],
        'features': ['clarity_builder', 'structured', 'confidence_builder'],
        'mechanisms': ['self_awareness', 'clarity', 'boundary_setting'],
    },
    'self_reflection': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['home', 'any'],
        'involves': ['writing', 'reflection'],
        'features': ['self_awareness_builder', 'self_care', 'clarity_builder'],
        'mechanisms': ['self_awareness', 'regular_reflection', 'identity_building'],
    },
    'mindful_presence': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['during_date'],
        'where': ['out'],
        'involves': ['conversation', 'mindfulness'],
        'features': ['presence_enforcer', 'chaos_proof', 'no_planning'],
        'mechanisms': ['self_awareness', 'presence', 'anxiety_tolerance'],
    },
    'vulnerability_share': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['during_date'],
        'where': ['any'],
        'involves': ['sharing', 'conversation'],
        'features': ['communication_tool', 'empathy_builder', 'connection_builder'],
        'mechanisms': ['vulnerability', 'storytelling', 'trust_building'],
    },
    'safety_plan': {
        'effort': 'low',
        'time': '5-15min',
        'when': ['planning'],
        'where': ['home'],
        'involves': ['texting', 'planning'],
        'features': ['calming_tool', 'confidence_builder', 'clarity_builder'],
        'mechanisms': ['safety_signaling', 'boundary_setting', 'self_trust_building'],
    },
    'mindful_text': {
        'effort': 'minimal',
        'time': '0-5min',
        'when': ['any'],
        'where': ['any'],
        'involves': ['texting', 'mindfulness'],
        'features': ['communication_tool', 'presence_enforcer', 'no_planning'],
        'mechanisms': ['self_awareness', 'intention_setting', 'restraint'],
    },
    'values_list': {
        'effort': 'low',
        'time': '10-15min',
        'when': ['planning'],
        'where': ['home'],
        'involves': ['reflection', 'writing'],
        'features': ['clarity_builder', 'confidence_builder', 'identity_tool'],
        'mechanisms': ['value_acknowledgment', 'self_awareness', 'clarity'],
    },
}

TIP_CONFIGS = {}
for i in range(1, 26):
    TIP_CONFIGS[i] = {'persona': 'p1'}
for i in range(26, 51):
    TIP_CONFIGS[i] = {'persona': 'p2'}
for i in range(51, 66):
    TIP_CONFIGS[i] = {'persona': 'p3'}
for i in range(66, 81):
    TIP_CONFIGS[i] = {'persona': 'p4'}
for i in range(81, 91):
    TIP_CONFIGS[i] = {'persona': 'p5'}
for i in range(91, 101):
    TIP_CONFIGS[i] = {'persona': 'p6'}

TIP_TYPES = {
    1: 'soft_start', 2: 'reflective_listening', 3: 'repair_signal', 4: 'bedtime_appreciation',
    5: 'morning_sync', 6: 'async_ping', 7: 'landing_ritual', 8: 'plan_dream', 9: 'flag_signal',
    10: 'phone_free_walk', 11: 'script_build', 12: 'async_ping', 13: 'listening_drill',
    14: 'mapping_exercise', 15: 'chore_sync', 16: 'landing_ritual', 17: 'repair_menu',
    18: 'evening_debrief', 19: 'soft_start', 20: 'stress_conversation', 21: 'turn_toward',
    22: 'give_reply', 23: 'reminisce', 24: 'agenda_statement', 25: 'collab_reply',
    26: 'timeout_protocol', 27: 'breath_reset', 28: 'cold_reset', 29: 'vagal_tone',
    30: 'flag_signal', 31: 'reentry_script', 32: 'self_monitor', 33: 'self_monitor',
    34: 'pattern_label', 35: 'soft_reveal', 36: 'micro_journal', 37: 'environment_shift',
    38: 'repair_acceptance', 39: 'calm_voice', 40: 'timeout_protocol', 41: 'timeout_protocol',
    42: 'reflective_listening', 43: 'conversation_scope', 44: 'personal_soothing',
    45: 'repair_acceptance', 46: 'co_regulation', 47: 'repair_signal', 48: 'conversation_cap',
    49: 'reassurance', 50: 'follow_up',
    51: 'assertive_request', 52: 'assertive_no', 53: 'boundary_reinforcement',
    54: 'language_swap', 55: 'values_action', 56: 'confidence_rehearsal', 57: 'assertive_request',
    58: 'goal_focus', 59: 'consent_check', 60: 'money_boundary', 61: 'space_request',
    62: 'script_build', 63: 'response_delay', 64: 'written_boundary', 65: 'positive_request',
    66: 'focus_block', 67: 'chore_sync', 68: 'plan_dream', 69: 'phone_free_walk', 70: 'async_ping',
    71: 'shared_planner', 72: 'bedtime_appreciation', 73: 'family_huddle', 74: 'landing_with_kids',
    75: 'device_boundary_ritual', 76: 'async_voice', 77: 'micro_date', 78: 'dream_jar',
    79: 'landing_ritual', 80: 'plan_dream',
    81: 'micro_exposure', 82: 'async_ping', 83: 'planning_action', 84: 'micro_invite',
    85: 'script_build', 86: 'volunteer', 87: 'reflection_log', 88: 'energy_buffer',
    89: 'drop_safety', 90: 'micro_host',
    91: 'pacing_rules', 92: 'self_reflection', 93: 'mindful_presence', 94: 'reflection_log',
    95: 'vulnerability_share', 96: 'breath_reset', 97: 'safety_plan', 98: 'repair_signal',
    99: 'mindful_text', 100: 'values_list',
}

entries = []
for number in sorted(parsed):
    tip = parsed[number]
    config = TIP_CONFIGS[number]
    persona = PERSONA_DEFAULTS[config['persona']].copy()
    preset = INTERACTION_PRESETS[TIP_TYPES[number]].copy()
    overrides = config.get('overrides', {})
    entry = {
        'tip_id': str(uuid.uuid4()),
        'summary': tip['summary'],
        'details_md': tip['details_md'],
    }
    for key, value in persona.items():
        entry[key] = value
    for key, value in preset.items():
        entry[key] = value
    for key, value in overrides.items():
        entry[key] = value
    entry['when'] = entry.get('when', ['any'])
    entry['where'] = entry.get('where', ['any'])
    for field in ('goals', 'helps_with', 'mechanisms', 'features', 'involves'):
        allowed = ALLOWED_VALUES[field]
        for val in entry.get(field, []):
            if val not in allowed:
                raise ValueError(f"Unknown {field} value '{val}' for tip {number}")
    entries.append(entry)

lines = ["import { SimplifiedTip } from '../types/simplifiedTip';", '',
         'export const RELATIONSHIP_PERSONA_PLAYBOOK_TIPS: SimplifiedTip[] = [']
for entry in entries:
    lines.append('  {')
    for key, value in entry.items():
        if isinstance(value, str):
            escaped = value.replace('`', '\\`')
            if '\n' in escaped or '•' in escaped:
                lines.append(f'    "{key}": `{escaped}`,' if key == 'details_md' else f'    "{key}": "{escaped}",')
            else:
                lines.append(f'    "{key}": "{escaped}",')
        elif isinstance(value, list):
            lines.append('    "{}": [{}],'.format(key, ', '.join(f'"{v}"' for v in value)))
    lines.append('  },')
lines.append('];')
OUTPUT_PATH.write_text('\n'.join(lines) + '\n')
print(f'Wrote {len(entries)} tips to {OUTPUT_PATH}')
