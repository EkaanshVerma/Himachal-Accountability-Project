import re

with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

with open('about.html', 'r', encoding='utf-8') as f:
    about_content = f.read()

# Extract footer from index.html
footer_match = re.search(r'<footer>.*?</footer>', index_content, re.DOTALL)
if footer_match:
    index_footer = footer_match.group(0)
    
    # Replace footer in about.html
    new_about_content = re.sub(r'<footer>.*?</footer>', index_footer, about_content, flags=re.DOTALL)
    
    with open('about.html', 'w', encoding='utf-8') as f:
        f.write(new_about_content)
    print("Successfully replaced about.html footer with index.html footer.")
else:
    print("Could not find footer in index.html")
