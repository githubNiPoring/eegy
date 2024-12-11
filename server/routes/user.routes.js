const router = require("express").Router();
const {
  Signup,
  Verify,
  Login,
  Home,
} = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/login", Login);
router.post("/signup", Signup);
router.get("/eegy", authMiddleware, Home);
router.get("/:id/verify/:token", Verify);

module.exports = router;
