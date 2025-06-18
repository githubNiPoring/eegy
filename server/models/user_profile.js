const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/config");
const User = require("./user").User;

const UserProfile = sequelize.define(
  "UserProfile",
  {
    profileID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    cumulativeScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "user_profile",
    timestamps: false,
  }
);

module.exports = UserProfile;
