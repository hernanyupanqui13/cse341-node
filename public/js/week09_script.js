console.log("hola!");


const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const parentElement = document.getElementById("pokemon-list");


nextButton.addEventListener("click", next => {
  console.log("clickin next ");
  nextData = JSON.parse(nextButton.dataset.nextData);
  changePagePokemons(nextData);
});

previousButton.addEventListener("click", event => {

  console.log("clickin next ");
  prevData = JSON.parse(previousButton.dataset.prevData);
  changePagePokemons(prevData);
  
});

getPokemons()
.then( data => renderData(data));  


async function getPokemons(offset=0, limit=10) {

  const URL = `getPokemons?offset=${offset}&size=${limit}`;

  return fetch( URL , {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json())
  .then( data => {
    
    const pokeData = data.data;

    return pokeData;
    
  })
}

async function changePagePokemons(paginatonData) {
  const pokeData = await getPokemons(paginatonData.offset, paginatonData.limit);

  renderData(pokeData);
}

function renderData(data) {

  // Render HTML
  const results =  data.results;
  let htmlContent = "";
  
  for (const pokemon of results) {
    htmlContent += `<li class="list-group-item">${ firstLetterUpperCase(pokemon.name) }</li>`;
  }
  const parentElement = document.getElementById("pokemon-list");
  parentElement.innerHTML = htmlContent;




  // Render Next and Previo Buttons
  if (data.next === null) {
    nextButton.parentNode.classList.add("disabled");
  } else {
    nextButton.parentNode.classList.remove("disabled");
    const nextData = obtainParameters(data.next);
    console.log("not null next");
    nextButton.dataset.nextData = JSON.stringify(nextData);

  }

  if (data.previous === null) {
    previousButton.parentNode.classList.add("disabled");
  } else {
    previousButton.parentNode.classList.remove("disabled");
    const prevData = obtainParameters(data.previous);
    previousButton.dataset.prevData = JSON.stringify(prevData);
    console.log("not null prev");
  }


}


function obtainParameters(url) {
  if (url === null) {
    return "";
  }

  let divided = url.split("?")[1].split("&");
  const parameters = {};

  divided.forEach(element => {
    const temp = element.split("=");
    parameters[temp[0]] = temp[1];
  });

  return parameters;
  
}

function firstLetterUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

