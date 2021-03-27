import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsernameToUsers1616802849448 implements MigrationInterface {
  name = 'AddUsernameToUsers1616802849448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying NOT NULL`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_78a916df40e02a9deb1c4b75ed"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
  }
}
