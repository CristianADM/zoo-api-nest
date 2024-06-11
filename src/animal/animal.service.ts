import { Injectable } from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { Repository } from 'typeorm';
import { ManejoExcepcionesService } from 'src/common/manejo-excepciones/manejo-excepciones.service';
import { ComentariosService } from 'src/comentarios/comentarios.service';

@Injectable()
export class AnimalService {

  constructor(
    @InjectRepository(Animal)
    private readonly animalRepository: Repository<Animal>,
    private readonly manejoExcepcionesService: ManejoExcepcionesService,
    private readonly comentariosService: ComentariosService
  ) {}

  async create(createAnimalDto: CreateAnimalDto) {
    try {
      const animal = this.animalRepository.create(createAnimalDto);
      return await this.animalRepository.save(animal);
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.animalRepository.find();
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async findOne(id: number) {
    try {
      return await this.animalRepository.findOneBy({
        idAnimal: id
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto) {
    try {
      return await this.animalRepository.update(id, updateAnimalDto)
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    try {
      const comentarios = await this.comentariosService.desactivarComentariosPorIdAnimal(id);
      const animales = await this.animalRepository.update(id, {estadoActivo: false})

      return {animales, comentariosEliminados: comentarios.affected };
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async consultarAnimalPorNombreYEspecie(nombre: string, idEspecie) {
    try {
      return await this.animalRepository.findOneBy({
        nombre,
        estadoActivo: true,
        idEspecie
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async consultarAnimalActivoPorId(idAnimal: number) {
    try {
      return await this.animalRepository.findOneBy({
        idAnimal,
        estadoActivo: true
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async cantidadAnimalesActivosPorIdEspecie(idEspecie: number) {
    try {
      return await this.animalRepository.count({
        where: {
          idEspecie,
          estadoActivo: true
        }
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
  
  async cantidadAnimalesActivosPorIdZona(idZona: number) {
    try {
      return await this.animalRepository.count({
        where: {
          especie: {
            idZona
          },
          estadoActivo: true
        }
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
}
