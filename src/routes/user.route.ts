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
router.route('/invite/single').post(auth('manageUsers'), validate(userValidation.inviteUser), userController.inviteUser);
router.route('/invites').get(auth('manageUsers'), validate(userValidation.getInvites), userController.getInvites);
// Get one invite by code or email
router.route('/invite').get(auth('manageUsers'), validate(userValidation.getInvite), userController.getInvite);

export default router;
