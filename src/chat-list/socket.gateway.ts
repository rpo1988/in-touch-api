import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
  },
  namespace: 'chat',
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private clientMap: Map<string, string> = new Map(); // userId -> clientId

  public get userClientMap(): Map<string, string> {
    return this.clientMap;
  }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');

  constructor(private jwtService: JwtService) {}

  // Called after the gateway is initialized
  afterInit(/*server: Server*/) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    try {
      const token: string = client.handshake.auth.token;
      const payload = this.jwtService.verify<{ sub: string; username: string }>(
        token,
      );
      client.data.user = payload;
      const userId = payload.sub;
      this.clientMap.set(userId, client.id);
      this.logger.log(`Client connected: ${userId} <> ${client.id}`);
    } catch (error) {
      client.emit('error', { message: 'Unauthorized' });
      client.disconnect();
      this.logger.error(`Client connection error: ${error}`);
    }
  }

  // Called when a client disconnects
  handleDisconnect(client: Socket) {
    const userId: string = client.data.user.sub;
    if (userId) this.clientMap.delete(userId);
    this.logger.log(`Client disconnected: ${userId} <> ${client.id}`);
  }

  // Handle connected events from clients
  @SubscribeMessage('connected')
  handleConnected(client: Socket, payload: any): void {
    this.logger.log(
      `Event connected received from ${client.id}: ${JSON.stringify(payload)}`,
    );
    this.server
      .except(client.id)
      .emit('connected', { ...payload, timestamp: new Date() });
  }

  // Handle disconnected events from clients
  @SubscribeMessage('disconnected')
  handleDisconnected(client: Socket, payload: any): void {
    this.logger.log(
      `Event disconnected received from ${client.id}: ${JSON.stringify(payload)}`,
    );
    this.server
      .except(client.id)
      .emit('disconnected', { ...payload, timestamp: new Date() });
  }

  // Join userId to chatIds
  @SubscribeMessage('joinChats')
  handleJoinChat(client: Socket, chatIds: string[]) {
    client.join(chatIds);
    this.logger.log(`Client ${client.id} joined chats ${chatIds.toString()}`);
  }
}
