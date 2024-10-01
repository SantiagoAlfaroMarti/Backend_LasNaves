import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  ID_Persona: number = 0;

  @Column()
  Nombre: string = '';

  @Column()
  Apellidos: string = '';

  @Column()
  StartUp: string = '';

  @Column()
  CorreoElectronico: string = '';

  @Column()
  DNI: string = '';

  @Column()
  Telefono: string = '';
}
