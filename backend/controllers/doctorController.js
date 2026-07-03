const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Apply as Doctor
const applyDoctor = async (req, res) => {
  try {
    const existing = await Doctor.findOne({ userId: req.user.id });
    if (existing) return res.status(400).json({ message: "Application already submitted" });

    const doctor = await Doctor.create({ ...req.body, userId: req.user.id });

    // Notify admins
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        message: `New doctor application received from ${req.body.name || "a user"}`,
        type: "doctor_status",
      });
    }

    res.status(201).json({ message: "Application submitted successfully", doctor });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all approved doctors
const getAllDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    let query = { status: "approved" };
    if (specialization) query.specialization = new RegExp(specialization, "i");

    let doctors = await Doctor.find(query).populate("userId", "name email profilePic");

    if (search) {
      const term = search.toLowerCase();
      doctors = doctors.filter(
        (d) =>
          d.userId?.name?.toLowerCase().includes(term) ||
          d.specialization?.toLowerCase().includes(term) ||
          d.address?.toLowerCase().includes(term)
      );
    }

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single doctor
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("userId", "name email");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get doctor profile by userId
const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id }).populate("userId", "name email");
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.user.id },
      { ...req.body },
      { new: true }
    );
    res.json({ message: "Profile updated", doctor });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { applyDoctor, getAllDoctors, getDoctorById, getDoctorProfile, updateDoctorProfile };
