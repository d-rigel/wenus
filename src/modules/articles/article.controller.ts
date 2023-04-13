import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';
import * as articleService from './article.service';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import { ApiError } from '../errors';
import mongoose from 'mongoose';

export const createArticle = catchAsync(async (req: Request, res: Response) => {
  req.body.title = req.body.title;
  req.body.article = req.body.article;
  // req.body.creator = req.user._id;
  req.body.image = req.body.image;
  req.body.comments = req.body.comments;
  req.body.likes = req.body.likes;

  const article = await articleService.createArticle(req.body);
  res.status(httpStatus.CREATED).send(article);
});

// Get all articles
export const getArticles = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'article', 'limit', 'page', 'searchTerm']);
  let match: any = {};
  if (filter.title) {
    match.title = { $regex: filter.title, $options: 'i' };
  }
  if (filter.article) {
    match.article = { $regex: filter.article, $options: 'i' };
  }

  if (filter.searchTerm) {
    match = {
      title: { $regex: filter.searchTerm, $options: 'i' },
      article: { $regex: filter.searchTerm, $options: 'i' },
    };
  }

  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  // const result = await electionService.queryElections(match, options);
  const result = await articleService.queryArticles(match, options);
  res.send(result);
});

export const getArticle = catchAsync(async (req: Request, res: Response) => {
  const article = await articleService.getArticleById(req.params['articleId'] as string | mongoose.Types.ObjectId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  res.send(article);
});
