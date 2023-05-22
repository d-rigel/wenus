import httpStatus from 'http-status';
import { Request, Response } from 'express';
// import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
// import { tokenService } from '../token';
import { userService } from '../user';

// import * as authService from './auth.service';
// import { emailService } from '../email';
import { emitEvent } from '../utils/emit-event';
import sendResponse from '../utils/send-response';
// import { officerService } from '../officer';
// import { ApiError } from '../errors';
import getDataUri from '../media/dataUri';
import cloudinary from 'cloudinary';

export const register = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const fileUri: any = getDataUri(file);

  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  req.body.image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  const user = await userService.registerUser(req.body);
  emitEvent('user_registered', user);

  if (req.body.invitationCode) {
    return sendResponse(
      res,
      httpStatus.CREATED,
      {
        user,
      },
      'Account created successfully'
    );
  }
  return sendResponse(
    res,
    httpStatus.CREATED,
    {
      user,
    },
    'Confirmation code has been sent successfully'
  );
});
