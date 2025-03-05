require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const token =
    req.signedCookies?.token ||
    req.cookies?.token ||
    req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "You are not authorized to access this route",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "You are not authorized to access this route",
        success: false,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: "You are not authorized to access this route",
      details: error.message,
      success: false,
    });
  }
};

module.exports = authMiddleware;
