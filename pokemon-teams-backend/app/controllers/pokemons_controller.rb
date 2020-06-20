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
            }, status: 400     
        end
    end

    def destroy
        trainer = Trainer.find(params[:trainerId])
        pokemon = Pokemon.find(params[:pokemonId])
        # pokemon = Pokemon.destroy(params[:pokemonId])
        trainer.pokemons.destroy(pokemon)
        render json: pokemon
    end
end
