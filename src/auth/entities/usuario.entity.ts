import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  nombre: string;

  @Column()
  password: string;
}
