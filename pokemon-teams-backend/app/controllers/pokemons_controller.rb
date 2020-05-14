class PokemonsController < ApplicationController

    def index 
        pokemons = Pokemon.all 
        render json: PokemonSerializer.new(pokemons)
    end 

    def create
        trainer = Trainer.find(params[:id])
        name = Faker::Name.first_name
        species = Faker::Games::Pokemon.name
        pokemon = Pokemon.create(nickname: name, species: species, trainer_id: trainer.id) 
        
        render json: PokemonSerializer.new(pokemon)
    end 

    def show 
        pokemon = Pokemon.find(params[:id])
        render json: PokemonSerializer.new(pokemon)
    end 

    def destroy 
        pokemon = Pokemon.find(params[:id])
        pokemon.destroy 
    end 
end
