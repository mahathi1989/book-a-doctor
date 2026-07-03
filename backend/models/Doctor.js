const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    fees: { type: Number, required: true },
    qualification: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    timings: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "17:00" },
    },
    availableDays: {
      type: [String],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    about: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    profilePic: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
