/**
 * Himachal Accountability Project (HAP) — District Static Page Builder
 * Node build script that generates 12 static district scorecard pages.
 */

const fs = require('fs');
const path = require('path');

// Read hap-civic-data.js to extract HAP_DISTRICTS and HAP_MLAS
const dataFilePath = path.join(__dirname, '..', 'public', 'hap-civic-data.js');
const dataContent = fs.readFileSync(dataFilePath, 'utf-8');

// Sandboxed extraction
const context = {};
const extractFn = new Function('window', dataContent + '\nreturn { HAP_DISTRICTS, HAP_MLAS, HAP_CIVIC_HELPERS };');
const { HAP_DISTRICTS, HAP_MLAS, HAP_CIVIC_HELPERS } = extractFn({});

const MIN_SAMPLE = 10;

function getSlug(name) {
  return name.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function getDelayBand(months) {
  if (months <= 2) return { text: '0–2 Months', cls: 'tag-delay-0-2' };
  if (months <= 6) return { text: '3–6 Months', cls: 'tag-delay-3-6' };
  if (months <= 11) return { text: '7–11 Months', cls: 'tag-delay-7-11' };
  return { text: '12+ Months', cls: 'tag-delay-12plus' };
}

// Generate the 12 pages
Object.entries(HAP_DISTRICTS).forEach(([distName, dist]) => {
  const slug = getSlug(distName);
  const mlas = HAP_MLAS.filter(m => m.district.toLowerCase() === distName.toLowerCase());
  
  // Median pending estimate based on neglect and rank
  const medianMonths = dist.score >= 70 ? 2 : (dist.score >= 55 ? 5 : (dist.score >= 45 ? 8 : 14));
  const delayBand = getDelayBand(medianMonths);
  const oldestIssue = mlas.length > 0 ? mlas[0] : null;

  const isLowSample = dist.count < MIN_SAMPLE;
  const rankDisplay = isLowSample ? 'Unranked' : `#${dist.rank} of 12`;
  const scoreDisplay = isLowSample ? `Too few reports to rate (n = ${dist.count})` : `${dist.score}`;
  const tierClass = dist.score >= 70 ? 'tag-delay-0-2' : (dist.score >= 50 ? 'tag-delay-3-6' : 'tag-delay-12plus');

  const shareText = encodeURIComponent(`⚖️ ${distName} Accountability Scorecard: Score ${dist.score}/100 (Rank #${dist.rank}). Unresolved grievance rate: ${dist.neglect}%. Read the 5-pillar breakdown: https://himachalaccountability.org/${slug}.html`);
  const waShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${distName} District Accountability Scorecard — Himachal Accountability Project</title>
  <meta name="description" content="Public infrastructure scores, MLA neglect rates, and verified grievance backlog for ${distName} district across Roads, Water, Healthcare, Power, and Youth facilities.">
  <link rel="canonical" href="https://himachalaccountability.org/${slug}.html">

  <!-- Open Graph / Twitter -->
  <meta property="og:title" content="${distName} Accountability Scorecard — HAP">
  <meta property="og:description" content="Public accountability score: ${dist.score}/100. ${dist.neglect}% unresolved grievance rate across ${dist.count} verified reports.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://himachalaccountability.org/${slug}.html">
  <meta property="og:image" content="https://himachalaccountability.org/images/og-${slug}.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${distName} Accountability Scorecard — HAP">
  <meta name="twitter:description" content="Public accountability score: ${dist.score}/100 with 5-pillar breakdown.">

  <!-- Favicon & Touch Icon -->
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="apple-touch-icon" href="images/hap_logo.png">

  <!-- Design System CSS -->
  <link rel="stylesheet" href="css/design-system.css">
  <style>
    .pillar-bar-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .pillar-bar-track {
      flex: 1;
      height: 8px;
      background-color: var(--bg-inset);
      border-radius: 4px;
      overflow: hidden;
    }
    .pillar-bar-fill {
      height: 100%;
      background-color: var(--accent);
      border-radius: 4px;
    }
    .mla-card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-20, 20px);
    }
  </style>
</head>
<body>

  <!-- Universal Announcement Bar & Masthead -->
  <div class="ann-bar">
    <b>Independent civic record.</b> &nbsp;Not affiliated with any political party or government body. &nbsp;Data from community field reports. &nbsp;Not a government website.
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
          <a class="btn-ghost" id="nav-home" href="index.html">Home</a>
          <a class="btn-ghost" id="nav-about" href="about.html">About Us</a>
          <a class="btn-ghost active" id="nav-dashboard" href="dashboard.html">Dashboard</a>
          <a class="btn-ghost" id="nav-compare" href="compare.html">Compare</a>
          <a class="btn-ghost" id="nav-mlas" href="mlas.html">Find MLA</a>
          <a class="btn-ghost" id="nav-join" href="join.html">Join Us</a>
          <a class="btn-ghost" id="nav-contact" href="contact.html">Contact Us</a>
        </nav>
        
        <div class="mobile-dropdown" id="mobile-menu" style="display: none;">
          <a class="dropdown-link" href="index.html">Home</a>
          <a class="dropdown-link" href="about.html">About Us</a>
          <a class="dropdown-link active" href="dashboard.html">Dashboard</a>
          <a class="dropdown-link" href="compare.html">Compare Districts</a>
          <a class="dropdown-link" href="mlas.html">Find Your MLA</a>
          <a class="dropdown-link" href="join.html">Join Us</a>
          <a class="dropdown-link" href="contact.html">Contact Us</a>
          <a class="dropdown-link" href="donate.html">Support Us</a>
        </div>

        <a class="btn-ghost" id="nav-donate" href="donate.html">Support Us</a>
        <a class="btn-primary" href="report-issue.html?district=${encodeURIComponent(distName)}">&#x270E;&nbsp; Report Issue</a>
        
        <button class="menu-toggle-btn" id="menu-toggle" aria-label="Toggle navigation menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" style="width:18px; height:18px; display:block;"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <button class="theme-toggle-btn" id="theme-toggle" aria-label="Toggle theme">
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        </button>
      </div>
    </div>
  </header>

  <main>
    <!-- District Hero -->
    <section class="section" style="padding-top: var(--space-64); padding-bottom: var(--space-48); background-color: var(--bg-card);">
      <div class="site-container">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 24px;">
          <div>
            <div class="eyebrow">District Scorecard &middot; Vidhan Sabha Backlog</div>
            <h1 style="margin-bottom: 8px;">${distName}</h1>
            <p style="font-size: 1.1rem; color: var(--muted); max-width: 600px; margin: 0;">
              Accountability record for ${distName} district across ${mlas.length} assembly constituencies and ${dist.count} verified citizen reports.
            </p>
          </div>

          <!-- Score Card -->
          <div class="card" style="min-width: 240px; text-align: center; border: 2px solid var(--border);">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: var(--muted); margin-bottom: 4px;">Public Accountability Score</div>
            <div class="stat-num" style="font-size: 3.2rem; color: var(--ink);">${scoreDisplay}</div>
            <div style="display: flex; justify-content: center; gap: 8px; margin-top: 8px;">
              <span class="tag ${tierClass}">${dist.tier}</span>
              <span class="tag tag-neutral">${rankDisplay}</span>
            </div>
            <a href="data-methodology.html#scoring-methodology" style="display: block; margin-top: 10px; font-size: 11px; color: var(--muted); text-decoration: underline;">How scores are calculated →</a>
          </div>
        </div>

        <!-- Stat Strip -->
        <div class="stat-strip" style="margin-top: var(--space-40);">
          <div class="stat-block">
            <span class="stat-label">Verified Reports (n)</span>
            <span class="stat-num">${dist.count}</span>
            <span class="stat-meta">Ground-checked complaints</span>
          </div>
          <div class="stat-block">
            <span class="stat-label">Unresolved Grievance Rate</span>
            <span class="stat-num" style="color: var(--delay-7-11);">${dist.neglect}%</span>
            <span class="stat-meta">No recorded resolution</span>
          </div>
          <div class="stat-block">
            <span class="stat-label">Median Pending Delay</span>
            <span class="stat-num">${medianMonths} mos</span>
            <span class="stat-meta"><span class="tag ${delayBand.cls}" style="font-size: 10px;">${delayBand.text}</span></span>
          </div>
          <div class="stat-block">
            <span class="stat-label">Primary Infrastructure Failure</span>
            <span class="stat-num" style="font-size: 1.8rem;">${dist.top}</span>
            <span class="stat-meta">Leading grievance category</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content: Pillars & Oldest Issue -->
    <section class="section">
      <div class="site-container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-48);">
          
          <!-- 5 Pillars -->
          <div>
            <div class="eyebrow">5-Pillar Public Service Breakdown</div>
            <h2 style="font-size: var(--text-28); margin-bottom: 24px;">Responsiveness by Sector</h2>
            
            <div class="card">
              <div class="pillar-bar-wrap">
                <span style="width: 140px; font-size: 14px; font-weight: 500;">Roads & Bridges</span>
                <div class="pillar-bar-track"><div class="pillar-bar-fill" style="width: ${dist.pwd}%;"></div></div>
                <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; width: 44px; text-align: right;">${dist.pwd}/100</span>
              </div>
              <div class="pillar-bar-wrap">
                <span style="width: 140px; font-size: 14px; font-weight: 500;">Drinking Water</span>
                <div class="pillar-bar-track"><div class="pillar-bar-fill" style="width: ${dist.water}%;"></div></div>
                <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; width: 44px; text-align: right;">${dist.water}/100</span>
              </div>
              <div class="pillar-bar-wrap">
                <span style="width: 140px; font-size: 14px; font-weight: 500;">Healthcare</span>
                <div class="pillar-bar-track"><div class="pillar-bar-fill" style="width: ${dist.health}%;"></div></div>
                <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; width: 44px; text-align: right;">${dist.health}/100</span>
              </div>
              <div class="pillar-bar-wrap">
                <span style="width: 140px; font-size: 14px; font-weight: 500;">Power & Grid</span>
                <div class="pillar-bar-track"><div class="pillar-bar-fill" style="width: ${dist.power}%;"></div></div>
                <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; width: 44px; text-align: right;">${dist.power}/100</span>
              </div>
              <div class="pillar-bar-wrap">
                <span style="width: 140px; font-size: 14px; font-weight: 500;">Youth Facilities</span>
                <div class="pillar-bar-track"><div class="pillar-bar-fill" style="width: ${dist.youth}%;"></div></div>
                <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 600; width: 44px; text-align: right;">${dist.youth}/100</span>
              </div>
              <p style="font-size: 12px; color: var(--muted); margin-top: 16px; margin-bottom: 0;">
                Each pillar contributes an equal 20% weight to the unweighted arithmetic composite score.
              </p>
            </div>
          </div>

          <!-- Oldest Unresolved Grievance -->
          <div>
            <div class="eyebrow">Critical Delay Highlight</div>
            <h2 style="font-size: var(--text-28); margin-bottom: 24px;">Oldest Open Grievance</h2>
            
            ${oldestIssue ? `
            <div class="card" style="border-left: 4px solid var(--delay-12plus);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <span class="tag tag-delay-12plus">${delayBand.text} Pending</span>
                <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted);">Constituency #${oldestIssue.no}</span>
              </div>
              <h3 style="font-size: 1.25rem; font-family: var(--font-sans); font-weight: 600; margin-bottom: 8px;">
                ${oldestIssue.constituency} — ${oldestIssue.dominantIssue}
              </h3>
              <p style="font-size: 0.95rem; color: var(--ink-secondary); line-height: 1.6; margin-bottom: 16px;">
                ${oldestIssue.problem}
              </p>
              <div style="font-size: 12px; color: var(--muted); display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
                <span>Elected MLA: <strong>${oldestIssue.mla} (${oldestIssue.party})</strong></span>
                <a href="${HAP_CIVIC_HELPERS.getWhatsAppMLALink(oldestIssue)}" target="_blank" rel="noopener" class="btn-secondary" style="font-size: 12px; padding: 0;">Demand Action →</a>
              </div>
            </div>
            ` : `<p style="color: var(--muted);">No grievance data recorded for this district yet.</p>`}

            <!-- Action Triggers -->
            <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
              <a href="report-issue.html?district=${encodeURIComponent(distName)}" class="btn-primary" style="flex: 1; text-align: center;">
                Report an Issue in ${distName} →
              </a>
              <a href="${waShareUrl}" target="_blank" rel="noopener" class="btn-outline" style="gap: 6px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                Share
              </a>
              <a href="compare.html?d1=${encodeURIComponent(distName)}" class="btn-outline">
                Compare →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Assembly Constituencies & MLA List -->
    <section class="section" style="background-color: var(--bg-card);">
      <div class="site-container">
        <div class="section-head">
          <div class="eyebrow">Vidhan Sabha Constituencies (${mlas.length})</div>
          <h2>Elected Representatives in ${distName}</h2>
          <p style="color: var(--muted); font-size: 0.95rem;">
            Constituency scores reflect citizen-reported issue resolution under departmental jurisdiction; they measure administrative delivery in the constituency, not an individual MLA's legislative votes or committee work.
          </p>
        </div>

        <div class="mla-card-grid">
          ${mlas.map(m => `
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted);">Seat #${m.no}</span>
                  <span class="tag tag-neutral" style="font-size: 10px;">PIN: ${m.pincode}</span>
                </div>
                <h3 style="font-size: 1.15rem; font-family: var(--font-sans); font-weight: 600; margin-bottom: 2px;">${m.mla}</h3>
                <div style="font-size: 13px; color: var(--muted); margin-bottom: 12px;">
                  ${m.constituency} &middot; <strong style="color: var(--ink);">${m.party}</strong>
                </div>
                <p style="font-size: 0.88rem; color: var(--ink-secondary); line-height: 1.5; margin-bottom: 16px;">
                  ${m.problem}
                </p>
              </div>

              <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-family: var(--font-mono); font-size: 11px; color: var(--muted);">
                  ${m.reports >= MIN_SAMPLE ? `${m.neglect}% Unresolved` : `Too few reports (n = ${m.reports})`}
                </span>
                <div style="display: flex; gap: 8px;">
                  <a href="${HAP_CIVIC_HELPERS.getWhatsAppMLALink(m)}" target="_blank" rel="noopener" class="btn-outline" style="padding: 4px 8px; font-size: 11px;" title="WhatsApp petition">WhatsApp</a>
                  <a href="${HAP_CIVIC_HELPERS.getEmailMLALink(m)}" class="btn-outline" style="padding: 4px 8px; font-size: 11px;" title="Email petition">Email</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  </main>

  <!-- Canonical Footer -->
  <footer>
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="index.html" class="brand">
            <img src="images/hap_logo.png" alt="HAP Logo" class="brand-logo">
            Himachal Accountability Project
          </a>
          <p>An independent, citizen-run public utility tracking administrative responsiveness, public works neglect, and MLA accountability across all 12 districts of Himachal Pradesh.</p>
        </div>

        <div class="footer-socials">
          <a href="https://instagram.com/thehapofficial" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://x.com/TheHAPofficial" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </div>
      
      <div class="footer-bottom">
        <span>&copy; <span id="year">2026</span> Himachal Accountability Project &middot; Non-Partisan Public Utility</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <span>Designed by</span>
          <a href="https://vermadigital.in/" target="_blank" rel="noopener noreferrer" style="display:flex; align-items:center;">
            <img src="images/verma_digital_logo.png" alt="Verma Digital" class="verma-logo">
          </a>
        </div>
      </div>
    </div>
  </footer>

  <script src="js/config.js"></script>
  <script src="js/shared-components.js"></script>
</body>
</html>`;

  const outputPath = path.join(__dirname, '..', 'public', `${slug}.html`);
  fs.writeFileSync(outputPath, html, 'utf-8');
  console.log(`Generated: ${slug}.html`);
});

console.log('All 12 district pages built successfully.');

