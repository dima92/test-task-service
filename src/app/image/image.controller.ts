import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Readable } from 'stream';
import { Response } from 'express';

import { ImageService } from './image.service';

import { AuthPermissionsGuard } from '../security/decorators/auth-permissions-guard.decorator';

import { UserPermissions } from 'src/shared/types/user-permissions.enum';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Images controller')
@Controller('images')
export class ImagesController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/:id')
  @AuthPermissionsGuard(UserPermissions.getUserById)
  @ApiOperation({ summary: "Get image by it's id (admin)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
  })
  async getImageById(@Res() response: Response, @Param('id') id: string) {
    const image = await this.imageService.getById(id);

    const stream = Readable.from(image.data);
    stream.pipe(response);
  }
}
