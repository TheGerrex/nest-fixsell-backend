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
    console.log('User Roles:', user.roles);

    if (!user || !user.roles) {
      throw new ForbiddenException('No roles found for user');
    }

    const userRoles: Role[] = user.roles;

    const hasPermission = userRoles.some((role) => {
      const permission = role.permission;
      return requiredPermissions.every((perm) => permission[perm] === true);
    });

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return hasPermission;
  }
}
