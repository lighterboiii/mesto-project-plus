import { Router } from 'express';
import {
  getUsers, getUserById, updateAvatar, updateUserInfo, getUserData,
} from '../controllers/users';
import userValidation from '../validation/user-validation';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getUserData);
userRouter.get('/:userId', userValidation.getUserByIdValidation, getUserById);
userRouter.patch('/me', userValidation.updateUserInfoValidation, updateUserInfo);
userRouter.patch('/me/avatar', userValidation.updateAvatarValidation, updateAvatar);

export default userRouter;
