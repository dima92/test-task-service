import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { Readable } from 'stream';

// ========================== decorators ==========================
import { AuthPermissionsGuard } from '../security/decorators/auth-permissions-guard.decorator';
import { User } from './decorators/user.decorator';

// ========================== entities & dto's ==========================
import { UserEntity } from './entities/user.entity';
import { UserAssignRoleDto } from './dtos/user-assigne-role.dto';
import { UserDto } from './dtos/user.dto';
import { UserGeneratePdfDto } from './dtos/user-generate-pdf.dto';

// ========================== enums ==========================
import { UserPermissions } from '../../shared/types/user-permissions.enum';

// ========================== services ==========================
import { UserService } from './user.service';
import { ImageService } from '../image/image.service';

// ========================== swagger ==========================
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users controller')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly imageService: ImageService,
  ) {}

  //=========== get all users ===========
  @Get()
  @AuthPermissionsGuard(UserPermissions.getAllUsers)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: UserDto,
    isArray: true,
  })
  async getAllUsers(): Promise<UserDto[]> {
    const usersFromDB = await this.userService.getAllUsers();
    return usersFromDB.map((user) => UserDto.fromEntity(user));
  }

  //=========== get current user profile ===========
  @Get('/profile')
  @AuthPermissionsGuard(UserPermissions.getUserProfile)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: UserDto,
  })
  async getCurrentUser(@User() user: UserDto): Promise<UserDto> {
    const userFromDB = await this.userService.getById(user.id);

    return UserDto.fromEntity(userFromDB);
  }

  //=========== update current user data ===========
  @Put('/profile')
  @AuthPermissionsGuard(UserPermissions.updateUserProfile)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: UserDto,
  })
  @UsePipes(new ValidationPipe())
  async updateUserProfile(
    @User() user: UserDto,
    @Body() userDto: UserDto,
  ): Promise<UserDto> {
    const updatedUser = await this.userService.updateUserProfile(
      userDto,
      user.id,
    );

    return UserDto.fromEntity(updatedUser);
  }

  //=========== upload current user image ===========
  @Post('/image')
  @AuthPermissionsGuard(UserPermissions.updateUserProfile)
  @ApiOperation({ summary: 'Upload current user image' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: UserDto,
  })
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImage(
    @User() user: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserDto> {
    const updatedUser = await this.userService.addImage(
      user.id,
      file.buffer,
      file.originalname,
    );

    return UserDto.fromEntity(updatedUser);
  }

  //=========== get current user image ===========
  @Get('/image')
  @AuthPermissionsGuard(UserPermissions.getUserProfile)
  @ApiOperation({ summary: 'Get current user image' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
  })
  async getCurrentUserImage(@User() user: UserDto, @Res() response: Response) {
    const userFromDb = await this.userService.getById(user.id);
    const image = await this.imageService.getById(userFromDb.imageId);

    const stream = Readable.from(image.data);
    stream.pipe(response);
  }

  //=========== generate current user pdf ===========
  @Post('/pdf')
  @AuthPermissionsGuard(UserPermissions.updateUserProfile)
  @ApiOperation({ summary: 'Generate current user pdf' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
  })
  async generateCurrentUserPdf(
    @Body() generatePdfDto: UserGeneratePdfDto,
  ): Promise<boolean> {
    return await this.userService.generatePdf(generatePdfDto.email);
  }

  //=========== get current user pdf ===========
  @Get('/pdf')
  @AuthPermissionsGuard(UserPermissions.getUserProfile)
  @ApiOperation({ summary: 'Get current user pdf' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
  })
  async getCurrentUserPdf(@User() user: UserDto, @Res() response: Response) {
    const pdf = await this.userService.getPdf(user.id);

    const stream = Readable.from(pdf);
    stream.pipe(response);
  }

  //=========== assign role to user by userId ===========
  @Post('/assign-role/:id')
  @AuthPermissionsGuard(UserPermissions.assignRoleById)
  @ApiOperation({ summary: 'Assign role to user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: UserDto,
  })
  @UsePipes(new ValidationPipe())
  async assignRoleById(
    @Body() assignUserRoleDto: UserAssignRoleDto,
    @Param('id') id: string,
  ): Promise<UserDto> {
    const updatedUser = await this.userService.assignUserRole(
      assignUserRoleDto,
      id,
    );

    return UserDto.fromEntity(updatedUser);
  }

  //=========== get user by id ===========
  @Get('/:id')
  @AuthPermissionsGuard(UserPermissions.getUserById)
  @ApiOperation({ summary: 'Get user by id (admin)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: UserDto,
  })
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    const userFromDB = await this.userService.getById(id);

    return UserDto.fromEntity(userFromDB);
  }

  //=========== delete user by id ===========
  @Delete('/:id')
  @AuthPermissionsGuard(UserPermissions.deleteUserById)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: UserEntity,
  })
  @UsePipes(new ValidationPipe())
  async deleteUserById(@Param('id') id: string): Promise<DeleteResult> {
    return await this.userService.deleteById(id);
  }
}
