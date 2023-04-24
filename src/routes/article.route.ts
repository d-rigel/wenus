import express, { Router } from 'express';
// import { articleController, articleValidation } from '@/modules/articles';
import { articleController, articleValidation } from '../modules/articles';
import { validate } from '../modules/validate';
import singleUpload from '../modules/media/multer';

const router: Router = express.Router();

router
  .route('/')
  .post(singleUpload, validate(articleValidation.createArticle), articleController.createArticle)
  .get(validate(articleValidation.getArticles), articleController.getArticles);

router
  .route('/:articleId')
  .get(validate(articleValidation.getArticle), articleController.getArticle)
  .delete(singleUpload, validate(articleValidation.deleteArticle), articleController.deleteArticle)
  .put(singleUpload, validate(articleValidation.updateArticle), articleController.updateArticle);
export default router;
