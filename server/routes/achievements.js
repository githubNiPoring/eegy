const router = require("express").Router();
const getAllAchievements = require("../controller/gameAchievements");
const { auth } = require("../middleware/auth.middleware");

router.get("/", getAllAchievements);

module.exports = router;
