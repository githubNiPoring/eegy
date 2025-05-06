const GameCharacter = require("../models/game_character");
const UserBoughtCharacters = require("../models/user_bought_characters");
const UserProfile = require("../models/user_profile");
const User = require("../models/user");
const gameCharacter = require("../models/game_character");

const getAllCharacters = async (req, res) => {
  try {
    const characters = await GameCharacter.findAll();
    res.status(200).json({ success: true, characters });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching characters",
      error: error.message,
    });
  }
};

const CharById = async (req, res) => {
  try {
    const charId = req.params.charId;
    const character = await GameCharacter.findByPk(charId);
    res.status(200).json({ success: true, character });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching character by ID",
      error: error.message,
    });
  }
};

const getUserBoughtCharacters = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch the user's bought characters
    const boughtCharacters = await UserBoughtCharacters.findAll({
      where: { userID: userId },
    });

    res.status(200).json({ success: true, boughtCharacters });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user bought characters",
      error: error.message,
    });
  }
};

const charBuy = async (req, res) => {
  try {
    const userId = req.user.id;
    const charId = req.params.charId;

    const userProfile = await UserProfile.findOne({
      where: { profileID: userId },
    });
    const character = await gameCharacter.findByPk(charId);
    console.log("character:", character.coins);
    console.log("User Profile:", userProfile.coins);

    const charPrice = character.coins;
    const userCoins = userProfile.coins;

    if (userCoins < charPrice) {
      return res.status(400).json({
        success: false,
        message: "Not enough coins to purchase this character",
      });
    } else if (userCoins >= charPrice) {
      // Update user coins
      await UserProfile.update(
        { coins: userCoins - charPrice },
        { where: { profileID: userId } }
      );

      // Update character status to 1 (sold)
      await UserBoughtCharacters.create({
        userID: userId,
        charID: charId,
        purchaseDate: new Date(),
        status: "0",
        charVal: character.coins,
      });

      res.status(200).json({
        success: true,
        message: "Character purchased successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Not enough coins to purchase this character",
      error: error.message,
    });
  }
};

const userNotBoughtChar = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all available characters
    const allCharacters = await GameCharacter.findAll();

    // Get all character IDs that the user has already bought
    const userBoughtChars = await UserBoughtCharacters.findAll({
      where: { userID: userId },
      attributes: ["charID"],
    });

    // Extract just the character IDs into an array
    const boughtCharIds = userBoughtChars.map((char) => char.charID);

    // Filter out characters that the user has already bought
    const notBoughtCharacters = allCharacters.filter(
      (character) => !boughtCharIds.includes(character.charID)
    );

    res.status(200).json({
      success: true,
      notBoughtCharacters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching characters",
      error: error.message,
    });
  }
};

const usedChar = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID from the auth middleware

    // Fetch the character with status "1" for the logged-in user
    const character = await UserBoughtCharacters.findOne({
      where: {
        userID: userId,
        status: "1",
      },
    });

    if (!character) {
      return res.status(404).json({
        success: false,
        message: "No active character found for the user",
      });
    }

    res.status(200).json({
      success: true,
      ID: userId,
      character,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching characters",
      error: error.message,
    });
  }
};

const updateCharStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const charId = req.params.charId;

    await UserBoughtCharacters.update(
      { status: "0" },
      { where: { userID: userId } }
    );

    await UserBoughtCharacters.update(
      { status: "1" },
      { where: { userID: userId, charID: charId } }
    );

    const defaultStatus = await UserBoughtCharacters.findAll({
      where: { userID: userId },
    });

    res.status(200).json({
      success: true,
      defaultStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating character status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCharacters,
  CharById,
  getUserBoughtCharacters,
  charBuy,
  userNotBoughtChar,
  usedChar,
  updateCharStatus,
};
