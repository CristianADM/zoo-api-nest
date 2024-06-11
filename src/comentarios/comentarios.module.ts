import { Module, forwardRef } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from './entities/comentario.entity';
import { AnimalModule } from 'src/animal/animal.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ManejoExcepcionesModule } from 'src/common/manejo-excepciones/manejo-excepciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comentario]),
    UsuarioModule,
    forwardRef(() => AnimalModule),
    ManejoExcepcionesModule
  ],
  controllers: [ComentariosController],
  providers: [ComentariosService],
  exports: [ComentariosService]
})
export class ComentariosModule {}
