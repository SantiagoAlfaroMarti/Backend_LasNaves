import { room } from '../../entities/room/room';
import { AppDataSource } from "../db";

export const roomsSeeder = async () => {
    try {
        await AppDataSource.initialize();

        const room1 = new room();
        room1.room_name = "Sala de Conferencias";
        room1.capacity = 50;
        room1.room_type = "conferencia";
        await room1.save();

        const room2 = new room();
        room2.room_name = "Oficina Abierta";
        room2.capacity = 20;
        room2.room_type = "oficina";
        await room2.save();

        const room3 = new room();
        room3.room_name = "Sala de Reuniones";
        room3.capacity = 10;
        room3.room_type = "reunion";
        await room3.save();

        const room4 = new room();
        room4.room_name = "Laboratorio";
        room4.capacity = 15;
        room4.room_type = "laboratorio";
        await room4.save();

        const room5 = new room();
        room5.room_name = "Auditorio";
        room5.capacity = 100;
        room5.room_type = "auditorio";
        await room5.save();

        const room6 = new room();
        room6.room_name = "Sala de Proyectos";
        room6.capacity = 12;
        room6.room_type = "proyecto";
        await room6.save();

        console.log("==========================");
        console.log("Rooms seeder completed successfully");
        console.log("==========================");

    } catch (error: any) {
        console.error("==========================");
        console.error('ERROR ROOM SEEDER', error.message);
        console.error("==========================");

    } finally {
        await AppDataSource.destroy();
    }
}