import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: User['id']): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByUsername(username: User['username']): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
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
      if (error.code === 'P2002') {
        // Error de unicidad en Prisma
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }
}
