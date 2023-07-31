import { IUserDoc } from '../user/user.interfaces';

export interface ILogin extends IUserDoc {
  ipAddress: string;
  device: string;
}
