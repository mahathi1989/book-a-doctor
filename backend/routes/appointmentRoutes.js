const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAllAppointments,
} = require("../controllers/appointmentController");
const { authMiddleware, doctorMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/book", authMiddleware, upload.single("document"), bookAppointment);
router.get("/all", adminMiddleware, getAllAppointments);
router.get("/patient", authMiddleware, getPatientAppointments);
router.get("/doctor", doctorMiddleware, getDoctorAppointments);
router.put("/:id/status", doctorMiddleware, updateAppointmentStatus);
router.put("/:id/cancel", authMiddleware, cancelAppointment);

module.exports = router;
