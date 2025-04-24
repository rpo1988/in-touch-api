import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ChatMessage } from '@prisma/client';
import { Server } from 'socket.io';
import { SocketGateway } from 'src/chat-list/socket.gateway';
import { ChatListResponseDto } from './dto/chat-list-response.dto';

@Injectable()
export class ChatListSocketService {
  private logger: Logger = new Logger('SocketGateway');

  constructor(private readonly socketGateway: SocketGateway) {}

  emitSendMessage(
    payload: ChatMessage,
    chatId: string,
    excludeUserId?: string,
  ): void {
    try {
      this.logger.log('Emit message event', payload);
      const server: Server = this.socketGateway.server;
      const excludeClientId = excludeUserId
        ? this.socketGateway.userClientMap.get(excludeUserId)
        : undefined;
      server
        .to(chatId)
        .except(excludeClientId || '')
        .emit('message', payload);
    } catch (error) {
      this.logger.error('Error emitting message event', error, payload);
      throw new InternalServerErrorException();
    }
  }

  emitRemoveChat(
    payload: { chatId: string },
    chatId: string,
    excludeUserId?: string,
  ): void {
    try {
      this.logger.log('Emit removeChat event', payload);
      const server: Server = this.socketGateway.server;
      const excludeClientId = excludeUserId
        ? this.socketGateway.userClientMap.get(excludeUserId)
        : undefined;
      server
        .to(chatId)
        .except(excludeClientId || '')
        .emit('removeChat', payload);
    } catch (error) {
      this.logger.error('Error emitting removeChat event', error, payload);
      throw new InternalServerErrorException();
    }
  }

  emitCreateChat(
    payload: ChatListResponseDto,
    userIds: string[],
    excludeUserId?: string,
  ): void {
    try {
      this.logger.log('Emit createChat event', payload);
      const server: Server = this.socketGateway.server;
      const includedClientIds = Array.from(
        this.socketGateway.userClientMap.entries(),
      ).reduce((acc, [userId, clientId]) => {
        return userIds.includes(userId) ? [...acc, clientId] : acc;
      }, [] as string[]);
      const excludeClientId = excludeUserId
        ? this.socketGateway.userClientMap.get(excludeUserId)
        : undefined;
      server
        .to(includedClientIds)
        .except(excludeClientId || '')
        .emit('createChat', payload);
    } catch (error) {
      this.logger.error('Error emmiting createChat event', error, payload);
      throw new InternalServerErrorException();
    }
  }
}
