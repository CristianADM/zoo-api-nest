import { Injectable } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comentario } from './entities/comentario.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { ManejoExcepcionesService } from 'src/common/manejo-excepciones/manejo-excepciones.service';
import { IUsuarioActivo } from 'src/common/interfaces/user-active.interfaces';
import { ESTADOS } from 'src/common/constantes/constantes';

@Injectable()
export class ComentariosService {

  constructor(
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
    private readonly manejoExcepcionesService: ManejoExcepcionesService
  ) {}

  async create(usuario: IUsuarioActivo, createComentarioDto: CreateComentarioDto) {
    try {
      const comentario = this.comentarioRepository.create(createComentarioDto);
      comentario.idUsuario = usuario.idUsuario;
      return await this.comentarioRepository.save(comentario);
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.comentarioRepository.find({
        relations: {
          comentariosHijos: {
            comentariosHijos: true
          }
        }
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async desactivarComentariosPorIdAnimal(idAnimal: number) {
    try {
      return await this.comentarioRepository.update({ idAnimal},{ estadoActivo: false});
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async consultarComentarioActivoPorId(idComentario: number) {
    try {
      return await this.comentarioRepository.findOneBy({
        idComentario,
        estadoActivo: true
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
  
  async consultarPorcentajeComentariosConRespuesta() {
    try {
      const totalComentarios = await this.comentarioRepository.count({
        where: {
          idComentarioPadre: IsNull(),
          estadoActivo: ESTADOS.activo.boolean
        }
      });

      const totalComentariosConRespuesta = await this.comentarioRepository.count({
        where: {
          idComentarioPadre: Not(IsNull()),
          estadoActivo: ESTADOS.activo.boolean
        }
      });

      const porcentaje = (totalComentariosConRespuesta / totalComentarios) * 100;
      return {
        porcentaje: parseFloat(porcentaje.toFixed(3))
      };

    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
}
