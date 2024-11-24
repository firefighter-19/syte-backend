import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1732444368258 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "locale" (language, code) VALUES ('English', 'en-EN') ON CONFLICT(code) DO NOTHING;`,
    );
    await queryRunner.query(
      `INSERT INTO "locale" (language, code) VALUES ('Hebrew', 'he-IL') ON CONFLICT(code) DO NOTHING;`,
    );
    console.log('Locales inserted successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "locale" WHERE code = 'en-EN';`);
    await queryRunner.query(`DELETE FROM "locale" WHERE code = 'he-IL';`);
  }
}
