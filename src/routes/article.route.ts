import express, { Router } from 'express';
import { articleController, articleValidation } from '../modules/articles';
import { validate } from '../modules/validate';
import singleUpload from '../modules/media/multer';
import { auth } from '../modules/auth';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), singleUpload, validate(articleValidation.createArticle), articleController.createArticle)
  .get(validate(articleValidation.getArticles), articleController.getArticles);

router
  .route('/:articleId')
  .get(auth(), validate(articleValidation.getArticle), articleController.getArticle)
  .delete(auth(), singleUpload, validate(articleValidation.deleteArticle), articleController.deleteArticle)
  .put(auth(), singleUpload, validate(articleValidation.updateArticle), articleController.updateArticle)
  .patch(auth(), validate(articleValidation.likeArticle), articleController.likeArticle);
// .post(validate(articleValidation.createArticleComments), articleController.createArticleComments);
export default router;
