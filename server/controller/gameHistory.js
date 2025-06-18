const GameHistory = require("../models/game_history");
const UserProfile = require("../models/user_profile");
const User = require("../models/user");
const { date } = require("joi");

const updateWordleHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const gameName = "Kid Wordle";
    const gameImage = "../../../../public/assets/games/kid_wordle.png";
    let { gameID = 3, earnedCoin, score, lvlReached } = req.body;

    const gameHistory = await GameHistory.create({
      userID: userId,
      gameID: parseInt(gameID),
      gameName: gameName,
      gameImage: gameImage,
      earnedCoin: parseInt(earnedCoin), // Convert to integer
      score: parseInt(score), // Convert to integer
      datePlayed: new Date(),
      lvlReached: parseInt(lvlReached), // Convert to integer
    });

    res.status(201).json({
      message: "Game history updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating game history:", error);
    return res.status(500).json({
      message: "Error updating game history",
      details: error.message,
      success: false,
    });
  }
};
const updateAlphabetHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const gameName = "Alphabet";
    const gameImage = "../../../../public/assets/games/alphabet.png";
    let { gameID = 2, earnedCoin, score, lvlReached } = req.body;

    const gameHistory = await GameHistory.create({
      userID: userId,
      gameID: parseInt(gameID),
      gameName: gameName,
      gameImage: gameImage,
      earnedCoin: parseInt(earnedCoin), // Convert to integer
      score: parseInt(score), // Convert to integer
      datePlayed: new Date(),
      lvlReached: parseInt(lvlReached), // Convert to integer
    });

    res.status(201).json({
      message: "Game history updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating game history:", error);
    return res.status(500).json({
      message: "Error updating game history",
      details: error.message,
      success: false,
    });
  }
};

const updateWordBuddyHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const gameName = "Word Buddy";
    const gameImage = "../../../../public/assets/games/word_buddy.png";
    let { gameID = 1, earnedCoin, score, lvlReached } = req.body;

    const gameHistory = await GameHistory.create({
      userID: userId,
      gameID: parseInt(gameID),
      gameName: gameName,
      gameImage: gameImage,
      earnedCoin: parseInt(earnedCoin), // Convert to integer
      score: parseInt(score), // Convert to integer
      datePlayed: new Date(),
      lvlReached: parseInt(lvlReached), // Convert to integer
    });

    res.status(201).json({
      message: "Game history updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating game history:", error);
    return res.status(500).json({
      message: "Error updating game history",
      details: error.message,
      success: false,
    });
  }
};

const getUserGameHistoryCount = async (req, res) => {
  try {
    const userID = req.user.id;
    const gameHistoryCount = await GameHistory.count({
      where: { userID: userID },
    });

    if (!gameHistoryCount || gameHistoryCount.length === 0) {
      return res.status(200).json({
        message: "No game history found for this user",
        success: true,
        count: 0,
      });
    }

    return res.status(200).json({
      message: "Game history fetched successfully",
      success: true,
      count: gameHistoryCount,
    });
  } catch (error) {
    console.error("Error fetching user game history count:", error);
    return res.status(500).json({
      message: "Error fetching user game history count",
      details: error.message,
      success: false,
    });
  }
};
const getUserGameHistory = async (req, res) => {
  try {
    const userID = req.user.id;
    const gameHistory = await GameHistory.findAll({
      where: { userID: userID },
      order: [["historyID", "DESC"]],
      limit: 10,
    });

    if (!gameHistory || gameHistory.length === 0) {
      return res.status(404).json({
        message: "No game history found for this user",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Game history fetched successfully",
      success: true,
      data: gameHistory,
    });
  } catch (error) {
    console.error("Error fetching user game history:", error);
    return res.status(500).json({
      message: "Error fetching user game history",
      details: error.message,
      success: false,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await UserProfile.findOne({
      where: { profileID: userId },
      attributes: ["coins", "cumulativeScore"],
    });

    if (!userProfile) {
      return res.status(404).json({
        message: "User profile not found",
        success: false,
      });
    }

    // Now safe to use these variables
    const coinsUserProfile = userProfile.coins;
    const cumulativeScoreUserProfile = userProfile.cumulativeScore;

    let { userLevel, coins, score } = req.body;
    const updateData = await UserProfile.update(
      {
        userLevel: userLevel,
        coins: coinsUserProfile + parseInt(coins),
        score: parseInt(score),
        cumulativeScore: cumulativeScoreUserProfile + score,
      },
      {
        where: { profileID: userId },
      }
    );

    return res.status(200).json({
      message: "User profile updated successfully",
      success: true,
      data: updateData,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      message: "Error updating user profile",
      details: error.message,
      success: false,
    });
  }
};

module.exports = {
  updateWordleHistory,
  updateAlphabetHistory,
  updateWordBuddyHistory,
  getUserGameHistoryCount,
  getUserGameHistory,
  updateUserProfile,
};
