// Cloudflare Worker for /support form
// Serves a help form and posts submissions to Discord webhook as an embed

const WEBHOOK_URL = globalThis.webhook;





addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});



async function handleRequest(request) {
  try {
    if (request.method === 'POST') {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        return await handleFormSubmission(formData);
      } else {
        return new Response('Unsupported content type', { status: 400 });
      }
    }

    return new Response(renderForm(), {
      headers: { 'content-type': 'text/html; charset=UTF-8' }
    });
  } catch (err) {
    return new Response(`Worker error: ${err.message}`, {
      status: 500,
      headers: { 'content-type': 'text/plain' }
    });
  }
}


function renderForm() {
  return `
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<style>
  body, .support-form-container, .support-form label, .support-form input, .support-form select, .support-form textarea, .support-form button {
    font-family: 'Inter', sans-serif !important;
  }
  .support-form-container { max-width: 520px; margin: 120px auto 40px; background: var(--background-accent); border-radius: var(--border-radius); box-shadow: 0 4px 32px 0 rgba(0,0,0,0.10); padding: 2.5rem 2rem; }
  .support-form-container h2 { text-align: center; margin-bottom: 1.5rem; }
  .support-form label { display: block; margin: 1.2rem 0 0.4rem; font-weight: 600; }
  .support-form input, .support-form select, .support-form textarea { width: 100%; padding: 0.7rem; border-radius: var(--border-radius); border: 1px solid var(--border-color); background: var(--background-base); color: var(--text-color); margin-bottom: 0.7rem; }
  .support-form textarea { min-height: 80px; }
  .support-form .hidden { display: none; }
  .support-form button { margin-top: 1.2rem; width: 100%; }
  .form-success, .form-error { text-align: center; margin: 1rem 0; font-weight: 600; }
  .form-success { color: var(--accent-color); }
  .form-error { color: #ff4d4d; }
  /* Navigation */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    border-radius: 32px !important;
    background: rgba(29, 29, 29, 0.55);
    box-shadow:
        0 4px 32px 0 rgba(0,0,0,0.10),
        0 0 41px 0 rgba(255,255,255,0.11) inset,
        0 0 0 3.5px rgba(255,255,255,0.18) inset;
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    overflow: visible;
    transition: background-color 0.3s, height 0.4s cubic-bezier(.77,0,.18,1), border-radius 0.4s cubic-bezier(.77,0,.18,1);
    height: 80px;
    isolation: isolate;
    /* Universal liquid glass FX */
    backdrop-filter: blur(3px) saturate(120%) contrast(110%);
    -webkit-backdrop-filter: blur(3px) saturate(120%) contrast(110%);
    filter: url(#glass-distortion);
    background-blend-mode: lighten;
}

.navbar::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: 32px;
    background: rgba(255,255,255,0.25);
    pointer-events: none;
    mix-blend-mode: lighten;
}

.navbar::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 8px;
    pointer-events: none;
    z-index: 2;
    background: linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.22) 100%);
    opacity: 0.8;
    filter: saturate(110%) contrast(120%) drop-shadow(0 0 6.4px rgba(255,255,255,0.18));
    mix-blend-mode: screen;
    border-radius: 32px 32px 0 0;
    transition: height 0.4s cubic-bezier(.77,0,.18,1), border-radius 0.4s cubic-bezier(.77,0,.18,1);
    box-shadow: 0 0 3.5px 0 rgba(255,255,255,0.25);
}

.navbar.scrolled {
    background: rgba(29, 29, 29, 0.80);
    height: 72px;
    border-radius: 32px !important;
}

.navbar.scrolled::before {
    height: 4px;
    border-radius: 32px 32px 0 0;
}

.navbar::selection, .navbar *::selection {
    background: rgba(255,255,255,0.18);
    color: #000;
}

/* Enhanced frosted glass effect for navbar (additive, no removal) */
.navbar {
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px) saturate(120%);
    -webkit-backdrop-filter: blur(20px) saturate(120%);
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    padding: 0 2rem;
}

.logo-img {
    height: 45px;
    width: auto;
    filter: none;
    transition: transform 0.22s cubic-bezier(.77,0,.18,1);
}

.logo-img:hover {
    transform: scale(1.05) rotate(-2deg);
    filter: none;
}

.nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav-links a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    transition: var(--transition);
}

.nav-links a:hover {
    color: var(--accent-color);
}

.mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
}

.mobile-menu-btn span {
    display: block;
    width: 24px;
    height: 2px;
    background-color: var(--text-color);
    margin: 4px 0;
    transition: var(--transition);
}

.mobile-menu-btn.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active span:nth-child(2) {
    opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
}

</style>
<link rel="stylesheet" href="styles.css">
<nav class="navbar">
  <div class="navbar-glass">
    <div class="nav-container">
      <img src="https://contentltd.net/assets/contentltd_white.webp" alt="ContentLTD Brand Logo" class="logo-img">
      <div class="nav-links">
        <a href="index.html#who-we-are">About</a>
        <a href="index.html#features">Services</a>
        <a href="index.html#ltdqsuite">The Bot</a>
        <a href="index.html#pricing">Pricing</a>
        <a href="index.html#faq">FAQ</a>
        <a href="https://discord.gg/P5d9CVZh" id="contact-navbar-btn">Contact</a>
        <a href="https://discord.gg/P5d9CVZh" id="join-discord-btn" class="cta-button">Join Discord</a>
      </div>
    </div>
  </div>
</nav>
<div class="support-form-container">
  <h2>Contact Support</h2>
  <form class="support-form" method="POST" enctype="multipart/form-data">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required autocomplete="email">
    <label for="discord">Discord Username</label>
    <input type="text" id="discord" name="discord" required placeholder="e.g. user#0000">
    <label for="topic">Topic</label>
    <select id="topic" name="topic" required>
      <option value="General">General</option>
      <option value="Safety Concern">Safety Concern</option>
      <option value="Report">Report</option>
    </select>
    <div id="general-fields">
      <label for="general-reason">Reason for ticket</label>
      <textarea id="general-reason" name="general-reason" placeholder="Describe your issue..."></textarea>
    </div>
    <div id="safety-fields" class="hidden">
      <label for="safety-username">Username of whom you're concerned about</label>
      <input type="text" id="safety-username" name="safety-username">
      <label for="safety-reason">Reason for concern</label>
      <textarea id="safety-reason" name="safety-reason"></textarea>
      <label for="safety-link">Message Link</label>
      <input type="url" id="safety-link" name="safety-link">
      <label for="safety-photo">Photo Evidence</label>
      <input type="file" id="safety-photo" name="safety-photo" accept="image/*">
      <label for="safety-additional">Additional Info (optional)</label>
      <textarea id="safety-additional" name="safety-additional"></textarea>
    </div>
    <div id="report-fields" class="hidden">
      <label for="report-username">Username of whom you're reporting</label>
      <input type="text" id="report-username" name="report-username">
      <label for="report-reason">Reason for report</label>
      <textarea id="report-reason" name="report-reason"></textarea>
      <label for="report-link">Message Link</label>
      <input type="url" id="report-link" name="report-link">
      <label for="report-photo">Photo Evidence</label>
      <input type="file" id="report-photo" name="report-photo" accept="image/*">
      <label for="report-additional">Additional Info (optional)</label>
      <textarea id="report-additional" name="report-additional"></textarea>
    </div>
    <div id="recaptcha-container" style="margin: 1.2rem 0; text-align: center;">
      <div class="g-recaptcha" data-sitekey="6LfI3W0rAAAAALcJaAlpKTPi8buASaZ_oe1rqRhn"></div>
    </div>
    <button type="submit" class="cta-button primary">Submit</button>
  </form>
  <div id="form-message"></div>
</div>

<script>
  // Show/hide conditional fields
  const topicSelect = document.getElementById('topic');
  const generalFields = document.getElementById('general-fields');
  const safetyFields = document.getElementById('safety-fields');
  const reportFields = document.getElementById('report-fields');
  function updateFields() {
    const val = topicSelect.value;
    generalFields.classList.toggle('hidden', val !== 'General');
    safetyFields.classList.toggle('hidden', val !== 'Safety Concern');
    reportFields.classList.toggle('hidden', val !== 'Report');
  }
  topicSelect.addEventListener('change', updateFields);
  updateFields();
</script>
<!-- No custom JS for v2 checkbox needed -->
`;
}



async function handleFormSubmission(formData) {
  try {
    const token = formData.get('g-recaptcha-response');

    // Only show the custom error if the captcha was not filled out at all
    if (!token || typeof token !== 'string' || token.trim() === '') {
      return new Response(renderForm() + `<script>document.getElementById('form-message').innerHTML='<div class="form-error">Couldn't submit: Captcha not completed. Please complete the captcha and try again.</div>';</script>`, {
        headers: { 'content-type': 'text/html; charset=UTF-8' }
      });
    }

    const secret = globalThis.recaptcha_secret;
    if (!secret) {
      return new Response('Server error: reCAPTCHA secret missing.', { status: 500 });
    }

    const recaptchaVerify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`
    });

    if (!recaptchaVerify.ok) {
      return new Response('Failed to reach reCAPTCHA server.', { status: 502 });
    }

    const recaptchaResult = await recaptchaVerify.json();

    // If the captcha was filled but is invalid, show the default error
    if (!recaptchaResult.success || (recaptchaResult.score !== undefined && recaptchaResult.score < 0.5)) {
      return new Response(renderForm() + `<script>document.getElementById('form-message').innerHTML='<div class="form-error">Couldn't submit: Incorrect captcha. Please try again.</div>';</script>`, {
        headers: { 'content-type': 'text/html; charset=UTF-8' }
      });
    }

    // At this point reCAPTCHA passed
    // Continue processing the rest of the formData here, e.g., sending to webhook

    // Extract fields
    const email = formData.get('email') || 'None';
    const discord = formData.get('discord') || 'None';
    const topic = formData.get('topic') || 'None';

    let embed = {
      title: 'Support Request',
      color: 0xFFBB00,
      fields: [
        { name: 'Submitter Info', value: `Discord: ${discord}\nEmail: ${email}\nReason for Support: ${topic}` }
      ]
    };

    if (topic === 'General') {
      embed.fields.push({ name: 'Support Reason', value: formData.get('general-reason') || 'None' });
    } else if (topic === 'Safety Concern') {
      embed.fields.push({ name: 'Username of whom you\'re concerned about', value: formData.get('safety-username') || 'None' });
      embed.fields.push({ name: 'Reason for concern', value: formData.get('safety-reason') || 'None' });
      embed.fields.push({ name: 'Message Link', value: formData.get('safety-link') || 'None' });
      embed.fields.push({ name: 'Photo Evidence', value: formData.get('safety-photo') && formData.get('safety-photo').name ? formData.get('safety-photo').name : 'None' });
      embed.fields.push({ name: 'Additional Info', value: formData.get('safety-additional') || 'None' });
    } else if (topic === 'Report') {
      embed.fields.push({ name: 'Username of whom you\'re reporting', value: formData.get('report-username') || 'None' });
      embed.fields.push({ name: 'Reason for report', value: formData.get('report-reason') || 'None' });
      embed.fields.push({ name: 'Message Link', value: formData.get('report-link') || 'None' });
      embed.fields.push({ name: 'Photo Evidence', value: formData.get('report-photo') && formData.get('report-photo').name ? formData.get('report-photo').name : 'None' });
      embed.fields.push({ name: 'Additional Info', value: formData.get('report-additional') || 'None' });
    }

    // Handle file upload (photo evidence)
    let file = null;
    if (topic === 'Safety Concern' && formData.get('safety-photo') && formData.get('safety-photo').size > 0) {
      file = formData.get('safety-photo');
    } else if (topic === 'Report' && formData.get('report-photo') && formData.get('report-photo').size > 0) {
      file = formData.get('report-photo');
    }

    // Send to Discord webhook
    let webhookPayload = { embeds: [embed] };
    let webhookHeaders = { 'Content-Type': 'application/json' };
    let webhookBody = JSON.stringify(webhookPayload);

    // If file is attached, send as multipart/form-data
    if (file) {
      const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substr(2);
      let body = '';
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name=\"payload_json\"\r\n\r\n${webhookBody}\r\n`;
      body += `--${boundary}\r\n`;
      body += `Content-Disposition: form-data; name=\"file\"; filename=\"${file.name}\"\r\n`;
      body += `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`;
      const fileArrayBuffer = await file.arrayBuffer();
      const bodyUint8 = new Uint8Array(body.length + fileArrayBuffer.byteLength + (`\r\n--${boundary}--\r\n`).length);
      let offset = 0;
      for (let i = 0; i < body.length; i++) bodyUint8[offset++] = body.charCodeAt(i);
      new Uint8Array(fileArrayBuffer).forEach(b => bodyUint8[offset++] = b);
      const end = `\r\n--${boundary}--\r\n`;
      for (let i = 0; i < end.length; i++) bodyUint8[offset++] = end.charCodeAt(i);
      webhookHeaders = { 'Content-Type': `multipart/form-data; boundary=${boundary}` };
      webhookBody = bodyUint8;
    }

    const WEBHOOK_URL = globalThis.webhook;
    const resp = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: webhookHeaders,
      body: webhookBody
    });

    if (resp.ok) {
      return new Response(renderForm() + `<script>document.getElementById('form-message').innerHTML='<div class='form-success'>Support request submitted! Our team will contact you soon.</div>';</script>`, {
        headers: { 'content-type': 'text/html; charset=UTF-8' }
      });
    } else {
      return new Response(renderForm() + `<script>document.getElementById('form-message').innerHTML='<div class='form-error'>There was an error submitting your request. Please try again later.</div>';</script>`, {
        headers: { 'content-type': 'text/html; charset=UTF-8' }
      });
    }
  } catch (err) {
    return new Response('Internal server error during form processing.', { status: 500 });
  }
}
