const mongoose = require("mongoose");

const MarketplaceSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // seller's ID
  itemName: { type: String, required: true },
  category: { type: String, enum: ["plastic", "paper", "metal", "glass"], required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["available", "sold"], default: "available" },
}, { timestamps: true });

module.exports = mongoose.model("Marketplace", MarketplaceSchema);
