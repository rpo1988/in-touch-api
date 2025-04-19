import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateChatDto {
  @IsBoolean()
  isGroup: boolean;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  description?: string;
}
