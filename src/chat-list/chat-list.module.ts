import { Module } from '@nestjs/common';
import { ChatMembersModule } from 'src/chat-members/chat-members.module';
import { ChatMessagesModule } from 'src/chat-messages/chat-messages.module';
import { ChatListController } from './chat-list.controller';
import { ChatListService } from './chat-list.service';

@Module({
  imports: [ChatMembersModule, ChatMessagesModule],
  controllers: [ChatListController],
  providers: [ChatListService],
})
export class ChatListModule {}
