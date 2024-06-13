import { Controller, Get, Post, Body } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROL } from 'src/common/enums/rol.enum';
import { AnimalPipe } from 'src/animal/pipes/animal.pipe';
import { ComentarioPipe } from './pipes/comentario.pipe';
import { UsuarioActivo } from 'src/common/decorators/usuario-activo.decorator';
import { IUsuarioActivo } from 'src/common/interfaces/user-active.interfaces';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  @Auth([ROL.ADMIN, ROL.EMPLEADO])
  create(@UsuarioActivo() usuario: IUsuarioActivo,
    @Body(AnimalPipe, ComentarioPipe) createComentarioDto: CreateComentarioDto) {
    return this.comentariosService.create(usuario, createComentarioDto);
  }

  @Get()
  @Auth([ROL.ADMIN, ROL.EMPLEADO])
  findAll() {
    return this.comentariosService.findAll();
  }
  
  @Get("/porcentaje-comentarios-con-respuesta")
  @Auth([ROL.ADMIN])
  consultarPorcentajeComentariosConRespuesta() {
    return this.comentariosService.consultarPorcentajeComentariosConRespuesta();
  }
}
