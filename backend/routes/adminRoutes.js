const express = require("express");
const router = express.Router();
const {
  getAllDoctorApplications,
  updateDoctorStatus,
  getAllUsers,
  getDashboardStats,
} = require("../controllers/adminController");
const { adminMiddleware } = require("../middleware/authMiddleware");

router.get("/doctors", adminMiddleware, getAllDoctorApplications);
router.put("/doctors/:id/status", adminMiddleware, updateDoctorStatus);
router.get("/users", adminMiddleware, getAllUsers);
router.get("/stats", adminMiddleware, getDashboardStats);

module.exports = router;
