/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/return-await */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Comment from './comments.model';
import Article from '../articles/articles.model';
// import { IOptions, QueryResult } from '../paginate/paginate';
import * as articleService from '../articles/article.service';

import { ICommentDoc, IComment } from './comments.interface';
import { ApiError } from '../errors';
import { IArticleDoc, IArticle } from '../articles/article.interface';
// NewArticle,

/**
 * Get opening by id
 * @param {string | mongoose.ObjectId} id - Opening id
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
  // const article: any = await Article.findById(comtId);
  console.log('see comments', article);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'article not found');
  }
  // commentBody.commentId = article?._id;
  commentBody.articleIds = article?._id;
  // commentBody.articleUserId = article?.creator as string;
  // commentBody.likes = article?.likes;
  // commentBody.title = article.title;
  // commentBody.article = article.article;
  // commentBody?.image.public_url = article.image.public_url;
  // commentBody?.image.url = article.image.url;

  const newArticle = await Comment.create({ ...commentBody });
  // const comment: any = article.comments || [];
  const comment = article.comments || [];
  // comment.push(creator);
  comment.push({
    creator: new mongoose.Types.ObjectId(creator),
    comment: new mongoose.Types.ObjectId(article?._id),
  });
  console.log('pushed comment', comment);
  // article.comments = article.comments.push(creator?._id);
  // await article.save();

  // await articleService.updateArticleById(article._id, comment);
  await updateArticles(article._id, {
    comments: comment,
  });
  return newArticle;
};
