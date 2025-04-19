import { Injectable } from '@nestjs/common';
import { Chat, ChatMessage, User } from '@prisma/client';
import { CreateChatListDto } from 'src/chat-list/dto/create-chat-list.dto';
import { ChatMembersService } from 'src/chat-members/chat-members.service';
import { ChatMessagesService } from 'src/chat-messages/chat-messages.service';
import { ChatsService } from 'src/chats/chats.service';
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
    private readonly chatsService: ChatsService,
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

  async createChat(
    createChatListDto: CreateChatListDto,
    userId: User['id'],
  ): Promise<Chat> {
    if (!createChatListDto.memberIds.some((memberId) => memberId === userId)) {
      createChatListDto.memberIds.push(userId);
    }
    const response = await this.chatsService.createWithMembers(
      createChatListDto,
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

  async deleteChat(
    chatId: Chat['id'],
    userId: User['id'],
  ): Promise<Chat | null> {
    return await this.chatsService.remove(
      {
        id: chatId,
      },
      {
        chatMembers: {
          where: { userId, isOwner: true }, // Verificar si el usuario es propietario
        },
      },
    );
  }

  async deleteMessage(
    messageId: ChatMessage['id'],
    chatId: Chat['id'],
    userId: User['id'],
  ): Promise<ChatMessage | null> {
    return await this.chatMessagesService.remove({
      id: messageId,
      chatId,
      userId,
    });
  }
}
