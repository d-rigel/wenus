import Joi from 'joi';
// import { objectId } from '../validate/custom.validation';
import { NewComment } from './comments.interface';
// 'articleIds' | 'creator' | 'articleUserId'
const createCommentBody: Record<keyof NewComment, any> = {
  content: Joi.string().required(),
  likes: Joi.string().optional(),
  articleIds: Joi.string().optional(),
  creator: Joi.string().optional(),
  articleUserId: Joi.string().optional,
};

const createLikeBody: Record<keyof NewComment, any> = {
  content: Joi.string().optional(),
  likes: Joi.string().optional(),
  articleIds: Joi.string().optional(),
  creator: Joi.string().optional(),
  articleUserId: Joi.string().optional,
};

export const createComment = {
  Body: Joi.object().keys(createCommentBody),
};

export const getComments = {
  query: Joi.object().keys({
    content: Joi.string().optional(),
    createdAt: Joi.string().optional(),
    articleIds: Joi.string().optional(),
    searchTerm: Joi.string().optional(),
    limit: Joi.number().integer().optional(),
    page: Joi.number().integer().optional(),
    sortBy: Joi.string().optional(),
    projectBy: Joi.string().optional(),
  }),
};

// export const getArticle = {
//   params: Joi.object().keys({
//     articleId: Joi.string().required(),
//   }),
// };

export const deleteComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
};

export const updateComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
  body: Joi.object().keys(createCommentBody),
};

export const likeComment = {
  params: Joi.object().keys({
    commentId: Joi.string().required(),
  }),
  body: Joi.object().keys(createLikeBody),
};

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
