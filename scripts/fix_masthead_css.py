import re

with open('index.html', 'r') as f:
    idx_content = f.read()

# Extract from .masthead { up to </style> or the end of the media queries
masthead_match = re.search(r'(\.masthead \{.*?\}\s*</style>)', idx_content, re.DOTALL)
if not masthead_match:
    # Let's extract up to the end of the last media query
    masthead_match = re.search(r'(\.masthead \{.*?\n@media[^{]*\{[^{}]*\{[^{}]*\}[^{}]*\}[^{}]*\}[^{}]*\})\n', idx_content, re.DOTALL)

# Let's do something simpler: Find `.masthead {` to `.hero {` in index.html
start_idx = idx_content.find('.masthead {')
end_idx = idx_content.find('.hero {', start_idx)
masthead_css_index = idx_content[start_idx:end_idx].strip()

with open('about.html', 'r') as f:
    abt_content = f.read()

start_abt = abt_content.find('.masthead {')
end_abt = abt_content.find('/* ── PAGE HERO ── */', start_abt)

new_abt_content = abt_content[:start_abt] + masthead_css_index + '\n\n' + abt_content[end_abt:]

with open('about.html', 'w') as f:
    f.write(new_abt_content)

print("Updated masthead CSS in about.html")
