import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ChatMembersService } from 'src/chat-members/chat-members.service';
import { ChatListResponseDto } from './dto/chat-list-response.dto';

@Injectable()
export class ChatListService {
  constructor(private readonly chatMembersService: ChatMembersService) {}

  async findAll(userId: User['id']): Promise<ChatListResponseDto[]> {
    const response = await this.chatMembersService.findChatList(userId);

    return response;
  }
}
