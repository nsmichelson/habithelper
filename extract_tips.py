#!/usr/bin/env python3
import re

# Read the TypeScript file
with open('/Users/nataliemichelson/Projects/habithelper/data/tips.ts', 'r') as f:
    content = f.read()

# Find the TIPS_DATABASE array
start = content.find('export const TIPS_DATABASE: Tip[] = [')
if start == -1:
    print("Could not find TIPS_DATABASE")
    exit(1)

# Find the end of the array
end = content.find('];', start)
if end == -1:
    print("Could not find end of TIPS_DATABASE")
    exit(1)

# Extract the array content
array_content = content[start:end+2]

# Parse tips one by one
tips = []
lines = array_content.split('\n')

current_tip_lines = []
brace_count = 0
in_array = False

for i, line in enumerate(lines):
    # Check if we're in the array
    if 'TIPS_DATABASE' in line:
        in_array = True
        brace_count = 0
        continue
    
    if not in_array:
        continue
    
    # Track braces
    open_braces = line.count('{')
    close_braces = line.count('}')
    
    # Start of a new tip object
    if open_braces > 0 and brace_count == 0:
        current_tip_lines = [line]
        brace_count += open_braces - close_braces
    elif brace_count > 0:
        current_tip_lines.append(line)
        brace_count += open_braces - close_braces
        
        # End of tip object
        if brace_count == 0:
            tip_text = '\n'.join(current_tip_lines)
            
            # Extract fields
            tip_data = {}
            
            # Extract summary
            match = re.search(r'"summary":\s*"([^"]+)"', tip_text)
            if match:
                tip_data['summary'] = match.group(1)
            
            # Extract details_md (handle multiline)
            details_match = re.search(r'"details_md":\s*"((?:[^"\\]|\\.)*?)"', tip_text, re.DOTALL)
            if details_match:
                details = details_match.group(1)
                # Properly unescape
                details = details.replace('\\n', '\n')
                details = details.replace('\\"', '"')
                details = details.replace('\\t', '\t')
                details = details.replace('\\\\', '\\')
                tip_data['details_md'] = details
            
            # Extract goal_tags
            goal_match = re.search(r'"goal_tags":\s*\[([^\]]*?)\]', tip_text, re.DOTALL)
            if goal_match:
                tags_text = goal_match.group(1)
                tags = re.findall(r'"([^"]+)"', tags_text)
                tip_data['goal_tags'] = tags
            
            # Extract helps_with
            helps_match = re.search(r'"helps_with":\s*\[([^\]]*?)\]', tip_text, re.DOTALL)
            if helps_match:
                helps_text = helps_match.group(1)
                helps = re.findall(r'"([^"]+)"', helps_text)
                tip_data['helps_with'] = helps
            
            if 'summary' in tip_data:
                tips.append(tip_data)
            
            current_tip_lines = []

print(f"Extracted {len(tips)} tips")

# Create markdown
markdown = f"# Habit Helper Tips Comprehensive List\n\n"
markdown += f"Total Tips: {len(tips)}\n\n"
markdown += "---\n\n"

for i, tip in enumerate(tips, 1):
    markdown += f"## Tip {i}\n\n"
    markdown += f"**Summary:** {tip.get('summary', 'N/A')}\n\n"
    
    if 'details_md' in tip and tip['details_md']:
        markdown += f"**Details:**\n{tip['details_md']}\n\n"
    
    if 'goal_tags' in tip and tip['goal_tags']:
        markdown += f"**Goal Tags:** {', '.join(tip['goal_tags'])}\n\n"
    
    if 'helps_with' in tip and tip['helps_with']:
        markdown += f"**Helps With:** {', '.join(tip['helps_with'])}\n\n"
    
    markdown += "---\n\n"

# Write to file
with open('/Users/nataliemichelson/Projects/habithelper/TIPS_COMPREHENSIVE.md', 'w') as f:
    f.write(markdown)

print(f"Created TIPS_COMPREHENSIVE.md with {len(tips)} tips")

# Show first few as verification
for i in range(min(5, len(tips))):
    print(f"\nTip {i+1}: {tips[i].get('summary', 'N/A')[:60]}...")
    if 'goal_tags' in tips[i]:
        print(f"  Goals: {', '.join(tips[i]['goal_tags'][:3])}")
    if 'helps_with' in tips[i]:
        print(f"  Helps: {', '.join(tips[i]['helps_with'][:3])}")