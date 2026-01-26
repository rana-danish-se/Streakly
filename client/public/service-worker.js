// public/service-worker.js
// IMPORTANT: This file must be at the root of the public folder
/* eslint-disable no-undef */

// Service worker version - increment to force update
const CACHE_VERSION = 'v1';
const CACHE_NAME = `journey-tracker-${CACHE_VERSION}`;

// Listen for push events from server
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push notification received:', event);

  // Default notification data
  let notificationData = {
    title: 'New Notification',
    body: 'You have a new update',
    icon: '/icons/default-icon.png',
    badge: '/icons/badge.png',
  };

  // Parse notification payload
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (error) {
      console.error('[Service Worker] Failed to parse notification data:', error);
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon || '/icons/default-icon.png',
    badge: notificationData.badge || '/icons/badge.png',
    vibrate: [200, 100, 200], // Vibration pattern
    tag: notificationData.tag || 'default-tag',
    data: notificationData.data || {},
    requireInteraction: false,
    actions: notificationData.actions || [],
  };

  // Show the notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
      .then(() => console.log('[Service Worker] Notification shown successfully'))
      .catch(err => console.error('[Service Worker] Failed to show notification:', err))
  );
});

// Listen for notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification clicked:', event);
  event.notification.close();

  // Get URL from notification data
  const urlToOpen = event.notification.data?.url || '/';
  const fullUrl = new URL(urlToOpen, self.location.origin).href;

  // Open or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        // Check if already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === fullUrl && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(fullUrl);
        }
      })
  );
});

// Listen for notification close
self.addEventListener('notificationclose', function(event) {
  console.log('[Service Worker] Notification closed:', event);
  // Can send analytics here
});

// Install event - cache static assets
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Attempt to cache core assets but don't fail install if they're missing in dev
      return cache.addAll([
        '/',
        '/index.html',
        '/icons/default-icon.png',
        '/icons/badge.png',
      ]).catch(err => {
        console.warn('[Service Worker] Cache addAll failed, but continuing install:', err);
      });
    })
  );
  
  // Force waiting service worker to become active
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', function(event) {
  // Skip chrome extension requests
  if (event.request.url.includes('chrome-extension://')) {
    return;
  }

  // Skip API requests - let the browser handle them directly
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});

// WHY THESE EVENT LISTENERS?
// - push: Receives notifications from server, shows them to user
// - notificationclick: Handles user clicking notification
// - notificationclose: Optional analytics tracking
// - install: Caches important assets for offline use
// - activate: Cleans up old caches when updating
// - fetch: Enables offline functionality by serving cached content
// - skipWaiting: Updates service worker immediately
// - clients.claim: Takes control of all pages right away