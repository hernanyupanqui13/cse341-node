const Pokemon = require("../../models/week09_prove/pokemon");


exports.pokemonFrontend = (req, res, next) => {
  res.render("week09_prove/index", {
    pageTitle: "Pokemon Api"
  });
};


exports.pokemonBackend = (req, res, next) => {
  
  const offset = req.query.offset;
  const size = req.query.size;

  res.setHeader("Acces-Control-Allow-Origin", "*");
  res.setHeader("Allow-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Allow-Control-Allowe-Headers", "Content-Type, Authorization");

  Pokemon.getPokemons(offset, size)
  .then(data => {
    res.json({
      data: data
    });
  });

  console.log("I am working");
}