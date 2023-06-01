import httpStatus from 'http-status';
import { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import { generate } from 'generate-password';
import catchAsync from '../utils/catchAsync';
// import ApiError from '../errors/ApiError';
// import pick from '../utils/pick';
// import { IOptions } from '../paginate/paginate';
import * as userService from './user.service';
// import sendResponse from '../utils/send-response';
// import { IInvite } from './user.invite.interfaces';
// import Invite from './user.invite.model';
import getDataUri from '../media/dataUri';
import cloudinary from 'cloudinary';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const fileUri: any = getDataUri(file);

  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  //   req.body.image = {
  //     public_id: myCloud.public_id,
  //     url: myCloud.secure_url,
  //   };
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
