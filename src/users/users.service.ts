import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(excludeMe: boolean, userId: User['id']): Promise<User[]> {
    try {
      const response = await this.prisma.user.findMany();
      return excludeMe
        ? response.filter((item) => item.id !== userId)
        : response;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: User['id']): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneByUsername(username: User['username']): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          username,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async create(
    user: Pick<User, 'username' | 'name' | 'statusInfo'>,
  ): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          username: user.username.trim(),
          name: user.name,
          statusInfo: user.statusInfo || '',
        },
      });
    } catch (error) {
      console.error(error);
      if (error.code === 'P2002') {
        // Error de unicidad en Prisma
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }
}
