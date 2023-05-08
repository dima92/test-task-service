import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UuidDto } from '../../../shared/dto/uuid.dto';
import { User } from '../entities/user.entity';
import { UserRoles } from '../../../shared/types/user-roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto extends UuidDto {
  @ApiProperty({
    example: 'admin@test.com',
    description: 'Email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Ivan',
    description: 'Name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({
    example: 'Ivanov',
    description: 'Last name',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({
    example: '12a45673',
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

  public static fromEntity(entity: User): UserDto {
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
