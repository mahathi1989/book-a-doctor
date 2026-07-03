const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["appointment", "doctor_status", "general"],
      default: "general",
    },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
