import { Notification } from '../models/Notification.js';
import { isDatabaseConnected } from '../config/db.js';

class NotificationStore {
  constructor() {
    this.memoryNotifications = [];
  }

  async create({ recipient, sender, type, exchangeRequest, listing, title, message }) {
    const recipientId = (recipient._id || recipient.id || recipient).toString();
    const senderId = (sender._id || sender.id || sender).toString();
    const requestId = exchangeRequest ? (exchangeRequest._id || exchangeRequest.id || exchangeRequest).toString() : null;
    const listingId = listing ? (listing._id || listing.id || listing).toString() : null;

    if (isDatabaseConnected()) {
      try {
        const notif = await Notification.create({
          recipient: recipientId,
          sender: senderId,
          type,
          exchangeRequest: requestId,
          listing: listingId,
          title,
          message,
          read: false
        });
        return notif.toJSON();
      } catch (err) {
        console.warn('DB notification creation fallback:', err.message);
      }
    }

    const notifObj = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      recipient: recipientId,
      sender: senderId,
      type,
      exchangeRequest: requestId,
      listing: listingId,
      title,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };

    this.memoryNotifications.unshift(notifObj);
    return notifObj;
  }

  async getByUser(userId) {
    const userIdStr = (userId._id || userId.id || userId).toString();

    if (isDatabaseConnected()) {
      try {
        const notifs = await Notification.find({ recipient: userIdStr })
          .sort({ createdAt: -1 })
          .limit(50)
          .populate('sender', 'name avatar department isCollegeVerified')
          .populate('listing', 'title images imageUrl category price listingType')
          .lean();

        return notifs.map(n => ({
          ...n,
          id: n._id.toString()
        }));
      } catch (err) {
        console.warn('DB notification query fallback:', err.message);
      }
    }

    return this.memoryNotifications
      .filter(n => n.recipient === userIdStr)
      .slice(0, 50);
  }

  async markAsRead(notificationId, userId) {
    const userIdStr = (userId._id || userId.id || userId).toString();

    if (isDatabaseConnected()) {
      try {
        const notif = await Notification.findOneAndUpdate(
          { _id: notificationId, recipient: userIdStr },
          { read: true },
          { new: true }
        );
        if (notif) return { ...notif.toJSON(), id: notif._id.toString() };
      } catch (err) {
        console.warn('DB markAsRead fallback:', err.message);
      }
    }

    const index = this.memoryNotifications.findIndex(
      n => (n.id === notificationId || n._id === notificationId) && n.recipient === userIdStr
    );
    if (index !== -1) {
      this.memoryNotifications[index].read = true;
      return this.memoryNotifications[index];
    }
    return null;
  }

  async markAllAsRead(userId) {
    const userIdStr = (userId._id || userId.id || userId).toString();

    if (isDatabaseConnected()) {
      try {
        await Notification.updateMany({ recipient: userIdStr, read: false }, { read: true });
        return { success: true };
      } catch (err) {
        console.warn('DB markAllAsRead fallback:', err.message);
      }
    }

    this.memoryNotifications.forEach(n => {
      if (n.recipient === userIdStr) {
        n.read = true;
      }
    });

    return { success: true };
  }
}

export const notificationStore = new NotificationStore();
