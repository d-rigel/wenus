/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/return-await */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Article from './articles.model';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IArticleDoc, NewArticle, UpdateArticleBody } from './article.interface';
import { ApiError } from '../errors';

/**
 * Create an article
 * @param {NewArticle} articleBody
 * @returns {Promise<IArticleDoc>}
 */

export const createArticle = async (articleBody: NewArticle): Promise<IArticleDoc> => {
  articleBody.articleId = await Article.generateArticleId();
  return await Article.create({ ...articleBody });
};
