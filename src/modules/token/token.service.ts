import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import config from '../../config/config';
import Token from './token.model';
import ApiError from '../errors/ApiError';
import tokenTypes from './token.types';
import { AccessAndRefreshTokens, ITokenDoc } from './token.interfaces';
import { IUserDoc } from '../user/user.interfaces';
import User from '../user/user.model';
import { roles } from '../../config/roles';
import { logger } from '../logger';
import generateCode from '../utils/generate-code';

/**
 * Generate token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Generate email verification code
 * @param {mongoose.Types.ObjectId} userId
 * @returns {number}
 */
export const generateConfirmationToken = async (userId: mongoose.Types.ObjectId): Promise<string> => {
  const code = generateCode();
  const existCode = await Token.findOne({ user: userId, confirmationCode: code });
  if (existCode && existCode.confirmationCode) {
    return generateConfirmationToken(userId);
  }
  if (code.length < 6 || code.length > 6) {
    return generateConfirmationToken(userId);
  }
  return code;
};

/**
 * Save a token
 * @param {string} token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
export const saveToken = async (
  token: string | number,
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  confirmationCode?: string,
  blacklisted: boolean = false
): Promise<ITokenDoc> => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
    confirmationCode: confirmationCode || null,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
export const verifyToken = async (token: string, type: string): Promise<ITokenDoc> => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (typeof payload.sub !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'bad user');
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {IUserDoc} user
 * @returns {Promise<AccessAndRefreshTokens>}
 */
export const generateAuthTokens = async (user: IUserDoc): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (user: IUserDoc): Promise<string> => {
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {IUserDoc} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user: IUserDoc): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

/**
 * Get hold of system token
 * @returns {Promise<string>}
 *
 */
export const holdSystemToken = async (role?: string): Promise<string | void> => {
  try {
    const userOne = {
      _id: new mongoose.Types.ObjectId(),
      name: faker.name.findName(),
      email: 'alozie4God@gmail.com',
      password: faker.internet.password(),
      role: roles.includes(role?.toLowerCase() as string) ? role : 'superAdmin',
      isEmailVerified: false,
      //   mobileNumber: faker.phone.phoneNumber(),
      userName: faker.name.findName(),
      hasDefaultPassword: false,
    };

    const salt = bcrypt.genSaltSync(8);
    const hashedPassword = bcrypt.hashSync(userOne.password, salt);
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

    const userOneAccessToken = generateToken(userOne._id, accessTokenExpires, tokenTypes.ACCESS);

    const insertUsers = async (users: Record<string, any>[]) => {
      await User.insertMany(users.map((user) => ({ ...user, password: hashedPassword })));
    };

    await insertUsers([userOne]);

    return userOneAccessToken;
  } catch (error) {
    logger.info('System token currently in use');
  }
};

/**
 * Release system token
 * @returns {Promise<string>}
 *
 */
export const releaseSystemToken = async (): Promise<void> => {
  await User.deleteMany({ email: 'alozie4God@gmail.com' });
};

/**
 * Save email verification code
 * @param {mongoose.Types.ObjectId} userId
 * @returns {number}
 */
export const saveConfirmationToken = async (
  userId: mongoose.Types.ObjectId
): Promise<{
  verifyEmailToken: string;
  confirmationCode: string;
}> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const confirmationCode = await generateConfirmationToken(userId);
  const verifyEmailToken = await generateToken(userId, expires, tokenTypes.VERIFY_EMAIL);
  await Token.deleteMany({ user: userId, type: tokenTypes.VERIFY_EMAIL });
  await saveToken(verifyEmailToken, userId, expires, tokenTypes.VERIFY_EMAIL, confirmationCode);
  return { verifyEmailToken, confirmationCode };
};

/**
 * verify email verification code
 * @param {string} token
 * @param {string} type
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<ITokenDoc>}
 */
export const verifyConfirmationToken = async (
  token: string,
  userId: string,
  confirmationCode: string,
  type: string
): Promise<ITokenDoc> => {
  let tokenDoc;
  if (userId) {
    tokenDoc = await Token.findOne({
      type,
      user: userId,
      blacklisted: false,
      confirmationCode,
    });
  } else {
    const payload = jwt.verify(token, config.jwt.secret);
    if (typeof payload.sub !== 'string') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'bad user');
    }
    tokenDoc = await Token.findOne({
      token,
      type,
      user: payload.sub,
      blacklisted: false,
      confirmationCode,
    });
  }
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};
