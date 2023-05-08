import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { UuidEntity } from '../../../shared/entities/uuid.entity';
import { Role } from '../../roles/entities/role.entity';
import { Image } from '../../image/entities/image.entity';

import { UserRoles } from '../../../shared/types/user-roles.enum';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User extends UuidEntity {
  @ApiProperty({
    example: 'user@test.com',
    description: 'Email',
    required: true,
  })
  @Index()
  @Column({ name: 'email' })
  email!: string;

  @ApiProperty({
    example: 'password',
    description: 'Password',
    required: true,
  })
  @Column({ name: 'password' })
  password!: string;

  @ApiProperty({
    example: 'Ivan',
    description: 'Name',
    required: true,
  })
  @Column({ name: 'first_name' })
  firstName!: string;

  @ApiProperty({
    example: 'Ivanov',
    description: 'Last name',
    required: true,
  })
  @Column({ name: 'last_name' })
  lastName!: string;

  @ApiProperty({
    description: 'User image',
    required: false,
  })
  @Column({ name: 'image_id', nullable: true })
  imageId?: string;

  @ApiProperty({
    description: 'Pdf data',
    required: false,
  })
  @Column({ name: 'pdf', nullable: true, type: 'bytea' })
  pdf?: Uint8Array;

  @ApiProperty({ example: 1, description: 'Role id', required: true })
  @Column({ name: 'role_id' })
  roleId: number;

  @ApiProperty({ example: 'user', description: 'Role type', required: true })
  @Index()
  @Column({ name: 'role_type' })
  roleType: UserRoles;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToOne(() => Image, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  image?: Image;
  user: ArrayBuffer;
}
