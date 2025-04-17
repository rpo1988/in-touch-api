import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatMember } from '@prisma/client';
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

  async findAll(): Promise<ChatMember[]> {
    return await this.prisma.chatMember.findMany();
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
