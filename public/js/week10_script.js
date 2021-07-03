const socket = io(window.location.origin);



document.querySelector("#fetchAllBtn").addEventListener("click", () => {
  console.log("estoy en clcik");
  const avengersList = document.getElementById("avengersList");

  fetch("/week10/fetchAll", {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => response.json())
  .then( data => renderDataToHtml(data, avengersList))
  .catch(error => {
    console.log(error);
  });

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

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

socket.on("insert", data => {
  renderDataToHtml(data.dummyData, document.querySelector("#avengersList"));
  
  Toast.fire({
    icon: 'success',
    title: 'New Avenger Inserted!'
  })
});

function renderDataToHtml(data, parentHtmlElement) {
  let counter = 0;
   
  parentHtmlElement.innerHTML = "";

  data.avengers.forEach(element => {
    counter += 1;
    parentHtmlElement.innerHTML += 

    `<div class="accordion-item" id="accordionFlushExample">
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

  document.querySelector("#listAvg-heading").innerHTML = `List of Avengers: ${counter} avengers`
  
}