import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConnections1616716511690 implements MigrationInterface {
  name = 'CreateConnections1616716511690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "connection" ("id" SERIAL NOT NULL, "connectionId" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_be611ce8b8cf439091c82a334b2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "connection" ADD CONSTRAINT "FK_3b35155c2968acced66fc326aea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "connection" DROP CONSTRAINT "FK_3b35155c2968acced66fc326aea"`
    );
    await queryRunner.query(`DROP TABLE "connection"`);
  }
}
