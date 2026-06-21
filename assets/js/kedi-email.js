/**
 * Kedi Healthcare — Email Subscribe Widget
 * ==========================================
 * Auto-hooks into existing newsletter <form> elements on the site.
 * Also provides KediEmail public API for manual calls.
 *
 * Usage: <script src="assets/js/kedi-email.js" defer></script>
 */
(function () {
  'use strict';

  const API = window.KEDI_EMAIL_API || 
              (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
              ? 'http://localhost:3003/api/email' 
              : 'https://kedicare.netlify.app/api/email');

  /* ── Inline toast (reuses KediNotify if loaded) ──── */
  function toast(type, msg) {
    if (window.KediNotify) {
      KediNotify.send({ type, title: type === 'success' ? '📧 Email' : '⚠️ Email', body: msg });
    } else {
      alert(msg);
    }
  }

  /* ── Core subscribe call ─────────────────────────── */
  async function subscribe(email, name = '', tags = []) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast('warning', 'Please enter a valid email address.');
      return { success: false };
    }
    try {
      const r = await fetch(API + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, tags })
      });
      const data = await r.json();
      if (data.success) {
        toast('success', '✅ Subscribed! Check your inbox for a welcome email.');
        localStorage.setItem('kedi_subscribed', email);
      } else {
        toast('warning', data.message || data.error || 'Could not subscribe.');
      }
      return data;
    } catch (err) {
      // Offline fallback — queue for when back online
      const queue = JSON.parse(localStorage.getItem('kedi_sub_queue') || '[]');
      queue.push({ email, name, tags, ts: Date.now() });
      localStorage.setItem('kedi_sub_queue', JSON.stringify(queue));
      toast('info', 'You\'re offline. We\'ll subscribe you when connection is restored.');
      return { success: false, queued: true };
    }
  }

  /* ── Retry queued subscriptions on connection ────── */
  window.addEventListener('online', async () => {
    const queue = JSON.parse(localStorage.getItem('kedi_sub_queue') || '[]');
    if (!queue.length) return;
    for (const item of queue) await subscribe(item.email, item.name, item.tags);
    localStorage.removeItem('kedi_sub_queue');
  });

  /* ── Auto-hook existing newsletter forms ──────────── */
  function hookForms() {
    // Target forms with email inputs (newsletter, footer subscribe, etc.)
    const forms = document.querySelectorAll('form.newslater__form, .newsletter-form, #newsletter-form, [data-kedi-subscribe]');

    forms.forEach(form => {
      if (form.dataset.kediHooked) return;
      form.dataset.kediHooked = '1';
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"], input[type="text"]');
        const nameInput  = form.querySelector('input[name="name"], input[placeholder*="name" i]');
        if (!emailInput) return;
        const btn = form.querySelector('button, input[type="submit"]');
        const origText = btn?.textContent || '';
        if (btn) { btn.textContent = 'Subscribing...'; btn.disabled = true; }
        await subscribe(emailInput.value.trim(), nameInput?.value?.trim() || '');
        emailInput.value = '';
        if (btn) { btn.textContent = origText; btn.disabled = false; }
      });
    });

    // Also hook inline inputs with data-kedi-subscribe attribute
    document.querySelectorAll('input[data-kedi-email]').forEach(inp => {
      if (inp.dataset.kediHooked) return;
      inp.dataset.kediHooked = '1';
      const btn = document.querySelector('[data-kedi-subscribe-btn]') ||
                  inp.closest('div')?.querySelector('button');
      if (btn) btn.addEventListener('click', () => subscribe(inp.value.trim()));
    });
  }

  /* ── Public API ──────────────────────────────────── */
  window.KediEmail = {
    subscribe,

    /** Send order confirmation after checkout */
    async orderConfirm(orderData) {
      try {
        const r = await fetch(API + '/order-confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        return await r.json();
      } catch (e) { console.warn('[KediEmail] Order confirm failed:', e.message); }
    },

    /** Admin: broadcast to all subscribers */
    async broadcast({ subject, type, title, body, cta, ctaUrl }) {
      const r = await fetch(API + '/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, type, title, body, cta, ctaUrl })
      });
      return await r.json();
    },

    /** Admin: get subscribers count */
    async getSubscribers() {
      const r = await fetch(API + '/subscribers');
      return await r.json();
    },

    /** Admin: get sent log */
    async getSentLog() {
      const r = await fetch(API + '/sent-log');
      return await r.json();
    }
  };

  /* ── Init ────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hookForms);
  } else {
    hookForms();
  }

  // Re-run hookForms after dynamic content loads (SPA / delayed render)
  setTimeout(hookForms, 2000);

})();
