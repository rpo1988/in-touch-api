import { Module } from '@nestjs/common';
import { ChatMembersModule } from 'src/chat-members/chat-members.module';
import { ChatListController } from './chat-list.controller';
import { ChatListService } from './chat-list.service';

@Module({
  imports: [ChatMembersModule],
  controllers: [ChatListController],
  providers: [ChatListService],
})
export class ChatListModule {}
