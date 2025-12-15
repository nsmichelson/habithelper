# Troubleshooting Tree Design

## 1. I forgot or keep forgetting
**Goal:** Address memory/cognitive lapses.

*   **A. "I just plain forgot."**
    *   *Type:* Generic
    *   *Action:* Prompt user to set a system reminder.
    *   *Content:* "No problem. Let's set a reminder for a time that actually works." -> [Set Reminder UI]

*   **B. "I remembered but got distracted."**
    *   *Type:* Generic
    *   *Action:* Suggest an "Implementation Intention" (When X, I will Y).
    *   *Content:* "Distractions happen. Let's anchor this to something you already do (like brushing teeth or making coffee)." -> [Habit Stack Builder]

*   **C. "It's hard to remember this time of day."**
    *   *Type:* Generic
    *   *Action:* Suggest moving the prompt or the activity window.
    *   *Content:* "Maybe this time doesn't fit your flow. Want to try doing it at [Alternative Time]?" -> [Reschedule UI]

## 2. I don't have what I needed
**Goal:** Address logistical/resource blockers.

*   **A. "I'm missing an ingredient/item."**
    *   *Type:* Tip-Specific (Requires `substitutions` data)
    *   *Logic:* Check if tip has `substitutions` or `swaps` defined.
    *   *Content:* "Here are some swaps you might have on hand:" -> [List Substitutes]
    *   *Fallback (if no data):* "Can you improvise with something similar, or do you want to skip today?"

*   **B. "I don't have the equipment."**
    *   *Type:* Tip-Specific (Requires `low_tech_version` data)
    *   *Logic:* Check for `low_tech_version` field.
    *   *Content:* "No fancy gear needed. Try this low-tech version:" -> [Show Low-Tech Alternative]
    *   *Fallback:* "No worries. Let's pick a tip that uses what you have." -> [Swap Tip]

*   **C. "It costs too much."**
    *   *Type:* Generic
    *   *Action:* Validate and offer a free/cheap alternative behavior.
    *   *Content:* "Health shouldn't break the bank. Let's swap this for a zero-cost option." -> [Swap for 'Budget Friendly' Tip]

## 3. My schedule changed
**Goal:** Address time/opportunity constraints.

*   **A. "I have zero time right now."**
    *   *Type:* Tip-Specific (Requires `micro_version` or `starter_step`)
    *   *Logic:* Check for `micro_version`.
    *   *Content:* "Do the 1-minute version instead:" -> [Show Micro-Version] (e.g., "Just put on your shoes" vs "Go for a run").

*   **B. "I'm traveling / out of routine."**
    *   *Type:* Generic / Contextual
    *   *Action:* Offer adaptability advice.
    *   *Content:* "Travel mode on. Aim for 'good enough,' not perfect. Can you do 50% of it?"

*   **C. "An emergency came up."**
    *   *Type:* Generic
    *   *Action:* Grant permission to skip without guilt.
    *   *Content:* "Life happens. Mark it as 'Life got in the way' and we'll reset for tomorrow. No streak penalty."

## 4. Cravings or social stuff getting in the way
**Goal:** Address social pressure and temptation.

*   **A. "I'm at a restaurant/party."**
    *   *Type:* Generic (Contextual)
    *   *Action:* Provide "Social Defense" tips.
    *   *Content:* "Social defense mode: 1. Order first. 2. Hold a drink (water). 3. Focus on the people."

*   **B. "I have a strong craving."**
    *   *Type:* Generic
    *   *Action:* Trigger "Urge Surfing" tool.
    *   *Content:* "Let's surf the urge. It usually peaks in 20 mins. Want to start a 5-minute timer?" -> [Start Timer]

*   **C. "Peer pressure / Family."**
    *   *Type:* Generic
    *   *Action:* Provide a script.
    *   *Content:* "Try this script: 'I'm experimenting with something new for my digestion/energy right now.' People usually back off."

## 5. Something feels off (physically, emotionally)
**Goal:** Address internal resistance and physical states.

*   **A. "I feel physically bad (bloated, tired, sick)."**
    *   *Type:* Generic
    *   *Action:* Switch to "Rest/Recovery" mode.
    *   *Content:* "Rest is productive too. Let's count 'Resting' as your win for today."

*   **B. "I feel anxious/overwhelmed by it."**
    *   *Type:* Generic
    *   *Action:* Shrink the task.
    *   *Content:* "The task might be too big. What's the tiniest first step? Just do that."

*   **C. "I'm just not in the mood."**
    *   *Type:* Generic
    *   *Action:* Motivation check.
    *   *Content:* "Fair enough. Is it a 'hard no' or a 'maybe for 1 minute'?"

## 6. Tried but not working for me
**Goal:** Address efficacy and preferences.

*   **A. "I did it, but didn't get the result."**
    *   *Type:* Generic
    *   *Action:* Manage expectations.
    *   *Content:* "Biology is slow. This usually takes [Time Estimate] to feel a difference. Stick with it one more day?"

*   **B. "It was unpleasant / tasted bad."**
    *   *Type:* Tip-Specific (Feedback loop)
    *   *Action:* Mark tip as 'Disliked' and swap.
    *   *Content:* "Noted. We won't show you this one again. Let's try something different." -> [Swap Tip]

*   **C. "I couldn't finish it."**
    *   *Type:* Generic
    *   *Action:* Validate partial success.
    *   *Content:* "Partial reps count! You did more than zero. That's a win."

---

## Data Requirements for Tip-Specific Branches

To support the branches above, the `SimplifiedTip` type should ideally be augmented with:

```typescript
interface SimplifiedTip {
  // ... existing fields ...

  // For "I don't have what I needed"
  substitutions?: {
    item: string;
    swaps: string[];
  }[];

  // For "I don't have equipment"
  low_tech_version?: string; // Description of how to do it without gear

  // For "I have zero time"
  micro_version?: string; // The 1-minute or 30-second version of the tip
}
```
