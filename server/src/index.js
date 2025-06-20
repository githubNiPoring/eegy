require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connection = require("./config");
const charRoutes = require("../routes/characters");
const userRoutes = require("../routes/user.routes");
const gameRoutes = require("../routes/games");
const gameAchievementsRoutes = require("../routes/achievements");
const gameHistoryRoutes = require("../routes/history");

const app = express();
const port = process.env.PORT || 5000;
const baseURL = process.env.BASE_URL;

// Configure CORS with more specific options
app.use(
  cors({
    origin: `${baseURL}5173`, // Your React app's URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

// Routes
app.use("/api/v1/characters", charRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1/games", gameRoutes);
app.use("/api/v1/achievements", gameAchievementsRoutes);
app.use("/api/v1/history", gameHistoryRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
