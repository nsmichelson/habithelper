#!/usr/bin/env python3
import json
import re
import uuid
from pathlib import Path
from textwrap import indent

RAW_PATH = Path('docs/mindset_tips_raw.md')
OUT_PATH = Path('data/mindsetTips.ts')

raw_text = RAW_PATH.read_text(encoding='utf-8')

# Split into individual tip blocks
blocks = re.split(r'\n### ', raw_text)
normalized_blocks = []
for block in blocks:
    block = block.strip()
    if not block:
        continue
    if not re.match(r'\d+\.\s', block):
        continue
    normalized_blocks.append(block)
blocks = normalized_blocks

GOAL_TAG_MAP: dict[str, list[str]] = {
    'stress_management': ['stress_coping_plan', 'stress_reset_routine'],
    'anxiety_management': ['anxiety_management'],
    'mindfulness_practice': ['mindfulness_practice'],
    'mindset_shift': ['mindset_shift'],
    'self_awareness': ['mindfulness_practice', 'mindset_shift'],
    'gratitude_practice': ['gratitude_practice'],
    'self_compassion': ['self_compassion'],
    'healthy_boundaries': ['healthy_boundaries'],
    'build_confidence': ['build_confidence'],
    'goal_achievement': ['goal_achievement'],
    'motivation': ['goal_achievement', 'mindset_shift'],
    'improve_mood': ['improve_mood'],
    'positive_thinking': ['positive_thinking'],
    'overcome_perfectionism': ['overcome_perfectionism'],
    'mindful_eating': ['mindful_eating'],
    'sleep_hygiene': ['improve_sleep', 'sleep_quality'],
    'nutrition': ['stable_blood_sugar', 'improve_energy'],
    'social_support': ['social_support'],
    'decision_making': ['decision_making'],
}

ALLOWED_GOAL_TAGS = {tag for tags in GOAL_TAG_MAP.values() for tag in tags}

def map_goal_tags(raw_tags: list[str]) -> list[str]:
    mapped: list[str] = []
    for tag in raw_tags:
        if tag not in GOAL_TAG_MAP:
            raise ValueError(f'Unknown tag "{tag}" encountered in raw tips')
        mapped.extend(GOAL_TAG_MAP[tag])
    deduped: list[str] = []
    seen: set[str] = set()
    for tag in mapped:
        if tag not in seen:
            if tag not in ALLOWED_GOAL_TAGS:
                raise ValueError(f'Goal tag "{tag}" not in allowed set')
            deduped.append(tag)
            seen.add(tag)
    return deduped

tag_to_mechanisms = {
    'stress_management': ['relief'],
    'anxiety_management': ['relief'],
    'mindfulness_practice': ['relief', 'self_awareness'],
    'mindset_shift': ['identity'],
    'self_awareness': ['insight'],
    'gratitude_practice': ['comfort', 'social'],
    'self_compassion': ['comfort'],
    'healthy_boundaries': ['identity'],
    'build_confidence': ['mastery'],
    'goal_achievement': ['mastery'],
    'motivation': ['identity', 'mastery'],
    'improve_mood': ['comfort'],
    'positive_thinking': ['identity'],
    'overcome_perfectionism': ['identity'],
    'sleep_hygiene': ['relief'],
    'nutrition': ['energy_boost'],
    'mindful_eating': ['self_awareness'],
    'social_support': ['social']
}

tag_to_tip_types = {
    'stress_management': ['mindset_shift'],
    'anxiety_management': ['mindset_shift'],
    'mindfulness_practice': ['mindfulness_practice'],
    'mindset_shift': ['mindset_shift'],
    'self_awareness': ['self_awareness'],
    'gratitude_practice': ['gratitude_practice'],
    'self_compassion': ['self_compassion'],
    'healthy_boundaries': ['healthy_boundaries'],
    'build_confidence': ['confidence_builder'],
    'goal_achievement': ['habit_stacking'],
    'motivation': ['habit_stacking'],
    'improve_mood': ['mood_regulation'],
    'positive_thinking': ['mindset_shift'],
    'overcome_perfectionism': ['mindset_shift'],
    'sleep_hygiene': ['sleep_hygiene'],
    'mindful_eating': ['mindful_eating'],
    'nutrition': ['nutrition_support'],
    'social_support': ['social_support']
}

tag_to_helps = {
    'stress_management': ['stress', 'overwhelm'],
    'anxiety_management': ['anxiety'],
    'mindfulness_practice': ['stress', 'anxiety'],
    'mindset_shift': ['negative_thinking'],
    'self_awareness': ['rumination'],
    'gratitude_practice': ['low_mood'],
    'self_compassion': ['shame'],
    'healthy_boundaries': ['burnout'],
    'build_confidence': ['self_doubt'],
    'goal_achievement': ['procrastination'],
    'motivation': ['low_motivation'],
    'improve_mood': ['low_mood'],
    'positive_thinking': ['negative_thinking'],
    'overcome_perfectionism': ['perfectionism'],
    'sleep_hygiene': ['sleep'],
    'nutrition': ['energy_crashes'],
    'mindful_eating': ['mindless_eating'],
    'social_support': ['loneliness']
}


def parse_duration(text: str) -> str:
    lower = text.lower()
    if re.search(r'\b(20|25|30|twenty|half hour)\b', lower):
        return '15_60_min'
    if re.search(r'\b(10|15|five-minute|ten-minute|15-minute|five\s*minutes|ten\s*minutes)\b', lower):
        return '5_15_min'
    if re.search(r'\bweek\b', lower) and 'log' in lower:
        return '5_15_min'
    if re.search(r'\b(5|five|3|three|2|two|60 seconds|1 minute|minute|seconds)\b', lower):
        return '0_5_min'
    return '0_5_min'


def infer_time_of_day(trigger: str) -> list[str]:
    lower = trigger.lower()
    times = []
    if 'morning' in lower or 'wake' in lower:
        times.append('morning')
    if 'afternoon' in lower or 'midday' in lower or 'lunch' in lower or '2 p.m.' in lower:
        times.append('afternoon')
    if 'evening' in lower or 'night' in lower or 'bed' in lower:
        times.append('evening')
    if 'bed' in lower or 'sleep' in lower or 'before bed' in lower:
        times.append('night')
    if not times:
        times.append('any')
    return sorted(set(times))


def infer_cues(trigger: str, tags: list[str]) -> list[str]:
    cues = set()
    lower = trigger.lower()
    if any(tag in {'stress_management', 'anxiety_management'} for tag in tags):
        cues.update(['stress'])
    if 'anxiety' in lower or 'panic' in lower:
        cues.add('anxiety')
    if 'work' in lower or 'meeting' in lower or 'inbox' in lower:
        cues.add('workday')
    if 'bed' in lower or 'sleep' in lower or 'night' in lower:
        cues.add('evening')
    if 'morning' in lower:
        cues.add('morning')
    if 'commute' in lower:
        cues.add('commute')
    if 'week' in lower or 'weekly' in lower:
        cues.add('weekly_routine')
    if 'overwhelm' in lower:
        cues.add('overwhelm')
    if 'meeting' in lower:
        cues.add('meeting')
    return sorted(cues)


def infer_location(action: str, trigger: str) -> list[str]:
    lower = f"{action} {trigger}".lower()
    locations = set(['any'])
    if 'walk' in lower or 'outside' in lower or 'nature' in lower:
        locations.add('outdoors')
    if 'desk' in lower or 'meeting' in lower or 'office' in lower or 'work' in lower or 'email' in lower:
        locations.add('work')
    if 'bed' in lower or 'home' in lower or 'shower' in lower:
        locations.add('home')
    return sorted(locations)


def infer_social_mode(action: str) -> str:
    lower = action.lower()
    if any(word in lower for word in ['send', 'message', 'friend', 'coworker', 'someone', 'ask', 'share']):
        return 'either'
    return 'solo'


def infer_physical_effort(action: str) -> int:
    lower = action.lower()
    if any(word in lower for word in ['walk', 'stretch', 'dance', 'exercise', 'movement', 'shake', 'run']):
        return 2
    return 1


def infer_mental_effort(action: str, trigger: str) -> int:
    text = f"{action} {trigger}".lower()
    if any(word in text for word in ['write', 'journal', 'plan', 'record', 'list', 'schedule', 'log', 'note', 'reframe']):
        return 3
    if any(word in text for word in ['visualize', 'imagine', 'breath', 'breathing', 'breathe']):
        return 2
    return 2


def infer_cognitive_load(action: str) -> int:
    lower = action.lower()
    if any(word in lower for word in ['write', 'journal', 'plan', 'record', 'list', 'schedule', 'note', 'reframe']):
        return 3
    return 2


def infer_sustainability(trigger: str) -> str:
    lower = trigger.lower()
    if any(word in lower for word in ['weekly', 'week', 'sunday', 'friday', '3×/week', '3x/week']):
        return 'occasionally'
    if any(word in lower for word in ['whenever', 'as needed', 'on-demand', 'panic', 'overwhelm']):
        return 'occasionally'
    if any(word in lower for word in ['nightly', 'daily', 'every', 'each', 'morning', 'midday', 'afternoon', 'evening']):
        return 'daily_habit'
    return 'daily_habit'


def gather_mechanisms(tags: list[str]) -> list[str]:
    mechanisms = set()
    for tag in tags:
        mechanisms.update(tag_to_mechanisms.get(tag, []))
    if not mechanisms:
        mechanisms.add('identity')
    return sorted(mechanisms)


def gather_tip_types(tags: list[str]) -> list[str]:
    types = ['behavioral_strategy']
    for tag in tags:
        types.extend(tag_to_tip_types.get(tag, []))
    seen = []
    for t in types:
        if t not in seen:
            seen.append(t)
    return seen


def gather_helps(tags: list[str]) -> list[str]:
    helps = set()
    for tag in tags:
        helps.update(tag_to_helps.get(tag, []))
    return sorted(helps)


def format_value(value, indent_level=4) -> str:
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, bool):
        return 'true' if value else 'false'
    if isinstance(value, (int, float)):
        return str(value)
    if value is None:
        return 'null'
    if isinstance(value, list):
        if not value:
            return '[]'
        inner = []
        for idx, item in enumerate(value):
            formatted_item = format_value(item, indent_level + 2)
            suffix = ',' if idx < len(value) - 1 else ''
            inner.append(' ' * (indent_level + 2) + formatted_item + suffix)
        return '[\n' + '\n'.join(inner) + '\n' + ' ' * indent_level + ']'
    if isinstance(value, dict):
        pieces = []
        for k, v in value.items():
            pieces.append(' ' * (indent_level + 2) + json.dumps(k) + ': ' + format_value(v, indent_level + 2))
        return '{\n' + '\n'.join(pieces) + '\n' + ' ' * indent_level + '}'
    return json.dumps(value, ensure_ascii=False)


def build_tip_dict(block: str) -> dict:
    lines = block.splitlines()
    header = lines[0]
    match = re.match(r'(\d+)\.\s*(.+)', header)
    if not match:
        raise ValueError(f'Unable to parse header: {header}')
    number = int(match.group(1))
    title = match.group(2).strip()

    def extract(label: str) -> str:
        pattern = re.compile(rf'\*\*{label}:\*\*\s*(.+)', re.IGNORECASE)
        for line in lines[1:]:
            m = pattern.match(line)
            if m:
                return m.group(1).strip()
        raise ValueError(f'Missing {label} in tip {number}')

    action = extract('Action')
    trigger = extract('Trigger & Frequency')

    tags_line = extract('Tags')
    tags = re.findall(r'`([^`]+)`', tags_line)
    goal_tags = map_goal_tags(tags)

    rationale_match = re.search(r'\*\*Research Rationale:\*\*\s*(.+?)(?:\n\n|\Z)', block, re.S)
    if not rationale_match:
        raise ValueError(f'Missing Research Rationale in tip {number}')
    rationale = ' '.join(rationale_match.group(1).strip().split())

    details_md = (
        f"**Action:** {action}\n\n"
        f"**Trigger & Frequency:** {trigger}\n\n"
        f"**Why it Works:** {rationale}"
    )

    time_cost = parse_duration(f"{action} {trigger}")
    time_of_day = infer_time_of_day(trigger)
    cue_context = infer_cues(trigger, tags)
    location_tags = infer_location(action, trigger)
    social_mode = infer_social_mode(action)
    physical_effort = infer_physical_effort(action)
    mental_effort = infer_mental_effort(action, trigger)
    cognitive_load = infer_cognitive_load(action)
    sustainability = infer_sustainability(trigger)
    tip_types = gather_tip_types(tags)
    mechanisms = gather_mechanisms(tags)
    helps_with = gather_helps(tags)

    tip = {
        'tip_id': str(uuid.uuid4()),
        'summary': title,
        'details_md': details_md,
        'contraindications': [],
        'goal_tags': goal_tags,
        'tip_type': tip_types,
        'motivational_mechanism': mechanisms,
        'time_cost_enum': time_cost,
        'money_cost_enum': '$',
        'mental_effort': mental_effort,
        'physical_effort': physical_effort,
        'location_tags': location_tags,
        'social_mode': social_mode,
        'time_of_day': time_of_day,
        'cue_context': cue_context,
        'difficulty_tier': 2,
        'created_by': 'coach_curated',
        'family_friendly': True,
        'kid_approved': True,
        'partner_resistant_ok': True,
        'chaos_level_max': 5,
        'requires_planning': False,
        'impulse_friendly': True,
        'diet_trauma_safe': True,
        'feels_like_diet': False,
        'cognitive_load': cognitive_load,
        'helps_with': helps_with,
        'sustainability': sustainability
    }

    return tip


tips = [build_tip_dict(block) for block in blocks]

lines = ["import { Tip } from '../types/tip';", '', 'export const MINDSET_TIPS: Tip[] = [']

for tip in tips:
    lines.append('  {')
    lines.append(f'    "tip_id": "{tip["tip_id"]}",')
    lines.append('    "area": "stress" as const,')
    for key in [
        'summary', 'details_md', 'contraindications', 'goal_tags', 'tip_type',
        'motivational_mechanism', 'time_cost_enum', 'money_cost_enum',
        'mental_effort', 'physical_effort', 'location_tags', 'social_mode',
        'time_of_day', 'cue_context', 'difficulty_tier', 'created_by',
        'family_friendly', 'kid_approved', 'partner_resistant_ok',
        'chaos_level_max', 'requires_planning', 'impulse_friendly',
        'diet_trauma_safe', 'feels_like_diet', 'cognitive_load',
        'helps_with', 'sustainability']:
        value = tip[key]
        formatted = format_value(value, indent_level=4)
        lines.append(f'    "{key}": {formatted},')
    lines[-1] = lines[-1].rstrip(',')
    lines.append('  },')
lines[-1] = lines[-1].rstrip(',')
lines.append('];')
lines.append('')

OUT_PATH.write_text('\n'.join(lines), encoding='utf-8')

print(f'Wrote {len(tips)} mindset tips to {OUT_PATH}')
