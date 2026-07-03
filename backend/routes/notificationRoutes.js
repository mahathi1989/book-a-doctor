const express = require("express");
const router = express.Router();
const { getNotifications, markAllRead } = require("../controllers/notificationController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getNotifications);
router.put("/read-all", authMiddleware, markAllRead);

module.exports = router;
