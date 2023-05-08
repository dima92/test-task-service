import { IsEmail, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UserSignInDto {
  @ApiProperty({
    example: 'test@test.com',
    description: 'Email',
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password',
    description: 'Password to sign in',
    required: true,
  })
  @IsString()
  password!: string;
}
