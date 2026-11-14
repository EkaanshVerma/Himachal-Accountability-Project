/**
 * Himachal Accountability Project — Floating EN ↔ HI Translate Widget
 * Injects a sticky floating button that toggles Google Translate between
 * English and Hindi. No API key needed (uses the free GTranslate cookie trick).
 */
(function () {
  'use strict';

  /* ── 1. Inject Google Translate element (hidden) ───────────────────── */
  const gtDiv = document.createElement('div');
  gtDiv.id = 'google_translate_element';
  gtDiv.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;';
  document.body.appendChild(gtDiv);

  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement(
      { pageLanguage: 'en', includedLanguages: 'hi,en', autoDisplay: false },
      'google_translate_element'
    );
  };

  const gtScript = document.createElement('script');
  gtScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  gtScript.async = true;
  document.body.appendChild(gtScript);

  /* ── 2. Widget CSS ──────────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    #hap-translate-btn {
      position: fixed;
      right: 20px;
      bottom: 80px;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 10px 16px;
      border-radius: 999px;
      border: none;
      cursor: pointer;
      font-family: 'Space Grotesk', 'IBM Plex Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.03em;
      line-height: 1;
      box-shadow: 0 4px 18px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.12);
      background: #2d6a4f;
      color: #fff;
      transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      white-space: nowrap;
    }
    #hap-translate-btn:hover {
      background: #1b4332;
      box-shadow: 0 6px 24px rgba(0,0,0,0.3);
      transform: translateY(-2px);
    }
    #hap-translate-btn:active {
      transform: translateY(0);
    }
    #hap-translate-btn .hap-tr-icon {
      font-size: 16px;
      line-height: 1;
    }
    #hap-translate-btn .hap-tr-label {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1px;
    }
    #hap-translate-btn .hap-tr-current {
      font-size: 11px;
      opacity: 0.75;
      font-weight: 400;
    }
    #hap-translate-btn .hap-tr-next {
      font-size: 13px;
      font-weight: 700;
    }
    /* hide Google's own toolbar bar that appears at the top */
    .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame {
      display: none !important;
    }
    body { top: 0 !important; }
    @media (max-width: 480px) {
      #hap-translate-btn {
        right: 12px;
        bottom: 70px;
        padding: 9px 13px;
        font-size: 12px;
      }
    }
  `;
  document.head.appendChild(style);

  /* ── 3. Create floating button ──────────────────────────────────────── */
  const btn = document.createElement('button');
  btn.id = 'hap-translate-btn';
  btn.setAttribute('aria-label', 'Toggle language between English and Hindi');
  btn.innerHTML = `
    <span class="hap-tr-icon">🌐</span>
    <span class="hap-tr-label">
      <span class="hap-tr-current" id="hap-tr-current-lang">Currently: EN</span>
      <span class="hap-tr-next" id="hap-tr-next-lang">Switch to हिन्दी</span>
    </span>
  `;
  document.body.appendChild(btn);

  /* ── 4. Language state helpers ──────────────────────────────────────── */
  const COOKIE_NAME = 'googtrans';

  function getCurrentLang() {
    const c = document.cookie.split('; ').find(r => r.startsWith(COOKIE_NAME + '='));
    if (c) {
      const val = decodeURIComponent(c.split('=')[1]);
      // format is /en/hi or /en/en
      const parts = val.split('/');
      return parts[parts.length - 1] || 'en';
    }
    return localStorage.getItem('hap_lang') || 'en';
  }

  function setGTranslateCookie(lang) {
    // Google Translate reads this cookie on page load
    const val = '/en/' + lang;
    document.cookie = COOKIE_NAME + '=' + val + ';path=/';
    document.cookie = COOKIE_NAME + '=' + val + ';path=/;domain=' + location.hostname;
    localStorage.setItem('hap_lang', lang);
  }

  function updateButtonUI(lang) {
    const currentEl = document.getElementById('hap-tr-current-lang');
    const nextEl    = document.getElementById('hap-tr-next-lang');
    if (lang === 'hi') {
      currentEl.textContent = 'भाषा: हिन्दी';
      nextEl.textContent    = 'Switch to English';
    } else {
      currentEl.textContent = 'Currently: EN';
      nextEl.textContent    = 'Switch to हिन्दी';
    }
  }

  /* ── 5. Toggle handler ──────────────────────────────────────────────── */
  function doTranslate(toLang) {
    // Try using GTranslate's internal select first (most reliable)
    const tryNative = () => {
      const sel = document.querySelector('.goog-te-combo');
      if (sel) {
        sel.value = toLang;
        sel.dispatchEvent(new Event('change'));
        return true;
      }
      return false;
    };

    if (!tryNative()) {
      // Fallback: set cookie and reload
      setGTranslateCookie(toLang);
      location.reload();
      return;
    }
    setGTranslateCookie(toLang);
    updateButtonUI(toLang);
  }

  btn.addEventListener('click', () => {
    const current = getCurrentLang();
    const next = current === 'hi' ? 'en' : 'hi';
    doTranslate(next);
    updateButtonUI(next);
  });

  /* ── 6. Init button state on load ──────────────────────────────────── */
  updateButtonUI(getCurrentLang());

  // Auto-apply saved language after GT widget loads
  window.addEventListener('load', () => {
    const saved = getCurrentLang();
    if (saved === 'hi') {
      // Wait a tick for GT to initialise
      setTimeout(() => {
        const sel = document.querySelector('.goog-te-combo');
        if (sel && sel.value !== 'hi') {
          sel.value = 'hi';
          sel.dispatchEvent(new Event('change'));
        }
        updateButtonUI('hi');
      }, 1200);
    }
  });
})();
