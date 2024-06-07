import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ) { }

  async registroUsuarios(createUsuarioDto: CreateUsuarioDto) {
    const salt = bcrypt.genSaltSync();
    createUsuarioDto.contrasenna = bcrypt.hashSync(createUsuarioDto.contrasenna, salt);

    const u = this.usuarioRepository.create(createUsuarioDto);
    const {contrasenna, ...usuario} = await this.usuarioRepository.save(u);

    return usuario;
  }

  async consultarUsuarioPorCorreo(correo: string, estado: boolean) {
    return await this.usuarioRepository.findOneBy({
      correo,
      estadoActivo: estado
    })
  }

  async buscarUsuarioConContrasennaPorCorreo(correo: string) {
    return await this.usuarioRepository.findOne({
      where: {
        correo,
        estadoActivo: true
      },
      select: ['idUsuario', 'correo', 'contrasenna', 'rol']
    });
  }

  async registrarToken(idUsuario, token: string) {
    return await this.usuarioRepository.update(idUsuario, {
      token: token
    });
  }

  async consultarUsuarioPorToken(token: string) {
    return await this.usuarioRepository.findOne({
      where: {
        token,
        estadoActivo: true
      }
    });
  }
}
