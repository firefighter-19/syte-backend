import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1732444570023 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "user" (id, name, created_at, updated_at) SELECT gen_random_uuid(),
            'User#1',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
            WHERE NOT EXISTS (
            SELECT 1 FROM "user" WHERE name = 'Default User'
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "user" WHERE name = 'Default User';`);
  }
}
