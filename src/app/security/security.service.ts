import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

import { UserDto } from '../user/dto/user.dto';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class SecurityService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  generateJwt(user: User): TokenDto {
    const payload = UserDto.fromEntity(user);
    const token = this.jwtService.sign(payload);
    return { token };
  }

  async getUserWithRole(id: string): Promise<User> {
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
