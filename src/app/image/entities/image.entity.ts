import { Column, Entity } from 'typeorm';

import { UuidEntity } from '../../../shared/entities/uuid.entity';

import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'images' })
export class Image extends UuidEntity {
  @ApiProperty({
    example: 'awesome avatar',
    description: 'Image file name',
    required: true,
  })
  @Column({ name: 'filename' })
  filename!: string;

  @ApiProperty({
    description: 'Image file',
    required: true,
  })
  @Column({
    name: 'data',
    type: 'bytea',
  })
  data!: Uint8Array;
}
