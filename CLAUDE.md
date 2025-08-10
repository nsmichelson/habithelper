I am developing a delightful, user-friendly react native and expo app called habit helper. Unlike standard habit trackers I want this app to be mostly about helping users figure out what works for them by giving them simple daily "experiments" to try in areas they want to make or break 
habits. For instance, let’s say I was focused on eating less sugar - one daily experiment tip I might get would be “sub carbonated water for soda today” and I can choose to “try it”, “not interested in trying” or “maybe try another day”.

If I try it then that evening I should get a notification to check in on how it went. “Went great”, “Went ok”, “not great”, “didn’t end up trying”

I am planning to have these tips pre-prepared and scored along a bunch of dimensions that seem relevant to people trying to change nutrition habits. There are things like:
medical conditions that would affect nutrition needs like diabetes, hypertension, ibs or allergies
types of goals they care about (ex: weight loss, muscle gain, lipids panel, athletic performance)
Lifestyle and schedule feasibility and logistics - time available to prepare food or cook (if any), where meals tend to get eaten (desk, in car, at sit down dinners, restaurants, etc), ways work and parenting might change things and logistics
Budget and time constraints 
Food preferences - sweet tooth, need diversity in what eat, happy to eat the same thing over and over, cultural preferences
Age and stage of life (ex: pregnant, growing teen, etc)
What interested in learning 
How to cook 
Facts about nutrition
Not interested in learning to cook at all


These dimensions are critical to get a good feel for in the beginning with an intro quiz for the user (where I imagine some questions will be conditional on how a user responds to other questions) since they will inform the set of tips given to the user and the order of them. For instance if they are pregnant, some tips would not be appropriate or might even be dangerous for them - so I’d want to make sure those are never an option to show to the user.

For the set of tips that are options to show I would want to update the relevance to the user (as predicted by an algorithm that is a function of some of these dimensions). For instance, if I got that tip “sub carbonated water for soda today” and it worked for me, some of the dimensions on that tip might be things like:


Core Categories (attach to every tip)
Identity


tip_id: UUID (auto‑generated unique identifier)


summary: ≤ 120-character human-readable title


details_md: Markdown body (rich description and “how‑to” content)


Safety Filter


contraindications: List of medical or situational codes – choose zero or more from:


pregnancy – tip may not be suitable during pregnancy


breastfeeding – not suitable for nursing mothers


t1_diabetes – type 1 diabetes (insulin-dependent)


t2_diabetes – type 2 diabetes


hypertension – high blood pressure condition


celiac – celiac disease (requires gluten-free)


nut_allergy – allergy to peanuts or tree nuts


shellfish_allergy – shellfish or crustacean allergy


egg_allergy – allergy to eggshealthline.com


fish_allergy – allergy to finned fish (non-shellfish)healthline.com


soy_allergy – soy or soy-product allergyhealthline.com


lactose_intolerance – unable to digest lactose/dairy (common – ~65% of adults worldwideen.wikipedia.org)


ibs – irritable bowel syndrome (sensitive GI tract)


phenylketonuria – PKU (cannot have phenylalanine/aspartame)


kidney_disease – chronic kidney disease (dietary protein/potassium limits)


elderly_frailty – older adult with frailty (limited capacity)


disabled_swallowing – difficulty swallowing (dysphagia)


Goal Alignment


goal_tags: Multi-label list – pick any goals that apply to this tip:


weight_loss – support weight loss efforts


muscle_gain – help build muscle mass


reduce_sugar – reduce added sugar intake (better glycemic control)


improve_hydration – improve water/fluid intake


better_lipids – improve cholesterol/triglycerides for heart health


less_processed_food – eat fewer ultra-processed foods


increase_veggies – increase vegetable/fruit consumption


plant_based – support a plant-forward or vegetarian diet


endurance_performance – enhance aerobic/endurance performance


strength_performance – enhance strength/anaerobic performance


healthy_pregnancy – support nutritional needs in pregnancy


improve_energy – boost overall energy levels


lower_blood_pressure – help lower or manage blood pressuretorrancememorial.org


improve_gut_health – promote better digestive health (e.g. improve GI function)carpediemnutrition.com


Tip Type / Mechanism


tip_type: Multi-label list (choose 1–3 categories) describing the tip’s approach or behavior-change technique:


healthy_swap – a healthier substitute or swap for a food or habit


crave_buster – curbs cravings or unhealthy urges


planning_ahead – involves planning, prepping, or scheduling in advance


environment_design – changing physical environment to encourage healthy choice


skill_building – developing a skill (e.g. cooking, label-reading)


mindset_shift – changing perspective or mental approach


habit_stacking – attaching new habit to an existing routine


time_ritual – a regular timed routine or ritual


mood_regulation – managing mood/stress through the tip


self_monitoring – tracking or monitoring diet/behavior as part of the tip (e.g. food journal)


motivational_mechanism: What makes the tip psychologically rewarding or motivating (choose 1–3):


sensory – appealing to senses (tasty, visually pleasing, tactile enjoyment)


social – involves social interaction or support


novelty – provides variety or a novel experience


mastery – builds competence or skill (sense of accomplishment)


decision_ease – simplifies choices or reduces decision fatigue


comfort – offers comfort or stress relief (e.g. a healthy comfort-food alternative)


energy_boost – makes one feel more energized or refreshed


Effort Cost


time_cost_enum: Estimated time required per tip instance: 0_5_min, 5_15_min, 15_60_min, >60_min


money_cost_enum: Estimated monetary cost: $ (free or ≤ $5), $$ ($6–20), $$$ (> $20)


mental_effort: Mental/discipline effort on scale 1 (automatic/minimal willpower) to 5 (high discipline required)


physical_effort: Physical exertion on scale 1 (none/minimal) to 5 (very strenuous)


Context Fit


location_tags: Suitable locations or settings for the tip (choose any that apply): home, work, commute, travel, restaurant, social_event


social_mode: Social context for the tip: solo (done alone), group (done with others), or either


time_of_day: When the tip is most applicable: morning, afternoon, evening, late_night (choose any that apply)


cue_context: Optional situational cues/triggers (keywords from a controlled list) for when to use the tip, such as: meal_time, snack_time, craving_event, grocery_shopping, boredom, stress. (This field can be left blank if not tied to a specific cue.)


Difficulty


difficulty_tier: Difficulty or magnitude of change required, from 1 (tiny/easy change) to 5 (major overhaul of habits)


Provenance


created_by: Content source or review status. One of: dietitian_reviewed (professionally reviewed by a dietitian), coach_curated (selected by a coach or expert curator), community_submitted (submitted by user/community), ai_generated (generated by AI and optionally human-verified)

If the tip had said “plan to have carbonated water instead of a soda when out with friends” it might also serve needs for social and be a “planning ahead” type tip.

I feel like seeing what works and doesn’t work for users and then using these metrics behind the scene (with an algorithm like cosine similarity) can help find more tips that might work well for them? Over time I’ll also get user data and can use that to further inform the algorithm as well.

So in summary there’s:
Eligibility filtering – never show an inappropriate or unsafe tip.
Personalisation & ranking – prioritise tips the user is most likely to try and succeed with today.
Learning loop – use feedback (“went great / ok / not great / didn’t try”) to improve future recommendations for that individual and, over time, for everyone.


Every evening (or when the user next uses app after getting a tip) in addition to asking how the tip went it can also ask if they used any of the other previous ones they liked (only keeping ones they tried and liked)


I want this app to be THE go to app for "figuring out what works for me" when changing 
  habits. I want it to be approachable, fun, easy and delightful to use for all sorts of people - not just the usual fitness or 
  health fanatics but even normies like thoses that love sweets.  It should be extremely welcoming, easy to use and unintimidating to users.
