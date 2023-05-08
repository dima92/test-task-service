import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import jsPDF from 'jspdf';

import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { UserAssignRoleDto } from './dto/user-assigne-role.dto';
import { UserDto } from './dto/user.dto';

import { UserRoles } from '../../shared/types/user-roles.enum';
import { ImageService } from '../image/image.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly imageService: ImageService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException(`User does not exist`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async deleteById(id: string): Promise<DeleteResult> {
    const user = await this.getById(id);

    if (user.roleType === UserRoles.admin) {
      throw new HttpException(
        `It is not allowed to delete admin`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return await this.userRepository.delete(id);
  }

  async updateUserProfile(userDto: UserDto, id: string): Promise<User> {
    const usersByEmail = await this.userRepository.findBy({
      email: userDto.email,
    });

    if (
      usersByEmail?.length &&
      (usersByEmail.length > 1 || usersByEmail[0]?.id !== id)
    ) {
      throw new HttpException(
        `User with email: '${userDto.email}' already exists`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await this.getById(id);

    Object.assign(user, userDto);
    user.updated = new Date();

    return await this.userRepository.save(user);
  }

  async assignUserRole(
    assignUserRoleDto: UserAssignRoleDto,
    id: string,
  ): Promise<User> {
    const user = await this.getById(id);

    if (user.roleType === UserRoles.admin) {
      throw new HttpException(
        `It is not allowed to change admin role`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newRole = await this.roleRepository.findOneBy({
      name: assignUserRoleDto.newRoleName,
    });
    if (!newRole) {
      throw new HttpException(
        `Role '${assignUserRoleDto.newRoleName}' does not exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (newRole.type === UserRoles.admin) {
      throw new HttpException(
        `It is not allowed to assign admin role`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    user.updated = new Date();
    user.role = newRole;
    user.roleType = newRole.type;
    return await this.userRepository.save(user);
  }

  async addImage(id: string, image: Buffer, filename: string): Promise<User> {
    if (!image || !filename)
      throw new HttpException(
        'File is neccessary',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const savedImage = await this.imageService.uploadImage(image, filename);

    const user = await this.getById(id);
    user.updated = new Date();
    user.image = savedImage;

    return await this.userRepository.save(user);
  }

  async generatePdf(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new HttpException(
        `User does not exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const image = await this.imageService.getById(user.imageId);
    const sizeOf = require('buffer-image-size');
    const dimensions = sizeOf(image.data);
    const ratio = dimensions.height / dimensions.width;

    const pdf = new jsPDF({ format: 'a4' });
    pdf.text([user.firstName, user.lastName], 10, 10);
    pdf.addImage(
      image.data,
      image.filename.split('.')[1],
      100,
      10,
      100,
      100 * ratio,
    );

    user.pdf = Buffer.from(pdf.output('arraybuffer'));
    await this.userRepository.save(user);

    return true;
  }

  async getPdf(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user.pdf;
  }
}
