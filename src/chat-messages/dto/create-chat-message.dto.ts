import { IsNotEmpty, IsString } from 'class-validator';
import { ChatMessageStatusId } from 'src/common/enums/chat-messages.enum';

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  statusId: ChatMessageStatusId;

  @IsString()
  @IsNotEmpty()
  text: string;
}
