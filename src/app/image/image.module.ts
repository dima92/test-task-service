import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ========================== entities ==========================
import { ImageEntity } from './entities/image.entity';

// ========================== services & controllers ==========================
import { ImageService } from './image.service';
import { ImagesController } from './image.controller';

// ========================== modules ==========================
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity]), SecurityModule],
  controllers: [ImagesController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
