const express = require("express"); 

const router = express.Router();
const week09_controller = require("../../controllers/week09_prove/pokemonController");

router.get("/week09", week09_controller.pokemonFrontend);

router.get("/getPokemons", week09_controller.pokemonBackend);






module.exports = router;