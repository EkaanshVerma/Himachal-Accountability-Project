import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('public/images', exist_ok=True)

# Districts metadata
districts = [
    {"name": "Lahaul & Spiti", "slug": "lahaul-spiti", "score": "78.4", "rank": "1", "neglect": "50%", "delay": "0–2 Months", "color": "#2E7D32"},
    {"name": "Kinnaur", "slug": "kinnaur", "score": "71.2", "rank": "2", "neglect": "55%", "delay": "0–2 Months", "color": "#2E7D32"},
    {"name": "Kullu", "slug": "kullu", "score": "67.5", "rank": "3", "neglect": "58%", "delay": "3–6 Months", "color": "#D97706"},
    {"name": "Chamba", "slug": "chamba", "score": "63.8", "rank": "4", "neglect": "61%", "delay": "3–6 Months", "color": "#D97706"},
    {"name": "Hamirpur", "slug": "hamirpur", "score": "61.2", "rank": "5", "neglect": "64%", "delay": "3–6 Months", "color": "#D97706"},
    {"name": "Mandi", "slug": "mandi", "score": "58.6", "rank": "6", "neglect": "63%", "delay": "3–6 Months", "color": "#D97706"},
    {"name": "Bilaspur", "slug": "bilaspur", "score": "56.4", "rank": "7", "neglect": "68%", "delay": "3–6 Months", "color": "#D97706"},
    {"name": "Kangra", "slug": "kangra", "score": "53.8", "rank": "8", "neglect": "72%", "delay": "7–11 Months", "color": "#C2410C"},
    {"name": "Sirmaur", "slug": "sirmaur", "score": "51.0", "rank": "9", "neglect": "74%", "delay": "7–11 Months", "color": "#C2410C"},
    {"name": "Solan", "slug": "solan", "score": "48.5", "rank": "10", "neglect": "76%", "delay": "7–11 Months", "color": "#C2410C"},
    {"name": "Shimla", "slug": "shimla", "score": "45.2", "rank": "11", "neglect": "79%", "delay": "12+ Months", "color": "#991B1B"},
    {"name": "Una", "slug": "una", "score": "41.8", "rank": "12", "neglect": "82%", "delay": "12+ Months", "color": "#991B1B"}
]

# Try to find a standard truetype font, or fallback to default
try:
    font_large = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 64)
    font_sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 32)
    font_eyebrow = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 20)
    font_num = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia Bold.ttf", 96)
except Exception:
    font_large = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_eyebrow = ImageFont.load_default()
    font_num = ImageFont.load_default()

def draw_card(title, score_text, rank_text, neglect_text, delay_text, delay_color, out_path):
    img = Image.new("RGB", (1200, 630), "#111914")
    draw = ImageDraw.Draw(img)

    # Decorative border
    draw.rectangle([(24, 24), (1176, 606)], outline="#2A382E", width=2)
    draw.rectangle([(28, 28), (1172, 602)], outline="#1E2A22", width=1)

    # Accent indicator bar at top
    draw.rectangle([(24, 24), (1176, 32)], fill=delay_color)

    # Eyebrow
    draw.text((70, 70), "HIMACHAL ACCOUNTABILITY PROJECT · INDEPENDENT PUBLIC RECORD", font=font_eyebrow, fill="#C87A30")

    # Title
    draw.text((70, 115), title, font=font_large, fill="#EDF3EC")

    # Subtitle
    draw.text((70, 195), "Civic grievance tracking, infrastructure neglect rates, and public ledger metrics.", font=font_sub, fill="#8E9F93")

    # Divider
    draw.line([(70, 260), (1130, 260)], fill="#2A382E", width=2)

    # Stat 1: Score
    draw.text((70, 290), "COMPOSITE SCORE", font=font_eyebrow, fill="#8E9F93")
    draw.text((70, 330), score_text, font=font_num, fill="#EDF3EC")

    # Stat 2: Rank
    draw.text((450, 290), "STATE RANK", font=font_eyebrow, fill="#8E9F93")
    draw.text((450, 330), rank_text, font=font_num, fill=delay_color)

    # Stat 3: Delay
    draw.text((800, 290), "MEDIAN DELAY", font=font_eyebrow, fill="#8E9F93")
    draw.text((800, 340), delay_text, font=font_large, fill="#EDF3EC")
    draw.text((800, 420), f"Unresolved: {neglect_text}", font=font_sub, fill="#C87A30")

    # Footer banner
    draw.rectangle([(70, 520), (1130, 560)], fill="#18221B")
    draw.text((85, 530), "Open Data · Creative Commons CC BY-SA 4.0 · himachalaccountability.org", font=font_eyebrow, fill="#8E9F93")

    img.save(out_path, format="PNG")
    print(f"Generated OG: {out_path}")

# 1. Homepage OG
draw_card(
    title="Himachal Civic Accountability Ledger",
    score_text="462",
    rank_text="12/12",
    neglect_text="69%",
    delay_text="5 Months",
    delay_color="#C87A30",
    out_path="public/images/og-home.png"
)

# 2. 12 District OGs
for d in districts:
    draw_card(
        title=f"{d['name']} District Scorecard",
        score_text=d['score'],
        rank_text=f"#{d['rank']}",
        neglect_text=d['neglect'],
        delay_text=d['delay'],
        delay_color=d['color'],
        out_path=f"public/images/og-{d['slug']}.png"
    )

print("All 13 OG images successfully generated.")

