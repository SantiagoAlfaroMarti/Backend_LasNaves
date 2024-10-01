import { DataSource } from 'typeorm';
import { Person } from '../modules/person/person.entity';
import { Room } from '../modules/room/room.entity';
import { Access } from '../modules/access/access.entity';
import 'reflect-metadata';

// Importa las demás entidades que necesites

export const AppDataSource = new DataSource({
  type: 'mysql', // Cambia a 'mysql'
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306, // Cambia a 3306 si usas MySQL por defecto
  username: process.env.DB_USERNAME || 'root', // Asegúrate de que esto sea correcto
  password: process.env.DB_PASSWORD || '123456789', // Asegúrate de que esto sea correcto
  database: process.env.DB_DATABASE || 'LasNavesCoworking',
  synchronize: false, // En producción, usa migraciones en lugar de synchronize.
  logging: false,
  entities: [Person, Room, Access], // Asegúrate de que están todas tus entidades
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});


