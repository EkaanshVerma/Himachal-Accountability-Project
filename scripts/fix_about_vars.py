import re

with open('about.html', 'r') as f:
    content = f.read()

# Add the missing CSS variables to :root
vars_to_add = """
  --maxw: 1180px;
  --pad: clamp(24px, 6vw, 64px);
"""

if '--maxw' not in content:
    content = content.replace(':root{', ':root{\n' + vars_to_add)
    
with open('about.html', 'w') as f:
    f.write(content)

print("Added CSS variables to about.html")
