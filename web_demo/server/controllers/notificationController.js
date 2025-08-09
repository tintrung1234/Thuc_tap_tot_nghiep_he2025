const NotificationService = require("../services/NotificationService");

const getNotificationsByUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const { page, limit, readStatus } = req.query;
    const { uid: currentUserId, role } = req.user;
    if (uid !== currentUserId && role !== "Admin") {
      throw new Error("Unauthorized");
    }
    const result = await NotificationService.getNotificationsByUser({
      userId: uid,
      page: parseInt(page),
      limit: parseInt(limit),
      readStatus,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, role } = req.user;
    const notification = await NotificationService.getNotificationById(
      id,
      uid,
      role
    );
    res.json(notification);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, role } = req.user;
    const notification = await NotificationService.markNotificationAsRead({
      notificationId: id,
      userId: uid,
      userRole: role,
    });
    res.json(notification);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { uid } = req.params;
    const { uid: currentUserId, role } = req.user;
    if (uid !== currentUserId && role !== "Admin") {
      throw new Error("Unauthorized");
    }
    const result = await NotificationService.markAllNotificationsAsRead({
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid, role } = req.user;
    const result = await NotificationService.deleteNotification({
      notificationId: id,
      userId: uid,
      userRole: role,
    });
    res.json(result);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};

module.exports = {
  getNotificationsByUser,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
