import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Chat } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const isGroup = createChatDto.isGroup;
    const title = createChatDto.title?.trim() || null;
    const description = createChatDto.description?.trim() || null;

    // Validaciones funcionales
    if (isGroup) {
      // Validar que title esté presente y no vacío
      if (!title) {
        throw new BadRequestException('Title is required for group chats');
      }

      // Validar formato de title
      if (title.length < 3 || title.length > 50) {
        throw new BadRequestException(
          'Title must be between 3 and 50 characters',
        );
      }
    } else {
      // Para chats no grupales, ignorar title y description
      if (title || description) {
        throw new BadRequestException(
          'Title and description are only allowed for group chats',
        );
      }
    }

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

  async remove(id: Chat['id']): Promise<Chat | null> {
    try {
      return await this.prisma.chat.delete({
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
