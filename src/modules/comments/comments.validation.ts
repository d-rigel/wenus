import Joi from 'joi';
// import { objectId } from '../validate/custom.validation';
import { NewComment } from './comments.interface';
// 'articleIds' | 'creator' | 'articleUserId'
const createCommentBody: Record<keyof NewComment, any> = {
  content: Joi.string().required(),
  // likes: Joi.string().optional(),
  articleIds: Joi.string().optional(),
  creator: Joi.string().required(),
  articleUserId: Joi.string().required(),

  // title: Joi.string().optional(),
  // article: Joi.string().optional(),
  // image: Joi.string().optional(),
};

export const createComment = {
  Body: Joi.object().keys(createCommentBody),
};

// export const getArticles = {
//   query: Joi.object().keys({
//     title: Joi.string().optional(),
//     article: Joi.string().optional(),
//     image: Joi.string().optional(),
//     // comments: Joi.string().optional(),
//     // likes: Joi.string().optional(),
//     // createdAt: Joi.string().optional(),
//     articleId: Joi.string().optional(),
//     searchTerm: Joi.string().optional(),
//     limit: Joi.number().integer().optional(),
//     page: Joi.number().integer().optional(),
//     sortBy: Joi.string().optional(),
//     projectBy: Joi.string().optional(),
//   }),
// };

// export const getArticle = {
//   params: Joi.object().keys({
//     articleId: Joi.string().required(),
//   }),
// };

// export const deleteArticle = {
//   params: Joi.object().keys({
//     // articleId: Joi.string().required().custom(objectId),
//     articleId: Joi.string().required(),
//   }),
// };

// export const updateArticle = {
//   params: Joi.object().keys({
//     articleId: Joi.string().required(),
//   }),
//   body: Joi.object().keys(createArticleBody),
// };

// export const likeArticle = {
//   params: Joi.object().keys({
//     articleId: Joi.string().required(),
//   }),
//   body: Joi.object().keys(likeArticleBody),
// };

// export const createArticleComments = {
//   params: Joi.object().keys({
//     articleId: Joi.string().required(),
//   }),
//   body: Joi.object().keys(likeArticleBody),
// };
