import "reflect-metadata";
import 'dotenv/config';
import { DataSource } from "typeorm";
import { Person1727951723364 } from "./migrations/1727951723364-person";
import { Room1727951957088 } from "./migrations/1727951957088-room";
import { Access1727951979728 } from "./migrations/1727951979728-access";
import { AccessHistory1727952058033 } from "./migrations/1727952058033-accessHistory";
import { Administration1727952131614 } from "./migrations/1727952131614-administration";
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
    migrations: [Person1727951723364, Room1727951957088, Access1727951979728, AccessHistory1727952058033, Administration1727952131614],
    synchronize: false,
    logging: false,
})