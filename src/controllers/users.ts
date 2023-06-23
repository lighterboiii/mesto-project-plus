import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ICustomRequest } from '../types/types';
import HTTP_STATUS_OK from '../constants/status-codes';
import User from '../models/user';
import JWT_SECRET_KEY from '../constants/jwt-secret-key';
import NotFoundError from '../errors/not-found';
import BadRequestError from '../errors/bad-request';
import ForbiddenError from '../errors/forbidden';
import ConflictError from '../errors/conflict';
import UnauthorizedError from '../errors/unauthorized';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  } catch (err: any) {
    if (err.name === 'CastError') {
      throw new BadRequestError('Некорректные данные пользователя');
    } else {
      next(err);
    }
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Пользователь с таким email уже существует');
    }
    const newUser = await User.create({ name, about, avatar, email, password: hashedPassword });
    res.status(HTTP_STATUS_OK).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      throw new BadRequestError('Некорректные данные пользователя');
    } else {
      next(err);
    }
  }
};

export const updateUserInfo = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { name, about } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { name, about }, {
      new: true, runValidators: true,
    });
    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(HTTP_STATUS_OK).send(updatedUser);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      throw new BadRequestError('Некорректные данные пользователя');
    } else {
      next(err);
    }
  }
};

export const updateAvatar = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { avatar } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar }, {
      new: true, runValidators: true,
    });
    if (!updatedUser) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.status(HTTP_STATUS_OK).send(updatedUser);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      throw new BadRequestError('Некорректные данные пользователя');
    } else {
      next(err);
    }
  }
};

export const login = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Неверный логин или пароль');
    }
    const matched = bcryptjs.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError('Неверный логин или пароль');
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(HTTP_STATUS_OK).send({
      token,
      name: user.name,
      email: user.email,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getUserData = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new BadRequestError('Некорректные данные пользователя');
  }
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      throw new NotFoundError('Пользователь не найден');
    }
    if (currentUser._id.toString() !== req.user?._id.toString()) {
      throw new ForbiddenError('Доступ запрещен');
    }
    res.status(HTTP_STATUS_OK).send(currentUser);
  } catch (err: any) {
    if (err.name === 'CastError') {
      throw new BadRequestError('Некорректные данные пользователя');
    } else {
      next(err);
    }
  }
};
