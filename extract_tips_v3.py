#!/usr/bin/env python3
import re
import json
import sys

def extract_tips_from_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the TIPS_DATABASE array
    start_pattern = r'export const TIPS_DATABASE: Tip\[\] = \['
    start_match = re.search(start_pattern, content)
    if not start_match:
        raise ValueError("Could not find TIPS_DATABASE start")
    
    start_pos = start_match.end()
    
    # Find the end of the array
    end_pattern = r'^\];'
    end_match = re.search(end_pattern, content[start_pos:], re.MULTILINE)
    if not end_match:
        raise ValueError("Could not find TIPS_DATABASE end")
    
    array_content = content[start_pos:start_pos + end_match.start()]
    
    # Split by top-level objects more carefully
    tips = []
    objects = split_top_level_objects(array_content)
    
    print(f"Found {len(objects)} top-level objects", file=sys.stderr)
    
    for i, obj_str in enumerate(objects):
        tip_data = extract_tip_fields(obj_str)
        if tip_data:
            tips.append(tip_data)
        else:
            print(f"Failed to parse object {i}", file=sys.stderr)
    
    return tips

def split_top_level_objects(content):
    """Split content into individual top-level objects"""
    objects = []
    current_obj = ""
    brace_depth = 0
    in_string = False
    string_char = None
    escape_next = False
    i = 0
    
    while i < len(content):
        char = content[i]
        
        if escape_next:
            current_obj += char
            escape_next = False
            i += 1
            continue
            
        if char == '\\':
            current_obj += char
            escape_next = True
            i += 1
            continue
            
        if in_string:
            current_obj += char
            if char == string_char:
                in_string = False
                string_char = None
            i += 1
            continue
            
        if char in ['"', "'"] or (char == '`' and (i == 0 or content[i-1] not in ['\\'])):
            in_string = True
            string_char = char
            current_obj += char
            i += 1
            continue
            
        if char == '{':
            if brace_depth == 0:
                current_obj = '{'
            else:
                current_obj += char
            brace_depth += 1
        elif char == '}':
            brace_depth -= 1
            current_obj += char
            
            if brace_depth == 0:
                # End of top-level object
                objects.append(current_obj.strip())
                current_obj = ""
        else:
            if brace_depth > 0:  # Only collect when inside an object
                current_obj += char
                
        i += 1
    
    return objects

def extract_tip_fields(tip_string):
    """Extract the required fields from a tip object string"""
    try:
        # Extract tip_id - handle both quoted and unquoted keys with various quote types
        tip_id_pattern = r'(?:"tip_id"|tip_id):\s*[\'"`]([^\'"`]+)[\'"`]'
        tip_id_match = re.search(tip_id_pattern, tip_string)
        tip_id = tip_id_match.group(1) if tip_id_match else None
        
        # Extract summary - handle both quoted and unquoted keys, and different string delimiters
        summary_pattern = r'(?:"summary"|summary):\s*[\'"`]((?:[^\'"`\\\\]|\\\\.)*)[\'"`]'
        summary_match = re.search(summary_pattern, tip_string)
        summary = summary_match.group(1) if summary_match else None
        
        # Extract details_md - handle template literals and regular strings
        details_md = None
        # Try template literal first
        details_pattern = r'(?:"details_md"|details_md):\s*`((?:[^`\\\\]|\\\\.)*)`'
        details_match = re.search(details_pattern, tip_string, re.DOTALL)
        if details_match:
            details_md = details_match.group(1)
        else:
            # Try regular string
            details_pattern = r'(?:"details_md"|details_md):\s*[\'"`]((?:[^\'"`\\\\]|\\\\.)*)[\'"`]'
            details_match = re.search(details_pattern, tip_string, re.DOTALL)
            if details_match:
                details_md = details_match.group(1)
        
        # Extract goal_tags array
        goal_tags_pattern = r'(?:"goal_tags"|goal_tags):\s*\[(.*?)\]'
        goal_tags_match = re.search(goal_tags_pattern, tip_string, re.DOTALL)
        goal_tags = []
        if goal_tags_match:
            tags_content = goal_tags_match.group(1)
            # Extract individual tags with different quote types
            tag_matches = re.findall(r'[\'"`]([^\'"`]*)[\'"`]', tags_content)
            goal_tags = tag_matches
        
        # Extract helps_with array
        helps_with_pattern = r'(?:"helps_with"|helps_with):\s*\[(.*?)\]'
        helps_with_match = re.search(helps_with_pattern, tip_string, re.DOTALL)
        helps_with = []
        if helps_with_match:
            helps_content = helps_with_match.group(1)
            # Extract individual items with different quote types
            help_matches = re.findall(r'[\'"`]([^\'"`]*)[\'"`]', helps_content)
            helps_with = help_matches
        
        if tip_id and summary:  # Only include if we have the essential fields
            return {
                "tip_id": tip_id,
                "summary": summary.replace('\\\\"', '"').replace('\\\\n', '\\n'),
                "details_md": details_md.replace('\\\\"', '"').replace('\\\\n', '\\n') if details_md else "",
                "goal_tags": goal_tags,
                "helps_with": helps_with
            }
        
    except Exception as e:
        print(f"Error extracting fields: {e}", file=sys.stderr)
        
    return None

if __name__ == "__main__":
    try:
        tips = extract_tips_from_file('/Users/nataliemichelson/Projects/habithelper/data/tips.ts')
        print(json.dumps(tips, indent=2, ensure_ascii=False))
        print(f"\nTotal tips extracted: {len(tips)}", file=sys.stderr)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)