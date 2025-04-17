import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Chat } from '@prisma/client';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('api/chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  async findAll(): Promise<Chat[]> {
    const response = await this.chatsService.findAll();

    return response || [];
  }

  @Get(':id')
  async findOne(@Param('id') id: Chat['id']): Promise<Chat> {
    const response = await this.chatsService.findOne(id);

    if (!response) throw new NotFoundException(`Chat with ID ${id} not found`);

    return response;
  }

  @Post()
  async create(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    const response = await this.chatsService.create(createChatDto);

    return response;
  }

  @Delete(':id')
  async remove(@Param('id') id: Chat['id']): Promise<Chat['id']> {
    const response = await this.chatsService.remove(id);

    if (!response) throw new NotFoundException(`Chat with ID ${id} not found`);

    return response.id;
  }
}
