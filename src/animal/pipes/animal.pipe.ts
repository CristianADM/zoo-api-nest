import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { AnimalService } from '../animal.service';
import { UpdateAnimalDto } from '../dto/update-animal.dto';
import { CreateAnimalDto } from '../dto/create-animal.dto';
import { CreateComentarioDto } from 'src/comentarios/dto/create-comentario.dto';
import { UpdateComentarioDto } from 'src/comentarios/dto/update-comentario.dto';

@Injectable()
export class AnimalPipe implements PipeTransform {

  constructor(
    private readonly animalService: AnimalService
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {

    if(metadata.type === "param") {

      await this.validarAnimalPorId(value);
      
    } else if(metadata.type === "body") {
      
      if(metadata.metatype.name == CreateAnimalDto.name || 
          metadata.metatype.name == UpdateAnimalDto.name) {
        
        let animalNombre = value.nombre;
        const animal = await this.animalService.consultarAnimalPorNombreYEspecie(animalNombre, value.idEspecie);
        if(animal) {
          throw new BadRequestException("Ya existe un animal con ese nombre en la especie");
        }
      }

      if(metadata.metatype.name == CreateComentarioDto.name || 
          metadata.metatype.name == UpdateComentarioDto.name) {
        
        if(value.idAnimal) {
          await this.validarAnimalPorId(value.idAnimal);
        }
      }
    }

    return value;
  }

  private async validarAnimalPorId(id: number) {
    const animal = await this.animalService.consultarAnimalActivoPorId(id);
    if(!animal) {
      throw new NotFoundException("No existe un animal con ese id");
    }
  }
}
