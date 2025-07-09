// ban-checker.js
// Asks /testing/banned.html (or any page with ban-status-api.js) if the user is banned, and redirects if so

(function askBanStatusAndMonitor() {
  var banChecked = false;
  var banConfirmed = false;
  var BAN_PAGE = '/banned.html';
  var API_PAGE = '/banned.html'; // must have ban-status-api.js loaded
  var allowedPages = [
    '/terms.html',
    '/community-standards.html',
    '/privacy.html'
  ];

  function hasBanCookies() {
    // Check for any cookies with names containing "ban"
    const cookies = document.cookie.split(';').map(c => c.split('=')[0].trim());
    return cookies.some(name => name.toLowerCase().includes('ban'));
  }

  function isAllowedPage() {
    var path = window.location.pathname.toLowerCase();
    return allowedPages.includes(path);
  }

  function checkBan() {
    if (banConfirmed) return;
    // Only rely on cookies: if any ban cookies exist, redirect immediately
    if (hasBanCookies() && !isAllowedPage()) {
      banConfirmed = true;
      window.location.href = BAN_PAGE;
    }
  }
  // Initial check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkBan);
  } else {
    checkBan();
  }
  // Optionally, check every 10s
  setInterval(checkBan, 10000);
})();
