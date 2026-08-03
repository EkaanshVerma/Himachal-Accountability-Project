import os
import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find blocks that start with .masthead (or .masthead-links.active) and replace var(--bg2)
    def replacer(match):
        block = match.group(0)
        # Replace var(--bg2) with var(--header-bg) and add backdrop filter
        if "background: var(--bg2);" in block:
            block = block.replace("background: var(--bg2);", "background: var(--header-bg);\n  backdrop-filter: blur(16px);\n  -webkit-backdrop-filter: blur(16px);")
        
        if "background: var(--bg2, var(--cream, #F3F1E6)) !important;" in block:
            block = block.replace("background: var(--bg2, var(--cream, #F3F1E6)) !important;", "background: var(--header-bg) !important;\n    backdrop-filter: blur(16px) !important;\n    -webkit-backdrop-filter: blur(16px) !important;")
            
        return block

    # Match anything starting with .masthead { ... } or .masthead-links.active { ... }
    # Using a simple regex to capture blocks that have masthead in the selector
    new_content = re.sub(r'(\.masthead[^\{]*\{[^}]+\})', replacer, content)

    with open(filepath, 'w') as f:
        f.write(new_content)

print("Fixed var(--bg2) in masthead across all HTML files.")
