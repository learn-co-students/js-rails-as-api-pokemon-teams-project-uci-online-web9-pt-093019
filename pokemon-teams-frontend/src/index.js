const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
let pokemonData = [] // global variable to store all pokemon on page load

document.addEventListener('DOMContentLoaded', onLoad)

function onLoad() {
    fetchPokemon()      // save pokemon to global variable  
    fetchTrainers()    // fetch trainers then build cards
}

function fetchTrainers() {
    fetch(TRAINERS_URL).then(resp => resp.json()).then(json => parseTrainers(json['data']));  
}

function parseTrainers(json) {
    for (let i = 0; i < json.length; i++) {
        const currentTrainerData = json[i]
        buildCard(currentTrainerData)
    }    
}

function fetchPokemon() {
    fetch(POKEMONS_URL).then(resp => resp.json()).then(json => parsePokemon(json['data']));  
}

function parsePokemon(json) {
    for (let i = 0; i < json.length; i++) {
        pokemonData[i] = json[i]       
    }
}

function buildCard(trainerData) {
    
    const associatedPokemon = trainerData["relationships"]["pokemon"]["data"]
    const card = document.createElement('div')
    const container = document.getElementsByTagName('main')[0]
    const trainerName = document.createElement('p')
    const addPokemonButton = document.createElement('button')
    const pokemonList = document.createElement('ul')    

    card.setAttribute('class', 'card')    
    card.setAttribute('data-id', trainerData.id)
    trainerName.innerText = trainerData['attributes'].name
    addPokemonButton.setAttribute('data-trainer-id', trainerData.id)
    addPokemonButton.innerText = "Add Pokemon"
    addPokemonButton.addEventListener('click', addPokemonToCard)

    card.appendChild(trainerName)
    card.appendChild(addPokemonButton)
    card.appendChild(pokemonList)

    for (let i = 0; i < associatedPokemon.length; i++) { 
        const currentPokemonId = associatedPokemon[i].id 
        addPokemonLiToCard(card, currentPokemonId)        
    }   
    
    container.appendChild(card)
}

function addPokemonLiToCard(card, pokemonId) {
    const li = document.createElement('li')
    const removeButton = document.createElement('button')
    const pokemonList = card.getElementsByTagName('ul')[0]

    const currentPokemonData = pokemonData.find(pokemonElement => pokemonElement.id == pokemonId)
    const name = currentPokemonData['attributes'].nickname
    const species = currentPokemonData['attributes'].species 

    removeButton.setAttribute('class', 'release')
    removeButton.setAttribute('data-pokemon-id', pokemonId)
    removeButton.innerText = 'Release'
    removeButton.addEventListener('click', removePokemonFromCard)

    li.innerText = `${name} (${species})`
    li.appendChild(removeButton)

    pokemonList.appendChild(li)
}

function removePokemonFromCard(event) { 
    //1. delete from database 2. remove from dom 3. remove from pokemondata array
    const pokemonId = event.target.dataset.pokemonId
    fetchRequestToDeletePokemon(pokemonId)

    event.target.parentElement.remove()

    thisPokeIndex = pokemonData.findIndex(function(pokeData) {
        return pokeData.id == pokemonId
    })
    pokemonData.splice(thisPokeIndex, 1)
}

function addPokemonToCard(event) {     // need to update pokemon data array or change how add pokemonlitocard works 
    const card = event.target.parentElement
    const trainerId = card.dataset.id
    const numberOfPokemon = event.target.parentElement.getElementsByTagName('li').length

    if (numberOfPokemon < 6) {   
        fetchRequestToCreatePokemon(trainerId).then(function(pokemonObj){
            pokemonData.push(pokemonObj)
            addPokemonLiToCard(card, pokemonObj.id)
        })     
        
    } else {
        console.log('already have 6 pokemon')
    }
}

function fetchRequestToDeletePokemon(pokemonId) {
    const configurationObject = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({id: pokemonId}) 
    }
    return fetch(`http://localhost:3000/pokemons/${pokemonId}`, configurationObject).catch(function(error) {
        alert("Error")
        console.log(error.message)
    })
}

function fetchRequestToCreatePokemon(trainerId) {
    const configurationObject = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: trainerId})
    }
    return fetch(POKEMONS_URL, configurationObject).then(function(resp) {
        return resp.json()
    }).then(function(pokeObj) {
        return pokeObj['data']
    }).catch(function(error) {
        alert("Error")
        console.log(error)
    })
}
