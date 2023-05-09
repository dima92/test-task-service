import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ========================== bcrypt ==========================
//! This lib could be turned on in case it necessary to hash passwords
// import { compare, hashSync } from "bcrypt";

// ========================== entities & dto's ==========================
import { UserEntity } from '../users/entities/user.entity';
import { RoleEntity } from '../roles/entities/role.entity';
import { UserSignInDto } from './dtos/user-sign-in.dto';
import { TokenDto } from '../security/dtos/token.dto';
import { UserDto } from '../users/dtos/user.dto';

// ========================== enums =====================================
import { UserRoles } from '../../shared/types/user-roles.enum';

// ========================== services ====================
import { SecurityService } from '../security/security.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly securityService: SecurityService,
  ) {}

  // ========================== signUp ==============================
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

    // // Line below could be activited in case it neccessary to hash passwords
    // const hashPassword = await hashSync(dto.password, 5);

    const newUser = this.userRepository.create({
      created: new Date(),
      updated: new Date(),
      ...dto,
      roleType: role.type,
      role,
    });

    await this.userRepository.save(newUser);

    const token = this.securityService.generateJwt(newUser);
    return token;
  }

  // ========================== signIn ==============================
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

    // // Line below could be activited on in case it neccessary to hash passwords
    // const isPasswordCorrect = await compare(dto.password, userFromDB.password);
    const isPasswordCorrect = dto.password === userFromDB.password;

    if (!isPasswordCorrect) throw new UnauthorizedException();

    const token = this.securityService.generateJwt(userFromDB);

    return token;
  }
}
