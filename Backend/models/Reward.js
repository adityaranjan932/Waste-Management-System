const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // user who earned the points
  pointsEarned: { type: Number, required: true },
  reason: { type: String, required: true }, // e.g., "Waste Disposed", "Marketplace Sale"
}, { timestamps: true });

module.exports = mongoose.model("Reward", RewardSchema);
