/**
 * Centralized data structure for rejection reasons and their follow-up questions
 * This makes it easy to maintain and expand the feedback system
 */

export interface RejectionReason {
  value: string;
  label: string;
  icon: string;
  emoji: string;
  // Conditions for when to show this reason (optional)
  showWhen?: {
    tipHasFood?: boolean;
    tipRequiresCooking?: boolean;
    tipTakesTime?: boolean;
    tipRequiresPlanning?: boolean;
    tipCostsMoney?: boolean;
    tipIsSocial?: boolean;
  };
}

export interface FollowUpQuestion {
  value: string;
  label: string;
  emoji: string;
}

export interface RejectionReasonWithFollowUps extends RejectionReason {
  followUps?: FollowUpQuestion[];
}

// Primary rejection reasons with their follow-up questions
export const REJECTION_REASONS: RejectionReasonWithFollowUps[] = [
  // TASTE & FLAVOR ISSUES
  {
    value: 'dislike_taste',
    label: "Not a fan of the taste",
    icon: 'close-circle-outline',
    emoji: '😝',
    showWhen: { tipHasFood: true },
    followUps: [
      { label: "I prefer sweeter flavors", value: 'prefer_sweet', emoji: '🍬' },
      { label: "I prefer savory flavors", value: 'prefer_savory', emoji: '🧂' },
      { label: "Too spicy for me", value: 'too_spicy', emoji: '🌶️' },
      { label: "Not spicy enough", value: 'not_spicy_enough', emoji: '🫑' },
      { label: "Too bland", value: 'too_bland', emoji: '😐' },
      { label: "Too rich/heavy", value: 'too_rich', emoji: '🧈' },
      { label: "Prefer lighter flavors", value: 'prefer_light', emoji: '🌱' },
      { label: "Too sour", value: 'too_sour', emoji: '🍋' },
      { label: "Too bitter", value: 'too_bitter', emoji: '☕' },
      { label: "Don't like that specific ingredient", value: 'specific_ingredient', emoji: '🚫' },
    ]
  },
  
  // TEXTURE ISSUES
  {
    value: 'dislike_texture',
    label: "Texture isn't for me",
    icon: 'water-outline',
    emoji: '🤔',
    showWhen: { tipHasFood: true },
    followUps: [
      { label: "Too mushy/soft", value: 'too_soft', emoji: '🥣' },
      { label: "Too crunchy/hard", value: 'too_hard', emoji: '🥜' },
      { label: "Too chewy", value: 'too_chewy', emoji: '🍬' },
      { label: "Too slimy", value: 'too_slimy', emoji: '🫘' },
      { label: "Too dry", value: 'too_dry', emoji: '🍪' },
      { label: "Too wet/soggy", value: 'too_wet', emoji: '💧' },
      { label: "Prefer smoother textures", value: 'prefer_smooth', emoji: '🥤' },
      { label: "Prefer more texture variety", value: 'prefer_varied', emoji: '🎲' },
      { label: "Don't like mixed textures", value: 'dislike_mixed', emoji: '🚫' },
    ]
  },
  
  // ACCESS & AVAILABILITY
  {
    value: 'no_access',
    label: "Don't have ingredients",
    icon: 'basket-outline',
    emoji: '🛒',
    showWhen: { tipHasFood: true },
    followUps: [
      { label: "Not available near me", value: 'not_available_locally', emoji: '📍' },
      { label: "Would need to shop first", value: 'need_shopping', emoji: '🛒' },
      { label: "Don't know where to find it", value: 'dont_know_where', emoji: '🗺️' },
      { label: "Would try with substitutions", value: 'ok_with_substitutes', emoji: '🔄' },
      { label: "Need delivery option", value: 'need_delivery', emoji: '🚚' },
      { label: "Out of season", value: 'out_of_season', emoji: '📅' },
      { label: "Need special store", value: 'need_special_store', emoji: '🏪' },
    ]
  },
  
  // DIETARY RESTRICTIONS
  {
    value: 'cant_eat',
    label: "Can't eat this",
    icon: 'warning-outline',
    emoji: '⚠️',
    showWhen: { tipHasFood: true },
    followUps: [
      { label: "Allergic to ingredient", value: 'allergy', emoji: '🚨' },
      { label: "Against dietary restrictions", value: 'dietary_restriction', emoji: '🚫' },
      { label: "Religious/cultural reasons", value: 'religious_cultural', emoji: '🕊️' },
      { label: "Medical condition prevents it", value: 'medical_condition', emoji: '⚕️' },
      { label: "Medication interaction", value: 'medication_interaction', emoji: '💊' },
      { label: "Makes me feel sick", value: 'makes_sick', emoji: '🤢' },
      { label: "Family member can't eat", value: 'family_cant_eat', emoji: '👨‍👩‍👧' },
    ]
  },
  
  // COOKING & PREPARATION
  {
    value: 'too_much_cooking',
    label: 'Too much cooking',
    icon: 'restaurant-outline',
    emoji: '👨‍🍳',
    showWhen: { tipRequiresCooking: true },
    followUps: [
      { label: "Prefer no-cook options", value: 'no_cook_only', emoji: '🥗' },
      { label: "Microwave only", value: 'microwave_only', emoji: '📻' },
      { label: "Would try simpler cooking", value: 'simple_cooking_ok', emoji: '🍳' },
      { label: "Don't know how to cook this", value: 'dont_know_how', emoji: '❓' },
      { label: "Afraid of messing it up", value: 'afraid_to_fail', emoji: '😰' },
      { label: "Would try with guidance", value: 'need_guidance', emoji: '👨‍🏫' },
      { label: "No energy to cook", value: 'no_energy', emoji: '😴' },
      { label: "Hate cooking", value: 'hate_cooking', emoji: '😤' },
    ]
  },
  
  // EQUIPMENT ISSUES
  {
    value: 'no_equipment',
    label: "Missing equipment",
    icon: 'construct-outline',
    emoji: '🔧',
    showWhen: { tipRequiresCooking: true },
    followUps: [
      { label: "Don't have required tools", value: 'missing_tools', emoji: '🔨' },
      { label: "No oven/stove access", value: 'no_oven_stove', emoji: '🔥' },
      { label: "Only have microwave", value: 'microwave_only', emoji: '📻' },
      { label: "Kitchen too small", value: 'small_kitchen', emoji: '🏠' },
      { label: "Shared kitchen issues", value: 'shared_kitchen', emoji: '👥' },
      { label: "Would need to buy equipment", value: 'need_buy_equipment', emoji: '💰' },
    ]
  },
  
  // TIME CONSTRAINTS
  {
    value: 'too_long',
    label: 'Takes too long',
    icon: 'time-outline',
    emoji: '⏰',
    showWhen: { tipTakesTime: true },
    followUps: [
      { label: "Would try if under 5 minutes", value: 'if_under_5min', emoji: '⚡' },
      { label: "Would try if under 15 minutes", value: 'if_under_15min', emoji: '⏱️' },
      { label: "Too many steps involved", value: 'too_many_steps', emoji: '📝' },
      { label: "Need simpler instructions", value: 'need_simpler', emoji: '🎯' },
      { label: "Would try on weekends", value: 'weekend_only', emoji: '📅' },
      { label: "Prefer one-step solutions", value: 'one_step_only', emoji: '1️⃣' },
      { label: "Morning routine too rushed", value: 'morning_rushed', emoji: '🌅' },
      { label: "Evenings too busy", value: 'evening_busy', emoji: '🌙' },
    ]
  },
  
  // COMPLEXITY ISSUES
  {
    value: 'too_complex',
    label: 'Too complicated',
    icon: 'layers-outline',
    emoji: '🤯',
    followUps: [
      { label: "Too many ingredients", value: 'too_many_ingredients', emoji: '📋' },
      { label: "Instructions confusing", value: 'confusing_instructions', emoji: '😵' },
      { label: "Need visual guide", value: 'need_visual_guide', emoji: '📹' },
      { label: "Too much to remember", value: 'too_much_remember', emoji: '🧠' },
      { label: "Prefer familiar foods", value: 'prefer_familiar', emoji: '🏠' },
      { label: "Too fancy for me", value: 'too_fancy', emoji: '🎩' },
      { label: "Need practice first", value: 'need_practice', emoji: '🎯' },
    ]
  },
  
  // PLANNING REQUIREMENTS
  {
    value: 'too_much_planning',
    label: 'Too much planning',
    icon: 'calendar-outline',
    emoji: '📅',
    showWhen: { tipRequiresPlanning: true },
    followUps: [
      { label: "Can't plan ahead", value: 'cant_plan_ahead', emoji: '🎲' },
      { label: "Schedule too unpredictable", value: 'unpredictable_schedule', emoji: '🔀' },
      { label: "Prefer spontaneous options", value: 'prefer_spontaneous', emoji: '✨' },
      { label: "Forget to prep", value: 'forget_prep', emoji: '🤦' },
      { label: "No time for meal prep", value: 'no_meal_prep_time', emoji: '⏰' },
      { label: "Plans always change", value: 'plans_change', emoji: '🔄' },
    ]
  },
  
  // COST CONCERNS
  {
    value: 'too_expensive',
    label: 'Too expensive',
    icon: 'cash-outline',
    emoji: '💰',
    showWhen: { tipCostsMoney: true },
    followUps: [
      { label: "Would try cheaper version", value: 'if_cheaper', emoji: '💵' },
      { label: "Can't afford ingredients", value: 'cant_afford', emoji: '💸' },
      { label: "Not worth the cost", value: 'not_worth_cost', emoji: '⚖️' },
      { label: "Would try if on sale", value: 'if_on_sale', emoji: '🏷️' },
      { label: "Prefer budget options only", value: 'budget_only', emoji: '🪙' },
      { label: "Too expensive for one person", value: 'expensive_solo', emoji: '1️⃣' },
      { label: "Can't justify the price", value: 'cant_justify', emoji: '🤷' },
    ]
  },
  
  // SOCIAL FACTORS
  {
    value: 'too_social',
    label: 'Too social for me',
    icon: 'people-outline',
    emoji: '👥',
    showWhen: { tipIsSocial: true },
    followUps: [
      { label: "Prefer eating alone", value: 'prefer_alone', emoji: '🧘' },
      { label: "Don't want attention", value: 'avoid_attention', emoji: '🫣' },
      { label: "Embarrassed to try", value: 'embarrassed', emoji: '😳' },
      { label: "No one to do it with", value: 'no_partner', emoji: '1️⃣' },
      { label: "Family won't participate", value: 'family_wont', emoji: '👨‍👩‍👧' },
      { label: "Coworkers would judge", value: 'coworker_judgment', emoji: '👔' },
    ]
  },
  
  // PREVIOUS EXPERIENCE
  {
    value: 'tried_failed',
    label: "Tried it, didn't work",
    icon: 'refresh-outline',
    emoji: '🔄',
    followUps: [
      { label: "Didn't see results", value: 'no_results', emoji: '📊' },
      { label: "Made me feel worse", value: 'felt_worse', emoji: '📉' },
      { label: "Too hard to maintain", value: 'hard_to_maintain', emoji: '🎢' },
      { label: "Didn't fit my schedule", value: 'schedule_conflict', emoji: '📆' },
      { label: "Would try modified version", value: 'try_modified', emoji: '🔧' },
      { label: "Need more time to see effects", value: 'need_more_time', emoji: '⏳' },
      { label: "Worked at first, then stopped", value: 'stopped_working', emoji: '🛑' },
      { label: "Side effects", value: 'side_effects', emoji: '⚠️' },
    ]
  },
  
  // LIFESTYLE FIT
  {
    value: 'not_my_style',
    label: "Not my vibe",
    icon: 'person-outline',
    emoji: '✨',
    followUps: [
      { label: "Too trendy", value: 'too_trendy', emoji: '📱' },
      { label: "Too traditional", value: 'too_traditional', emoji: '👴' },
      { label: "Not how I was raised", value: 'not_my_upbringing', emoji: '🏠' },
      { label: "Doesn't fit my identity", value: 'not_my_identity', emoji: '🪞' },
      { label: "Too extreme", value: 'too_extreme', emoji: '🔥' },
      { label: "Too mild", value: 'too_mild', emoji: '💤' },
      { label: "Feels fake to me", value: 'feels_fake', emoji: '🎭' },
    ]
  },
  
  // MOTIVATION & INTEREST
  {
    value: 'not_interested',
    label: "Just not feeling it",
    icon: 'heart-dislike-outline',
    emoji: '💭',
    followUps: [
      { label: "Not motivated right now", value: 'not_motivated', emoji: '😔' },
      { label: "Other priorities", value: 'other_priorities', emoji: '📊' },
      { label: "Too stressed", value: 'too_stressed', emoji: '😰' },
      { label: "Sounds boring", value: 'boring', emoji: '😴' },
      { label: "Not ready for change", value: 'not_ready', emoji: '🛑' },
      { label: "Need different approach", value: 'need_different', emoji: '🔄' },
      { label: "Overwhelmed already", value: 'overwhelmed', emoji: '🌊' },
    ]
  },
  
  // SKEPTICISM
  {
    value: 'skeptical',
    label: "Don't think it'll work",
    icon: 'help-outline',
    emoji: '🤨',
    followUps: [
      { label: "Sounds too good to be true", value: 'too_good_true', emoji: '🎪' },
      { label: "Need scientific proof", value: 'need_proof', emoji: '🔬' },
      { label: "Tried similar before", value: 'tried_similar', emoji: '🔄' },
      { label: "Don't trust the source", value: 'distrust_source', emoji: '❓' },
      { label: "Seems like a fad", value: 'seems_fad', emoji: '📈' },
      { label: "Want to research first", value: 'research_first', emoji: '📚' },
    ]
  },
  
  // PHYSICAL/HEALTH CONCERNS
  {
    value: 'physical_concerns',
    label: "Physical limitations",
    icon: 'fitness-outline',
    emoji: '🏥',
    followUps: [
      { label: "Too physically demanding", value: 'too_demanding', emoji: '💪' },
      { label: "Health condition prevents", value: 'health_prevents', emoji: '⚕️' },
      { label: "Mobility issues", value: 'mobility_issues', emoji: '🦽' },
      { label: "Energy too low", value: 'low_energy', emoji: '🔋' },
      { label: "Pain prevents this", value: 'pain_prevents', emoji: '😣' },
      { label: "Doctor wouldn't approve", value: 'doctor_no', emoji: '👨‍⚕️' },
    ]
  },
  
  // ENVIRONMENTAL FACTORS
  {
    value: 'environment_issue',
    label: "My environment doesn't support this",
    icon: 'home-outline',
    emoji: '🏠',
    followUps: [
      { label: "No space at home", value: 'no_space', emoji: '📦' },
      { label: "Too noisy/chaotic", value: 'too_chaotic', emoji: '🔊' },
      { label: "No privacy", value: 'no_privacy', emoji: '👁️' },
      { label: "Roommates won't like it", value: 'roommate_issue', emoji: '🏠' },
      { label: "Office doesn't allow", value: 'office_no', emoji: '🏢' },
      { label: "Travel too much", value: 'travel_much', emoji: '✈️' },
    ]
  },
  
  // CATCH-ALL
  {
    value: 'other',
    label: "Something else",
    icon: 'ellipsis-horizontal-outline',
    emoji: '💬',
    // No follow-ups - this triggers free text input
  },
];

// Helper function to get reasons filtered by tip characteristics
export function getRelevantRejectionReasons(tip: any): RejectionReason[] {
  const allReasons = REJECTION_REASONS.map(r => ({
    value: r.value,
    label: r.label,
    icon: r.icon,
    emoji: r.emoji,
  }));
  
  // If tip has specific characteristics, filter accordingly
  const filtered = REJECTION_REASONS.filter(reason => {
    if (!reason.showWhen) return true; // Always show if no conditions
    
    const conditions = reason.showWhen;
    
    // Check each condition
    if (conditions.tipHasFood !== undefined) {
      const tipHasFood = tip.involves_foods && tip.involves_foods.length > 0;
      if (conditions.tipHasFood !== tipHasFood) return false;
    }
    
    if (conditions.tipRequiresCooking !== undefined) {
      const tipRequiresCooking = tip.cooking_skill_required && tip.cooking_skill_required !== 'none';
      if (conditions.tipRequiresCooking !== tipRequiresCooking) return false;
    }
    
    if (conditions.tipTakesTime !== undefined) {
      const tipTakesTime = tip.time_cost_enum !== '0_5_min';
      if (conditions.tipTakesTime !== tipTakesTime) return false;
    }
    
    if (conditions.tipRequiresPlanning !== undefined) {
      const tipRequiresPlanning = tip.requires_planning || tip.requires_advance_prep;
      if (conditions.tipRequiresPlanning !== tipRequiresPlanning) return false;
    }
    
    if (conditions.tipCostsMoney !== undefined) {
      const tipCostsMoney = tip.money_cost_enum !== '$';
      if (conditions.tipCostsMoney !== tipCostsMoney) return false;
    }
    
    if (conditions.tipIsSocial !== undefined) {
      const tipIsSocial = tip.social_mode === 'group' || tip.location_tags?.includes('social_event');
      if (conditions.tipIsSocial !== tipIsSocial) return false;
    }
    
    return true;
  });
  
  // Always include universal reasons that should appear for every tip
  const universalReasons = ['tried_failed', 'not_my_style', 'not_interested', 'skeptical', 
                           'physical_concerns', 'environment_issue', 'other'];
  
  // Combine filtered context-specific reasons with universal ones
  const finalReasons = [
    ...filtered.filter(r => !universalReasons.includes(r.value)),
    ...REJECTION_REASONS.filter(r => universalReasons.includes(r.value))
  ];
  
  return finalReasons.map(r => ({
    value: r.value,
    label: r.label,
    icon: r.icon,
    emoji: r.emoji,
  }));
}

// Helper function to get follow-up questions for a primary reason
export function getFollowUpQuestions(primaryReason: string): FollowUpQuestion[] {
  const reason = REJECTION_REASONS.find(r => r.value === primaryReason);
  return reason?.followUps || [];
}

// Helper function to get display info for a rejection reason (including follow-ups)
export function getRejectionReasonDisplay(fullReason?: string): {
  primary: { label: string; emoji: string };
  followUp?: { label: string; emoji: string };
} | null {
  if (!fullReason) return null;
  
  const [primaryValue, followUpValue] = fullReason.split(':').map(s => s.trim());
  
  // Find primary reason
  const primaryReason = REJECTION_REASONS.find(r => r.value === primaryValue);
  if (!primaryReason) {
    // Handle custom "other" reasons
    if (primaryValue === 'other' && followUpValue) {
      return {
        primary: { label: followUpValue, emoji: '💬' }
      };
    }
    return null;
  }
  
  // Find follow-up if exists
  if (followUpValue && primaryReason.followUps) {
    const followUp = primaryReason.followUps.find(f => f.value === followUpValue);
    if (followUp) {
      return {
        primary: { label: primaryReason.label, emoji: primaryReason.emoji },
        followUp: { label: followUp.label, emoji: followUp.emoji }
      };
    }
  }
  
  return {
    primary: { label: primaryReason.label, emoji: primaryReason.emoji }
  };
}