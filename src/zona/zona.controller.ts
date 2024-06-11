import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ZonaService } from './zona.service';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROL } from 'src/common/enums/rol.enum';
import { ZonaPipe } from './pipes/zona.pipe';

@Controller('zona')
export class ZonaController {
  constructor(private readonly zonaService: ZonaService) {}

  @Post()
  @Auth([ROL.ADMIN])
  create(@Body(ZonaPipe) createZonaDto: CreateZonaDto) {
    return this.zonaService.create(createZonaDto);
  }

  @Get()
  @Auth([ROL.ADMIN, ROL.EMPLEADO])
  findAll() {
    return this.zonaService.findAll();
  }

  @Get("/cantidad-animales-por-zona")
  @Auth([ROL.ADMIN])
  consultarCantiddadAnimalesPorZona() {
    return this.zonaService.consultarCantidadAnimalesPorZona();
  }

  @Get("/animales-registrados-por-dia")
  @Auth([ROL.ADMIN])
  consultarAnimalesRegistradosPorDia(
    @Query("fecha-registro") fechaRegistro: Date) {
    return this.zonaService.consultarAnimalesRegistradosPorDia(fechaRegistro);
  }
  
  @Get("/busqueda-general")
  @Auth([ROL.ADMIN])
  busquedaGeneral(
    @Query("palabra") palabra: string) {
    return this.zonaService.busquedaGeneral(palabra);
  }

  @Get(':idZona')
  @Auth([ROL.ADMIN])
  findOne(@Param('idZona', ParseIntPipe) idZona: number) {
    return this.zonaService.findOne(idZona);
  }

  @Patch(':idZona')
  @Auth([ROL.ADMIN])
  update(@Param('idZona', ParseIntPipe, ZonaPipe) idZona: number, @Body(ZonaPipe) updateZonaDto: UpdateZonaDto) {
    return this.zonaService.update(idZona, updateZonaDto);
  }

  @Delete(':idZona')
  @Auth([ROL.ADMIN])
  remove(@Param('idZona', ParseIntPipe, ZonaPipe) idZona: number) {
    return this.zonaService.remove(idZona);
  }
}
