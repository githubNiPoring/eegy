const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/config");

const GameAchievement = sequelize.define(
  "Achievement",
  {
    achievementID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "achievementID",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "title",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "description",
    },
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "iconUrl",
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "category",
    },
  },
  {
    tableName: "achievements",
    timestamps: false,
  }
);

module.exports = GameAchievement;
