#!/usr/bin/env python3
import re
import json
import sys

def extract_all_tips(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all tip_id occurrences and extract surrounding objects
    tip_id_pattern = r'(?:"tip_id"|tip_id):\s*[\'"`]([^\'"`]+)[\'"`]'
    tip_ids = []
    
    for match in re.finditer(tip_id_pattern, content):
        tip_id = match.group(1)
        start_pos = match.start()
        
        # Find the start of this tip object by looking backwards for opening brace
        obj_start = start_pos
        while obj_start > 0 and content[obj_start] != '{':
            obj_start -= 1
        
        # Find the end of this tip object by counting braces forward
        obj_end = find_object_end(content, obj_start)
        
        if obj_end > obj_start:
            tip_obj_str = content[obj_start:obj_end+1]
            tip_data = extract_tip_fields(tip_obj_str, tip_id)
            if tip_data:
                tip_ids.append(tip_data)
            else:
                print(f"Failed to extract tip: {tip_id}", file=sys.stderr)
        else:
            print(f"Failed to find object bounds for tip: {tip_id}", file=sys.stderr)
    
    return tip_ids

def find_object_end(content, start_pos):
    """Find the end of an object starting at start_pos"""
    brace_count = 0
    in_string = False
    string_char = None
    escape_next = False
    i = start_pos
    
    while i < len(content):
        char = content[i]
        
        if escape_next:
            escape_next = False
            i += 1
            continue
            
        if char == '\\':
            escape_next = True
            i += 1
            continue
            
        if in_string:
            if char == string_char:
                in_string = False
                string_char = None
            i += 1
            continue
            
        if char in ['"', "'", '`']:
            in_string = True
            string_char = char
            i += 1
            continue
            
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                return i
                
        i += 1
    
    return -1

def extract_tip_fields(tip_string, known_tip_id):
    """Extract the required fields from a tip object string"""
    try:
        # We already know the tip_id
        tip_id = known_tip_id
        
        # Extract summary - handle both formats and quotes
        summary = None
        summary_patterns = [
            r'(?:"summary"|summary):\s*[\'"`]((?:[^\'"`\\\\]|\\\\.)*)[\'"`]',
        ]
        for pattern in summary_patterns:
            match = re.search(pattern, tip_string, re.DOTALL)
            if match:
                summary = match.group(1)
                break
        
        # Extract details_md - handle template literals and regular strings
        details_md = None
        details_patterns = [
            r'(?:"details_md"|details_md):\s*`((?:[^`\\\\]|\\\\.)*)`',  # Template literal
            r'(?:"details_md"|details_md):\s*[\'"`]((?:[^\'"`\\\\]|\\\\.)*)[\'"`]',  # Regular string
        ]
        for pattern in details_patterns:
            match = re.search(pattern, tip_string, re.DOTALL)
            if match:
                details_md = match.group(1)
                break
        
        # Extract goal_tags array
        goal_tags = []
        goal_tags_pattern = r'(?:"goal_tags"|goal_tags):\s*\[(.*?)\]'
        goal_tags_match = re.search(goal_tags_pattern, tip_string, re.DOTALL)
        if goal_tags_match:
            tags_content = goal_tags_match.group(1)
            tag_matches = re.findall(r'[\'"`]([^\'"`]*)[\'"`]', tags_content)
            goal_tags = tag_matches
        
        # Extract helps_with array
        helps_with = []
        helps_with_pattern = r'(?:"helps_with"|helps_with):\s*\[(.*?)\]'
        helps_with_match = re.search(helps_with_pattern, tip_string, re.DOTALL)
        if helps_with_match:
            helps_content = helps_with_match.group(1)
            help_matches = re.findall(r'[\'"`]([^\'"`]*)[\'"`]', helps_content)
            helps_with = help_matches
        
        if tip_id and summary:
            return {
                "tip_id": tip_id,
                "summary": summary.replace('\\\\"', '"').replace('\\\\n', '\\n') if summary else "",
                "details_md": details_md.replace('\\\\"', '"').replace('\\\\n', '\\n') if details_md else "",
                "goal_tags": goal_tags,
                "helps_with": helps_with
            }
        
    except Exception as e:
        print(f"Error extracting fields for {known_tip_id}: {e}", file=sys.stderr)
        
    return None

if __name__ == "__main__":
    try:
        tips = extract_all_tips('/Users/nataliemichelson/Projects/habithelper/data/tips.ts')
        print(json.dumps(tips, indent=2, ensure_ascii=False))
        print(f"\nTotal tips extracted: {len(tips)}", file=sys.stderr)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)