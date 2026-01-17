import webPush from "web-push";
// Configure web-push with your VAPID keys
webPush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);
export default webPush;
// WHY THIS FILE?
// - Centralized configuration for web-push
// - Sets up VAPID authentication once for all push notifications
// - Can be imported anywhere you need to send notifications
// - Keeps credentials secure using environment variables