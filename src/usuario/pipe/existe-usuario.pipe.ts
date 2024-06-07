import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UsuarioService } from '../usuario.service';
import { ESTADOS } from 'src/common/constantes/constantes';

@Injectable()
export class ExisteUsuarioPipe implements PipeTransform {
  constructor(
    private readonly usuarioService: UsuarioService
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {

    const usuario = await this.usuarioService.consultarUsuarioPorCorreo(value.correo, ESTADOS.activo.boolean);

    if(usuario) {
      throw new BadRequestException("El usuario ya se encuentra registrado");
    }

    return value;
  }
}
