/**
 * Himachal Accountability Project (HAP) — Global Configuration & Safeguards
 * Config single-source for all pages, scripts, and components.
 */

const HAP_CONFIG = {
  // Statistical Safeguards
  MIN_SAMPLE: 10, // Minimum reports before a rate, score, or ranking is calculated/displayed

  // Dates & Freshness
  LAST_REVIEWED: "20 November 2026",
  CURRENT_YEAR: new Date().getFullYear(),

  // Financial & Operational Metrics
  RAISED_AMOUNT: 0, // Current quarter donations raised in INR
  QUARTERLY_GOAL: 185000,
  MONTHLY_DONORS_COUNT: 0,
  PAYMENT_PROCESSOR: "Milaap",
  PAYMENT_URL: "https://milaap.org/fundraisers/support-people-of-himachal",

  // Licensing & Open Data
  DATA_LICENSE: "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
  LICENSE_SHORT: "CC BY-SA 4.0",

  // Channels & Socials
  CONTACT_EMAIL: "contact@himachalaccountability.org",
  INSTAGRAM_URL: "https://www.instagram.com/thehapofficial/",
  
  // Pipeline Standards
  VERIFICATION_WINDOW: "24–72 hours",
  MAX_UPLOAD_MB: 10
};

// Global export for vanilla scripts
if (typeof window !== 'undefined') {
  window.HAP_CONFIG = HAP_CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HAP_CONFIG;
}

