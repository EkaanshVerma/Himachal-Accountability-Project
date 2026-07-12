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
        "const FEED_ITEMS = [\n  {text:\"Sulah (Village Kharauth) — Panchayat road blocked for over 8 months due to Kanungo-level bias and revenue record discrepancies. Section 152 BNSS orders ignored.\",district:\"Kangra\",cat:\"roads\",time:\"New\"},"
    ),
    (
        '  "Kangra":        {count:64, top:"Water",      cats:{roads:18,water:28,health:8,power:6,youth:4},   neglect:68},',
        '  "Kangra":        {count:65, top:"Water",      cats:{roads:19,water:28,health:8,power:6,youth:4},   neglect:69},'
    )
]

update_file('dashboard.html', dashboard_replacements)
update_file('himachal_dashboard_v2.html', dashboard_replacements)

mla_replacements = [
    (
        """  {
    "no": 14,
    "constituency": "Sullah",
    "district": "Kangra",
    "mla": "Vipin Singh Parmar",
    "party": "BJP",
    "reports": 0,
    "rating": null,
    "voteAgain": "N/A",
    "problem": "No active civic reports verified on public ledger."
  },""",
        """  {
    "no": 14,
    "constituency": "Sullah",
    "district": "Kangra",
    "mla": "Vipin Singh Parmar",
    "party": "BJP",
    "reports": 1,
    "rating": 1,
    "voteAgain": "No",
    "problem": "No meaningful engagement from MLA's office on revenue-record failures or blocked Panchayat roads."
  },"""
    )
]

update_file('mla_perception.html', mla_replacements)
