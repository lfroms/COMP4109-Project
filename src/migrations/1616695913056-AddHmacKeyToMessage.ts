import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHmacKeyToMessage1616695913056 implements MigrationInterface {
  name = 'AddHmacKeyToMessage1616695913056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" ADD "hmac" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "hmac"`);
  }
}
