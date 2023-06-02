import Joi from 'joi';
import { objectId, password } from '../validate/custom.validation';
import { NewCreatedUser } from '../user/user.interfaces';
import { roles } from '../../config/roles';

const registerBody: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  // otherName: Joi.string().required(),
  stack: Joi.string().required(),
  invitationCode: Joi.string().optional(),
  image: Joi.string().optional(),
  role: Joi.string()
    .optional()
    .allow(...roles),
};

export const register = {
  body: Joi.object().keys(registerBody),
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

export const changePassword = {
  body: Joi.object().keys({
    currentPassword: Joi.string().required().custom(password),
    newPassword: Joi.string().required().custom(password),
  }),
};

export const resendVerificationEmail = {
  body: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string(),
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    code: Joi.string().required(),
  }),
};
