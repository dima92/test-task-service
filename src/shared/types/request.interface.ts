import { UserDto } from '../../app/user/dto/user.dto';

export interface IRequest extends Request {
  user?: UserDto;
}
