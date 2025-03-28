const Waste = require("../models/Waste"); // Import Waste model
const CollectionPoint = require("../models/CollectionPoint"); // Import CollectionPoint model (if needed for scheduling)

// Create a new waste submission by a user
exports.createWaste = async (req, res) => {
  try {
    const { userId, imageUrl, wasteType } = req.body; // Destructure required fields
    // Validate required fields
    if (!userId || !imageUrl || !wasteType) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    // Create waste document in database
    const waste = await Waste.create({ userId, imageUrl, wasteType, status: "pending" });
    return res.status(201).json({ success: true, waste, message: "Waste submitted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all waste submissions (or filter by userId if provided)
exports.getWastes = async (req, res) => {
  try {
    const { userId } = req.query; // Optionally filter by userId
    let wastes;
    if (userId) {
      wastes = await Waste.find({ userId }); // Find wastes for a specific user
    } else {
      wastes = await Waste.find(); // Find all wastes
    }
    return res.status(200).json({ success: true, wastes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update waste status (e.g., after verification) - usually for admin use
exports.updateWasteStatus = async (req, res) => {
  try {
    const { wasteId } = req.params; // Get wasteId from URL parameter
    const { status } = req.body; // Get new status from request body
    if (!wasteId || !status) {
      return res.status(400).json({ success: false, message: "Waste ID and status are required." });
    }
    // Update the waste document with new status
    const updatedWaste = await Waste.findByIdAndUpdate(wasteId, { status }, { new: true });
    if (!updatedWaste) {
      return res.status(404).json({ success: false, message: "Waste not found." });
    }
    return res.status(200).json({ success: true, updatedWaste, message: "Waste status updated." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
