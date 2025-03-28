const Razorpay = require("razorpay"); // Import Razorpay package
const crypto = require("crypto"); // Import crypto for signature verification
const Payment = require("../models/Payment"); // Import the Payment model
require("dotenv").config(); // Load environment variables

// Initialize Razorpay instance with credentials from .env
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Razorpay key ID from env
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Razorpay key secret from env
});

// Controller to create a payment order
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount, userId } = req.body; // Get payment amount and user ID from request
    const options = {
      amount: amount * 100, // Convert amount from INR to paise
      currency: "INR", // Set currency to INR
      receipt: `receipt_order_${Date.now()}`, // Create a unique receipt identifier
    };
    const order = await razorpayInstance.orders.create(options); // Create order with Razorpay
    // Create a payment record in the database with the initial order details
    const newPayment = await Payment.create({
      userId, // Associate payment with user
      orderId: order.id, // Store Razorpay order ID
      amount: options.amount, // Store amount in paise
      currency: options.currency, // Store currency type
      status: "created", // Initial status of payment
      receipt: options.receipt, // Store receipt id
    });
    res.status(200).json({ order, payment: newPayment }); // Respond with order and payment record
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return error if something goes wrong
  }
};

// Controller to verify the payment
exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body; // Get order_id, payment_id, and signature from request
    // Generate the expected signature using order_id and payment_id with your secret key
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // Use Razorpay key secret
      .update(order_id + "|" + payment_id) // Combine order_id and payment_id
      .digest("hex"); // Generate hex digest

    // Check if the generated signature matches the signature from Razorpay
    if (generated_signature === signature) {
      // Update the payment record to mark it as paid and save payment_id
      const paymentRecord = await Payment.findOneAndUpdate(
        { orderId: order_id }, // Find payment record by orderId
        { paymentId: payment_id, status: "paid" }, // Update paymentId and status
        { new: true } // Return the updated document
      );
      res.status(200).json({ message: "Payment verified successfully.", payment: paymentRecord }); // Respond with success message and updated payment record
    } else {
      res.status(400).json({ message: "Payment verification failed." }); // Respond with failure message if signature doesn't match
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Return error if something goes wrong
  }
};
