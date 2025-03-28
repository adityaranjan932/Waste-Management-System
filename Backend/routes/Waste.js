const express = require("express");
const router = express.Router();
const wasteController = require("../controllers/wasteController");

// Route to create a waste submission
router.post("/create", wasteController.createWaste); // Create waste submission

// Route to get waste submissions (optionally filtered by user)
router.get("/", wasteController.getWastes); // Retrieve wastes

// Route to update waste status (admin use)
router.put("/update/:wasteId", wasteController.updateWasteStatus); // Update waste status

module.exports = router;
