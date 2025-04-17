import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  statusId: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
