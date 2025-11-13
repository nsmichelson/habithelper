import { SimplifiedTip } from '../types/simplifiedTip';
import { Tip } from '../types/tip';
import { MINDSET_TIPS } from './mindsetTips';

const convertEffort = (
  mental: number | undefined,
  physical: number | undefined,
  cognitive: number | undefined
): SimplifiedTip['effort'] => {
  const maxEffort = Math.max(mental ?? 1, physical ?? 1, cognitive ?? 1);
  if (maxEffort <= 1) {
    return 'minimal';
  }
  if (maxEffort === 2) {
    return 'low';
  }
  if (maxEffort === 3) {
    return 'medium';
  }
  if (maxEffort === 4) {
    return 'moderate';
  }
  return 'high';
};

const convertTime = (timeCost: Tip['time_cost_enum']): SimplifiedTip['time'] => {
  switch (timeCost) {
    case '0_5_min':
      return '0-5min';
    case '5_15_min':
      return '5-15min';
    case '15_60_min':
      return '15-30min';
    case '>60_min':
      return '30-60min';
    default:
      return '0-5min';
  }
};

const convertSource = (source: Tip['created_by']): SimplifiedTip['source'] => {
  switch (source) {
    case 'dietitian_reviewed':
      return 'dietitian_reviewed';
    case 'community_submitted':
      return 'community_submitted';
    case 'ai_generated':
      return 'ai_generated';
    default:
      return 'coach_curated';
  }
};

const convertSustainability = (
  sustainability: Tip['sustainability']
): SimplifiedTip['sustainability'] | undefined => {
  switch (sustainability) {
    case 'daily_habit':
      return 'daily';
    case 'occasionally':
      return 'occasional';
    case 'one_time':
      return 'once';
    default:
      return undefined;
  }
};

const buildFeatures = (tip: Tip): string[] => {
  const features = new Set<string>();

  if (tip.social_mode === 'solo' || tip.social_mode === 'either') {
    features.add('solo_friendly');
  }
  if (tip.social_mode === 'group') {
    features.add('group_activity');
  }
  if (tip.family_friendly) {
    features.add('family_friendly');
  }
  if (tip.kid_approved) {
    features.add('kid_approved');
  }
  if (tip.partner_resistant_ok) {
    features.add('partner_resistant_ok');
  }
  if (tip.requires_planning === false) {
    features.add('no_planning');
  }
  if (tip.impulse_friendly) {
    features.add('impulse_friendly');
  }
  if (tip.diet_trauma_safe) {
    features.add('diet_trauma_safe');
  }
  if (tip.feels_like_diet === false) {
    features.add('not_diety');
  }
  if ((tip.chaos_level_max ?? 0) >= 4) {
    features.add('chaos_proof');
  }

  return Array.from(features);
};

const buildMechanisms = (tip: Tip): string[] => {
  const combined = new Set<string>();
  const tipTypes = Array.isArray(tip.tip_type) ? tip.tip_type : [];
  const motivation = Array.isArray(tip.motivational_mechanism)
    ? tip.motivational_mechanism
    : [];

  tipTypes.forEach(value => combined.add(value));
  motivation.forEach(value => combined.add(value));

  return Array.from(combined);
};

const buildWhen = (tip: Tip): string[] => {
  const parts = new Set<string>();
  (tip.time_of_day ?? []).forEach(value => parts.add(value));
  (tip.cue_context ?? []).forEach(value => parts.add(value));

  return parts.size > 0 ? Array.from(parts) : ['any'];
};

const buildWhere = (tip: Tip): string[] => {
  if (tip.location_tags && tip.location_tags.length > 0) {
    return Array.from(new Set(tip.location_tags));
  }
  return ['any'];
};

const sanitizeWord = (word: string): string =>
  word.replace(/^[^\p{L}\p{N}'’]+/gu, '').replace(/[^\p{L}\p{N}'’]+$/gu, '');

const stripLabel = (text: string): string =>
  text.replace(
    /^(Action|Trigger & Frequency|When to Use|Why it Works|How to Try It|Mindset Reframe|Try it When|Do This|Identity Anchor|Energy Boost|Script It|Practice It|Add This|Focus On|Feeling Check-In|Prompt):\s*/i,
    ''
  );

const ARTICLE_WORDS = new Set<string>([
  'a',
  'an',
  'the',
  'your',
  'my',
  'our',
  'their',
  'his',
  'her',
  'its',
  'this',
  'that',
  'these',
  'those',
]);

const TAIL_WORDS = new Set<string>([
  'and',
  'or',
  'to',
  'the',
  'a',
  'of',
  'with',
  'for',
  'in',
  'on',
  'at',
  'your',
  'my',
  'our',
  'their',
  'his',
  'her',
  'its',
  'this',
  'that',
  'these',
  'those',
  'weekly',
  'daily',
  'nightly',
  'mornings',
  'evenings',
  'afternoons',
  'weekends',
  'weekday',
  'weekdays',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
  'mondays',
  'tuesdays',
  'wednesdays',
  'thursdays',
  'fridays',
  'saturdays',
  'sundays',
]);

const buildShortDescription = (tip: Tip): string | undefined => {
  const details = tip.details_md?.trim();
  if (!details) {
    return undefined;
  }

  const plain = details
    .replace(/\r?\n+/g, ' ')
    .replace(/\*\*(.*?)\*\*/g, '$1 ')
    .replace(/\[[^\]]+\]\(([^)]+)\)/g, '$1')
    .replace(/\([^)]*\)/g, '')
    .replace(/[`*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) {
    return undefined;
  }

  const segments = plain.split(/(?<=[.!?])\s+/);
  const collectedWords: string[] = [];

  for (const segment of segments) {
    const normalized = stripLabel(segment).replace(/^[–-]\s*/, '').trim();
    if (!normalized) {
      continue;
    }

    const segmentWords = normalized
      .split(/\s+/)
      .map(sanitizeWord)
      .filter(Boolean);

    if (segmentWords.length === 0) {
      continue;
    }

    collectedWords.push(...segmentWords);

    if (collectedWords.length >= 7) {
      break;
    }
  }

  if (collectedWords.length < 7) {
    const summaryWords = (tip.summary || '')
      .split(/\s+/)
      .map(sanitizeWord)
      .filter(Boolean);
    collectedWords.push(...summaryWords);
  }

  if (collectedWords.length === 0) {
    return undefined;
  }

  if (collectedWords.length < 7) {
    const extraWords = (tip.details_md || '')
      .replace(/\*\*(.*?)\*\*/g, '$1 ')
      .split(/\s+/)
      .map(sanitizeWord)
      .filter(Boolean);

    for (const word of extraWords) {
      if (!word) {
        continue;
      }

      collectedWords.push(word);

      if (collectedWords.length >= 7) {
        break;
      }
    }
  }

  if (collectedWords.length < 7) {
    return undefined;
  }

  let trimmed = collectedWords.slice();

  if (trimmed.length > 12) {
    trimmed = trimmed.slice(0, 12);
    const nextWord = collectedWords[12];
    if (nextWord) {
      const secondLast = trimmed[trimmed.length - 2]?.toLowerCase();
      if (secondLast && ARTICLE_WORDS.has(secondLast)) {
        trimmed[trimmed.length - 1] = nextWord;
      }
    }
  }

  const shouldTrim = (word: string | undefined): boolean => {
    if (!word) {
      return false;
    }
    return TAIL_WORDS.has(word.toLowerCase());
  };

  while (trimmed.length > 7 && shouldTrim(trimmed[trimmed.length - 1])) {
    trimmed = trimmed.slice(0, -1);
  }

  if (trimmed.length > 12) {
    trimmed = trimmed.slice(0, 12);
  }

  trimmed = trimmed.map((word, index) => {
    if (index === 0) {
      return word;
    }

    if (/^[A-Z0-9\-]+$/.test(word)) {
      return word;
    }

    return word.toLowerCase();
  });

  const sentence = trimmed.join(' ');
  if (!sentence) {
    return undefined;
  }

  const formatted = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  return /[.!?]$/.test(formatted) ? formatted : `${formatted}.`;
};

const convertTipToSimplified = (tip: Tip): SimplifiedTip => {
  const helpsWith = Array.isArray(tip.helps_with) && tip.helps_with.length > 0
    ? Array.from(new Set(tip.helps_with))
    : undefined;

  const goals = Array.isArray(tip.goal_tags) ? Array.from(new Set(tip.goal_tags)) : [];

  return {
    tip_id: tip.tip_id,
    summary: tip.summary,
    details_md: tip.details_md,
    short_description: buildShortDescription(tip),
    area: 'mindset',
    goals,
    helps_with: helpsWith,
    contraindications: Array.isArray(tip.contraindications)
      ? tip.contraindications
      : [],
    mechanisms: buildMechanisms(tip),
    effort: convertEffort(tip.mental_effort, tip.physical_effort, tip.cognitive_load),
    time: convertTime(tip.time_cost_enum),
    cost: tip.money_cost_enum ?? '$',
    when: buildWhen(tip),
    where: buildWhere(tip),
    features: buildFeatures(tip),
    difficulty: tip.difficulty_tier,
    source: convertSource(tip.created_by),
    sustainability: convertSustainability(tip.sustainability),
  };
};

export const MINDSET_SIMPLIFIED_TIPS: SimplifiedTip[] = MINDSET_TIPS.map(convertTipToSimplified);

