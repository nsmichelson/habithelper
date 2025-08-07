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





Here is a starting table for the nutrition goals:
Table 1: The Habit Helper Tip Database
tip_id
summary
details_md
contraindications
goal_tags
tip_type
motivational_mechanism
time_cost_enum
money_cost_enum
mental_effort
physical_effort
location_tags
social_mode
time_of_day
cue_context
difficulty_tier
created_by






a1b2c3d4-0001-4001-a001-1234567890ab
Swap one sugary drink for water or sparkling water.
The Experiment: For one day, whenever you would normally reach for a soda, sweetened juice, or other sugary beverage, substitute it with plain or naturally flavored sparkling water. Why it Works: Sugary drinks are a major source of "empty" calories and added sugars, which can contribute to weight gain and blood sugar fluctuations. Water or sparkling water provides hydration and can offer the satisfying carbonation of soda without the sugar or calories, helping to break the sugar habit.  
How to Try It: • Keep a pitcher of cold water or a few cans of sparkling water in the fridge. • If you enjoy flavor, add a squeeze of fresh lemon, lime, or a few muddled berries yourself.  
• When at a restaurant, ask for water or sparkling water with lemon instead of soda.
phenylketonuria
weight_loss, reduce_sugar, improve_hydration, less_processed_food
healthy_swap, crave_buster
sensory, decision_ease
0_5_min
$
1
1
home, work, restaurant, social_event, commute
either
morning, afternoon, evening
craving_event, meal_time, snack_time
1
dietitian_reviewed


a1b2c3d4-0002-4002-a002-1234567890ac
Add one serving of vegetables to your dinner.
The Experiment: Intentionally add one extra serving of vegetables to your dinner plate tonight. A serving is about the size of your fist or one cup. Why it Works: Most people don't eat enough vegetables. They are packed with vitamins, minerals, fiber, and antioxidants that are crucial for health and can lower the risk of chronic diseases. Adding volume with low-calorie, high-fiber vegetables can also help you feel fuller, aiding in portion control and weight management.  
How to Try It: • Add a handful of spinach to a pasta sauce or soup. • Steam or roast a side of broccoli or green beans. • Start your meal with a simple side salad. • Frozen vegetables are a quick and easy option; just microwave and serve.  


increase_veggies, weight_loss, improve_gut_health, less_processed_food, plant_based
healthy_swap, habit_stacking
mastery, sensory
0_5_min
$
2
1
home
either
evening
meal_time
1
dietitian_reviewed




f4a5b6c7-d8e9-0123-fabc-456789012345
Eat one meal without distractions.
The Experiment: Choose one meal today—breakfast, lunch, or dinner—and eat it without any distractions. This means no phone, no TV, no computer, no reading. Just you and your food. Why it Works: Mindful eating helps you reconnect with your body's natural hunger and fullness signals. Eating without distraction allows you to slow down, savor flavors and textures, and better recognize when you are satisfied, which can prevent overeating.  
How to Try It: • Sit at a table. • Put your phone in another room. • Pay attention to the colors, smells, sounds, and textures of your food. • Try putting your fork down between bites to pace yourself.  


weight_loss, improve_gut_health, mindset_shift
mindset_shift, environment_design
sensory, comfort
15_60_min
$
3
1
home, work
solo
morning, afternoon, evening
meal_time
3
dietitian_reviewed




a1b2c3d4-0004-4004-a004-1234567890ae
Prep a 'Salad in a Jar' for tomorrow's lunch.
The Experiment: Prepare a "salad in a jar" tonight for a ready-to-go, healthy lunch tomorrow. Why it Works: This is a classic meal prep technique that makes a healthy choice incredibly convenient, overcoming the common barrier of not having time to make a healthy lunch during a busy day. It's a form of environmental design for your future self.  
How to Try It: • Get a large mason jar. • Layer ingredients from wettest to driest: Pour dressing in the bottom. Add hard vegetables (carrots, cucumbers, peppers). Add grains/proteins (quinoa, chickpeas, grilled chicken). Add softer items (cheese, seeds, nuts). Top with leafy greens.  
• Seal and store in the fridge. To eat, just shake and pour into a bowl.


weight_loss, increase_veggies, less_processed_food, plant_based, improve_gut_health
planning_ahead, environment_design, skill_building
decision_ease, mastery
5_15_min
$$
2
1
home
solo
evening
meal_time
2
coach_curated


a1b2c3d4-0005-4005-a005-1234567890af
Eat to 80% full at one meal.
The Experiment: At one of your main meals today, practice eating slowly and stop when you feel about 80% full—satisfied, but not stuffed. Why it Works: It takes about 15-20 minutes for your stomach to signal to your brain that it's full. Eating slowly and stopping at 80% full gives your body time to register satiety, helping you naturally reduce calorie intake without feeling deprived. This is a core habit for long-term weight management.  
How to Try It: • Serve yourself a slightly smaller portion than usual to start. • Eat slowly and mindfully, paying attention to how your stomach feels. • Pause halfway through your meal for a minute and assess your hunger level.  
• Aim for a feeling of "no longer hungry" rather than "full."


weight_loss, mindset_shift, improve_gut_health
mindset_shift, self_monitoring
mastery, comfort
15_60_min
$
4
1
home, work, restaurant
either
morning, afternoon, evening
meal_time
3
dietitian_reviewed


a1b2c3d4-0006-4006-a006-1234567890b0
Habit Stack: Drink a glass of water before your morning coffee.
The Experiment: Before you have your first cup of coffee or tea in the morning, drink a full 8 oz (240 ml) glass of water. Why it Works: This is a classic "habit stacking" technique, attaching a new desired habit (drinking water) to a strong existing habit (morning coffee). It starts your day with hydration, as you're often dehydrated after sleeping, and can help you reach your daily fluid goals.  
How to Try It: • The night before, place a glass and a pitcher of water right next to your coffee maker. • Make it a non-negotiable rule: water first, then coffee.


improve_hydration, improve_energy
habit_stacking, time_ritual
decision_ease, energy_boost
0_5_min
$
1
1
home, work
solo
morning
craving_event
1
coach_curated




a7b8c9d0-e1f2-3456-abcd-789012345678
Add 20-30g of protein to your breakfast.
The Experiment: Include a significant source of protein—like eggs, Greek yogurt, or protein powder—in your breakfast today. Aim for 20-30 grams. Why it Works: Protein is the most satiating macronutrient. Including it in your first meal helps you feel full longer, reducing cravings and the likelihood of snacking on less healthy options before lunch. After an overnight fast, it also helps stabilize blood sugar and provides sustained energy.  
How to Try It: • Scramble 2-3 eggs instead of having just toast or cereal.  
• Stir a scoop of protein powder into your oatmeal or yogurt.  
• A cup of Greek yogurt or cottage cheese can provide over 20g of protein.
egg_allergy, lactose_intolerance, phenylketonuria, kidney_disease
weight_loss, muscle_gain, reduce_sugar, improve_energy
healthy_swap, planning_ahead
energy_boost, mastery
5_15_min
$$
2
1
home, work
either
morning
meal_time
2
dietitian_reviewed
a1b2c3d4-0008-4008-a008-1234567890b2
Swap a processed snack for a piece of whole fruit.
The Experiment: Today, when you feel like having a snack, replace your usual choice (like chips, cookies, or a granola bar) with a piece of whole fruit. Why it Works: Whole fruit provides fiber, vitamins, and water, making it a more nutrient-dense and filling choice than most processed snacks. This simple swap reduces your intake of added sugars, refined grains, and unhealthy fats while increasing your intake of beneficial nutrients.  
How to Try It: • Keep a bowl of fruit like apples, bananas, or oranges visible on your counter. • Pack a portable fruit with you for work or errands. • To make it more satisfying, pair it with a small handful of nuts or a spoonful of peanut butter.  


increase_veggies, weight_loss, reduce_sugar, less_processed_food, improve_gut_health
healthy_swap, crave_buster
sensory, decision_ease
0_5_min
$
1
1
home, work, commute
solo
afternoon, morning
snack_time, craving_event
1
dietitian_reviewed




b4c5d6e7-f8a9-0123-bcde-456789012345
Try the "Colorful Plate" Challenge.
The Experiment: For one meal today, try to include foods of at least three different colors on your plate. Why it Works: Different colors in fruits and vegetables signify the presence of different vitamins, minerals, and antioxidant compounds (phytonutrients). "Eating the rainbow" is a simple heuristic to ensure you're getting a wide variety of nutrients that support overall health, from your immune system to your cardiovascular system.  
How to Try It: • Make a salad with green lettuce, red tomatoes, and yellow bell peppers. • Create a stir-fry with purple cabbage, orange carrots, and green broccoli. • Roast a mix of red onions, green zucchini, and white cauliflower.


increase_veggies, improve_gut_health, less_processed_food, plant_based
skill_building, mindset_shift
sensory, novelty, mastery
5_15_min
$$
2
1
home
either
evening, afternoon
meal_time
2
dietitian_reviewed




a1b2c3d4-0010-4010-a010-1234567890b4
The Kitchen Makeover: Hide one 'red light' food.
The Experiment: Identify one food or snack in your kitchen that you tend to overeat or know isn't helping your goals (a "red light" food). Move it out of sight. Why it Works: This is a small-scale version of the "kitchen makeover". You are changing your food environment to make the less-healthy choice harder to access. Out of sight is often out of mind. This reduces the number of times you have to exercise willpower during the day.  
How to Try It: • Move the cookies from the counter to a high shelf in the pantry. • Put the bag of chips in an opaque container instead of its original crinkly bag. • Ask a family member to store a tempting item where you won't easily find it.  


weight_loss, reduce_sugar, less_processed_food
environment_design
decision_ease
0_5_min
$
1
1
home
solo
morning, afternoon, evening, late_night
boredom, stress
1
coach_curated




a1b2c3d4-e5f6-7890-abcd-123456789012
Choose whole grains over refined for one meal.
The Experiment: For one meal today, deliberately choose a whole-grain carbohydrate source instead of a refined one. Why it Works: Whole grains like brown rice, quinoa, and whole-wheat bread contain more fiber, vitamins, and minerals than their refined counterparts (white rice, white bread). The higher fiber content helps you feel full for longer, aids in digestion, and supports more stable blood sugar levels.  
How to Try It: • Swap white pasta for whole-wheat pasta. • Choose brown rice instead of white rice with your stir-fry or curry. • Make a sandwich using 100% whole-wheat bread. Look for "100% whole grain" as the first ingredient.  
celiac
weight_loss, improve_gut_health, less_processed_food, better_lipids, reduce_sugar, improve_energy
healthy_swap, skill_building
mastery, sensory
0_5_min
$
2
1
home, restaurant
either
morning, afternoon, evening
meal_time, grocery_shopping
2
dietitian_reviewed




a1b2c3d4-0012-4012-a012-1234567890b6
Have a healthy fat snack like nuts or avocado.
The Experiment: For one of your snacks today, choose a source of healthy fats, such as a small handful of nuts (about 1/4 cup) or half an avocado. Why it Works: Healthy fats are essential for hormone production and overall health. They are also very satiating, helping to keep you full between meals. Nuts and avocados also provide fiber and other important nutrients. Contrary to old beliefs, dietary fat is not to be feared and is a key part of a balanced diet.  
How to Try It: • A small handful of almonds, walnuts, or mixed nuts. • Half an avocado sprinkled with salt and pepper. • Apple slices with a tablespoon of natural almond or peanut butter.  
nut_allergy
weight_loss, better_lipids, improve_energy, reduce_sugar
healthy_swap, crave_buster
sensory, energy_boost
0_5_min
$$
1
1
home, work, commute
solo
afternoon
snack_time
1
dietitian_reviewed




e9f0a1b2-c3d4-5678-efab-901234567890
Pre-portion snacks into daily servings.
The Experiment: If you plan to have snacks today, take five minutes in the morning to portion them out into small bags or containers. Why it Works: This simple act of planning prevents mindless overeating directly from a large bag or box. It's a form of portion control that requires a decision only once, making it easier to stick to your goals when you're hungry or distracted later in the day. It's a key strategy for managing calorie intake without obsessive counting.  
How to Try It: • Get out a box of crackers or a bag of nuts. • Use a measuring cup or just count out a reasonable serving size (e.g., 1 ounce of nuts). • Put each portion into a separate small container or zip-top bag.
nut_allergy
weight_loss, reduce_sugar, less_processed_food, better_lipids
planning_ahead, environment_design, self_monitoring
decision_ease, mastery
5_15_min
$$
2
1
home, work
solo
morning
snack_time, grocery_shopping
2
coach_curated




a1b2c3d4-0014-4014-a014-1234567890b8
Make your own simple salad dressing.
The Experiment: Instead of using a store-bought bottled dressing, make your own simple vinaigrette for your salad today. Why it Works: Many commercial salad dressings are high in added sugar, unhealthy fats, and sodium. Making your own is surprisingly easy and gives you complete control over the ingredients. A simple olive oil and vinegar dressing provides heart-healthy monounsaturated fats.  
How to Try It: • The classic ratio is 3 parts oil to 1 part vinegar. • In a small jar, combine 3 tablespoons of extra virgin olive oil with 1 tablespoon of balsamic or red wine vinegar. • Add a pinch of salt, pepper, and maybe a little Dijon mustard. Shake well and serve.


less_processed_food, better_lipids, reduce_sugar, increase_veggies
skill_building, healthy_swap
mastery, sensory
0_5_min
$
2
1
home
solo
afternoon, evening
meal_time
2
dietitian_reviewed




f8a9b0c1-d2e3-4567-fabc-890123456789
Eat Slowly: Take 20+ Minutes for Main Meals.
The Experiment: For one meal, set a timer for 20 minutes and aim to make the meal last the entire time. Why it Works: This is a structured way to practice eating slowly. It forces you to pace yourself, which gives your brain the time it needs to register fullness cues from your stomach, helping to prevent overeating. This practice builds body awareness and is a powerful tool for mindful eating.  
How to Try It: • Set a timer on your phone or kitchen timer for 20 minutes when you sit down to eat. • Take smaller bites and chew each bite thoroughly. • Put your utensils down between bites. • Try to be the last person at the table to finish.


weight_loss, mindset_shift, improve_gut_health
time_ritual, self_monitoring, skill_building
mastery, comfort
15_60_min
$
3
1
home, restaurant
either
evening, afternoon
meal_time
3
coach_curated




a1b2c3d4-0016-4016-a016-1234567890ba
Eat your water: snack on cucumber or watermelon.
The Experiment: Have a snack that consists of a high-water-content food, like cucumber slices, celery sticks, or watermelon chunks. Why it Works: Hydration doesn't only come from beverages. Many fruits and vegetables have very high water content, contributing to your daily fluid needs. These snacks are also typically low in calories and high in nutrients, making them a refreshing and healthy choice.  
How to Try It: • Slice up a cucumber and enjoy it plain or with a little hummus. • Cut a watermelon into cubes for a sweet, hydrating treat. • Pack some celery sticks for a crunchy snack on the go.


improve_hydration, increase_veggies, weight_loss
healthy_swap
sensory, energy_boost
0_5_min
$
1
1
home, work
solo
afternoon
snack_time
1
dietitian_reviewed




a1b2c3d4-0017-4017-a017-1234567890bb
Add a "flavor boost" to water instead of juice.
The Experiment: Instead of reaching for a fruit juice or other sweet drink, flavor a glass of water with fresh ingredients. Why it Works: This provides flavor and novelty without the high sugar content of juice. Even 100% fruit juice is a concentrated source of sugar without the fiber of whole fruit. Infusing water is a great way to make hydration more appealing and reduce overall sugar intake.  
How to Try It: • Add slices of citrus (lemon, orange) and some fresh mint leaves to a pitcher of water. • Muddle a few raspberries or strawberries at the bottom of your glass before adding water. • Try cucumber slices and a sprig of rosemary for a more savory, spa-like flavor.


improve_hydration, reduce_sugar, less_processed_food
healthy_swap, crave_buster
sensory, novelty
0_5_min
$
1
1
home, work
either
afternoon, morning
craving_event, snack_time
1
dietitian_reviewed




a1b2c3d4-0018-4018-a018-1234567890bc
Try Greek yogurt instead of sour cream or mayo.
The Experiment: If you have a meal or snack that typically uses sour cream or mayonnaise, try substituting plain Greek yogurt instead. Why it Works: Plain Greek yogurt has a similar tangy flavor and creamy texture to sour cream and mayo but is significantly higher in protein and lower in fat and calories. This swap boosts the nutritional value of your meal, helping you feel fuller and supporting muscle maintenance or growth.  
How to Try It: • Top a baked potato or chili with a dollop of Greek yogurt. • Make a creamy dip for vegetables using Greek yogurt as the base. • Use it in place of mayonnaise when making tuna or chicken salad.
lactose_intolerance
weight_loss, muscle_gain, less_processed_food, better_lipids
healthy_swap
mastery, sensory
0_5_min
$
1
1
home
solo
afternoon, evening
meal_time, snack_time
2
coach_curated




a1b2c3d4-0019-4019-a019-1234567890bd
Go for a 10-minute walk after a meal.
The Experiment: After one of your main meals today, go for a brisk 10-minute walk. Why it Works: Walking after a meal can aid digestion and help stabilize blood sugar levels. It's a gentle way to incorporate more physical activity into your day, which contributes to overall energy expenditure and health. It also serves as a positive post-meal ritual instead of immediately sitting on the couch.  
How to Try It: • Right after you finish eating, put on your shoes and head out the door. • Walk around your neighborhood, a nearby park, or even just around your office building. • Listen to a podcast or music to make it more enjoyable.
elderly_frailty
weight_loss, improve_gut_health, reduce_sugar, improve_energy
habit_stacking, time_ritual
energy_boost, comfort
5_15_min
$
2
2
home, work
solo
afternoon, evening
meal_time
2
coach_curated




a1b2c3d4-0020-4020-a020-1234567890be
Create 'overnight oats' for tomorrow's breakfast.
The Experiment: Tonight, take 5 minutes to prepare overnight oats for a grab-and-go breakfast tomorrow morning. Why it Works: This is a powerful meal prep strategy that eliminates morning decision-making and ensures you start the day with a high-fiber, protein-rich meal. It's convenient, customizable, and helps prevent skipping breakfast or grabbing a less healthy option on the way out the door.  
How to Try It: • In a jar or container, combine equal parts rolled oats and milk (or a milk alternative). A common starting point is 1/2 cup of each.  
• Add a scoop of protein powder, a tablespoon of chia seeds, and some fruit like berries. • Stir, cover, and refrigerate overnight. Eat it cold in the morning.
celiac
weight_loss, muscle_gain, improve_hydration, improve_gut_health, reduce_sugar
planning_ahead, environment_design
decision_ease, mastery
0_5_min
$$
2
1
home
solo
evening
meal_time
2
coach_curated


a1b2c3d4-0021-4021-a021-1234567890bf
Have a hard-boiled egg for a snack.
The Experiment: For a quick and easy snack, have one or two hard-boiled eggs. Why it Works: Eggs are a powerhouse of nutrition, providing high-quality protein and essential vitamins and minerals in a convenient, low-calorie package. The protein helps keep you full and satisfied, making it an excellent choice for curbing hunger between meals and preventing overeating later.  
How to Try It: • Boil a batch of eggs at the beginning of the week so they are ready to grab. • A perfectly hard-boiled egg with a just-cooked yolk takes about 7-8 minutes in boiling water.  
• Peel and eat with a sprinkle of salt and pepper.
egg_allergy
weight_loss, muscle_gain, reduce_sugar
healthy_swap, planning_ahead
decision_ease, energy_boost
0_5_min
$
1
1
home, work
solo
morning, afternoon
snack_time
1
dietitian_reviewed


d0e1f2a3-b4c5-6789-defa-012345678901
Use Palm-Size Protein Portions.
The Experiment: Include one palm-sized portion of protein (e.g., chicken, fish, tofu) at every meal today. Why it Works: Consistent protein intake helps maintain muscle mass and promotes satiety. Using your palm as a guide is a simple, portable way to estimate a 20-30g protein portion without measuring or weighing, making it easy to apply anywhere.  
How to Try It: • At each meal, look at the protein source on your plate. • A serving that is roughly the size and thickness of your palm (excluding fingers) is one portion. • Adjust based on your hand size and activity level.


muscle_gain, weight_loss, improve_energy
skill_building, self_monitoring
decision_ease, mastery
0_5_min
$$
1
1
home, work, restaurant
either
morning, afternoon, evening
meal_time
1
coach_curated




e1f2a3b4-c5d6-7890-efab-123456789012
Fill Half Your Plate with Vegetables First.
The Experiment: At one meal today, physically fill half of your plate with vegetables before adding any protein or carbohydrates. Why it Works: This "higher-order habit" is highly effective. This sequential plating strategy naturally controls portions of more calorie-dense foods while ensuring you meet your fiber and micronutrient needs. It makes a healthy choice the default.  
How to Try It: • Grab your plate. Before adding anything else, load up half of it with a large salad, steamed broccoli, or roasted mixed vegetables. • Then, use the remaining half of the plate for your protein and carb sources.


increase_veggies, weight_loss, improve_gut_health, plant_based
habit_stacking, skill_building
decision_ease, mastery
0_5_min
$$
1
1
home, restaurant
either
afternoon, evening
meal_time
1
dietitian_reviewed




a1b2c3d4-0024-4024-a024-1234567890c2
Plan tomorrow's meals before you go to bed.
The Experiment: Tonight, take 5-10 minutes to think about and write down what you plan to eat for your main meals tomorrow. Why it Works: Planning ahead significantly reduces in-the-moment decision making when you're hungry, stressed, or rushed—times when you're most likely to make less-healthy choices. This simple act of forethought makes you more likely to stick to your goals.  
How to Try It: • Use a notebook or a notes app on your phone. • Jot down a simple plan: Breakfast (e.g., oatmeal), Lunch (e.g., leftovers from dinner), Dinner (e.g., chicken and veggies). • This can also help you identify if you need to do any small prep tasks, like taking something out of the freezer.


weight_loss, reduce_sugar, less_processed_food
planning_ahead, mindset_shift
decision_ease, mastery
5_15_min
$
2
1
home
solo
evening
boredom, stress
2
coach_curated




a1b2c3d4-0025-4025-a025-1234567890c3
Try a 'Meat-Free Monday' (or any day) meal.
The Experiment: For one day this week, or just for one meal, replace the meat with a plant-based protein source. Why it Works: Incorporating more plant-based meals can increase your intake of fiber and beneficial plant compounds, while potentially reducing intake of saturated fat. Beans, peas, and lentils are excellent sources of fiber and protein and are very budget-friendly.  
How to Try It: • Make tacos or chili using black beans or lentils instead of ground beef. • Try a veggie burger instead of a beef burger. • Add chickpeas or tofu to a salad or stir-fry for your protein source.  


plant_based, increase_veggies, improve_gut_health, better_lipids, less_processed_food
healthy_swap, novelty
novelty, sensory
15_60_min
$
2
2
home, restaurant
either
evening
meal_time
2
dietitian_reviewed




a1b2c3d4-0026-4026-a026-1234567890c4
Add healthy fats to your post-workout meal.
The Experiment: After your workout today, include one or two "thumbs" of a healthy fat source in your recovery meal. Why it Works: While protein and carbs are key for post-workout recovery, healthy fats play an important role in a balanced diet by helping to slow digestion and manage inflammation. Including them ensures your recovery meal is well-rounded and contributes to overall nutrient needs.  
How to Try It: • Add a thumb-sized portion of mixed nuts or seeds to your post-workout salad. • Blend a tablespoon of flax seeds into your recovery smoothie. • Top your post-workout meal with a few slices of avocado.  
nut_allergy
muscle_gain, strength_performance, endurance_performance, better_lipids
skill_building, healthy_swap
mastery, energy_boost
0_5_min
$$
2
1
home
solo
morning, afternoon, evening
meal_time
3
coach_curated




a1b2c3d4-0027-4027-a027-1234567890c5
Build a performance-focused pre-workout smoothie.
The Experiment: If you have a workout planned, try fueling it with a simple, easy-to-digest smoothie 30-60 minutes beforehand. Why it Works: A liquid meal before training is quickly digested, providing accessible energy (from carbs) and amino acids (from protein) to fuel your workout and reduce muscle damage without making you feel heavy or bloated.  
How to Try It: • Blend: 1 scoop of protein powder, 1 fist of spinach, 1 cupped handful of berries or a banana, 1 thumb of flax seeds, and water or unsweetened almond milk.  
• This provides the ideal P+C (protein + carbohydrate) combination for performance.
lactose_intolerance, nut_allergy, soy_allergy
muscle_gain, strength_performance, endurance_performance, improve_energy
planning_ahead, healthy_swap
energy_boost, decision_ease
5_15_min
$$
2
2
home
solo
morning, afternoon, evening
meal_time
3
dietitian_reviewed


a1b2c3d4-0028-4028-a028-1234567890c6
Have a high-protein yogurt bowl for a snack.
The Experiment: When you need a filling snack, create a bowl using plain Greek yogurt or Icelandic skyr as the base. Why it Works: These types of yogurt are exceptionally high in protein, which promotes satiety and helps control hunger. It's a versatile base for a balanced mini-meal that can curb cravings for sweets or less-healthy options.  
How to Try It: • Start with a serving of plain, unsweetened Greek yogurt. • Top with a handful of berries for fiber and antioxidants. • Add a sprinkle of nuts or seeds for healthy fats and crunch.  
lactose_intolerance, nut_allergy
weight_loss, muscle_gain, reduce_sugar, improve_gut_health
healthy_swap, crave_buster
sensory, decision_ease
0_5_min
$$
1
1
home, work
solo
afternoon, morning
snack_time, craving_event
1
dietitian_reviewed




b2c3d4e5-f6a7-8901-bcde-234567890123
Eat one serving of oily fish this week.
The Experiment: Plan to have at least one meal this week that includes a serving of oily fish like salmon, mackerel, or sardines. Why it Works: Oily fish are rich in omega-3 fatty acids (EPA/DHA), which are crucial for heart and brain health and have anti-inflammatory properties. Most people don't get enough of these beneficial fats. Aim for 2-3 servings weekly.  
How to Try It: • Grill or bake a salmon fillet for dinner. • Add canned sardines or mackerel to a salad for a quick and easy lunch. • Choose from fresh, frozen, or canned options to fit your budget and convenience needs.  
fish_allergy, shellfish_allergy
better_lipids, healthy_pregnancy, improve_energy
planning_ahead, healthy_swap
mastery
5_15_min
$$
2
1
home, restaurant
either
evening, afternoon
meal_time
3
dietitian_reviewed




a1b2c3d4-0030-4030-a030-1234567890c8
Drink a glass of water when you feel a snack craving.
The Experiment: The next time you feel a craving for a snack, especially when you know you're not truly hungry (e.g., out of boredom or stress), drink a full glass of water first. Why it Works: Thirst is often mistaken for hunger. Pausing to drink water gives you a moment to check in with your body's cues. It may satisfy the craving, or at least give you time to make a more mindful choice about whether you really need to eat.  
How to Try It: • When a craving hits, go to the kitchen or water cooler and drink an 8 oz (240 ml) glass of water. • Wait 10-15 minutes. • Re-evaluate if you are still hungry. If you are, choose a healthy snack. If not, you've successfully hydrated and avoided unnecessary calories.


improve_hydration, weight_loss, mindset_shift, reduce_sugar
crave_buster, mindset_shift
decision_ease, mastery
0_5_min
$
2
1
home, work
solo
afternoon, evening, late_night
craving_event, boredom, stress
2
coach_curated




a1b2c3d4-0031-4031-a031-1234567890c9
Batch cook a versatile grain for the week.
The Experiment: Cook a large batch of a whole grain like quinoa, brown rice, or farro to use in meals throughout the week. Why it Works: Having a pre-cooked, healthy carbohydrate source ready in the fridge makes assembling quick meals effortless. It's a foundational meal prep task that saves time and makes it easy to build balanced bowls, salads, and side dishes without starting from scratch each time.  
How to Try It: • Cook 2-3 cups of your chosen grain according to package directions. • Let it cool completely, then store it in an airtight container in the refrigerator for up to 4 days. • Add a scoop to salads, use as a base for a "rice bowl," or serve as a side with protein and veggies.
celiac
weight_loss, less_processed_food, improve_gut_health, plant_based
planning_ahead, environment_design
decision_ease, mastery
15_60_min
$
2
1
home
solo
evening
meal_time
3
coach_curated




a5b6c7d8-e9f0-1234-abcd-567890123456
Use the 'Hunger Scale' before you eat.
The Experiment: Before you eat a meal or snack, take a moment to rate your physical hunger on a scale of 1 to 10. Why it Works: This mindful eating exercise helps you distinguish between true, physical hunger and emotional or environmental triggers for eating (like stress or seeing food). Practicing this helps you become more attuned to your body's signals, leading to more intentional eating choices.  
How to Try It: • Use a simple scale: 1 = ravenous, 5 = neutral, 10 = uncomfortably stuffed. • Pause before eating and ask, "What number am I right now?" • Ideally, you want to start eating around a 3 or 4 ("getting hungry") and stop around a 6 or 7 ("pleasantly satisfied").


mindset_shift, weight_loss, improve_energy
self_monitoring, skill_building, mindset_shift
mastery
0_5_min
$
3
1
home, work, restaurant
either
morning, afternoon, evening, late_night
meal_time, snack_time, craving_event
2
dietitian_reviewed




a1b2c3d4-0033-4033-a033-1234567890cb
Add beans or lentils to a soup or salad.
The Experiment: Boost the fiber and protein content of a soup or salad by adding a half-cup of canned beans or lentils. Why it Works: Beans and lentils are nutritional powerhouses—high in plant-based protein, dietary fiber, and various micronutrients. Adding them to a meal makes it more filling and satisfying, helping with appetite control. They are also an inexpensive way to add bulk and nutrition.  
How to Try It: • Drain and rinse a can of chickpeas, black beans, or kidney beans. • Toss them into your favorite green salad. • Stir them into a canned or homemade soup to make it heartier.


plant_based, increase_veggies, improve_gut_health, weight_loss, muscle_gain
healthy_swap
decision_ease, sensory
0_5_min
$
1
1
home
solo
afternoon, evening
meal_time
1
dietitian_reviewed




a1b2c3d4-0034-4034-a034-1234567890cc
Pack an 'emergency' healthy snack in your bag.
The Experiment: Place a non-perishable, healthy snack in your work bag, car, or purse to have on hand for unexpected hunger. Why it Works: This is an environmental design strategy to combat "hanger" and prevent you from grabbing a convenient but unhealthy option when you're out and about. Having a planned, healthy option available removes the decision-making process when you're low on energy and willpower.  
How to Try It: • Good options include a small bag of almonds, a protein bar, or a packet of nut butter. • Choose something you genuinely like so you'll be happy to eat it. • Replace it as soon as you use it so you're always prepared.
nut_allergy
weight_loss, reduce_sugar, less_processed_food
planning_ahead, environment_design
decision_ease, comfort
0_5_min
$$
1
1
work, commute, travel
solo
morning, afternoon
craving_event, stress
1
coach_curated




a1b2c3d4-0035-4035-a035-1234567890cd
Replace cooking oil with a spray for one meal.
The Experiment: When pan-frying or sautéing a meal, use an oil spray instead of pouring oil from a bottle. Why it Works: Cooking oils are very calorie-dense (a tablespoon of olive oil has about 120 calories). While healthy fats are important, it's easy to pour far more than you need, adding hundreds of hidden calories to a meal. Using a spray provides a much lighter coating, significantly reducing the overall calorie count without sacrificing the non-stick benefit. How to Try It: • Use a commercial oil spray (like avocado or olive oil spray). • Lightly coat the surface of your pan just until it shimmers. • This is a great trick for sautéing vegetables or cooking eggs or lean proteins.


weight_loss, better_lipids
healthy_swap, skill_building
decision_ease
0_5_min
$
2
1
home
solo
morning, afternoon, evening
meal_time
2
coach_curated






c5d6e7f8-a9b0-1234-cdef-567890123456
Try a vegetable-based 'noodle' instead of pasta.
The Experiment: For a pasta-style dish, try substituting traditional pasta with a vegetable alternative like spaghetti squash or zucchini noodles ("zoodles"). Why it Works: This swap dramatically increases the vegetable and fiber content of your meal while significantly reducing the carbohydrate and calorie load. It's a great way to enjoy the comfort of a pasta dish while working towards goals like weight loss or increased vegetable intake.  
How to Try It: • You can buy pre-spiralized zucchini noodles or make your own with a spiralizer. Sauté them for a few minutes until tender. • For spaghetti squash, cut it in half, roast it, and then scrape out the noodle-like strands with a fork.  
• Top with your favorite sauce and protein.


increase_veggies, weight_loss, reduce_sugar, plant_based, less_processed_food
healthy_swap, novelty, skill_building
novelty, sensory, mastery
15_60_min
$$
3
3
home
either
afternoon, evening
meal_time
3
community_submitted


a1b2c3d4-0037-4037-a037-1234567890cf
Deconstruct your craving: What do you really want?
The Experiment: When a strong craving hits, pause for a moment and try to identify the sensory properties you're seeking. Is it crunchy, creamy, sweet, salty, or warm? Why it Works: Cravings are often for a specific texture or sensation, not necessarily a specific unhealthy food. By deconstructing the craving, you can find a healthier alternative that satisfies the sensory need. This is a mindful approach to managing cravings rather than just suppressing them.  
How to Try It: • Craving crunchy and salty chips? Try roasted chickpeas or celery sticks with salt. • Craving creamy ice cream? Try a bowl of rich Greek yogurt with berries. • Craving something sweet? Try a piece of fruit or a date.


mindset_shift, reduce_sugar, weight_loss
crave_buster, mindset_shift
mastery
0_5_min
$
3
1
home, work
solo
afternoon, evening, late_night
craving_event, boredom, stress
2
coach_curated




f6a7b8c9-d0e1-2345-fabc-678901234567
Eat your protein and veggies first.
The Experiment: At one meal today, eat the protein and vegetables on your plate before you eat the carbohydrates. Why it Works: Starting with high-fiber vegetables and satiating protein can help you feel fuller sooner. By the time you get to the more calorie-dense carbs, you may be satisfied with a smaller portion. This meal sequencing can trigger satiety hormones and improve post-meal energy levels.  
How to Try It: • If you have a side salad, eat it first. • If you have roasted broccoli and chicken, finish all the broccoli and chicken before starting the rice or potatoes. • This works especially well at restaurants when bread is served—ask for a side salad to eat while you wait.


weight_loss, increase_veggies, improve_gut_health, improve_energy, better_lipids
mindset_shift, habit_stacking, skill_building
decision_ease, mastery
0_5_min
$
2
1
home, restaurant
either
afternoon, evening
meal_time
2
community_submitted




a1b2c3d4-0039-4039-a039-1234567890d1
Keep a water bottle on your desk or in sight all day.
The Experiment: For the entire day, keep a filled water bottle within your arm's reach and line of sight. Why it Works: This is a classic and highly effective environmental design tactic. The visual cue of the water bottle constantly reminds you to drink, and its accessibility makes it effortless to do so. This simple change can dramatically increase your daily water intake.  
How to Try It: • Choose a reusable water bottle you enjoy using. • Fill it up first thing in the morning and place it on your desk, in your car's cup holder, or on the counter where you spend the most time. • Refill it as soon as it's empty.  


improve_hydration
environment_design
decision_ease
0_5_min
$
1
1
home, work, commute, travel
solo
morning, afternoon, evening


1
dietitian_reviewed




a1b2c3d4-0040-4040-a040-1234567890d2
Create a "protein pudding" for a sweet treat.
The Experiment: Make a healthy, high-protein dessert by creating a "pudding" from protein powder. Why it Works: This satisfies a craving for a sweet, creamy dessert while providing a significant dose of protein, which is much more satiating and beneficial for body composition than a typical sugar-laden pudding. It's a smart swap that aligns with fitness goals.  
How to Try It: • In a small bowl, mix one scoop of casein or a whey/casein blend protein powder (vanilla or chocolate work well) with a very small amount of milk or water. • Stir vigorously, adding liquid a tiny bit at a time, until it reaches a thick, pudding-like consistency. • For best results, chill in the freezer for 10-15 minutes.  
lactose_intolerance, soy_allergy
reduce_sugar, muscle_gain, weight_loss
healthy_swap, crave_buster
sensory, mastery
0_5_min
$$
2
1
home
solo
evening, late_night
craving_event
2
coach_curated




a1b2c3d4-0041-4041-a041-1234567890d3
Make a 'no-tuna' chickpea salad sandwich.
The Experiment: For a plant-based lunch, try making a "tuna-style" salad using mashed chickpeas instead of tuna. Why it Works: This is a creative, plant-based swap that mimics a familiar comfort food. Chickpeas provide plant-based protein and a high amount of fiber, making it a filling and gut-healthy option. It's a great way to reduce meat consumption and increase plant food variety.  
How to Try It: • Drain a can of chickpeas and mash them with a fork. • Mix with a small amount of Greek yogurt or vegan mayo, chopped celery, red onion, and seasonings like dill, salt, and pepper. • Serve on whole-wheat bread or with crackers.
celiac, lactose_intolerance
plant_based, increase_veggies, improve_gut_health, better_lipids
healthy_swap, novelty
sensory, novelty
5_15_min
$
2
1
home
solo
afternoon
meal_time
2
coach_curated




e7f8a9b0-c1d2-3456-efab-789012345678
Stop eating 2-3 hours before bedtime.
The Experiment: Tonight, try to finish your last meal or snack at least 2-3 hours before you go to sleep. Why it Works: This creates a mini-fasting window overnight. For some people, this can improve sleep quality and digestion. It also helps to prevent late-night, often mindless, snacking which can contribute significant calories. Chronobiology research shows late-night eating can disrupt circadian rhythms.  
How to Try It: • If you normally go to bed at 11 PM, aim to have your dinner or last snack finished by 8 PM. • If you feel hungry after this time, try having a glass of water or a cup of herbal tea.
t1_diabetes, t2_diabetes, pregnancy, breastfeeding
weight_loss, improve_gut_health, mindset_shift, improve_energy
time_ritual, crave_buster
mastery, comfort
0_5_min
$
3
1
home
solo
evening, late_night
meal_time, snack_time
3
dietitian_reviewed




a1b2c3d4-0043-4043-a043-1234567890d5
Roast a big batch of mixed vegetables.
The Experiment: Roast a large sheet pan of mixed vegetables to have on hand for the next few days. Why it Works: Roasting brings out the natural sweetness of vegetables, making them delicious and appealing. Having a batch ready in the fridge makes it incredibly easy to add a serving of vegetables to any meal—breakfast, lunch, or dinner—with zero prep time.  
How to Try It: • Chop up hearty vegetables like broccoli, cauliflower, bell peppers, onions, and sweet potatoes. • Toss with a little olive oil, salt, and pepper. • Roast on a sheet pan at 400°F (200°C) for 20-30 minutes, until tender and slightly browned. • Add them to eggs, salads, grain bowls, or eat as a side.


increase_veggies, less_processed_food, plant_based, improve_gut_health
planning_ahead, environment_design
decision_ease, sensory
15_60_min
$$
2
2
home
solo
evening
meal_time
3
coach_curated




d4e5f6a7-b8c9-0123-defa-456789012345
Track your food for one day without judgment.
The Experiment: For just one day, keep a log of everything you eat and drink. Approach it with curiosity, not judgment. Why it Works: People often underestimate their total food intake by a significant margin. A single day of tracking can provide powerful awareness about "mindless" nibbles, portion sizes, and hidden calories from drinks and sauces. It's a data-gathering exercise to inform future choices, not a tool for restriction.  
How to Try It: • Use a simple notebook or a free app. • Be honest and record everything, including the cream in your coffee and the handful of fries you stole from a friend. • At the end of the day, simply review the log and notice any patterns or surprises.


mindset_shift, weight_loss, reduce_sugar, improve_energy
self_monitoring, skill_building
mastery
5_15_min
$
4
1
home, work, restaurant
solo
morning, afternoon, evening, late_night


4
community_submitted




a1b2c3d4-0045-4045-a045-1234567890d7
Have a savory, protein-rich breakfast.
The Experiment: Instead of a sweet breakfast (like sweetened cereal, pastries, or sugary yogurt), opt for a savory one centered around protein. Why it Works: Starting the day with a savory, high-protein meal can help regulate appetite and reduce sugar cravings throughout the day. It sets a different metabolic and psychological tone for the day compared to a breakfast that resembles a dessert.  
How to Try It: • A simple egg scramble with spinach and a side of avocado. • A whole-wheat tortilla with black beans, salsa, and a fried egg. • Leftover chicken and roasted vegetables from last night's dinner.
egg_allergy
reduce_sugar, weight_loss, muscle_gain, improve_energy
healthy_swap, mindset_shift
energy_boost, sensory
5_15_min
$$
2
1
home
solo
morning
meal_time
2
dietitian_reviewed




a1b2c3d4-0046-4046-a046-1234567890d8
Social Swap: Suggest a walk instead of a coffee/drink meeting.
The Experiment: For your next casual social catch-up, suggest going for a walk together instead of meeting for coffee, drinks, or a meal. Why it Works: This reframes social time to include physical activity, helping you reach step goals and reduce sedentary time. It decouples socializing from consuming calories, which can be a major source of unplanned intake. It's a great way to connect with friends while supporting your health goals.  
How to Try It: • "Hey, instead of grabbing coffee, would you be up for a walk around the park on Saturday?" • Take phone calls while walking around your neighborhood.  
• This works well for one-on-one meetings or casual friend dates.
elderly_frailty
weight_loss, improve_energy
healthy_swap, environment_design
social, energy_boost
15_60_min
$
2
2
work, social_event
group
morning, afternoon, evening
social_event
2
coach_curated


a1b2c3d4-0047-4047-a047-1234567890d9
Try a "dessert" of frozen fruit.
The Experiment: For a healthy dessert, try eating a bowl of frozen fruit. Why it Works: Frozen fruit like mango chunks, berries, or banana slices have a surprisingly creamy, sorbet-like texture when eaten partially thawed. This satisfies a craving for a cold, sweet treat with all the benefits of whole fruit (fiber, vitamins) and none of the added sugar of ice cream or sorbet.  
How to Try It: • Frozen mango or pineapple chunks are particularly creamy. • Frozen grapes taste like little bites of sorbet. • For a "nice cream," blend frozen bananas with a splash of milk until smooth.


reduce_sugar, weight_loss, increase_veggies
healthy_swap, crave_buster
sensory, comfort
0_5_min
$
1
1
home
solo
evening, late_night
craving_event
1
dietitian_reviewed




a1b2c3d4-0048-4048-a048-1234567890da
Put your fork down between every few bites.
The Experiment: During one meal today, consciously place your fork or spoon down on the table after every two or three bites. Why it Works: This is a simple, powerful mechanical trick to slow down your eating pace. It forces a pause, allowing you to breathe, check in with your fullness level, and engage more with your meal and dining companions. It's a key practice for developing mindful eating habits.  
How to Try It: • Take a bite. Chew it thoroughly. Swallow. Then, place your utensil completely down on the plate or table. • Take a sip of water or a deep breath before picking it up again. • It will feel awkward at first, but it's highly effective.


mindset_shift, weight_loss, improve_gut_health
mindset_shift, time_ritual
mastery
15_60_min
$
3
1
home, restaurant
either
afternoon, evening
meal_time
2
coach_curated




a1b2c3d4-0049-4049-a049-1234567890db
Add a healthy 'topper' to your meal.
The Experiment: Enhance the nutritional value and flavor of one meal by adding a healthy "topper." Why it Works: Toppers like seeds, nuts, or nutritional yeast are a simple way to add a boost of healthy fats, protein, fiber, or vitamins without fundamentally changing the meal. It's an easy "add-in" strategy that improves nutrient density.  
How to Try It: • Sprinkle a tablespoon of hemp seeds or chopped walnuts on a salad or yogurt bowl. • Add a spoonful of nutritional yeast to scrambled eggs or popcorn for a cheesy, B-vitamin-rich flavor. • Top a soup or chili with fresh chopped herbs like cilantro or parsley.
nut_allergy
increase_veggies, better_lipids, improve_gut_health, muscle_gain
healthy_swap, skill_building
sensory, mastery
0_5_min
$
1
1
home
solo
morning, afternoon, evening
meal_time
1
coach_curated




a1b2c3d4-0050-4050-a050-1234567890dc
Review your day and plan one small improvement for tomorrow.
The Experiment: Before bed, take two minutes to reflect on your eating today. Identify one small, positive change you could make tomorrow. Why it Works: This practice of reflection and gentle course-correction fosters a growth mindset and prevents the all-or-nothing trap. It's about continuous, incremental improvement rather than perfection. Planning one small change makes the goal feel achievable and builds momentum over time.  
How to Try It: • Ask yourself: "What went well today? What was one challenge?" • Based on that, decide on one tiny improvement. Examples: "Tomorrow, I'll pack an apple for my afternoon snack," or "I'll try to have a glass of water with lunch." • Write it down to increase your commitment.


mindset_shift, weight_loss
self_monitoring, mindset_shift, planning_ahead
mastery
0_5_min
$
3
1
home
solo
late_night
stress
4
coach_curated




b2c3d4e5-f6a7-8901-bcde-f23456789012
Drink 16-20oz Water 2-3 Hours Pre-Workout.
The Experiment: Consume 16-20oz (about 500ml) of water 2-3 hours before training, plus another 8oz (240ml) 30 minutes prior. Why it Works: Pre-hydration ensures optimal blood volume for nutrient delivery and thermoregulation. This timing allows for absorption while preventing GI discomfort during exercise. Monitor urine color - pale yellow is ideal. How to Try It: • Set a reminder on your phone for 2-3 hours before your planned workout. • Drink a large glass of water. • Have another glass as you're getting ready to go.


improve_hydration, endurance_performance, strength_performance, improve_energy
planning_ahead, time_ritual
energy_boost, mastery
0_5_min
$
2
1
home, work
solo
morning, afternoon, evening
meal_time
2
coach_curated






c3d4e5f6-a7b8-9012-cdef-345678901234
Practice Pre-Meal Water: 8-16oz Before Eating.
The Experiment: Consume 8-16 oz (1-2 glasses) of water 20-30 minutes before each main meal. Why it Works: Research shows pre-meal water consumption aids digestion, helps with portion control by increasing satiety signals, and contributes to daily hydration needs. How to Try It: • Set a timer for 30 minutes before you typically eat lunch and dinner. • Drink a glass of water when the timer goes off. • This simple habit can naturally reduce caloric intake.


improve_hydration, weight_loss, improve_gut_health
habit_stacking, time_ritual
decision_ease, comfort
0_5_min
$
1
1
home, work, restaurant
either
morning, afternoon, evening
meal_time
1
dietitian_reviewed






e5f6a7b8-c9d0-1234-efab-567890123456
Add Pinch of Salt to Water During 60+ Minute Workouts.
The Experiment: Add 1/4 tsp of salt to every 16-20oz (500ml) of water you drink during extended, sweaty exercise sessions (60+ minutes). Why it Works: Sodium enhances fluid absorption and replaces key electrolytes lost through sweat. This improves hydration efficiency compared to plain water during long workouts, especially in hot weather or for heavy sweaters. How to Try It: • Pre-mix your workout water bottle with a small pinch of salt. • This is not necessary for casual, short-duration exercise.
hypertension, kidney_disease
improve_hydration, endurance_performance
healthy_swap, skill_building
energy_boost, mastery
0_5_min
$
1
1
home, work
solo
morning, afternoon, evening
meal_time
2
coach_curated






b8c9d0e1-f2a3-4567-bcde-890123456789
Practice Protein Distribution: 25-30g Per Meal.
The Experiment: Aim for 25-30g of protein at breakfast, lunch, and dinner today. Why it Works: Sports nutrition research shows distributed protein intake increases muscle protein synthesis by 25% compared to concentrating it in one meal. This supports muscle maintenance, satiety, and metabolic health throughout the day. How to Try It: • Use the "palm-size" portion guide for a rough estimate. • Include a protein source at each meal (e.g., eggs for breakfast, chicken for lunch, fish for dinner).
kidney_disease
muscle_gain, weight_loss, improve_energy, strength_performance
planning_ahead, skill_building
mastery, energy_boost
5_15_min
$$
3
1
home, work
solo
morning, afternoon, evening
meal_time
3
dietitian_reviewed






c9d0e1f2-a3b4-5678-cdef-901234567890
Try Pre-Sleep Protein: 20-40g Before Bed.
The Experiment: Consume a source of slow-digesting protein 30-90 minutes before you go to sleep. Why it Works: Overnight muscle protein synthesis occurs during sleep. Casein protein, found in dairy, provides a sustained release of amino acids for 7+ hours, supporting muscle recovery and growth. How to Try It: • Have a bowl of Greek yogurt or cottage cheese. • Mix a scoop of casein protein powder with a small amount of water or milk to make a pudding.
lactose_intolerance, ibs
muscle_gain, strength_performance, improve_energy
time_ritual, skill_building
comfort, mastery
0_5_min
$$
1
1
home
solo
late_night
snack_time
2
coach_curated






f2a3b4c5-d6e7-8901-fabc-234567890123
Add One Extra Serving of Vegetables to Lunch.
The Experiment: Include one additional cup of vegetables in your lunch today. Why it Works: Increasing vegetable intake is linked to reduced risk of chronic diseases. Adding raw veggies, a side salad, or steamed vegetables boosts fiber and micronutrients, helping you feel fuller and more energized. How to Try It: • Add a handful of baby carrots or cherry tomatoes to your lunch bag. • Mix leftover roasted vegetables into your salad or grain bowl. • Add a layer of spinach or sprouts to your sandwich.


increase_veggies, improve_gut_health, better_lipids, weight_loss
healthy_swap, planning_ahead
sensory, comfort
5_15_min
$
2
1
home, work
solo
afternoon
meal_time
2
dietitian_reviewed






a3b4c5d6-e7f8-9012-abcd-345678901234
Start Dinner with a Salad.
The Experiment: Begin your evening meal with a side salad or raw vegetables before eating the main course. Why it Works: Meal sequencing research shows starting with low-calorie, high-fiber foods increases overall vegetable consumption and enhances satiety. This can naturally reduce intake of higher-calorie foods later in the meal. How to Try It: • Prepare a simple salad with greens and a light vinaigrette. • Eat the entire salad before your main dish is served. • At a restaurant, order a side salad as an appetizer.


increase_veggies, weight_loss, improve_gut_health
time_ritual, habit_stacking
sensory, comfort
5_15_min
$
1
1
home, restaurant
either
evening
meal_time
2
dietitian_reviewed






d6e7f8a9-b0c1-2345-defa-678901234567
Eat Breakfast Within 1 Hour of Waking.
The Experiment: Consume a balanced breakfast within 60 minutes of waking up. Why it Works: Circadian rhythm research suggests eating within an hour of waking aligns with natural metabolic patterns, which can improve glucose control and optimize insulin sensitivity for the day ahead. How to Try It: • Have a simple, pre-planned breakfast ready to go (like overnight oats). • Even a protein shake or a piece of fruit with nut butter counts.


improve_energy, weight_loss, improve_gut_health
time_ritual, planning_ahead
energy_boost, comfort
5_15_min
$
2
1
home
solo
morning
meal_time
2
dietitian_reviewed






a9b0c1d2-e3f4-5678-abcd-901234567890
Front-Load Carbs: Consume Most Before Evening.
The Experiment: Try to consume the majority (e.g., 60-70%) of your daily carbohydrates before 6 PM. Why it Works: This strategy aligns carb intake with the time of day your body is typically more active and insulin-sensitive. It can support training energy while potentially improving sleep quality by reducing late-night blood sugar fluctuations. How to Try It: • Focus on including healthy carbs with your breakfast and lunch. • Have a lighter-carb dinner, focusing more on protein and vegetables.
t1_diabetes, t2_diabetes
improve_energy, weight_loss, endurance_performance
time_ritual, planning_ahead
energy_boost, mastery
0_5_min
$
3
1
home, work
solo
morning, afternoon
meal_time
3
coach_curated






c1d2e3f4-a5b6-7890-cdef-123456789012
Create an "If-Then" Food Plan.
The Experiment: Create a specific plan for a potential food challenge, such as: "If I feel hungry at 3pm, then I'll eat the apple I have at my desk." Why it Works: These "implementation intentions" are scientifically proven to be effective. They create an automatic response to environmental cues, reducing decision fatigue and impulsive choices when you're tired or stressed. How to Try It: • Identify a common trigger (e.g., mid-afternoon slump). • Decide on a specific, healthy








































