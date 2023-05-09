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

// ========================== decorators ================================
import { AuthPermissionsGuard } from '../security/decorators/auth-permissions-guard.decorator';

// ========================== swagger ===================================
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// ========================== services & controllers ====================
import { RoleService } from './role.service';

// ========================== entities & dto's ==========================
import { RoleDto } from './dtos/role.dto';
import { RoleEntity } from './entities/role.entity';

// ========================== enums =====================================
import { UserPermissions } from '../../shared/types/user-permissions.enum';

@ApiTags('Roles controller')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  //=========== create new role ===========
  @Post()
  @AuthPermissionsGuard(UserPermissions.createRole)
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: RoleEntity,
  })
  @UsePipes(new ValidationPipe())
  async createRole(@Body() createRoleDto: RoleDto): Promise<RoleEntity> {
    return await this.roleService.createRole(createRoleDto);
  }

  //=========== get all roles ===========
  @Get()
  @AuthPermissionsGuard(UserPermissions.getAllRoles)
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: RoleEntity,
    isArray: true,
  })
  @UsePipes(new ValidationPipe())
  async getAllRoles(): Promise<RoleEntity[]> {
    return await this.roleService.getAll();
  }

  //=========== get role by id ===========
  @Get('/:id')
  @AuthPermissionsGuard(UserPermissions.getRoleById)
  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: RoleEntity,
  })
  @UsePipes(new ValidationPipe())
  async getRoleById(@Param('id') id: string): Promise<RoleEntity> {
    return await this.roleService.getRoleById(id);
  }

  //=========== delete role by id ===========
  @Delete('/:id')
  @AuthPermissionsGuard(UserPermissions.deleteRoleById)
  @ApiOperation({ summary: 'Delete role by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: RoleEntity,
  })
  @UsePipes(new ValidationPipe())
  async deleteRoleById(@Param('id') id: string): Promise<DeleteResult> {
    return await this.roleService.deleteRole(id);
  }

  //=========== update role by id ===========
  @Put('/:id')
  @AuthPermissionsGuard(UserPermissions.updateRoleById)
  @ApiOperation({ summary: 'Update role by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: RoleEntity,
    isArray: false,
  })
  @UsePipes(new ValidationPipe())
  async updateRoleById(
    @Param('id') id: string,
    @Body() roleDto: RoleDto,
  ): Promise<RoleEntity> {
    return await this.roleService.updateRole(id, roleDto);
  }
}
