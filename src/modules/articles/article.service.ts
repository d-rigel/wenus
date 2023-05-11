/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/return-await */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import Article from './articles.model';
import { IOptions, QueryResult } from '../paginate/paginate';
import { IArticleDoc, NewArticle } from './article.interface';
import { ApiError } from '../errors';
import cloudinary from 'cloudinary';

/**
 * Create an article
 * @param {NewArticle} articleBody
 * @returns {Promise<IArticleDoc>}
 */

export const createArticle = async (articleBody: NewArticle): Promise<IArticleDoc> => {
  articleBody.articleId = await Article.generateArticleId();
  return (await Article.create({ ...articleBody })).populate('creator');
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
 * @returns {Promise<IArticleDoc[]>}
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
 * Delete article by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IArticleDoc>}
 */
export const deleteArticle = async (
  id: mongoose.Types.ObjectId | string
): Promise<{ deletedCount: number; acknowledged: boolean }> => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const oneArticle: any = await Article.findById({ _id: id });
    await cloudinary.v2.uploader.destroy(oneArticle?.image?.public_id);

    const result = await Article.deleteOne({ _id: id });
    return result;
  }
  const oneArticle: any = await Article.findById({ articleId: id });
  await cloudinary.v2.uploader.destroy(oneArticle?.image?.public_id);
  const result = await Article.deleteOne({ articleId: id });
  return result;
};

/**
 * Update article by id
 * @param {string | mongoose.ObjectId} id - Article id
 * @param {NewArticle} articleBody
 * @returns {Promise<IArticleDoc>}
 */
export const updateArticleById = async (
  id: string | mongoose.Types.ObjectId,
  articleBody: NewArticle
): Promise<IArticleDoc | null> => {
  if (await Article.isArticleExist(articleBody.title)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Article already exist');
  }
  if (mongoose.Types.ObjectId.isValid(id)) {
    const oneArticle: any = await Article.findById({ _id: id });
    await cloudinary.v2.uploader.destroy(oneArticle?.image?.public_id);
    const update = await Article.findOneAndUpdate({ _id: id }, articleBody, { new: true });
    return update;
  }
  const oneArticle: any = await Article.findById({ _id: id });
  await cloudinary.v2.uploader.destroy(oneArticle?.image?.public_id);
  const update = Article.findOneAndUpdate({ articleId: id }, articleBody, { new: true });
  return update;
};
