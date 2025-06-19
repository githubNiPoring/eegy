const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/config");

const UserGameAchievement = sequelize.define(
  "UserGameAchievement",
  {
    userAchievementID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "userAchievementID",
    },
    profileID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "profileID",
    },
    achievementID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "achievementID",
    },
    dateObtained: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "dateObtained",
    },
    claimStatus: {
      type: DataTypes.ENUM("True", "False"),
      allowNull: false,
      defaultValue: "False",
      field: "claimStatus",
    },
  },
  {
    tableName: "user_achievements",
    timestamps: false,
  }
);

module.exports = UserGameAchievement;
