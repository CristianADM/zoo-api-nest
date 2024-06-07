import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioModule } from 'src/usuario/usuario.module';

import 'dotenv/config';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRETKEY,
      signOptions: { expiresIn: process.env.DURACIONTOKEN },
    }),
    UsuarioModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
