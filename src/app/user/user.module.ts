import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ImageService } from '../image/image.service';
import { UserController } from './user.controller';
import { SecurityModule } from '../security/security.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Image } from '../image/entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Image]), SecurityModule],
  controllers: [UserController],
  providers: [UserService, ImageService],
  exports: [UserService],
})
export class UserModule {}
