import { Request } from 'express';

// ========================== dto's ==========================
import { UserDto } from '../../app/users/dtos/user.dto';

export interface IRequest extends Request {
  user?: UserDto;
}
