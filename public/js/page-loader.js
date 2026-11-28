/**
 * Himachal Accountability Project — Site Loading Splash Screen
 * Inspired by clean centered emblem + tagline + 3-dot progress indicator.
 * Shows once per session on initial site entry and fades out smoothly.
 */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Show once per browser session so internal navigation stays instant
  try {
    if (sessionStorage.getItem('hap_loader_shown') === '1') return;
    sessionStorage.setItem('hap_loader_shown', '1');
  } catch (e) {}

  var overlay = document.createElement('div');
  overlay.id = 'hap-page-loader';
  overlay.className = 'hap-loader-overlay';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-label', 'Loading Himachal Accountability Project');
  overlay.innerHTML =
    '<div class="hap-loader-box">' +
      '<div class="hap-loader-ring-wrap">' +
        '<svg class="hap-loader-ring-svg" viewBox="0 0 160 160" aria-hidden="true">' +
          '<circle class="hap-loader-ring-track" cx="80" cy="80" r="74"></circle>' +
          '<circle class="hap-loader-ring-arc" cx="80" cy="80" r="74"></circle>' +
        '</svg>' +
        '<img src="images/hap_logo.png" alt="Himachal Accountability Project" class="hap-loader-logo">' +
      '</div>' +
      '<p class="hap-loader-text">Welcome to the Himachal Accountability Project<br><span>Independent Public Ledger &middot; 12 Districts</span></p>' +
      '<div class="hap-loader-dots" aria-hidden="true">' +
        '<span></span><span></span><span></span>' +
      '</div>' +
    '</div>';

  // Attach as early as possible to prevent flash of unstyled content
  var mount = function () {
    if (document.body && !document.getElementById('hap-page-loader')) {
      document.body.insertBefore(overlay, document.body.firstChild);
    }
  };
  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }

  var dismissed = false;
  function dismissLoader() {
    if (dismissed) return;
    dismissed = true;
    overlay.classList.add('hap-loader-hide');
    setTimeout(function () {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 450);
  }

  var minDisplayDone = false;
  var pageLoaded = document.readyState === 'complete';

  setTimeout(function () {
    minDisplayDone = true;
    if (pageLoaded) dismissLoader();
  }, 950);

  window.addEventListener('load', function () {
    pageLoaded = true;
    if (minDisplayDone) dismissLoader();
  });

  // Safety fallback so slow external resources never trap the user
  setTimeout(dismissLoader, 1800);
})();
