import { Injectable } from '@nestjs/common';
import { Chat, ChatMessage, User } from '@prisma/client';
import { ChatMembersService } from 'src/chat-members/chat-members.service';
import { ChatMessagesService } from 'src/chat-messages/chat-messages.service';
import { ChatMessageStatusId } from 'src/common/enums/chat-messages.enum';
import {
  ChatListDetailResponseDto,
  ChatListResponseDto,
} from './dto/chat-list-response.dto';

@Injectable()
export class ChatListService {
  constructor(
    private readonly chatMembersService: ChatMembersService,
    private readonly chatMessagesService: ChatMessagesService,
  ) {}

  async findAll(userId: User['id']): Promise<ChatListResponseDto[]> {
    const response = await this.chatMembersService.findChatList(userId);

    return response;
  }

  async findOne(
    chatId: Chat['id'],
    userId: User['id'],
  ): Promise<ChatListDetailResponseDto> {
    const response = await this.chatMembersService.findChatListDetail(
      chatId,
      userId,
    );

    return response;
  }

  async sendMessage(
    text: ChatMessage['text'],
    chatId: Chat['id'],
    userId: User['id'],
  ): Promise<ChatMessage> {
    const response = await this.chatMessagesService.create({
      chatId,
      userId,
      text,
      statusId: ChatMessageStatusId.STORED,
    });

    return response;
  }
}
