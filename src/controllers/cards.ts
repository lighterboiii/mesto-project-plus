import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { ICustomRequest } from '../types/types';
import { HTTP_STATUS_OK } from '../constants/status-codes';
import Card from '../models/cards';
import BadRequestError from '../errors/bad-request';
import ForbiddenError from '../errors/forbidden';
import NotFoundError from '../errors/not-found';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find();
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  try {
    const card = await Card.create({ name, link, owner });
    res.status(HTTP_STATUS_OK).send(card);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      throw new BadRequestError('Некорректные данные');
    } else {
      next(err);
    }
  }
};

export const deleteCard = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user!;
  try {
    const card = await Card.findById(cardId);
    if (card!.owner.toString() !== userId) {
      throw new ForbiddenError('Вы можете удалить только свою карточку');
    }
    const deletedCard = await Card.findByIdAndRemove(cardId);
    if (!deletedCard) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.status(HTTP_STATUS_OK).send(deletedCard);
  } catch (err: any) {
    if (err.name === 'CastError') {
      throw new BadRequestError('Некорректные данные');
    } else {
      next(err);
    }
  }
};

export const likeCard = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const owner = req.user?._id;
  try {
    const updatedCard = await Card.findByIdAndUpdate(cardId, {
      $addToSet: { likes: owner },
    }, { new: true });
    if (!updatedCard) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.status(HTTP_STATUS_OK).send(updatedCard);
  } catch (err: any) {
    if (err.name === 'CastError') {
      throw new BadRequestError('Некорректные данные');
    } else {
      next(err);
    }
  }
};

export const dislikeCard = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const owner = req.user?._id;
  try {
    const updatedCard = await Card.findByIdAndUpdate(cardId, {
      $pull: { likes: owner as unknown as ObjectId },
    }, { new: true });
    if (!updatedCard) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.status(HTTP_STATUS_OK).send(updatedCard);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      throw new BadRequestError('Некорректные данные');
    } else {
      next(err);
    }
  }
};
