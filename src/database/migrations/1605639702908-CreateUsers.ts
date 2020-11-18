import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1605639702908 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'users',
            columns: [
              {
                name: 'id',
                type: 'varchar',
                isPrimary: true,
                generationStrategy: 'uuid',
                default: 'uuid_generate_v4()',
              },
              {
                name: 'email',
                type: 'varchar',
                isNullable: false,
                isUnique: true,
              }
            ]
        })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('users');
    }
}
