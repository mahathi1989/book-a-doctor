const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Get all doctor applications
const getAllDoctorApplications = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("userId", "name email phone");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Approve or reject doctor
const updateDoctorStatus = async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Update user role if approved
    if (status === "approved") {
      await User.findByIdAndUpdate(doctor.userId, { role: "doctor" });
    }

    // Notify the doctor
    await Notification.create({
      userId: doctor.userId,
      message: `Your doctor application has been ${status}. ${
        status === "approved"
          ? "You can now receive appointments!"
          : "Please contact support for more info."
      }`,
      type: "doctor_status",
    });

    res.json({ message: `Doctor ${status} successfully`, doctor });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "patient" });
    const totalDoctors = await Doctor.countDocuments({ status: "approved" });
    const pendingApplications = await Doctor.countDocuments({ status: "pending" });
    const Appointment = require("../models/Appointment");
    const totalAppointments = await Appointment.countDocuments();

    res.json({ totalUsers, totalDoctors, pendingApplications, totalAppointments });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getAllDoctorApplications, updateDoctorStatus, getAllUsers, getDashboardStats };
