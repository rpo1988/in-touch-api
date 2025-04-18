import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Chat, ChatMessage, User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ChatListDetailResponseDto,
  ChatListResponseDto,
} from 'src/chat-list/dto/chat-list-response.dto';
import { CreateChatListMessageDto } from 'src/chat-list/dto/create-chat-list-message.dto';
import { ChatListService } from './chat-list.service';

@UseGuards(AuthGuard)
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

  @Post(':id/messages')
  async sendMessage(
    @Body() createChatListMessageDto: CreateChatListMessageDto,
    @Param('id') chatId: Chat['id'],
    @Session() session: any,
  ): Promise<ChatMessage> {
    const { text } = createChatListMessageDto;
    const userId: User['id'] = session.userId;
    const response = await this.chatListService.sendMessage(
      text,
      chatId,
      userId,
    );

    return response;
  }
}
