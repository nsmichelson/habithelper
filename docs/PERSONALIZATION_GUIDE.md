# Personalization Guide for Habit Helper Tips

## Overview
The "Make It Your Own" card allows users to personalize tips with their own plans, making them more accountable and engaged. This card appears as the 5th card in the tip navigation when a tip has personalization configured.

## How to Add Personalization to a Tip

Add these fields to any tip in the `tips.ts` file:

```typescript
{
  tip_id: "...",
  summary: "...",
  
  // Required for personalization
  personalization_prompt: "Your question or prompt for the user",
  personalization_type: "text" | "scale" | "list" | "multi_text" | "choice",
  
  // Optional configuration
  personalization_config: {
    // Configuration based on type (see below)
  }
}
```

## Personalization Types

### 1. Simple Text Input (`type: "text"`)
Single text field for user to fill in their plan.

```typescript
personalization_prompt: "What frozen fruit will you try as dessert tonight?",
personalization_type: "text",
personalization_config: {
  placeholders: ["e.g., Frozen grapes, mango chunks, or mixed berries"]
}
```

**Use for:** Simple planning questions, single commitments, "what will you try" scenarios

---

### 2. Scale Customization (`type: "scale"`)
For tips involving scales or levels (like hunger scales, energy levels, etc.)

#### Option A: User Names the Levels
```typescript
personalization_prompt: "Give your hunger levels fun, memorable names!",
personalization_type: "scale",
personalization_config: {
  scale_customization: "names",  // User provides names
  scale_labels: [
    "Extremely hungry - stomach growling",  // Fixed descriptions
    "Satisfied - comfortable and content",
    "Overly full - uncomfortably stuffed"
  ],
  placeholders: ["e.g., Lion", "e.g., Kitty", "e.g., Sloth"]
}
```

#### Option B: User Describes the Levels
```typescript
personalization_prompt: "Describe what each energy level feels like for you",
personalization_type: "scale",
personalization_config: {
  scale_customization: "descriptions",  // User provides descriptions
  scale_labels: [
    "Low Energy",   // Fixed names
    "Moderate Energy",
    "High Energy"
  ],
  placeholders: [
    "e.g., Can barely keep eyes open",
    "e.g., Steady and focused",
    "e.g., Ready to take on anything"
  ]
}
```

**Use for:** Any tip involving numbered scales, rating systems, or levels

---

### 3. List with Customizable Items (`type: "list"`)
Multiple items where user can customize either the label OR the description.

#### Option A: User Fills in Descriptions (Fixed Headers)
```typescript
personalization_prompt: "Plan your salad jar layers. What ingredients will you use?",
personalization_type: "list",
personalization_config: {
  items: [
    {
      label: "Bottom Layer - Dressing",  // Fixed
      placeholder: "e.g., Balsamic vinaigrette",
      description: "Keeps ingredients from getting soggy",  // User fills this
      customizable: "description"
    },
    {
      label: "Layer 2 - Hearty Veggies",  // Fixed
      placeholder: "e.g., Cucumbers, tomatoes",
      description: "Won't wilt from dressing",  // User fills this
      customizable: "description"
    }
    // ... more items
  ]
}
```

#### Option B: User Names the Items (Fixed Descriptions)
```typescript
personalization_prompt: "Name your three morning routine steps",
personalization_type: "list",
personalization_config: {
  items: [
    {
      label: "Step 1",  // User replaces this
      placeholder: "e.g., Drink water",
      description: "First thing when you wake up",  // Fixed
      customizable: "label"
    },
    {
      label: "Step 2",  // User replaces this
      placeholder: "e.g., Stretch",
      description: "Before getting out of bed",  // Fixed
      customizable: "label"
    }
    // ... more items
  ]
}
```

**Use for:** Meal planning, routine building, multi-step preparations

---

### 4. Multiple Text Inputs (`type: "multi_text"`)
Several related text inputs for different aspects of the same plan.

```typescript
personalization_prompt: "Plan your workout routine",
personalization_type: "multi_text",
personalization_config: {
  items: [
    {
      label: "What time?",
      placeholder: "e.g., 7:00 AM",
      customizable: "description"
    },
    {
      label: "Where?",
      placeholder: "e.g., Living room",
      customizable: "description"
    },
    {
      label: "What workout?",
      placeholder: "e.g., 20 min yoga video",
      customizable: "description"
    }
  ]
}
```

**Use for:** Planning multiple aspects of a single activity

---

### 5. Choice Selection (`type: "choice"`) - Future
Multiple choice selection from predefined options.

```typescript
personalization_prompt: "Which healthy swap will you try first?",
personalization_type: "choice",
personalization_config: {
  options: [
    "Sparkling water instead of soda",
    "Fruit instead of candy",
    "Nuts instead of chips"
  ],
  multiple: false  // or true for multi-select
}
```

**Use for:** Choosing between alternatives, selecting from a menu of options

---

## Configuration Rules

### Required Fields
- `personalization_prompt`: Always required - this is the question shown to the user
- `personalization_type`: Always required - determines the UI component

### Type-Specific Rules

#### For `scale` type:
- Must specify `scale_customization`: either "names" or "descriptions"
- Must provide `scale_labels`: array of 3 strings (for levels 1, 5, 10)
- Should provide `placeholders`: array of 3 example strings

#### For `list` or `multi_text` type:
- Must provide `items` array
- Each item must have:
  - `label`: The header text
  - `customizable`: Either "label" or "description"
  - `placeholder`: Example text (optional but recommended)
  - `description`: Helper text (optional)

#### For `text` type:
- Should provide `placeholders`: array with one string

---

## Best Practices

### 1. Make Prompts Action-Oriented
❌ "Think about what fruit you like"
✅ "What frozen fruit will you try as dessert tonight?"

### 2. Provide Helpful Placeholders
❌ "Enter text here"
✅ "e.g., Frozen grapes, mango chunks, or mixed berries"

### 3. Choose the Right Type
- **Single commitment** → `text`
- **Scale/rating system** → `scale`
- **Step-by-step plan** → `list`
- **Multiple aspects** → `multi_text`

### 4. Decide What's Customizable
- **Fixed categories, variable content** → `customizable: "description"`
  - Example: Meal prep layers (user fills what goes in each layer)
- **Variable categories, fixed purpose** → `customizable: "label"`
  - Example: Personal routine steps (user names their own steps)

### 5. Keep It Achievable
- Don't ask for too many items (3-5 is ideal)
- Make the commitment specific and time-bound
- Focus on the immediate next action

---

## Examples by Use Case

### Meal Planning
```typescript
// User plans what they'll prep
personalization_type: "list",
items: [
  { label: "Breakfast", customizable: "description" },
  { label: "Lunch", customizable: "description" },
  { label: "Dinner", customizable: "description" }
]
```

### Habit Stacking
```typescript
// User defines their trigger-action pairs
personalization_type: "list",
items: [
  { label: "After I...", customizable: "description" },
  { label: "I will...", customizable: "description" }
]
```

### Personal Scales
```typescript
// User creates memorable names for levels
personalization_type: "scale",
scale_customization: "names",
scale_labels: ["Empty", "Perfect", "Too Full"]
```

### Simple Commitments
```typescript
// User makes a specific plan
personalization_type: "text",
placeholders: ["e.g., Walk around the block after lunch"]
```

---

## Testing Your Personalization

1. Add the personalization fields to your tip
2. Load the tip in the app
3. Check that the "Plan" card appears as the 5th navigation option
4. Verify the input fields match your configuration
5. Test saving and editing functionality

---

## Future Enhancements

Planned features not yet implemented:
- `choice` type for multiple choice selection
- `min_items` and `max_items` for dynamic lists
- Conditional fields based on user responses
- Image upload for visual planning
- Time/date pickers for scheduling

---

## Troubleshooting

**Plan card not showing?**
- Ensure `personalization_prompt` is defined
- Check that `personalization_type` is valid

**Wrong input type?**
- Verify `customizable` field is set correctly
- Check `scale_customization` for scale types

**Placeholders not appearing?**
- Ensure `placeholders` array matches the number of inputs
- For lists, add `placeholder` to each item

---

## Type Definitions Reference

See `/types/tip.ts` for complete TypeScript definitions:
```typescript
personalization_prompt?: string;
personalization_type?: 'text' | 'scale' | 'choice' | 'multi_text' | 'list';
personalization_config?: {
  scale_customization?: 'names' | 'descriptions';
  scale_labels?: string[];
  items?: {
    label: string;
    placeholder?: string;
    description?: string;
    customizable?: 'label' | 'description';
  }[];
  placeholders?: string[];
  min_items?: number;
  max_items?: number;
};
```