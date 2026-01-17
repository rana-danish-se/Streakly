// scripts/generateVapidKeys.js
// Run this ONCE to generate your VAPID keys

import webPush from 'web-push';

// Generate VAPID keys (Voluntary Application Server Identification)
const vapidKeys = webPush.generateVAPIDKeys();

console.log('VAPID Keys Generated:');
console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);
console.log('\nAdd these to your .env file:');
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);

// WHY VAPID KEYS?
// - They authenticate your server with push services
// - They prove you're authorized to send push notifications
// - They're like your app's identity for push notifications
// - Public key goes to the client, private key stays on server