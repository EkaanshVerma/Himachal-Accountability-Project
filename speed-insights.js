// Vercel Speed Insights initialization
// This script dynamically loads and initializes Vercel Speed Insights
(function() {
  // Speed Insights queue initialization
  window.si = window.si || function () { 
    (window.siq = window.siq || []).push(arguments); 
  };
  
  // Load Speed Insights script from Vercel's infrastructure
  // The actual script path is provided by Vercel after enabling Speed Insights in the dashboard
  // This will be automatically injected when deployed to Vercel with Speed Insights enabled
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/speed-insights/script.js';
  document.head.appendChild(script);
})();
