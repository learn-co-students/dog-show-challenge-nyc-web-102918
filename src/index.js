document.addEventListener('DOMContentLoaded', () => {
  const dogTable = document.getElementById("dog-table")
  const dogForm = document.getElementById("dog-form")
  let nameInput = dogForm.querySelector("input[name='name']")
  let breedInput = dogForm.querySelector("input[name='breed']")
  let sexInput = dogForm.querySelector("input[name='sex']")

  let allDogs = []

  fetch("http://localhost:3000/dogs")
  .then(r => r.json())
  .then(data => {
    allDogs = data
    data.forEach(dog => {
      dogTable.innerHTML += `
        <tr data-id="${dog.id}">
          <td>${dog.name}</td>
          <td>${dog.breed}</td>
          <td>${dog.sex}</td>
          <td><button data-id="${dog.id}" data-action="edit">Edit</button></td>
        </tr>
      `
    })
  })

  dogTable.addEventListener("click", e => {
    if (e.target.dataset.action === "edit") {
      console.log(allDogs);
      const foundDog = allDogs.find(dog => dog.id == e.target.dataset.id)
      nameInput.value = foundDog.name
      breedInput.value = foundDog.breed
      sexInput.value = foundDog.sex
      dogForm.setAttribute("data-target", e.target.dataset.id)
    }
  })

  dogForm.addEventListener("submit", e => {
    e.preventDefault()
    console.log(`http://localhost:3000/dogs/${e.target.dataset.target}`);
    fetch(`http://localhost:3000/dogs/${e.target.dataset.target}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: nameInput.value,
        breed: breedInput.value,
        sex: sexInput.value
      })
    })
    .then(r => r.json())
    .then(data => {
      let foundDog = allDogs.find(dog => dog.id == data.id)
      foundDog = data
      foundDogTr = dogTable.querySelector(`tr[data-id="${data.id}"]`)
      foundDogTr.innerHTML = `
        <td>${data.name}</td>
        <td>${data.breed}</td>
        <td>${data.sex}</td>
        <td><button data-id="${data.id}" data-action="edit">Edit</button></td>
      `
      e.target.reset()
    })
  })
})
