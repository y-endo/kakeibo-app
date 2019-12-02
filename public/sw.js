const CACHE_VERSION = 'test10';
const resources = [
  'index.html',
  'assets/img/icon-search.svg',
  'assets/img/icon-close.svg',
  'assets/img/icon-refresh.svg',
  'assets/js/app.js',
  'assets/fonts/Monda-Bold.ttf',
  'assets/fonts/Monda-Regular.ttf',
  '/__/firebase/6.2.0/firebase-app.js',
  '/__/firebase/6.2.0/firebase-messaging.js'
];

// プッシュ通知を受け取るための処理。
importScripts('/__/firebase/6.2.0/firebase-app.js');
importScripts('/__/firebase/6.2.0/firebase-messaging.js');
firebase.initializeApp({
  messagingSenderId: '364313239'
});
if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();

  // バックグランドでのメッセージ受信処理
  messaging.setBackgroundMessageHandler(payload => {
    const title = payload.notification.title;
    const options = {
      body: payload.notification.body,
      icon: payload.notification.icon
    };

    return self.registration.showNotification(title, options);
  });
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(resources)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cache => {
      cache.map(name => {
        if (CACHE_VERSION !== name) caches.delete(name);
      });
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) return response;
      return fetch(e.request);
    })
  );
});
