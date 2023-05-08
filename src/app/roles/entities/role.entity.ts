import { Column, Entity, Index, OneToMany } from 'typeorm';

import { IdEntity } from '../../../shared/entities/id.entity';
import { User } from '../../user/entities/user.entity';

import { UserRoles } from '../../../shared/types/user-roles.enum';
import { UserPermissions } from '../../../shared/types/user-permissions.enum';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user_roles' })
export class Role extends IdEntity {
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

  @OneToMany(() => User, (user) => user.id)
  users?: User[];
}
