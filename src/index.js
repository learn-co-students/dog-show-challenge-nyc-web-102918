document.addEventListener('DOMContentLoaded', () => {
console.log("Hola")

let dogData = []
const dogsTable = document.getElementById('dog-table')
const dogEditForm = document.getElementById('dog-form')
let dogNameInput = document.querySelector("input[name='name']")
let dogSexInput = document.querySelector("input[name='sex']")
let dogBreedInput = document.querySelector("input[name='breed']")



  fetch('http://localhost:3000/dogs')
  .then( response => response.json())
  .then( dogsData => {
      dogData = dogsData
      showDogData(dogsData)

  })

  function showDogData(dogsData){
        dogsData.forEach(dog => {
          //td because represents the data in the table, tr is the row
          //Esto es una tabla por eso uso td and tr y el td debe ir para el button tambien si quiero mantener
          // todo en orden en la tabla
            dogsTable.innerHTML += `<tr data-id="${dog.id}">
                                          <td>${dog.name}</td>
                                          <td>${dog.breed}</td>
                                          <td>${dog.sex}</td>
                                          <td><button data-id="${dog.id}" data-action="edit">Edit</button></td>
                                        </tr>`
        })
  } // fin de la funcion showDogData

  dogsTable.addEventListener('click', (e)=>{

    if (e.target.dataset.action === "edit"){

      //console.log(dogData)
      console.log(e.target)
      // guardo el id de mi evento para luego buscar el dog que tenga el mismo id
      const clickedDog =parseInt(e.target.dataset.id)
      const foundDog = dogData.find(dog => dog.id === clickedDog)

      dogNameInput.value = foundDog.name
      dogBreedInput.value = foundDog.breed
      dogSexInput.value = foundDog.sex
      dogEditForm.dataset.id = foundDog.id
    }
  }) // fin del evento dog table


  dogEditForm.addEventListener('submit', (e)=> {
    e.preventDefault()

    const updateDogId = e.target.dataset.id
    fetch(`http://localhost:3000/dogs/${updateDogId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: dogNameInput.value,
        breed: dogBreedInput.value,
        sex: dogSexInput.value
      })
    })
    .then(response => response.json())
    .then(updateDog => {

      // debo actualizar mi data en mi array , primero debo encontrar el dog que tenga el mismo id
      let foundDog = dogData.find(dog => dog.id === updateDog.id)
      // ahora solo los igualo para que cambie todo lo demas
      foundDog = updateDog
      foundDogTr = dogsTable.querySelector(`tr[data-id="${updateDog.id}"]`)
      // sino lo encuentro me va a borrar toda la table y me coloca solo uno
      // es mejor encontrarlo y reemplazarlo con los nuevos valores 
      foundDogTr.innerHTML = `<tr data-id="${updateDog.id}">
                                    <td>${updateDog.name}</td>
                                    <td>${updateDog.breed}</td>
                                    <td>${updateDog.sex}</td>
                                    <td><button data-id="${updateDog.id}" data-action="edit">Edit</button></td>
                                  </tr>`
        e.target.reset()

    })

  }) // fin del dog Edit Form event


}) // fin del evento


///////////
