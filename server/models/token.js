const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/config");
const { User } = require("./user");

const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      unique: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["createdAt"],
        using: "BTREE",
        name: "token_expiry_idx",
      },
    ],
  }
);

// Set up the association
Token.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Token, { foreignKey: "userId" });

module.exports = Token;
