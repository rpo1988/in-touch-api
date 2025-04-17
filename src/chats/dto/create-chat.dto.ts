import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateChatDto {
  @IsBoolean()
  @IsNotEmpty()
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
