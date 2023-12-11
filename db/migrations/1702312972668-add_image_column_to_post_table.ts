import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageColumnToPostTable1702312972668 implements MigrationInterface {
    name = 'AddImageColumnToPostTable1702312972668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`image\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`image\``);
    }

}
