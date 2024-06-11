import { Module, forwardRef } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { ManejoExcepcionesModule } from 'src/common/manejo-excepciones/manejo-excepciones.module';
import { EspecieModule } from 'src/especie/especie.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ComentariosModule } from 'src/comentarios/comentarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Animal]),
    ManejoExcepcionesModule,
    forwardRef(() => EspecieModule),
    UsuarioModule,
    forwardRef(() => ComentariosModule)
  ],
  controllers: [AnimalController],
  providers: [AnimalService],
  exports: [AnimalService]
})
export class AnimalModule {}
