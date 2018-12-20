document.addEventListener('DOMContentLoaded', () => {

  let allDogs = []

  const tableBody = document.querySelector('#table-body')
  const dogForm = document.querySelector('#dog-form')

  function renderDog(dog) {
    tableBody.innerHTML += `
      <tr data-id='${dog.id}'>
        <td> ${dog.name} </td>
        <td> ${dog.breed} </td>
        <td> ${dog.sex} </td>
        <td><button data-id='${dog.id}' class='edit-button'>Edit</button></td>
      </tr>
    `
  }

  function fetchAndRenderAllDogs() {
    fetch('http://localhost:3000/dogs')
    .then( result => result.json() )
    .then( parsedResult => {
      allDogs = parsedResult
      allDogs.forEach( dog => renderDog(dog) )
    })
  }

  fetchAndRenderAllDogs()

  document.body.addEventListener('click', event => {
    if (event.target.className === 'edit-button') {
      const editedDogId = event.target.dataset.id
      const editedDog = allDogs.find( dog => dog.id == editedDogId )

      dogForm.dataset.id = editedDogId
      const nameInput = document.getElementsByName('name')[0]
      const breedInput = document.getElementsByName('breed')[0]
      const sexInput = document.getElementsByName('sex')[0]

      nameInput.value = editedDog.name
      breedInput.value = editedDog.breed
      sexInput.value = editedDog.sex
    }
  })

  document.body.addEventListener('submit', event => {
    event.preventDefault()

    const editedDogId = event.target.dataset.id
    // const editedDogIndex = allDogs.findIndex( dog => dog.id === editedDogId )

    const nameInput = document.getElementsByName('name')[0].value
    const breedInput = document.getElementsByName('breed')[0].value
    const sexInput = document.getElementsByName('sex')[0].value

    fetch(`http://localhost:3000/dogs/${editedDogId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: nameInput,
        breed: breedInput,
        sex: sexInput
      })
    })
    .then( () => {
      dogForm.reset()
      tableBody.innerHTML = ""
      fetchAndRenderAllDogs()
    })
  })
})
