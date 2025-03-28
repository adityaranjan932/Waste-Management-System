const Reward = require("../models/Reward"); // Import Reward model

// Add reward points for a user (e.g., when they dispose waste properly)
exports.addReward = async (req, res) => {
  try {
    const { userId, pointsEarned, reason } = req.body; // Destructure input fields
    // Validate required fields
    if (!userId || !pointsEarned || !reason) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    // Create a reward record in database
    const reward = await Reward.create({ userId, pointsEarned, reason });
    return res.status(201).json({ success: true, reward, message: "Reward added successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get rewards for a specific user
exports.getRewardsByUser = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL parameter
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }
    // Find all reward records for the given user
    const rewards = await Reward.find({ userId });
    return res.status(200).json({ success: true, rewards });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
