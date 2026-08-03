import os
import glob

def inject_vercel_analytics():
    script_to_inject = """
<!-- Vercel Web Analytics -->
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
"""
    
    html_files = glob.glob('*.html')
    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if '/_vercel/insights/script.js' in content:
            print(f"Skipping {file}, already has Vercel Analytics.")
            continue
            
        # Find </head> and inject right before it
        if '</head>' in content:
            content = content.replace('</head>', script_to_inject + '</head>')
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Injected into {file}")
        else:
            print(f"Could not find </head> in {file}")

if __name__ == "__main__":
    inject_vercel_analytics()
