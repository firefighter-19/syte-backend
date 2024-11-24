import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1732437967152 implements MigrationInterface {
    name = 'Init1732437967152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "locale" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying(255) NOT NULL, "code" character varying(255) NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_4b7a3ebe8ec48f1bb2c4b80e349" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "catalog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "vertical" "public"."catalog_vertical_enum" NOT NULL, "is_primary" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "indexed_at" TIMESTAMP NOT NULL DEFAULT '2024-11-24T08:46:08.007Z', CONSTRAINT "UQ_408ad15a08984a8e9b0619ee3e5" UNIQUE ("name"), CONSTRAINT "PK_782754bded12b4e75ad4afff913" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_408ad15a08984a8e9b0619ee3e" ON "catalog" ("name") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "created_at" TIMESTAMP DEFAULT '2024-11-24T08:46:08.009Z', "deleted_at" TIMESTAMP, "updated_at" TIMESTAMP DEFAULT '2024-11-24T08:46:08.009Z', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "catalog_locale" ("catalogId" uuid NOT NULL, "localeId" uuid NOT NULL, CONSTRAINT "PK_6857d70fa05e3dcd95ff191b29d" PRIMARY KEY ("catalogId", "localeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a15bcc05ac8fba8f0d33e234d1" ON "catalog_locale" ("catalogId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9059dba5ac94fb70be6cfa88ec" ON "catalog_locale" ("localeId") `);
        await queryRunner.query(`CREATE TABLE "user_catalog" ("userId" uuid NOT NULL, "catalogId" uuid NOT NULL, CONSTRAINT "PK_3a71fd5e9024840a5248dcaeb12" PRIMARY KEY ("userId", "catalogId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9fdf2a9a0a387e116dfdf36dc1" ON "user_catalog" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c08e1e512f367dced8b6675348" ON "user_catalog" ("catalogId") `);
        await queryRunner.query(`ALTER TABLE "catalog_locale" ADD CONSTRAINT "FK_a15bcc05ac8fba8f0d33e234d14" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "catalog_locale" ADD CONSTRAINT "FK_9059dba5ac94fb70be6cfa88ece" FOREIGN KEY ("localeId") REFERENCES "locale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_catalog" ADD CONSTRAINT "FK_9fdf2a9a0a387e116dfdf36dc12" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_catalog" ADD CONSTRAINT "FK_c08e1e512f367dced8b66753485" FOREIGN KEY ("catalogId") REFERENCES "catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_catalog" DROP CONSTRAINT "FK_c08e1e512f367dced8b66753485"`);
        await queryRunner.query(`ALTER TABLE "user_catalog" DROP CONSTRAINT "FK_9fdf2a9a0a387e116dfdf36dc12"`);
        await queryRunner.query(`ALTER TABLE "catalog_locale" DROP CONSTRAINT "FK_9059dba5ac94fb70be6cfa88ece"`);
        await queryRunner.query(`ALTER TABLE "catalog_locale" DROP CONSTRAINT "FK_a15bcc05ac8fba8f0d33e234d14"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c08e1e512f367dced8b6675348"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9fdf2a9a0a387e116dfdf36dc1"`);
        await queryRunner.query(`DROP TABLE "user_catalog"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9059dba5ac94fb70be6cfa88ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a15bcc05ac8fba8f0d33e234d1"`);
        await queryRunner.query(`DROP TABLE "catalog_locale"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_408ad15a08984a8e9b0619ee3e"`);
        await queryRunner.query(`DROP TABLE "catalog"`);
        await queryRunner.query(`DROP TABLE "locale"`);
    }

}
