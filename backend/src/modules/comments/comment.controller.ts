import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';
import * as commentService from './comment.service';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
// import { NewComment } from './comments.interface';
import mongoose from 'mongoose';
import Comment from './comments.model';
import { ApiError } from '../errors';

export const createComment = catchAsync(async (req: Request, res: Response) => {
  const creator: any = req.user;

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

  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'creator']);

  // const result = await commentService.queryComments(match, { ...options, populate: 'creator' });
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

export const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const creator: any = await req.user;
  // console.log('creator>>', creator);
  await commentService.deleteComment(req.params['commentId'] as string | mongoose.Types.ObjectId, creator._id);
  res.status(httpStatus.NO_CONTENT).send();
});

// Like a comment
export const likeComment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params['commentId'] as string | mongoose.Types.ObjectId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `No resouce with id: ${id}`);
  }
  const oneComment: any = await Comment.findById({ _id: id });
  // @ts-ignore
  const index = oneComment.likes.findIndex((id) => id === String(req.user));
  console.log('userindex', index);

  if (index === -1) {
    oneComment.likes.push(req.user);
  } else {
    // @ts-ignore
    oneComment.likes = oneComment.likes.filter((id) => id !== String(req.user));
  }

  
  const update = await Comment.findByIdAndUpdate({ _id: id }, oneComment, { new: true });
  res.send(update);
});

