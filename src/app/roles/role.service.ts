import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

// ========================== dto's & types ==========================
import { RoleDto } from './dtos/role.dto';
import { UserRoles } from '../../shared/types/user-roles.enum';

// ========================== entities ===============================
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async createRole(createRoleDto: RoleDto): Promise<RoleEntity> {
    const existedRole = await this.roleRepository.findOneBy({
      name: createRoleDto.name,
    });

    if (existedRole) {
      throw new HttpException(
        `Role '${createRoleDto.name}' already exists`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (createRoleDto.type === UserRoles.superadmin) {
      throw new HttpException(
        `It is not allowed to create roles with superadmin type`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newRole = this.roleRepository.create({
      created: new Date(),
      updated: new Date(),
      name: createRoleDto.name,
      type: createRoleDto.type,
      permissions: createRoleDto.permissions,
    });

    return await this.roleRepository.save(newRole);
  }

  async getAll(): Promise<RoleEntity[]> {
    return await this.roleRepository.find();
  }

  async getRoleById(id: string): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneBy({ id: +id });

    if (!role) {
      throw new HttpException(`Role does not exist`, HttpStatus.BAD_REQUEST);
    }

    return role;
  }

  async deleteRole(id: string): Promise<DeleteResult> {
    const role = await this.roleRepository.findOneBy({ id: +id });

    if (role.type === UserRoles.superadmin) {
      throw new HttpException(
        `It is not allowed to delete superadmin role`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.roleRepository.delete({ id: +id });
  }

  async updateRole(id: string, roleDto: RoleDto): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneBy({ id: +id });

    if (!role) {
      throw new HttpException(`Role does not exist`, HttpStatus.BAD_REQUEST);
    }

    // check if role with name that supposed to be assigned already exists
    const rolesByName = await this.roleRepository.findBy({
      name: roleDto.name,
    });
    if (
      rolesByName?.length &&
      (rolesByName.length > 1 || rolesByName[0]?.id !== +id)
    ) {
      throw new HttpException(
        `Role with name '${roleDto.name}' already exists`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    Object.assign(role, roleDto);
    role.updated = new Date();
    return await this.roleRepository.save(role);
  }
}
