/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/return-await */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Comment from './comments.model';
import Article from '../articles/articles.model';
import { IOptions, QueryResult } from '../paginate/paginate';
import * as articleService from '../articles/article.service';

import { ICommentDoc, IComment, NewComment } from './comments.interface';
import { ApiError } from '../errors';
import { IArticleDoc, IArticle } from '../articles/article.interface';
// NewArticle,

/**
 * Get opening by id
 * @param {string | mongoose.ObjectId} id - Article id
 * @returns {Promise<ICommentDoc>}
 */

const updateArticles = async (
  articleId: mongoose.Types.ObjectId,
  updateData: Partial<IArticle>
): Promise<IArticleDoc | null> => {
  const update = { $set: { ...updateData } };
  const options = { returnOriginal: false };
  return Article.findOneAndUpdate({ _id: articleId }, update, options);
};

/**
 * Create an comment
 * @param {NewComment} commentBody
 * @returns {Promise<ICommentDoc>}
 */

// id: string | mongoose.Types.ObjectId,
export const createComment = async (commentBody: Partial<IComment>, creator: string): Promise<ICommentDoc> => {
  const comtId = new mongoose.Types.ObjectId(`${commentBody.articleIds}`);
  const article: any = await articleService.getArticleById(comtId);

  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'article not found');
  }

  commentBody.articleIds = article?._id;
  commentBody.creator = new mongoose.Types.ObjectId(creator);

  const newArticle: any = (await Comment.create({ ...commentBody })).populate('creator');

  const comment = article.comments || [];

  comment.push({
    creator: new mongoose.Types.ObjectId(creator),
    article: new mongoose.Types.ObjectId(article._id),
  });

  await updateArticles(article._id, {
    comments: comment,
  });
  return newArticle;
};

export const queryComments = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const comments = await Comment.paginate(filter, options);
  return comments;
};

/**
 * Update comment by id
 * @param {string | mongoose.ObjectId} id - Comment id
 * @param {NewComment} commentBody
 * @returns {Promise<ICommentDoc>}
 */
export const updateComment = async (
  id: string | mongoose.Types.ObjectId,
  commentBody: NewComment
): Promise<ICommentDoc | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Comment does not exist');
  }
  if (mongoose.Types.ObjectId.isValid(id)) {
    const update = await Comment.findOneAndUpdate({ _id: id }, commentBody, { new: true });
    return update;
  }

  const update = Comment.findOneAndUpdate({ articleIds: id }, commentBody, { new: true });
  return update;
};

/**
 * Delete article by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IArticleDoc>}
 */
export const deleteComment = async (
  id: mongoose.Types.ObjectId | any,
  creator: mongoose.Types.ObjectId | any
): Promise<{ deletedCount: number; acknowledged: boolean }> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Comment does not exist');
  }
  if (mongoose.Types.ObjectId.isValid(id)) {
    // ..............................
    // const comment = await Comment.findById({ _id: id });

    // console.log('creator', comment?.creator, '=', creator);
    // if (comment?.creator === creator) {
    //   // delete comment by id
    //   await Comment.findByIdAndDelete(id);
    //   // delete Comment from Post
    //   await Article.findByIdAndUpdate(comment?.articleIds, { $pull: { comments: id } });
    // } else {
    //   // throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user');
    // }

    // const result: any = Article.findByIdAndUpdate(comment?.articleIds, { $pull: { comments: id } });
    // return result;
    // ......................
    const comment = await Comment.findById({ _id: id });
    
    // @ts-ignore
    if (!comment?.creator.equals(creator)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user');
    }
    await Comment.findByIdAndDelete(id);
    const result: any = Article.findByIdAndUpdate(comment?.articleIds, { $pull: { comments: id } });
    return result;
  }

  // ............................
  // const comment = await Comment.findById({ articleIds: id });

  // if (comment?.creator === creator) {
  //   // delete comment by id
  //   await Comment.findByIdAndDelete(id);
  //   await Article.findByIdAndUpdate(comment?.articleIds, { $pull: { comments: id } });
  // } else {
  //   // throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user');
  // }

  // // const result = await Comment.deleteOne({ articleId: id });
  // const result: any = Article.findByIdAndUpdate(comment?.articleIds, { $pull: { comments: id } });
  // return result;
  // // return result;
  // ...............................
  const comment = await Comment.findById({ articleId: id });
  await Comment.findByIdAndDelete(id);
  const result: any = Article.findByIdAndUpdate(comment?.articleIds, { $pull: { comments: id } });
  return result;
};
