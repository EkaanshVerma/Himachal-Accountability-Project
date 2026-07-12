import glob

html_files = glob.glob('*.html')

# Pages to apply the new backgrounds
bg_mapping = {
    'mla_perception.html': 'bg6.jpg',
    'report-issue.html': 'bg7.jpg',
    'dashboard.html': 'bg8.jpg',
    'himachal_dashboard_v2.html': 'bg8.jpg'
}

for file in html_files:
    if file not in bg_mapping:
        continue
        
    with open(file, 'r') as f:
        content = f.read()
    
    bg_image = bg_mapping[file]
    new_css = f"""
body {{
  background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('{bg_image}') no-repeat center center fixed !important;
  background-size: cover !important;
}}
"""
    # Inject right before </style>
    last_style_idx = content.rfind('</style>')
    if last_style_idx != -1:
        content = content[:last_style_idx] + new_css + content[last_style_idx:]
            
    with open(file, 'w') as f:
        f.write(content)
        
print("Updated remaining pages!")
