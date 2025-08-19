const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/user/:uid",
  authMiddleware,
  notificationController.getNotificationsByUser
);
router.get("/:id", authMiddleware, notificationController.getNotificationById);
router.put(
  "/:id/read",
  authMiddleware,
  notificationController.markNotificationAsRead
);
router.put(
  "/user/:uid/read-all",
  authMiddleware,
  notificationController.markAllNotificationsAsRead
);
router.delete(
  "/:id",
  authMiddleware,
  notificationController.deleteNotification
);

module.exports = router;
