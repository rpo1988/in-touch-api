import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { ChatMembersModule } from './chat-members/chat-members.module';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';

@Module({
  imports: [PrismaModule, UsersModule, ChatsModule, ChatMembersModule, ChatMessagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
