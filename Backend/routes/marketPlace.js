const express = require("express");
const router = express.Router();
const marketplaceController = require("../controllers/marketplaceController");

// Route to create a new marketplace listing
router.post("/create", marketplaceController.createListing); // Create a listing

// Route to get all available marketplace listings
router.get("/", marketplaceController.getListings); // Retrieve available listings

// Route to update a listing status (e.g., mark as sold)
router.put("/update/:listingId", marketplaceController.updateListingStatus); // Update listing status

module.exports = router;
