import { Module } from '@nestjs/common';
import { ChatStatusesService } from 'src/chat-messages/chat-statuses.service';
import { ChatsModule } from 'src/chats/chats.module';
import { UsersModule } from 'src/users/users.module';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatMessagesService } from './chat-messages.service';

@Module({
  imports: [UsersModule, ChatsModule],
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService, ChatStatusesService],
})
export class ChatMessagesModule {}
