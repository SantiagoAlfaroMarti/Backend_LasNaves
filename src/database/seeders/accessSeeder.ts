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
        let accessCount = 0;
        const activeUsers = new Set<number>();
        const todayInactiveUsers = new Set<number>();
        const currentDate = new Date();
        const pastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

        const recentActiveCount = Math.floor(Math.random() * 7) + 5; 
        for (let i = 0; i < recentActiveCount; i++) {
            const userId = Math.floor(Math.random() * 37) + 1;
            if (!activeUsers.has(userId)) {
                const accessInstance = new access();
                accessInstance.person_id = userId;
                accessInstance.room_id = Math.floor(Math.random() * 6) + 1;
                accessInstance.state = "active";
                accessInstance.entry_datetime = new Date(currentDate.getTime() - Math.random() * 3600000); 
                accessInstance.exit_datetime = null;
                await accessInstance.save();
                activeUsers.add(userId);
                accessCount++;
            }
        }

        const todayInactiveCount = Math.floor(Math.random() * 15) + 10; 
        for (let i = 0; i < todayInactiveCount; i++) {
            const userId = Math.floor(Math.random() * 37) + 1;
            if (!activeUsers.has(userId) && !todayInactiveUsers.has(userId)) {
                const accessInstance = new access();
                accessInstance.person_id = userId;
                accessInstance.room_id = Math.floor(Math.random() * 6) + 1;
                accessInstance.state = "inactive";
                const entryTime = new Date(currentDate.getTime() - Math.random() * 7200000);
                accessInstance.entry_datetime = entryTime;
                accessInstance.exit_datetime = new Date(entryTime.getTime() + 3600000 + Math.random() * 3600000); 
                await accessInstance.save();
                todayInactiveUsers.add(userId);
                accessCount++;

                const historyInstance = new accessHistory();
                historyInstance.person_id = accessInstance.person_id;
                historyInstance.room_id = accessInstance.room_id;
                historyInstance.entry_datetime = accessInstance.entry_datetime;
                historyInstance.exit_datetime = accessInstance.exit_datetime;
                await historyInstance.save();
            }
        }

        while (accessCount < 160) {
            const i = Math.floor(Math.random() * 37) + 1; 

            if (Math.random() < 0.2) {
                continue; 
            }

            const accessInstance = new access();
            accessInstance.person_id = i;
            accessInstance.room_id = Math.floor(Math.random() * 6) + 1; 

            if (activeUsers.has(i) || todayInactiveUsers.has(i)) {
                accessInstance.state = Math.random() < 0.7 ? "inactive" : "cancelled";
            } else {
                const randomState = Math.random();
                if (randomState < 0.2) {
                    accessInstance.state = "active";
                    accessInstance.entry_datetime = new Date(currentDate.getTime() - Math.random() * 3600000);
                    accessInstance.exit_datetime = null;
                    activeUsers.add(i);
                } else if (randomState < 0.6) {
                    accessInstance.state = "inactive";
                } else if (randomState < 0.8) {
                    accessInstance.state = "active"; 
                } else {
                    accessInstance.state = "cancelled";
                }
            }

            if (accessInstance.state === "inactive" && !todayInactiveUsers.has(i)) {
                const entryDate = getRandomDate(pastDate, new Date(currentDate.getTime() - 86400000));
                accessInstance.entry_datetime = entryDate;
                accessInstance.exit_datetime = new Date(entryDate.getTime() + 60 * 60 * 1000); 
            } else if (accessInstance.state === "active" && !accessInstance.entry_datetime) {
                const futureDate = getRandomDate(currentDate, new Date("2024-12-31T18:00:00"));
                accessInstance.entry_datetime = futureDate;
                accessInstance.exit_datetime = null; 
                activeUsers.add(i);
            } else if (accessInstance.state === "cancelled") {
                accessInstance.entry_datetime = getRandomDate(new Date("2024-09-01T08:00:00"), new Date("2024-10-31T18:00:00"));
                accessInstance.exit_datetime = null; 
            }

            await accessInstance.save();

            if (accessInstance.state === "inactive" && accessInstance.exit_datetime !== null) {
                const historyInstance = new accessHistory();
                historyInstance.person_id = accessInstance.person_id;
                historyInstance.room_id = accessInstance.room_id;
                historyInstance.entry_datetime = accessInstance.entry_datetime;
                historyInstance.exit_datetime = accessInstance.exit_datetime;
                await historyInstance.save();
            }

            accessCount++;
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