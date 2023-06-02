import httpStatus from 'http-status';
import { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import { generate } from 'generate-password';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as userService from './user.service';
import sendResponse from '../utils/send-response';
import { IInvite } from './user.invite.interfaces';
import Invite from './user.invite.model';
import getDataUri from '../media/dataUri';
import cloudinary from 'cloudinary';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const fileUri: any = getDataUri(file);

  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
  const payload = {
    ...req.body,
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    hasDefaultPassword: true,
  };
  const user = await userService.createUser(payload);
  res.status(httpStatus.CREATED).send(user);
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  let filter = pick(req.query, ['name', 'role', 'searchTerm', 'roleNotIn']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);

  if (filter.role) {
    if (filter.role.toLowerCase() === 'invitation') {
      res.send(await userService.queryInvites({ isUsed: false }, options));
      return;
    }

    if (filter.role.toLowerCase() === 'user') {
      res.send(await userService.queryUsers({}, { ...options, populate: 'user' }));
      return;
    }
  }

  if (filter.roleNotIn) {
    filter = {
      role: { $nin: filter.roleNotIn.split(' ') },
    };
  }
  if (filter.searchTerm) {
    filter = {
      $or: [
        { firstName: { $regex: filter.searchTerm, $options: 'i' } },
        { lastName: { $regex: filter.searchTerm, $options: 'i' } },
        { otherName: { $regex: filter.searchTerm, $options: 'i' } },
        { email: { $regex: filter.searchTerm, $options: 'i' } },
      ],
      role: filter.role || { $ne: null },
    };
  }

  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

export const inviteUser = catchAsync(async (req: Request, res: Response) => {
  if (await Invite.findOne({ email: req.body.email })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already invited');
  }
  const invite = await userService.inviteUser(req.body as IInvite);
  return sendResponse(
    res,
    httpStatus.OK,
    {
      invite,
    },
    'invite_created'
  );
});

// Get all invites
export const getInvites = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['email', 'invitationCode', 'page', 'searchTerm']);
  let match: any = {};
  if (filter.email) {
    match.email = { $regex: filter.email, $options: 'i' };
  }
  if (filter.invitationCode) {
    match.article = { $regex: filter.invitationCode, $options: 'i' };
  }

  if (filter.searchTerm) {
    match = {
      email: { $regex: filter.searchTerm, $options: 'i' },
      invitationCode: { $regex: filter.searchTerm, $options: 'i' },
    };
  }

  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'populate']);
  const result = await userService.queryInvites(match, { ...options });
  res.send(result);
});

export const getInvite = catchAsync(async (req: Request, res: Response) => {
  const invite = await userService.getInvite({
    code: req.query['code'] as string,
    email: req.query['email'] as string,
  });
  return sendResponse(
    res,
    invite ? httpStatus.OK : httpStatus.NOT_FOUND,
    {
      invite,
    },
    'invite_retrieved'
  );
});
