import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Zona } from './entities/zona.entity';
import { Between, Like, Repository } from 'typeorm';
import { ManejoExcepcionesService } from 'src/common/manejo-excepciones/manejo-excepciones.service';
import { EspecieService } from 'src/especie/especie.service';
import { ESTADOS } from 'src/common/constantes/constantes';
import { AnimalService } from 'src/animal/animal.service';

@Injectable()
export class ZonaService {

  constructor(
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
    private readonly manejoExcepcionesService: ManejoExcepcionesService,
    private readonly animalService: AnimalService,
    private readonly especieService: EspecieService
  ) {}

  async create(createZonaDto: CreateZonaDto) {
    try {
      const zona = this.zonaRepository.create(createZonaDto);
      return await this.zonaRepository.save(zona);
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return await this.zonaRepository.find();
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async findOne(idZona: number) {
    try {
      let zona ={};
      zona = await this.zonaRepository.findOneBy({
        idZona
      });

      return zona;
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
  async consultarZonasActivas(idZona: number) {
    try {
      return await this.zonaRepository.findOneBy({
        idZona,
        estadoActivo: true
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async update(id: number, updateZonaDto: UpdateZonaDto) {
    try {
      return await this.zonaRepository.update(id, updateZonaDto)
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async remove(idZona: number) {
    try {
      const cantidad = await this.animalService.cantidadAnimalesActivosPorIdZona(idZona);
      if(cantidad != 0){
        throw new BadRequestException("No se puede eliminar la zona porque las especies tienen animales asociados");
      }
      await this.especieService.eliminarEspeciesPorIdZona(idZona);
      return await this.zonaRepository.update(idZona, {estadoActivo: ESTADOS.inactivo.boolean});
    } catch (error) {
      if(error instanceof BadRequestException) {
        throw error;
      }
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async consultarZonaPorNombre(nombre: string, estado: boolean) {
    try {
      return await this.zonaRepository.findOneBy({
        nombre
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
  
  async consultarCantidadAnimalesPorZona() {
    try {
      const idZonas = await this.zonaRepository.find({
        select: ['idZona', 'nombre'],
        where: {
          estadoActivo: ESTADOS.activo.boolean
        }
      });

      const cantidadAnimales = idZonas.map(async (zona: any) => {
        const cantidad = await this.animalService.cantidadAnimalesActivosPorIdZona(zona.idZona);
        zona.cantidadAnimales = cantidad;
        return zona;
      });

      const zonasConCantidadAnimales = await Promise.all(cantidadAnimales);

      return zonasConCantidadAnimales;
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }

  async consultarAnimalesRegistradosPorDia(fechaRegistro: Date) {

    const fechaInicio = new Date(fechaRegistro);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 1);

    try {
      const zonas = await this.zonaRepository.find({
        select: {
          especies: {
            idEspecie: true,
            nombre: true,
            animales: true
          }
        },
        where: {
          estadoActivo: ESTADOS.activo.boolean,
          especies: {
            estadoActivo: ESTADOS.activo.boolean,
            animales: {
              estadoActivo: ESTADOS.activo.boolean,
              fechaCreacion: Between(fechaInicio, fechaFin)
            }
          }
        },
        relations: {
          especies: {
            animales: true
          }
        }
      });
      
      return zonas;
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
  
  async busquedaGeneral(palabra: string) {

    try {
      return await this.zonaRepository.find({
        relations: {
          especies: {
            animales: {
              comentarios: {
                comentariosHijos: true
              }
            }
          }
        },

        where: [
          {nombre: Like(`%${palabra}%`), estadoActivo: ESTADOS.activo.boolean, especies: {estadoActivo: ESTADOS.activo.boolean}},
          {especies: [
            {nombre: Like(`%${palabra}%`), estadoActivo: ESTADOS.activo.boolean, animales: {estadoActivo: ESTADOS.activo.boolean}},
            {animales: [
              {nombre: Like(`%${palabra}%`), estadoActivo: ESTADOS.activo.boolean, comentarios: {estadoActivo: ESTADOS.activo.boolean}},
              {comentarios: [
                {cuerpo: Like(`%${palabra}%`), estadoActivo: ESTADOS.activo.boolean, comentariosHijos: {estadoActivo: ESTADOS.activo.boolean}},
                {comentariosHijos: {
                  cuerpo: Like(`%${palabra}%`), estadoActivo: ESTADOS.activo.boolean
                }}
              ]}
            ]}
          ]}
        ]
      });
    } catch (error) {
      this.manejoExcepcionesService.handleDBExceptions(error);
    }
  }
}
