import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Image } from './entities/image.entity';

import { ImageService } from './image.service';
import { ImagesController } from './image.controller';

import { SecurityModule } from '../security/security.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), SecurityModule],
  controllers: [ImagesController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
