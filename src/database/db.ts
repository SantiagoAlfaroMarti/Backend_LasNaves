import "reflect-metadata";
import 'dotenv/config';
import { DataSource } from "typeorm";
import { Person1726560167856 } from "./migrations/1726560167856-person";
import { Room1726560205798 } from "./migrations/1726560205798-room";
import { Access1726560218248 } from "./migrations/1726560218248-access";
import { AccessHistory1726563877728 } from "./migrations/1726563877728-accessHistory";
import { Administration1726564013782 } from "./migrations/1726564013782-administration";
import { person } from "../entities/person/person";
import { room } from "../entities/room/room";
import { access } from "../entities/access/access";
import { accessHistory } from "../entities/accessHistory/accessHistory";
import { administration } from "../entities/administration/administration";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [person, room, access, accessHistory, administration],
    migrations: [Person1726560167856, Room1726560205798, Access1726560218248, AccessHistory1726563877728, Administration1726564013782],
    synchronize: false,
    logging: false,
})