import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChatMessage } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ChatMessagesService } from 'src/chat-messages/chat-messages.service';
import { CreateChatMessageDto } from 'src/chat-messages/dto/create-chat-message.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/chat-messages')
export class ChatMessagesController {
  constructor(private readonly chatMessagesService: ChatMessagesService) {}

  @Get()
  async findAll(): Promise<ChatMessage[]> {
    const response = await this.chatMessagesService.findAll();

    return response || [];
  }

  @Get(':id')
  async findOne(@Param('id') id: ChatMessage['id']): Promise<ChatMessage> {
    const response = await this.chatMessagesService.findOne(id);

    if (!response)
      throw new NotFoundException(`Chat message with ID ${id} not found`);

    return response;
  }

  @Post()
  async create(
    @Body() createChatMessageDto: CreateChatMessageDto,
  ): Promise<ChatMessage> {
    const response =
      await this.chatMessagesService.create(createChatMessageDto);

    return response;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: ChatMessage['id'],
  ): Promise<Pick<ChatMessage, 'id'>> {
    const response = await this.chatMessagesService.remove({
      id,
    });

    if (!response)
      throw new NotFoundException(`Chat message with ID ${id} not found`);

    return { id };
  }
}
