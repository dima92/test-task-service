import { IsString, MinLength } from 'class-validator';

import { UserDto } from '../../user/dto/user.dto';

import { ApiProperty } from '@nestjs/swagger';

export class UserSignUpDto extends UserDto {
  @ApiProperty({
    example: 'password',
    description: 'Password',
    required: true,
  })
  @IsString()
  @MinLength(5)
  password: string;
}
