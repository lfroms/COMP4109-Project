import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyUniqueConstraintOnPCK1616466101951 implements MigrationInterface {
  name = 'ModifyUniqueConstraintOnPCK1616466101951';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" DROP CONSTRAINT "FK_d3e24803565b2b0d27dd0b73acd"`
    );
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" DROP CONSTRAINT "FK_159a26d4ab4e868aed1675466e1"`
    );
    await queryRunner.query(`COMMENT ON COLUMN "personal_conversation_key"."userId" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" DROP CONSTRAINT "REL_d3e24803565b2b0d27dd0b73ac"`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "personal_conversation_key"."conversationId" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" DROP CONSTRAINT "REL_159a26d4ab4e868aed1675466e"`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e38aaedee6a0115c152676c5fc" ON "personal_conversation_key" ("userId", "conversationId") `
    );
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" ADD CONSTRAINT "FK_d3e24803565b2b0d27dd0b73acd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" ADD CONSTRAINT "FK_159a26d4ab4e868aed1675466e1" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" DROP CONSTRAINT "FK_159a26d4ab4e868aed1675466e1"`
    );
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" DROP CONSTRAINT "FK_d3e24803565b2b0d27dd0b73acd"`
    );
    await queryRunner.query(`DROP INDEX "IDX_e38aaedee6a0115c152676c5fc"`);
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" ADD CONSTRAINT "REL_159a26d4ab4e868aed1675466e" UNIQUE ("conversationId")`
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "personal_conversation_key"."conversationId" IS NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" ADD CONSTRAINT "REL_d3e24803565b2b0d27dd0b73ac" UNIQUE ("userId")`
    );
    await queryRunner.query(`COMMENT ON COLUMN "personal_conversation_key"."userId" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" ADD CONSTRAINT "FK_159a26d4ab4e868aed1675466e1" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" ADD CONSTRAINT "FK_d3e24803565b2b0d27dd0b73acd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
