import { notificationStore } from '../services/notificationStore.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const notifications = await notificationStore.getByUser(userId);
    const unreadCount = notifications.filter(n => !n.read).length;

    return res.json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch notifications'
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const updated = await notificationStore.markAsRead(req.params.id, userId);
    return res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark notification as read'
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    await notificationStore.markAllAsRead(userId);
    return res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update notifications'
    });
  }
};
