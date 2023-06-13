import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Token from '../token/token.model';
import ApiError from '../errors/ApiError';
import tokenTypes from '../token/token.types';
import { getUserByEmail, getUserById, updateUserById } from '../user/user.service';
import { IUserDoc, IUserWithTokens } from '../user/user.interfaces';
import { generateAuthTokens, verifyConfirmationToken, verifyToken } from '../token/token.service';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (user && user.failedLoginAttempts > 2 && user.lockedOutTime) {
    const lockedOutTime = user.lockedOutTime.getTime();
    const endOfLockTime = lockedOutTime + 30 * 60 * 1000;
    if (new Date().getTime() < endOfLockTime) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        `Your account is locked, you have exceeded your failed login attempts. Please try again in ${Math.round(
          (((endOfLockTime - new Date().getTime()) % 86400000) % 3600000) / 60000
        )} mins`
      );
    }
  }
  if (!user || !(await user.isPasswordMatch(password))) {
    if (user) {
      const failedLoginAttempts = user.failedLoginAttempts + 1;
      await updateUserById(user.id, { failedLoginAttempts });
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (user.hasDefaultPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You need to reset your password');
  }
  await updateUserById(user.id, { failedLoginAttempts: 0, lockedOutTime: null });
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await getUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await updateUserById(user.id, { password: newPassword, hasDefaultPassword: false });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Change password
 * @param {string} newPassword
 * * @param {string} userId
 * @returns {Promise<void>}
 */
export const changePassword = async (newPassword: string, currentPassword: string, userId: string): Promise<void> => {
  try {
    const user = await getUserById(new mongoose.Types.ObjectId(userId));
    if (!user || !(await user.isPasswordMatch(currentPassword))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password is wrong');
    }
    await updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Password update failed:: ${error}`);
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmail = async (verifyEmailToken: any, userId: any, code: string): Promise<IUserDoc> => {
  try {
    const tokenDoc = await verifyConfirmationToken(verifyEmailToken, userId, code, tokenTypes.VERIFY_EMAIL);
    const user = await getUserById(new mongoose.Types.ObjectId(tokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    const updatedUser = await updateUserById(user.id, { isEmailVerified: true });
    if (!updatedUser) {
      throw new Error();
    }
    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
