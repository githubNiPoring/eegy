const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/config");

const GameCharacter = sequelize.define(
  "GameCharacter",
  {
    charID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    characterName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "", // Default value as empty string
    },
    category: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "", // Default value as empty string
    },
    charDesc: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "", // Default value as empty string
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value as 0
    },
    charImg: {
      type: DataTypes.STRING,
      allowNull: false, // Image can be null if not set
    },
    unlockRequirements: {
      type: DataTypes.STRING,
      allowNull: false, // Unlock requirement can be null if not set
    },
  },
  {
    tableName: "game_character", // Explicitly specify the table name
    timestamps: false, // Disable createdAt and updatedAt fields
  }
);

module.exports = GameCharacter;
