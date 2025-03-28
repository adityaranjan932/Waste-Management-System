const express = require("express"); // Import express
const router = express.Router(); // Create router instance
const paymentController = require("../controllers/paymentController"); // Import payment controller

// Route to create a payment order with Razorpay
router.post("/order", paymentController.createPaymentOrder); // Create order endpoint

// Route to verify the payment signature after payment is done
router.post("/verify", paymentController.verifyPayment); // Verify payment endpoint

module.exports = router; // Export router
