const express = require("express");
const router = express.Router();
const { getMyNotifications, markAsRead, markAllAsRead, deleteNotification } = require("../controllers/notification.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// GET /api/notifications - Get user's notifications
router.get("/", verifyToken, getMyNotifications);

// PUT /api/notifications/:id/read - Mark notification as read
router.put("/:id/read", verifyToken, markAsRead);

// PUT /api/notifications/read-all - Mark all notifications as read
router.put("/read-all", verifyToken, markAllAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete("/:id", verifyToken, deleteNotification);

module.exports = router;
