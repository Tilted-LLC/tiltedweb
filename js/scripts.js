 // ── CONTACT FORM — wired for AWS API Gateway ──
    const API_ENDPOINT = 'YOUR_API_GATEWAY_ENDPOINT_HERE'; // replace with your endpoint
    const CONTACT_FORM_KEY = 'YOUR_CONTACT_FORM_KEY_HERE'; // replace with your form key
    const RECAPTCHA_SITE_KEY = '6Lcz_pYsAAAAALqlsoxgBu3F7wniUQIkS-hTz4s9';

    document.getElementById('contactForm').addEventListener('submit', async function(e) {
      e.preventDefault();

      const btn    = document.getElementById('submitBtn');
      const text   = document.getElementById('submitText');
      const status = document.getElementById('formStatus');

      // basic validation
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !service || !message) {
        status.textContent = '// All required fields must be filled in.';
        status.className = 'form-status error';
        status.style.display = 'block';
        return;
      }

      // If honeypot is filled, it's a bot — silently fail
      if (document.getElementById('honeypot').value !== '') {
        return;
      }

      // loading state
      btn.disabled = true;
      text.textContent = '// Sending...';
      status.style.display = 'none';

      try {
        const recaptchaToken = await new Promise((resolve, reject) => {
          if (typeof grecaptcha === 'undefined') return reject(new Error('reCAPTCHA not loaded'));
          grecaptcha.ready(() => {
            grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'contact' }).then(resolve, reject);
          });
        });

        const payload = {
          name,
          email,
          company: document.getElementById('company').value.trim(),
          service,
          message,
          timestamp: new Date().toISOString(),
          source: 'tiltedllc.com',
          honeypot: document.getElementById('honeypot').value,
          recaptchaToken
        };

        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Contact-Key': CONTACT_FORM_KEY
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          status.textContent = '// exit code: 0 — Message sent. We\'ll be in touch within one business day.';
          status.className = 'form-status success';
          status.style.display = 'block';
          this.reset();
          text.textContent = '❯ Send message';
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (err) {
        status.textContent = `// Error: ${err.message}. Try emailing info@tiltedllc.com directly.`;
        status.className = 'form-status error';
        status.style.display = 'block';
        text.textContent = '❯ Send message';
      } finally {
        btn.disabled = false;
      }
    });
