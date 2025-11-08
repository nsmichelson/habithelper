import textwrap
from pathlib import Path

UUIDS = [
    "711a38b9-3ef3-45ca-9232-8c740d7a824e",
    "e2db73c8-8bd0-446c-a8ee-e2f03622ea81",
    "8e8a082d-297d-4d34-9e8a-a96a779d6ed8",
    "3808d0cd-2655-4719-a0f0-e2efc6733c7f",
    "f38bd4b5-95c3-4895-9e26-1c4d3b952924",
    "78677888-5d3b-49d1-bc41-fc9ef42b5316",
    "89b9edab-3bc9-44f7-a243-72350cfb5fe4",
    "5a602d64-799d-461a-9415-1dee60b7722c",
    "73a9918e-721b-4c5f-940d-bdc31493afb2",
    "b88dd5b8-7354-4248-b709-b78958c15e3c",
    "bba3a605-e8f0-4538-b5da-23e29a245f4a",
    "a0a9c607-3bee-4e47-b5cd-a8f08cd682ab",
    "e91a4717-8f70-4793-81eb-da7b91b4a7ab",
    "7f96c637-5ba8-4c6c-8706-56647717484b",
    "93e48c66-b25f-46ea-864c-9c312197218a",
    "bb020434-426f-46a0-996c-3307b03c32cd",
    "3515c9a2-d4b9-4938-ab07-03c22bf66e13",
    "bc49a14c-d4af-43b4-bafe-37f0d21b437a",
    "b50b45fb-050d-4e86-9537-977c9aef82df",
    "ccab95bc-9484-42cc-a062-8c81781264ef",
    "5a22ec9a-20ec-44b4-b5af-ee070d0639dd",
    "682a8967-a875-4e62-8bb5-adb691c18625",
    "29df6dc5-43f3-4a21-a226-f1378ca4e79b",
    "c3cd18d3-1d99-48d6-a2b8-a7eaaeac7410",
    "9ea21169-8ec4-4f80-9036-9c6b991d5a3b",
    "b313434f-9f30-48a5-98ec-4293f9a52c42",
    "10e3676f-ec48-4890-b70d-cb9c52cc3b7b",
    "0f76e463-122c-4777-acfc-f8a7349ab9f2",
    "67b0013c-a31f-44d4-a3ed-be6cca1f8e48",
    "159e9e43-b1ad-41c4-a189-5030363084f3",
    "82aa0e74-b116-4b5b-a027-a5288263cf28",
    "9deae812-efab-473e-99c7-64b10b65c073",
    "a825a5f5-c1c7-4a2d-aa7f-a68b5dcceb25",
    "7c819825-1759-4686-a440-d479e02f8847",
    "e384382c-5385-4781-abea-67b8235698bd",
    "7bb0704b-a0b3-4c35-a640-9df3998081d6",
    "8283c13a-9125-4277-aa44-8f32824580ef",
    "add0a776-d1d5-4642-8f45-5b83a3667f26",
    "ef4e111d-4ecf-4259-8e79-f7583a1ead8a",
    "6e71c063-8dda-4623-914c-4a69bcbe9f17",
    "93f029e3-50da-4dce-b7e4-27c605156872",
    "f855b5c2-04d7-4e50-bf99-dcba23dc63af",
    "3709351b-8aa4-49e8-a4cf-5ddeccd5a132",
    "e429ec74-8b53-45d7-9d47-5b777b918c8a",
    "f6915b97-4c9b-4381-a23c-ce4efe1db920",
    "e7d77313-8094-4ddd-9da6-ce3e5fc8c84b",
    "cc27bead-9b79-465e-9dfc-766aab0477d6",
    "604a3666-3d5d-41cf-9661-6da155601ac4",
    "c638f506-9dfe-48d9-b2db-a82a94f5abb0",
    "91077ef9-8ed9-4d0b-84ad-9c2e60f08e24",
    "68d054eb-7013-4ea7-b384-5f235956af5b",
    "b774a1ce-44e1-4476-8133-cdd66ff99d4d",
    "11412682-0184-4ad2-b95f-8b2996643fe1",
    "d9a80060-d1e7-46e0-bbc1-215bd9c78f54",
    "5f8b1e12-b14c-4f45-acdc-0fe1012c0104",
    "f1d8172d-103e-47e9-8442-02bcc1ea8378",
    "611114a4-2f06-41fe-ae1a-b7d8d7baf871",
    "470167ee-f364-4771-b798-3705fd5ea2db",
    "da497a9d-d044-467e-b8aa-1589855437f1",
    "da5ce6b4-86f9-46eb-846b-d5930933a88d",
    "75c0b185-1526-49e2-9366-88c3af74fffb",
    "d302581f-1e7b-4b81-8d39-dd81dcb53608",
    "6bb02793-308b-40c4-89c8-4598c12eee6e",
    "77940c5f-3415-46cd-ab72-304009bbc1ca",
    "6a169019-41d9-4d88-ac74-d17a7066eac7",
    "4c49ac23-0b3b-4e32-ae95-d7195bb1bdc9",
    "3b6b4bfb-6fb8-4086-8b82-4b4bd70df3ed",
    "bb841e9d-35c4-45bf-acd6-4084f2c4cf77",
    "e445efa2-3985-4aac-b4e7-4a78c603f4d0",
    "9ff2b69c-e40d-4e1e-92fa-d2a74c42cf6f",
    "794a5a7b-a24a-4541-a87d-8c0f7681ffd9",
    "ec8d3ea0-939c-463f-8698-785a337b49b8",
    "73a96120-017f-4fa9-b271-0aa04c5fd844",
    "8411436d-f3ea-4e6f-b7fd-10dc8e8521a2",
    "b8368005-8487-4eda-8c89-6304692301c7",
]

TIPS_DATA = [
    # G1.1
    {
        "summary": "Take a 5-minute starter step on the task you’ve been avoiding.",
        "experiment": "Set a 5-minute timer and only do the smallest first action on the task you keep dodging.",
        "why": "Tiny starts lower the activation barrier, build momentum, and shrink avoidance-driven dread.",
        "how": [
            "Name the exact task that’s been hanging over you.",
            "Decide on a micro action (e.g., open the doc, write one sentence).",
            "Stop when the timer ends and note that you started—win logged."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["procrastination", "low_motivation", "overwhelm"],
        "mechanisms": ["tiny_habits", "set_minimum_floor", "time_boxed_sessions"],
        "effort": "low",
        "time": "0-5min",
        "when": ["any", "overwhelm"],
        "where": ["home", "work"],
        "requires": ["timer"],
        "features": ["solo_friendly", "no_planning", "impulse_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "as_needed"
    },
    # G1.2
    {
        "summary": "Run a 25/5 Pomodoro sprint with a hard stop for a 5-minute break.",
        "experiment": "Set a 25-minute focus timer followed by a 5-minute break, and repeat until you complete a deep-work block.",
        "why": "Time-boxed sprints create urgency, limit avoidance, and scheduled breaks keep energy up without doom-scrolling.",
        "how": [
            "Pick one task and close unrelated tabs before you start.",
            "Work heads-down until the 25-minute bell—no switching.",
            "Take a full 5-minute break away from the screen, then reset."
        ],
        "goals": ["meet_deadlines", "reduce_distractions"],
        "helps": ["procrastination", "time_constraints", "notification_overload"],
        "mechanisms": ["pomodoro", "time_boxed_sessions", "pre_commitment"],
        "effort": "moderate",
        "time": "30-60min",
        "when": ["any", "work_break"],
        "where": ["home", "work"],
        "requires": ["timer"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # G1.3
    {
        "summary": "Draft a messy 10-minute first pass and stop when the timer ends.",
        "experiment": "Give yourself 10 minutes to create an intentionally rough first draft, then walk away when the alarm goes off.",
        "why": "Lowering the quality bar breaks perfectionism loops so you generate momentum and material to refine later.",
        "how": [
            "Define the deliverable (deck, email, proposal) before you hit start.",
            "Write in bullet fragments or voice dictation—speed over polish.",
            "Capture next steps or gaps before you step away so future-you can resume fast."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["perfectionism", "procrastination"],
        "mechanisms": ["time_boxed_sessions", "mindset_shift", "set_minimum_floor"],
        "effort": "low",
        "time": "5-15min",
        "when": ["any", "overwhelm"],
        "where": ["home", "work"],
        "requires": ["timer"],
        "features": ["solo_friendly", "no_planning", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "as_needed"
    },
    # G2.1
    {
        "summary": "Block a 45–60 minute deep-focus session on your calendar like a meeting.",
        "experiment": "Choose a priority task, reserve a 45–60 minute calendar block, and treat it as a non-negotiable meeting with yourself.",
        "why": "Time-blocking and pre-commitment protect uninterrupted focus time so work actually gets finished.",
        "how": [
            "Pick the task that most needs sustained focus this week.",
            "Hold the block by declining or moving conflicting invites.",
            "Start on time, close the loop, and note wins before you exit."
        ],
        "goals": ["meet_deadlines", "increased_productivity", "reduce_distractions"],
        "helps": ["time_constraints", "task_overload"],
        "mechanisms": ["time_blocking", "pre_commitment", "planning_ahead"],
        "effort": "moderate",
        "time": "30-60min",
        "when": ["morning", "afternoon"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 3,
        "sustainability": "daily"
    },
    # G2.2
    {
        "summary": "Silence alerts and park your phone in another room before focus work.",
        "experiment": "Switch on Do Not Disturb, close chat/email, and physically move your phone out of reach for the next work sprint.",
        "why": "Removing cues reduces temptation and context switching so your brain stays locked on the task.",
        "how": [
            "Set DND or Focus mode and pause desktop notifications.",
            "Place your phone in a drawer or another room entirely.",
            "Leave an auto-reply/status letting others know when you’ll check back."
        ],
        "goals": ["reduce_distractions", "increased_productivity"],
        "helps": ["notification_overload", "context_switching"],
        "mechanisms": ["notifications_snooze", "environment_design", "pre_commitment"],
        "effort": "low",
        "time": "0-5min",
        "when": ["any", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "no_planning", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # G2.3
    {
        "summary": "Lock your top three distracting sites during focus blocks with a blocker.",
        "experiment": "Install or enable a website blocker that shuts off your three biggest time-waster sites for the duration of focus sessions.",
        "why": "Environment design beats willpower—the blocker removes frictionless escapes so you stay in the work.",
        "how": [
            "List the URLs that derail you most often.",
            "Set up blocks for your chosen focus windows (e.g., 9–11am).",
            "Keep an override note or log if you must unlock so you learn the pattern."
        ],
        "goals": ["reduce_distractions", "increased_productivity"],
        "helps": ["notification_overload", "procrastination"],
        "mechanisms": ["environment_design", "pre_commitment", "time_blocking"],
        "effort": "low",
        "time": "5-15min",
        "when": ["any", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # G3.1
    {
        "summary": "Plan tomorrow tonight by writing your top three Most Important Tasks.",
        "experiment": "End your day by listing the three Most Important Tasks for tomorrow so you wake up knowing exactly what matters.",
        "why": "Implementation intentions lower morning decision fatigue and keep you pointed at what actually moves the needle.",
        "how": [
            "Review your commitments and choose three realistic wins.",
            "Write them somewhere you’ll see first thing (planner, sticky note).",
            "Identify the first tiny step for each so you can launch fast."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["decision_fatigue", "overwhelm"],
        "mechanisms": ["priority_triad", "planning_ahead", "implementation_intentions"],
        "effort": "low",
        "time": "5-15min",
        "when": ["evening"],
        "where": ["home"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # G3.2
    {
        "summary": "Assign each MIT a calendar block and add a buffer before the next.",
        "experiment": "Take your top three tasks and place them on the calendar with a 5–10 minute buffer before the next commitment.",
        "why": "Time-blocking with buffers protects focus and absorbs overruns so priorities actually get completed.",
        "how": [
            "Drag each MIT onto the calendar at realistic energy peaks.",
            "Pad the end of each block with a small buffer for wrap-up.",
            "Treat the block as booked—move, don’t delete, if plans change."
        ],
        "goals": ["meet_deadlines", "reduce_distractions"],
        "helps": ["time_constraints", "task_overload"],
        "mechanisms": ["time_blocking", "planning_ahead", "pre_commitment"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["evening", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 3,
        "sustainability": "daily"
    },
    # G3.3
    {
        "summary": "Follow the two-minute rule: do any task under two minutes immediately.",
        "experiment": "Whenever a task will take under two minutes, do it on the spot instead of adding it to your list.",
        "why": "Quick wins clear mental clutter and prevent tiny tasks from snowballing into backlog stress.",
        "how": [
            "Define what “two minutes” means for you (email reply, rinse dish).",
            "When a quick task appears, start it before you evaluate it.",
            "Track how many micro-tasks you clear to reinforce the habit."
        ],
        "goals": ["increased_productivity", "maintain_consistency"],
        "helps": ["maintenance_failure", "overwhelm"],
        "mechanisms": ["tiny_habits", "set_minimum_floor", "single_tasking"],
        "effort": "minimal",
        "time": "0-5min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "impulse_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # G4.1
    {
        "summary": "Run a 10-minute desk reset so only today’s essentials stay within reach.",
        "experiment": "Set a 10-minute timer to clear your desk, keeping only tools and papers needed for today’s work.",
        "why": "Reducing visual clutter lowers cognitive load and makes it easier to focus on the task at hand.",
        "how": [
            "Toss trash and file or bin anything not needed today.",
            "Stage the key tools you’ll reach for in the next block.",
            "Snap a quick photo of the tidy setup to reinforce the win."
        ],
        "goals": ["organize_workspace", "declutter_momentum"],
        "helps": ["visual_chaos", "maintenance_failure"],
        "mechanisms": ["daily_reset", "surface_clearing", "time_boxed_sessions"],
        "effort": "low",
        "time": "5-15min",
        "when": ["any", "overwhelm"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # G4.2
    {
        "summary": "Give every item a home and label two clutter hotspots today.",
        "experiment": "Choose two messy zones on your desk, decide their permanent homes, and add simple labels so items land there automatically.",
        "why": "Clear homes and labels reduce search time and help future-you keep the order with less effort.",
        "how": [
            "Pick two hotspots that slow you down (e.g., cables, supplies).",
            "Assign each a bin, drawer, or tray and label it clearly.",
            "Do a quick end-of-day sweep returning items to their new homes."
        ],
        "goals": ["organize_workspace", "paper_management"],
        "helps": ["paper_piles", "lost_items"],
        "mechanisms": ["zone_organizing", "environment_design", "surface_clearing"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "weekly"
    },
    # G4.3
    {
        "summary": "Close your day with a three-minute clear-desk shutdown ritual.",
        "experiment": "Set a three-minute timer at day’s end to clear your workspace and stage tomorrow’s starting point.",
        "why": "Closure rituals help your brain detach from work and make the next restart effortless.",
        "how": [
            "Return tools to their labeled homes and stack active files neatly.",
            "Jot tomorrow’s first action on a sticky note.",
            "Turn off monitors or lights as a clear “work is done” cue."
        ],
        "goals": ["organize_workspace", "stress_free_environment"],
        "helps": ["maintenance_failure", "visual_chaos"],
        "mechanisms": ["daily_reset", "closure_ritual", "habit_stacking"],
        "effort": "low",
        "time": "0-5min",
        "when": ["evening", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # G5.1
    {
        "summary": "Build a simple three-level folder system and file today’s active docs.",
        "experiment": "Create a three-level folder structure (e.g., Area ➜ Project ➜ Working) and move today’s active documents into it.",
        "why": "Consistent digital schemas shorten retrieval time and keep work-in-progress organized.",
        "how": [
            "Decide on your top-level buckets (e.g., Clients, Admin, Personal).",
            "Create subfolders for current projects and archive older files.",
            "File every active document you touched today into its new home."
        ],
        "goals": ["task_system_mastery", "organize_workspace"],
        "helps": ["no_systems", "lost_items"],
        "mechanisms": ["zone_organizing", "planning_ahead", "environment_design"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "weekly"
    },
    # G5.2
    {
        "summary": "Filter newsletters and batch email checks into two set windows.",
        "experiment": "Create inbox rules that auto-file newsletters/CCs and commit to checking email only during two daily windows.",
        "why": "Filtering inflow and batching responses cuts interruptions and keeps you in control of your day.",
        "how": [
            "Set up rules that label or skip the inbox for low-priority mail.",
            "Pick two check-in times that match your natural energy dips.",
            "Use a note to capture urgent replies between batches instead of peeking."
        ],
        "goals": ["reduce_distractions", "increased_productivity"],
        "helps": ["notification_overload", "time_constraints"],
        "mechanisms": ["task_batching", "notifications_snooze", "environment_design"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["morning", "afternoon"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # G5.3
    {
        "summary": "Process new emails with one-touch decisions: reply, snooze, or archive.",
        "experiment": "During your next email block, handle each message once—respond, snooze for later, or archive immediately.",
        "why": "One-touch processing prevents pileups and keeps your inbox a working tool rather than a stressor.",
        "how": [
            "Open email only during a planned batch window.",
            "For each message decide: answer now, schedule it, or archive/delete.",
            "Leave the session with zero “unread” items lingering."
        ],
        "goals": ["task_system_mastery", "meet_deadlines"],
        "helps": ["maintenance_failure", "overwhelm"],
        "mechanisms": ["one_touch_rule", "task_batching", "single_tasking"],
        "effort": "low",
        "time": "5-15min",
        "when": ["work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # G6.1
    {
        "summary": "Stack a five-minute planning ritual onto something you already do each morning.",
        "experiment": "Attach a quick planning check-in to a reliable morning habit (coffee, commute) and map your day in five minutes.",
        "why": "Habit stacking anchors planning to an existing cue so it happens even when mornings are hectic.",
        "how": [
            "Pick the anchor habit you never skip (e.g., brew coffee).",
            "Use a simple template or notebook to sketch priorities and blockers.",
            "End by choosing your must-do start task so the day opens with intention."
        ],
        "goals": ["morning_routine", "meet_deadlines"],
        "helps": ["maintenance_failure", "time_constraints"],
        "mechanisms": ["habit_stacking", "planning_ahead", "reminder_cues"],
        "effort": "low",
        "time": "5-15min",
        "when": ["morning"],
        "where": ["home"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # G6.2
    {
        "summary": "Shrink a new habit to a two-minute version you can’t skip.",
        "experiment": "Redesign the habit you’re building so the version you must complete takes two minutes or less.",
        "why": "Tiny habits reduce activation energy, letting repetition wire the routine before you scale up.",
        "how": [
            "Clarify the full habit (e.g., 30-minute workout, daily journal).",
            "Define the two-minute starter version that still counts.",
            "Celebrate completion and optionally continue only after the mini step."
        ],
        "goals": ["maintain_consistency", "build_healthy_habits"],
        "helps": ["low_motivation", "overwhelm"],
        "mechanisms": ["tiny_habits", "set_minimum_floor", "habit_stacking"],
        "effort": "minimal",
        "time": "0-5min",
        "when": ["any"],
        "where": ["any"],
        "features": ["solo_friendly", "impulse_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # G6.3
    {
        "summary": "Write an if-then plan for one habit so the cue triggers automatic action.",
        "experiment": "Create a single if-then statement for the habit you’re building (e.g., “If it’s 5:30pm, then I start my shutdown”).",
        "why": "Implementation intentions pre-decide your response, boosting follow-through when the cue hits.",
        "how": [
            "Choose the habit that slips most often.",
            "Identify the reliable cue that will trigger it.",
            "Write and post the if-then statement where you’ll see it daily."
        ],
        "goals": ["maintain_consistency", "meet_deadlines"],
        "helps": ["decision_fatigue", "low_motivation"],
        "mechanisms": ["implementation_intentions", "planning_ahead", "reminder_cues"],
        "effort": "low",
        "time": "0-5min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # G7.1
    {
        "summary": "Sort today’s list with the Eisenhower Matrix and tackle one urgent-important task now.",
        "experiment": "Divide your to-do list into Eisenhower quadrants and immediately execute one item from the important-and-urgent box.",
        "why": "Urgency–importance sorting aligns effort with impact and prevents firefighting from driving your day.",
        "how": [
            "Split a page into four quadrants: Do, Schedule, Delegate, Delete.",
            "Place each task where it truly belongs based on urgency and importance.",
            "Start the top urgent-important task before touching anything else."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["unclear_priorities", "overwhelm"],
        "mechanisms": ["priority_triad", "planning_ahead", "mindset_shift"],
        "effort": "low",
        "time": "5-15min",
        "when": ["morning", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # G7.2
    {
        "summary": "Circle the single task that creates the most value and start it first.",
        "experiment": "Review today’s list, identify the highest-leverage task, mark it, and begin it before anything else.",
        "why": "80/20 focus directs energy to the work that moves the needle instead of easy-but-low-impact busywork.",
        "how": [
            "Scan your commitments and ask which one would make the day a win if finished.",
            "Mark it with a star or highlight so it can’t hide.",
            "Open the task immediately and work on it for at least 15 focused minutes."
        ],
        "goals": ["increased_productivity", "meet_deadlines"],
        "helps": ["unclear_priorities", "decision_paralysis"],
        "mechanisms": ["priority_triad", "single_tasking", "mindset_shift"],
        "effort": "low",
        "time": "5-15min",
        "when": ["morning"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # G7.3
    {
        "summary": "Say “not this week” to one low-value request and reschedule or delegate it.",
        "experiment": "Identify one request that isn’t a priority, decline or delegate it, and note when (or if) it will happen instead.",
        "why": "Opportunity-cost framing protects your limited time for the work that matters most.",
        "how": [
            "Pick a task or meeting that delivers little value this week.",
            "Communicate a clear defer/decline with an alternate plan or owner.",
            "Use the reclaimed time for a top-priority block."
        ],
        "goals": ["meet_deadlines", "reduce_distractions"],
        "helps": ["too_many_goals", "overwhelm"],
        "mechanisms": ["mindset_shift", "pre_commitment", "planning_ahead"],
        "effort": "moderate",
        "time": "5-15min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "weekly"
    },
    # G8.1
    {
        "summary": "Cap work-in-progress at two items and pause new work until one is done.",
        "experiment": "Limit yourself to two active tasks at a time and only start another when one is completed or parked.",
        "why": "WIP limits reduce context switching and keep throughput high by finishing before starting new.",
        "how": [
            "List the two tasks you’re actively working on right now.",
            "Move everything else to a parking lot list for later.",
            "Only pull a new task when one of the two is complete."
        ],
        "goals": ["task_system_mastery", "meet_deadlines"],
        "helps": ["context_switching", "task_overload"],
        "mechanisms": ["avoid_multitasking", "single_tasking", "pre_commitment"],
        "effort": "moderate",
        "time": "0-5min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # G8.2
    {
        "summary": "Define a “done for today” chunk and stop once that slice is complete.",
        "experiment": "Before you start, describe what “done for today” looks like and stop when that chunk is finished.",
        "why": "Concrete endpoints make completion visible and prevent perfectionism from stealing momentum.",
        "how": [
            "State the exact slice you’ll finish (e.g., draft intro, QA two tickets).",
            "Work until that chunk is complete, resisting scope creep.",
            "Record the win and decide the next chunk for tomorrow."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["perfectionism", "overwhelm"],
        "mechanisms": ["implementation_intentions", "time_boxed_sessions", "mindset_shift"],
        "effort": "low",
        "time": "15-30min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # G8.3
    {
        "summary": "End each work session by writing the very next action at the top of your notes.",
        "experiment": "When you finish a block, jot the next physical action at the top of the doc or notebook before you walk away.",
        "why": "Next-action cues remove restart friction so you can dive back in without recalibrating.",
        "how": [
            "Summarize where you left off in one quick sentence.",
            "Write the next verb-driven action (e.g., “Email Jordan draft”).",
            "Stage any needed files or links so future-you can hit go."
        ],
        "goals": ["maintain_consistency", "meet_deadlines"],
        "helps": ["maintenance_failure", "low_motivation"],
        "mechanisms": ["closure_ritual", "implementation_intentions", "reminder_cues"],
        "effort": "minimal",
        "time": "0-5min",
        "when": ["any", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # G9.1
    {
        "summary": "Do a five-minute brain dump, then complete one doable next step immediately.",
        "experiment": "Spend five minutes emptying your head onto paper, then choose one doable action and do it right away.",
        "why": "Externalizing thoughts lowers anxiety and fast wins restore a sense of control.",
        "how": [
            "Set a timer and list every worry, task, or idea without editing.",
            "Highlight one action you can finish in under 10 minutes.",
            "Do that action immediately and cross it off loudly."
        ],
        "goals": ["stress_free_environment", "increased_productivity"],
        "helps": ["overwhelm", "decision_paralysis"],
        "mechanisms": ["self_monitoring", "time_boxed_sessions", "mindset_shift"],
        "effort": "low",
        "time": "5-15min",
        "when": ["any", "overwhelm"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "as_needed"
    },
    # G9.2
    {
        "summary": "Split your list into NOW and LATER columns and ignore LATER until a set time.",
        "experiment": "Rewrite today’s list into two columns—NOW and LATER—and work only from NOW until your scheduled review.",
        "why": "Simple triage clarifies priorities and keeps your attention where it matters.",
        "how": [
            "Move essential tasks into the NOW column with time estimates.",
            "Schedule a specific check-in for the LATER column.",
            "Return to the NOW column anytime you feel tempted to switch."
        ],
        "goals": ["stress_free_environment", "meet_deadlines"],
        "helps": ["decision_paralysis", "overwhelm"],
        "mechanisms": ["planning_ahead", "priority_triad", "single_tasking"],
        "effort": "low",
        "time": "5-15min",
        "when": ["morning", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # G9.3
    {
        "summary": "Run a 20-minute single-task sprint with every notification off.",
        "experiment": "Turn off notifications, close extras, and work single-tasked for a focused 20-minute sprint.",
        "why": "Monotasking boosts speed and accuracy while lowering overwhelm from constant switching.",
        "how": [
            "Pick one task and prep everything you need before starting.",
            "Silence devices and set a 20-minute timer.",
            "Use the break to log progress and set up the next sprint if needed."
        ],
        "goals": ["reduce_distractions", "meet_deadlines"],
        "helps": ["context_switching", "overwhelm"],
        "mechanisms": ["pomodoro", "single_tasking", "notifications_snooze"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # G10.1
    {
        "summary": "Do a 20-minute weekly preview and map key tasks onto specific days.",
        "experiment": "Once a week, preview upcoming commitments for 20 minutes and slot priority tasks onto specific days.",
        "why": "Looking ahead prevents firefighting and keeps big rocks from slipping through the cracks.",
        "how": [
            "Review your calendar, project boards, and deadlines for the next 7 days.",
            "Assign each key task to a day that fits your energy and meetings.",
            "Block time for prep or buffers where you tend to underestimate."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["overwhelm", "time_constraints"],
        "mechanisms": ["planning_ahead", "time_blocking", "priority_triad"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "weekly"
    },
    # G10.2
    {
        "summary": "Work backward from a deadline by scheduling dated milestones today.",
        "experiment": "Take a key deadline and plot interim milestones on your calendar right now.",
        "why": "Backward planning turns a big goal into manageable steps and spots risk before it’s urgent.",
        "how": [
            "List the major steps required to hit the final deliverable.",
            "Assign target dates to each milestone working backward from the due date.",
            "Block time for the first step immediately so momentum starts."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["time_constraints", "decision_paralysis"],
        "mechanisms": ["planning_ahead", "time_blocking", "pre_commitment"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 3,
        "sustainability": "as_needed"
    },
    # G10.3
    {
        "summary": "Add a 25% buffer to big tasks when you block them on your calendar.",
        "experiment": "When scheduling major work, add 25% more time than you think you need to absorb surprises.",
        "why": "Buffers counter optimism bias and prevent small overruns from derailing the rest of your day.",
        "how": [
            "Note how long similar tasks have taken you in the past.",
            "Multiply the estimate by 1.25 and block that amount.",
            "Use any leftover buffer for review or an intentional break."
        ],
        "goals": ["meet_deadlines", "stress_free_environment"],
        "helps": ["time_constraints", "overwhelm"],
        "mechanisms": ["planning_ahead", "time_blocking", "mindset_shift"],
        "effort": "low",
        "time": "5-15min",
        "when": ["any", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # G11.1
    {
        "summary": "Set a consistent wake time and keep it within an hour on weekends.",
        "experiment": "Choose a target wake time, set alarms or cues, and stick within a one-hour window even on weekends.",
        "why": "Regular wake times anchor your circadian clock, improving energy and sleep quality.",
        "how": [
            "Pick a wake window that supports your commitments and rest needs.",
            "Use morning light or movement to help you get up at that time.",
            "Track consistency for two weeks and adjust gradually if needed."
        ],
        "goals": ["better_sleep", "improve_energy"],
        "helps": ["poor_sleep", "low_energy"],
        "mechanisms": ["sleep_hygiene", "habit_stacking", "pre_commitment"],
        "effort": "moderate",
        "time": "ongoing",
        "when": ["morning"],
        "where": ["home"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # G11.2
    {
        "summary": "Start a 30-minute wind-down with screens off and lights dimmed.",
        "experiment": "Begin a 30-minute wind-down routine each night that includes dim lights, no screens, and calming cues.",
        "why": "Lower arousal and light exposure help melatonin rise so you fall asleep faster.",
        "how": [
            "Set a nightly alarm that signals wind-down time.",
            "Dim lamps, silence notifications, and swap to relaxing activities.",
            "Keep the routine consistent so your brain links it with sleep."
        ],
        "goals": ["better_sleep"],
        "helps": ["poor_sleep", "racing_mind", "screen_time_overuse"],
        "mechanisms": ["sleep_hygiene", "screen_dimming", "pre_commitment"],
        "effort": "moderate",
        "time": "30-60min",
        "when": ["evening", "pre_bed"],
        "where": ["home"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "nightly"
    },
    # G11.3
    {
        "summary": "Get 5–10 minutes of bright morning light within an hour of waking.",
        "experiment": "Expose yourself to bright natural light for 5–10 minutes within an hour of waking up.",
        "why": "Morning light advances the body clock, boosts alertness, and supports nighttime sleep pressure.",
        "how": [
            "Step outside or stand by a sunny window soon after waking.",
            "Skip sunglasses for a few minutes to maximize light exposure.",
            "Pair it with movement or a beverage to make it automatic."
        ],
        "goals": ["better_sleep", "improve_energy"],
        "helps": ["morning_energy", "poor_sleep"],
        "mechanisms": ["light_management", "habit_stacking", "nature_time"],
        "effort": "low",
        "time": "5-15min",
        "when": ["morning"],
        "where": ["outdoors", "home"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B1.1
    {
        "summary": "Set DND, close chat/email, and post a “back at” status for a 60-minute focus block.",
        "experiment": "Silence notifications, close communication apps, and set a status telling people when you’ll be back before a 60-minute sprint.",
        "why": "Removing interruptions and setting expectations protects uninterrupted focus time.",
        "how": [
            "Enable Do Not Disturb on every device.",
            "Close chat/email tabs and log out if needed.",
            "Set a status or autoresponder with your return time before you dive in."
        ],
        "goals": ["reduce_distractions", "meet_deadlines"],
        "helps": ["notification_overload", "context_switching"],
        "mechanisms": ["notifications_snooze", "pre_commitment", "time_boxed_sessions"],
        "effort": "moderate",
        "time": "30-60min",
        "when": ["any", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B1.2
    {
        "summary": "Park your phone in another room during deep work blocks.",
        "experiment": "Before deep work, turn on DND, put your phone in another room, and work until the block ends.",
        "why": "Physical distance from your phone removes the cue to check it, reducing temptation and mind-wandering.",
        "how": [
            "Set a start and end time for the deep work block.",
            "Move your phone out of sight—ideally another room.",
            "Leave a visible note reminding you when you’ll check messages next."
        ],
        "goals": ["reduce_distractions", "increased_productivity"],
        "helps": ["notification_overload", "context_switching"],
        "mechanisms": ["environment_design", "notifications_snooze", "pre_commitment"],
        "effort": "low",
        "time": "0-5min",
        "when": ["any", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B1.3
    {
        "summary": "Block your top three time-waster sites during focus windows.",
        "experiment": "Use a site blocker to lock out your top three distracting sites whenever you’re in a focus block.",
        "why": "Environmental control beats willpower; blocking the quick escapes keeps your brain on task.",
        "how": [
            "Identify the sites or apps that hijack you most.",
            "Schedule blocks during your focus windows with no override.",
            "Log urges to bypass the block to learn when they spike."
        ],
        "goals": ["reduce_distractions", "increased_productivity"],
        "helps": ["notification_overload", "procrastination"],
        "mechanisms": ["environment_design", "pre_commitment", "time_blocking"],
        "effort": "low",
        "time": "5-15min",
        "when": ["any", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B2.1
    {
        "summary": "Do one setup action only—open the doc, title it, and jot three bullets.",
        "experiment": "When you feel stuck, perform a single setup action to get rolling and stop once it’s done.",
        "why": "Micro-starts bypass avoidance and create momentum with minimal friction.",
        "how": [
            "Name the task you’ve been avoiding.",
            "Open the file or tool and add a title or three starter bullets.",
            "Walk away or keep going—either way, the task is now in motion."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["procrastination", "low_motivation"],
        "mechanisms": ["set_minimum_floor", "tiny_habits", "mindset_shift"],
        "effort": "minimal",
        "time": "0-5min",
        "when": ["any", "overwhelm"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "impulse_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "as_needed"
    },
    # B2.2
    {
        "summary": "Schedule a 15-minute bad-first-draft session and stop when the buzzer rings.",
        "experiment": "Block 15 minutes to create an intentionally bad first draft, then stop when the timer ends.",
        "why": "Timeboxing plus lowering the quality bar defeats dread and gets you producing.",
        "how": [
            "Set a timer for 15 minutes and label the session “bad draft only.”",
            "Write fast without editing—messy is welcome.",
            "Log that you started and plan the next draft session."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["procrastination", "perfectionism"],
        "mechanisms": ["time_boxed_sessions", "mindset_shift", "set_minimum_floor"],
        "effort": "low",
        "time": "15-30min",
        "when": ["any", "overwhelm"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "as_needed"
    },
    # B2.3
    {
        "summary": "Pair the task with a reward you enjoy and start immediately.",
        "experiment": "Choose a reward you’ll enjoy alongside or right after the task and begin the task now.",
        "why": "Temptation bundling adds dopamine to initiation, making it easier to start what you’ve been avoiding.",
        "how": [
            "Pick a motivating reward (playlist, latte, outdoor break).",
            "Set it up so it only happens while or after you work on the task.",
            "Begin the task immediately to lock in the bundle."
        ],
        "goals": ["meet_deadlines", "maintain_consistency"],
        "helps": ["procrastination", "low_motivation"],
        "mechanisms": ["temptation_bundling", "pre_commitment", "mindset_shift"],
        "effort": "low",
        "time": "0-5min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "as_needed"
    },
    # B3.1
    {
        "summary": "Timebox polishing to one pass and ship when the timer ends.",
        "experiment": "Set a short timer for final polish, allow one pass, and deliver the work when time is up.",
        "why": "Constraints curb over-editing and get finished work out the door.",
        "how": [
            "Decide how long the polish pass will be (e.g., 15 minutes).",
            "Focus on fixes that truly change outcomes, not cosmetic tweaks.",
            "Send or submit immediately when the timer ends."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["perfectionism", "overwhelm"],
        "mechanisms": ["time_boxed_sessions", "mindset_shift", "pre_commitment"],
        "effort": "low",
        "time": "5-15min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B3.2
    {
        "summary": "Define “good enough” criteria before you start and stop when they’re met.",
        "experiment": "Write down the specific criteria that mean the work is done, then stop when you’ve checked them off.",
        "why": "Satisficing reduces anxiety and tells you exactly when to stop polishing.",
        "how": [
            "List three objective signals that the work is done.",
            "Review the list midstream to avoid gold-plating.",
            "Stop when every criterion is met, even if you could keep tweaking."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["perfectionism", "decision_fatigue"],
        "mechanisms": ["pre_commitment", "mindset_shift", "planning_ahead"],
        "effort": "low",
        "time": "0-5min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B3.3
    {
        "summary": "Share a rough draft early and request targeted feedback.",
        "experiment": "Send an early draft to a trusted reviewer with 1–2 specific feedback questions.",
        "why": "Early feedback reduces uncertainty and accelerates progress toward the real target.",
        "how": [
            "Pick someone who can give useful input.",
            "Share the draft plus 1–2 questions you want answered.",
            "Block time to apply the feedback once it arrives."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["perfectionism", "procrastination"],
        "mechanisms": ["accountability_systems", "pre_commitment", "mindset_shift"],
        "effort": "moderate",
        "time": "5-15min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "weekly"
    },
    # B4.1
    {
        "summary": "Pick one task tool and capture every open loop into it today.",
        "experiment": "Choose the single task system you’ll trust and move every open loop into it before the day ends.",
        "why": "One trusted system lowers cognitive load and makes follow-through manageable.",
        "how": [
            "Select the app or notebook you’ll stick with.",
            "Dump all tasks, notes, and ideas into that one place.",
            "Archive or delete scattered lists so the new system is the only one."
        ],
        "goals": ["task_system_mastery", "increased_productivity"],
        "helps": ["no_systems", "overwhelm"],
        "mechanisms": ["planning_ahead", "self_monitoring", "mindset_shift"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "overwhelm"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "as_needed"
    },
    # B4.2
    {
        "summary": "Create Today/This Week/Later lists and sort tasks into them.",
        "experiment": "Make three lists—Today, This Week, Later—and move every task into the appropriate column.",
        "why": "Simple triage restores control and shows what truly needs attention now.",
        "how": [
            "List everything you’re juggling.",
            "Drop each task into Today, This Week, or Later.",
            "Focus only on Today until it’s clear, then review the rest."
        ],
        "goals": ["task_system_mastery", "meet_deadlines"],
        "helps": ["decision_paralysis", "overwhelm"],
        "mechanisms": ["priority_triad", "planning_ahead", "single_tasking"],
        "effort": "low",
        "time": "5-15min",
        "when": ["morning"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B4.3
    {
        "summary": "Schedule a 15-minute weekly review to update priorities and next actions.",
        "experiment": "Book a 15-minute recurring review to reconcile your system, set priorities, and confirm next steps.",
        "why": "Weekly reviews keep systems reliable and stop drift before it compounds.",
        "how": [
            "Pick a recurring time and add it to your calendar.",
            "Review open tasks, deadlines, and waiting-fors.",
            "Update priorities and choose the top actions for the coming week."
        ],
        "goals": ["task_system_mastery", "meet_deadlines"],
        "helps": ["maintenance_failure", "overwhelm"],
        "mechanisms": ["planning_ahead", "self_monitoring", "pre_commitment"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "weekly"
    },
    # B5.1
    {
        "summary": "Apply the 4D triage—Delete, Delegate, Defer, Do—starting with Delete.",
        "experiment": "Run today’s task list through the 4D filter in order so you shed low-value work before you start.",
        "why": "Deliberate triage prevents overload and preserves time for priority work.",
        "how": [
            "Circle items you can delete outright—remove them now.",
            "Identify what can be delegated or deferred and take that step immediately.",
            "Commit to the high-impact “Do” list for your next work block."
        ],
        "goals": ["stress_free_environment", "meet_deadlines"],
        "helps": ["overwhelm", "task_overload"],
        "mechanisms": ["planning_ahead", "mindset_shift", "priority_triad"],
        "effort": "moderate",
        "time": "5-15min",
        "when": ["morning", "overwhelm"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B5.2
    {
        "summary": "Delegate one task someone else can do 80% as well today.",
        "experiment": "Choose a task that doesn’t need you, delegate it with clear instructions, and confirm the handoff.",
        "why": "Delegation increases capacity and grows others while freeing your focus for higher-leverage work.",
        "how": [
            "Identify a task that doesn’t require your unique expertise.",
            "Pick the best-fit person and clarify the desired outcome and deadline.",
            "Follow up once to ensure it’s on track, then let it go."
        ],
        "goals": ["meet_deadlines", "reduce_distractions"],
        "helps": ["too_many_goals", "task_overload"],
        "mechanisms": ["mindset_shift", "pre_commitment", "planning_ahead"],
        "effort": "moderate",
        "time": "5-15min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B5.3
    {
        "summary": "Protect a 45-minute block for one high-impact task and make everything else wait.",
        "experiment": "Choose one high-impact task, block 45 minutes, and let everything else wait until it’s complete.",
        "why": "Focused intensity on the vital few tasks lifts results and lowers stress.",
        "how": [
            "Select the task that would make the biggest difference today.",
            "Put a 45-minute block on your calendar and guard it.",
            "Use the time solely on that task; note progress before re-engaging others."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["task_overload", "overwhelm"],
        "mechanisms": ["time_boxed_sessions", "priority_triad", "single_tasking"],
        "effort": "moderate",
        "time": "30-60min",
        "when": ["any", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B6.1
    {
        "summary": "Ask your manager for the top three outcomes that matter this week.",
        "experiment": "Send a quick check-in to confirm the three outcomes your manager cares about most this week.",
        "why": "Clarifying success targets reduces ambiguity and prevents wasted effort.",
        "how": [
            "Draft a short message or agenda for a quick conversation.",
            "Capture the three outcomes in writing once you hear them.",
            "Align your schedule to deliver on those outcomes first."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["unclear_priorities", "overwhelm"],
        "mechanisms": ["accountability_systems", "planning_ahead", "pre_commitment"],
        "effort": "low",
        "time": "5-15min",
        "when": ["morning", "new_project"],
        "where": ["work"],
        "features": ["solo_friendly"],
        "difficulty": 1,
        "sustainability": "weekly"
    },
    # B6.2
    {
        "summary": "Write a one-sentence definition of done for each major task.",
        "experiment": "For every major task on your plate, write one sentence that describes “done.”",
        "why": "Goal specificity improves execution and keeps you from spinning on unclear work.",
        "how": [
            "List your major tasks or projects.",
            "Write a one-sentence “done looks like…” for each.",
            "Share or revisit the sentences before you start working."
        ],
        "goals": ["task_system_mastery", "meet_deadlines"],
        "helps": ["unclear_priorities", "maintenance_failure"],
        "mechanisms": ["planning_ahead", "implementation_intentions", "mindset_shift"],
        "effort": "low",
        "time": "5-15min",
        "when": ["any", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B6.3
    {
        "summary": "Sort your list by impact on goals/KPIs and start at the top.",
        "experiment": "Order today’s tasks by impact on core goals or KPIs and begin with the highest value item.",
        "why": "Impact-based ordering aligns effort with results and curbs busywork.",
        "how": [
            "List your current tasks alongside the goal or KPI they serve.",
            "Rank them from highest to lowest impact.",
            "Start with the top task and stay with it until meaningful progress."
        ],
        "goals": ["increased_productivity", "meet_deadlines"],
        "helps": ["unclear_priorities", "decision_paralysis"],
        "mechanisms": ["priority_triad", "single_tasking", "planning_ahead"],
        "effort": "low",
        "time": "5-15min",
        "when": ["morning"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B7.1
    {
        "summary": "Decline meetings without an agenda and request an async update instead.",
        "experiment": "If an invite lacks an agenda, ask for async updates or decline unless an agenda is provided.",
        "why": "Agenda discipline and async updates reduce wasted time.",
        "how": [
            "Reply to the invite asking for an agenda or async alternative.",
            "Share your preferred update format (doc, email, Loom).",
            "Use reclaimed time for focus work."
        ],
        "goals": ["reduce_distractions", "meet_deadlines"],
        "helps": ["meeting_overload", "time_constraints"],
        "mechanisms": ["mindset_shift", "pre_commitment", "planning_ahead"],
        "effort": "moderate",
        "time": "0-5min",
        "when": ["any"],
        "where": ["work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B7.2
    {
        "summary": "Cluster meetings into one part of the day to protect a daily focus block.",
        "experiment": "Reschedule meetings into a cluster so you keep at least one daily focus block open.",
        "why": "Batching meetings reduces fragmentation and preserves deep work time.",
        "how": [
            "Pick the portion of the day where meetings disrupt you least.",
            "Shift existing meetings into that window when possible.",
            "Block the protected focus time so it stays clear."
        ],
        "goals": ["reduce_distractions", "increased_productivity"],
        "helps": ["meeting_overload", "context_switching"],
        "mechanisms": ["time_blocking", "planning_ahead", "pre_commitment"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "new_project"],
        "where": ["work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "weekly"
    },
    # B7.3
    {
        "summary": "End meetings 10 minutes early by timeboxing each agenda item.",
        "experiment": "Assign time limits to each agenda item and stick to them so the meeting ends 10 minutes early.",
        "why": "Structured agendas keep meetings efficient and return focus time to your day.",
        "how": [
            "Share agenda items with time limits upfront.",
            "Use a visible timer and redirect when items run long.",
            "Wrap with clear next actions in the reclaimed time."
        ],
        "goals": ["reduce_distractions", "meet_deadlines"],
        "helps": ["meeting_overload", "time_constraints"],
        "mechanisms": ["time_boxed_sessions", "pre_commitment", "planning_ahead"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any"],
        "where": ["work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B8.1
    {
        "summary": "Check email at set times (e.g., 11am and 3pm) and turn off notifications.",
        "experiment": "Choose two email windows, turn off notifications, and only check during those times.",
        "why": "Batching email reduces switching costs and keeps you focused on real work.",
        "how": [
            "Pick the two times you’ll check email today.",
            "Disable notifications on all devices.",
            "Capture urgent needs elsewhere so you can respond during the next window."
        ],
        "goals": ["reduce_distractions", "increased_productivity"],
        "helps": ["notification_overload", "time_constraints"],
        "mechanisms": ["task_batching", "notifications_snooze", "pre_commitment"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["morning", "afternoon"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B8.2
    {
        "summary": "Unsubscribe from five low-value lists and create filters for the rest.",
        "experiment": "Spend one session unsubscribing from five unnecessary lists and filtering similar emails automatically.",
        "why": "Reducing inflow cuts noise at the source and saves time later.",
        "how": [
            "Open your inbox and identify repeat offenders.",
            "Unsubscribe or filter at least five senders.",
            "Create a rule to auto-sort newsletters into a review folder."
        ],
        "goals": ["task_system_mastery", "reduce_distractions"],
        "helps": ["notification_overload", "time_constraints"],
        "mechanisms": ["environment_design", "planning_ahead", "one_touch_rule"],
        "effort": "low",
        "time": "5-15min",
        "when": ["any", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "weekly"
    },
    # B8.3
    {
        "summary": "Use three canned responses to speed through your inbox.",
        "experiment": "Write or update three canned responses for frequent replies and use them during your next email block.",
        "why": "Templates reduce decision time and keystrokes so you get through email faster.",
        "how": [
            "Identify three responses you send often.",
            "Draft concise templates and save them in your email tool.",
            "Use each template at least once during your next inbox session."
        ],
        "goals": ["meet_deadlines", "increased_productivity"],
        "helps": ["notification_overload", "decision_fatigue"],
        "mechanisms": ["planning_ahead", "pre_commitment", "task_batching"],
        "effort": "low",
        "time": "5-15min",
        "when": ["work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "weekly"
    },
    # B9.1
    {
        "summary": "Batch similar tasks into dedicated blocks (calls, admin, creative).",
        "experiment": "Group similar tasks together and schedule dedicated blocks for each batch.",
        "why": "Task batching lowers switching costs and lets your brain stay in one mode.",
        "how": [
            "List the categories of work you juggle (e.g., calls, admin).",
            "Assign each category a block on your calendar.",
            "Save new tasks for their batch instead of sprinkling them throughout the day."
        ],
        "goals": ["reduce_distractions", "increased_productivity"],
        "helps": ["context_switching", "task_overload"],
        "mechanisms": ["task_batching", "time_blocking", "single_tasking"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "weekly"
    },
    # B9.2
    {
        "summary": "Keep a parking-lot note for interruptions and return to the main task fast.",
        "experiment": "Use a dedicated parking-lot note to capture incoming thoughts and revisit them after you finish your focus block.",
        "why": "Externalizing interruptions keeps you from derailing focus while making sure ideas aren’t lost.",
        "how": [
            "Open a note or sticky labeled “Parking Lot.”",
            "When something pops up, jot it down without switching tasks.",
            "Review the list during your next break and schedule what matters."
        ],
        "goals": ["maintain_consistency", "reduce_distractions"],
        "helps": ["context_switching", "overwhelm"],
        "mechanisms": ["self_monitoring", "reminder_cues", "single_tasking"],
        "effort": "low",
        "time": "0-5min",
        "when": ["any", "work_break"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B9.3
    {
        "summary": "Work full-screen with only one app or document open.",
        "experiment": "Switch to full-screen mode and close other windows so only the task at hand is visible.",
        "why": "Single-tasking improves accuracy and speed by removing visual distractions.",
        "how": [
            "Pick the task that needs your attention now.",
            "Enter full-screen mode and close everything else.",
            "Stay in that window until you complete the next milestone."
        ],
        "goals": ["reduce_distractions", "meet_deadlines"],
        "helps": ["context_switching", "notification_overload"],
        "mechanisms": ["environment_design", "single_tasking", "pre_commitment"],
        "effort": "minimal",
        "time": "0-5min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B10.1
    {
        "summary": "Set a daily shutdown time and finish with a five-minute checklist.",
        "experiment": "Pick a shutdown time, run a five-minute checklist, and power down work for the day.",
        "why": "Boundary rituals aid recovery and prevent burnout by signaling work is done.",
        "how": [
            "Choose a realistic end-of-day time and set a reminder.",
            "Checklist: capture loose ends, note tomorrow’s start task, tidy your space.",
            "Close apps and say a verbal “shutdown complete” cue."
        ],
        "goals": ["stress_free_environment", "better_sleep"],
        "helps": ["maintenance_failure", "overwhelm"],
        "mechanisms": ["closure_ritual", "planning_ahead", "habit_stacking"],
        "effort": "moderate",
        "time": "5-15min",
        "when": ["evening"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B10.2
    {
        "summary": "Remove work email from your phone or disable push after hours.",
        "experiment": "Either delete work email from your phone or turn off push notifications outside work hours.",
        "why": "Fewer cues prevent after-hours rumination and protect recovery time.",
        "how": [
            "Decide whether to remove the app or use scheduled notification settings.",
            "Set an auto-reply or status with your reachable hours if needed.",
            "Spend the first evening noticing the difference in mental space."
        ],
        "goals": ["stress_free_environment", "better_sleep"],
        "helps": ["notification_overload", "poor_sleep"],
        "mechanisms": ["notifications_snooze", "environment_design", "pre_commitment"],
        "effort": "low",
        "time": "5-15min",
        "when": ["evening"],
        "where": ["home"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B10.3
    {
        "summary": "Use Schedule Send for late messages so replies don’t boomerang at night.",
        "experiment": "When emailing late, schedule send for the next morning to protect everyone’s off-hours.",
        "why": "Norm-setting keeps after-hours replies from pulling you back into work.",
        "how": [
            "Finish the message but schedule it for tomorrow during working hours.",
            "Add a note in your signature stating your preferred response window.",
            "Close your laptop once messages are queued."
        ],
        "goals": ["stress_free_environment", "reduce_distractions"],
        "helps": ["notification_overload", "overwhelm"],
        "mechanisms": ["planning_ahead", "pre_commitment", "mindset_shift"],
        "effort": "low",
        "time": "0-5min",
        "when": ["evening"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B11.1
    {
        "summary": "Do a 10-item toss/file sprint and clear one surface completely.",
        "experiment": "Set a short timer, clear at least 10 items, and leave one surface fully reset.",
        "why": "Small wins reduce visual load and build momentum for bigger cleanups.",
        "how": [
            "Pick the surface that stresses you most.",
            "Toss, recycle, or file 10 items as fast as you can.",
            "Take a quick photo to reinforce the before/after contrast."
        ],
        "goals": ["organize_workspace", "declutter_momentum"],
        "helps": ["visual_chaos", "paper_piles"],
        "mechanisms": ["time_boxed_sessions", "surface_clearing", "daily_reset"],
        "effort": "low",
        "time": "0-5min",
        "when": ["any", "overwhelm"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B11.2
    {
        "summary": "Set up a single in-tray for papers and empty it daily.",
        "experiment": "Designate one in-tray for all incoming paper and empty it to zero every day.",
        "why": "One capture point prevents piles from spreading and keeps paperwork under control.",
        "how": [
            "Choose a tray or box near where paper lands.",
            "Put every new paper into the tray immediately.",
            "Schedule a quick daily sweep to process the contents."
        ],
        "goals": ["paper_management", "organize_workspace"],
        "helps": ["paper_piles", "maintenance_failure"],
        "mechanisms": ["one_touch_rule", "environment_design", "daily_reset"],
        "effort": "moderate",
        "time": "5-15min",
        "when": ["evening"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B11.3
    {
        "summary": "Standardize and label storage for supplies and reference materials.",
        "experiment": "Pick a supply category, set up consistent containers, and label them so everything has a clear home.",
        "why": "Standardization reduces search time and keeps order easier to maintain.",
        "how": [
            "Select the supplies or files that get messy fastest.",
            "Choose matching bins or folders and label them clearly.",
            "Walk through a quick reset to confirm everything has a home."
        ],
        "goals": ["organize_workspace", "paper_management"],
        "helps": ["lost_items", "paper_piles"],
        "mechanisms": ["zone_organizing", "environment_design", "surface_clearing"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "weekly"
    },
    # B12.1
    {
        "summary": "Fix one friction today—update software, automate a step, or add a shortcut.",
        "experiment": "Identify one recurring friction and resolve it today (update, automate, shortcut).",
        "why": "Removing small bottlenecks compounds into meaningful daily time savings.",
        "how": [
            "List annoyances that slow you down.",
            "Pick one to eliminate (update, macro, automation).",
            "Test the fix and note the minutes it saves."
        ],
        "goals": ["increased_productivity", "task_system_mastery"],
        "helps": ["too_many_tools", "maintenance_failure"],
        "mechanisms": ["environment_design", "mindset_shift", "planning_ahead"],
        "effort": "moderate",
        "time": "5-15min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B12.2
    {
        "summary": "Consolidate to one calendar and one task app to reduce fragmentation.",
        "experiment": "Move events and tasks into a single calendar and one task manager today.",
        "why": "Single sources of truth cut errors and mental load from juggling tools.",
        "how": [
            "Choose the calendar and task app you’ll keep.",
            "Export/import or manually move items into those two systems.",
            "Archive other tools so you aren’t tempted to double-track."
        ],
        "goals": ["task_system_mastery", "increased_productivity"],
        "helps": ["too_many_tools", "overwhelm"],
        "mechanisms": ["environment_design", "planning_ahead", "mindset_shift"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "as_needed"
    },
    # B12.3
    {
        "summary": "Create a reusable template for a task you repeat weekly.",
        "experiment": "Document the steps or checklist for a recurring weekly task and save it as a template.",
        "why": "Standardization speeds execution and keeps quality consistent.",
        "how": [
            "Pick a task you repeat weekly (report, meeting prep).",
            "Write the steps in order with any key links or scripts.",
            "Store the template where you’ll use it each week."
        ],
        "goals": ["maintain_consistency", "increased_productivity"],
        "helps": ["decision_fatigue", "maintenance_failure"],
        "mechanisms": ["planning_ahead", "pre_commitment", "task_batching"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any", "new_project"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "weekly"
    },
    # B13.1
    {
        "summary": "Pre-decide rules for common choices (e.g., “No agenda, no meeting”).",
        "experiment": "Create clear rules for recurring decisions so you can apply them automatically.",
        "why": "Decision policies conserve willpower and reduce daily choice fatigue.",
        "how": [
            "List decisions that drain you (meetings, meal choices, approvals).",
            "Write a simple rule for each (e.g., “Lunch = Tuesday leftovers”).",
            "Post the rules where you’ll see them and start using them today."
        ],
        "goals": ["stress_free_environment", "increased_productivity"],
        "helps": ["decision_fatigue", "overwhelm"],
        "mechanisms": ["pre_commitment", "mindset_shift", "planning_ahead"],
        "effort": "low",
        "time": "5-15min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B13.2
    {
        "summary": "Make high-stakes decisions early in the day and batch trivial ones later.",
        "experiment": "Schedule important decisions for when energy is highest and defer low-stakes choices to a set batch time.",
        "why": "Matching decision timing to energy preserves brainpower for what matters most.",
        "how": [
            "Identify decisions that require your sharpest thinking.",
            "Block a morning slot for those choices.",
            "Batch trivial decisions (e.g., approvals, scheduling) for an afternoon window."
        ],
        "goals": ["meet_deadlines", "stress_free_environment"],
        "helps": ["decision_fatigue", "overwhelm"],
        "mechanisms": ["planning_ahead", "time_blocking", "mindset_shift"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["morning", "afternoon"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B13.3
    {
        "summary": "Create defaults for meals, clothes, and routines on busy days.",
        "experiment": "Design go-to defaults for hectic days (meal lineup, outfit stack, simplified routine).",
        "why": "Defaults reduce choice load and keep you moving even when bandwidth is low.",
        "how": [
            "Choose one area (meals, outfits, evening routine).",
            "Create a ready-to-go default option.",
            "Use it on your next busy day and note how much time/energy it saves."
        ],
        "goals": ["stress_free_environment", "morning_routine"],
        "helps": ["decision_fatigue", "time_constraints"],
        "mechanisms": ["planning_ahead", "environment_design", "habit_stacking"],
        "effort": "low",
        "time": "5-15min",
        "when": ["morning", "evening"],
        "where": ["home"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "weekly"
    },
    # B14.1
    {
        "summary": "Work in 90-minute cycles with a real 10–15 minute break between.",
        "experiment": "Plan your day in 90-minute work cycles followed by true 10–15 minute breaks.",
        "why": "Ultradian rhythm breaks sustain energy and prevent burnout.",
        "how": [
            "Map two to three 90-minute cycles for your key work.",
            "Take a real break—move, hydrate, stretch—when the block ends.",
            "Log how your focus and energy feel after two cycles."
        ],
        "goals": ["improve_energy", "increased_productivity"],
        "helps": ["low_energy", "overwhelm"],
        "mechanisms": ["time_boxed_sessions", "movement_breaks", "planning_ahead"],
        "effort": "moderate",
        "time": "30-60min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "daily"
    },
    # B14.2
    {
        "summary": "Drink water and take a five-minute walk before your afternoon block.",
        "experiment": "Before your afternoon work block, drink water and take a brisk five-minute walk.",
        "why": "Hydration and light movement boost alertness for the second half of the day.",
        "how": [
            "Set a reminder 10 minutes before your afternoon block.",
            "Drink a glass of water and walk around your space or outside.",
            "Notice how your energy shifts when you start working again."
        ],
        "goals": ["improve_energy"],
        "helps": ["low_energy", "time_constraints"],
        "mechanisms": ["movement_breaks", "habit_stacking", "mindset_shift"],
        "effort": "low",
        "time": "5-15min",
        "when": ["afternoon", "work_break"],
        "where": ["home", "work", "outdoors"],
        "features": ["solo_friendly", "chaos_proof"],
        "difficulty": 1,
        "sustainability": "daily"
    },
    # B14.3
    {
        "summary": "Match hard tasks to peak energy and lighter tasks to your dips.",
        "experiment": "Observe your energy curve and schedule demanding work during peaks and lighter tasks during dips.",
        "why": "Chronotype alignment increases efficiency and lowers friction.",
        "how": [
            "Track your energy highs and lows for a few days.",
            "Label tasks as heavy or light lift.",
            "Place heavy tasks in peak slots and lighter work in dips for the coming week."
        ],
        "goals": ["meet_deadlines", "improve_energy"],
        "helps": ["low_energy", "decision_fatigue"],
        "mechanisms": ["self_monitoring", "planning_ahead", "mindset_shift"],
        "effort": "moderate",
        "time": "15-30min",
        "when": ["any"],
        "where": ["home", "work"],
        "features": ["solo_friendly"],
        "difficulty": 2,
        "sustainability": "weekly"
    },
]

def format_details(experiment: str, why: str, how: list[str]) -> str:
    how_lines = "\\n".join(f"• {item}" for item in how)
    return (
        f"**The Experiment:** {experiment}\\n\\n"
        f"**Why it Works:** {why}\\n\\n"
        f"**How to Try It:**\\n{how_lines}"
    )


def main() -> None:
    output_lines = ["import { SimplifiedTip } from '../types/simplifiedTip';", "", "export const PRODUCTIVITY_SIMPLIFIED_TIPS: SimplifiedTip[] = ["]
    for idx, tip in enumerate(TIPS_DATA):
        data = dict(tip)
        data["tip_id"] = UUIDS[idx]
        details_md = format_details(data.pop("experiment"), data.pop("why"), data.pop("how"))
        data["details_md"] = details_md
        data.setdefault("area", "organization")
        data.setdefault("cost", "$")
        data.setdefault("contraindications", [])
        data.setdefault("mechanisms", [])
        data.setdefault("helps", [])
        data.setdefault("requires", [])
        data.setdefault("features", ["solo_friendly", "no_planning", "impulse_friendly", "chaos_proof"])
        data.setdefault("time", "0-5min")
        data.setdefault("effort", "low")
        data.setdefault("when", ["any"])
        data.setdefault("where", ["work"])
        data.setdefault("difficulty", 1)
        data.setdefault("source", "coach_curated")
        data.setdefault("sustainability", "as_needed")
        lines = ["  {"]
        for key in [
            "tip_id", "summary", "details_md", "area", "goals", "helps", "contraindications", "mechanisms",
            "effort", "time", "cost", "when", "where", "requires", "features", "difficulty", "source", "sustainability"
        ]:
            value = data.get(key)
            if value is None:
                continue
            if isinstance(value, str):
                value_repr = f'"{value}"'
            elif isinstance(value, list):
                list_lines = ",\n      ".join(
                    f'"{item}"' if isinstance(item, str) else str(item)
                    for item in value
                )
                value_repr = f"[\n      {list_lines}\n    ]" if value else "[]"
            else:
                value_repr = str(value)
            lines.append(f"    \"{key}\": {value_repr},")
        lines[-1] = lines[-1].rstrip(',')
        lines.append("  },")
        output_lines.extend(lines)
    output_lines.append("];\n")
    Path('data/productivitySimplifiedTips.ts').write_text("\n".join(output_lines))

if __name__ == '__main__':
    main()
