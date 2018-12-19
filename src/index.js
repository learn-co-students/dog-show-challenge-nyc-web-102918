document.addEventListener('DOMContentLoaded', () => {

  let allDogs
  const tableBody = document.querySelector('#table-body')
  const editDogForm = document.querySelector('#dog-form')
  let foundDog

  const fetchDogs = () => {
    fetch('http://localhost:3000/dogs')
    .then(response => response.json())
    .then(data => {
      allDogs = data
      showDogs(data)
    })
  }

  const showDogs = (allDogs) => {
    allDogs.forEach(dog => {
      tableBody.innerHTML += `<tr id="${dog.id}">
                              <td>${dog.name}</td>
                              <td>${dog.breed}</td>
                              <td>${dog.sex}</td>
                              <td><button id="edit_button">Edit</button></td>
                              </tr>`
    })
  }

  document.addEventListener('click', (event) => {
    if (event.target.id === "edit_button") {
      foundDog = allDogs.find(dog => {
        return event.target.parentNode.parentNode.id == dog.id
      })
      document.getElementById('form-name').value = foundDog.name
      document.getElementById('form-breed').value = foundDog.breed
      document.getElementById('form-sex').value = foundDog.sex
    }
  })

  editDogForm.addEventListener('submit', (event) => {
    event.preventDefault()

    foundDog.name = document.getElementById('form-name').value
    foundDog.breed = document.getElementById('form-breed').value
    foundDog.sex = document.getElementById('form-sex').value

    fetch(`http://localhost:3000/dogs/${foundDog.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify({
        name: foundDog.name,
        breed: foundDog.breed,
        sex: foundDog.sex
      })
    })

    tableBody.innerHTML = ''
    showDogs(allDogs)

    editDogForm.reset()
  })

  fetchDogs()

})
