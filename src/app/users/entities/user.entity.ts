import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

// ========================== entities ==========================
import { UUIDEntity } from '../../../shared/entities/uuid.entity';
import { RoleEntity } from '../../roles/entities/role.entity';
import { ImageEntity } from '../../image/entities/image.entity';

// ========================== enums ==========================
import { UserRoles } from '../../../shared/types/user-roles.enum';

// ========================== swagger ==========================
import { ApiProperty } from '@nestjs/swagger';
import { Blob } from 'buffer';

@Entity({ name: 'users' })
export class UserEntity extends UUIDEntity {
  @ApiProperty({
    example: 'test@test.com',
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
    example: 'Elvis',
    description: 'Name',
    required: true,
  })
  @Column({ name: 'first_name' })
  firstName!: string;

  @ApiProperty({
    example: 'Presley',
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

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @OneToOne(() => ImageEntity, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  image?: ImageEntity;
  user: ArrayBuffer;
}
