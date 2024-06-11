import { Module } from '@nestjs/common';
import { ManejoExcepcionesService } from './manejo-excepciones.service';

@Module({
  providers: [ManejoExcepcionesService],
  exports: [ManejoExcepcionesService]
})
export class ManejoExcepcionesModule {}
