import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EspecieService } from './especie.service';
import { CreateEspecieDto } from './dto/create-especie.dto';
import { UpdateEspecieDto } from './dto/update-especie.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROL } from 'src/common/enums/rol.enum';
import { EspeciePipe } from './pipes/especie.pipe';
import { ZonaPipe } from 'src/zona/pipes/zona.pipe';

@Controller('especie')
export class EspecieController {
  constructor(private readonly especieService: EspecieService) {}

  @Post()
  @Auth([ROL.ADMIN])
  create(@Body(ZonaPipe, EspeciePipe) createEspecieDto: CreateEspecieDto) {
    return this.especieService.create(createEspecieDto);
  }

  @Get()
  @Auth([ROL.ADMIN, ROL.EMPLEADO])
  findAll() {
    return this.especieService.findAll();
  }
  
  @Get("/cantidad-animales-por-especie")
  @Auth([ROL.ADMIN])
  cantidadAnimalesPorEspecie() {
    return this.especieService.cantidadAnimalesActivosPorEspecie();
  }

  @Get(':idEspecie')
  @Auth([ROL.ADMIN, ROL.EMPLEADO])
  findOne(@Param('idEspecie', ParseIntPipe) idEspecie: number) {
    return this.especieService.findOne(idEspecie);
  }

  @Patch(':idEspecie')
  @Auth([ROL.ADMIN])
  update(@Param('idEspecie', ParseIntPipe, EspeciePipe) idEspecie: number, 
    @Body(ZonaPipe, EspeciePipe) updateEspecieDto: UpdateEspecieDto) {
    return this.especieService.update(idEspecie, updateEspecieDto);
  }

  @Delete(':idEspecie')
  @Auth([ROL.ADMIN])
  remove(@Param('idEspecie', ParseIntPipe, EspeciePipe) idEspecie: number) {
    return this.especieService.remove(idEspecie);
  }
}
