import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';
import * as commentService from './comment.service';

export const createComment = catchAsync(async (req: Request, res: Response) => {
  // const creator: any = req?.user;
  const creator: any = {
    _id: '64462290c7cec914e40b9a2e',
    firstName: 'John',
    lastName: 'Graige',
    email: 'nname@users.com',
    createdTime: '2023-05-05T12:53:06.197Z',
    createdAt: '2023-05-05T13:01:42.514Z',
    updatedAt: '2023-05-05T13:01:42.514Z',
    __v: 0,
  };

  const comment = await commentService.createComment(req.body, creator._id);
  res.status(httpStatus.CREATED).send(comment);
});
