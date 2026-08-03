import os

files = ['donate.html', 'dashboard.html', 'himachal_dashboard_v2.html', 'report-issue.html']

for file in files:
    if os.path.exists(file):
        with open(file, 'r') as f:
            content = f.read()
            
        content = content.replace("background-image: url('himachal_landing_bg.jpg');", "background-image: none; /* removed old bg */")
        
        with open(file, 'w') as f:
            f.write(content)
            
print("Removed old conflicting backgrounds from pages!")
