/* ============================================================
   Kedi Healthcare — Service Worker
   Handles: Background Push Notifications, Offline Cache
   ============================================================ */

const CACHE_NAME = 'kedi-v3';
const OFFLINE_ASSETS = [
  '/', '/kedi.html', '/home-3.html', '/assets/img/logo/logo.svg',
  '/assets/css/main.css', '/assets/css/kedi-optimise.css'
];

/* ── Install: pre-cache core assets ───────────────────── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: clear old caches ───────────────────────── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: network-first with cache fallback ─────────── */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

/* ── Push: receive server push, show notification ─────── */
self.addEventListener('push', e => {
  let data = { title: 'Kedi Healthcare', body: 'You have a new notification.', icon: '/assets/img/logo/logo.svg', url: '/' };
  try { data = { ...data, ...e.data.json() }; } catch (_) {}

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/assets/img/logo/logo.svg',
      badge: '/assets/img/favicon.png',
      tag: data.tag || 'kedi-push-' + Date.now(),
      data: { url: data.url || '/' },
      vibrate: [200, 100, 200],
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [
        { action: 'view', title: '👁 View' },
        { action: 'dismiss', title: '✕ Dismiss' }
      ]
    })
  );
});

/* ── Notification click ────────────────────────────────── */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const existing = clients.find(c => c.url.includes(url));
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    })
  );
});

/* ── Message from page: show notification ─────────────── */
self.addEventListener('message', e => {
  if (e.data?.type === 'SHOW_NOTIFICATION') {
    const d = e.data.payload;
    self.registration.showNotification(d.title, {
      body: d.body,
      icon: d.icon || '/assets/img/logo/logo.svg',
      badge: '/assets/img/favicon.png',
      tag: d.tag || 'kedi-' + Date.now(),
      data: { url: d.url || '/' },
      vibrate: [150, 80, 150],
      actions: [
        { action: 'view', title: '👁 View' },
        { action: 'dismiss', title: '✕ Dismiss' }
      ]
    });
  }
});
