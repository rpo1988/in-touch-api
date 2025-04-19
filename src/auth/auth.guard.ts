import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.session.userId;
    if (!userId) {
      throw new UnauthorizedException(
        `User with ID ${userId} is not authenticated`,
      );
    }
    return true;
  }
}
