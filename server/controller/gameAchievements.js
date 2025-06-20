const GameAchievement = require("../models/game_achievements");
const UserGameAchievement = require("../models/user_game_achievements");
const UserProfile = require("../models/user_profile");
const User = require("../models/user");
const { get } = require("../routes/characters");

const getAllAchievements = async (req, res) => {
  try {
    const achievements = await GameAchievement.findAll({
      order: [["lvlRequirement", "ASC"]], // Sort by lvlRequirement ascending
    });
    res.status(200).json({ success: true, achievements });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching achievements",
      error: error.message,
    });
  }
};

const getUserAchieved = async (req, res) => {
  try {
    const userId = req.user.id;
    const achievements = await UserGameAchievement.findAll({
      where: {
        profileID: userId,
      },
    });
    res.status(200).json({ success: true, achievements });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user achievements",
      error: error.message,
    });
  }
};

const claimAchievement = async (req, res) => {
  try {
    const { achievementID } = req.params;
    const userId = req.user.id;

    // Check if the user has already claimed this achievement
    const userAchievement = await UserGameAchievement.findOne({
      where: {
        profileID: userId,
        achievementID,
        claimStatus: "False",
      },
    });

    if (!userAchievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement not found for this user",
      });
    }

    // Get the coinReward from the achievement
    const achievement = await GameAchievement.findOne({
      where: { achievementID: achievementID },
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Achievement details not found",
      });
    }

    const coinReward = achievement.coinReward;

    // Update the user's coins in UserProfile
    const userProfile = await UserProfile.findOne({
      where: { profileID: userId },
    });

    if (userProfile) {
      userProfile.coins += coinReward;
      await userProfile.save();
    }

    userAchievement.claimStatus = "True";
    userAchievement.dateObtained = new Date();
    await userAchievement.save();

    res.status(200).json({
      success: true,
      message: "Achievement claimed successfully",
      achievement: userAchievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error claiming achievement",
      error: error.message,
    });
  }
};

const checkAndGrantAchievements = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's current level
    const userProfile = await UserProfile.findOne({
      where: { profileID: userId },
    });

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    // Get all achievements
    const achievements = await GameAchievement.findAll();

    // Get all user's current achievements
    const userAchievements = await UserGameAchievement.findAll({
      where: { profileID: userId },
    });
    const achievedIds = userAchievements.map((a) => a.achievementID);

    let newAchievements = [];

    // Check for each achievement if user qualifies and hasn't received it yet
    for (const achievement of achievements) {
      if (
        userProfile.userLevel >= achievement.lvlRequirement &&
        !achievedIds.includes(achievement.achievementID)
      ) {
        // Grant achievement
        const newAch = await UserGameAchievement.create({
          profileID: userId,
          achievementID: achievement.achievementID,
          claimStatus: "False",
          dateObtained: null,
        });
        newAchievements.push(newAch);
      }
    }

    res.status(200).json({
      success: true,
      message: "Achievements checked and granted if qualified.",
      newAchievements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking/granting achievements",
      error: error.message,
    });
  }
};

const gameAchievementCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const countAchievements = await UserGameAchievement.count({
      where: {
        profileID: userId,
        claimStatus: "True",
      },
    });

    res.status(200).json({
      success: true,
      count: countAchievements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error counting achievements",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAchievements,
  getUserAchieved,
  claimAchievement,
  checkAndGrantAchievements,
  gameAchievementCount,
};
