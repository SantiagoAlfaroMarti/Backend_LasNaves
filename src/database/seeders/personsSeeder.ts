import bcrypt from 'bcrypt';
import { person } from "../../entities/person/person";
import { AppDataSource } from "../db";

export const personsSeeder = async () => {
    try {
        await AppDataSource.initialize();

        const adminUser = new person();
        adminUser.name = "David";
        adminUser.surnames = "Fernandez";
        adminUser.email = "david@david.com";
        adminUser.password = bcrypt.hashSync("123456789", 10);
        adminUser.startup = "AdminCorp";
        adminUser.dni = "58472847D";
        adminUser.phone = "987654321";
        adminUser.role = "admin";
        await adminUser.save();

        const usersData = [
            { name: "Emma", surnames: "Garcia", email: "emma@emma.com", startup: "TechInnovate", dni: "12345678A", phone: "611222333", role: "user" },
            { name: "Alejandro", surnames: "Ruiz", email: "alejandro@alejandro.com", startup: "DataDrive", dni: "23456789B", phone: "622333444", role: "user" },
            { name: "Sofía", surnames: "Lopez", email: "sofia@sofia.com", startup: "EcoSolutions", dni: "34567890C", phone: "633444555", role: "user" },
            { name: "Pablo", surnames: "Torres", email: "pablo@pablo.com", startup: "HealthTech", dni: "45678901D", phone: "644555666", role: "user" },
            { name: "Lucía", surnames: "Moreno", email: "lucia@lucia.com", startup: "AICorp", dni: "56789012E", phone: "655666777", role: "user" },
            { name: "Daniel", surnames: "Perez", email: "daniel@daniel.com", startup: "CloudSystems", dni: "67890123F", phone: "666777888", role: "user" },
            { name: "Marina", surnames: "Sanz", email: "marina@marina.com", startup: "GreenEnergy", dni: "78901234G", phone: "677888999", role: "user" },
            { name: "Javier", surnames: "Gomez", email: "javier@javier.com", startup: "FinTechSolutions", dni: "89012345H", phone: "688999000", role: "user" },
            { name: "Carmen", surnames: "Navarro", email: "carmen@carmen.com", startup: "EdTechInnovators", dni: "90123456I", phone: "699000111", role: "user" },
            { name: "Miguel", surnames: "Vega", email: "miguel@miguel.com", startup: "RoboticsFuture", dni: "01234567J", phone: "600111222", role: "user" },
            { name: "Laura", surnames: "Fernandez", email: "laura@laura.com", startup: "BioTechLab", dni: "11223344K", phone: "611223344", role: "user" },
            { name: "Carlos", surnames: "Martinez", email: "carlos@carlos.com", startup: "CyberSecurity", dni: "22334455L", phone: "622334455", role: "user" },
            { name: "Ana", surnames: "Rodriguez", email: "ana@ana.com", startup: "VRInnovations", dni: "33445566M", phone: "633445566", role: "user" },
            { name: "Jorge", surnames: "Sanchez", email: "jorge@jorge.com", startup: "SmartCities", dni: "44556677N", phone: "644556677", role: "user" },
            { name: "Isabel", surnames: "Lopez", email: "isabel@isabel.com", startup: "EcoEnergy", dni: "55667788O", phone: "655667788", role: "user" },
            { name: "Alberto", surnames: "Diaz", email: "alberto@alberto.com", startup: "NanoTech", dni: "66778899P", phone: "666778899", role: "user" },
            { name: "Elena", surnames: "Ruiz", email: "elena@elena.com", startup: "AILearning", dni: "77889900Q", phone: "677889900", role: "user" },
            { name: "Raul", surnames: "Hernandez", email: "raul@raul.com", startup: "BlockchainSolutions", dni: "88990011R", phone: "688990011", role: "user" },
            { name: "Cristina", surnames: "Alvarez", email: "cristina@cristina.com", startup: "QuantumComputing", dni: "99001122S", phone: "699001122", role: "user" },
            { name: "Fernando", surnames: "Jimenez", email: "fernando@fernando.com", startup: "SpaceTech", dni: "00112233T", phone: "600112233", role: "user" },
            { name: "Marta", surnames: "Romero", email: "marta@marta.com", startup: "BionicTech", dni: "11223344U", phone: "611223355", role: "user" },
            { name: "Hugo", surnames: "Torres", email: "hugo@hugo.com", startup: "DroneInnovations", dni: "22334455V", phone: "622334466", role: "user" },
            { name: "Nuria", surnames: "Castillo", email: "nuria@nuria.com", startup: "MedTechSolutions", dni: "33445566W", phone: "633445577", role: "user" },
            { name: "Oscar", surnames: "Vargas", email: "oscar@oscar.com", startup: "CleanEnergyTech", dni: "44556677X", phone: "644556688", role: "user" },
            { name: "Gabriel", surnames: "Blanco", email: "gabriel@gabriel.com", startup: "AgriTech", dni: "55667788Y", phone: "655667799", role: "user" },
            { name: "Rosa", surnames: "Silva", email: "rosa@rosa.com", startup: "BioPharma", dni: "66778899Z", phone: "666778800", role: "user" },
            { name: "Antonio", surnames: "Ramos", email: "antonio@antonio.com", startup: "GeneticsLab", dni: "77889900AA", phone: "677889911", role: "user" },
            { name: "Gloria", surnames: "Luna", email: "gloria@gloria.com", startup: "DeepTech", dni: "88990011BB", phone: "688990022", role: "user" },
            { name: "Ivan", surnames: "Cabrera", email: "ivan@ivan.com", startup: "BioMaterials", dni: "99001122CC", phone: "699001133", role: "user" },
            { name: "Patricia", surnames: "Gomez", email: "patricia@patricia.com", startup: "SmartAgriculture", dni: "00112233DD", phone: "600112344", role: "user" },
            { name: "Eduardo", surnames: "Mendez", email: "eduardo@eduardo.com", startup: "AutonomousTech", dni: "11223344EE", phone: "611223466", role: "user" },
            { name: "Clara", surnames: "Gil", email: "clara@clara.com", startup: "NanoMaterials", dni: "22334455FF", phone: "622334477", role: "user" },
            { name: "Luis", surnames: "Herrera", email: "luis@luis.com", startup: "AIOptimization", dni: "33445566GG", phone: "633445588", role: "user" },
            { name: "Monica", surnames: "Cortes", email: "monica@monica.com", startup: "SpaceMining", dni: "44556677HH", phone: "644556799", role: "user" },
            { name: "Ricardo", surnames: "Molina", email: "ricardo@ricardo.com", startup: "QuantumEnergy", dni: "55667788II", phone: "655667800", role: "user" },
            { name: "Beatriz", surnames: "Castro", email: "beatriz@beatriz.com", startup: "BioEnergy", dni: "66778899JJ", phone: "666778911", role: "user" }
        ];

        for (const userData of usersData) {
            const user = new person();
            user.name = userData.name;
            user.surnames = userData.surnames;
            user.email = userData.email;
            user.password = bcrypt.hashSync("123456789", 10);
            user.startup = userData.startup;
            user.dni = userData.dni;
            user.phone = userData.phone;
            user.role = "user";
            await user.save();
        }

        console.log("==========================");
        console.log("Persons seeder completed successfully");
        console.log("==========================");

    } catch (error: any) {
        console.error("==========================");
        console.error('ERROR PERSON SEEDER', error.message);
        console.error("==========================");

    } finally {
        await AppDataSource.destroy();
    }
}