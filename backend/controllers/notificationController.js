const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { isRead: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getNotifications, markAllRead };
