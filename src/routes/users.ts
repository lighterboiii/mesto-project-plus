import { Router } from 'express';
import {
  getUsers, getUserById, updateAvatar, updateUserInfo, getUserData,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.get('/me', getUserData);
userRouter.patch('/me', updateUserInfo);
userRouter.patch('/me/avatar', updateAvatar);

export default userRouter;
