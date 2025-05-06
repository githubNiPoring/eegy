const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/config");

const GameQuestion = sequelize.define(
  "GameQuestion",
  {
    questionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    questionDesc: {
      type: DataTypes.STRING(225), // Matches VARCHAR(225)
      allowNull: false,
      defaultValue: "0",
    },
    imageURL: {
      type: DataTypes.STRING(75), // Matches VARCHAR(75)
      allowNull: false,
      defaultValue: "0",
    },
    correctAnswer: {
      type: DataTypes.STRING(75), // Matches VARCHAR(75)
      allowNull: false,
      defaultValue: "0",
    },
    category: {
      type: DataTypes.ENUM("animal", "fruit"), // Matches ENUM('animal', 'fruit')
      allowNull: false,
      defaultValue: "fruit",
    },
  },
  {
    tableName: "game_questions", // Explicitly specify the table name
    timestamps: false, // Disable createdAt and updatedAt fields
  }
);

module.exports = GameQuestion;
