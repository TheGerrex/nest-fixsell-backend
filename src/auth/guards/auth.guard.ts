import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';
// import { Role } from '../interfaces/role'; // Import the Role enum

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private AuthService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('You are not authorized (no token)');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SEED,
      });

      const user = await this.AuthService.findUserById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }
      if (!user.isActive) {
        throw new UnauthorizedException('User is not active');
      }

      // Check if the user has the 'admin' role
      // if (!user.roles.some((role) => role.name === 'admin')) {
      //   throw new UnauthorizedException('User does not have admin privileges');
      // }

      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException('You are not authorized(Invalid token)');
    }

    console.log({ token });

    return Promise.resolve(true);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
