import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { tokenService } from '../token';
import { userService } from '../user';
import mongoose from 'mongoose';
import * as authService from './auth.service';
import { emailService } from '../email';
import { emitEvent } from '../utils/emit-event';
import sendResponse from '../utils/send-response';
import { ApiError } from '../errors';
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

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  // emitEvent('user_login', { ...user.toJSON(), ipAddress: req.socket.remoteAddress, device: req.headers['user-agent'] });
  res.send({ user, tokens });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...userWithTokens });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user email not found');
  }
  const resetPasswordToken = await tokenService.generateResetPasswordToken(user);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query['token'], req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;

  await authService.changePassword(req.body.newPassword, req.body.currentPassword, userId);
  res.status(httpStatus.NO_CONTENT).send();
});

export const resendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(new mongoose.Types.ObjectId(req.body.userId));
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  const { verifyEmailToken, confirmationCode } = await tokenService.saveConfirmationToken(user.id);
  await emailService.sendVerificationEmail(
    user.email,
    `${verifyEmailToken}`,
    confirmationCode,
    `${user.firstName || ''} ${user.lastName || ''}`
  );
  return sendResponse(
    res,
    httpStatus.CREATED,
    {
      user,
    },
    'Confirmation code has been re-sent successfully'
  );
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const verify = await authService.verifyEmail(req.query['token'], req.query['userId'], req.body.code);
  const tokens = await tokenService.generateAuthTokens(verify);

  return sendResponse(
    res,
    httpStatus.OK,
    {
      user: verify,
      tokens,
    },
    'verification_successful'
  );
});
