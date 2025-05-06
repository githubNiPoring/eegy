const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/config");

const UserBoughtCharacters = sequelize.define(
  "UserBoughtCharacters",
  {
    transactionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    charID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("0", "1"), // ENUM type with values '0' and '1'
      allowNull: false,
      defaultValue: "1", // Default value is '1'
    },
    charVal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value as 0
    },
  },
  {
    tableName: "user_bought_characters", // Explicitly specify the table name
    timestamps: false, // Disable createdAt and updatedAt fields
  }
);

module.exports = UserBoughtCharacters;
