import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { EspecieService } from '../especie.service';
import { CreateEspecieDto } from '../dto/create-especie.dto';
import { UpdateEspecieDto } from '../dto/update-especie.dto';
import { CreateAnimalDto } from 'src/animal/dto/create-animal.dto';
import { UpdateAnimalDto } from 'src/animal/dto/update-animal.dto';

@Injectable()
export class EspeciePipe implements PipeTransform {

  constructor(
    private readonly especieServie: EspecieService
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {

    if(metadata.type === "param") {
      
      await this.validarEspeciePorId(value);

    } else if(metadata.type === "body") {
      
      if(metadata.metatype.name == CreateEspecieDto.name || metadata.metatype.name == UpdateEspecieDto.name) {
        
        let especieNombre = value.nombre;
        const zona = await this.especieServie.consultarEspeciePorNombre(especieNombre);
        if(zona) {
          throw new BadRequestException("Ya existe una especie con ese nombre");
        }
      }

      if(metadata.metatype.name === CreateAnimalDto.name || metadata.metatype.name === UpdateAnimalDto.name) {
        await this.validarEspeciePorId(value.idEspecie);
      }
    }

    return value;
  }

  private async validarEspeciePorId(id: number) {
    const espcie = await this.especieServie.consultarEspeciesActivasPorId(id);
    if(!espcie) {
      throw new NotFoundException("No existe una especie con ese id");
    }
  }
}
