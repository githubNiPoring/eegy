require("dotenv").config();

const mongoose = require("mongoose");

module.exports = () => {
  const connection = {};
  try {
    mongoose.connect(process.env.MONGODB_URI, connection);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
    console.log("Error connecting to database");
  }
};
