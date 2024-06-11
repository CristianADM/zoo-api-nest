import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEspecieDto } from './dto/create-especie.dto';
import { UpdateEspecieDto } from './dto/update-especie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especie } from './entities/especie.entity';
import { ManejoExcepcionesService } from 'src/common/manejo-excepciones/manejo-excepciones.service';
import { AnimalService } from 'src/animal/animal.service';
import { ESTADOS } from 'src/common/constantes/constantes';

@Injectable()
export class EspecieService {

  constructor(
    @InjectRepository(Especie)
    private readonly especieRepository: Repository<Especie>,
    private readonly manejoExcepcionesService: ManejoExcepcionesService,
    private readonly animalService: AnimalService
  ) {}

  async create(createEspecieDto: CreateEspecieDto) {
    try {
      const especie = this.especieRepository.create(createEspecieDto);
      return await this.especieRepository.save(especie);
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.especieRepository.find();
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async findOne(id: number) {
    try {
      const especie = await this.especieRepository.findOneBy({
        idEspecie: id
      });

      return especie;
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async update(id: number, updateEspecieDto: UpdateEspecieDto) {
    try {
      return await this.especieRepository.update(id, updateEspecieDto)
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    try {
      const cantidadAnimales = await this.animalService.cantidadAnimalesActivosPorIdEspecie(id);
      if(cantidadAnimales != 0) {
        throw new BadRequestException("No se puede eliminar la especie porque tiene animales asociados");
      }
      return await this.especieRepository.update(id, {estadoActivo: ESTADOS.inactivo.boolean});
    } catch (error) {
      if(error instanceof BadRequestException) {
        throw error;
      }
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
  
  async eliminarEspeciesPorIdZona(idZona: number) {
    try {
      return await this.especieRepository.update({idZona}, {estadoActivo: ESTADOS.inactivo.boolean});
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async consultarEspeciePorNombre(nombre: string) {
    try {
      return await this.especieRepository.findOneBy({
        nombre: nombre
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async consultarEspeciesActivasPorId(idEspecie: number) {
    try {
      return await this.especieRepository.findOneBy({
        idEspecie,
        estadoActivo: ESTADOS.activo.boolean
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
  
  async cantidadEspeciesActivasPorIdZona(idZona: number) {
    try {
      return await this.especieRepository.countBy({
        idZona,
        estadoActivo: ESTADOS.activo.boolean
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
  
  async cantidadAnimalesActivosPorEspecie() {
    try {
      const especies = await this.especieRepository.find({
        select: ['idEspecie', 'nombre'],
        where: {
          estadoActivo: ESTADOS.activo.boolean
        }
      });

      const cantidadAnimales = especies.map(async (especie: any) => {
        const cantidad = await this.animalService.cantidadAnimalesActivosPorIdEspecie(especie.idEspecie);
        especie.cantidadAnimales = cantidad;
        return especie;
      });

      const especiesConCantidadAnimales = await Promise.all(cantidadAnimales);

      return especiesConCantidadAnimales;
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
}
