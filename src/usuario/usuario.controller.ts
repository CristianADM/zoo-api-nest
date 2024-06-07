import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ExisteUsuarioPipe } from './pipe/existe-usuario.pipe';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ROL } from 'src/common/enums/rol.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post('/registro-empleados')
  @Auth([ROL.ADMIN])
  registroUsuarios(@Body(ExisteUsuarioPipe) usuarioRegistroDto: CreateUsuarioDto) {
       return this.usuarioService.registroUsuarios(usuarioRegistroDto);
  }
}
