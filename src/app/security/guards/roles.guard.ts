import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SecurityService } from '../security.service';

import { UserPermissions } from '../../../shared/types/user-permissions.enum';
import { IRequest } from '../../../shared/types/request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly securityService: SecurityService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<UserPermissions>(
      'permissions',
      context.getHandler(),
    );

    if (!permissions) return true;

    const request = context.switchToHttp().getRequest<IRequest>();

    const user = await this.securityService.getUserWithRole(request.user.id);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    if (user.role.type === 'admin') return true;

    const userPermissions = user.role.permissions;

    if (!userPermissions.length) {
      throw new UnauthorizedException();
    }

    if (userPermissions.includes(permissions)) return true;

    if (userPermissions.includes(UserPermissions.all)) return true;

    throw new UnauthorizedException();
  }
}
