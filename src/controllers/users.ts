/* eslint-disable no-console */
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ICustomRequest } from '../types/types';
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_FORBIDDEN,
} from '../constants/status-codes';
import User from '../models/user';
import JWT_SECRET_KEY from '../constants/jwt-secret-key';

// const { JWT_SECRET_KEY, NODE_ENV } = process.env;

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
    const newUser = await User.create({ name, about, avatar, email, password: hashedPassword });
    res.status(HTTP_STATUS_OK).send(newUser);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации' });
    } else {
      console.log(err);
      res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  }
};

export const updateUserInfo = async (req: ICustomRequest, res: Response) => {
  const userId = req.user?._id;
  const information = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, information, {
      new: true, runValidators: true,
    });
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

export const updateAvatar = async (req: ICustomRequest, res: Response) => {
  const userId = req.user?._id;
  const { avatar } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar }, {
      new: true, runValidators: true,
    });
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

export const login = async (req: ICustomRequest, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Неверный логин или пароль' });
    }
    const matched = bcryptjs.compare(password, user.password);
    if (!matched) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Неверный логин или пароль' });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(HTTP_STATUS_OK).send({
      token,
      name: user.name,
      email: user.email,
    });
  } catch (err: any) {
    console.error(err);
    res.status(HTTP_STATUS_SERVER_ERROR).json({ message: 'Ошибка сервера' });
  }
};

export const getUserData = async (req: ICustomRequest, res: Response) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный запрос' });
  }
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Пользователь не найден' });
    }
    if (currentUser._id.toString() !== req.user?._id.toString()) {
      return res.status(HTTP_STATUS_FORBIDDEN).send({ message: 'Доступ запрещён' });
    }
    res.status(HTTP_STATUS_OK).send(currentUser);
  } catch (err: any) {
    if (err.name === 'CastError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный запрос' });
    } else {
      console.log(err);
      res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  }
};
