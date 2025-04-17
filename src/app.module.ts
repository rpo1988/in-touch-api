import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [PrismaModule, UsersModule, ChatsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
