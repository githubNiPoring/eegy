const router = require("express").Router();
const {
  getAllAchievements,
  getUserAchieved,
  claimAchievement,
  checkAndGrantAchievements,
} = require("../controller/gameAchievements");
const { auth } = require("../middleware/auth.middleware");

router.get("/", getAllAchievements);
router.get("/user", auth, getUserAchieved);
router.post("/claim/:achievementID", auth, claimAchievement);
router.post("/check", auth, checkAndGrantAchievements);

module.exports = router;
