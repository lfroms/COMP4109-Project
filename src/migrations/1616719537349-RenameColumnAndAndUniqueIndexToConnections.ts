import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColumnAndAndUniqueIndexToConnections1616719537349 implements MigrationInterface {
  name = 'RenameColumnAndAndUniqueIndexToConnections1616719537349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "connection" RENAME COLUMN "connectionId" TO "socketId"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2bfce55f3fb1c7b26f754e36c0" ON "connection" ("socketId") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_2bfce55f3fb1c7b26f754e36c0"`);
    await queryRunner.query(`ALTER TABLE "connection" RENAME COLUMN "socketId" TO "connectionId"`);
  }
}
