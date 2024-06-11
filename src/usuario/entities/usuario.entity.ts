import { ROL } from "src/common/enums/rol.enum";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Usuario {

    @PrimaryGeneratedColumn({name: "id_usuario"})
    idUsuario: number;

    @Column({unique: true, nullable: false, length: 50})
    correo: string;

    @Column({length: 50})
    nombre: string;

    @Column({select: false, nullable: false, length: 200})
    contrasenna: string;

    @Column({type: 'enum', default: ROL.EMPLEADO, enum: ROL})
    rol: string;
    
    @Column({nullable: true, length: 255})
    token: string;

    @Column({name: 'estado_activo', default: true})
    estadoActivo: boolean;

    @CreateDateColumn({name: 'fecha_creacion'})
    fechaCreacion: Date;

    @UpdateDateColumn({name: 'fecha_modificacion'})
    fechaModificacion: Date;
}
