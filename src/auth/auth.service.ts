import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn(username: User['username']): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);

    return user;
  }
}
