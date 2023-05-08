import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { SecurityModule } from '../security/security.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), SecurityModule],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
