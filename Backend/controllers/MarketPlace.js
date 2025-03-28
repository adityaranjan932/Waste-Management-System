const Marketplace = require("../models/Marketplace"); // Import Marketplace model

// Create a new marketplace listing for a recyclable item
exports.createListing = async (req, res) => {
  try {
    const { sellerId, itemName, category, price, quantity } = req.body; // Destructure required fields
    // Validate required fields
    if (!sellerId || !itemName || !category || !price || !quantity) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    // Create a marketplace document in database
    const listing = await Marketplace.create({ sellerId, itemName, category, price, quantity, status: "available" });
    return res.status(201).json({ success: true, listing, message: "Marketplace listing created successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all available marketplace listings
exports.getListings = async (req, res) => {
  try {
    // Find marketplace items that are available
    const listings = await Marketplace.find({ status: "available" });
    return res.status(200).json({ success: true, listings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update marketplace listing status (e.g., mark as sold)
exports.updateListingStatus = async (req, res) => {
  try {
    const { listingId } = req.params; // Get listing ID from URL parameter
    const { status } = req.body; // Get new status from request body
    if (!listingId || !status) {
      return res.status(400).json({ success: false, message: "Listing ID and status are required." });
    }
    // Update the marketplace listing status
    const updatedListing = await Marketplace.findByIdAndUpdate(listingId, { status }, { new: true });
    if (!updatedListing) {
      return res.status(404).json({ success: false, message: "Listing not found." });
    }
    return res.status(200).json({ success: true, updatedListing, message: "Marketplace listing updated." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
