const GameAchievement = require("../models/game_achievements");
const UserProfile = require("../models/user_profile");
const User = require("../models/user");
const { get } = require("../routes/characters");

const getAllAchievements = async (req, res) => {
  try {
    const achievements = await GameAchievement.findAll();
    res.status(200).json({ success: true, achievements });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching achievements",
      error: error.message,
    });
  }
};

module.exports = getAllAchievements;
