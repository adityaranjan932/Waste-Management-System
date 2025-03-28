const express = require("express");
const router = express.Router();
const rewardController = require("../controllers/rewardController");

// Route to add reward points for a user
router.post("/add", rewardController.addReward); // Add reward points

// Route to get rewards for a specific user
router.get("/:userId", rewardController.getRewardsByUser); // Get rewards by user ID

module.exports = router;
