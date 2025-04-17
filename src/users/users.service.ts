import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          username: createUserDto.username.trim(),
          name: createUserDto.name,
          statusInfo: createUserDto.statusInfo || '',
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
