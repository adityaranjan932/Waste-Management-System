const mongoose = require("mongoose");

const VanSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // driver (User with role "driver")
  vehicleNumber: { type: String, required: true },
  sector: { type: String, required: true }, // the sector where this van operates
  currentLocation: { type: String, default: "Depot" },
  status: { type: String, enum: ["idle", "on-duty"], default: "idle" },
}, { timestamps: true });

module.exports = mongoose.model("Van", VanSchema);
