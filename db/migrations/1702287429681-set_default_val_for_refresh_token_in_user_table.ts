import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValForRefreshTokenInUserTable1702287429681 implements MigrationInterface {
    name = 'SetDefaultValForRefreshTokenInUserTable1702287429681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NOT NULL`);
    }

}
