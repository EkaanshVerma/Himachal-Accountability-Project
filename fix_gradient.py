import glob
import re

html_files = glob.glob('*.html')
exclude = ['index.html', 'himachal-accountability-landing (1).html']

for file in html_files:
    if file in exclude:
        continue
        
    with open(file, 'r') as f:
        content = f.read()
        
    # Replace the black gradient with the dark green gradient matching the theme
    content = content.replace("rgba(0, 0, 0, 0.75)", "rgba(17, 25, 20, 0.85)")
    content = content.replace("rgba(0, 0, 0, 0.7)", "rgba(17, 25, 20, 0.85)")
    
    # We also need to add transparency to elements that might be blocking the background.
    # Check if we already injected the transparent overrides
    if ".hero, .masthead" not in content:
        transparent_css = """
.hero, .page-hero, .masthead, .ann-bar, .where-it-goes, .faq-section, .section, .footer-wrapper, footer {
  background: transparent !important;
}
"""
        # Inject right before </style>
        last_style_idx = content.rfind('</style>')
        if last_style_idx != -1:
            content = content[:last_style_idx] + transparent_css + content[last_style_idx:]
            
    with open(file, 'w') as f:
        f.write(content)
        
print("Updated gradient colors and made wrapper sections transparent!")
