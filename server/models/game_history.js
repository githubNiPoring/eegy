const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/config");

const GameHistory = sequelize.define(
  "GameHistory",
  {
    historyID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "historyID",
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "userID",
    },
    gameID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "gameID",
    },
    gameName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "gameName",
    },
    gameImage: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "gameImage",
    },
    earnedCoin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "earnedCoin",
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "score",
    },
    datePlayed: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "datePlayed",
    },
    lvlReached: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "lvlReached",
    },
  },
  {
    tableName: "user_game_history",
    timestamps: false,
  }
);

module.exports = GameHistory;
