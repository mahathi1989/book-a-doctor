const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    reason: { type: String },
    document: { type: String },
    visitSummary: { type: String },
    followUpNotes: { type: String },
    prescription: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
