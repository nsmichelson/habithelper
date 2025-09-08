#!/usr/bin/env python3
import json

with open('unique_tips.json', 'r') as f:
    tips = json.load(f)

print(f"Total tips: {len(tips)}")

valid_tips = [tip for tip in tips if tip.get('tip_id') and tip.get('summary')]
print(f"Valid tips (with tip_id and summary): {len(valid_tips)}")

empty_summary = [tip for tip in tips if not tip.get('summary') or tip.get('summary') == '']
print(f"Tips with empty summary: {len(empty_summary)}")

if len(tips) != 118:
    print(f"Expected 118 tips but found {len(tips)}")
    
    # Show some sample tip_ids to understand the pattern
    print("First 10 tip_ids:")
    for i, tip in enumerate(tips[:10]):
        print(f"  {i+1}. {tip.get('tip_id', 'NO_ID')}: {tip.get('summary', 'NO_SUMMARY')[:50]}...")