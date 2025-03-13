const router = require("express").Router();
const { auth } = require("../middleware/auth.middleware");
const {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} = require("../controller/gameController");

// Get all games (public route)
router.get("/", getAllGames);

// Get specific game (public route)
router.get("/:id", getGameById);

// Protected routes (require authentication)
router.post("/", auth, createGame);
router.put("/:id", auth, updateGame);
router.delete("/:id", auth, deleteGame);

module.exports = router;
