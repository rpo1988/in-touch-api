import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn(username: User['username']): Promise<User | null> {
    try {
      const user = await this.usersService.findOneByUsername(username);
      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    try {
      const user = await this.usersService.create({
        username: signUpDto.username,
        name: signUpDto.name,
        statusInfo: signUpDto.statusInfo || '',
      });
      return user;
    } catch (error) {
      console.error(error);
      if (error.code === 'P2002') {
        // Username duplicado
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }
}
