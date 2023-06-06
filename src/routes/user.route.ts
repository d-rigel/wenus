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
// get invite by id
router
  .route('/invite/:inviteId')
  .get(auth('manageUsers'), validate(userValidation.getInviteById), userController.getInviteById)
  .delete(auth('manageUsers'), validate(userValidation.deleteInvite), userController.deleteInvite);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), singleUpload, validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

export default router;
