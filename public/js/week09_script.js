console.log("hola!");

const lastButton = document.getElementById("lastButton");
const firstButton = document.getElementById("firstButton");
const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const parentElement = document.getElementById("pokemon-list");


nextButton.addEventListener("click", next => {
  console.log("clickin next ");
  nextData = JSON.parse(nextButton.dataset.pageData);
  changePagePokemons(nextData);
});

previousButton.addEventListener("click", event => {
  console.log("clickin next ");
  prevData = JSON.parse(previousButton.dataset.pageData);
  changePagePokemons(prevData);
});

firstButton.addEventListener("click", event => {
  console.log("clicking first");
  firstData = JSON.parse(firstButton.dataset.pageData);
  changePagePokemons(firstData);
});


lastButton.addEventListener("click", event => {
  console.log("clicking last");
  lastData = JSON.parse(lastButton.dataset.pageData);
  changePagePokemons(lastData);
});

getPokemons()
.then( data => {
  renderData(data);
  renderPagination(data);
});  


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
  renderPagination(pokeData);
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
    nextButton.dataset.pageData = JSON.stringify(nextData);

  }

  if (data.previous === null) {
    previousButton.parentNode.classList.add("disabled");
  } else {
    previousButton.parentNode.classList.remove("disabled");
    const prevData = obtainParameters(data.previous);
    previousButton.dataset.pageData = JSON.stringify(prevData);
    console.log("not null prev");
  }


}

function renderPagination(data) {
  let totalPages = 0;
  let paginationData = {};
  let currentPage = 0;
  
  if (data.next !== null) {
    paginationData = obtainParameters(data.next);  
    console.log(paginationData, "pag data");
    currentPage = (paginationData.offset/10);
    //currentPage = currentPage == 0 ? 1: currentPage; 
    totalPages = Math.ceil(data.count / 10);
    console.log(totalPages, currentPage, "not null");
  } else {
    paginationData = obtainParameters(data.previous);
    totalPages = Math.ceil(data.count / paginationData.limit);
    currentPage = totalPages;
    console.log(totalPages, currentPage, "null");
  }
  

  lastButton.dataset.pageData = JSON.stringify({
    offset: (totalPages - 1)*10,
    limit: 10
  });

  firstButton.dataset.pageData =  JSON.stringify({
    offset:0,
    limit: 10
  });

  firstInPagination = currentPage - 2;
  lastInPagination = currentPage + 3

  if (currentPage < 3) {
    firstInPagination = 1;
    lastInPagination = 6;
  } 
  

  if (currentPage > totalPages - 3) {
    firstInPagination = totalPages - 5;
    lastInPagination = totalPages;
  } 

  let pagesHtml = "";
  let index = firstInPagination;

  while (index < lastInPagination+1) {
    console.log("CURRENT AND ACTIVE", currentPage, "a", index);
    pagesHtml += `
      <li class="page-item tempPages ${index==currentPage ? 'active': ''}">
        <a class="page-link" href="#" tabindex="-1" 
          aria-disabled="true" 
          data-page-data=${JSON.stringify({offset: (index-1)*10, limit: 10})}>
          ${index}
        </a>
      </li>
    `;

    index++;
  }
  const parentHtml = document.querySelector(".pagination-ul");
  
  // Removing the unsued pages
  [...parentHtml.querySelectorAll(".tempPages")].forEach( element => {
    console.log("removing temp pages");
    parentHtml.removeChild(element)
  });

  const beforeInjecting = document.querySelector(".beforeInjecting");
  beforeInjecting.insertAdjacentHTML("beforebegin", pagesHtml);
  addClickEventToPages();
}

function addClickEventToPages() {
  [...document.querySelectorAll(".tempPages")].forEach( element => {
    element.addEventListener("click", event => {
      pageData = JSON.parse(event.target.dataset.pageData);
      changePagePokemons(pageData); 
    });
  });
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

