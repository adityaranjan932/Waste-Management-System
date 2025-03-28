const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true }, // store phone number instead of email
  otp: { type: String, required: true },           // OTP code
  createdAt: { type: Date, default: Date.now, expires: 300 } // expires after 5 minutes (300 seconds)
});

module.exports = mongoose.model("OTP", OTPSchema);
