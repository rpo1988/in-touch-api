import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn(username: User['username']): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);

    return user;
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const user = await this.usersService.create({
      username: signUpDto.username,
      name: signUpDto.name,
      statusInfo: signUpDto.statusInfo || '',
    });

    return user;
  }
}
