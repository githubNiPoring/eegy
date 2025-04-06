const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "mariadb",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "eegy_db",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: console.log, // Enable SQL query logging
});

module.exports = async () => {
  try {
    console.log("Attempting to connect to database...");
    await sequelize.authenticate();
    console.log("Authentication successful!");

    console.log("Synchronizing database models...");
    await sequelize.sync();
    console.log("Database synchronized successfully!");
  } catch (error) {
    console.error("Database connection error:");
    console.error(error.message);
    if (error.parent) {
      console.error("Detailed error:", error.parent.message);
    }
    console.error("Error connecting to database");
  }
};

module.exports.sequelize = sequelize;
