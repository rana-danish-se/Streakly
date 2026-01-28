import { pushAPI } from './api';

class PushNotificationService {
  constructor() {
    this.registration = null;
    this.subscription = null;
  }

  // Check if browser supports push notifications
  isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  // Convert VAPID key from base64 to Uint8Array
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Register service worker
  async registerServiceWorker() {
    try {
      if (!this.isSupported()) {
        throw new Error('Push notifications not supported');
      }

      this.registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });

      // Wait for service worker to be ready with timeout
      const readyPromise = navigator.serviceWorker.ready;
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Service Worker ready timeout')), 5000)
      );
      
      await Promise.race([readyPromise, timeoutPromise]);
      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  // Get current notification permission
  getPermission() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  // Request notification permission
  async requestPermission() {
    try {
      if (!this.isSupported()) {
        throw new Error('Notifications not supported');
      }

      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      return permission;
    } catch (error) {
      console.error('Permission request failed:', error);
      throw error;
    }
  }

  // Subscribe to push notifications
  async subscribe() {
    try {
      // Ensure service worker is registered
      if (!this.registration) {
        await this.registerServiceWorker();
      }

      // Get VAPID public key from server
      const { data } = await pushAPI.getPublicKey();
      const publicKey = data.publicKey;

      // Convert to Uint8Array
      const applicationServerKey = this.urlBase64ToUint8Array(publicKey);

      // Create push subscription
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      // Send subscription to server
      await pushAPI.subscribe(this.subscription.toJSON());

      return this.subscription;
    } catch (error) {
      console.error('Subscription failed:', error);
      throw error;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe() {
    try {
      if (!this.subscription) {
        const registration = await navigator.serviceWorker.ready;
        this.subscription = await registration.pushManager.getSubscription();
      }

      if (!this.subscription) {
        return;
      }

      const endpoint = this.subscription.endpoint;

      // Unsubscribe from browser
      await this.subscription.unsubscribe();

      // Notify server
      await pushAPI.unsubscribe(endpoint);

      this.subscription = null;
    } catch (error) {
      console.error('Unsubscribe failed:', error);
      throw error;
    }
  }

  // Check if user is subscribed
  async getSubscription() {
    try {
      // Don't wait for ready, as it hangs if no SW is registered
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        return null;
      }
      this.subscription = await registration.pushManager.getSubscription();
      return this.subscription;
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return null;
    }
  }

  // Complete setup flow
  async setupPushNotifications() {
    try {
      // Register service worker FIRST
      await this.registerServiceWorker();

      // Check if already subscribed
      const existingSubscription = await this.getSubscription();
      if (existingSubscription) {
        return existingSubscription;
      }

      // Request permission
      await this.requestPermission();

      // Subscribe
      await this.subscribe();

      return this.subscription;
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  }

  // Show local test notification (for testing)
  async showTestNotification() {
    try {
      if (!this.registration) {
        await this.registerServiceWorker();
      }

      await this.registration.showNotification('🧪 Test Notification', {
        body: 'Push notifications are working!',
        icon: '/icons/default-icon.png',
        badge: '/icons/badge.png',
        tag: 'test-notification',
        data: { url: '/' },
      });
    } catch (error) {
      console.error('Test notification failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new PushNotificationService();