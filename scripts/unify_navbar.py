#!/usr/bin/env python3
"""
Himachal Accountability Project (HAP) — Universal Navbar Unifier
Propagates the canonical Universal Masthead & Announcement Bar (matching index.html)
across all HTML pages without altering page-specific body/hero UI.
"""

import os
import glob
import re

UNIVERSAL_NAVBAR_TEMPLATE = """<div class="ann-bar" style="background: #D8E4D0; color: #1E2A22; font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; letter-spacing: 0.05em; padding: 8px 20px; text-align: center;">
  <b style="font-weight: 600; color: #C87A30;">Independent civic record.</b> &nbsp;Not affiliated with any political party or government body. &nbsp;Data from community field reports.
</div>

<header class="masthead">
  <div class="masthead-inner">
    <div class="masthead-left">
      <a href="index.html" class="brand">
        <img src="images/hap_logo.png" alt="HAP Logo" class="brand-logo">
        <span class="brand-text">
          Himachal Accountability Project
          <small>Public Ledger &middot; Himachal Pradesh</small>
        </span>
      </a>
    </div>
    <div class="masthead-right">
      <nav class="masthead-links" aria-label="Main Navigation">
        <a class="btn-ghost {active_home}" id="nav-home" href="index.html">Home</a>
        <a class="btn-ghost {active_about}" id="nav-about" href="about.html">About Us</a>
        <a class="btn-ghost {active_dashboard}" id="nav-dashboard" href="dashboard.html">Dashboard</a>
        <a class="btn-ghost {active_compare}" id="nav-compare" href="compare.html">Compare</a>
        <a class="btn-ghost {active_mlas}" id="nav-mlas" href="mlas.html">Find MLA</a>
        <a class="btn-ghost {active_join}" id="nav-join" href="join.html">Join Us</a>
        <a class="btn-ghost {active_contact}" id="nav-contact" href="contact.html">Contact Us</a>
        <a class="btn-ghost {active_ask}" id="nav-ask" href="ask.html" style="color: #E07A5F !important;">पूछें · Ask</a>
      </nav>
      
      <div class="mobile-dropdown" id="mobile-menu" style="display: none;">
        <a class="dropdown-link {active_home}" href="index.html">Home</a>
        <a class="dropdown-link {active_about}" href="about.html">About Us</a>
        <a class="dropdown-link {active_dashboard}" href="dashboard.html">Dashboard</a>
        <a class="dropdown-link {active_compare}" href="compare.html">Compare Districts</a>
        <a class="dropdown-link {active_mlas}" href="mlas.html">Find Your MLA</a>
        <a class="dropdown-link {active_join}" href="join.html">Join Us</a>
        <a class="dropdown-link {active_contact}" href="contact.html">Contact Us</a>
        <a class="dropdown-link {active_ask}" href="ask.html">पूछें · Ask</a>
        <a class="dropdown-link {active_donate}" href="donate.html">Support Us</a>
      </div>

      <a class="btn-ghost {active_donate}" id="nav-donate" href="donate.html">Support Us</a>
      <a class="btn-primary" href="report-issue.html">&#x270E;&nbsp; Report Issue</a>
      
      <button class="menu-toggle-btn" id="menu-toggle" aria-label="Toggle navigation menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" style="width:18px; height:18px; display:block;"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>

      <button class="theme-toggle-btn" id="theme-toggle" aria-label="Toggle theme">
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
      </button>
    </div>
  </div>
</header>"""

def get_navbar_for_page(filename):
    basename = os.path.basename(filename)
    active_map = {
        'index.html': 'home',
        'about.html': 'about',
        'dashboard.html': 'dashboard',
        'compare.html': 'compare',
        'mlas.html': 'mlas',
        'join.html': 'join',
        'contact.html': 'contact',
        'ask.html': 'ask',
        'donate.html': 'donate'
    }
    
    district_slugs = ['bilaspur.html', 'chamba.html', 'hamirpur.html', 'kangra.html',
                      'kinnaur.html', 'kullu.html', 'lahaul-spiti.html', 'mandi.html',
                      'shimla.html', 'sirmaur.html', 'solan.html', 'una.html']
    if basename in district_slugs:
        active = 'dashboard'
    else:
        active = active_map.get(basename, '')
        
    replacements = {
        'active_home': 'active' if active == 'home' else '',
        'active_about': 'active' if active == 'about' else '',
        'active_dashboard': 'active' if active == 'dashboard' else '',
        'active_compare': 'active' if active == 'compare' else '',
        'active_mlas': 'active' if active == 'mlas' else '',
        'active_join': 'active' if active == 'join' else '',
        'active_contact': 'active' if active == 'contact' else '',
        'active_ask': 'active' if active == 'ask' else '',
        'active_donate': 'active' if active == 'donate' else ''
    }
    
    return UNIVERSAL_NAVBAR_TEMPLATE.format(**replacements)

def find_balanced_div_end(html, start_idx):
    """Find matching closing </div> for a <div ...> starting at start_idx."""
    depth = 0
    pos = start_idx
    for m in re.finditer(r'<(/?)div\b[^>]*>', html[start_idx:], flags=re.I):
        if m.group(1) == '/':
            depth -= 1
            if depth == 0:
                return start_idx + m.end()
        else:
            depth += 1
    return -1

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Ensure universal-navbar.css is linked right before </head>
    if 'css/universal-navbar.css' not in html:
        if '</head>' in html:
            html = html.replace('</head>', '  <link rel="stylesheet" href="css/universal-navbar.css">\n</head>', 1)

    navbar_html = get_navbar_for_page(filepath)

    # Remove all existing ann-bars before masthead
    html = re.sub(r'(?:<!--[^>]*-->\s*)*<div\b[^>]*class=["\']ann-bar["\'][^>]*>.*?</div>\s*', '', html, flags=re.S | re.I)

    # Replace existing <header class="masthead">...</header> or balanced <div class="masthead">...</div>
    header_match = re.search(r'<header\b[^>]*class=["\'][^"\']*masthead[^"\']*["\'][^>]*>.*?</header>', html, flags=re.S | re.I)
    if header_match:
        html = html[:header_match.start()] + navbar_html + html[header_match.end():]
    else:
        div_match = re.search(r'<div\b[^>]*class=["\'][^"\']*masthead[^"\']*["\'][^>]*>', html, flags=re.I)
        if div_match:
            end_idx = find_balanced_div_end(html, div_match.start())
            if end_idx != -1:
                html = html[:div_match.start()] + navbar_html + html[end_idx:]
        else:
            body_match = re.search(r'<body\b[^>]*>', html, flags=re.I)
            if body_match:
                pos = body_match.end()
                html = html[:pos] + '\n\n' + navbar_html + '\n' + html[pos:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'Navbar unified: {filepath}')

def main():
    files = sorted(glob.glob('public/*.html'))
    for f in files:
        if 'himachal-accountability-landing (1).html' in f:
            continue
        process_file(f)

if __name__ == '__main__':
    main()
