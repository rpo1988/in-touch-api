import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatMessage, Prisma } from '@prisma/client';
import { ChatStatusesService } from 'src/chat-messages/chat-statuses.service';
import { CreateChatMessageDto } from 'src/chat-messages/dto/create-chat-message.dto';
import { ChatsService } from 'src/chats/chats.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatMessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly chatsService: ChatsService,
    private readonly chatStatusesService: ChatStatusesService,
  ) {}

  async create(
    createChatMessageDto: CreateChatMessageDto,
  ): Promise<ChatMessage> {
    const { userId, chatId, statusId, text } = createChatMessageDto;

    // Validaciones funcionales
    // Verificar que userId existe
    const userExists = await this.usersService.findOne(userId);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verificar que chatId existe
    const chatExists = await this.chatsService.findOne(chatId);
    if (!chatExists) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Verificar que statusId existe
    const statusExists = await this.chatStatusesService.findOne(statusId);
    if (!statusExists) {
      throw new NotFoundException(`Chat status with ID ${statusId} not found`);
    }

    return await this.prisma.chatMessage.create({
      data: {
        userId,
        chatId,
        statusId,
        text,
      },
      select: {
        chatId: true,
        userId: true,
        statusId: true,
        text: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<ChatMessage[]> {
    return await this.prisma.chatMessage.findMany();
  }

  async findOne(id: ChatMessage['id']): Promise<ChatMessage | null> {
    return await this.prisma.chatMessage.findUnique({
      where: {
        id,
      },
    });
  }

  async remove(
    where: Prisma.ChatMessageWhereUniqueInput,
  ): Promise<ChatMessage | null> {
    try {
      return await this.prisma.chatMessage.delete({
        where,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        // Registro no encontrado
        return null;
      }
      throw error;
    }
  }
}
