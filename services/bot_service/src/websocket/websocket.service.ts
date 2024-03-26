// import { Injectable } from '@nestjs/common';
// import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @Injectable()
// export class WebsocketService {}
// @WebSocketGateway()
// export class MyWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

//     @WebSocketServer() server: Server;

//     handleConnection(client: Socket) {
//       console.log('Client connected:', client.id);
//     }
  
//     handleDisconnect(client: Socket) {
//       console.log('Client disconnected:', client.id);
//     }
  
//     @SubscribeMessage('messageToServer')
//     handleMessage(client: Socket, payload: any): void {
//       console.log('Received message from client:', payload);
//       // Handle received message from client if needed
//     }
  
//     sendMessageToClient(message: any): void {
//       this.server.emit('messageToClient', message);
//     }
//   }