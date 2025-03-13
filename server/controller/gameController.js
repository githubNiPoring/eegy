const { Game, validate } = require("../models/game");

// Get all active games
const getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll({
      where: { isActive: true },
      order: [["gameTitle", "ASC"]],
    });
    res.status(200).json({ success: true, games });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching games",
      error: error.message,
    });
  }
};

// Get a specific game by ID
const getGameById = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }
    res.status(200).json({ success: true, game });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching game",
      error: error.message,
    });
  }
};

// Create a new game
const createGame = async (req, res) => {
  try {
    // Validate request body
    const { error } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Create game
    const game = await Game.create({
      ...req.body,
      lastUpdate: new Date(),
    });

    res.status(201).json({ success: true, game });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating game",
      error: error.message,
    });
  }
};

// Update a game
const updateGame = async (req, res) => {
  try {
    // Validate request body
    const { error } = validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const game = await Game.findByPk(req.params.id);
    if (!game) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }

    // Update game
    await game.update({
      ...req.body,
      lastUpdate: new Date(),
    });

    res.status(200).json({ success: true, game });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating game",
      error: error.message,
    });
  }
};

// Delete a game (soft delete by setting isActive to false)
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }

    // Soft delete
    await game.update({ isActive: false });

    res
      .status(200)
      .json({ success: true, message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting game",
      error: error.message,
    });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
};
