import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from '@nestjs/common';
import {SocketIoAdapter} from './chat/socket-io.adapter';

async function bootstrap() {
 const port = Number.parseInt(process.env.Port, 10);
 const logger = new Logger('bootstrap')
 const app = await NestFactory.create(AppModule, {cors: true});
 await app.listen(port);
 app.useWebSocketAdapter(new SocketIoAdapter(app, true));
 console.log('Application Type - ' + process.env.NODE_ENV);
 logger.log('Application Listening on port' + port);

}

bootstrap();
