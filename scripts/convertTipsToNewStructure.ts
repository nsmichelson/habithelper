import { TIPS_DATABASE } from '../data/tips';
import fs from 'fs';

// New simplified tip structure
interface SimplifiedTip {
  // Core Identity
  tip_id: string;
  summary: string;
  details_md: string;

  // Categorization
  area: 'nutrition' | 'fitness' | 'organization' | 'relationships' | 'stress';
  goals: string[];
  helps_with?: string[];

  // Safety & Eligibility
  contraindications: string[];

  // How it works
  mechanisms: string[];

  // Effort & Investment
  effort: 'minimal' | 'low' | 'medium' | 'high';
  time: '0-5min' | '5-15min' | '15-30min' | '30min+';
  cost: '$' | '$$' | '$$$';

  // Context & Timing
  when: string[];
  where: string[];

  // What's Involved
  involves?: string[];
  preserves?: string[];
  satisfies?: string[];
  requires?: string[];

  // Compatibility Features
  features: string[];

  // Personalization
  personalization_prompt?: string;
  personalization_type?: 'text' | 'scale' | 'choice' | 'multi_text' | 'list';
  personalization_config?: any;

  // Quality & Metadata
  difficulty: 1 | 2 | 3 | 4 | 5;
  source: 'dietitian_reviewed' | 'coach_curated' | 'community_submitted' | 'ai_generated';
  sustainability?: 'daily' | 'weekly' | 'occasional' | 'temporary';
}

// Conversion functions
function convertEffort(mental?: number, physical?: number, cognitive?: number): 'minimal' | 'low' | 'medium' | 'high' {
  const maxEffort = Math.max(mental || 1, physical || 1, cognitive || 1);
  if (maxEffort <= 1) return 'minimal';
  if (maxEffort <= 2) return 'low';
  if (maxEffort <= 3) return 'medium';
  return 'high';
}

function convertTime(timeCost: string): '0-5min' | '5-15min' | '15-30min' | '30min+' {
  switch(timeCost) {
    case '0_5_min': return '0-5min';
    case '5_15_min': return '5-15min';
    case '15_60_min':
    case '15_30_min': return '15-30min';
    case '>60_min': return '30min+';
    default: return '5-15min';
  }
}

function convertSustainability(sust?: string): 'daily' | 'weekly' | 'occasional' | 'temporary' | undefined {
  switch(sust) {
    case 'daily_habit': return 'daily';
    case 'weekly_habit': return 'weekly';
    case 'occasionally': return 'occasional';
    case 'one_time': return 'temporary';
    default: return undefined;
  }
}

function convertSource(source: string): 'dietitian_reviewed' | 'coach_curated' | 'community_submitted' | 'ai_generated' {
  if (source === 'dietitian_reviewed') return 'dietitian_reviewed';
  if (source === 'coach_curated') return 'coach_curated';
  if (source === 'community_submitted') return 'community_submitted';
  return 'ai_generated';
}

function combineArrays(...arrays: (string[] | undefined)[]): string[] {
  const combined = new Set<string>();
  arrays.forEach(arr => {
    if (arr && Array.isArray(arr)) {
      arr.forEach(item => combined.add(item));
    }
  });
  return Array.from(combined);
}

function extractFeatures(tip: any): string[] {
  const features = new Set<string>();

  // Social mode
  if (tip.social_mode === 'solo') features.add('solo_friendly');
  if (tip.social_mode === 'group') features.add('group_activity');

  // Veggie intensity
  if (tip.veggie_intensity === 'none') features.add('veggie_free');
  if (tip.veggie_intensity === 'hidden') features.add('veggie_hidden');
  if (tip.veggie_intensity === 'light') features.add('veggie_light');
  if (tip.veggie_intensity === 'moderate') features.add('veggie_moderate');
  if (tip.veggie_intensity === 'heavy') features.add('veggie_heavy');

  // Boolean features
  if (tip.family_friendly) features.add('family_friendly');
  if (tip.kid_approved) features.add('kid_approved');
  if (tip.partner_resistant_ok) features.add('partner_resistant_ok');
  if (tip.requires_planning === false) features.add('no_planning');
  if (tip.impulse_friendly) features.add('impulse_friendly');
  if (tip.diet_trauma_safe) features.add('diet_trauma_safe');
  if (tip.feels_like_diet === false) features.add('not_diety');

  // Chaos level
  if (tip.chaos_level_max >= 4) features.add('chaos_proof');

  return Array.from(features);
}

function extractRequirements(tip: any): string[] {
  const requirements = new Set<string>();

  // Kitchen equipment
  if (tip.kitchen_equipment && Array.isArray(tip.kitchen_equipment)) {
    tip.kitchen_equipment.forEach((item: string) => {
      if (item && item !== 'none') requirements.add(item);
    });
  }

  // Cooking skill
  if (tip.cooking_skill_required && tip.cooking_skill_required !== 'none') {
    requirements.add(`${tip.cooking_skill_required}_cooking`);
  }

  // Planning requirements
  if (tip.requires_planning) requirements.add('advance_planning');
  if (tip.requires_advance_prep) requirements.add('advance_prep');

  return Array.from(requirements);
}

function extractSatisfies(tip: any): string[] | undefined {
  const satisfies = new Set<string>();

  // Cravings
  if (tip.satisfies_craving) {
    if (Array.isArray(tip.satisfies_craving)) {
      tip.satisfies_craving.forEach((c: string) => satisfies.add(c));
    } else if (typeof tip.satisfies_craving === 'string') {
      satisfies.add(tip.satisfies_craving);
    }
  }

  // Texture profile
  if (tip.texture_profile) {
    if (Array.isArray(tip.texture_profile)) {
      tip.texture_profile.forEach((t: string) => satisfies.add(t));
    }
  }

  return satisfies.size > 0 ? Array.from(satisfies) : undefined;
}

// Convert each tip
function convertTip(oldTip: any): SimplifiedTip {
  // Combine tip_type and motivational_mechanism into mechanisms
  const mechanisms = combineArrays(oldTip.tip_type, oldTip.motivational_mechanism);

  // Combine time_of_day and cue_context into when
  const when = combineArrays(oldTip.time_of_day, oldTip.cue_context);

  // Extract features from various boolean and enum fields
  const features = extractFeatures(oldTip);

  // Extract requirements from equipment and skills
  const requires = extractRequirements(oldTip);

  // Extract satisfies from cravings and texture
  const satisfies = extractSatisfies(oldTip);

  const convertedTip: SimplifiedTip = {
    // Core Identity
    tip_id: oldTip.tip_id,
    summary: oldTip.summary,
    details_md: oldTip.details_md,

    // Categorization
    area: oldTip.area || 'nutrition',
    goals: Array.isArray(oldTip.goal_tags) ? oldTip.goal_tags : [],
    helps_with: oldTip.helps_with && oldTip.helps_with.length > 0 ? oldTip.helps_with : undefined,

    // Safety
    contraindications: Array.isArray(oldTip.contraindications) ?
      oldTip.contraindications :
      (typeof oldTip.contraindications === 'string' ? [oldTip.contraindications] : []),

    // How it works
    mechanisms,

    // Effort & Investment
    effort: convertEffort(oldTip.mental_effort, oldTip.physical_effort, oldTip.cognitive_load),
    time: convertTime(oldTip.time_cost_enum),
    cost: oldTip.money_cost_enum || '$',

    // Context & Timing
    when,
    where: oldTip.location_tags || [],

    // What's Involved
    involves: oldTip.involves_foods && oldTip.involves_foods.length > 0 ? oldTip.involves_foods : undefined,
    preserves: oldTip.preserves_foods && oldTip.preserves_foods.length > 0 ? oldTip.preserves_foods : undefined,
    satisfies,
    requires: requires.length > 0 ? requires : undefined,

    // Compatibility
    features,

    // Personalization
    personalization_prompt: oldTip.personalization_prompt,
    personalization_type: oldTip.personalization_type,
    personalization_config: oldTip.personalization_config,

    // Quality & Metadata
    difficulty: oldTip.difficulty_tier,
    source: convertSource(oldTip.created_by),
    sustainability: convertSustainability(oldTip.sustainability)
  };

  // Remove undefined optional fields for cleaner output
  Object.keys(convertedTip).forEach(key => {
    if (convertedTip[key as keyof SimplifiedTip] === undefined) {
      delete convertedTip[key as keyof SimplifiedTip];
    }
  });

  return convertedTip;
}

// Main conversion
console.log(`Converting ${TIPS_DATABASE.length} tips to new structure...`);

const convertedTips: SimplifiedTip[] = TIPS_DATABASE.map((tip, index) => {
  try {
    const converted = convertTip(tip);
    console.log(`✓ Converted tip ${index + 1}: ${tip.summary.substring(0, 50)}...`);
    return converted;
  } catch (error) {
    console.error(`✗ Failed to convert tip ${index + 1}:`, error);
    throw error;
  }
});

// Generate the output file
const outputContent = `import { SimplifiedTip } from '../types/simplifiedTip';

export const SIMPLIFIED_TIPS: SimplifiedTip[] = ${JSON.stringify(convertedTips, null, 2)};

export default SIMPLIFIED_TIPS;
`;

// Write to file
const outputPath = '/Users/nataliemichelson/Projects/habithelper/data/simplifiedTips.ts';
fs.writeFileSync(outputPath, outputContent, 'utf-8');

console.log(`\n✅ Successfully converted ${convertedTips.length} tips!`);
console.log(`📁 Output saved to: ${outputPath}`);

// Generate summary statistics
const stats = {
  total: convertedTips.length,
  byArea: {} as Record<string, number>,
  byEffort: {} as Record<string, number>,
  withPersonalization: 0,
  avgMechanisms: 0,
  avgGoals: 0
};

convertedTips.forEach(tip => {
  stats.byArea[tip.area] = (stats.byArea[tip.area] || 0) + 1;
  stats.byEffort[tip.effort] = (stats.byEffort[tip.effort] || 0) + 1;
  if (tip.personalization_prompt) stats.withPersonalization++;
  stats.avgMechanisms += tip.mechanisms.length;
  stats.avgGoals += tip.goals.length;
});

stats.avgMechanisms /= convertedTips.length;
stats.avgGoals /= convertedTips.length;

console.log('\n📊 Conversion Statistics:');
console.log('By Area:', stats.byArea);
console.log('By Effort:', stats.byEffort);
console.log(`With Personalization: ${stats.withPersonalization}/${stats.total} (${Math.round(stats.withPersonalization/stats.total*100)}%)`);
console.log(`Avg Mechanisms per tip: ${stats.avgMechanisms.toFixed(1)}`);
console.log(`Avg Goals per tip: ${stats.avgGoals.toFixed(1)}`);