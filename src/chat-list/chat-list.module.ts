import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { SocketGateway } from 'src/chat-list/socket.gateway';
import { ChatListSocketService } from 'src/chat-list/socket.service';
import { ChatMembersModule } from 'src/chat-members/chat-members.module';
import { ChatMessagesModule } from 'src/chat-messages/chat-messages.module';
import { ChatsModule } from 'src/chats/chats.module';
import { ChatListController } from './chat-list.controller';
import { ChatListService } from './chat-list.service';

@Module({
  imports: [ChatMembersModule, ChatMessagesModule, ChatsModule, AuthModule],
  controllers: [ChatListController],
  providers: [ChatListService, SocketGateway, ChatListSocketService],
})
export class ChatListModule {}
