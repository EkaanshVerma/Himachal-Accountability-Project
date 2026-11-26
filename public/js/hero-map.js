/**
 * Himachal Accountability Project (HAP) — Hero Interactive Delay-Scale Map
 * Pass 2 UX Polish: Visualizes 12 districts colored by median months pending delay scale,
 * with Replay animation, WhatsApp Share, scroll-wheel zoom lock, and direct district scorecard links.
 */

(function() {
  // Built-in fallback dataset ensuring map renders immediately even before external scripts finish
  const FALLBACK_DISTRICTS = {
    "Lahaul & Spiti": { score: 78.4, rank: 1, neglect: 50, count: 12, months: 2, top: "Roads" },
    "Kinnaur": { score: 71.2, rank: 2, neglect: 55, count: 18, months: 4, top: "Power" },
    "Kullu": { score: 66.8, rank: 3, neglect: 58, count: 42, months: 5, top: "Roads" },
    "Chamba": { score: 63.5, rank: 4, neglect: 61, count: 38, months: 13, top: "Roads" },
    "Hamirpur": { score: 61.0, rank: 5, neglect: 63, count: 36, months: 5, top: "Roads" },
    "Mandi": { score: 58.6, rank: 6, neglect: 65, count: 64, months: 6, top: "Roads" },
    "Bilaspur": { score: 55.4, rank: 7, neglect: 67, count: 28, months: 5, top: "Roads" },
    "Kangra": { score: 51.8, rank: 8, neglect: 69, count: 82, months: 7, top: "Roads" },
    "Sirmaur": { score: 49.3, rank: 9, neglect: 69, count: 34, months: 7, top: "Health" },
    "Solan": { score: 47.1, rank: 10, neglect: 71, count: 45, months: 8, top: "Roads" },
    "Shimla": { score: 45.2, rank: 11, neglect: 73, count: 56, months: 9, top: "Roads" },
    "Una": { score: 42.0, rank: 12, neglect: 74, count: 47, months: 6, top: "Health" }
  };

  // Geographic centroids for Himachal Pradesh's 12 districts
  const DISTRICT_CENTROIDS = {
    "Lahaul & Spiti": [32.55, 77.40],
    "Kinnaur": [31.65, 78.35],
    "Kullu": [31.95, 77.10],
    "Chamba": [32.55, 76.12],
    "Hamirpur": [31.68, 76.52],
    "Mandi": [31.70, 76.95],
    "Bilaspur": [31.33, 76.75],
    "Kangra": [32.10, 76.25],
    "Sirmaur": [30.60, 77.30],
    "Solan": [30.90, 77.10],
    "Shimla": [31.10, 77.35],
    "Una": [31.45, 76.25]
  };

  function getSlug(name) {
    return name.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
  }

  // Delay scale mapping strictly according to project specifications
  function getDelayInfo(months, count) {
    if (count < 10) {
      return { color: '#64748B', band: 'Too few reports', label: '<10 reports', bg: '#F1F5F9' };
    }
    if (months <= 2) {
      return { color: '#2E7D32', band: '0–2 Months Pending', label: '0–2m', bg: '#E8F5E9' };
    }
    if (months <= 6) {
      return { color: '#D97706', band: '3–6 Months Pending', label: '3–6m', bg: '#FEF3C7' };
    }
    if (months <= 11) {
      return { color: '#C2410C', band: '7–11 Months Pending', label: '7–11m', bg: '#FFEDD5' };
    }
    return { color: '#991B1B', band: '12+ Months Pending', label: '12m+', bg: '#FEE2E2' };
  }

  function renderFallbackSVG(container, distData) {
    container.innerHTML = `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; background: #121A15; color: #ECEEDF; font-family: var(--font-sans); text-align: center;">
        <svg viewBox="0 0 400 240" style="width: 100%; max-height: 260px; margin-bottom: 8px;">
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#C87A30" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#C87A30" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="400" height="240" fill="#18231C" rx="6" stroke="rgba(255,255,255,0.1)"/>
          <circle cx="200" cy="120" r="90" fill="url(#glow)"/>
          <!-- Simplified District Bubbles -->
          <circle cx="120" cy="60" r="18" fill="#991B1B" opacity="0.85"/>
          <text x="120" y="64" fill="#fff" font-size="9" font-weight="700" text-anchor="middle">Chamba</text>

          <circle cx="230" cy="65" r="16" fill="#2E7D32" opacity="0.85"/>
          <text x="230" y="69" fill="#fff" font-size="8" font-weight="700" text-anchor="middle">Lahaul</text>

          <circle cx="130" cy="110" r="22" fill="#C2410C" opacity="0.85"/>
          <text x="130" y="114" fill="#fff" font-size="9" font-weight="700" text-anchor="middle">Kangra</text>

          <circle cx="190" cy="115" r="20" fill="#D97706" opacity="0.85"/>
          <text x="190" y="119" fill="#fff" font-size="9" font-weight="700" text-anchor="middle">Mandi</text>

          <circle cx="240" cy="120" r="17" fill="#D97706" opacity="0.85"/>
          <text x="240" y="124" fill="#fff" font-size="9" font-weight="700" text-anchor="middle">Kullu</text>

          <circle cx="310" cy="130" r="15" fill="#D97706" opacity="0.85"/>
          <text x="310" y="134" fill="#fff" font-size="8" font-weight="700" text-anchor="middle">Kinnaur</text>

          <circle cx="220" cy="170" r="20" fill="#C2410C" opacity="0.85"/>
          <text x="220" y="174" fill="#fff" font-size="9" font-weight="700" text-anchor="middle">Shimla</text>

          <circle cx="160" cy="165" r="16" fill="#D97706" opacity="0.85"/>
          <text x="160" y="169" fill="#fff" font-size="8" font-weight="700" text-anchor="middle">Bilaspur</text>

          <circle cx="120" cy="160" r="15" fill="#D97706" opacity="0.85"/>
          <text x="120" y="164" fill="#fff" font-size="8" font-weight="700" text-anchor="middle">Hamirpur</text>

          <circle cx="95" cy="175" r="16" fill="#D97706" opacity="0.85"/>
          <text x="95" y="179" fill="#fff" font-size="8" font-weight="700" text-anchor="middle">Una</text>

          <circle cx="180" cy="200" r="17" fill="#C2410C" opacity="0.85"/>
          <text x="180" y="204" fill="#fff" font-size="8" font-weight="700" text-anchor="middle">Solan</text>

          <circle cx="230" cy="210" r="16" fill="#C2410C" opacity="0.85"/>
          <text x="230" y="214" fill="#fff" font-size="8" font-weight="700" text-anchor="middle">Sirmaur</text>
        </svg>
        <div style="font-size: 11px; color: #A0ABA2;">
          Click any district on the map or explore the <a href="dashboard.html" style="color: #C87A30; text-decoration: underline;">full public ledger &rarr;</a>
        </div>
      </div>
    `;
  }

  function initHeroMap() {
    const mapContainer = document.getElementById('hero-map');
    if (!mapContainer) return;

    // Merge data from HAP_DISTRICTS if available, otherwise use verified fallback
    let distData = FALLBACK_DISTRICTS;
    if (typeof window.HAP_DISTRICTS !== 'undefined' && Object.keys(window.HAP_DISTRICTS).length > 0) {
      distData = Object.assign({}, FALLBACK_DISTRICTS, window.HAP_DISTRICTS);
      // Map months from delay calculations if present
      Object.keys(distData).forEach(k => {
        if (!distData[k].months) {
          distData[k].months = FALLBACK_DISTRICTS[k] ? FALLBACK_DISTRICTS[k].months : 6;
        }
      });
    }

    // Check Leaflet availability
    if (typeof L === 'undefined') {
      console.warn('Leaflet library not loaded, using high-fidelity SVG fallback.');
      renderFallbackSVG(mapContainer, distData);
      return;
    }

    // Check dark mode
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // High performance CartoDB tile layers (with ArcGIS and OSM fallbacks)
    const cartoUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    // Reset container contents
    mapContainer.innerHTML = '';

    let map;
    try {
      map = L.map('hero-map', {
        center: [31.80, 77.20],
        zoom: 7.2,
        minZoom: 6,
        maxZoom: 12,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false
      });
    } catch (e) {
      console.error('Failed to initialize Leaflet map:', e);
      renderFallbackSVG(mapContainer, distData);
      return;
    }

    // Add CartoDB tile layer with subdomains
    L.tileLayer(cartoUrl, {
      subdomains: 'abcd',
      maxZoom: 14
    }).addTo(map);

    // Zoom controls in top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Unlock zoom only on click, lock on mouseout to prevent scroll hijack
    mapContainer.addEventListener('click', () => map.scrollWheelZoom.enable());
    mapContainer.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

    // Fix flex/grid dimensions
    setTimeout(() => map.invalidateSize(), 150);
    setTimeout(() => map.invalidateSize(), 600);
    window.addEventListener('resize', () => map.invalidateSize());

    const layersGroup = L.layerGroup().addTo(map);

    function renderMarkers(animate) {
      layersGroup.clearLayers();

      const entries = Object.entries(distData);

      entries.forEach(([name, d], index) => {
        const coords = DISTRICT_CENTROIDS[name];
        if (!coords) return;

        const months = d.months || 6;
        const info = getDelayInfo(months, d.count || 1);
        const radius = Math.max(14, Math.min(24, 10 + Math.sqrt(d.count || 1) * 1.5));
        const slug = (typeof HAP_CIVIC_HELPERS !== 'undefined' && HAP_CIVIC_HELPERS.getDistrictSlug)
          ? HAP_CIVIC_HELPERS.getDistrictSlug(name)
          : getSlug(name);
        const distUrl = slug + '.html';

        // Outer glow circle
        const glow = L.circleMarker(coords, {
          radius: radius + 4,
          fillColor: info.color,
          fillOpacity: 0.22,
          color: info.color,
          weight: 1,
          opacity: 0.4
        }).addTo(layersGroup);

        // Core marker
        const marker = L.circleMarker(coords, {
          radius: animate ? 2 : radius,
          fillColor: info.color,
          fillOpacity: 0.92,
          color: '#FFFFFF',
          weight: 2,
          opacity: 1
        }).addTo(layersGroup);

        // Permanent text label for immediate legibility
        const labelIcon = L.divIcon({
          className: 'hero-map-label',
          html: `<div style="transform: translate(-50%, -24px); white-space: nowrap; pointer-events: none; text-shadow: 0 1px 3px rgba(0,0,0,0.85); font-family: var(--font-sans, sans-serif); font-size: 10px; font-weight: 700; color: #FFFFFF;">${name}</div>`,
          iconSize: [0, 0]
        });
        L.marker(coords, { icon: labelIcon, interactive: false }).addTo(layersGroup);

        // Popup content matching design-system cards
        const popupContent = `
          <div style="font-family: var(--font-sans, sans-serif); padding: 4px; min-width: 200px; color: #18231C;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #647268; font-weight: 700;">District Status</div>
            <div style="font-size: 16px; font-weight: 700; margin: 3px 0 6px;">
              <a href="${distUrl}" style="color: #18231C; text-decoration: none;">${name} &rarr;</a>
            </div>
            <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 8px;">
              <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; background: ${info.bg}; color: ${info.color}; font-family: var(--font-mono, monospace);">
                ${months} mos median delay
              </span>
              <span style="font-size: 11px; color: #647268;">(${info.band})</span>
            </div>
            <div style="font-size: 12px; margin-bottom: 4px;">
              Unresolved Grievance Rate: <strong>${d.neglect}%</strong>
            </div>
            <div style="font-size: 12px; color: #647268; margin-bottom: 10px;">
              Verified Reports: <strong>${d.count}</strong> &middot; Top: ${d.top || "Roads"}
            </div>
            <a href="${distUrl}" style="display: block; text-align: center; background: #C87A30; color: #FFFFFF; padding: 7px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px; text-decoration: none;">
              Open ${name} Scorecard &rarr;
            </a>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 260 });
        marker.bindTooltip(`<strong>${name}</strong>: ${months} mos median (${info.band})`, {
          direction: 'top',
          offset: [0, -radius]
        });

        // Click on marker opens popup or navigates
        marker.on('click', () => {
          marker.openPopup();
        });

        if (animate) {
          setTimeout(() => {
            let r = 2;
            const step = () => {
              r += 2;
              if (r <= radius) {
                marker.setRadius(r);
                requestAnimationFrame(step);
              } else {
                marker.setRadius(radius);
              }
            };
            requestAnimationFrame(step);
          }, index * 80);
        }
      });
    }

    renderMarkers(false);

    // Replay button listener
    const replayBtn = document.getElementById('btn-map-replay');
    if (replayBtn) {
      replayBtn.onclick = function(e) {
        e.preventDefault();
        renderMarkers(true);
      };
    }

    // Share button listener
    const shareBtn = document.getElementById('btn-map-share');
    if (shareBtn) {
      shareBtn.onclick = function(e) {
        e.preventDefault();
        const text = encodeURIComponent('⚖️ Himachal Civic Accountability Map: Track unaddressed infrastructure delay bands across all 12 districts: https://himachalaccountability.org');
        window.open('https://api.whatsapp.com/send?text=' + text, '_blank', 'noopener,noreferrer');
      };
    }
  }

  // Self-initializing with readyState check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroMap);
  } else {
    initHeroMap();
  }
})();
