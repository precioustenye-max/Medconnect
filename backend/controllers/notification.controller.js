const { Notification } = require("../models");

exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notifications = await Notification.findAll({
      where: { userId: Number(userId) },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });

    const unreadCount = await Notification.count({
      where: { userId: Number(userId), isRead: false },
    });

    return res.json({ items: notifications, unreadCount });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch notifications",
      details: error.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    const notificationId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Number.isInteger(notificationId) || notificationId <= 0) {
      return res.status(400).json({ message: "Invalid notification id" });
    }

    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (Number(notification.userId) !== Number(userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await notification.update({ isRead: true });

    return res.json({ message: "Notification marked as read" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update notification",
      details: error.message,
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Notification.update(
      { isRead: true },
      { where: { userId: Number(userId) } }
    );

    return res.json({ message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update notifications",
      details: error.message,
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user?.id;
    const notificationId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Number.isInteger(notificationId) || notificationId <= 0) {
      return res.status(400).json({ message: "Invalid notification id" });
    }

    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (Number(notification.userId) !== Number(userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await notification.destroy();

    return res.json({ message: "Notification deleted" });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete notification",
      details: error.message,
    });
  }
};
