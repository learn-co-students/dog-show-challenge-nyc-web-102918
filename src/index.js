document.addEventListener('DOMContentLoaded', () => {
  const dogsURL = `http://localhost:3000/dogs/`
  const tableBody = document.getElementById('table-body')
  const nameInput = document.getElementById('input-name')
  const breedInput = document.getElementById('input-breed')
  const sexInput = document.getElementById('input-sex')
  const dogForm = document.getElementById('dog-form')
  let editDog
  let allDogs = []

  const getDogs = () => {
    fetch(dogsURL)
     .then(response => response.json())
     .then(data => {
       allDogs = data
       showDogs(allDogs)
     })
  }

  const showDogs = (dogs) => {
    tableBody.innerHTML = ''
    dogs.forEach((dog) => {
      tableBody.innerHTML += `
        <tr>
          <td>${dog.name}</td>
          <td>${dog.breed}</td>
          <td>${dog.sex}</td>
          <td><button data-id='${dog.id}'>Edit</button></td>
        </tr>
      `
    })
  }

  tableBody.addEventListener('click', (event) => {
    editDog = allDogs.find((dog) => {
      return dog.id == event.target.dataset.id
    })
    nameInput.value = editDog.name
    breedInput.value = editDog.breed
    sexInput.value = editDog.sex
  })

  dogForm.addEventListener('submit', (event) => {
    event.preventDefault()
    fetch((dogsURL + editDog.id), {
      method: 'PATCH',
      headers: {
        'Content-Type' : 'application/json',
        'Accepts' : 'application/json'
      },
      body: JSON.stringify({
        name: nameInput.value,
        breed: breedInput.value,
        sex: sexInput.value
      })
    })
    .then(getDogs)
    dogForm.reset()
  })

  getDogs();
})
