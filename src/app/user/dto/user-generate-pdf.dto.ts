import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserGeneratePdfDto {
  @ApiProperty({
    example: 'test@test.com',
    description: 'Email',
    required: true,
  })
  @IsString()
  @IsEmail()
  email!: string;
}
