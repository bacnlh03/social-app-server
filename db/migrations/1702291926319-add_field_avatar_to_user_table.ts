import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldAvatarToUserTable1702291926319 implements MigrationInterface {
    name = 'AddFieldAvatarToUserTable1702291926319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
