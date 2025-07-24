// API for other pages to check ban status
window.cltdBanAPI = {
  isBanned: function() {
    // Returns true if a valid ban or permaBan is present
    // Use same logic as getBanData, but don't trigger reload or set new bans
    // Only check for presence of valid ban cookies or permaBan
    const cookies = Object.fromEntries(document.cookie.split(';').map(c => {
      const eq = c.indexOf('=');
      if (eq === -1) return [c.trim(), ''];
      return [c.slice(0, eq).trim(), decodeURIComponent(c.slice(eq + 1))];
    }));
    if (cookies['permaBan'] === '1') return true;
    let valid = true;
    for (let i = 0; i < 5; i++) {
      const masked = cookies['banData' + i];
      const hash = cookies['banHash' + i];
      if (!masked || !hash) { valid = false; break; }
      let part = '';
      try {
        part = atob(masked).split('').reverse().join('');
      } catch (e) { valid = false; break; }
      if (simpleHash(part, 'cltdnet_salt_2025' + i) !== hash) { valid = false; break; }
    }
    return valid;
  },
  getBanData: function() {
    // Returns ban data object or null if not banned
    if (!this.isBanned()) return null;
    // Use getBanData but don't trigger reload
    let data = null;
    try {
      const ls = localStorage.getItem('banData');
      if (ls) data = JSON.parse(ls);
    } catch (e) {}
    if (!data) {
      // Reconstruct from cookies
      let parts = [];
      const cookies = Object.fromEntries(document.cookie.split(';').map(c => {
        const eq = c.indexOf('=');
        if (eq === -1) return [c.trim(), ''];
        return [c.slice(0, eq).trim(), decodeURIComponent(c.slice(eq + 1))];
      }));
      for (let i = 0; i < 5; i++) {
        const masked = cookies['banData' + i];
        if (!masked) return null;
        let part = '';
        try {
          part = atob(masked).split('').reverse().join('');
        } catch (e) { return null; }
        parts.push(part);
      }
      try {
        data = JSON.parse(parts.join(''));
      } catch (e) { return null; }
    }
    return data;
  }
};
// This script dynamically updates Roblox ban page content based on URL parameters
// Requires offensiveitems.js to be loaded first

function getParam(name) {
  // Accept both ?a=1&b=2 and ?a=1?b=2 (nonstandard, but user uses ? as separator)
  let search = window.location.search;
  if (search.startsWith('?')) search = search.slice(1);
  // Replace all ? with & except the first
  search = search.replace(/\?/g, '&');
  const params = search.split('&');
  for (const param of params) {
    if (!param) continue;
    const [key, value] = param.split('=');
    if (key === name) return decodeURIComponent((value || '').replace(/[-+]/g, ' '));
  }
  return null;
}



// Helper: simple hash for salting/masking
function simpleHash(str, salt) {
  let hash = 0;
  str = str + (salt || '');
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

// Store ban data in both localStorage and multiple cookies for redundancy and anti-evasion
function setBanData(data) {
  try {
    localStorage.setItem('banData', JSON.stringify(data));
  } catch (e) {}

  // Split data into parts, salt, mask, and set multiple cookies
  const str = JSON.stringify(data);
  const salt = 'cltdnet_salt_2025';
  const partLen = Math.ceil(str.length / 5);
  for (let i = 0; i < 5; i++) {
    const part = str.slice(i * partLen, (i + 1) * partLen);
    const masked = btoa(part.split('').reverse().join(''));
    const hash = simpleHash(part, salt + i);
    document.cookie = `banData${i}=${encodeURIComponent(masked)}; path=/; max-age=2592000`;
    document.cookie = `banHash${i}=${hash}; path=/; max-age=2592000`;
  }
  // Trap/trick cookies
  document.cookie = `banTrap1=trap${Math.floor(Math.random()*100000)}; path=/; max-age=2592000`;
  document.cookie = `banTrap2=trap${Math.floor(Math.random()*100000)}; path=/; max-age=2592000`;
  document.cookie = `banTrap3=trap${Math.floor(Math.random()*100000)}; path=/; max-age=2592000`;
}



// Try to get ban data from localStorage first, then reconstruct from cookies
function getBanData() {
  let data = null;
  try {
    const ls = localStorage.getItem('banData');
    if (ls) data = JSON.parse(ls);
  } catch (e) {}
  if (!data) {
    // Reconstruct from cookies
    let parts = [];
    let valid = true;
    // Use a more robust cookie parser
    const cookies = Object.fromEntries(document.cookie.split(';').map(c => {
      const eq = c.indexOf('=');
      if (eq === -1) return [c.trim(), ''];
      return [c.slice(0, eq).trim(), decodeURIComponent(c.slice(eq + 1))];
    }));
    for (let i = 0; i < 5; i++) {
      const masked = cookies['banData' + i];
      const hash = cookies['banHash' + i];
      if (!masked || !hash) { valid = false; break; }
      let part = '';
      try {
        part = atob(masked).split('').reverse().join('');
      } catch (e) { valid = false; break; }
      if (simpleHash(part, 'cltdnet_salt_2025' + i) !== hash) { valid = false; break; }
      parts.push(part);
    }
    if (valid) {
      try {
        data = JSON.parse(parts.join(''));
      } catch (e) { valid = false; }
    }
    // If any part is missing or tampered, DO NOT trigger ban evasion, just return null
    if (!valid) {
      return null;
    }
  }
  // If permaBan cookie is set, always show perma ban
  if (document.cookie.includes('permaBan=1')) {
    // Always show the latest timestamp for ban evasion
    const now = new Date();
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const dd = now.getDate().toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const hour = now.getHours().toString().padStart(2, '0');
    const min = now.getMinutes().toString().padStart(2, '0');
    return {
      revRaw: `${yyyy.toString().slice(2)}${mm}${dd}-${hour}${min}`,
      modnot: 'bg',
      reason: 'Ban Evasion (Permanent)',
      offence: 'k'
    };
  }
  return data;
}

window.addEventListener('DOMContentLoaded', function() {
  // Get params from URL
  const revRaw = getParam('rev');
  const modnot = getParam('modnot');
  const reason = getParam('reason');
  const offence = getParam('offence');

  // If any param is present, set cookie and redirect to base page

  const hasParams = revRaw || modnot || reason || offence;
  if (hasParams) {
    setBanData({ revRaw, modnot, reason, offence });
    // Also store a browser fingerprint for extra ban evasion resistance
    try {
      const fp = getBrowserFingerprint();
      if (fp) localStorage.setItem('banFingerprint', fp);
    } catch (e) {}
    // Redirect to base page (remove all query params)
    const baseUrl = window.location.origin + window.location.pathname;
    window.location.replace(baseUrl);
    return;
  }

  // If no params, try to get from cookie


  let banData = getBanData();

  // If no ban data, redirect to index.html
  if (!banData) {
    window.location.href = '/index.html';
    return;
  }

  // Use ban data if present
  const finalRevRaw = (banData && banData.revRaw) || '';
  const finalModnot = (banData && banData.modnot) || '';
  const finalReason = (banData && banData.reason) || '';
  const finalOffence = (banData && banData.offence) || '';

  // Check browser fingerprint and re-ban if it matches
  try {
    const fp = getBrowserFingerprint();
    const storedFp = localStorage.getItem('banFingerprint');
    if (fp && storedFp && fp === storedFp && !banData) {
      // If fingerprint matches but no banData, re-ban with a generic message
      setBanData({ revRaw: '', modnot: '', reason: 'Ban evasion detected', offence: '' });
      window.location.reload();
      return;
    }
  } catch (e) {}
// Simple browser fingerprinting (not foolproof, but raises the bar)
function getBrowserFingerprint() {
  try {
    const nav = window.navigator;
    const fp = [
      nav.userAgent,
      nav.language,
      nav.platform,
      nav.hardwareConcurrency,
      nav.deviceMemory,
      nav.vendor,
      nav.product,
      nav.productSub,
      nav.maxTouchPoints,
      window.screen.width,
      window.screen.height,
      window.screen.colorDepth
    ].join('::');
    // Simple hash
    let hash = 0;
    for (let i = 0; i < fp.length; i++) {
      hash = ((hash << 5) - hash) + fp.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString();
  } catch (e) { return null; }
}

  // Format rev as readable string, always force readable output
  function formatRev(raw) {
    if (!raw) return '';
    // Accepts: 250708-330p or 250708-0330p
    // Always force readable output, even if input is not valid
    let yy = '', mm = '', dd = '', t = '', ap = '';
    const regex = /^(\d{2})(\d{2})(\d{2})-(\d{1,4})([ap]?)$/i;
    const match = raw.match(regex);
    if (match) {
      [, yy, mm, dd, t] = match;
      let year = 2000 + parseInt(yy, 10);
      let month = parseInt(mm, 10);
      let day = parseInt(dd, 10);
      // Parse time
      let hour = 0, min = 0;
      if (t.length === 4) {
        hour = parseInt(t.slice(0,2), 10);
        min = parseInt(t.slice(2), 10);
      } else if (t.length === 3) {
        hour = parseInt(t.slice(0,1), 10);
        min = parseInt(t.slice(1), 10);
      } else if (t.length === 2) {
        hour = parseInt(t, 10);
        min = 0;
      } else if (t.length === 1) {
        hour = parseInt(t, 10);
        min = 0;
      }
      // 12-hour time with AM/PM based on hour
      let displayHour = hour;
      let suffix = 'AM';
      if (hour === 0) {
        displayHour = 12;
        suffix = 'AM';
      } else if (hour < 12) {
        displayHour = hour;
        suffix = 'AM';
      } else if (hour === 12) {
        displayHour = 12;
        suffix = 'PM';
      } else {
        displayHour = hour - 12;
        suffix = 'PM';
      }
      const monthStr = month.toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      const minStr = min.toString().padStart(2, '0');
      return `${monthStr}/${dayStr}/${year} @ ${displayHour}:${minStr} ${suffix} (ET)`;
    } else {
      // fallback: just show the raw string, but force human readable for 190909-920p like codes
      const fallback = raw.replace(/[-+]/g, ' ');
      // Try to match fallback pattern
      const fallbackMatch = fallback.match(/(\d{2})(\d{2})(\d{2})\s+(\d{1,4})p?/i);
      if (fallbackMatch) {
        let [, yy, mm, dd, t] = fallbackMatch;
        let year = 2000 + parseInt(yy, 10);
        let month = parseInt(mm, 10);
        let day = parseInt(dd, 10);
        let hour = 0, min = 0;
        if (t.length === 4) {
          hour = parseInt(t.slice(0,2), 10);
          min = parseInt(t.slice(2), 10);
        } else if (t.length === 3) {
          hour = parseInt(t.slice(0,1), 10);
          min = parseInt(t.slice(1), 10);
        } else if (t.length === 2) {
          hour = parseInt(t, 10);
          min = 0;
        } else if (t.length === 1) {
          hour = parseInt(t, 10);
          min = 0;
        }
        // 12-hour time with AM/PM based on hour
        let displayHour = hour;
        let suffix = 'AM';
        if (hour === 0) {
          displayHour = 12;
          suffix = 'AM';
        } else if (hour < 12) {
          displayHour = hour;
          suffix = 'AM';
        } else if (hour === 12) {
          displayHour = 12;
          suffix = 'PM';
        } else {
          displayHour = hour - 12;
          suffix = 'PM';
        }
        const monthStr = month.toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');
        const minStr = min.toString().padStart(2, '0');
        return `${monthStr}/${dayStr}/${year} @ ${displayHour}:${minStr} ${suffix} (ET)`;
      }
      return fallback;
    }
  }

  // Set .start-date
  const revEl = document.querySelector('.start-date');
  if (revEl && finalRevRaw) revEl.innerHTML = 'Reviewed: <b>' + formatRev(finalRevRaw) + '</b>';

  // Set .moderator-note
  const modnotEl = document.querySelector('.moderator-note');
  if (modnotEl && finalModnot) {
    if (typeof getModNoteById === 'function' && /^[a-z]{1,2}$/i.test(finalModnot)) {
      modnotEl.innerHTML = 'Moderator Note: <b>' + getModNoteById(finalModnot) + '</b>';
    } else {
      modnotEl.innerHTML = 'Moderator Note: <b>' + finalModnot + '</b>';
    }
  }

  // Set .reason-thingy
  const reasonEl = document.querySelector('.reason-thingy');
  if (reasonEl && finalReason) reasonEl.innerHTML = 'Reason: <strong>' + finalReason + '</strong>';

  // Set .offensive-thingly
  const offenceEl = document.querySelector('.offensive-thingly');
  if (offenceEl && finalOffence && typeof getOffensiveItemById === 'function') {
    offenceEl.innerHTML = 'Offensive Item: <strong>' + getOffensiveItemById(finalOffence) + '</strong>';
  }
});
