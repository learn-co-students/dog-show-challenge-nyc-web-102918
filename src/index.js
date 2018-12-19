document.addEventListener('DOMContentLoaded', () => {

    const table = document.querySelector('#table-body')
    const dogForm = document.querySelector('#dog-form')


    fetch('http://localhost:3000/dogs')
    .then(res => res.json())
    .then((res) => {return addDogToPage(res)})

    function addDogToPage(array) {
      array.forEach(function (dog) {
        table.innerHTML += `<tr id="table-${dog.id}"><td>${dog.name}</td> <td>${dog.breed}</td> <td>${dog.sex}</td> <td><button>Edit</button></td></tr>`
      })
    }

    table.addEventListener('click', function (event) {
      console.log(event.target.parentElement.parentElement.id);
      if(event.target.tagName === "BUTTON"){
      dogForm.children[0].value = event.target.parentElement.parentElement.children[0].innerHTML
      dogForm.children[1].value = event.target.parentElement.parentElement.children[1].innerHTML
      dogForm.children[2].value = event.target.parentElement.parentElement.children[2].innerHTML
      dogForm.children[3].value = event.target.parentElement.parentElement.id.split("-")[1]
      }
    })

    dogForm.addEventListener('submit', function (event) {
      event.preventDefault();
      console.log(event.target.children[3].value);
      if (event.target.id === "dog-form"){
        const specificRecord = document.querySelector(`#table-${event.target.children[3].value}`)
        console.log(event.target.children[0].value);
        fetch(`http://localhost:3000/dogs/${event.target.children[3].value}`, {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: `${event.target.children[0].value}`,
            breed: `${event.target.children[1].value}`,
            sex: `${event.target.children[2].value}`
          })
        }).then(res => res.json()).then((res) => {

          specificRecord.innerHTML = `<tr id="table-${event.target.children[3].value}"><td>${event.target.children[0].value}</td> <td>${event.target.children[1].value}</td> <td>${event.target.children[2].value}</td> <td><button>Edit</button></td></tr>`
          dogForm.children[0].value = ""
          dogForm.children[1].value = ""
          dogForm.children[2].value = ""
          dogForm.children[3].value = ""
          
        })// })////END FETCH AND THEN

        // dogForm.children[0].value = ""
        // dogForm.children[1].value = ""
        // dogForm.children[2].value = ""
        // dogForm.children[3].value = ""
        // dogForm.reset()
      }//// END IF STAT
    })





})////// END DOM LOADED
