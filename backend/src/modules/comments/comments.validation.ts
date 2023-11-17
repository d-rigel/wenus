import Joi from 'joi';
// import { objectId } from '../validate/custom.validation';
import { NewComment } from './comments.interface';
// 'articleIds' | 'creator' | 'articleUserId'
const createCommentBody: Record<keyof Omit<NewComment, 'articleIds' | "creator">, any> = {
  comment: Joi.string().required(),
  likes: Joi.string().optional(),
  // articleIds: Joi.string().optional(),
  // creator: Joi.string().optional(),
  articleUserId: Joi.string().optional,
};

const createLikeBody: Record<keyof Omit<NewComment, 'articleIds' | "creator"> , any> = {
  comment: Joi.string().optional(),
  likes: Joi.number().optional(),
  // articleIds: Joi.string().optional(),
  // creator: Joi.string().optional(),
  articleUserId: Joi.string().optional,
};

export const createComment = {
  Body: Joi.object().keys(createCommentBody),
};

export const getComments = {
  query: Joi.object().keys({
    comment: Joi.string().optional(),
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

export const likeComments = {
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
