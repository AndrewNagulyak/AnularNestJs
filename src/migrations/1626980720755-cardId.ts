import {MigrationInterface, QueryRunner} from "typeorm";

export class cardId1626980720755 implements MigrationInterface {
    name = 'cardId1626980720755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_252627060053efe497200187c2a"`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "cardId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "task"."cardId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_252627060053efe497200187c2a" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_252627060053efe497200187c2a"`);
        await queryRunner.query(`COMMENT ON COLUMN "task"."cardId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "cardId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_252627060053efe497200187c2a" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
