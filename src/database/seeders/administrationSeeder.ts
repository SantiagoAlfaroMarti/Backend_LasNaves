import { administration } from "../../entities/administration/administration";
import { AppDataSource } from "../db";

export const administrationSeeder = async () => {
    try {
        await AppDataSource.initialize();

        const admin1 = new administration();
        admin1.report_date = new Date("2023-09-01");
        admin1.total_accesses = 150;
        admin1.total_absences = 10;
        admin1.frequent_users = "Valeria Serrano, Roberto Ferrer, Natalia Martín";
        admin1.infrequent_users = "Diego Mendez, Paula Ortiz";
        await admin1.save();
        
        const admin2 = new administration();
        admin2.report_date = new Date("2023-09-15");
        admin2.total_accesses = 180;
        admin2.total_absences = 8;
        admin2.frequent_users = "Sergio Cruz, Lorena Vega, Victor Nuñez";
        admin2.infrequent_users = "Patricia Suarez, Francisco Iglesias";
        await admin2.save();
        
        const admin3 = new administration();
        admin3.report_date = new Date("2023-10-01");
        admin3.total_accesses = 200;
        admin3.total_absences = 5;
        admin3.frequent_users = "Elisa Campos, Mario Garzon, Isabel Aguilar";
        admin3.infrequent_users = "Felipe Carrillo, Lucia Castro";
        await admin3.save();
        
        const admin4 = new administration();
        admin4.report_date = new Date("2023-10-15");
        admin4.total_accesses = 220;
        admin4.total_absences = 7;
        admin4.frequent_users = "Andrés Lara, Elena Gimenez, Julian Fuentes";
        admin4.infrequent_users = "Andrea Soto, Emilio Bustos";
        await admin4.save();
        
        const admin5 = new administration();
        admin5.report_date = new Date("2023-11-01");
        admin5.total_accesses = 190;
        admin5.total_absences = 12;
        admin5.frequent_users = "Raquel Bravo, David Soria, Eva Rey";
        admin5.infrequent_users = "Ignacio Santos, Valeria Serrano";
        await admin5.save();

        console.log("===========================");
        console.log("Administration seeder executed successfully");
        console.log("===========================");
        
    } catch (error: any) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("==========================");
        console.error('ERROR ADMINISTRATION SEEDER', error.message);
        console.error("==========================");

    } finally {
        await AppDataSource.destroy();
    }
}