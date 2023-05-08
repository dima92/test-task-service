import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRoles } from '../../../shared/types/user-roles.enum';
import { UserPermissions } from '../../../shared/types/user-permissions.enum';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({
    example: 'some role',
    description: 'Role name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: `admin`, description: 'Role type', required: true })
  @IsNotEmpty()
  @IsEnum(UserRoles)
  type: UserRoles;

  @ApiProperty({
    example: "['getAllUsers', 'assignUserRole']",
    description: 'Role permissions',
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(UserPermissions, { each: true })
  permissions: UserPermissions[];
}
