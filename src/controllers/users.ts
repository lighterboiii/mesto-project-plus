import User from '../models/user';
import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send('Пользователь не найден');
      return;
    }
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const information = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, information, { new: true });
    if (!updatedUser) {
      return res.status(404).send('Пользователь не найден');
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { avatar } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { avatar }, { new: true });
    if (!updatedUser) {
      return res.status(404).send('Пользователь не найден');
    }
    res.status(200).send(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send('Ошибка сервера');
  }
};