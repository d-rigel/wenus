import express, { Router } from 'express';
// import { validate } from '../../modules/validate';
import { validate } from '../modules/validate';
import singleUpload from '../modules/media/multer';
// import { authValidation, authController, auth } from '../../modules/auth';
import { authValidation, authController } from '../modules/auth';

const router: Router = express.Router();

router.post('/register', singleUpload, validate(authValidation.register), authController.register);

export default router;
