import {
 OnGatewayConnection,
 OnGatewayDisconnect,
 SubscribeMessage,
 WebSocketGateway,
 WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Logger} from '@nestjs/common';

@WebSocketGateway(	)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

 @WebSocketServer() server: Server;
 users: number = 0;
 private logger: Logger = new Logger('AppGateway');

 async handleConnection(client: Socket, ...args: any[]) {
	this.logger.log(`Client connected: ${client.id}`);

	// A client has connected
	this.users++;
	// Notify connected clients of current users
	this.server.emit('users', this.users);

 }

 @SubscribeMessage('msgToServer')
 handleMessage(client: Socket, payload: string): void {
	this.server.emit('msgToClient', payload);
 }


 afterInit(server: Server) {
	this.logger.log('Init');
 }

 async handleDisconnect(client: Socket, ...args: any[]) {
	this.logger.log(`Client disconnected: ${client.id}`);

	// A client has disconnected
	this.users--;

	// Notify connected clients of current users
	this.server.emit('users', this.users);

 }

 @SubscribeMessage('chat')
 async onChat(client, message) {
	client.broadcast.emit('chat', message);
 }

}
