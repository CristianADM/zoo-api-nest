import { Module, forwardRef } from '@nestjs/common';
import { ZonaService } from './zona.service';
import { ZonaController } from './zona.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zona } from './entities/zona.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ManejoExcepcionesModule } from 'src/common/manejo-excepciones/manejo-excepciones.module';
import { EspecieModule } from 'src/especie/especie.module';
import { AnimalModule } from 'src/animal/animal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Zona]),
    UsuarioModule,
    ManejoExcepcionesModule,
    AnimalModule,
    forwardRef(() => EspecieModule)
  ],
  controllers: [ZonaController],
  providers: [ZonaService],
  exports: [ZonaService]
})
export class ZonaModule {}
