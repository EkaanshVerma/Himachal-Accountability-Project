import re

with open('about.html', 'r') as f:
    content = f.read()

# Make the wrapper sections transparent
transparent_css = """
.page-hero, .mission-strip, .team-section, .values-section, .join-section, footer {
  background: transparent !important;
  border: none !important;
}
</style>
"""

content = content.replace('</style>', transparent_css)

# Also force dark mode so the cards are dark and text is light, matching the dark background
content = content.replace('<html lang="en">', '<html lang="en" data-theme="dark">')
content = content.replace('<html lang="en" data-theme="light">', '<html lang="en" data-theme="dark">')

with open('about.html', 'w') as f:
    f.write(content)

print("Updated about.html for transparency and dark mode.")
