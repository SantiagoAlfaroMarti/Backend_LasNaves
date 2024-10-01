import { accessSeeder } from "./accessSeeder";
import { administrationSeeder } from "./administrationSeeder";
import { personsSeeder } from "./personsSeeder";
import { roomsSeeder } from "./roomsSeeder";

(async () => {
    console.log("Starting seeders...");
    await personsSeeder();
    await roomsSeeder();
    await accessSeeder();
    await administrationSeeder();
})();