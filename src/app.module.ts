import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { BoardsModule } from './boards/boards.module';
import { ChatModule } from './chat/chat.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    TasksModule,
    CardsModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          username: config.get('POSTGRES_USER'),
          port: Number(config.get('POSTGRES_PORT')),
          host: config.get('POSTGRES_HOST'),
          password: config.get('POSTGRES_PASSWORD'),
          database: config.get('POSTGRES_DB'),
          type: 'postgres',
          entities: ['dist/**/*.entity.js'],
          synchronize: true,
          dropSchema: true,
          migrationsRun: true,
          migrationsTableName: 'migrations',
          migrations: [`src/migrations/*.js`],
          cli: {
            migrationsDir: 'src/migrations',
          },
        } as PostgresConnectionOptions;
      },
    }),
    AuthModule,
    BoardsModule,
    FeedModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
