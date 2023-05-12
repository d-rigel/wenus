/* eslint-disable no-param-reassign */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import User from './user.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedUser, UpdateUserBody, IUserDoc, NewRegisteredUser } from './user.interfaces';
import Invite from './user.invite.model';
import { IInvite, IInviteDoc, IInviteStatus, UpdateInviteBody } from './user.invite.interfaces';

/**
 * Get invite by code or email
 * @param {{ code: string; email: string }} payload
 * @returns {Promise<IInviteDoc | null>}
 */
export const getInvite = async (payload: { code?: string; email?: string }): Promise<IInviteDoc | null> =>
  Invite.findOne({ $or: [{ invitationCode: payload.code }, { email: payload.email }] });

/**
 * Get invite by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IInviteDoc | null>}
 */
export const getInviteById = async (id: mongoose.Types.ObjectId): Promise<IInviteDoc | null> => Invite.findById(id);

/**
 * Update invite by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateInviteById = async (
  inviteId: mongoose.Types.ObjectId,
  updateBody: UpdateInviteBody
): Promise<IInviteDoc | null> => {
  const invite = await getInviteById(inviteId);
  if (!invite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invite not found');
  }
  Object.assign(invite, updateBody);
  await invite.save();
  return invite;
};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (userBody.invitationCode) {
    const invite = await getInvite({ code: userBody.invitationCode });
    if (invite && invite.isUsed) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invite for this user has been used');
    } else if (invite) {
      await updateInviteById(invite?.id, { isUsed: true });
      // bypass email verification for invited users
      userBody.isEmailVerified = true;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invite code is invalid');
    }
  }
  return User.create(userBody);
};
