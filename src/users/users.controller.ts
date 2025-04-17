import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    const response = await this.usersService.findAll();

    return response || [];
  }

  @Get(':id')
  async findOne(@Param('id') id: User['id']): Promise<User> {
    const response = await this.usersService.findOne(id);

    if (!response) throw new NotFoundException(`User with ID ${id} not found`);

    return response;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const response = await this.usersService.create(createUserDto);

    return response;
  }
}
