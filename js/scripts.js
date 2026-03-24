 // ── CONTACT FORM — wired for AWS API Gateway ──
    const API_ENDPOINT = 'YOUR_API_GATEWAY_ENDPOINT_HERE'; // replace with your endpoint

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

      // loading state
      btn.disabled = true;
      text.textContent = '// Sending...';
      status.style.display = 'none';

      const payload = {
        name,
        email,
        company: document.getElementById('company').value.trim(),
        service,
        message,
        timestamp: new Date().toISOString(),
        source: 'tiltedllc.com'
      };

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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