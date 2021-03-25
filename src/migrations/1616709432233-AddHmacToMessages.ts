import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHmacToMessages1616709432233 implements MigrationInterface {
  name = 'AddHmacToMessages1616709432233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" ADD "hmac" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "hmac"`);
  }
}
