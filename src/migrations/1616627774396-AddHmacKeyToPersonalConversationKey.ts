import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHmacKeyToPersonalConversationKey1616627774396 implements MigrationInterface {
  name = 'AddHmacKeyToPersonalConversationKey1616627774396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "personal_conversation_key" ADD "hmacKey" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "personal_conversation_key" DROP COLUMN "hmacKey"`);
  }
}
