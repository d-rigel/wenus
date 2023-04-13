import express, { Router } from 'express';
// import { articleController, articleValidation } from '@/modules/articles';
import { articleController, articleValidation } from '../modules/articles';
import { validate } from '../modules/validate';

const router: Router = express.Router();

router
  .route('/')
  .post(validate(articleValidation.createArticle), articleController.createArticle)
  .get(validate(articleValidation.getArticles), articleController.getArticles);

router.route('/:articleId').get(validate(articleValidation.getArticle), articleController.getArticle);
export default router;
