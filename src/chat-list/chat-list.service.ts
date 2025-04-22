import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    try {
      return await this.chatMembersService.findChatList(userId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(
    chatId: Chat['id'],
    userId: User['id'],
  ): Promise<ChatListDetailResponseDto> {
    try {
      return await this.chatMembersService.findChatListDetail(chatId, userId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async createChat(
    createChatListDto: CreateChatListDto,
    userId: User['id'],
  ): Promise<ChatListResponseDto> {
    try {
      if (
        !createChatListDto.memberIds.some((memberId) => memberId === userId)
      ) {
        createChatListDto.memberIds.push(userId);
      }
      const { id } = await this.chatsService.createWithMembers(
        createChatListDto,
        userId,
      );
      return await this.findOne(id, userId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async sendMessage(
    text: ChatMessage['text'],
    chatId: Chat['id'],
    userId: User['id'],
  ): Promise<ChatMessage> {
    try {
      return await this.chatMessagesService.create({
        chatId,
        userId,
        text,
        statusId: ChatMessageStatusId.STORED,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteChat(
    chatId: Chat['id'],
    userId: User['id'],
  ): Promise<Chat | null> {
    try {
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
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteMessage(
    messageId: ChatMessage['id'],
    chatId: Chat['id'],
    userId: User['id'],
  ): Promise<ChatMessage | null> {
    try {
      return await this.chatMessagesService.remove({
        id: messageId,
        chatId,
        userId,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
