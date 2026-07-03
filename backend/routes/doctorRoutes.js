const express = require("express");
const router = express.Router();
const {
  applyDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
} = require("../controllers/doctorController");
const { authMiddleware, doctorMiddleware } = require("../middleware/authMiddleware");

router.post("/apply", authMiddleware, applyDoctor);
router.get("/", authMiddleware, getAllDoctors);
router.get("/profile", doctorMiddleware, getDoctorProfile);
router.put("/profile", doctorMiddleware, updateDoctorProfile);
router.get("/:id", authMiddleware, getDoctorById);

module.exports = router;
