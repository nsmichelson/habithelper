# Habit Helper Tags Documentation

This directory contains comprehensive documentation of all tags used in the Habit Helper tips data across all five habit areas (Exercise, Nutrition, Organization, Productivity, and Relationships). The audit replaced umbrella tags (for example `better_habits`) with intent-specific goal, helps-with, feature, effort, and cost tags and introduced unified timing buckets to simplify downstream filtering.

## Files Overview

### 1. TAGS_REFERENCE.md (Primary Reference)
**The complete inventory of ALL unique tag values**
- Organized by area (Exercise, Nutrition, Organization, Productivity, Relationships)
- Lists every unique value for each tag field
- Includes summary statistics
- Best for: Developers, designers, and content creators who need the authoritative list

Content includes:
- All goals, mechanisms, features, etc. for each area
- Contraindications (especially important for relationships)
- Difficulty levels and sustainability patterns
- Equipment and time requirements

### 2. TAGS_ANALYSIS.md (Strategic Insights)
**Analysis and patterns across the data**
- Comparison tables showing differences between areas
- Key insights about design patterns
- Information architecture analysis
- Best for: Product managers, UX designers, and strategic decision-makers

Highlights:
- Why Nutrition is the most detailed area (28 specific goals, 23 helps-with tags)
- Why Relationships emphasizes safety (audit-expanded persona playbook goals and features plus 10 contraindications across 10 tips)
- Universal design principles across all areas
- Effort, time, and cost trade-offs by area using standardized buckets

### 3. TAGS_QUICK_LOOKUP.md (Implementation Guide)
**Fast reference for common queries**
- Organized by tag type (Goals, Effort, Time, etc.)
- Grouped by semantic meaning
- Selection flowcharts for common user scenarios
- Best for: Product designers, filtering logic implementers, user persona mapping

Useful for:
- "What are all the 0-5min tips?" queries
- Feature flagging and accessibility considerations
- Understanding tag relationships
- Building filtering UI

## Data Summary

### Coverage
- **Total tips**: 385
  - Exercise: 100
  - Nutrition: 100
  - Organization: 100
  - Productivity: 75
  - Relationships: 10

### Tag Diversity
- **Unique goals**: 61
- **Unique helps-with tags**: 61
- **Unique features**: 63
- **Effort levels in use**: minimal, low, medium, moderate
- **Standard time buckets**: 0-5, 5-15, 15-30, 30-60, 60+
- **Cost tiers**: `$`, `$$`

### Key Statistics by Area

| Metric | Exercise | Nutrition | Organization | Productivity | Relationships |
|--------|----------|-----------|---------------|--------------|-------------|
| Tips | 100 | 100 | 100 | 75 | 10 |
| Goals | 10 (audit replacements) | 28 | 10 | 10 | 10 |
| Helps With | 10 | 23 | 10 | 12 | 12 |
| Features | 7 | 8 | 4 | 4 | 10 |
| Effort levels | minimal–moderate | minimal–medium | minimal–low | minimal–moderate | minimal–low |
| Cost tiers | `$` | `$`, `$$` | `$` | `$` | `$` |

## Universal Patterns

### Always Present (All Areas)
- **Features**: chaos_proof, no_planning, solo_friendly (with impulse_friendly appearing in most areas)
- **Time**: 0-5 and 5-15 minute options anchored to the standardized buckets
- **Cost**: `$` baseline (Nutrition also offers `$$` upgrades)
- **When**: "any" is always an option
- **Difficulty**: Level 1 and 2 available
- **Source**: All coach_curated
- **Location**: Home is always an option

### Area-Specific Strengths
- **Exercise**: Most accessible (family/kid-friendly, group options)
- **Nutrition**: Most detailed (complex mechanisms, specific food items)
- **Organization/Productivity**: Most flexible (weekly options, as-needed)
- **Relationships**: Most safety-conscious (all tips include abuse warnings)

## Important Considerations

### Safety (Relationships)
**Every relationship tip includes contraindications about abuse/safety**

All 10 relationship tips emphasize:
- Professional support is needed for unsafe situations
- I-statements, pausing, and reflection can be dangerous in abusive contexts
- Users should prioritize safety planning with professionals

This is by design - the app takes seriously the reality that communication techniques can backfire in abusive relationships.

### Diet Trauma (Nutrition)
Nutrition tips include features like:
- `diet_trauma_safe` - for users with eating disorder history
- `not_diety` - doesn't feel restrictive
- `partner_resistant_ok` - works without partner participation

This reflects sensitivity to eating disorder recovery and food relationships.

### Accessibility (All Areas)
All areas emphasize:
- No upfront planning required
- Chaos-proof design (works even in crisis)
- Impulse-friendly (can be done on a whim)
- Solo execution possible

This aligns with the app's mission to serve "normies" and all users, not just health fanatics.

## How to Use This Documentation

### For Developers
1. Start with TAGS_REFERENCE.md for the complete data structure
2. Use TAGS_QUICK_LOOKUP.md for understanding tag categories
3. Reference TAGS_ANALYSIS.md for understanding design patterns

### For Product/UX
1. Read TAGS_ANALYSIS.md first for strategic insights
2. Use TAGS_QUICK_LOOKUP.md for user persona mapping
3. Refer to TAGS_REFERENCE.md for specific edge cases

### For Content Creators
1. Review area-specific sections in TAGS_REFERENCE.md
2. Understand mechanisms in TAGS_QUICK_LOOKUP.md
3. Check contraindications carefully (especially for relationships)

### For Data/Analytics
1. Use TAGS_REFERENCE.md summary statistics
2. Cross-reference with TAGS_ANALYSIS.md for patterns
3. Note the universal design principles in TAGS_ANALYSIS.md

## Key Insights for App Development

1. **Quick-win approach**: All areas surface 0-5 and 5-15 minute experiments within the standardized timing ladder, fitting the "daily experiment" model

2. **Safety first**: Relationships area explicitly includes safety warnings, suggesting the app won't suggest generic relationship advice without acknowledging abuse risk

3. **Approachability**: Universal features (chaos_proof, impulse_friendly, no_planning) mean tips work for any user state, not just the organized/dedicated

4. **Specificity varies**: Nutrition is highly specific (food items, tools) while Organization/Productivity are more abstract

5. **Flexibility in Nutrition**: Nutrition has the most time/location options, reflecting real-world eating patterns that don't fit a schedule

## Files Generated From

These documents were generated from:
- `/Users/nataliemichelson/Projects/habithelper/data/fitnessSimplifiedTips.ts` (100 tips)
- `/Users/nataliemichelson/Projects/habithelper/data/nutritionSimplifiedTips.ts` (100 tips)
- `/Users/nataliemichelson/Projects/habithelper/data/organizationSimplifiedTips.ts` (100 tips)
- `/Users/nataliemichelson/Projects/habithelper/data/productivitySimplifiedTips.ts` (75 tips)
- `/Users/nataliemichelson/Projects/habithelper/data/relationshipsSimplifiedTips.ts` (10 tips)

Generated: November 12, 2025

