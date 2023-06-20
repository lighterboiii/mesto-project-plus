import { Router } from "express";
import { getUsers, getUserById, createUser , updateAvatar, updateUserInfo } from "../controllers/users";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserInfo);
userRouter.patch('/me/avatar', updateAvatar);

export default userRouter;