import glob

files = glob.glob('*.html')

old_str = ".hero, .page-hero, .masthead, .ann-bar, .where-it-goes, .faq-section, .section, .footer-wrapper, footer {"
new_str = ".hero, .page-hero, .where-it-goes, .faq-section, .section {"

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {file}")
