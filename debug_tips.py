#!/usr/bin/env python3
import re

# Test the regex patterns
test_strings = [
    '"tip_id": "e897e203-f6a3-4726-97cf-0be4bf6dade3"',
    'tip_id: \'a1b2c3d4-0001-4001-a001-1234567890ab\'',
    '"summary": "Keep ginger chews or candies on hand for nausea relief."',
    'summary: \'Swap one sugary drink for water or sparkling water.\''
]

patterns = [
    r'(?:"tip_id"|tip_id):\s*[\'"`]([^\'"`]+)[\'"`]',
    r'(?:"summary"|summary):\s*[\'"`]((?:[^\'"`\\\\]|\\\\.)*)[\'"`,]'
]

for test_str in test_strings:
    print(f"Testing: {test_str}")
    for i, pattern in enumerate(patterns):
        match = re.search(pattern, test_str)
        if match:
            print(f"  Pattern {i} matches: {match.group(1)}")
        else:
            print(f"  Pattern {i} no match")
    print()