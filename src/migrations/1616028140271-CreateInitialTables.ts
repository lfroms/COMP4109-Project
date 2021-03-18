import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1616028140271 implements MigrationInterface {
  name = 'CreateInitialTables1616028140271';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "publicKey" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "conversationId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "conversation" ("id" SERIAL NOT NULL, CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "personal_conversation_key" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, "userId" integer, "conversationId" integer, CONSTRAINT "REL_d3e24803565b2b0d27dd0b73ac" UNIQUE ("userId"), CONSTRAINT "REL_159a26d4ab4e868aed1675466e" UNIQUE ("conversationId"), CONSTRAINT "PK_de8224d806c7b1baa443b4a9465" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_conversations_conversation" ("userId" integer NOT NULL, "conversationId" integer NOT NULL, CONSTRAINT "PK_32949b370b6a6f3413bb1eda505" PRIMARY KEY ("userId", "conversationId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_25944e737d295aabbe9c3ea1ec" ON "user_conversations_conversation" ("userId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_005394704c1c42e3da287a7399" ON "user_conversations_conversation" ("conversationId") `
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" ADD CONSTRAINT "FK_d3e24803565b2b0d27dd0b73acd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" ADD CONSTRAINT "FK_159a26d4ab4e868aed1675466e1" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_conversations_conversation" ADD CONSTRAINT "FK_25944e737d295aabbe9c3ea1ecf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_conversations_conversation" ADD CONSTRAINT "FK_005394704c1c42e3da287a73991" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_conversations_conversation" DROP CONSTRAINT "FK_005394704c1c42e3da287a73991"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_conversations_conversation" DROP CONSTRAINT "FK_25944e737d295aabbe9c3ea1ecf"`
    );
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" DROP CONSTRAINT "FK_159a26d4ab4e868aed1675466e1"`
    );
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" DROP CONSTRAINT "FK_d3e24803565b2b0d27dd0b73acd"`
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"`
    );
    await queryRunner.query(`DROP INDEX "IDX_005394704c1c42e3da287a7399"`);
    await queryRunner.query(`DROP INDEX "IDX_25944e737d295aabbe9c3ea1ec"`);
    await queryRunner.query(`DROP TABLE "user_conversations_conversation"`);
    await queryRunner.query(`DROP TABLE "personal_conversation_key"`);
    await queryRunner.query(`DROP TABLE "conversation"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
