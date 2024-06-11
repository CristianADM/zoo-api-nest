import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ZonaService } from '../zona.service';
import { ESTADOS } from 'src/common/constantes/constantes';
import { CreateZonaDto } from '../dto/create-zona.dto';
import { UpdateZonaDto } from '../dto/update-zona.dto';
import { CreateEspecieDto } from 'src/especie/dto/create-especie.dto';
import { UpdateEspecieDto } from 'src/especie/dto/update-especie.dto';

@Injectable()
export class ZonaPipe implements PipeTransform {

  constructor(
    private readonly zonaService: ZonaService
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {

    if(metadata.type === "param") {

      await this.validarZonaPorId(value);
      
    } else if(metadata.type === "body") {
      
      if(metadata.metatype.name == CreateZonaDto.name || metadata.metatype.name == UpdateZonaDto.name) {
        
        let zonaNombre = value.nombre;
        const zona = await this.zonaService.consultarZonaPorNombre(zonaNombre, ESTADOS.activo.boolean);
        if(zona) {
          throw new BadRequestException("Ya existe una zona con ese nombre");
        }
      }

      if(metadata.metatype.name == CreateEspecieDto.name || metadata.metatype.name == UpdateEspecieDto.name) {
        await this.validarZonaPorId(value.idZona);
      }
    }
    
    return value;
  }

  private async validarZonaPorId(id: number) {
    const zona = await this.zonaService.consultarZonasActivas(id);
    if(!zona) {
      throw new NotFoundException("No existe una zona con ese id");
    }
  }
}
