document.addEventListener('DOMContentLoaded', () => {

  const tableBody = document.querySelector('#table-body')
  const editForm = document.querySelector('#dog-form')
  let allDogs = []
  let foundDog = ''


  function fetchDogs() {
    fetch('http://localhost:3000/dogs')
    .then((r) => r.json())
    .then((data) => {
      allDogs = data
      showAllDogs(data)
    })
  }

  fetchDogs()

  function showAllDogs(dogs) {
    tableBody.innerHTML = dogs.map(renderSingleDog).join('')
  }

  function renderSingleDog(dog) {
    return `
      <tr>
        <td>${dog.name}</td>
        <td>${dog.breed}*</td>
        <td>${dog.sex}</td>
        <td><button data-action='edit-btn' data-id='${dog.id}'>Edit</button>
        </td>
      </tr>
    `
  }

  tableBody.addEventListener('click', (e) => {
    if (e.target.dataset.action === 'edit-btn') {
      foundDog = allDogs.find((dog) => {
        return event.target.dataset.id == dog.id
      })
      editForm.innerHTML = `
      <form id='dog-form' class="padding margin border-round border-grey">
        <input id="edit-name" type="name" name="name" placeholder="${foundDog.name}" value="">
        <input id="edit-breed" type="breed" name="breed" placeholder="${foundDog.breed}" value="">
        <input id="edit-sex" type="sex" name="sex" placeholder="${foundDog.sex}" value="">
        <input type="submit"value="Submit">
      </form>
      `
    }
  })

  editForm.addEventListener('submit', (e) => {
    if (e.target.tagName === 'FORM') {
      const editDogName = e.target.querySelector('#edit-name').value
      const editDogBreed = e.target.querySelector('#edit-breed').value
      const editDogSex = e.target.querySelector('#edit-sex').value
      fetch(`http://localhost:3000/dogs/${foundDog.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type' : 'application/json',
          'Accept' : 'application/json'
        },
        body: JSON.stringify( {
          name: editDogName,
          breed: editDogBreed,
          sex: editDogSex
        })
      })
      .then((r) => r.json())
      .then((editedDog) => {
        const editedDogIndex = allDogs.findIndex(dog => dog.id === editedDog.id)
        allDogs[editedDogIndex] = editedDog
        console.logs(allDogs)
        showAllDogs(allDogs)
      })
    }
  })



})
