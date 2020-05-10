const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
let pokemonData = [] // array index is pokemon id 

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
    pokemonData[0] = {} // set array index = pokemon id 
    for (let i = 0; i < json.length; i++) {
        pokemonData[i + 1] = json[i]        
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

    const currentPokemonData = pokemonData[pokemonId]
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
    console.log('remove pokemon')
    event.target.parentElement.remove()
}

function addPokemonToCard(event) {    
    const card = event.target.parentElement
    const numberOfPokemon = event.target.parentElement.getElementsByTagName('li').length

    if (numberOfPokemon < 6) {
        const randomPokemonId = Math.floor(Math.random()*pokemonData.length)
        addPokemonLiToCard(card, randomPokemonId)
        console.log('add pokemon')
    } else {
        console.log('already have 6 pokemon')
    }
}
