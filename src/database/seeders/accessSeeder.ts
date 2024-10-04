import { access } from "../../entities/access/access";
import { accessHistory } from "../../entities/accessHistory/accessHistory";
import { AppDataSource } from "../db";

function getRandomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

type AccessState = "active" | "inactive" | "cancelled";

export const accessSeeder = async () => {
    try {
        await AppDataSource.initialize();

        const accessStates: AccessState[] = ["active", "inactive", "cancelled"];

        for (let i = 1; i <= 37; i++) { 
            if (Math.random() < 0.2) {
                continue; 
            }

            const numberOfAccesses = Math.floor(Math.random() * 3) + 1; 

            for (let j = 0; j < numberOfAccesses; j++) {
                const accessInstance = new access();
                accessInstance.person_id = i;
                accessInstance.room_id = Math.floor(Math.random() * 6) + 1; 
                accessInstance.state = accessStates[Math.floor(Math.random() * accessStates.length)]; 

                if (accessInstance.state === "inactive") {
                    accessInstance.entry_datetime = new Date(Date.now() - 60 * 60 * 1000);
                    accessInstance.exit_datetime = new Date();
                } else if (accessInstance.state === "active") {
                    const isCurrentlyInside = Math.random() < 0.5; 
                    if (isCurrentlyInside) {
                        accessInstance.entry_datetime = new Date(); 
                    } else {
                        accessInstance.entry_datetime = getRandomDate(new Date("2024-09-01T08:00:00"), new Date("2024-12-31T18:00:00"));
                    }
                    accessInstance.exit_datetime = null; 
                } else if (accessInstance.state === "cancelled") {
                    accessInstance.entry_datetime = getRandomDate(new Date("2024-09-01T08:00:00"), new Date("2024-10-31T18:00:00"));
                    accessInstance.exit_datetime = null; 
                }

                await accessInstance.save();

                if (accessInstance.state === "inactive") {
                    const historyInstance = new accessHistory();
                    historyInstance.person_id = accessInstance.person_id;
                    historyInstance.room_id = accessInstance.room_id;
                    historyInstance.entry_datetime = accessInstance.entry_datetime;

                    if (accessInstance.exit_datetime !== null) {
                        historyInstance.exit_datetime = accessInstance.exit_datetime as Date;
                    }

                    await historyInstance.save();
                }
            }
        }

        console.log("===========================");
        console.log("Access and AccessHistory seeder executed successfully");
        console.log("===========================");

    } catch (error: any) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("==========================");
        console.error('ERROR ACCESS SEEDER', message);
        console.error("==========================");
    } finally {
        await AppDataSource.destroy();
    }
}