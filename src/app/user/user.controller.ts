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

import { AuthPermissionsGuard } from '../security/decorators/auth-permissions-guard.decorator';
import { UserDecorator } from './decorators/user.decorator';

import { User } from './entities/user.entity';
import { UserAssignRoleDto } from './dto/user-assigne-role.dto';
import { UserDto } from './dto/user.dto';
import { UserGeneratePdfDto } from './dto/user-generate-pdf.dto';

import { UserPermissions } from '../../shared/types/user-permissions.enum';

import { UserService } from './user.service';
import { ImageService } from '../image/image.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users controller')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly imageService: ImageService,
  ) {}

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

  @Get('/profile')
  @AuthPermissionsGuard(UserPermissions.getUserProfile)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: UserDto,
  })
  async getCurrentUser(@UserDecorator() user: UserDto): Promise<UserDto> {
    const userFromDB = await this.userService.getById(user.id);

    return UserDto.fromEntity(userFromDB);
  }

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
    @UserDecorator() user: UserDto,
    @Body() userDto: UserDto,
  ): Promise<UserDto> {
    const updatedUser = await this.userService.updateUserProfile(
      userDto,
      user.id,
    );

    return UserDto.fromEntity(updatedUser);
  }

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
    @UserDecorator() user: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserDto> {
    const updatedUser = await this.userService.addImage(
      user.id,
      file.buffer,
      file.originalname,
    );

    return UserDto.fromEntity(updatedUser);
  }

  @Get('/image')
  @AuthPermissionsGuard(UserPermissions.getUserProfile)
  @ApiOperation({ summary: 'Get current user image' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
  })
  async getCurrentUserImage(
    @UserDecorator() user: UserDto,
    @Res() response: Response,
  ) {
    const userFromDb = await this.userService.getById(user.id);
    const image = await this.imageService.getById(userFromDb.imageId);

    const stream = Readable.from(image.data);
    stream.pipe(response);
  }

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

  @Get('/pdf')
  @AuthPermissionsGuard(UserPermissions.getUserProfile)
  @ApiOperation({ summary: 'Get current user pdf' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
  })
  async getCurrentUserPdf(
    @UserDecorator() user: UserDto,
    @Res() response: Response,
  ) {
    const pdf = await this.userService.getPdf(user.id);

    const stream = Readable.from(pdf);
    stream.pipe(response);
  }

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

  @Delete('/:id')
  @AuthPermissionsGuard(UserPermissions.deleteUserById)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: User,
  })
  @UsePipes(new ValidationPipe())
  async deleteUserById(@Param('id') id: string): Promise<DeleteResult> {
    return await this.userService.deleteById(id);
  }
}
