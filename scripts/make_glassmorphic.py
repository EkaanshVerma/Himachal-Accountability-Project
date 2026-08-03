import os
import re
import glob

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    # Change light mode background to 0.7 opacity
    content = re.sub(
        r'--header-bg:\s*rgba\(\s*236\s*,\s*238\s*,\s*223\s*,\s*0\.\d+\s*\);',
        '--header-bg: rgba(236,238,223,0.7);',
        content
    )
    # Change dark mode background to 0.7 opacity
    content = re.sub(
        r'--header-bg:\s*rgba\(\s*17\s*,\s*25\s*,\s*20\s*,\s*0\.\d+\s*\);',
        '--header-bg: rgba(17,25,20,0.7);',
        content
    )
    
    # Ensure -webkit-backdrop-filter is added alongside backdrop-filter
    # and increase blur amount for a better glass effect.
    content = re.sub(
        r'backdrop-filter:\s*blur\(\s*\d+px\s*\);?',
        'backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);',
        content
    )
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Updated all HTML files.")
