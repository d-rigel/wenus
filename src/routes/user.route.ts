import express, { Router } from 'express';
import { validate } from '../modules/validate';
import singleUpload from '../modules/media/multer';
import { auth } from '../modules/auth';
import { userController, userValidation } from '../modules/user';
const router: Router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), singleUpload, validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

export default router;
