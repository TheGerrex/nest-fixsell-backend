import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../public.decorator'; // Adjust the path if necessary

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector, // Inject Reflector
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // Allow access if the route is public
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log('No token found');
      throw new UnauthorizedException('You are not authorized (no token)');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SEED,
      });

      const user = await this.authService.findUserById(payload.id);
      if (!user) {
        console.log('User does not exist');
        throw new UnauthorizedException('User does not exist');
      }
      if (!user.isActive) {
        console.log('User is not active');
        throw new UnauthorizedException('User is not active');
      }
      request['user'] = user; // Ensure user is set on the request object
      console.log('User set in AuthGuard:', user); // Log the user
    } catch (error) {
      console.log('Invalid token');
      throw new UnauthorizedException('You are not authorized (Invalid token)');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
