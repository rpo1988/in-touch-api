import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Chat, ChatMessage } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UserId } from 'src/auth/userId.decorator';
import {
  ChatListDetailResponseDto,
  ChatListResponseDto,
} from 'src/chat-list/dto/chat-list-response.dto';
import { CreateChatListMessageDto } from 'src/chat-list/dto/create-chat-list-message.dto';
import { CreateChatListDto } from 'src/chat-list/dto/create-chat-list.dto';
import { ChatListSocketService } from 'src/chat-list/socket.service';
import { ChatListService } from './chat-list.service';

@UseGuards(JwtAuthGuard)
@Controller('api/chat-list')
export class ChatListController {
  constructor(
    private readonly chatListService: ChatListService,
    private readonly chatListSocketService: ChatListSocketService,
  ) {}

  @Get()
  async findAll(@UserId() userId: string): Promise<ChatListResponseDto[]> {
    const response = await this.chatListService.findAll(userId);

    return response || [];
  }

  @Get(':id')
  async findOne(
    @Param('id') chatId: Chat['id'],
    @UserId() userId: string,
  ): Promise<ChatListDetailResponseDto> {
    const response = await this.chatListService.findOne(chatId, userId);

    return response;
  }

  @Post()
  async createChat(
    @Body() createChatListDto: CreateChatListDto,
    @UserId() userId: string,
  ): Promise<ChatListResponseDto> {
    const response = await this.chatListService.createChat(
      createChatListDto,
      userId,
    );
    return response;
  }

  @Post(':id/messages')
  async sendMessage(
    @Body() createChatListMessageDto: CreateChatListMessageDto,
    @Param('id') chatId: Chat['id'],
    @UserId() userId: string,
  ): Promise<ChatMessage> {
    const { text } = createChatListMessageDto;

    // Persisto en BBDD
    const response = await this.chatListService.sendMessage(
      text,
      chatId,
      userId,
    );

    // Emito por Socket
    this.chatListSocketService.emitSendMessage(response, chatId, userId);

    return response;
  }

  @Delete(':id')
  async deleteChat(
    @Param('id') chatId: Chat['id'],
    @UserId() userId: string,
  ): Promise<Pick<Chat, 'id'>> {
    const response = await this.chatListService.deleteChat(chatId, userId);

    if (!response)
      throw new NotFoundException(`Chat with ID ${chatId} not found`);

    // Emito por Socket
    this.chatListSocketService.emitRemoveChat(
      { chatId: response.id },
      chatId,
      userId,
    );

    return {
      id: chatId,
    };
  }

  @Delete(':id/messages/:messageId')
  async deleteMessage(
    @Param('id') chatId: Chat['id'],
    @Param('messageId') messageId: ChatMessage['id'],
    @UserId() userId: string,
  ): Promise<Pick<ChatMessage, 'id'>> {
    const response = await this.chatListService.deleteMessage(
      messageId,
      chatId,
      userId,
    );

    if (!response)
      throw new NotFoundException(
        `Chat message with ID ${messageId} not found`,
      );

    return {
      id: messageId,
    };
  }
}
