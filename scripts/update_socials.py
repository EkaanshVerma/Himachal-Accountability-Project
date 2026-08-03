import os
import glob

def update_social_links():
    html_files = glob.glob('*.html')
    
    linkedin_old = 'href="#" aria-label="LinkedIn"'
    linkedin_new = 'href="https://www.linkedin.com/company/thehap" aria-label="LinkedIn" target="_blank"'
    
    instagram_old = 'href="#" aria-label="Instagram"'
    instagram_new = 'href="https://www.instagram.com/thehapofficial/" aria-label="Instagram" target="_blank"'
    
    twitter_old = 'href="#" aria-label="X (Twitter)"'
    twitter_new = 'href="https://x.com/TheHAPofficial" aria-label="X (Twitter)" target="_blank"'
    
    for filename in html_files:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            
        modified = False
        if linkedin_old in content:
            content = content.replace(linkedin_old, linkedin_new)
            modified = True
            
        if instagram_old in content:
            content = content.replace(instagram_old, instagram_new)
            modified = True
            
        if twitter_old in content:
            content = content.replace(twitter_old, twitter_new)
            modified = True
            
        if modified:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated social links in {filename}")

if __name__ == '__main__':
    update_social_links()
