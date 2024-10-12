import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Room1727951957088 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "room",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "room_name",
                        type: "varchar",
                        length: "50",
                        isNullable: false
                    },
                    {
                        name: "capacity",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "room_type",
                        type: "varchar",
                        length: "50"
                    }
                ]
            }),
            true
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('room')
    }

}