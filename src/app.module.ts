import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_BD,
      port: +process.env.PUERTO_BD,
      username: process.env.USUARIO_BD,
      password: process.env.CONT_BD,
      database: process.env.NOMBRE_BD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuarioModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
