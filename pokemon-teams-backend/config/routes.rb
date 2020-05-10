Rails.application.routes.draw do
  resources :pokemons, only: :index 
  resources :trainers, only: :index 
end
