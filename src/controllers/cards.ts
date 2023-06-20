/* eslint-disable max-len */
/* eslint-disable no-console */
import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { UserRequest } from '../types/types';
import {
  HTTP_STATUS_OK, HTTP_STATUS_SERVER_ERROR, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_BAD_REQUEST,
} from '../constants/status-codes';
import Card from '../models/cards';

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find();
    res.send(cards);
  } catch (err) {
    console.log(err);
    res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  }
};

export const createCard = async (req: UserRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(HTTP_STATUS_OK).send(card);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации' });
    } else {
      console.log(err);
      res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  try {
    const deletedCard = await Card.findByIdAndRemove(cardId);
    if (!deletedCard) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    res.status(HTTP_STATUS_OK).send(deletedCard);
  } catch (err: any) {
    if (err.name === 'CastError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректные данные' });
    } else {
      console.log(err);
      res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  }
};

export const likeCard = async (req: UserRequest, res: Response) => {
  const { cardId } = req.params;
  const owner = req.user?._id;
  try {
    const updatedCard = await Card.findByIdAndUpdate(cardId, { $addToSet: { likes: owner } }, { new: true });
    if (!updatedCard) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    res.status(HTTP_STATUS_OK).send(updatedCard);
  } catch (err: any) {
    if (err.name === 'CastError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректные данные' });
    } else {
      console.log(err);
      res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  }
};

export const dislikeCard = async (req: UserRequest, res: Response) => {
  const { cardId } = req.params;
  const owner = req.user?._id;
  try {
    const updatedCard = await Card.findByIdAndUpdate(cardId, { $pull: { likes: owner as unknown as ObjectId } }, { new: true });
    if (!updatedCard) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    res.status(HTTP_STATUS_OK).send(updatedCard);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Ошибка валидации' });
    } else {
      console.log(err);
      res.status(HTTP_STATUS_SERVER_ERROR).send({ message: 'Ошибка сервера' });
    }
  }
};
