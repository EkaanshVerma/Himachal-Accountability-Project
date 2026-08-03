import re
import glob

# 1. Update about.html CSS
with open('about.html', 'r') as f:
    content = f.read()

# CSS Variables block from dashboard.html
new_vars = """  /* Landing Page Color System - Light (default) */
  --paper: #ECEEDF;
  --paper-deep: #DFE2CE;
  --paper-line: rgba(30,42,34,0.14);
  --ink: #1E2A22;
  --ink-soft: rgba(30,42,34,0.68);
  --ink-faint: rgba(30,42,34,0.42);
  --slate: #283740;
  --slate-deep: #1F2B32;
  --cream: #F3F1E6;
  --cream-soft: rgba(243,241,230,0.72);
  --cream-faint: rgba(243,241,230,0.46);
  --amber: #D98C3D;
  --amber-deep: #B96B27;
  --stamp: #A23B2E;
  --sage: #5C7A52;
  --line: #8FA083;

  --bg: var(--paper);
  --bg2: var(--cream);
  --bg3: var(--paper-deep);
  --bg4: rgba(30, 42, 34, 0.06);
  --bg5: rgba(30, 42, 34, 0.12);
  
  --border: var(--paper-line);
  --border2: rgba(30, 42, 34, 0.22);
  --border3: var(--ink);
  
  --text: var(--ink);
  --text2: var(--ink-soft);
  --text3: var(--ink-faint);
  
  --transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

[data-theme="dark"] {
  /* Landing Page Color System - Dark */
  --paper: #111914;
  --paper-deep: #182018;
  --paper-line: rgba(180,200,170,0.12);
  --ink: #D8E4D0;
  --ink-soft: rgba(216,228,208,0.68);
  --ink-faint: rgba(216,228,208,0.38);
  --slate: #1A2830;
  --slate-deep: #111D24;
  --cream: #1E2A22;
  --cream-soft: rgba(30,42,34,0.80);
  --cream-faint: rgba(30,42,34,0.50);
  --amber: #E09B50;
  --amber-deep: #C87A30;
  --stamp: #C4584A;
  --sage: #7A9E6E;
  --line: #5C7A52;

  --bg: var(--paper);
  --bg2: var(--cream);
  --bg3: var(--paper-deep);
  --bg4: rgba(216, 228, 208, 0.08);
  --bg5: rgba(216, 228, 208, 0.15);
  
  --border: var(--paper-line);
  --border2: rgba(216, 228, 208, 0.22);
  --border3: var(--ink);
  
  --text: var(--ink);
  --text2: var(--ink-soft);
  --text3: var(--ink-faint);
}

body {
  background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('bg8.jpg') no-repeat center center fixed !important;
  background-size: cover !important;
  color: var(--text);
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 16px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--text); text-decoration: none; }

/* ─── MASTHEAD CSS ─── */
.masthead {
  padding: 16px var(--pad, 24px);
  border-bottom: 1px solid var(--border);
  background: var(--bg2);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: var(--transition);
}
.masthead-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  position: relative;
}
.masthead-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
}
.brand-logo {
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--ink);
  object-fit: cover;
  flex-shrink: 0;
}
.brand-text { display: flex; flex-direction: column; line-height: 1.15; }
.brand-text small {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 400;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  color: var(--text3);
  text-transform: uppercase;
}
.masthead-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
}
.masthead-links {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: space-evenly;
}
.btn-ghost {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 14px;
  color: var(--text2);
  transition: var(--transition);
  border: 1px solid transparent;
  border-radius: 4px;
}
.btn-ghost:hover {
  color: var(--text);
}
.btn-ghost.active {
  color: var(--text);
  border-color: var(--border);
  background: var(--bg4);
}
.btn-primary {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 16px;
  background: var(--ink);
  color: var(--paper);
  border: 1px solid var(--ink);
  border-radius: 4px;
  transition: var(--transition);
}
.btn-primary:hover {
  background: var(--slate);
}
.theme-toggle-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text3);
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}
.theme-toggle-btn:hover {
  background: var(--bg4);
  color: var(--text);
}
.menu-toggle-btn {
  display: none;
  background: none; border: 1px solid var(--border); border-radius: 4px;
  color: var(--text3);
  width: 36px; height: 36px;
  align-items: center; justify-content: center; cursor: pointer;
}
.mobile-dropdown { display: none; }
@media(max-width: 980px) {
  .masthead-links { display: none; }
  .menu-toggle-btn { display: flex; }
  .mobile-dropdown.open {
    display: flex; flex-direction: column; width: 100%;
    border-top: 1px solid var(--border); margin-top: 12px; padding-top: 12px; gap: 8px;
  }
  .dropdown-link {
    font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem; font-weight: 600; text-transform: uppercase;
    padding: 10px; color: var(--text2); border-radius: 4px;
  }
  .dropdown-link:hover, .dropdown-link.active {
    background: var(--bg4); color: var(--text);
  }
}
"""

content = re.sub(r'--paper:#ECEEDF;.*?a\{color:var\(--ink\);text-decoration:none\}', new_vars, content, flags=re.DOTALL)
# Now remove the old site-header CSS and replace with nothing because it's in new_vars
content = re.sub(r'/\* ── HEADER ── \*/.*?@media\(max-width:640px\)\{\.hdr-nav\{display:none\}\}', '', content, flags=re.DOTALL)

masthead_html = """
<div class="masthead">
  <div class="masthead-inner">
    <div class="masthead-left">
      <a href="index.html" class="brand">
        <img src="hap_logo.png" alt="HAP Logo" class="brand-logo">
        <span class="brand-text">
          Himachal Accountability Project
          <small>Public Ledger &middot; Himachal Pradesh</small>
        </span>
      </a>
    </div>
    <div class="masthead-right">
      <div class="masthead-links">
        <a class="btn-ghost" id="nav-home" href="index.html">Home</a>
        <a class="btn-ghost active" id="nav-about" href="about.html">About Us</a>
        <a class="btn-ghost" id="nav-dashboard" href="dashboard.html">Dashboard</a>
        <a class="btn-ghost" id="nav-perception" href="mla_perception.html">MLA Perception</a>
        <a class="btn-ghost" id="nav-join" href="join.html">Join Us</a>
        <a class="btn-ghost" id="nav-contact" href="contact.html">Contact Us</a>
      </div>
      
      <div class="mobile-dropdown" id="mobile-menu" style="display: none;">
        <a class="dropdown-link" href="index.html">Home</a>
        <a class="dropdown-link active" href="about.html">About Us</a>
        <a class="dropdown-link" href="dashboard.html">Dashboard</a>
        <a class="dropdown-link" href="mla_perception.html">MLA Perception</a>
        <a class="dropdown-link" href="join.html">Join Us</a>
        <a class="dropdown-link" href="contact.html">Contact Us</a>
      </div>

      <a class="btn-ghost" id="nav-donate" href="donate.html">Support Us</a>
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
</div>
"""
content = re.sub(r'<header class="site-header">.*?</header>', masthead_html, content, flags=re.DOTALL)

with open('about.html', 'w') as f:
    f.write(content)

# Now let's update ALL other HTML files to include About Us right after Home
import glob
html_files = glob.glob('*.html')

for f in html_files:
    if f == 'about.html': continue
    
    with open(f, 'r') as file:
        f_content = file.read()
    
    # 1. Add to masthead-links
    if '<a class="btn-ghost" id="nav-about" href="about.html">About Us</a>' not in f_content and '<a class="btn-ghost active" id="nav-about" href="about.html">About Us</a>' not in f_content:
        # Find Home link in masthead-links
        f_content = re.sub(
            r'(<a class="btn-ghost[^>]*id="nav-home"[^>]*>Home</a>)',
            r'\1\n        <a class="btn-ghost " id="nav-about" href="about.html">About Us</a>',
            f_content
        )
        
        # 2. Add to mobile-dropdown
        f_content = re.sub(
            r'(<a class="dropdown-link[^>]*href="index.html"[^>]*>Home</a>)',
            r'\1\n        <a class="dropdown-link " href="about.html">About Us</a>',
            f_content
        )
        
    with open(f, 'w') as file:
        file.write(f_content)

print("Done updating about.html and global headers.")
