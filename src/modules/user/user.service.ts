/* eslint-disable no-param-reassign */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import User from './user.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedUser, UpdateUserBody, IUserDoc, NewRegisteredUser } from './user.interfaces';
import Invite from './user.invite.model';
import { emitEvent } from '../utils/emit-event';
// import { IInvite, IInviteDoc, IInviteStatus, UpdateInviteBody } from './user.invite.interfaces';
import { IInvite, IInviteDoc, UpdateInviteBody } from './user.invite.interfaces';
import generateInviteCode from '../utils/generate.invite.code';
import { tokenService } from '../token';
import { emailService } from '../email';
import cloudinary from 'cloudinary';

// ......

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
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  const resetPasswordToken = await tokenService.generateResetPasswordToken(user);
  emitEvent('admin_created', { email: user.email, token: resetPasswordToken });
  return user;
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

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, options);
  return users;
};
// ...........
/**
 * Query for invited users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryInvites = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  return await Invite.paginate(filter, options);
};

/**
 * Delete invite by id
 * @param {mongoose.Types.ObjectId} inviteId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteInviteById = async (inviteId: mongoose.Types.ObjectId): Promise<IInviteDoc | null> => {
  const invite = await getInviteById(inviteId);
  if (!invite) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invite not found');
  }
  await invite.remove();
  return invite;
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => User.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserDoc | null> => User.findOne({ email });

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (
  userId: mongoose.Types.ObjectId,
  updateBody: UpdateUserBody
): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteUserById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // @ts-ignore
  await cloudinary.v2.uploader.destroy(user?.image?.public_id);

  await user.remove();
  return user;
};

/**
 * Process single user invite
 * @param {IInviteDoc} payload
 * @returns {Promise<IInviteStatus>}
 */
export const inviteUser = async (payload: IInvite): Promise<IInviteDoc> => {
  const inviteData = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    stack: payload.stack,
    invitationCode: generateInviteCode(),
  };
  // create invite
  const invite = await Invite.create(inviteData);
  // send invite email
  await emailService.sendInvitemail(
    inviteData.email,
    inviteData.invitationCode,
    `${inviteData.firstName || ''} ${inviteData.lastName || ''}`,
    inviteData.stack
  );

  return invite;
};
