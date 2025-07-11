const { Game, validate } = require("../models/game");
const GameQuestion = require("../models/game_questions");
const { Sequelize } = require("sequelize");
const { get } = require("../routes/games");

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

const getGameQuestions = async (req, res) => {
  try {
    // Get 10 random questions
    const questions = await GameQuestion.findAll({
      order: Sequelize.literal("RAND()"),
      limit: 10, // Limit to 10 questions
    });

    if (!questions || questions.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found" });
    }

    res.status(200).json({
      success: true,
      questions: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching game questions",
      error: error.message,
    });
  }
};

const getFruit = async (req, res) => {
  try {
    const fruitCat = await GameQuestion.findAll({
      where: { category: "fruit" },
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });

    if (!fruitCat || fruitCat.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found" });
    }

    res.status(200).json({
      success: true,
      questions: fruitCat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching games",
      error: error.message,
    });
  }
};

const getThings = async (req, res) => {
  try {
    const thingsCat = await GameQuestion.findAll({
      where: { category: "thing" },
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });

    if (!thingsCat || thingsCat.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found" });
    }

    res.status(200).json({
      success: true,
      questions: thingsCat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching games",
      error: error.message,
    });
  }
};

const getAnimals = async (req, res) => {
  try {
    const animalsCat = await GameQuestion.findAll({
      where: { category: "animal" },
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });

    if (!animalsCat || animalsCat.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found" });
    }

    res.status(200).json({
      success: true,
      questions: animalsCat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching games",
      error: error.message,
    });
  }
};

const getFruitAdvance = async (req, res) => {
  try {
    const fruitCat = await GameQuestion.findAll({
      where: { category: "fruit", option: "advance" },
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });

    if (!fruitCat || fruitCat.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found" });
    }

    res.status(200).json({
      success: true,
      questions: fruitCat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching games",
      error: error.message,
    });
  }
};

const getThingsBasic = async (req, res) => {
  try {
    const thingsCat = await GameQuestion.findAll({
      where: { category: "thing", option: "basic" },
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });

    if (!thingsCat || thingsCat.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found" });
    }

    res.status(200).json({
      success: true,
      questions: thingsCat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching games",
      error: error.message,
    });
  }
};

const getThingsAdvance = async (req, res) => {
  try {
    const thingsCat = await GameQuestion.findAll({
      where: { category: "thing", option: "advance" },
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });

    if (!thingsCat || thingsCat.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found" });
    }

    res.status(200).json({
      success: true,
      questions: thingsCat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching games",
      error: error.message,
    });
  }
};

const getAnimalsBasic = async (req, res) => {
  try {
    const animalsCat = await GameQuestion.findAll({
      where: { category: "animal", option: "basic" },
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });

    if (!animalsCat || animalsCat.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found" });
    }

    res.status(200).json({
      success: true,
      questions: animalsCat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching games",
      error: error.message,
    });
  }
};

const getAnimalsAdvance = async (req, res) => {
  try {
    const animalsCat = await GameQuestion.findAll({
      where: { category: "animal", option: "advance" },
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });

    if (!animalsCat || animalsCat.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found" });
    }

    res.status(200).json({
      success: true,
      questions: animalsCat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching games",
      error: error.message,
    });
  }
};

module.exports = {
  getAnimals,
  getThings,
  getFruit,
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getGameQuestions,
  getFruitAdvance,
  getThingsBasic,
  getThingsAdvance,
  getAnimalsBasic,
  getAnimalsAdvance,
};
