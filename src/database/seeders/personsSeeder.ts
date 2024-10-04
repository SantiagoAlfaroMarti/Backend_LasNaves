import bcrypt from 'bcrypt';
import { person } from "../../entities/person/person";
import { AppDataSource } from "../db";

export const personsSeeder = async () => {
    try {
        await AppDataSource.initialize();

        const adminUser = new person();
        adminUser.name = "Santi";
        adminUser.surnames = "Alfaro";
        adminUser.email = "santi@santi.com";
        adminUser.password = bcrypt.hashSync("123456789", 10);
        adminUser.startup = "AdminCorp";
        adminUser.dni = "47082901S";
        adminUser.phone = "967221430";
        adminUser.role = "admin";
        await adminUser.save();

        const usersData = [
            { "name": "Valeria", "surnames": "Serrano", "email": "valeria@valeria.com", "startup": "TechRevolution", "dni": "98765432A", "phone": "610223344", "role": "user" },
            { "name": "Roberto", "surnames": "Ferrer", "email": "roberto@roberto.com", "startup": "BigDataCorp", "dni": "87654321B", "phone": "620334455", "role": "user" },
            { "name": "Natalia", "surnames": "Martín", "email": "natalia@natalia.com", "startup": "SustainabilityHub", "dni": "76543210C", "phone": "630445566", "role": "user" },
            { "name": "Diego", "surnames": "Mendez", "email": "diego@diego.com", "startup": "HealthSolutions", "dni": "65432109D", "phone": "640556677", "role": "user" },
            { "name": "Paula", "surnames": "Ortiz", "email": "paula@paula.com", "startup": "AIInnovators", "dni": "54321098E", "phone": "650667788", "role": "user" },
            { "name": "Sergio", "surnames": "Cruz", "email": "sergio@sergio.com", "startup": "CloudTech", "dni": "43210987F", "phone": "660778899", "role": "user" },
            { "name": "Lorena", "surnames": "Vega", "email": "lorena@lorena.com", "startup": "GreenEnergySystems", "dni": "32109876G", "phone": "670889900", "role": "user" },
            { "name": "Victor", "surnames": "Nuñez", "email": "victor@victor.com", "startup": "FinTechGlobal", "dni": "21098765H", "phone": "680990011", "role": "user" },
            { "name": "Patricia", "surnames": "Suarez", "email": "patricia@patricia.com", "startup": "EdTechRevolution", "dni": "10987654I", "phone": "690001122", "role": "user" },
            { "name": "Francisco", "surnames": "Iglesias", "email": "francisco@francisco.com", "startup": "RoboTechLabs", "dni": "09876543J", "phone": "600112233", "role": "user" },
            { "name": "Elisa", "surnames": "Campos", "email": "elisa@elisa.com", "startup": "BioEngineering", "dni": "12344321K", "phone": "611224466", "role": "user" },
            { "name": "Mario", "surnames": "Garzon", "email": "mario@mario.com", "startup": "SecurityLabs", "dni": "23455432L", "phone": "622335577", "role": "user" },
            { "name": "Isabel", "surnames": "Aguilar", "email": "isabel@isabel.com", "startup": "VRTechSolutions", "dni": "34566543M", "phone": "633446688", "role": "user" },
            { "name": "Felipe", "surnames": "Carrillo", "email": "felipe@felipe.com", "startup": "SmartMobility", "dni": "45677654N", "phone": "644557799", "role": "user" },
            { "name": "Lucia", "surnames": "Castro", "email": "lucia@lucia.com", "startup": "EcoFriendlyTech", "dni": "56788765O", "phone": "655668800", "role": "user" },
            { "name": "Andrés", "surnames": "Lara", "email": "andres@andres.com", "startup": "NanoTechSolutions", "dni": "67899876P", "phone": "666779911", "role": "user" },
            { "name": "Elena", "surnames": "Gimenez", "email": "elena@elena.com", "startup": "AIResearch", "dni": "78900987Q", "phone": "677880022", "role": "user" },
            { "name": "Julian", "surnames": "Fuentes", "email": "julian@julian.com", "startup": "CryptoTech", "dni": "89011098R", "phone": "688991133", "role": "user" },
            { "name": "Andrea", "surnames": "Soto", "email": "andrea@andrea.com", "startup": "QuantumLab", "dni": "90122109S", "phone": "699002244", "role": "user" },
            { "name": "Emilio", "surnames": "Bustos", "email": "emilio@emilio.com", "startup": "SpaceExploration", "dni": "01233210T", "phone": "600113355", "role": "user" },
            { "name": "Raquel", "surnames": "Bravo", "email": "raquel@raquel.com", "startup": "BioMechTech", "dni": "12344322U", "phone": "611224577", "role": "user" },
            { "name": "David", "surnames": "Soria", "email": "david@david.com", "startup": "DroneTech", "dni": "23455433V", "phone": "622335688", "role": "user" },
            { "name": "Eva", "surnames": "Rey", "email": "eva@eva.com", "startup": "MedTechGlobal", "dni": "34566544W", "phone": "633446799", "role": "user" },
            { "name": "Ignacio", "surnames": "Santos", "email": "ignacio@ignacio.com", "startup": "RenewableEnergyLab", "dni": "45677655X", "phone": "644557800", "role": "user" },
            { "name": "Álvaro", "surnames": "Mora", "email": "alvaro@alvaro.com", "startup": "AgriTechSolutions", "dni": "56788766Y", "phone": "655668911", "role": "user" },
            { "name": "Teresa", "surnames": "Rico", "email": "teresa@teresa.com", "startup": "PharmaInnovation", "dni": "67899877Z", "phone": "666779022", "role": "user" },
            { "name": "Pablo", "surnames": "Rueda", "email": "pablo@pablo.com", "startup": "GenomicsLab", "dni": "78900988AA", "phone": "677880133", "role": "user" },
            { "name": "Irene", "surnames": "Arroyo", "email": "irene@irene.com", "startup": "DeepTechSolutions", "dni": "89011099BB", "phone": "688991244", "role": "user" },
            { "name": "Marcos", "surnames": "Bello", "email": "marcos@marcos.com", "startup": "BioMaterialsLab", "dni": "90122100CC", "phone": "699002355", "role": "user" },
            { "name": "Cristina", "surnames": "Reyes", "email": "cristina@cristina.com", "startup": "SmartFarming", "dni": "01233211DD", "phone": "600113466", "role": "user" },
            { "name": "Gustavo", "surnames": "Paredes", "email": "gustavo@gustavo.com", "startup": "AutonomousVehicles", "dni": "12344323EE", "phone": "611224688", "role": "user" },
            { "name": "Alma", "surnames": "Ruiz", "email": "alma@alma.com", "startup": "NanoTechInnovations", "dni": "23455434FF", "phone": "622335799", "role": "user" },
            { "name": "Joaquín", "surnames": "Pinto", "email": "joaquin@joaquin.com", "startup": "AIOptimizationLab", "dni": "34566545GG", "phone": "633446800", "role": "user" },
            { "name": "Silvia", "surnames": "Román", "email": "silvia@silvia.com", "startup": "SpaceMiningLab", "dni": "45677656HH", "phone": "644557911", "role": "user" },
            { "name": "Rodrigo", "surnames": "Palacios", "email": "rodrigo@rodrigo.com", "startup": "QuantumEnergySystems", "dni": "56788767II", "phone": "655668922", "role": "user" },
            { "name": "Claudia", "surnames": "Molina", "email": "claudia@claudia.com", "startup": "BioEnergyLab", "dni": "67899878JJ", "phone": "666779133", "role": "user" }
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