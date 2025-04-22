import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatMessageStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatStatusesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    id: ChatMessageStatus['id'],
  ): Promise<ChatMessageStatus | null> {
    try {
      return await this.prisma.chatMessageStatus.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
