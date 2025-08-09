const Notification = require("../models/Notification");
const User = require("../models/User");
const Post = require("../models/Post");
const AuditLog = require("../models/AuditLog");

class NotificationService {
  static async getNotificationsByUser({
    userId,
    page = 1,
    limit = 10,
    readStatus,
  }) {
    const user = await User.findOne({ uid: userId, isDeleted: false });
    if (!user) throw new Error("User not found");

    const skip = (page - 1) * limit;
    const query = { userId, isDeleted: false };
    if (readStatus !== undefined) query.isRead = readStatus === "true";

    const notifications = await Notification.find(query)
      .populate("userId", "username")
      .populate({
        path: "relatedId",
        match: { isDeleted: false },
        select: "title slug",
        model: Post,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("userId type message relatedId isRead createdAt");
    const total = await Notification.countDocuments(query);
    return { notifications, total, page, limit };
  }

  static async getNotificationById(notificationId, userId, userRole) {
    const notification = await Notification.findOne({
      _id: notificationId,
      isDeleted: false,
    })
      .populate("userId", "username")
      .populate({
        path: "relatedId",
        match: { isDeleted: false },
        select: "title slug",
        model: Post,
      })
      .select("userId type message relatedId isRead createdAt");
    if (!notification) throw new Error("Notification not found");
    if (notification.userId.toString() !== userId && userRole !== "Admin") {
      throw new Error("Unauthorized");
    }
    return notification;
  }

  static async markNotificationAsRead({ notificationId, userId, userRole }) {
    const notification = await Notification.findOne({
      _id: notificationId,
      isDeleted: false,
    });
    if (!notification) throw new Error("Notification not found");
    if (notification.userId.toString() !== userId && userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    notification.isRead = true;
    await notification.save();

    await AuditLog.logAction({
      userId,
      action: "update",
      resource: "Notification",
      resourceId: notification._id,
      details: `Marked notification as read: ${notification.message}`,
    });

    return notification;
  }

  static async markAllNotificationsAsRead({ userId, userRole }) {
    const user = await User.findOne({ uid: userId, isDeleted: false });
    if (!user) throw new Error("User not found");

    const result = await Notification.updateMany(
      { userId, isRead: false, isDeleted: false },
      { isRead: true }
    );

    await AuditLog.logAction({
      userId,
      action: "update",
      resource: "Notification",
      resourceId: null,
      details: `Marked all notifications as read for user ${userId}`,
    });

    return { message: `${result.modifiedCount} notifications marked as read` };
  }

  static async deleteNotification({ notificationId, userId, userRole }) {
    const notification = await Notification.findOne({
      _id: notificationId,
      isDeleted: false,
    });
    if (!notification) throw new Error("Notification not found");
    if (notification.userId.toString() !== userId && userRole !== "Admin") {
      throw new Error("Unauthorized");
    }

    await Notification.updateOne({ _id: notificationId }, { isDeleted: true });

    await AuditLog.logAction({
      userId,
      action: "soft_delete",
      resource: "Notification",
      resourceId: notification._id,
      details: `Deleted notification: ${notification.message}`,
    });

    return { message: "Notification deleted" };
  }
}

module.exports = NotificationService;
