import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequest } from '../../../shared/types/request.interface';
import { UserDto } from '../dto/user.dto';

export const UserDecorator = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IRequest>();
    if (!request.user) return null;
    return UserDto.fromJwt(request.user);
  },
);
