import { Column, Entity, Index, OneToMany } from 'typeorm';

// ========================== entities ==================================
import { IDEntity } from '../../../shared/entities/id.entity';
import { UserEntity } from '../../users/entities/user.entity';

// ========================== enums ======================================
import { UserRoles } from '../../../shared/types/user-roles.enum';
import { UserPermissions } from '../../../shared/types/user-permissions.enum';

// ========================== swagger ====================================
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user_roles' })
export class RoleEntity extends IDEntity {
  @ApiProperty({ example: 'admin', description: 'Role type', required: true })
  @Index()
  @Column({ name: 'type', enum: UserRoles })
  type: UserRoles;

  @ApiProperty({
    example: 'some role',
    description: 'Role name',
    required: true,
  })
  @Index()
  @Column({ name: 'name' })
  name: string;

  @ApiProperty({
    example: "['getAllUsers', 'assignUserRole']",
    description: 'Role permissions',
    required: true,
  })
  @Column('text', { name: 'permissions', array: true })
  permissions: UserPermissions[];

  @OneToMany(() => UserEntity, (user) => user.id)
  users?: UserEntity[];
}
