import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatMessage } from '@prisma/client';
import { Server } from 'socket.io';
import { SocketGateway } from 'src/chat-list/socket.gateway';

@Injectable()
export class ChatListSocketService {
  constructor(private readonly socketGateway: SocketGateway) {}

  emitSendMessage(
    payload: ChatMessage,
    chatId: string,
    excludeUserId?: string,
  ): void {
    try {
      const server: Server = this.socketGateway.server;
      const excludeClientId = excludeUserId
        ? this.socketGateway.userClientMap.get(excludeUserId)
        : undefined;
      server
        .to(chatId)
        .except(excludeClientId || '')
        .emit('message', payload);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  emitRemoveChat(
    payload: { chatId: string },
    chatId: string,
    excludeUserId?: string,
  ): void {
    try {
      const server: Server = this.socketGateway.server;
      const excludeClientId = excludeUserId
        ? this.socketGateway.userClientMap.get(excludeUserId)
        : undefined;
      server
        .to(chatId)
        .except(excludeClientId || '')
        .emit('removeChat', payload);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
