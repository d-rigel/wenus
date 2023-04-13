/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/return-await */
// import mongoose from 'mongoose';
// import httpStatus from 'http-status';
import Article from './articles.model';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IArticleDoc, NewArticle } from './article.interface';
import mongoose from 'mongoose';
// UpdateArticleBody
// import { ApiError } from '../errors';

/**
 * Create an article
 * @param {NewArticle} articleBody
 * @returns {Promise<IArticleDoc>}
 */

export const createArticle = async (articleBody: NewArticle): Promise<IArticleDoc> => {
  articleBody.articleId = await Article.generateArticleId();
  return await Article.create({ ...articleBody });
};

/**
 * Query for Elections
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryArticles = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const articles = await Article.paginate(filter, options);
  return articles;
};

/**
 * Get article by id
 * @param {string | mongoose.ObjectId} id - Article id
 * @returns {Promise<IElectionDoc[]>}
 */
export const getArticleById = async (id: string | mongoose.Types.ObjectId): Promise<IArticleDoc | null> => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return await Article.findOne({ _id: id });
  }
  return await Article.findOne({
    articleId: id,
  });
};

/**
 * Delete an article
 * @param {NewElection} articleBody
 * @returns {Promise<IArticleDoc>}
 */
export const deleteArticle = async (articleId: mongoose.Types.ObjectId): Promise<IArticleDoc | null> => {
  return await Article.findByIdAndDelete(articleId);
};
