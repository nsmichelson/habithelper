# Goals Mapping Documentation

## Where Goals Come From

Goals in your profile are derived from **TWO** quiz questions:

### 1. Main Goals Question: `real_goals` (Question #7)
**"What actually matters to you? (Not what you think you 'should' say)"**

This is a multiple choice question where users pick their top 2-3 real motivations:

| User Selection | Maps to Profile Goals |
|---------------|----------------------|
| "Look better naked" | → `weight_loss` |
| "Fit into my clothes better" | → `weight_loss` |
| "Not feel tired all the time" | → `improve_energy` |
| "Doctor told me I need to change" | → `better_lipids`, `lower_blood_pressure` |
| "Stop feeling bloated/gross" | → `improve_gut_health` |
| "Athletic performance" | → `endurance_performance`, `strength_performance` |
| "Keep up with my kids" | → `improve_energy`, `increase_veggies` |
| "Just want to be healthier" | → `improve_energy`, `increase_veggies` |
| "Feel more confident" | → (no direct mapping - might need to add) |
| "Be a good example for my family" | → (no direct mapping - might need to add) |

### 2. Vegetable Question: `real_talk` (Question #1)
**"Let's be real - what's your actual relationship with vegetables?"**

This adds an additional goal based on the answer:

| User Selection | Additional Goal Added |
|---------------|---------------------|
| "I have to hide them in other foods" | → `increase_veggies` |
| "I basically have the taste buds of a 5-year-old" (avoid) | → `increase_veggies` |

## All Possible Profile Goals

These are the goals that can appear in your profile:

- `weight_loss` - lose weight
- `muscle_gain` - build muscle  
- `reduce_sugar` - reduce sugar intake
- `improve_hydration` - stay hydrated
- `better_lipids` - improve heart health
- `less_processed_food` - eat less processed food
- `increase_veggies` - eat more vegetables
- `plant_based` - eat more plant-based
- `endurance_performance` - improve endurance
- `strength_performance` - get stronger
- `healthy_pregnancy` - support a healthy pregnancy
- `improve_energy` - have more energy
- `lower_blood_pressure` - lower blood pressure
- `improve_gut_health` - improve digestion

## Goals Not Currently Set by Quiz

These goals exist in the system but aren't mapped from any quiz questions:
- `muscle_gain`
- `reduce_sugar` 
- `improve_hydration`
- `less_processed_food`
- `plant_based`
- `healthy_pregnancy`

## Example

If you selected:
- "Not feel tired all the time" 
- "Doctor told me I need to change"
- "I have to hide them in other foods" (for veggies)

Your profile goals would be:
- `improve_energy` (from "Not feel tired")
- `better_lipids` (from "Doctor told me")
- `lower_blood_pressure` (from "Doctor told me") 
- `increase_veggies` (from hiding veggies)

This would display as: "have more energy, improve heart health, lower blood pressure, and eat more vegetables"