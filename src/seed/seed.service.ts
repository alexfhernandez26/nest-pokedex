import { Injectable } from '@nestjs/common';

import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios-adapter';

@Injectable()
export class SeedService {
 constructor(
  @InjectModel(Pokemon.name) 
  private pokemonModel: Model<Pokemon>,
  private readonly http: AxiosAdapter
  ) {}
  
  async executedSeed() {
    const  data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=700')

    const pokemonToIntertMany : {name: string, no: number}[] = [];
    data.results.forEach(async ({name,url})=> {
      const segments = url.split('/');
      const no:number = +segments[segments.length-2];
      
      pokemonToIntertMany.push({name,no});
    });

    await this.pokemonModel.insertMany(pokemonToIntertMany);
    return "Seed executed successfully!";
  }
}
