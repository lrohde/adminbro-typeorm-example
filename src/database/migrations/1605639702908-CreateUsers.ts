import { MigrationInterface, QueryRunner, Table } from "typeorm";

export const UserSeed = {
  name: "Usuário Teste",
  email: 'admin@pdvmundo.com.br',
  role: 'admin',
  encryptedPassword: '$2b$10$xBl2on7dSZ.F.y4FlS2rrOB02lZuwloJ2gIVinf0qD2JAAHF6/rte',
};
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
              },
              {
                name: 'name',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'encryptedPassword',
                type: 'varchar',
                isNullable: false,
              },
              {
                name: 'role',
                type: 'enum',
                enum: ['admin', 'restricted'],
                isNullable: false,
              },
              {
                name: 'created_at',
                type: 'timestamp',
                default: 'now()'
              },
              {
                name: 'updated_at',
                type: 'timestamp',
                default: 'now()'
              }
            ]
        })
        );

        await queryRunner
          .manager
          .createQueryBuilder()
          .insert()
          .into("users")
          .values(UserSeed)
          .execute()
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('users');
    }
}
