import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { json } from 'stream/consumers';

@Injectable()
export class PokemonService {
  constructor(@InjectModel(Pokemon.name) private pokemonModel: Model<Pokemon>) {}

  async create(createPokemonDto: CreatePokemonDto) : Promise<Pokemon> {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const createdPokemon = new this.pokemonModel(createPokemonDto);
      return await createdPokemon.save();
    } catch (error) {
      this.handleExeption(error);
    }
    
  }

 async findAll(): Promise<Pokemon[]> {
    return this.pokemonModel.find().exec();
  }

  async findOne(id: string): Promise<Pokemon> {
    let pokemon : Pokemon;

    try {
      if(!isNaN(+id)){
        pokemon = await this.pokemonModel.findOne({no:id}).exec();
      }

      //MongoID
      if(!pokemon && isValidObjectId(id)){
        pokemon =await this.pokemonModel.findById(id).exec();
      }
     
      if(!pokemon){
        pokemon = await this.pokemonModel.findOne({name:id.toLowerCase().trim()}).exec();
      }
      
      if (!pokemon) {
        throw new NotFoundException(`Pokemon #${id} not found`);
      }
      return  pokemon;
    } catch (error) {
      this.handleExeption(error);
    }
  
  }

 async update(id: string, updatePokemonDto: UpdatePokemonDto) {

   try{
    const pokemon =await this.findOne(id);
    
    if(updatePokemonDto.name){ updatePokemonDto.name = updatePokemonDto.name.toLowerCase();}

    await pokemon.updateOne(updatePokemonDto,{new:true});

    return {...pokemon.toJSON(), ...updatePokemonDto};
   }catch(error){ 
      this.handleExeption(error);
   }
  }

  async remove(id: string) {
      const {deletedCount}= await this.pokemonModel.deleteOne({_id:id}).exec();
      if(deletedCount === 0){
        throw new BadRequestException(`Pokemon #${id} not found`);
      }
      return;
  }

  private handleExeption(error: any){
    if (error.code === 11000) { // duplicate key                                    keyValue
      throw new BadRequestException(`Pokemon already exists ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Error  ${JSON.stringify(error.message)}`);
  }
}
