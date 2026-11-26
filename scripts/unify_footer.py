#!/usr/bin/env python3
"""
Himachal Accountability Project (HAP) — Universal Footer Unifier
Propagates the YouthPOWER-inspired 3-column + CC BY-SA 4.0 + Verma Digital
Universal Footer across all HTML pages while preserving page-specific backgrounds.
"""

import os
import glob
import re

UNIVERSAL_FOOTER_HTML = """<footer class="hap-universal-footer">
  <div class="hap-footer-inner">
    <div class="hap-footer-grid">
      <div class="hap-footer-brand">
        <a href="index.html" class="brand">
          <img src="images/hap_logo.png" alt="HAP Logo" class="brand-logo">
          Himachal Accountability Project
        </a>
        <div class="hap-footer-byline">Public Ledger &middot; Himachal Pradesh</div>
        <p class="hap-footer-tagline">
          An independent, citizen-run public utility tracking administrative responsiveness, public works neglect, and MLA accountability across all 12 districts of Himachal Pradesh.
        </p>
        <label class="hap-footer-notify-label" for="hap-footer-email">Get an email when we publish new district data or reports.</label>
        <form class="hap-footer-notify-form" onsubmit="event.preventDefault(); var m=this.nextElementSibling; if(this.querySelector('input').value.trim()){ m.style.display='block'; this.reset(); }">
          <input type="email" id="hap-footer-email" class="hap-footer-notify-input" placeholder="you@example.com" required>
          <button type="submit" class="hap-footer-notify-btn">Notify Me</button>
        </form>
        <div class="hap-footer-notify-msg">Subscribed — we'll notify you when new district reports go live.</div>
      </div>

      <div>
        <h3 class="hap-footer-col-title">The Ledger</h3>
        <ul class="hap-footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="dashboard.html">Public Dashboard</a></li>
          <li><a href="compare.html">Compare Districts</a></li>
          <li><a href="mlas.html">Find Your MLA</a></li>
          <li><a href="ask.html">Ask HAP (पूछें)</a></li>
          <li><a href="about.html">About Us</a></li>
        </ul>
      </div>

      <div>
        <h3 class="hap-footer-col-title">Using Our Work</h3>
        <ul class="hap-footer-links">
          <li><a href="data-methodology.html">Data Methodology</a></li>
          <li><a href="report-issue.html">Report an Issue</a></li>
          <li><a href="join.html">Join Us</a></li>
          <li><a href="donate.html">Support Us</a></li>
          <li><a href="contact.html">Contact Us</a></li>
        </ul>
      </div>
    </div>

    <div class="hap-footer-cc-row">
      <p class="hap-footer-cc-text">
        All Himachal Accountability Project reports, charts and data are published under Creative Commons Attribution-ShareAlike 4.0. You are free to share and adapt, including republishing in print or online, as long as you credit Himachal Accountability Project and link back to the source.
      </p>
      <a href="data-methodology.html" class="hap-footer-cc-badge">CC BY-SA 4.0</a>
    </div>

    <div class="hap-footer-bottom">
      <div class="hap-footer-bottom-left">
        <span>&copy; <span id="year">2026</span> Himachal Accountability Project &middot; Non-Partisan Public Utility</span>
      </div>
      <div class="hap-footer-bottom-right">
        <div class="hap-footer-socials">
          <a href="https://instagram.com/thehapofficial" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://x.com/TheHAPofficial" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
        <div class="hap-footer-verma">
          <span>Designed by</span>
          <a href="https://vermadigital.in/" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center;">
            <img src="images/verma_digital_logo.png" alt="Verma Digital" class="verma-logo">
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>"""

def preserve_bg_css_from_footer(html, footer_chunk):
    """If the old footer had a body background image <style> inside it, move it safely into <head>."""
    bg_match = re.search(r'(body\s*\{[^}]*bg\d+\.jpg[^}]*\}(?:\s*\.(?:hero|page-hero|where-it-goes|faq-section|section)[^}]*\{[^}]*\})?)', footer_chunk, flags=re.S)
    if bg_match:
        bg_css = bg_match.group(1)
        if 'bg' in bg_css and bg_css not in html[:html.find('</head>')]:
            html = html.replace('</head>', f'<style>\n{bg_css}\n</style>\n</head>', 1)
    return html

def process_file(filepath):
    filename = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Ensure universal-footer.css is linked in head
    if 'css/universal-footer.css' not in html:
        if '</head>' in html:
            html = html.replace('</head>', '  <link rel="stylesheet" href="css/universal-footer.css">\n</head>', 1)

    if filename == 'dashboard.html':
        pattern = r'<div class="footer">\s*<div class="footer-l">[\s\S]*?</div>\s*<div class="footer-r">[\s\S]*?</div>\s*</div>\s*</div>'
        if re.search(pattern, html):
            html = re.sub(pattern, '</div>\n\n' + UNIVERSAL_FOOTER_HTML, html, count=1)
        else:
            footer_match = re.search(r'<footer\b[^>]*>[\s\S]*?</footer>', html)
            if footer_match:
                html = html[:footer_match.start()] + UNIVERSAL_FOOTER_HTML + html[footer_match.end():]
    elif '<footer' in html:
        footer_match = re.search(r'<footer\b[^>]*>[\s\S]*?</footer>', html)
        if footer_match:
            html = preserve_bg_css_from_footer(html, footer_match.group(0))
            # Re-find footer after potential </head> insertion
            footer_match = re.search(r'<footer\b[^>]*>[\s\S]*?</footer>', html)
            html = html[:footer_match.start()] + UNIVERSAL_FOOTER_HTML + html[footer_match.end():]
    elif '<div class="footer"' in html:
        pattern = r'<div class="footer"[^>]*>[\s\S]*?</div>\s*</div>'
        html = re.sub(pattern, UNIVERSAL_FOOTER_HTML, html, count=1)
    else:
        if '</body>' in html:
            html = html.replace('</body>', UNIVERSAL_FOOTER_HTML + '\n</body>', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'Footer unified: {filepath}')

def main():
    files = sorted(glob.glob('public/*.html'))
    for f in files:
        if 'himachal-accountability-landing (1).html' in f:
            continue
        process_file(f)

if __name__ == '__main__':
    main()
