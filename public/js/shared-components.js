/**
 * Himachal Accountability Project (HAP) — Shared Sitewide Components
 * Canonical Top Banner, Universal Navbar Behaviors, and Footer.
 */

(function() {
  const cfg = (typeof window !== 'undefined' && window.HAP_CONFIG) ? window.HAP_CONFIG : {
    CURRENT_YEAR: new Date().getFullYear(),
    INSTAGRAM_URL: "https://www.instagram.com/thehapofficial/",
    CONTACT_EMAIL: "contact@himachalaccountability.org",
    LICENSE_SHORT: "CC BY-SA 4.0"
  };

  const CANONICAL_BANNER_TEXT = '<b>Independent civic record.</b> &nbsp;Not affiliated with any political party or government body. &nbsp;Data from community field reports.';

  // Render or synchronize canonical announcement banner (and deduplicate if multiple exist)
  function syncBanner() {
    const banners = document.querySelectorAll('.ann-bar');
    banners.forEach((b, idx) => {
      if (idx > 0) {
        b.remove();
      } else {
        b.innerHTML = CANONICAL_BANNER_TEXT;
      }
    });
  }

  // Universal Navbar interactive behavior (Theme toggle & Mobile menu)
  function syncNavbar() {
    // 1. Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn && !themeToggleBtn.dataset.bound) {
      themeToggleBtn.dataset.bound = 'true';
      themeToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        try {
          localStorage.setItem('hap-theme', newTheme);
        } catch (err) {}
      });
    }

    // 2. Mobile Menu Toggle
    const menuToggleBtn = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggleBtn && mobileMenu && !menuToggleBtn.dataset.bound) {
      menuToggleBtn.dataset.bound = 'true';
      menuToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = mobileMenu.classList.contains('open') || mobileMenu.style.display === 'flex';
        if (isOpen) {
          mobileMenu.classList.remove('open');
          mobileMenu.style.display = 'none';
        } else {
          mobileMenu.classList.add('open');
          mobileMenu.style.display = 'flex';
        }
      });

      // Close mobile menu on click outside
      document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && e.target !== menuToggleBtn && !menuToggleBtn.contains(e.target)) {
          mobileMenu.classList.remove('open');
          mobileMenu.style.display = 'none';
        }
      });

      // Close mobile menu when a link inside it is clicked
      mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          mobileMenu.style.display = 'none';
        });
      });
    }
  }

  // Synchronize footer elements (current year, instagram link, license)
  function syncFooter() {
    // Current year
    document.querySelectorAll('#year, .footer-year').forEach(el => {
      el.textContent = cfg.CURRENT_YEAR;
    });

    // Replace any dead '#' or placeholder social links
    document.querySelectorAll('a[href="#"], a.footer-social, .footer-socials a').forEach(a => {
      if (a.textContent.toLowerCase().includes('instagram') || a.querySelector('svg') || a.getAttribute('aria-label') === 'Instagram') {
        if (!a.getAttribute('onclick')) {
          a.href = cfg.INSTAGRAM_URL;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
      }
    });

    // If an Instagram link with old handle exists, unify to @thehapofficial
    document.querySelectorAll('a[href*="instagram.com"]').forEach(a => {
      a.href = cfg.INSTAGRAM_URL;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      syncBanner();
      syncNavbar();
      syncFooter();
    });
  } else {
    syncBanner();
    syncNavbar();
    syncFooter();
  }

  window.HAP_SHARED = {
    syncBanner: syncBanner,
    syncNavbar: syncNavbar,
    syncFooter: syncFooter
  };
})();
