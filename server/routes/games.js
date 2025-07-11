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
  getThingsBasic,
  getThingsAdvance,
  getFruitAdvance,
  getAnimalsBasic,
  getAnimalsAdvance,
} = require("../controller/gameController");

router.get("/animals", getAnimals);
router.get("/things", getThings);
router.get("/fruit", getFruit);

router.get("/fruit/advance", getFruitAdvance);
router.get("/things/basic", getThingsBasic);
router.get("/things/advance", getThingsAdvance);
router.get("/animals/basic", getAnimalsBasic);
router.get("/animals/advance", getAnimalsAdvance);

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
