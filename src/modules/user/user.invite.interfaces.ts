import { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IInvite {
  firstName: string;
  lastName: string;
  email: string;
  invitationCode: string;
  stack: string;
  role?: string;
  isUsed?: boolean;
  state: string;
}

export interface IInviteDoc extends IInvite, Document {}

export interface IInviteModel extends Model<IInviteDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateInviteBody = Partial<IInvite>;

export type NewRegisteredInvite = Omit<IInvite, 'role'>;

export interface IInviteStatus {
  uploadStatus: string;
  inviteStatus: string;
  totalInvites: number;
  totalInvitesSent: number;
  failedInvites: number;
  failedInvitesList: {
    email: string;
    name: string;
    reason?: string;
  }[];
}

// export interface IInviteExcelRow extends IInvite {
//   'First Name': string;
//   'Last Name': string;
//   'Email Address': string;
//   State: string;
//   Position: string;
//   Institution: string;
//   Election: string;
//   Opening: string;
// }
