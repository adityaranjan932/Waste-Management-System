const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  address: String,
  sector: String, // for van assignment
  password: { type: String, required: true }, // store hashed password
  accountType: { type: String, enum: ["user", "admin", "driver"], default: "user" },
  points: { type: Number, default: 0 }, // reward points
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
