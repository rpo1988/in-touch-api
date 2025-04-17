import { Injectable } from '@nestjs/common';
import { ChatStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatStatusesService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: ChatStatus['id']): Promise<ChatStatus | null> {
    return await this.prisma.chatStatus.findUnique({
      where: {
        id,
      },
    });
  }
}
