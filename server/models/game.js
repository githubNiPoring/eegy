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
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true,
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
    route: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

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

// Function to generate route based on game title
const generateRoute = (title) => {
  return title.toLowerCase().replace(/\s+/g, "-");
};

module.exports = { Game, validate };
