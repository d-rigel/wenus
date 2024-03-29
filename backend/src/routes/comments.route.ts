import express, { Router } from 'express';
import { commentValidation, commentController } from '../modules/comments';
import { validate } from '../modules/validate';
import { auth } from '../modules/auth';
const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(commentValidation.createComment), commentController.createComment)
  .get(auth(), validate(commentValidation.getComments), commentController.getComments);

router
  .route('/:commentId')
  .delete(auth(), validate(commentValidation.deleteComment), commentController.deleteComment)
  .put(auth(), validate(commentValidation.updateComment), commentController.updateComment)
  .patch(auth(), validate(commentValidation.likeComments), commentController.likeComment);

export default router;
