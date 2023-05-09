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
import { UserSignInDto } from './dtos/user-sign-in.dto';
import { TokenDto } from '../security/dtos/token.dto';
import { UserDto } from '../users/dtos/user.dto';
import { UserSignUpDto } from './dtos/user-sign-up.dto';
import { UserPermissions } from '../../shared/types/user-permissions.enum';

// ========================== services ====================
import { AuthService } from './auth.service';
import { SecurityService } from '../security/security.service';

// ========================== decorators ====================
import { AuthPermissionsGuard } from '../security/decorators/auth-permissions-guard.decorator';
import { User } from '../users/decorators/user.decorator';

// ========================== swagger ==========================
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
  async refreshToken(@User() currentUser: UserDto): Promise<TokenDto> {
    const user = await this.securityService.getUserWithRole(currentUser.id);

    return this.securityService.generateJwt(user);
  }
}
