class PokemonsController < ApplicationController
    def create
        trainer = Trainer.find(params[:trainerId])
        if trainer.pokemons.length < 6
            name = Faker::Name.first_name
            species = Faker::Games::Pokemon.name

            trainer.pokemons.build(nickname: name, species: species)
            trainer.save

            render json: trainer.pokemons.last
        else
            render json: {
                status: "error",
                message: 'bad request - maximum pokemon exceeded'
            }     
        end
    end

    def destroy
        trainer = Trainer.find(params[:trainerId])
        pokemon = Pokemon.destroy(params[:pokemonId])
        render json: pokemon
    end
end
