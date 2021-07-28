import {TypeOrmModuleOptions} from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
 type: 'postgres',
 host: 'localhost',
 username: 'postgres',
 password: 'Hsdyt5858',
 database: 'timemanagement',
 port: 5432,
 synchronize: false,
 dropSchema: false,
 migrationsRun: true,
 migrationsTableName: 'migrations',
 migrations: ['src/migrations/*.ts'],
 cli: {
	migrationsDir: 'src/migrations'
 }
}
