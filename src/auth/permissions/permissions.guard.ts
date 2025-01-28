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

    console.log('PermissionsGuard - User:', user);
    console.log(
      'PermissionsGuard - Required Permissions:',
      requiredPermissions,
    );

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    if (!user.role) {
      // Changed from user.roles
      throw new ForbiddenException('No role found for user');
    }

    const userRole: Role = user.role; // Changed from const userRoles: Role[] = user.roles;

    const hasPermission = requiredPermissions.every(
      (perm) => userRole.permission[perm] === true,
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
