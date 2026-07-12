import os
import glob
import re

css_rule = """
body::before {
  content: "";
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85vw;
  height: 85vh;
  max-width: 1200px;
  max-height: 1200px;
  background-image: url('hap_logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.08;
  z-index: -1;
  pointer-events: none;
}
"""

html_files = glob.glob('*.html')
exclude = ['index.html', 'himachal-accountability-landing (1).html']

for file in html_files:
    if file in exclude:
        continue
        
    with open(file, 'r') as f:
        content = f.read()
        
    if "himachal_landing_bg.jpg" in content:
        continue
        
    # If the file already has the old rule, replace it
    if "body::before {" in content and "hap_logo.png" in content:
        # Match body::before { ... hap_logo.png ... }
        content = re.sub(r'body::before\s*\{[^}]*hap_logo\.png[^}]*\}', css_rule.strip(), content)
    else:
        # Find the last </style> tag
        last_style_idx = content.rfind('</style>')
        if last_style_idx != -1:
            content = content[:last_style_idx] + css_rule + content[last_style_idx:]
            
    with open(file, 'w') as f:
        f.write(content)
        
print("Updated files!")
