const GameCharacter = require("../models/game_character");

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

module.exports = { getAllCharacters };
