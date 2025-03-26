const mongoose = require("mongoose");

const PickupRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who requested the pickup
  wasteId: { type: mongoose.Schema.Types.ObjectId, ref: "Waste", required: true }, // the waste to pick up
  vanId: { type: mongoose.Schema.Types.ObjectId, ref: "Van" }, // the van assigned for pickup
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  scheduledTime: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model("PickupRequest", PickupRequestSchema);
