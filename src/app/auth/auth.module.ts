// ========================== nest ==========================
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ========================== entities ==========================
import { UserEntity } from '../users/entities/user.entity';
import { RoleEntity } from '../roles/entities/role.entity';

// ========================== srvices & controllers ====================
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// ========================== modules ===================================
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]), SecurityModule],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
