import express, { Router } from 'express';
// import { validate } from '../../modules/validate';
import { validate } from '../modules/validate';
import singleUpload from '../modules/media/multer';
// import { authValidation, authController, auth } from '../../modules/auth';
import { authValidation, authController, auth } from '../modules/auth';

const router: Router = express.Router();

router.post('/register', singleUpload, validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
// router.post('/change-password', auth(), validate(authValidation.changePassword), authController.changePassword);
router.post('/change-password', auth(), validate(authValidation.changePassword), authController.changePassword);

export default router;
