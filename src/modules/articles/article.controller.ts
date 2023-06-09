import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';
import * as articleService from './article.service';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import { ApiError } from '../errors';
import mongoose from 'mongoose';
import getDataUri from '../media/dataUri';
import cloudinary from 'cloudinary';
// import multer from 'multer';
// ..................
import Article from './articles.model';
// import { IArticleDoc, NewArticle } from './article.interface';

export const createArticle = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const fileUri: any = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);
  // @ts-ignore
  req.body.creator = req.user.id;
  req.body.title = req.body.title;
  req.body.article = req.body.article;

  req.body.image = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

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

  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy', 'populate']);
  const result = await articleService.queryArticles(match, { ...options, populate: 'creator' });
  res.send(result);
});

export const getArticle = catchAsync(async (req: Request, res: Response) => {
  const article = await articleService.getArticleById(req.params['articleId'] as string | mongoose.Types.ObjectId);
  if (!article) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found');
  }
  res.send(article);
});

export const deleteArticle = catchAsync(async (req: Request, res: Response) => {
  await articleService.deleteArticle(req.params['articleId'] as string | mongoose.Types.ObjectId);
  res.status(httpStatus.NO_CONTENT).send();
});

export const updateArticle = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const fileUri: any = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  if (req.body.title) {
    req.body.title = req.body.title;
  }

  if (req.body.article) {
    req.body.article = req.body.article;
  }
  if (req.body.image) {
    req.body.image = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const article = await articleService.updateArticleById(
    req.params['articleId'] as string | mongoose.Types.ObjectId,
    req.body
  );
  res.send(article);
});

export const likeArticle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params['articleId'] as string | mongoose.Types.ObjectId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `No resouce with id: ${id}`);
  }
  const oneArticle: any = await Article.findById({ _id: id });
  // @ts-ignore
  const index = oneArticle.likes.findIndex((id) => id === String(req.user));
  console.log('userindex', index);

  if (index === -1) {
    oneArticle.likes.push(req.user);
  } else {
    // @ts-ignore
    oneArticle.likes = oneArticle.likes.filter((id) => id !== String(req.user));
  }

  // const update = await Article.findByIdAndUpdate({ _id: id }, { likes: oneArticle?.likes + 1 }, { new: true });
  const update = await Article.findByIdAndUpdate({ _id: id }, oneArticle, { new: true });
  res.send(update);
});
