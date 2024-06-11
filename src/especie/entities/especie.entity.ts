import { Animal } from "src/animal/entities/animal.entity";
import { Zona } from "src/zona/entities/zona.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Especie {

    @PrimaryGeneratedColumn({name: "id_especie"})
    idEspecie: number;
    
    @Column({length: 50, nullable: false, unique: true})
    nombre: string;

    @ManyToOne(() => Zona, (zona) => zona.especies)
    @JoinColumn({name: "id_zona"})
    zona: Zona;
    
    @Column({name: "id_zona"})
    idZona: number;

    @OneToMany(() => Animal, (animal) => animal.especie)
    animales: Animal[]

    @Column({name: 'estado_activo', default: true})
    estadoActivo: boolean;

    @CreateDateColumn({name: 'fecha_creacion'})
    fechaCreacion: Date;

    @UpdateDateColumn({name: 'fecha_modificacion'})
    fechaModificacion: Date;
}
