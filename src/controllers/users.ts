/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-len */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { UserRequest } from '../types/types';
import {
  HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_SERVER_ERROR, HTTP_STATUS_BAD_REQUEST,
} from '../constants/status-codes';
import User from '../models/user';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
      return;
    }
    res.send(user);
  } catch (err: any) {
    if (err.name === 'CastError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректные данные' });
    } else {
      console.log(err);
      res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar, email, password } = req.body;
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({ name, about, avatar, email, password: hashedPassword });
    res.status(HTTP_STATUS_OK).send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации' });
    } else {
      console.log(err);
      res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  }
};

export const updateUserInfo = async (req: UserRequest, res: Response) => {
  const userId = req.user?._id;
  const information = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, information, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    res.status(HTTP_STATUS_OK).send(updatedUser);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации' });
    } else {
      console.log(err);
      res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  }
};

export const updateAvatar = async (req: UserRequest, res: Response) => {
  const userId = req.user?._id;
  const { avatar } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
    res.status(HTTP_STATUS_OK).send(updatedUser);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации' });
    } else {
      console.log(err);
      res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  }
};
