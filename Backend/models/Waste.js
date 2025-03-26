const mongoose = require("mongoose");

const WasteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who uploaded the waste image
  imageUrl: { type: String, required: true }, // image location
  wasteType: { 
    type: String, 
    enum: ["plastic", "paper", "metal", "glass", "organic"], 
    required: true 
  },
  status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Waste", WasteSchema);
