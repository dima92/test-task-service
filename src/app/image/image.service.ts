import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ========================== entities ==========================
import { ImageEntity } from './entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  async uploadImage(image: Buffer, filename: string): Promise<ImageEntity> {
    const newImage = this.imageRepository.create({
      created: new Date(),
      updated: new Date(),
      filename,
      data: image,
    });

    return await this.imageRepository.save(newImage);
  }

  async getById(id: string): Promise<ImageEntity> {
    if (!id) throw new NotFoundException();

    const image = await this.imageRepository.findOneBy({ id });

    if (!image) throw new NotFoundException();

    return image;
  }
}
