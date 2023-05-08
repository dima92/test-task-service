import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { UserPermissions } from '../../../shared/types/user-permissions.enum';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function AuthPermissionsGuard(permissions: UserPermissions) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
