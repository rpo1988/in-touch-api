import { User } from '@prisma/client';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateChatDto } from 'src/chats/dto/create-chat.dto';

export class CreateChatListDto extends CreateChatDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  memberIds: User['id'][];
}
