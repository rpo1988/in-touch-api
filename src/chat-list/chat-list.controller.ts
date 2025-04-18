import { Controller, Get, Param, Session } from '@nestjs/common';
import { Chat, User } from '@prisma/client';
import {
  ChatListDetailResponseDto,
  ChatListResponseDto,
} from 'src/chat-list/dto/chat-list-response.dto';
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

  @Get(':id')
  async findOne(
    @Param('id') chatId: Chat['id'],
    @Session() session: any,
  ): Promise<ChatListDetailResponseDto> {
    const userId: User['id'] = session.userId;
    const response = await this.chatListService.findOne(chatId, userId);

    return response;
  }
}
