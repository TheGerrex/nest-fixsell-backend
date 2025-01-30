import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
// import { Role } from '../roles/entities/role.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('User:', user);
    console.log('Required Permissions:', requiredPermissions);
    console.log('User Permissions:', user?.permissions);

    if (!user || !user.permissions) {
      throw new ForbiddenException('No permissions found for user');
    }

    // Check user.permissions directly
    const hasPermission = requiredPermissions.every(
      (perm) => user.permissions[perm] === true,
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
