import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateChatMemberDto {
  @IsBoolean()
  isOwner: boolean;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  chatId: string;
}
