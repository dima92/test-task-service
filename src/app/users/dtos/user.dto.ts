// ========================== validator ==========================
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

// ========================== entities & dto's ==========================
import { UserEntity } from '../entities/user.entity';
import { UUIDDto } from 'src/shared/dtos/uuid.dto';

// ========================== types ==========================
import { UserRoles } from 'src/shared/types/user-roles.enum';

// ========================== swagger ==========================
import { ApiProperty } from '@nestjs/swagger';

export class UserDto extends UUIDDto {
  @ApiProperty({
    example: 'test@test.com',
    description: 'Email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Elvis',
    description: 'Name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({
    example: 'Presley',
    description: 'Last name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({
    example: '23b36309',
    description: 'Image id',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageId?: string;

  @ApiProperty({ example: 1, description: 'Role id', required: false })
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @ApiProperty({ example: 'user', description: 'Role type', required: false })
  @IsOptional()
  @IsEnum(UserRoles)
  roleType?: UserRoles;

  public static fromEntity(entity: UserEntity): UserDto {
    return {
      id: entity.id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      created: entity.created.valueOf(),
      updated: entity.updated.valueOf(),
      imageId: entity.imageId,
      roleId: entity.roleId,
      roleType: entity.roleType,
    };
  }

  public static fromJwt(dto: UserDto): UserDto {
    if (!dto) {
      return;
    }

    const outputDto = new UserDto();
    outputDto.id = dto.id;
    outputDto.email = dto.email;
    outputDto.roleId = dto.roleId;
    outputDto.roleType = dto.roleType;
    outputDto.imageId = dto.imageId;

    return outputDto;
  }
}
