import { Module } from '@nestjs/common';
import { ChatsModule } from 'src/chats/chats.module';
import { UsersModule } from 'src/users/users.module';
import { ChatMembersController } from './chat-members.controller';
import { ChatMembersService } from './chat-members.service';

@Module({
  imports: [UsersModule, ChatsModule],
  controllers: [ChatMembersController],
  providers: [ChatMembersService],
})
export class ChatMembersModule {}
