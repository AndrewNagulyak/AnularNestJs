import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const port = Number.parseInt(process.env.Port, 10);
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, { cors: true });

  const options = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };

  app.enableCors(options);
  await app.listen(port);
  console.log('Application Type - ' + process.env.NODE_ENV);
  logger.log('Application Listening on port' + port);
}

bootstrap();
