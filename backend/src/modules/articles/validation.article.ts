import Joi from 'joi';
import { NewArticle } from './article.interface';
// import { objectId } from '../validate/custom.validation';

const createArticleBody: Record<keyof Omit<NewArticle, 'articleId' | 'creator'>, any> = {
  title: Joi.string().required(),
  article: Joi.string().required(),
  image: Joi.string().optional(),
  comments: Joi.array().items(Joi.string()).optional(),
  likes: Joi.number().optional(),
  createdTime: Joi.string().optional(),
};

const likeArticleBody: Record<keyof Omit<NewArticle, 'articleId' | 'creator'>, any> = {
  title: Joi.string().optional(),
  article: Joi.string().optional(),
  image: Joi.string().optional(),
  comments: Joi.array().items(Joi.string()),
  likes: Joi.number().optional(),
  createdTime: Joi.string().optional(),
};

export const createArticle = {
  Body: Joi.object().keys(createArticleBody),
};

export const getArticles = {
  query: Joi.object().keys({
    title: Joi.string().optional(),
    article: Joi.string().optional(),
    image: Joi.string().optional(),
    // comments: Joi.string().optional(),
    // likes: Joi.string().optional(),
    // createdAt: Joi.string().optional(),
    articleId: Joi.string().optional(),
    searchTerm: Joi.string().optional(),
    limit: Joi.number().integer().optional(),
    page: Joi.number().integer().optional(),
    sortBy: Joi.string().optional(),
    projectBy: Joi.string().optional(),
  }),
};

export const getArticle = {
  params: Joi.object().keys({
    articleId: Joi.string().required(),
  }),
};

export const deleteArticle = {
  params: Joi.object().keys({
    // articleId: Joi.string().required().custom(objectId),
    articleId: Joi.string().required(),
  }),
};

export const updateArticle = {
  params: Joi.object().keys({
    articleId: Joi.string().required(),
  }),
  body: Joi.object().keys(createArticleBody),
};

export const likeArticle = {
  params: Joi.object().keys({
    articleId: Joi.string().required(),
  }),
  body: Joi.object().keys(likeArticleBody),
};

export const createArticleComments = {
  params: Joi.object().keys({
    articleId: Joi.string().required(),
  }),
  body: Joi.object().keys(likeArticleBody),
};
