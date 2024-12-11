require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connection = require("./config");
const routes = require("../routes/user.routes");

const app = express();
const port = process.env.PORT || 5000;

connection();
const secret = process.env.JWT_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser(secret));

//routes
app.use("/api/v1", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
