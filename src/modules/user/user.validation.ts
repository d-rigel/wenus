import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedUser } from './user.interfaces';

const createUserBody: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().required().email(),
  password: Joi.string(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  image: Joi.string().optional(),
  stack: Joi.string().required(),
  invitationCode: Joi.string().optional(),
  role: Joi.string().required(),
  // .valid(...roles),
};

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    roleNotIn: Joi.string(),
    searchTerm: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      fistName: Joi.string(),
      lastName: Joi.string(),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const inviteUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    stack: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
};

export const getInvite = {
  query: Joi.object()
    .keys({
      code: Joi.string().optional(),
      email: Joi.string().email().optional(),
    })
    .xor('code', 'email'),
};
