import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { AccessAndRefreshTokens } from '../token/token.interfaces';

export interface IUser {
  firstName: string;
  lastName: string;
  gender?: string;
  stack: string;
  email: string;
  password: string;
  hasDefaultPassword: boolean;
  role: string;
  isEmailVerified: boolean;
  image?: string;
  failedLoginAttempts: number;
  lockedOutTime: Date | null;
  invitationCode: string | undefined;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<
  IUser,
  | 'role'
  // | 'isEmailVerified'
  | 'hasDefaultPassword'
  // | 'image'
  | 'failedLoginAttempts'
  | 'lockedOutTime'
>;

export type NewCreatedUser = Omit<IUser, 'isEmailVerified' | 'hasDefaultPassword' | 'failedLoginAttempts' | 'lockedOutTime'>;

export interface IUserWithTokens {
  user: IUserDoc;
  tokens: AccessAndRefreshTokens;
}
