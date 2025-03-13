const router = require("express").Router();
const {
  Signup,
  Verify,
  Login,
  Home,
} = require("../controller/user.controller");
const { auth } = require("../middleware/auth.middleware");

router.post("/login", Login);
router.post("/signup", Signup);
router.get("/eegy", auth, Home);
router.get("/:id/verify/:token", Verify);

module.exports = router;
