import glob
import re

html_files = glob.glob('*.html')

# Pages to apply the new backgrounds
bg_mapping = {
    'join.html': 'bg1.jpg',
    'contact.html': 'bg2.jpg',
    'data-methodology.html': 'bg3.jpg',
    'donate.html': 'bg4.jpg'
}

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
        
    # 1. Remove the hap_logo watermark CSS we added earlier
    content = re.sub(r'body::before\s*\{[^}]*hap_logo\.png[^}]*\}', '', content)
    
    # 2. Add the new background image if it's in our mapping
    if file in bg_mapping:
        bg_image = bg_mapping[file]
        new_css = f"""
body {{
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('{bg_image}') no-repeat center center fixed !important;
  background-size: cover !important;
}}
"""
        # Inject right before </style>
        last_style_idx = content.rfind('</style>')
        if last_style_idx != -1:
            content = content[:last_style_idx] + new_css + content[last_style_idx:]
            
    with open(file, 'w') as f:
        f.write(content)
        
print("Updated all files!")
