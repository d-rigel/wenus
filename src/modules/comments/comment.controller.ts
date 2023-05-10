import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';
import * as commentService from './comment.service';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
// import { NewComment } from './comments.interface';
import mongoose from 'mongoose';

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

export const getComments = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['content', 'limit', 'page', 'searchTerm']);
  let match: any = {};
  if (filter.content) {
    match.content = { $regex: filter.content, $options: 'i' };
  }

  if (filter.searchTerm) {
    match = {
      content: { $regex: filter.searchTerm, $options: 'i' },
      page: { $regex: filter.searchTerm, $options: 'i' },
    };
  }

  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  // const result = await electionService.queryElections(match, options);
  const result = await commentService.queryComments(match, options);
  res.send(result);
});

/**
 * Update comment by id
 * @param {string | mongoose.ObjectId} id - Comment id
 * @param {NewComment} commentBody
 * @returns {Promise<ICommentDoc>}
 */

export const updateComment = catchAsync(async (req: Request, res: Response) => {
  if (req.body.content) {
    req.body.content = req.body.content;
  }
  const comment = await commentService.updateComment(req.params['commentId'] as string | mongoose.Types.ObjectId, req.body);
  res.send(comment);
});
