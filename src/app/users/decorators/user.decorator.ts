// ========================== nest ===================================
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// ========================== dto's & types ==========================
import { IRequest } from '../../../shared/types/request.interface';
import { UserDto } from '../dtos/user.dto';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IRequest>();
    if (!request.user) return null;
    return UserDto.fromJwt(request.user);
  },
);
