import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

// ========================== dto & enum ==========================
import { UserSignInDto } from './dto/user-sign-in.dto';
import { TokenDto } from '../security/dto/token.dto';
import { UserDto } from '../user/dto/user.dto';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserPermissions } from '../../shared/types/user-permissions.enum';

import { AuthService } from './auth.service';
import { SecurityService } from '../security/security.service';

import { AuthPermissionsGuard } from '../security/decorators/auth-permissions-guard.decorator';
import { UserDecorator } from '../user/decorators/user.decorator';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly securityService: SecurityService,
  ) {}

  @Post('/sign-up')
  @ApiOperation({ summary: 'Sign up with email, password and other' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: TokenDto,
  })
  @UsePipes(new ValidationPipe())
  async signUp(@Body() userSignUpDto: UserSignUpDto): Promise<TokenDto> {
    return await this.authService.signUp(userSignUpDto);
  }

  @Post('/sign-in')
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: TokenDto,
  })
  @UsePipes(new ValidationPipe())
  async signIn(@Body() userSignIn: UserSignInDto): Promise<TokenDto> {
    return await this.authService.signIn(userSignIn);
  }

  @Get('/refresh-token')
  @AuthPermissionsGuard(UserPermissions.refreshToken)
  async refreshToken(@UserDecorator() currentUser: UserDto): Promise<TokenDto> {
    const user = await this.securityService.getUserWithRole(currentUser.id);

    return this.securityService.generateJwt(user);
  }
}
