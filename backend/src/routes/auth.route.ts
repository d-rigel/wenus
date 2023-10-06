import express, { Router } from 'express';
import { validate } from '../modules/validate';
import singleUpload from '../modules/media/multer';
import { authValidation, authController, auth } from '../modules/auth';

const router: Router = express.Router();

router.post('/register', singleUpload, validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/change-password', auth(), validate(authValidation.changePassword), authController.changePassword);
router.post(
  '/resend-verification-email',
  validate(authValidation.resendVerificationEmail),
  authController.resendVerificationEmail
);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register as a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - mobileNumber
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Must be unique
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Must contain at least one number and one letter
 *             examples:
 *               example-1:
 *                 value:
 *                   name: fake namekkjjkk
 *                   email: fake@example.com
 *                   password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */


export default router;
