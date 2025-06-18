const router = require("express").Router();
const { auth } = require("../middleware/auth.middleware");
const {
  updateWordleHistory,
  updateAlphabetHistory,
  updateWordBuddyHistory,
  getUserGameHistoryCount,
  getUserGameHistory,
  updateUserProfile,
} = require("../controller/gameHistory");

router.post("/wordle", auth, updateWordleHistory);
router.post("/alphabet", auth, updateAlphabetHistory);
router.post("/word-buddy", auth, updateWordBuddyHistory);
router.get("/user-game-history-count", auth, getUserGameHistoryCount);
router.post("/user-update", auth, updateUserProfile);
router.get("/user", auth, getUserGameHistory);

module.exports = router;
