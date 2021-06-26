
console.log("olas");
document.querySelector("#fetchAllBtn").addEventListener("click", () => {
  console.log("estoy en clcik");
  const avengersList = document.getElementById("avengersList");
  let counter = 0;
  fetch("/week10/fetchAll", {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json())
  .then( data => {
    avengersList.innerHTML = "";
    data.avengers.forEach(element => {
      counter += 1;
      avengersList.innerHTML += //`<li class="list-group-item">${element.name}</li>`;

      `<div class="accordion-item">
        <h2 class="accordion-header" id="flush-heading-${counter}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-${counter}" aria-expanded="false" aria-controls="flush-${counter}">
            ${element.name}
          </button>
        </h2>
        <div id="flush-${counter}" class="accordion-collapse collapse" aria-labelledby="flush-heading-${counter}" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body"><strong>Powers:</strong> ${element.powers ? element.powers : "No powers to show"}</div>
        </div>
      </div>`;
    });
  })
});

// Adding a new name 
document.querySelector("#submitName").addEventListener("click", () => {
  const name = document.querySelector("#avgName").value;
  const powers = document.querySelector("#avgPower").value;
  const dataToInsert = {name: name, powers: powers};
  fetch("/week10/insert", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToInsert)

  })
  .then(response => response.json())
  .then(  data => {
    console.log("response");

    if(data.msg === "success") {
      console.log("respuesta exitos");
      Swal.fire(
        'Success',
        'The new name was successfully added',
        'success'
      );    
    }
  });
});