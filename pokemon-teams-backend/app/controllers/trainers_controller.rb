class TrainersController < ApplicationController
    def index
        trainers = Trainer.all 
        # byebug
        render json: trainers, each_serializer: TrainerSerializer
    end

    
end
