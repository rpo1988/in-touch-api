import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ChatMembersModule } from './chat-members/chat-members.module';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';
import { ChatsModule } from './chats/chats.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ChatListModule } from './chat-list/chat-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    ChatsModule,
    ChatMembersModule,
    ChatMessagesModule,
    AuthModule,
    ChatListModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
