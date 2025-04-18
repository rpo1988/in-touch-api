import { Injectable } from '@nestjs/common';
import { ChatMessageStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatStatusesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(
    id: ChatMessageStatus['id'],
  ): Promise<ChatMessageStatus | null> {
    return await this.prisma.chatMessageStatus.findUnique({
      where: {
        id,
      },
    });
  }
}
