import { Module, forwardRef } from '@nestjs/common';
import { EspecieService } from './especie.service';
import { EspecieController } from './especie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especie } from './entities/especie.entity';
import { ManejoExcepcionesModule } from 'src/common/manejo-excepciones/manejo-excepciones.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ZonaModule } from 'src/zona/zona.module';
import { AnimalModule } from 'src/animal/animal.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Especie]),
    ManejoExcepcionesModule,
    UsuarioModule,
    forwardRef(() => ZonaModule),
    forwardRef(() => AnimalModule) 
  ],
  controllers: [EspecieController],
  providers: [EspecieService],
  exports: [EspecieService],
})
export class EspecieModule {}
