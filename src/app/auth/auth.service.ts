import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserSignInDto } from './dto/user-sign-in.dto';
import { TokenDto } from '../security/dto/token.dto';
import { UserDto } from '../user/dto/user.dto';

import { UserRoles } from '../../shared/types/user-roles.enum';

import { SecurityService } from '../security/security.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly securityService: SecurityService,
  ) {}

  async signUp(dto: UserDto): Promise<TokenDto> {
    const userFromDB = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (userFromDB)
      throw new HttpException(
        `User '${dto.email}' already exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const role = await this.roleRepository.findOneBy({ type: UserRoles.user });

    const newUser = this.userRepository.create({
      created: new Date(),
      updated: new Date(),
      ...dto,
      roleType: role.type,
      role,
    });

    await this.userRepository.save(newUser);

    return this.securityService.generateJwt(newUser);
  }

  async signIn(dto: UserSignInDto): Promise<TokenDto> {
    const userFromDB = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
      relations: ['role'],
    });

    if (!userFromDB) {
      throw new HttpException(
        `User ${dto.email} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordCorrect = dto.password === userFromDB.password;

    if (!isPasswordCorrect) throw new UnauthorizedException();

    return this.securityService.generateJwt(userFromDB);
  }
}
