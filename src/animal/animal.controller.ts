import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ROL } from 'src/common/enums/rol.enum';
import { AnimalPipe } from './pipes/animal.pipe';
import { EspeciePipe } from 'src/especie/pipes/especie.pipe';

@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post()
  @Auth([ROL.ADMIN])
  create(@Body(EspeciePipe, AnimalPipe) createAnimalDto: CreateAnimalDto) {
    return this.animalService.create(createAnimalDto);
  }

  @Get()
  @Auth([ROL.ADMIN, ROL.EMPLEADO])
  findAll() {
    return this.animalService.findAll();
  }

  @Get(':idAnimal')
  @Auth([ROL.ADMIN, ROL.EMPLEADO])
  findOne(@Param('idAnimal') idAnimal: number) {
    return this.animalService.findOne(idAnimal);
  }

  @Patch(':idAnimal')
  @Auth([ROL.ADMIN])
  update(@Param('idAnimal', ParseIntPipe, AnimalPipe) idAnimal: number, @Body(EspeciePipe, AnimalPipe) updateAnimalDto: UpdateAnimalDto) {
    return this.animalService.update(idAnimal, updateAnimalDto);
  }

  @Delete(':idAnimal')
  @Auth([ROL.ADMIN])
  remove(@Param('idAnimal', ParseIntPipe, AnimalPipe) idAnimal: number) {
    return this.animalService.remove(idAnimal);
  }
}
