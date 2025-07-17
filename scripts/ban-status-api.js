// ban-status-api.js
// Responds to ban status requests from other pages via postMessage

(function setupBanStatusAPI() {
  window.addEventListener('message', function(event) {
    // Only allow same-origin requests
    if (event.origin !== window.location.origin) return;
    if (!event.data || event.data.type !== 'CLTD_BAN_STATUS_REQUEST') return;
    // Check ban status using the same logic as cltdBanAPI
    var isBanned = false;
    if (window.cltdBanAPI && typeof window.cltdBanAPI.isBanned === 'function') {
      try {
        isBanned = window.cltdBanAPI.isBanned() === true;
      } catch (e) { isBanned = false; }
    }
    event.source.postMessage({
      type: 'CLTD_BAN_STATUS_RESPONSE',
      banned: isBanned
    }, event.origin);
  });
})();
