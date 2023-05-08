import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { AuthPermissionsGuard } from '../security/decorators/auth-permissions-guard.decorator';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RoleService } from './role.service';

import { RoleDto } from './dto/role.dto';
import { Role } from './entities/role.entity';

import { UserPermissions } from '../../shared/types/user-permissions.enum';

@ApiTags('Roles controller')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @AuthPermissionsGuard(UserPermissions.createRole)
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: Role,
  })
  @UsePipes(new ValidationPipe())
  async createRole(@Body() createRoleDto: RoleDto): Promise<Role> {
    return await this.roleService.createRole(createRoleDto);
  }

  @Get()
  @AuthPermissionsGuard(UserPermissions.getAllRoles)
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: Role,
    isArray: true,
  })
  @UsePipes(new ValidationPipe())
  async getAllRoles(): Promise<Role[]> {
    return await this.roleService.getAll();
  }

  @Get('/:id')
  @AuthPermissionsGuard(UserPermissions.getRoleById)
  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: Role,
  })
  @UsePipes(new ValidationPipe())
  async getRoleById(@Param('id') id: string): Promise<Role> {
    return await this.roleService.getRoleById(id);
  }

  @Delete('/:id')
  @AuthPermissionsGuard(UserPermissions.deleteRoleById)
  @ApiOperation({ summary: 'Delete role by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: Role,
  })
  @UsePipes(new ValidationPipe())
  async deleteRoleById(@Param('id') id: string): Promise<DeleteResult> {
    return await this.roleService.deleteRole(id);
  }

  @Put('/:id')
  @AuthPermissionsGuard(UserPermissions.updateRoleById)
  @ApiOperation({ summary: 'Update role by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: Role,
    isArray: false,
  })
  @UsePipes(new ValidationPipe())
  async updateRoleById(
    @Param('id') id: string,
    @Body() roleDto: RoleDto,
  ): Promise<Role> {
    return await this.roleService.updateRole(id, roleDto);
  }
}
