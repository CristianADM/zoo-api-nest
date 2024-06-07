import { UseGuards, applyDecorators } from '@nestjs/common';
import { ROL } from 'src/common/enums/rol.enum';
import { Roles } from './roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const Auth = (roles: ROL[]) => {
    return applyDecorators(
        Roles(roles),
        UseGuards(AuthGuard, RolesGuard)
    );
};
