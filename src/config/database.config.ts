import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'Hsdyt5858',
  database: 'timemanagement',
  autoLoadEntities: true,
  port: 5432,
  synchronize: true,
  dropSchema: true,
  migrationsRun: true,
  migrationsTableName: 'migrations',

  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
