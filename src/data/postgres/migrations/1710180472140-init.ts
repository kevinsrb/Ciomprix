import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1710180472140 implements MigrationInterface {
    name = 'Init1710180472140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."evidences_format_enum" AS ENUM('png', 'jpg', 'jpeg', 'pdf')`);
        await queryRunner.query(`CREATE TABLE "evidences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "size" integer NOT NULL DEFAULT '0', "format" "public"."evidences_format_enum" NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "subject_id" uuid, CONSTRAINT "PK_bffc6fa8c23f9fd2e2a6d165d45" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subjects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "period" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1a023685ac2b051b4e557b0b280" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'student')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "lastname" character varying(50) NOT NULL, "email" character varying(150) NOT NULL, "identification" character varying(15) NOT NULL, "phone" character varying(10) NOT NULL, "password" character varying NOT NULL, "birthdate" TIMESTAMP, "active" boolean NOT NULL DEFAULT true, "role" "public"."users_role_enum" NOT NULL DEFAULT 'student', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_140d91acc242af813ce91987621" UNIQUE ("identification"), CONSTRAINT "UQ_450a05c0c4de5b75ac8d34835b9" UNIQUE ("password"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_subject" ("user_id" uuid NOT NULL, "subject_id" uuid NOT NULL, CONSTRAINT "PK_9d865bdac8ae736b98558864338" PRIMARY KEY ("user_id", "subject_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_04a3f5716fe0305e5f40c2653e" ON "user_subject" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9ab1d5dcd8550cd90ba85b0fb0" ON "user_subject" ("subject_id") `);
        await queryRunner.query(`ALTER TABLE "evidences" ADD CONSTRAINT "FK_54175007da5c95bfb5be50cdaab" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "evidences" ADD CONSTRAINT "FK_7b09b70bd383b254aa68b4c2bb3" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subject" ADD CONSTRAINT "FK_04a3f5716fe0305e5f40c2653e0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_subject" ADD CONSTRAINT "FK_9ab1d5dcd8550cd90ba85b0fb0a" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_subject" DROP CONSTRAINT "FK_9ab1d5dcd8550cd90ba85b0fb0a"`);
        await queryRunner.query(`ALTER TABLE "user_subject" DROP CONSTRAINT "FK_04a3f5716fe0305e5f40c2653e0"`);
        await queryRunner.query(`ALTER TABLE "evidences" DROP CONSTRAINT "FK_7b09b70bd383b254aa68b4c2bb3"`);
        await queryRunner.query(`ALTER TABLE "evidences" DROP CONSTRAINT "FK_54175007da5c95bfb5be50cdaab"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9ab1d5dcd8550cd90ba85b0fb0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_04a3f5716fe0305e5f40c2653e"`);
        await queryRunner.query(`DROP TABLE "user_subject"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "subjects"`);
        await queryRunner.query(`DROP TABLE "evidences"`);
        await queryRunner.query(`DROP TYPE "public"."evidences_format_enum"`);
    }

}
