import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// ========================== repository & entities ==========================
import { UserEntity } from '../users/entities/user.entity';
import { RoleEntity } from '../roles/entities/role.entity';

// ========================== dto ==========================
import { UserDto } from '../users/dtos/user.dto';
import { TokenDto } from './dtos/token.dto';

@Injectable()
export class SecurityService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly jwtService: JwtService,
  ) {}

  generateJwt(user: UserEntity): TokenDto {
    const payload = UserDto.fromEntity(user);
    const token = this.jwtService.sign(payload);
    return { token };
  }

  async getUserWithRole(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['role'],
    });

    if (!user) {
      throw new HttpException(`User does not exist`, HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
