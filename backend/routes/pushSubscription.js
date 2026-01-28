
import express from "express";
import PushSubscription from "../models/PushSubscription.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get('/vapid-public-key', (req, res) => {
  res.json({
    success: true,
    publicKey: process.env.VAPID_PUBLIC_KEY
  });
});

router.post('/subscribe', protect, async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    let subscription = await PushSubscription.findOne({ endpoint });

    if (subscription) {
      subscription.user = req.user._id;
      subscription.keys = keys;
      subscription.isActive = true;
      subscription.userAgent = req.headers['user-agent'];
      await subscription.save();
    } else {
      subscription = await PushSubscription.create({
        user: req.user._id,
        endpoint,
        keys,
        userAgent: req.headers['user-agent']
      });
    }

    res.status(201).json({
      success: true,
      message: 'Subscribed to push notifications',
      data: { subscription }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error processing subscription'
    });
  }
});

router.post('/unsubscribe', protect, async (req, res) => {
  try {
    const { endpoint } = req.body;

    await PushSubscription.findOneAndUpdate(
      { endpoint, user: req.user._id },
      { isActive: false }
    );

    res.json({
      success: true,
      message: 'Unsubscribed from push notifications'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error unsubscribing'
    });
  }
});

router.get('/my-subscriptions', protect, async (req, res) => {
  try {
    const subscriptions = await PushSubscription.find({
      user: req.user._id,
      isActive: true
    });

    res.json({
      success: true,
      data: { subscriptions }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Error fetching subscriptions'
    });
  }
});

export default router;