import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity('contactos')
export class Contacto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    apellidos: string;

    @Column()
    telefono: string;

    @Column()
    email: string;
}