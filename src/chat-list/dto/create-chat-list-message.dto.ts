import { ChatMessage } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatListMessageDto {
  @IsString()
  @IsNotEmpty()
  text: ChatMessage['text'];
}
