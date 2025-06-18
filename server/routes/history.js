const router = require("express").Router();
const { auth } = require("../middleware/auth.middleware");
const {
  updateWordleHistory,
  updateAlphabetHistory,
  updateWordBuddyHistory,
  getUserGameHistory,
  updateUserProfile,
} = require("../controller/gameHistory");

router.post("/wordle", auth, updateWordleHistory);
router.post("/alphabet", auth, updateAlphabetHistory);
router.post("/word-buddy", auth, updateWordBuddyHistory);
router.post("/user-update", auth, updateUserProfile);
router.get("/user", auth, getUserGameHistory);

module.exports = router;
