require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connection = require("./config");
const routes = require("../routes/user.routes");

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));

// Connect to database
connection();

// Routes
app.use("/api/v1", routes);

// app.get("/api/message", (req, res) => {
//   res.json({ message: "Yameteeee" });
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
