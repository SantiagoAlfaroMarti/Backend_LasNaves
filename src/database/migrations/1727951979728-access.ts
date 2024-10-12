import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Access1727951979728 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "access",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "person_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "room_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "entry_datetime",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP", 
                    },
                    {
                        name: "exit_datetime",
                        type: "datetime",
                        isNullable: true,
                    },
                    {
                        name: "state",
                        type: "enum",
                        enum: ["active", "inactive", "cancelled"],
                        default: "'active'",
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["person_id"],
                        referencedTableName: "person",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["room_id"],
                        referencedTableName: "room",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE"
                    },
                ],
            }),
            true 
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("access");
    }
}