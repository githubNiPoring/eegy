const router = require("express").Router();
const { auth } = require("../middleware/auth.middleware");
const {
  getAnimals,
  getThings,
  getFruit,
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getGameQuestions,
} = require("../controller/gameController");

router.get("/animals", getAnimals);
router.get("/things", getThings);
router.get("/fruit", getFruit);

// Get all games (public route)
router.get("/", getAllGames);

// Get specific game (public route)
router.get("/game/:id", getGameById);
router.get("/questions", getGameQuestions);

// Protected routes (require authentication)
router.post("/", auth, createGame);
router.put("/:id", auth, updateGame);
router.delete("/:id", auth, deleteGame);

module.exports = router;
