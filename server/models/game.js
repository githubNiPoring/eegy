const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/config");
const Joi = require("joi");

const Game = sequelize.define(
  "Game",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gameTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gameDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gameDifficulty: {
      type: DataTypes.ENUM("Easy", "Medium", "Hard"),
      allowNull: false,
      defaultValue: "Easy",
    },
    lastUpdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

// Validation schema for creating/updating games
const validate = (data) => {
  const schema = Joi.object({
    gameTitle: Joi.string().required().label("Game Title"),
    gameDescription: Joi.string().required().label("Game Description"),
    gameDifficulty: Joi.string()
      .valid("Easy", "Medium", "Hard")
      .required()
      .label("Game Difficulty"),
    thumbnailUrl: Joi.string().uri().allow(null, "").label("Thumbnail URL"),
    route: Joi.string().required().label("Game Route"),
    isActive: Joi.boolean().label("Is Active"),
  });
  return schema.validate(data);
};

// Add initial game data
const initializeGames = async () => {
  try {
    await Game.bulkCreate(
      [
        {
          gameTitle: "Word Buddy",
          gameDescription:
            "A fun and interactive word-matching game! Match words with their meanings to improve your vocabulary. Perfect for young learners starting their reading journey.",
          gameDifficulty: "Easy",
          route: "/word-buddy",
          thumbnailUrl: "/images/games/word-buddy.png",
          lastUpdate: new Date(),
          isActive: true,
        },
        {
          gameTitle: "Alphabet Adventure",
          gameDescription:
            "Join an exciting journey through the alphabet! Drag and drop letters to complete words, learn letter sounds, and improve spelling skills. Features colorful animations and encouraging feedback.",
          gameDifficulty: "Easy",
          route: "/alphabet",
          thumbnailUrl: "/images/games/alphabet.png",
          lastUpdate: new Date(),
          isActive: true,
        },
        {
          gameTitle: "Kid Wordle",
          gameDescription:
            "A kid-friendly version of the popular word game! Guess the hidden word with helpful hints. Features age-appropriate words, visual clues, and a colorful keyboard to help children learn spelling patterns.",
          gameDifficulty: "Medium",
          route: "/kid-wordle",
          thumbnailUrl: "/images/games/kid-wordle.png",
          lastUpdate: new Date(),
          isActive: true,
        },
      ],
      {
        ignoreDuplicates: true,
        updateOnDuplicate: [
          "gameDescription",
          "lastUpdate",
          "thumbnailUrl",
          "gameDifficulty",
          "isActive",
        ],
      }
    );
    console.log("Initial games data created successfully");
  } catch (error) {
    console.error("Error initializing games:", error);
  }
};

module.exports = { Game, validate, initializeGames };
