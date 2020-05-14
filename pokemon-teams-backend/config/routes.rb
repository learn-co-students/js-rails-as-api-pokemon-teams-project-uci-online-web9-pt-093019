Rails.application.routes.draw do
  resources :pokemons, only: [:index, :create, :show, :destroy] 
  resources :trainers, only: :index 
end
