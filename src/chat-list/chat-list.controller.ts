import { Controller, Get, Session } from '@nestjs/common';
import { User } from '@prisma/client';
import { ChatListResponseDto } from 'src/chat-list/dto/chat-list-response.dto';
import { ChatListService } from './chat-list.service';

@Controller('api/chat-list')
export class ChatListController {
  constructor(private readonly chatListService: ChatListService) {}

  @Get()
  async findAll(@Session() session: any): Promise<ChatListResponseDto[]> {
    const userId: User['id'] = session.userId;
    const response = await this.chatListService.findAll(userId);

    return response || [];
  }
}
