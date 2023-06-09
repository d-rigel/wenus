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
  .delete(validate(commentValidation.deleteComment), commentController.deleteComment)
  .patch(validate(commentValidation.updateComment), commentController.updateComment);

export default router;
