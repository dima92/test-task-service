import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAssignRoleDto {
  @ApiProperty({
    example: 'default_user',
    description: 'Role name',
  })
  @IsNotEmpty()
  @IsString()
  newRoleName: string;
}
