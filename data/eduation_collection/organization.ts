export interface EducationCard {
  card_id: string;
  card_title: string;
  copy: string;
  visual_idea: string;
  image?: string; // Path to the image file
}

export interface EducationSet {
  set_id: string;
  set_title: string;
  cards: EducationCard[];
}

export interface OrganizationEducationContent {
  topic: string;
  sets: EducationSet[];
}

export const organizationEducation: OrganizationEducationContent = {
  topic: "The Science of Organization",
  sets: [
    {
      set_id: "set_1",
      set_title: "Your Brain on Clutter",
      cards: [
        {
          card_id: "card_1_1",
          card_title: "The Overwhelmed Brain",
          copy: "A cluttered space is more than just a physical mess; it's a mental one. Your brain has a limited capacity for processing information at any one time, much like a computer's RAM. Clutter bombards your brain with excessive visual signals, forcing it to work overtime just to filter out the noise. This constant sensory overload leads to mental fatigue, making you feel fuzzy or irritable.",
          visual_idea: "An illustration of a brain with dozens of distracting pop-up ads appearing all over it, obscuring a single, simple task in the center.",
          image: require("../../assets/images/organization/1.1.png")
        },
        {
          card_id: "card_1_2",
          card_title: "The Battle for Focus",
          copy: "Every object in a disorganized room competes for your brain's attention. Neuroscientists have found that these competing stimuli mutually suppress each other in your visual cortex, creating a constant 'push and pull' on your focus. This neurological tug-of-war makes it incredibly difficult to concentrate on a single task, reducing productivity and performance.",
          visual_idea: "Two cartoon magnets on opposite sides of a person's head, one labeled 'The Task' and the other labeled 'The Mess,' pulling their attention in opposite directions.",
          image: require("../../assets/images/organization/1.2.png")
        },
        {
          card_id: "card_1_3",
          card_title: "The Impact on Memory",
          copy: "Your working memory is like a temporary mental whiteboard where you hold information for short-term tasks. Clutter acts as a form of visual distraction that fills this whiteboard with irrelevant data. With less space available to process important information, you may find yourself forgetting things more often, losing your train of thought, or struggling to follow multi-step instructions.",
          visual_idea: "A small whiteboard that is 90% covered in messy scribbles and doodles, leaving only a tiny corner for a person to write down an important phone number.",
          image: require("../../assets/images/organization/1.3.png")
        }
      ]
    },
    {
      set_id: "set_2",
      set_title: "The Cortisol Connection",
      cards: [
        {
          card_id: "card_2_1",
          card_title: "Meet Cortisol: The Stress Hormone",
          copy: "Cortisol is your body's main stress hormone. It's best known for fueling your 'fight or flight' instinct in a crisis. In short bursts, it's essential for survival. However, when your body is exposed to constant, low-grade stressors, cortisol levels can remain chronically high, which is linked to a range of health issues, including anxiety, depression, and heart disease.",
          visual_idea: "A simple icon of an adrenal gland releasing a small, helpful spark for a short-term task (like running), then releasing a constant, draining stream for a long-term stressor.",
          image: require("../../assets/images/organization/2.1.png")
        },
        {
          card_id: "card_2_2",
          card_title: "Clutter as a Chronic Threat",
          copy: "Your brain is wired for order and interprets a chaotic environment as a persistent, low-grade threat. The constant visual reminders of tasks left undone, of disorder to be managed, and of a general lack of control can keep your body in a state of mild, perpetual 'fight or flight,' continuously triggering the release of cortisol.",
          visual_idea: "A person sitting on a couch in a messy room, with a subtle, transparent 'danger' symbol (like a yellow caution sign) hovering over every pile of clutter.",
          image: require("../../assets/images/organization/2.2.png")
        },
        {
          card_id: "card_2_3",
          card_title: "The Scientific Proof",
          copy: "The link between clutter and cortisol is scientifically proven. A landmark UCLA study measured the cortisol levels of families throughout the day. The results were clear: women who used stress-inducing language to describe their homes—like 'cluttered' or 'messy'—had elevated cortisol levels that failed to decline naturally in the evening, a physiological marker of chronic stress.",
          visual_idea: "A side-by-side comparison of two test tubes. One is labeled 'Restful Home' and shows a low level of liquid. The other is labeled 'Cluttered Home' and is filled to a much higher level.",
          image: require("../../assets/images/organization/2.3.png")
        }
      ]
    },
    {
      set_id: "set_3",
      set_title: "Clutter's Ripple Effect",
      cards: [
        {
          card_id: "card_3_1",
          card_title: "The Link to Unhealthy Choices",
          copy: "The mental fatigue from clutter depletes your capacity for self-control. One study found that people in a messy kitchen ate twice as many cookies as those in a tidy one. Another showed that people in an organized office were twice as likely to choose an apple over a chocolate bar. A chaotic space makes you more likely to seek immediate gratification and comfort foods.",
          visual_idea: "A fork in the road. The path through a clean, orderly landscape leads to an apple. The path through a messy, chaotic landscape leads to a pile of cookies.",
          image: require("../../assets/images/organization/3.1.png")
        },
        {
          card_id: "card_3_2",
          card_title: "The Impact on Your Sleep",
          copy: "A cluttered bedroom can be toxic for sleep. The mess serves as a powerful visual reminder of unfinished business, provoking anxiety and guilt right when your mind needs to relax. Your brain learns to associate the bedroom with stress instead of rest, making it harder to power down at night. Studies show people in cluttered rooms are more likely to have sleep problems.",
          visual_idea: "A person trying to sleep in bed, but their thought bubble is filled with images of the piles of laundry and stacks of paper that are physically in the room.",
          image: require("../../assets/images/organization/3.2.png")
        },
        {
          card_id: "card_3_3",
          card_title: "The Social and Relationship Cost",
          copy: "The impact of clutter often extends beyond your own well-being. Feelings of shame and embarrassment can make you reluctant to invite friends and family into your home, leading to social isolation. Within the home, clutter can be a potent source of conflict and relationship strain between partners and family members.",
          visual_idea: "A front door with a 'Welcome' mat, but the door is blocked by a large, messy pile of boxes and clutter, preventing it from opening.",
          image: require("../../assets/images/organization/3.3.png")
        }
      ]
    },
    {
      set_id: "set_4",
      set_title: "When It's More Than a Mess",
      cards: [
        {
          card_id: "card_4_1",
          card_title: "Understanding Hoarding Disorder",
          copy: "Hoarding Disorder (HD) is a recognized clinical condition, not just a case of extreme messiness. It's defined by a persistent difficulty discarding possessions, regardless of their value, due to a perceived need to save them and the intense distress associated with letting them go. This results in clutter that makes living spaces unusable.",
          visual_idea: "A simple, clinical-style infographic showing the three core components: 1) Difficulty Discarding, 2) Need to Save, 3) Clutter Impairs Function.",
          image: require("../../assets/images/organization/4.1.png")
        },
        {
          card_id: "card_4_2",
          card_title: "The Brain on Hoarding: A Painful Reality",
          copy: "A groundbreaking Yale study used fMRI scans to look inside the brains of people with hoarding tendencies. When they were faced with discarding a personal item, two specific brain regions lit up: the anterior cingulate cortex and the insula. These are the exact same areas that activate when you experience physical pain, like burning your hand.",
          visual_idea: "A brain scan with the two key regions glowing red. Next to it, an icon of a hand touching a hot stove, also glowing red, to show the parallel.",
          image: require("../../assets/images/organization/4.2.png")
        },
        {
          card_id: "card_4_3",
          card_title: "It's Not a Simple Choice",
          copy: "This neurological finding is critical. For a person with Hoarding Disorder, the act of letting go of a possession is processed by the brain as a genuinely painful event. This explains the profound resistance to decluttering that is a hallmark of the disorder. It isn't about a lack of willpower; it's about avoiding an experience that feels, at a neural level, like real pain.",
          visual_idea: "A person standing in front of a 'Donate' box, looking distressed, with a thought bubble showing a 'pain' symbol (like a red lightning bolt) over the items in the box.",
          image: require("../../assets/images/organization/4.3.png")
        }
      ]
    },
    {
      set_id: "set_5",
      set_title: "The Path to Peace", 
      cards: [
        {
          card_id: "card_5_1",
          card_title: "The Clear Mind Effect",
          copy: "When you declutter your physical space, your brain doesn't have to work as hard to process your environment. This frees up mental resources for more important tasks like problem-solving, creativity, and emotional regulation. Studies show that people in organized spaces report feeling more in control, less anxious, and more capable of focusing on their goals.",
          visual_idea: "A before/after split screen of a brain - the 'before' side is tangled with chaotic lines, the 'after' side has clear, organized pathways.",
          image: require("../../assets/images/organization/5.1.png")
        },
        {
          card_id: "card_5_2",
          card_title: "Small Steps, Big Impact",
          copy: "You don't need to transform your entire home overnight. Research shows that even clearing a single surface, like your desk or kitchen counter, can provide an immediate boost to your mood and productivity. Start with one small area, maintain it for a week, then expand. Your brain will begin to associate that clear space with calm and control.",
          visual_idea: "A simple progression showing a single clear desk surface expanding outward like ripples in water, gradually organizing the surrounding area.",
          image: require("../../assets/images/organization/5.2.png")
        }
      ]
    }
  ]
};