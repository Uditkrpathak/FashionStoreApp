import Notification from '../models/Notification.js';
import User from '../models/User.js';

// ── Expo Push Helper ──────────────────────────────────────────────────────────
const sendExpoPush = async ({ pushToken, title, body, data = {} }) => {
  if (!pushToken || !pushToken.startsWith('ExponentPushToken')) return;
  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        to:    pushToken,
        title,
        body,
        data,
        sound: 'default',
        priority: 'high',
        channelId: 'default',
      }),
    });
  } catch (_) { /* push failure is non-fatal */ }
};

// ── In-App Notifications ──────────────────────────────────────────────────────
export const getNotifications = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, link, data = {} } = req.body;

    // Save in-app notification
    const notification = new Notification({ userId, title, message, type, link });
    await notification.save();

    // Send Expo push if user has token + preference allows it
    try {
      const user = await User.findById(userId).select('pushToken notificationPreferences');
      if (user?.pushToken) {
        const prefs = user.notificationPreferences || {};
        const categoryMap = {
          order: prefs.orderUpdates,
          promo: prefs.promotional,
          stock: prefs.backInStock,
          price: prefs.priceDrop,
        };
        const shouldSend = categoryMap[type] !== false && prefs.transactional !== false;
        if (shouldSend) {
          await sendExpoPush({ pushToken: user.pushToken, title, body: message, data });
        }
      }
    } catch (_) { /* push failure is non-fatal */ }

    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });

    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    await Notification.updateMany({ userId }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Push Token Registration ───────────────────────────────────────────────────
export const registerPushToken = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { pushToken } = req.body;
    if (!pushToken) return res.status(400).json({ success: false, message: 'pushToken is required' });

    await User.findByIdAndUpdate(userId, { pushToken });
    res.json({ success: true, message: 'Push token registered' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Notification Preferences ─────────────────────────────────────────────────
export const updateNotificationPreferences = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { promotional, orderUpdates, backInStock, priceDrop } = req.body;
    const prefs = {};
    if (promotional   !== undefined) prefs['notificationPreferences.promotional']  = promotional;
    if (orderUpdates  !== undefined) prefs['notificationPreferences.orderUpdates'] = orderUpdates;
    if (backInStock   !== undefined) prefs['notificationPreferences.backInStock']  = backInStock;
    if (priceDrop     !== undefined) prefs['notificationPreferences.priceDrop']    = priceDrop;
    // transactional is always true — cannot be turned off

    const user = await User.findByIdAndUpdate(userId, { $set: prefs }, { new: true })
      .select('notificationPreferences');
    res.json({ success: true, notificationPreferences: user.notificationPreferences });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
