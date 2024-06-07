import { BadRequestException, Injectable } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService
    ) {}

    async login(loginDto: LoginDto) {
        const usuario = await this.usuarioService.buscarUsuarioConContrasennaPorCorreo(loginDto.correo);

        if (!usuario) {
            throw new BadRequestException('El correo y/o contraseña no son validos');
        }

        const esContrasennaValida = bcrypt.compareSync(
            loginDto.contrasenna,
            usuario.contrasenna,
        );
        
        if (!esContrasennaValida) {
            throw new BadRequestException('El correo y/o contraseña no son validos');
        }

        const payload = {
            idUsuario: usuario.idUsuario,
            correo: usuario.correo,
            rol: usuario.rol,
        };

        const token = await this.jwtService.signAsync(payload);

        try {
            await this.usuarioService.registrarToken(usuario.idUsuario, token)
        } catch (error) {
            console.log(`El error se ejecuta cuando se guarda el token en la tabla usuario \n${error}`);
        }
        

        return { token };
    }
}
