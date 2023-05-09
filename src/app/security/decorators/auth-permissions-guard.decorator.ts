import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

// ========================== enums ==================================
import { UserPermissions } from '../../../shared/types/user-permissions.enum';

// ========================== custom guards ==========================
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

/*  
AuthPermissionsGuard set metadata such as 'permissions' 
  and calls two guards - JwtAuthGuard and RolesGuard.  
*/

export function AuthPermissionsGuard(permissions: UserPermissions) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
