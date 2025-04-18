import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatMember } from '@prisma/client';
import {
  ChatListDetailResponseDto,
  ChatListResponseDto,
} from 'src/chat-list/dto/chat-list-response.dto';
import { ChatsService } from 'src/chats/chats.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';

@Injectable()
export class ChatMembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly chatsService: ChatsService,
  ) {}

  async create(createChatMemberDto: CreateChatMemberDto): Promise<ChatMember> {
    const { userId, chatId, isOwner } = createChatMemberDto;

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

    // TODO: Verificar que no hay más de 2 usuarios asociados al chat si no es un grupo

    // TODO: Verificar que hay al menos 1 propietario en el chat

    try {
      return await this.prisma.chatMember.create({
        data: {
          isOwner,
          userId,
          chatId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Error de unicidad en Prisma
        throw new ConflictException('User is already a member of this chat');
      }
      throw error;
    }
  }

  async findAll(filter?: {
    userId?: ChatMember['userId'];
  }): Promise<ChatMember[]> {
    return await this.prisma.chatMember.findMany(
      filter
        ? {
            where: {
              ...(filter.userId
                ? {
                    userId: filter.userId,
                  }
                : {}),
            },
          }
        : undefined,
    );
  }

  async findChatList(
    userId: ChatMember['userId'],
  ): Promise<ChatListResponseDto[]> {
    const data = await this.prisma.chatMember.findMany({
      where: { userId },
      select: {
        chat: {
          select: {
            id: true,
            isGroup: true,
            title: true,
            chatMembers: {
              select: {
                user: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            chatMessages: {
              select: {
                id: true,
                text: true,
                createdAt: true,
                user: { select: { id: true } },
                chatMessageStatus: { select: { id: true } },
              },
              orderBy: { createdAt: 'desc' },
              take: 1, // Último mensaje
            },
          },
        },
      },
    });
    const response: ChatListResponseDto[] = data.map((item) => ({
      chat: {
        id: item.chat.id,
        isGroup: item.chat.isGroup,
        title: item.chat.title,
      },
      members: item.chat.chatMembers.map((itemMember) => itemMember.user),
      lastMessages: (item.chat.chatMessages || []).map((itemMessage) => ({
        id: itemMessage.id,
        text: itemMessage.text,
        createdAt: itemMessage.createdAt,
        user: itemMessage.user,
        status: itemMessage.chatMessageStatus,
      })),
    }));
    return response;
  }

  async findChatListDetail(
    chatId: ChatMember['chatId'],
    userId: ChatMember['userId'],
  ): Promise<ChatListDetailResponseDto> {
    const data = await this.prisma.chatMember.findFirst({
      where: {
        chatId,
        userId,
      },
      select: {
        chat: {
          select: {
            id: true,
            isGroup: true,
            title: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            chatMembers: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    statusInfo: true,
                  },
                },
              },
            },
            chatMessages: {
              select: {
                id: true,
                text: true,
                createdAt: true,
                user: { select: { id: true, name: true } },
                chatMessageStatus: { select: { id: true, name: true } },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    if (!data) throw new NotFoundException(`Chat with ID ${chatId} not found`);

    const response: ChatListDetailResponseDto = {
      chat: {
        id: data.chat.id,
        isGroup: data.chat.isGroup,
        title: data.chat.title,
        description: data.chat.description,
        createdAt: data.chat.createdAt,
        updatedAt: data.chat.updatedAt,
      },
      members: data.chat.chatMembers.map((itemMember) => itemMember.user),
      lastMessages: (data.chat.chatMessages || []).map((itemMessage) => ({
        id: itemMessage.id,
        text: itemMessage.text,
        createdAt: itemMessage.createdAt,
        user: itemMessage.user,
        status: itemMessage.chatMessageStatus,
      })),
    };
    return response;
  }

  async findOne(id: ChatMember['id']): Promise<ChatMember | null> {
    return await this.prisma.chatMember.findUnique({
      where: {
        id,
      },
    });
  }

  async remove(id: ChatMember['id']): Promise<ChatMember | null> {
    try {
      return await this.prisma.chatMember.delete({
        where: {
          id,
        },
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
