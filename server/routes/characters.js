const router = require("express").Router();
const { getAllCharacters } = require("../controller/gameCharacter");

router.get("/", getAllCharacters);

module.exports = router;
