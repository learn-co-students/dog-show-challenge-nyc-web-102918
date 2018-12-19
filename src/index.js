document.addEventListener('DOMContentLoaded', () => {
const tableBody = document.querySelector('#table-body')   // for use in showDogs

// for use in handleClick
const dogForm=document.querySelector('#dog-form')
const dogNameInput=dogForm.querySelector('input[name="name"]')
const dogBreedInput=dogForm.querySelector('input[name= "breed"]')
///
let currentResponse={}
let allDogs;


  function Adapter(baseURL){
    function get(route){
      return fetch(baseURL+route)
      .then((resp)=>{currentResponse=resp;return resp.json()})
    }
    function post(route,data){
      return fetch(baseURL+route,{
        method: "POST",
        headers:{ 'Content-Type': 'application/json', 'Accepts': 'application/json'},
        body: JSON.stringify(data)
      })
      .then((resp)=>{currentResponse=resp;return resp.json()})
    }
    function patch(route,data){
      return fetch(baseURL+route,{
        method: "PATCH",
        headers:{ 'Content-Type': 'application/json', 'Accepts': 'application/json'},
        body: JSON.stringify(data)
      })
      .then((resp)=>{currentResponse=resp;return resp.json()})
    }

    return { get: get, post: post, patch: patch}
  }
  let adapter=Adapter('http:localhost:3000');
  adapter.get('/dogs').then((dogData) => {
    if (currentResponse.status > 300){
      console.log('error retrieving dogs')}
    else{console.log(dogData);allDogs=dogData;showDogs(dogData)}

  })

  function showDogs(dogs){
    function dogsReducer(dogsHTML, dog){
        // edit button stores the dog id so it can be used for patch requests
      return dogsHTML + `<tr>
                              <td>${dog.name}</td>
                              <td>${dog.breed}</td>
                              <td>${dog.breed}</td>
                              <td><button data-type="edit_button" data-id= ${dog.id}>Edit</button></td>
                          </tr>`
    }

    tableBody.innerHTML= dogs.reduce(dogsReducer,'')

  }



  function handleClick(event){
    if (event.target.dataset.type==='edit_button'){

      const id=event.target.dataset.id // get id of the dog we're editing
      let foundDog=allDogs.find((dog) => dog.id==id)//find the dog
      // autofill the edit form
      dogNameInput.value=foundDog.name
      dogBreedInput.value=foundDog.breed
      dogForm.dataset.id=id // set the form's data-id so it knows who its editing
    }


  }
  function handleSubmit(event){
    event.preventDefault();
    // check that we are editing a dog
    if (event.target===dogForm){

      const id=event.target.dataset.id // get id of the dog we're editing
      let foundDog=allDogs.find((dog)=> dog.id===id)//find the dog
      let userDog={name: dogNameInput.value , breed: dogBreedInput.value}
      // autofill the edit form
      adapter.patch(`/dogs/${id}`, userDog).then((returnedDog)=>{
        console.log(returnedDog);

        let dogIndex= allDogs.findIndex(function(dog){return dog.id===returnedDog.id})
        console.log('dog index is',dogIndex)
        allDogs[dogIndex]=returnedDog
        tableBody.innerHTML=''
        showDogs(allDogs);

      })
    }


  }

  document.addEventListener('click',handleClick);
  document.addEventListener('submit',handleSubmit)

})
