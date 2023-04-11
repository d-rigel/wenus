import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';
import * as articleService from './article.service';

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
