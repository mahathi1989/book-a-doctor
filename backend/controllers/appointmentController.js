const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Notification = require("../models/Notification");

// Book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const document = req.file ? req.file.filename : null;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Check slot availability
    const conflict = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $in: ["pending", "approved"] },
    });
    if (conflict) return res.status(400).json({ message: "Time slot not available" });

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      reason,
      document,
    });

    // Notify doctor
    await Notification.create({
      userId: doctor.userId,
      message: `New appointment request for ${date} at ${time}`,
      type: "appointment",
    });

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get patient's appointments
const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate({ path: "doctorId", populate: { path: "userId", select: "name" } })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get doctor's appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate("patientId", "name email phone")
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update appointment status (doctor)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, visitSummary, followUpNotes, prescription } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, visitSummary, followUpNotes, prescription },
      { new: true }
    ).populate("patientId", "name");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    // Notify patient
    await Notification.create({
      userId: appointment.patientId._id,
      message: `Your appointment on ${appointment.date} at ${appointment.time} has been ${status}`,
      type: "appointment",
    });

    res.json({ message: "Status updated", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Cancel appointment (patient)
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user.id },
      { status: "cancelled" },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment cancelled", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name email")
      .populate({ path: "doctorId", populate: { path: "userId", select: "name" } })
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAllAppointments,
};
