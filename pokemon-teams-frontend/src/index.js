const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const main = document.querySelector('main')

document.addEventListener('DOMContentLoaded', () => {
    fetchTrainers()

})

function fetchTrainers() {
    fetch(TRAINERS_URL)
        .then(resp => resp.json())
        .then(json => { 
            for (trainer of json) {
                makeCard(trainer)
            }
        })
}

function makeCard(trainer) {
    const cardDiv = document.createElement('div')
    cardDiv.classList.add('card')
    cardDiv.setAttribute('data-id', trainer.id)

    const pTrainerName = document.createElement('p')
    pTrainerName.innerText = trainer.name 
    cardDiv.appendChild(pTrainerName)

    const addPokemonButton = document.createElement('button')
    addPokemonButton.setAttribute('data-trainer-id', trainer.id)
    addPokemonButton.innerText = 'Add Pokemon'
    addPokemonButton.addEventListener('click', addPokemon)
    cardDiv.appendChild(addPokemonButton)

    const pokemonList = document.createElement('ul')

    for (const pokemon of trainer.pokemons) {    
        renderPokemon(pokemon, pokemonList)
    }
    
    cardDiv.appendChild(pokemonList)

    main.appendChild(cardDiv)
}

function renderPokemon(pokemon, pokemonList) {
    const listItem = document.createElement('li')
    listItem.innerText = `${pokemon.nickname} (${pokemon.species})`

    const button = document.createElement('button')
    button.classList.add('release')
    button.setAttribute('data-pokemon-id', pokemon.id)
    button.innerText = 'Release'
    button.addEventListener('click', deletePokemon)
    listItem.appendChild(button)
    
    pokemonList.appendChild(listItem)
}

function addPokemon(event) {
    
    const trainerId = event.target.dataset.trainerId
    const pokeObject = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({trainerId: trainerId})
    }

    fetch(POKEMONS_URL, pokeObject)
        .then(resp => resp.json())
        .then(json => {
            if (json.status === 'error') {
                console.log(json.message)
            } else {
                const cardDiv = document.querySelector(`.card[data-id="${json.trainer.id}"]`)
                const pokemonList = cardDiv.querySelector('ul')

                renderPokemon(json, pokemonList)
            }
        })
        .catch(error => {
            debugger
            console.log(error.message)
        })
}

function deletePokemon(event) {
    const trainerId = event.target.parentNode.parentNode.parentNode.getAttribute('data-id')
    const parentList = event.target.parentNode.parentNode
    const pokemonId = event.target.dataset.pokemonId

    const pokeObject = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({trainerId: trainerId,
        pokemonId: pokemonId})
    }

    fetch(POKEMONS_URL + '/' + pokemonId, pokeObject)
        .then(resp => resp.json())
        .then(json => {   
            const cardDiv = document.querySelector(`.card[data-id="${json.trainer.id}"]`)
            const pokemonList = cardDiv.querySelector('ul')
            const pokeListItem = pokemonList.querySelector(`button[data-pokemon-id="${json.id}"]`)
            pokemonList.removeChild(pokeListItem.parentElement)   
        })
        .catch(error => {
            debugger
            console.log(error.message)
        })
}