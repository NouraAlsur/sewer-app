/* عامل الخدمة: يستقبل الإشعارات والتطبيق مقفل */
importScripts("config.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

const cfg = self.SEWER_APP || {};
if (cfg.firebase && cfg.firebase.apiKey) {
  firebase.initializeApp(cfg.firebase);
  firebase.messaging();
}

/* الضغط على إشعار ظهر والتطبيق مفتوح: نرجع لنافذة التطبيق أو نفتحها */
self.addEventListener("notificationclick", (e) => {
  const d = e.notification.data || {};
  if (!d.sewer) return;
  e.notification.close();
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow(d.url || self.registration.scope);
  })());
});
