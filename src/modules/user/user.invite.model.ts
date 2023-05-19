import mongoose from 'mongoose';
import validator from 'validator';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IInviteDoc, IInviteModel } from './user.invite.interfaces';
import { roles } from '../../config/roles';

const inviteSchema = new mongoose.Schema<IInviteDoc, IInviteModel>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    stack: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    invitationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
inviteSchema.plugin(toJSON);
inviteSchema.plugin(paginate);

const Invite = mongoose.model<IInviteDoc, IInviteModel>('Invite', inviteSchema);

export default Invite;
