import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from "express";
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly usuarioService: UsuarioService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if(!token) {
      throw new UnauthorizedException("No hay token en la petición");
    }

    const usuario = await this.usuarioService.consultarUsuarioPorToken(token);

    if(!usuario) {
      throw new UnauthorizedException("Token no valido");
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token, {
          secret: process.env.SECRETKEY
        });

      request.usuario = payload;
    } catch (error) {
      throw new UnauthorizedException("Token no valido");
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
