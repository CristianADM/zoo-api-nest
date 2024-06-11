import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonaModule } from './zona/zona.module';
import { ManejoExcepcionesModule } from './common/manejo-excepciones/manejo-excepciones.module';
import { EspecieModule } from './especie/especie.module';
import { AnimalModule } from './animal/animal.module';
import { ComentariosModule } from './comentarios/comentarios.module';

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
    AuthModule,
    ZonaModule,
    ManejoExcepcionesModule,
    EspecieModule,
    AnimalModule,
    ComentariosModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
