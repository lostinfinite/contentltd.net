// ban-monitor.js
// Monitors for ban status using cltdBanAPI and redirects if banned


// Only run ban check after DOMContentLoaded and after cltdBanAPI is available
(function monitorBanStatus() {
  function checkBan() {
    // Defensive: only redirect if definitely banned
    if (window.cltdBanAPI && typeof window.cltdBanAPI.isBanned === 'function') {
      try {
        if (window.cltdBanAPI.isBanned() === true) {
          window.location.href = '/banned.html';
        }
      } catch (e) { /* ignore */ }
    }
  }
  function waitForAPIAndCheck() {
    if (window.cltdBanAPI && typeof window.cltdBanAPI.isBanned === 'function') {
      checkBan();
      setInterval(checkBan, 10000);
    } else {
      setTimeout(waitForAPIAndCheck, 100);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForAPIAndCheck);
  } else {
    waitForAPIAndCheck();
  }
})();
