import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ChatMember } from '@prisma/client';
import { ChatMembersService } from './chat-members.service';
import { CreateChatMemberDto } from './dto/create-chat-member.dto';

@Controller('api/chat-members')
export class ChatMembersController {
  constructor(private readonly chatMembersService: ChatMembersService) {}

  @Get()
  async findAll(): Promise<ChatMember[]> {
    const response = await this.chatMembersService.findAll();

    return response || [];
  }

  @Get(':id')
  async findOne(@Param('id') id: ChatMember['id']): Promise<ChatMember> {
    const response = await this.chatMembersService.findOne(id);

    if (!response)
      throw new NotFoundException(`Chat member with ID ${id} not found`);

    return response;
  }

  @Post()
  async create(
    @Body() createChatMemberDto: CreateChatMemberDto,
  ): Promise<ChatMember> {
    const response = await this.chatMembersService.create(createChatMemberDto);

    return response;
  }

  @Delete(':id')
  async remove(@Param('id') id: ChatMember['id']): Promise<ChatMember['id']> {
    const response = await this.chatMembersService.remove(id);

    if (!response)
      throw new NotFoundException(`Chat member with ID ${id} not found`);

    return response.id;
  }
}
