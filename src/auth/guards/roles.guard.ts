import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ROL } from 'src/common/enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {

    const roles: string[] = this.reflector.getAllAndOverride<ROL[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass
    ]);

    if(!roles) {
      return true;
    }

    const {usuario} = context.switchToHttp().getRequest();
    return roles.includes(usuario.rol);
  }
}
