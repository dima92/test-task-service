import { IsString, MinLength } from 'class-validator';

// ========================== dto ==========================
import { UserDto } from 'src/app/users/dtos/user.dto';

// ========================== swagger ==========================
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
