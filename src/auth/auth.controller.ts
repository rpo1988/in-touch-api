import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  Session,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Session() session: any,
  ): Promise<User> {
    const { username } = signInDto;
    const user = await this.authService.signIn(username);

    if (!user) throw new NotFoundException(`Username ${username} not found`);

    // Almacenar el ID del usuario en la sesión
    session.userId = user.id;

    return user;
  }

  @Post('signout')
  @HttpCode(204)
  signOut(@Session() session: any): void {
    // Remove session cookie
    session.destroy();
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    const user = await this.authService.signUp(signUpDto);

    return user;
  }
}
