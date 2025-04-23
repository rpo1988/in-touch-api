import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: User['username']): Promise<{ access_token: string }> {
    try {
      const user = await this.usersService.findOneByUsername(username);

      if (!user) throw new NotFoundException(`Username ${username} not found`);

      const payload = { sub: user.id, username: user.username };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
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
