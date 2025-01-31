import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { Role } from '../roles/entities/role.entity';

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

    if (!user) {
      console.log('No user found in request');
      throw new ForbiddenException('No user found in request');
    }

    console.log('User Role:', user.role);

    if (!user.role) {
      throw new ForbiddenException('No role found for user');
    }

    const userRole: Role = user.role;

    const hasPermission = requiredPermissions.every(
      (perm) => userRole.permission[perm] === true,
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return hasPermission;
  }
}
