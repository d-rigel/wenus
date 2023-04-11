import Joi from 'joi';
import { NewArticle } from './article.interface';

const createArticleBody: Record<keyof Omit<NewArticle, 'articleId' | 'creator'>, any> = {
  title: Joi.string().required(),
  article: Joi.string().required(),
  image: Joi.string().optional(),
  comments: Joi.string().optional(),
  likes: Joi.string().optional(),
  createdAt: Joi.string().optional(),
};

export const createArticle = {
  Body: Joi.object().keys(createArticleBody),
};
