import { Column, Entity } from 'typeorm';

// ========================== entities ==========================
import { UUIDEntity } from '../../../shared/entities/uuid.entity';

// ========================== swagger ==========================
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'images' })
export class ImageEntity extends UUIDEntity {
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
