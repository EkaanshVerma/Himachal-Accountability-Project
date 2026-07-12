import os

def update_file(filename, replacements):
    if not os.path.exists(filename):
        print(f"Skipping {filename} - not found.")
        return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
        else:
            print(f"Warning: Could not find target text in {filename}")
            
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")

dashboard_replacements = [
    (
        "const FEED_ITEMS = [",
        "const FEED_ITEMS = [\n  {text:\"Shimla (IGMC Eye OPD) — Token system not working. Doctors unresponsive. Head of department deflected complaint.\",district:\"Shimla\",cat:\"health\",time:\"New\"},"
    ),
    (
        '  "Shimla":        {count:87, top:"Roads",      cats:{roads:35,water:20,health:15,power:10,youth:7},  neglect:72},',
        '  "Shimla":        {count:88, top:"Roads",      cats:{roads:35,water:20,health:16,power:10,youth:7},  neglect:73},'
    )
]

update_file('dashboard.html', dashboard_replacements)
update_file('himachal_dashboard_v2.html', dashboard_replacements)

mla_replacements = [
    (
        """  {
    "no": 63,
    "constituency": "Shimla",
    "district": "Shimla",
    "mla": "Harish Janartha",
    "party": "INC",
    "reports": 0,
    "rating": null,
    "voteAgain": "N/A",
    "problem": "No active civic reports verified on public ledger."
  },""",
        """  {
    "no": 63,
    "constituency": "Shimla",
    "district": "Shimla",
    "mla": "Harish Janartha",
    "party": "INC",
    "reports": 1,
    "rating": 1,
    "voteAgain": "No",
    "problem": "Token system broken at IGMC Eye OPD. Staff and department head unresponsive to citizen complaints."
  },"""
    )
]

update_file('mla_perception.html', mla_replacements)
