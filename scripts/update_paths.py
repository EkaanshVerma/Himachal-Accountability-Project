import os
import glob
import re

images = [
    'bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg',
    'bg5.jpg', 'bg6.jpg', 'bg7.jpg', 'bg8.jpg',
    'ekaansh-cutout.png', 'ekaansh.jpg',
    'hap_logo.png', 'himachal_landing_bg.jpg',
    'verma_digital_logo.png'
]

html_files = glob.glob('public/*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace quotes + image name with quotes + images/image name
    # e.g. "bg8.jpg" -> "images/bg8.jpg"
    # url('bg8.jpg') -> url('images/bg8.jpg')
    for img in images:
        # Match 'img' or "img"
        content = re.sub(r'([\'"])(' + re.escape(img) + r')\1', r'\1images/\2\1', content)
        
        # Match without quotes in CSS url()
        content = re.sub(r'url\(\s*(' + re.escape(img) + r')\s*\)', r'url(images/\1)', content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated image paths in HTML files.")
