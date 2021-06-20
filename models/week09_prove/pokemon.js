const fetch = require("node-fetch");


class Pokemon {

  static async getPokemons(offset, limit) {
    let data = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    data = data.json();
    console.log(data);
    return data;

  }

}


module.exports = Pokemon;