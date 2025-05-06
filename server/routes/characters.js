const router = require("express").Router();
const {
  getAllCharacters,
  CharById,
  getUserBoughtCharacters,
  charBuy,
  userNotBoughtChar,
  usedChar,
  updateCharStatus,
} = require("../controller/gameCharacter");
const { auth } = require("../middleware/auth.middleware");

router.get("/active", auth, usedChar);
router.get("/", getAllCharacters);
router.get("/bought", auth, getUserBoughtCharacters);
router.post("/buy/:charId", auth, charBuy);
router.post("/update/:charId", auth, updateCharStatus);
router.get("/:charId", CharById);
router.get("/notbought/:userId", auth, userNotBoughtChar);

module.exports = router;
