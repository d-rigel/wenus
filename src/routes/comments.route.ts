import express, { Router } from 'express';
import { commentValidation, commentController } from '../modules/comments';
import { validate } from '../modules/validate';
// import singleUpload from '../modules/media/multer';

const router: Router = express.Router();

router
  .route('/')
  .post(validate(commentValidation.createComment), commentController.createComment)
  .get(validate(commentValidation.getComments), commentController.getComments);

router
  .route('/:commentId')
  //   .get(validate(articleValidation.getArticle), articleController.getArticle)
  //   .delete(singleUpload, validate(articleValidation.deleteArticle), articleController.deleteArticle)
  //   .put(singleUpload, validate(articleValidation.updateArticle), articleController.updateArticle)
  .patch(validate(commentValidation.updateComment), commentController.updateComment);
// .post(validate(articleValidation.createArticleComments), articleController.createArticleComments);
export default router;
