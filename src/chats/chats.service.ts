import { ConflictException, Injectable } from '@nestjs/common';
import { Chat, Prisma } from '@prisma/client';
import { CreateChatListDto } from 'src/chat-list/dto/create-chat-list.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const isGroup = createChatDto.isGroup;
    const title = createChatDto.title?.trim() || null;
    const description = createChatDto.description?.trim() || null;

    try {
      return await this.prisma.chat.create({
        data: {
          isGroup,
          title,
          description,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Title duplicado
        throw new ConflictException('Title already exists');
      }
      throw error;
    }
  }

  async createWithMembers(
    createChatListDto: CreateChatListDto,
    userId: string,
  ): Promise<Chat> {
    const isGroup = createChatListDto.isGroup;
    const title = createChatListDto.title?.trim() || null;
    const description = createChatListDto.description?.trim() || null;
    const memberIds = createChatListDto.memberIds;

    try {
      // Create chat and chatMembers in a transaction
      return await this.prisma.$transaction(async (prisma) => {
        const chat = await prisma.chat.create({
          data: {
            isGroup,
            title,
            description,
            chatMembers: {
              create: memberIds.map((memberId) => ({
                userId: memberId,
                isOwner: !isGroup || memberId === userId, // Mark only creator as owner when it is a group
              })),
            },
          },
        });
        return chat;
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Title duplicado
        throw new ConflictException('Title already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Chat[]> {
    return await this.prisma.chat.findMany();
  }

  async findOne(id: Chat['id']): Promise<Chat | null> {
    return await this.prisma.chat.findUnique({
      where: {
        id,
      },
    });
  }

  async remove(
    where: Prisma.ChatWhereUniqueInput,
    include?: Prisma.ChatInclude,
  ): Promise<Chat | null> {
    try {
      return await this.prisma.chat.delete({
        where,
        include,
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
