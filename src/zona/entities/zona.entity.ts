import { Especie } from "src/especie/entities/especie.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Zona {

    @PrimaryGeneratedColumn({name: "id_zona"})
    idZona: number;
    
    @Column({length: 50, nullable: false, unique: true})
    nombre: string;

    @OneToMany(() => Especie, (especie) => especie.zona)
    especies: Especie[]

    @Column({name: 'estado_activo', default: true})
    estadoActivo: boolean;

    @CreateDateColumn({name: 'fecha_creacion'})
    fechaCreacion: Date;

    @UpdateDateColumn({name: 'fecha_modificacion'})
    fechaModificacion: Date;
}
