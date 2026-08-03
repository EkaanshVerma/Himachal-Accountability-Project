with open('index.html', 'r') as f:
    idx_lines = f.readlines()

# Extract from .masthead { (line 730) up to </style>
masthead_css_lines = []
in_masthead = False
for line in idx_lines:
    if line.startswith('.masthead {'):
        in_masthead = True
    if in_masthead:
        if '</style>' in line:
            break
        masthead_css_lines.append(line)

masthead_css_index = "".join(masthead_css_lines).strip()

with open('about.html', 'r') as f:
    abt_content = f.read()

start_abt = abt_content.find('.masthead {')
end_abt = abt_content.find('/* ── PAGE HERO ── */')

if start_abt != -1 and end_abt != -1:
    new_abt_content = abt_content[:start_abt] + masthead_css_index + '\n\n' + abt_content[end_abt:]
    with open('about.html', 'w') as f:
        f.write(new_abt_content)
    print("Replaced masthead CSS successfully.")
else:
    print("Could not find start/end markers in about.html")
