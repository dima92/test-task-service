import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ========================== entities ==================================
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from '../roles/entities/role.entity';
import { ImageEntity } from '../image/entities/image.entity';

// ========================== services & controllers ====================
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ImageService } from '../image/image.service';

// ========================== modules ===================================
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, ImageEntity]),
    SecurityModule,
  ],
  controllers: [UserController],
  providers: [UserService, ImageService],
  exports: [UserService],
})
export class UserModule {}
