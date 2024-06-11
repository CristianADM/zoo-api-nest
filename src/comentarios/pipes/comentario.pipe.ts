import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { ComentariosService } from '../comentarios.service';
import { CreateComentarioDto } from '../dto/create-comentario.dto';
import { UpdateComentarioDto } from '../dto/update-comentario.dto';

@Injectable()
export class ComentarioPipe implements PipeTransform {

  constructor(
    private readonly comentarioService: ComentariosService
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {

    if(metadata.type === "body") {
      
      if(metadata.metatype.name === CreateComentarioDto.name
        || metadata.metatype.name === UpdateComentarioDto.name) {

        if((value.idComentarioPadre && value.idAnimal) ||
            (!value.idComentarioPadre && !value.idAnimal)) {
          throw new BadRequestException("Debe enviar el Id del animal asociado o el Id del comentario padre asociado");
        }

        if(value.idComentarioPadre) {
          let comentario = await this.comentarioService.consultarComentarioActivoPorId(value.idComentarioPadre);
          if(!comentario) {
            throw new NotFoundException("No existe un comentario con ese Id");
          }

          value.idAnimal = comentario.idAnimal;
        }
      }
    }

    return value;
  }
}
