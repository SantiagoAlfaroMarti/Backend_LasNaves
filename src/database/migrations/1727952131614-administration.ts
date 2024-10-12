import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Administration1727952131614 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "administration",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "report_date",
                        type: "date",
                        isNullable: false
                    },
                    {
                        name: "total_accesses",
                        type: "int"
                    },
                    {
                        name: "total_absences",
                        type: "int"
                    },
                    {
                        name: "frequent_persons",
                        type: "text"
                    },
                    {
                        name: "infrequent_persons",
                        type: "text"
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("administration");
    }
}