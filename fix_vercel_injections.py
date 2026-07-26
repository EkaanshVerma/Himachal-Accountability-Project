import os
import glob
import re

def fix_vercel_injections():
    speed_pattern = re.compile(r'<!-- Vercel Speed Insights -->\s*<script>\s*window\.si = window\.si \|\| function \(\) \{ \(window\.siq = window\.siq \|\| \[\]\)\.push\(arguments\); \};\s*</script>\s*<script defer src="/_vercel/speed-insights/script\.js"></script>\s*', re.MULTILINE)
    
    analytics_pattern = re.compile(r'<!-- Vercel Web Analytics -->\s*<script>\s*window\.va = window\.va \|\| function \(\) \{ \(window\.vaq = window\.vaq \|\| \[\]\)\.push\(arguments\); \};\s*</script>\s*<script defer src="/_vercel/insights/script\.js"></script>\s*', re.MULTILINE)

    script_to_inject = """
<!-- Vercel Speed Insights -->
<script>
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
</script>
<script defer src="/_vercel/speed-insights/script.js"></script>

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
            
        # Strip all occurrences of the scripts
        content = speed_pattern.sub('', content)
        content = analytics_pattern.sub('', content)
        
        # Inject ONLY at the first </head> occurrence
        # We can split by '</head>' and join the first two parts with the script, then join the rest with '</head>'
        parts = content.split('</head>')
        if len(parts) > 1:
            # We want to replace only the first occurrence
            content = parts[0] + script_to_inject + '</head>' + '</head>'.join(parts[1:])
            
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed {file}")
        else:
            print(f"Could not find </head> in {file}")

if __name__ == "__main__":
    fix_vercel_injections()
