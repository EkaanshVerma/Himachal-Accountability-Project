import re

files_to_update = ['about.html', 'index.html']
ann_bar_html = """
<div class="ann-bar" style="background: #D8E4D0; color: #1E2A22; font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; letter-spacing: 0.05em; padding: 8px 20px; text-align: center;">
  <b style="font-weight: 600; color: #C87A30;">Independent civic record.</b> &nbsp;Not affiliated with any political party or government body. &nbsp;Data from community field reports.
</div>
"""

for fname in files_to_update:
    with open(fname, 'r') as f:
        content = f.read()
        
    if 'class="ann-bar"' not in content:
        # Add after <body>
        content = re.sub(r'(<body[^>]*>)', r'\1\n' + ann_bar_html, content)
        with open(fname, 'w') as f:
            f.write(content)

print("Added ann-bar to about.html and index.html")
