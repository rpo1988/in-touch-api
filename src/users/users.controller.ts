import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';

@UseGuards(AuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('excludeMe') excludeMe: string,
    @Session() session: any,
  ): Promise<User[]> {
    const isExcludeMe = excludeMe === 'true' || excludeMe === '1';
    const userId: User['id'] = session.userId;
    const response = await this.usersService.findAll(isExcludeMe, userId);

    return response || [];
  }

  @Get('me')
  async findMe(@Session() session: any): Promise<User> {
    const userId: User['id'] = session.userId;
    const response = await this.usersService.findOne(userId);

    if (!response)
      throw new NotFoundException(`User with ID ${userId} not found`);

    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: User['id']): Promise<User> {
    const response = await this.usersService.findOne(id);

    if (!response) throw new NotFoundException(`User with ID ${id} not found`);

    return response;
  }
}
