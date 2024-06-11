import { Comentario } from "src/comentarios/entities/comentario.entity";
import { Especie } from "src/especie/entities/especie.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Animal {

    @PrimaryGeneratedColumn({name: "id_animal"})
    idAnimal: number;
    
    @Column({length: 50, nullable: false})
    nombre: string;

    @ManyToOne(() => Especie, (especie) => especie.animales)
    @JoinColumn({name: "id_especie"})
    especie: Especie;
    
    @Column({name: "id_especie"})
    idEspecie: number;
    
    @OneToMany(() => Comentario, (comentario) => comentario.animal)
    comentarios: Comentario[];

    @Column({name: 'estado_activo', default: true})
    estadoActivo: boolean;

    @CreateDateColumn({name: 'fecha_creacion'})
    fechaCreacion: Date;

    @UpdateDateColumn({name: 'fecha_modificacion'})
    fechaModificacion: Date;
}
