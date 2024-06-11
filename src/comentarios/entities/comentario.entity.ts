import { Animal } from "src/animal/entities/animal.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comentario {
    @PrimaryGeneratedColumn({name: "id_comentario"})
    idComentario: number;
    
    @Column({length: 500, nullable: false})
    cuerpo: string;

    @ManyToOne(() => Animal, (animal) => animal.comentarios)
    @JoinColumn({name: "id_animal"})
    animal: Animal;
    
    @Column({name: "id_animal", nullable: true})
    idAnimal: number;
    
    @ManyToOne(() => Usuario)
    @JoinColumn({name: "id_usuario"})
    usuario: Usuario;
    
    @Column({name: "id_usuario", nullable: false})
    idUsuario: number;
    
    @ManyToOne(() => Comentario, (comentario) => comentario.comentariosHijos, {nullable: true})
    @JoinColumn({name: "id_comentario_padre"})
    comentarioPadre: Comentario;
    
    @Column({name: "id_comentario_padre", nullable: true})
    idComentarioPadre: number;

    @OneToMany(() => Comentario, (comentario) => comentario.comentarioPadre)
    comentariosHijos: Comentario[];

    @Column({name: 'estado_activo', default: true})
    estadoActivo: boolean;

    @CreateDateColumn({name: 'fecha_creacion'})
    fechaCreacion: Date;

    @UpdateDateColumn({name: 'fecha_modificacion'})
    fechaModificacion: Date;
}
